-- Roles & Permissions security tests. Everything runs inside one transaction
-- that is rolled back, so it leaves no data behind.
--   set -a && . ./.env.db.local && set +a
--   psql "$SUPABASE_DB_URL" -At -f supabase/tests/rbac_permissions_test.sql
-- Each line prints "PASS ..." or "FAIL ..."; expected refusals print
-- "PASS refused: <message>".

\set ON_ERROR_STOP 1
\set QUIET 1
BEGIN;

-- Run SQL as a given user; report whether it was refused.
CREATE FUNCTION pg_temp.as_user(_uid uuid, _sql text) RETURNS text LANGUAGE plpgsql AS $$
DECLARE _r text;
BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('sub', _uid, 'role', 'authenticated')::text, true);
  EXECUTE 'SET LOCAL ROLE authenticated';
  BEGIN
    EXECUTE _sql INTO _r;
    EXECUTE 'RESET ROLE';
    RETURN coalesce(_r, 'ok');
  EXCEPTION WHEN OTHERS THEN
    EXECUTE 'RESET ROLE';
    RETURN 'ERROR: ' || SQLERRM;
  END;
END $$;
CREATE FUNCTION pg_temp.expect(_label text, _got text, _want text) RETURNS text LANGUAGE sql AS $$
  SELECT CASE WHEN _got = _want THEN 'PASS ' ELSE 'FAIL ' END || _label || ' → ' || coalesce(_got, 'null');
$$;
CREATE FUNCTION pg_temp.refused(_label text, _got text) RETURNS text LANGUAGE sql AS $$
  SELECT CASE WHEN _got LIKE 'ERROR:%' THEN 'PASS refused: ' ELSE 'FAIL not refused: ' END || _label || ' → ' || _got;
$$;

-- ---- Setup (as the Super Admin) ------------------------------------------------
SELECT id AS super FROM auth.users WHERE email = 'admin@gcoman.com' \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"T1","full_name":"T Sales Lead","email":"t.lead@rbac.test","password":"Test1234x","department":"Sales","roles":[]}')::text $q$) AS lead_emp \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"T2","full_name":"T Sales Rep","email":"t.rep@rbac.test","password":"Test1234x","department":"Sales","phone":"+968 1111","roles":[]}')::text $q$) AS rep_emp \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"T3","full_name":"T Ops Staff","email":"t.ops@rbac.test","password":"Test1234x","department":"Operations","roles":[]}')::text $q$) AS ops_emp \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"T4","full_name":"T Settings Admin","email":"t.setadm@rbac.test","password":"Test1234x","roles":[]}')::text $q$) AS setadm_emp \gset
SELECT user_id AS lead FROM employees WHERE id = :'lead_emp' \gset
SELECT user_id AS rep FROM employees WHERE id = :'rep_emp' \gset
SELECT user_id AS ops FROM employees WHERE id = :'ops_emp' \gset
SELECT user_id AS setadm FROM employees WHERE id = :'setadm_emp' \gset

-- Role "T Sales Lead": employees + attendance view, department scope.
SELECT pg_temp.as_user(:'super', $q$ SELECT rbac_admin_save_role(NULL, 'T Sales Lead Role', 'test') $q$) AS lead_role \gset
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_save_role_access(%L, ARRAY['portal.employees.view','portal.attendance.view'], '{"employees":"department","attendance":"department"}')::text $q$, :'lead_role')) AS r) x;
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_user_roles(%L, ARRAY[%L])::text $q$, :'lead', :'lead_role')) AS r) x;
-- Role "T Settings Admin": may manage users & roles, plus employees + attendance view (all).
SELECT pg_temp.as_user(:'super', $q$ SELECT rbac_admin_save_role(NULL, 'T Settings Role', 'test') $q$) AS set_role \gset
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_save_role_access(%L, ARRAY['settings.users.view','settings.users.edit','settings.roles.view','settings.roles.edit','portal.employees.view','portal.attendance.view'], '{"employees":"all","attendance":"all"}')::text $q$, :'set_role')) AS r) x;
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_user_roles(%L, ARRAY[%L])::text $q$, :'setadm', :'set_role')) AS r) x;

-- ---- 1. Deny by default ------------------------------------------------------------
SELECT pg_temp.expect('plain employee cannot view contacts', pg_temp.as_user(:'rep', $q$ SELECT count(*)::text FROM contact_submissions $q$), '0');
SELECT pg_temp.refused('plain employee cannot list employees', pg_temp.as_user(:'rep', $q$ SELECT admin_list_employees()::text $q$));
SELECT pg_temp.expect('plain employee has no admin pages', pg_temp.as_user(:'rep', $q$ SELECT (rbac_my_access()->>'admin_pages') $q$), 'false');
SELECT pg_temp.expect('anonymous sees no employees', pg_temp.as_user(NULL, $q$ SELECT count(*)::text FROM employees $q$), '0');

