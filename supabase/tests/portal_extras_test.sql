-- Notifications, projects, profile and documents: rules and security. Runs in
-- one transaction that is rolled back, so it leaves no data behind.
--   psql "$SUPABASE_DB_URL" -At -f supabase/tests/portal_extras_test.sql
-- Each line prints "PASS ..." or "FAIL ...".

\set ON_ERROR_STOP 1
\set QUIET 1
BEGIN;

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

SELECT id AS super FROM auth.users WHERE email = 'admin@gcoman.com' \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"R1","full_name":"R Manager","email":"r.mgr@px.test","password":"Test1234x","department":"Sales","roles":[]}')::text $q$) AS mgr_emp \gset
SELECT pg_temp.as_user(:'super', format($q$ SELECT admin_create_employee('{"employee_code":"R2","full_name":"R Staff","email":"r.staff@px.test","password":"Test1234x","department":"Sales","reporting_manager_id":"%s","roles":[]}')::text $q$, :'mgr_emp')) AS staff_emp \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"R3","full_name":"R Other","email":"r.other@px.test","password":"Test1234x","department":"Operations","roles":[]}')::text $q$) AS other_emp \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"R4","full_name":"R Admin","email":"r.admin@px.test","password":"Test1234x","roles":["admin"]}')::text $q$) AS adm_emp \gset
SELECT user_id AS mgr FROM employees WHERE id = :'mgr_emp' \gset
SELECT user_id AS staff FROM employees WHERE id = :'staff_emp' \gset
SELECT user_id AS other FROM employees WHERE id = :'other_emp' \gset
SELECT user_id AS adm FROM employees WHERE id = :'adm_emp' \gset
-- (_att_date is internal; ::text keeps the date as plain YYYY-MM-DD)
SELECT public._att_date(now())::text AS today \gset

-- Start without the automatic welcome messages (20261127160000_reminders.sql).
DELETE FROM public.notifications;

-- ---- notifications and messages -------------------------------------------------
SELECT pg_temp.expect('employee messages a colleague', pg_temp.as_user(:'other', format($q$ SELECT notif_send('people', ARRAY[%L]::uuid[], 'Lunch?', '', 'normal')::text $q$, :'adm_emp')), '1');
SELECT pg_temp.expect('sent list names the recipient', pg_temp.as_user(:'other', $q$ SELECT notif_options()->'sent'->0->'to'->>0 $q$), 'R Admin');
SELECT pg_temp.refused('employee cannot message everyone', pg_temp.as_user(:'staff', $q$ SELECT notif_send('all', NULL, 'Hi', '', 'normal')::text $q$));
SELECT pg_temp.refused('employee has no team to message', pg_temp.as_user(:'staff', $q$ SELECT notif_send('team', NULL, 'Hi', '', 'normal')::text $q$));
SELECT pg_temp.refused('visitor cannot read', pg_temp.as_user(NULL, $q$ SELECT notif_mine()::text $q$));
SELECT pg_temp.refused('no direct table read', pg_temp.as_user(:'staff', $q$ SELECT count(*)::text FROM notifications $q$));
SELECT pg_temp.refused('manager cannot message everyone', pg_temp.as_user(:'mgr', $q$ SELECT notif_send('all', NULL, 'Hi', '', 'normal')::text $q$));
SELECT pg_temp.expect('manager messages the team', pg_temp.as_user(:'mgr', $q$ SELECT notif_send('team', NULL, 'Stand-up at 10', 'Be on time', 'urgent')::text $q$), '1');
SELECT pg_temp.refused('empty subject', pg_temp.as_user(:'mgr', $q$ SELECT notif_send('team', NULL, '  ', '', 'normal')::text $q$));
SELECT pg_temp.expect('employee sees it as urgent', pg_temp.as_user(:'staff', $q$ SELECT (notif_mine()->'urgent'->0->>'title') $q$), 'Stand-up at 10');
SELECT pg_temp.expect('others do not', pg_temp.as_user(:'other', $q$ SELECT count(*)::text FROM jsonb_array_elements(notif_mine()->'items') i WHERE i->>'title' = 'Stand-up at 10' $q$), '0');
SELECT (pg_temp.as_user(:'staff', $q$ SELECT notif_mine()->'items'->0->>'id' $q$)) AS note \gset
SELECT pg_temp.as_user(:'other', format($q$ SELECT notif_read(ARRAY[%L]::uuid[])::text $q$, :'note'));
SELECT pg_temp.expect('someone else cannot mark it read', pg_temp.as_user(:'staff', $q$ SELECT (notif_mine()->>'unread') $q$), '1');
SELECT pg_temp.as_user(:'staff', $q$ SELECT notif_read(NULL)::text $q$);
SELECT pg_temp.expect('mark all read', pg_temp.as_user(:'staff', $q$ SELECT (notif_mine()->>'unread') $q$), '0');
SELECT pg_temp.expect('sender sees it was read', pg_temp.as_user(:'mgr', $q$ SELECT (notif_options()->'sent'->0->>'read') $q$), '1');
SELECT pg_temp.expect('Admin messages everyone', pg_temp.as_user(:'adm', $q$ SELECT (notif_send('all', NULL, 'Holiday', '', 'normal') >= 3)::text $q$), 'true');
SELECT pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L, 'Work', '', true)::text $q$, :'today'));
SELECT pg_temp.expect('submitting a report tells the manager', pg_temp.as_user(:'mgr', $q$ SELECT count(*)::text FROM jsonb_array_elements(notif_mine()->'items') i WHERE i->>'kind' = 'report' $q$), '1');
SELECT pg_temp.as_user(:'staff', format($q$ SELECT leave_apply((SELECT (b->>'id')::uuid FROM jsonb_array_elements(leave_overview()->'balances') b LIMIT 1), %L::date + 14, %L::date + 16, false, 'Trip')::text $q$, :'today', :'today'));
SELECT pg_temp.expect('applying for leave tells the manager', pg_temp.as_user(:'mgr', $q$ SELECT count(*)::text FROM jsonb_array_elements(notif_mine()->'items') i WHERE i->>'kind' = 'leave' $q$), '1');