-- ---- 2. Data scope (department) -------------------------------------------------------
SELECT pg_temp.expect('sales lead lists only Sales (2)', pg_temp.as_user(:'lead', $q$ SELECT jsonb_array_length(admin_list_employees())::text $q$), '2');
SELECT pg_temp.expect('sales lead table read: only Sales (2)', pg_temp.as_user(:'lead', $q$ SELECT count(*)::text FROM employees $q$), '2');
SELECT pg_temp.expect('sales lead attendance: only Sales employees (2)', pg_temp.as_user(:'lead', $q$ SELECT jsonb_array_length(att_admin_attendance(current_date, current_date)->'employees')::text $q$), '2');
SELECT pg_temp.refused('sales lead cannot edit (no permission)', pg_temp.as_user(:'lead', format($q$ SELECT admin_update_employee(%L, '{"employee_code":"T3","full_name":"x","roles":[]}')::text $q$, :'ops_emp')));
SELECT pg_temp.expect('settings admin (scope all) sees all 4+', pg_temp.as_user(:'setadm', $q$ SELECT (jsonb_array_length(admin_list_employees()) >= 4)::text $q$), 'true');

-- ---- 3. Field-level: personal details hidden without the permission -----------------
SELECT pg_temp.expect('phone hidden from sales lead', pg_temp.as_user(:'lead', format($q$ SELECT coalesce(e->>'phone','hidden') FROM jsonb_array_elements(admin_list_employees()) e WHERE e->>'id' = %L $q$, :'rep_emp')), 'hidden');
SELECT pg_temp.expect('phone visible to Super Admin', pg_temp.as_user(:'super', format($q$ SELECT e->>'phone' FROM jsonb_array_elements(admin_list_employees()) e WHERE e->>'id' = %L $q$, :'rep_emp')), '+968 1111');

-- ---- 4. Personal overrides: allow and explicit deny ---------------------------------------
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_user_overrides(%L, '[{"key":"website.contacts.view","effect":"allow"}]', '{}')::text $q$, :'rep')) AS r) x;
SELECT pg_temp.expect('allow override grants contacts view', pg_temp.as_user(:'rep', $q$ SELECT rbac_can('website.contacts.view')::text $q$), 'true');
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_user_overrides(%L, '[{"key":"portal.employees.view","effect":"deny"}]', '{}')::text $q$, :'lead')) AS r) x;
SELECT pg_temp.expect('deny override beats role permission', pg_temp.as_user(:'lead', $q$ SELECT rbac_can('portal.employees.view')::text $q$), 'false');
SELECT pg_temp.refused('denied user cannot call the function', pg_temp.as_user(:'lead', $q$ SELECT admin_list_employees()::text $q$));
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_user_overrides(%L, '[]', '{}')::text $q$, :'lead')) AS r) x;
SELECT pg_temp.expect('removing the override restores access', pg_temp.as_user(:'lead', $q$ SELECT rbac_can('portal.employees.view')::text $q$), 'true');

-- ---- 5. Revocation takes effect immediately (active session) --------------------------------
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_role_active(%L, false)::text $q$, :'lead_role')) AS r) x;
SELECT pg_temp.expect('inactive role gives nothing', pg_temp.as_user(:'lead', $q$ SELECT rbac_can('portal.attendance.view')::text $q$), 'false');
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_role_active(%L, true)::text $q$, :'lead_role')) AS r) x;