-- ---- projects --------------------------------------------------------------------
SELECT pg_temp.refused('employee cannot create a project', pg_temp.as_user(:'staff', $q$ SELECT proj_admin_save(NULL, '{"code":"P-1","name":"x"}')::text $q$));
SELECT pg_temp.as_user(:'adm', format($q$ SELECT proj_admin_save(NULL, '{"code":"p-1","name":"Plant upgrade","status":"in_progress","manager_id":"%s","members":["%s"]}')::text $q$, :'mgr_emp', :'staff_emp')) AS prj \gset
SELECT pg_temp.expect('manager is added to the team', (SELECT count(*)::text FROM project_members WHERE project_id = :'prj'), '2');
SELECT pg_temp.refused('duplicate code', pg_temp.as_user(:'adm', $q$ SELECT proj_admin_save(NULL, '{"code":"P-1","name":"y"}')::text $q$));
SELECT pg_temp.expect('member sees the project', pg_temp.as_user(:'staff', $q$ SELECT jsonb_array_length(proj_mine()->'projects')::text $q$), '1');
SELECT pg_temp.expect('member is told', pg_temp.as_user(:'staff', $q$ SELECT count(*)::text FROM jsonb_array_elements(notif_mine()->'items') i WHERE i->>'kind' = 'project' $q$), '1');
SELECT pg_temp.refused('non-member cannot open it', pg_temp.as_user(:'other', format($q$ SELECT proj_get(%L)::text $q$, :'prj')));
SELECT pg_temp.refused('non-member cannot add a task', pg_temp.as_user(:'other', format($q$ SELECT proj_add_task(%L, '{"title":"x"}')::text $q$, :'prj')));
SELECT pg_temp.refused('assignee must be on the team', pg_temp.as_user(:'staff', format($q$ SELECT proj_add_task(%L, '{"title":"x","assignee_id":"%s"}')::text $q$, :'prj', :'other_emp')));
SELECT pg_temp.as_user(:'adm', format($q$ SELECT proj_add_task(%L, '{"title":"Order pumps","assignee_id":"%s","due_date":"2020-01-01","priority":"high"}')::text $q$, :'prj', :'staff_emp'));
SELECT id AS task FROM project_tasks WHERE project_id = :'prj' \gset
SELECT pg_temp.expect('my open tasks', pg_temp.as_user(:'staff', $q$ SELECT (proj_mine()->'tasks'->0->>'overdue') $q$), 'true');
SELECT pg_temp.refused('non-member cannot change a task', pg_temp.as_user(:'other', format($q$ SELECT proj_set_task_status(%L, 'done')::text $q$, :'task')));
SELECT pg_temp.refused('late task needs a reason', pg_temp.as_user(:'staff', format($q$ SELECT proj_set_task_status(%L, 'done')::text $q$, :'task')));
SELECT pg_temp.expect('done with a reason', pg_temp.as_user(:'staff', format($q$ SELECT proj_set_task_status(%L, 'done', 'Supplier delay')->'tasks'->0->>'status' $q$, :'task')), 'done');
SELECT pg_temp.expect('member posts an update', pg_temp.as_user(:'staff', format($q$ SELECT jsonb_array_length(proj_post_update(%L, 'Pumps ordered')->'updates')::text $q$, :'prj')), '1');
SELECT pg_temp.refused('member cannot delete the project', pg_temp.as_user(:'staff', format($q$ SELECT proj_admin_delete(%L)::text $q$, :'prj')));
SELECT pg_temp.refused('member cannot delete a task', pg_temp.as_user(:'staff', format($q$ SELECT proj_admin_delete_task(%L)::text $q$, :'task')));
-- daily report project entries
SELECT pg_temp.refused('report on a project you are not on', pg_temp.as_user(:'other', format($q$ SELECT report_save(%L, '', '', false, '[{"project_id":"%s","work":"x","hours":1}]')::text $q$, :'today', :'prj')));
SELECT pg_temp.refused('more than 24 hours', pg_temp.as_user(:'mgr', format($q$ SELECT report_save(%L, '', '', false, '[{"project_id":"%s","work":"x","hours":25}]')::text $q$, :'today', :'prj')));
SELECT pg_temp.refused('project entry without text', pg_temp.as_user(:'mgr', format($q$ SELECT report_save(%L, '', '', false, '[{"project_id":"%s","work":" ","hours":1}]')::text $q$, :'today', :'prj')));
SELECT pg_temp.expect('submit with only a project entry', pg_temp.as_user(:'mgr', format($q$ SELECT report_save(%L, '', '', true, '[{"project_id":"%s","work":"Reviewed drawings","hours":2.5}]')->'report'->'items'->0->>'hours' $q$, :'today', :'prj')), '2.50');

-- ---- profile and documents ---------------------------------------------------------
SELECT pg_temp.refused('contacts: at least one', pg_temp.as_user(:'staff', $q$ SELECT profile_save_contacts('[]')::text $q$));
SELECT pg_temp.refused('bad phone', pg_temp.as_user(:'staff', $q$ SELECT profile_save('{"phone":"abc"}')::text $q$));
SELECT pg_temp.expect('save personal details', pg_temp.as_user(:'staff', $q$ SELECT profile_save('{"blood_group":"O+","phone":"+968 9000 0000","date_of_birth":"1995-05-05"}')->'personal'->>'blood_group' $q$), 'O+');
SELECT pg_temp.expect('save a contact', pg_temp.as_user(:'staff', $q$ SELECT profile_save_contacts('[{"name":"A","relationship":"Brother","phone":"+968 9111 1111"}]')->'contacts'->0->>'name' $q$), 'A');
SELECT pg_temp.refused('manager cannot read personal details', pg_temp.as_user(:'mgr', format($q$ SELECT profile_get(%L)::text $q$, :'staff_emp')));
SELECT pg_temp.expect('Admin reads them', pg_temp.as_user(:'adm', format($q$ SELECT profile_get(%L)->'personal'->>'blood_group' $q$, :'staff_emp')), 'O+');
SELECT :'staff_emp' || '/cv.pdf' AS mine \gset
SELECT :'staff_emp' || '/cert.pdf' AS cert \gset
SELECT pg_temp.refused('cannot upload into another folder', pg_temp.as_user(:'other', format($q$ INSERT INTO storage.objects (bucket_id, name) VALUES ('employee-documents', %L) RETURNING name $q$, :'mine')));
SELECT pg_temp.expect('upload own file', pg_temp.as_user(:'staff', format($q$ INSERT INTO storage.objects (bucket_id, name) VALUES ('employee-documents', %L) RETURNING 'ok' $q$, :'mine')), 'ok');
SELECT pg_temp.refused('register a file that was not uploaded', pg_temp.as_user(:'staff', format($q$ SELECT doc_add(%L, 'other', '', %L, 'x.pdf', 10)::text $q$, :'staff_emp', :'cert')));
SELECT pg_temp.as_user(:'staff', format($q$ SELECT doc_add(%L, 'id_proof', 'My ID', %L, 'cv.pdf', 10)::text $q$, :'staff_emp', :'mine')) AS doc \gset
SELECT pg_temp.expect('others cannot see the file', pg_temp.as_user(:'other', $q$ SELECT count(*)::text FROM storage.objects WHERE bucket_id = 'employee-documents' $q$), '0');
SELECT pg_temp.expect('manager cannot see the file', pg_temp.as_user(:'mgr', $q$ SELECT count(*)::text FROM storage.objects WHERE bucket_id = 'employee-documents' $q$), '0');
SELECT pg_temp.refused('others cannot delete the record', pg_temp.as_user(:'other', format($q$ SELECT doc_delete(%L) $q$, :'doc')));
SELECT pg_temp.as_user(:'adm', format($q$ INSERT INTO storage.objects (bucket_id, name) VALUES ('employee-documents', %L) RETURNING 'ok' $q$, :'cert'));
SELECT pg_temp.as_user(:'adm', format($q$ SELECT doc_add(%L, 'certificate', 'Certificate', %L, 'cert.pdf', 10)::text $q$, :'staff_emp', :'cert')) AS company \gset
SELECT pg_temp.refused('employee cannot delete a company document', pg_temp.as_user(:'staff', format($q$ SELECT doc_delete(%L) $q$, :'company')));
SELECT pg_temp.expect('employee cannot remove its file either', pg_temp.as_user(:'staff', format($q$ WITH d AS (DELETE FROM storage.objects WHERE name = %L RETURNING 1) SELECT count(*)::text FROM d $q$, :'cert')), '0');
SELECT pg_temp.expect('employee deletes own document', pg_temp.as_user(:'staff', format($q$ SELECT doc_delete(%L) $q$, :'doc')), :'mine');
SELECT pg_temp.expect('then its file can be removed', pg_temp.as_user(:'staff', format($q$ WITH d AS (DELETE FROM storage.objects WHERE name = %L RETURNING 1) SELECT count(*)::text FROM d $q$, :'mine')), '1');