-- ---- 6. Privilege escalation ------------------------------------------------------------------
SELECT pg_temp.refused('non-super cannot grant Settings permissions', pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_save_role_access(%L, ARRAY['portal.employees.view','settings.roles.edit'], '{}')::text $q$, :'lead_role')));
SELECT pg_temp.refused('non-super cannot grant what they lack', pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_save_role_access(%L, ARRAY['portal.employees.view','website.contacts.delete'], '{}')::text $q$, :'lead_role')));
SELECT pg_temp.refused('cannot change own role', pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_save_role_access(%L, ARRAY['settings.users.view'], '{}')::text $q$, :'set_role')));
SELECT pg_temp.refused('cannot change own roles', pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_set_user_roles(%L, ARRAY[]::text[])::text $q$, :'setadm')));
SELECT pg_temp.refused('cannot give self personal permissions', pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_set_user_overrides(%L, '[{"key":"website.contacts.view","effect":"allow"}]', '{}')::text $q$, :'setadm')));
SELECT pg_temp.refused('non-super cannot hand out a Settings role', pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_set_user_roles(%L, ARRAY[%L])::text $q$, :'rep', :'set_role')));
SELECT pg_temp.refused('non-super cannot make a Super Admin', pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_set_super_admin(%L, true)::text $q$, :'rep')));
SELECT pg_temp.refused('non-super cannot allow a permission they lack', pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_set_user_overrides(%L, '[{"key":"website.contacts.delete","effect":"allow"}]', '{}')::text $q$, :'rep')));
SELECT pg_temp.expect('non-super CAN give a role within their own permissions', (SELECT CASE WHEN r LIKE 'ERROR:%' THEN r ELSE 'ok' END FROM (SELECT pg_temp.as_user(:'setadm', format($q$ SELECT rbac_admin_set_user_roles(%L, ARRAY[%L])::text $q$, :'ops', :'lead_role')) AS r) x), 'ok');
SELECT pg_temp.refused('Super Admin role cannot be edited', pg_temp.as_user(:'super', $q$ SELECT rbac_admin_save_role_access('super_admin', ARRAY[]::text[], '{}')::text $q$));
SELECT pg_temp.refused('last Super Admin cannot remove themselves', pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_super_admin(%L, false)::text $q$, :'super')));
SELECT pg_temp.refused('built-in role cannot be deleted', pg_temp.as_user(:'super', $q$ SELECT rbac_admin_delete_role('employee')::text $q$));
SELECT pg_temp.refused('built-in role cannot be deactivated', pg_temp.as_user(:'super', $q$ SELECT rbac_admin_set_role_active('proposal_engineer', false)::text $q$));

-- ---- 7. Delete a role that is in use: reassignment required ------------------------------------
SELECT pg_temp.refused('delete in-use role without reassignment', pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_delete_role(%L)::text $q$, :'lead_role')));
SELECT pg_temp.as_user(:'super', $q$ SELECT rbac_admin_save_role(NULL, 'T Copy Role', 'test') $q$) AS copy_role \gset
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_save_role_access(%L, ARRAY['portal.employees.view','portal.attendance.view'], '{"employees":"department","attendance":"department"}')::text $q$, :'copy_role')) AS r) x;
SELECT pg_temp.expect('delete with reassignment moves 2 people', pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_delete_role(%L, %L)::text $q$, :'lead_role', :'copy_role')), '2');
SELECT pg_temp.expect('moved person keeps department access', pg_temp.as_user(:'lead', $q$ SELECT rbac_can('portal.employees.view')::text $q$), 'true');

-- ---- 8. Website data via permissions; field guard on HR notes ---------------------------------
INSERT INTO job_applications (name, email, phone, position, experience, cover_letter, resume_path, status) VALUES ('T Applicant', 't.app@rbac.test', '+968 0000', 'Tester', '1', 'test', 'none.pdf', 'new') RETURNING id AS app \gset
SELECT CASE WHEN r LIKE 'ERROR:%' THEN 'FAIL setup: ' || r END FROM (SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_user_overrides(%L, '[{"key":"website.jobs.view","effect":"allow"},{"key":"website.jobs.edit","effect":"allow"}]', '{}')::text $q$, :'ops')) AS r) x;
SELECT pg_temp.expect('jobs editor can change status', pg_temp.as_user(:'ops', format($q$ WITH u AS (UPDATE job_applications SET status = 'reviewed' WHERE id = %L RETURNING 1) SELECT count(*)::text FROM u $q$, :'app')), '1');
SELECT pg_temp.refused('jobs editor without notes permission cannot change HR notes', pg_temp.as_user(:'ops', format($q$ WITH u AS (UPDATE job_applications SET hr_notes = 'x' WHERE id = %L RETURNING 1) SELECT count(*)::text FROM u $q$, :'app')));
SELECT pg_temp.expect('rep (contacts only) sees no applications', pg_temp.as_user(:'rep', $q$ SELECT count(*)::text FROM job_applications $q$), '0');
SELECT pg_temp.expect('Super Admin still sees applications', pg_temp.as_user(:'super', $q$ SELECT (count(*) > 0)::text FROM job_applications $q$), 'true');

-- ---- 9. Audit log ------------------------------------------------------------------------------------
SELECT pg_temp.expect('audit rows recorded with the actor', (SELECT (count(*) > 10)::text FROM rbac_audit_log WHERE actor = :'super' AND at > now() - interval '5 minutes'), 'true');
SELECT pg_temp.refused('audit log hidden from a non-viewer', pg_temp.as_user(:'lead', $q$ SELECT rbac_admin_audit()::text $q$));
SELECT pg_temp.expect('no secrets in audit values', (SELECT count(*)::text FROM rbac_audit_log WHERE (old_value::text || new_value::text) ~* 'password|token'), '0');

ROLLBACK;