-- work details and calendar start
SELECT pg_temp.refused('employee cannot set work details', pg_temp.as_user(:'staff', format($q$ SELECT admin_set_work_details(%L, 'intern', 'x')::text $q$, :'staff_emp')));
SELECT pg_temp.as_user(:'adm', format($q$ SELECT admin_set_work_details(%L, 'intern', 'Sohar')::text $q$, :'staff_emp'));
SELECT pg_temp.expect('profile shows work details', pg_temp.as_user(:'staff', $q$ SELECT (profile_get()->'work'->>'employment_type') || ' ' || (profile_get()->'work'->>'work_location') || ' ' || (profile_get()->'work'->>'manager') $q$), 'intern Sohar R Manager');
SELECT pg_temp.expect('calendar start date', pg_temp.as_user(:'staff', $q$ SELECT att_my_since()::text $q$), :'today');

-- half day: first or second half
SELECT ((date_trunc('week', current_date) + interval '21 days')::date)::text AS half_date \gset
SELECT id AS casual FROM public.leave_types WHERE code = 'CL' \gset
SELECT pg_temp.refused('unknown half is refused', pg_temp.as_user(:'staff', format($q$ SELECT leave_apply(%L, %L, %L, true, 'x', 'noon')::text $q$, :'casual', :'half_date', :'half_date')));
SELECT pg_temp.expect('second half is saved', pg_temp.as_user(:'staff', format($q$ SELECT leave_apply(%L, %L, %L, true, 'Bank', 'second')->>'half_session' $q$, :'casual', :'half_date', :'half_date')), 'second');
SELECT ((date_trunc('week', current_date) + interval '22 days')::date)::text AS full_date \gset
SELECT pg_temp.expect('a full day keeps no half', pg_temp.as_user(:'staff', format($q$ SELECT coalesce(leave_apply(%L, %L, %L, false, 'Trip', 'first')->>'half_session', 'none') $q$, :'casual', :'full_date', :'full_date')), 'none');
SELECT pg_temp.expect('the old five-argument call still works', pg_temp.as_user(:'other', format($q$ SELECT leave_apply(%L, %L, %L, false, 'Old screen')->>'status' IS NOT NULL $q$, :'casual', :'full_date', :'full_date')), 'true');
SELECT pg_temp.expect('overview offers the halves', pg_temp.as_user(:'staff', $q$ SELECT leave_overview()->>'half_sessions' $q$), 'true');

ROLLBACK;
