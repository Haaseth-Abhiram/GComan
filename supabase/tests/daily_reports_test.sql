-- Daily work report rules and security. Runs in one transaction that is rolled
-- back, so it leaves no data behind.
--   psql "$SUPABASE_DB_URL" -At -f supabase/tests/daily_reports_test.sql
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
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"R1","full_name":"R Manager","email":"r.mgr@rep.test","password":"Test1234x","department":"Sales","roles":[]}')::text $q$) AS mgr_emp \gset
SELECT pg_temp.as_user(:'super', format($q$ SELECT admin_create_employee('{"employee_code":"R2","full_name":"R Staff","email":"r.staff@rep.test","password":"Test1234x","department":"Sales","reporting_manager_id":"%s","roles":[]}')::text $q$, :'mgr_emp')) AS staff_emp \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"R3","full_name":"R Other","email":"r.other@rep.test","password":"Test1234x","department":"Operations","roles":[]}')::text $q$) AS other_emp \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"R4","full_name":"R Admin","email":"r.admin@rep.test","password":"Test1234x","roles":["admin"]}')::text $q$) AS adm_emp \gset
SELECT user_id AS mgr FROM employees WHERE id = :'mgr_emp' \gset
SELECT user_id AS staff FROM employees WHERE id = :'staff_emp' \gset
SELECT user_id AS other FROM employees WHERE id = :'other_emp' \gset
SELECT user_id AS adm FROM employees WHERE id = :'adm_emp' \gset
-- (_att_date is internal; ::text keeps the date as plain YYYY-MM-DD)
SELECT public._att_date(now())::text AS today \gset

-- ---- writing -------------------------------------------------------------------
SELECT pg_temp.refused('submit with nothing written', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L, '   ', '', true)::text $q$, :'today')));
SELECT pg_temp.refused('future date', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L::date + 1, 'x', '', false)::text $q$, :'today')));
SELECT pg_temp.refused('older than 7 days', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L::date - 8, 'x', '', false)::text $q$, :'today')));
SELECT pg_temp.refused('text too long', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L, repeat('a', 2001), '', false)::text $q$, :'today')));
SELECT pg_temp.expect('save a draft', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L, 'Draft text', '', false)->'report'->>'status' $q$, :'today')), 'draft');
SELECT pg_temp.expect('7 days back is allowed', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L::date - 7, 'Old day', '', false)->'report'->>'status' $q$, :'today')), 'draft');
SELECT pg_temp.expect('manager does not see drafts', pg_temp.as_user(:'mgr', $q$ SELECT jsonb_array_length(report_team())::text $q$), '0');
SELECT pg_temp.expect('submit goes to the manager', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L, 'Called five customers', 'Quote pending', true)->'report'->>'submitted_to' $q$, :'today')), 'R Manager');
SELECT pg_temp.refused('cannot change a submitted report', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L, 'changed', '', false)::text $q$, :'today')));
SELECT id AS rep FROM work_reports WHERE employee_id = :'staff_emp' AND report_date = :'today' \gset

-- ---- who sees and reviews --------------------------------------------------------
SELECT pg_temp.refused('no direct table read', pg_temp.as_user(:'other', $q$ SELECT count(*)::text FROM work_reports $q$));
SELECT pg_temp.refused('visitor cannot call', pg_temp.as_user(NULL, $q$ SELECT report_admin()::text $q$));
SELECT pg_temp.refused('plain employee: no team reports', pg_temp.as_user(:'other', $q$ SELECT report_team()::text $q$));
SELECT pg_temp.refused('plain employee: no admin list', pg_temp.as_user(:'other', $q$ SELECT report_admin()::text $q$));
SELECT pg_temp.refused('plain employee cannot review', pg_temp.as_user(:'other', format($q$ SELECT report_review(%L, 'reviewed', '')::text $q$, :'rep')));
SELECT pg_temp.refused('cannot review own report', pg_temp.as_user(:'staff', format($q$ SELECT report_review(%L, 'reviewed', '')::text $q$, :'rep')));
SELECT pg_temp.expect('manager sees it and may review', pg_temp.as_user(:'mgr', $q$ SELECT (report_team()->0->>'can_review') $q$), 'true');
SELECT pg_temp.refused('send back needs a comment', pg_temp.as_user(:'mgr', format($q$ SELECT report_review(%L, 'returned', ' ')::text $q$, :'rep')));
SELECT pg_temp.refused('unknown action', pg_temp.as_user(:'mgr', format($q$ SELECT report_review(%L, 'draft', '')::text $q$, :'rep')));
SELECT pg_temp.expect('manager sends it back', pg_temp.as_user(:'mgr', format($q$ SELECT report_review(%L, 'returned', 'Add the numbers')->>'status' $q$, :'rep')), 'returned');
SELECT pg_temp.expect('employee sees the comment', pg_temp.as_user(:'staff', format($q$ SELECT report_get(%L)->'report'->>'review_comment' $q$, :'today')), 'Add the numbers');
SELECT pg_temp.expect('resubmit', pg_temp.as_user(:'staff', format($q$ SELECT report_save(%L, 'Called five customers (3 orders)', '', true)->'report'->>'status' $q$, :'today')), 'submitted');
SELECT pg_temp.expect('Admin sees it waiting', pg_temp.as_user(:'adm', $q$ SELECT jsonb_array_length(report_admin()->'waiting')::text $q$), '1');
SELECT pg_temp.expect('Admin reviews it', pg_temp.as_user(:'adm', format($q$ SELECT report_review(%L, 'reviewed', '')->>'status' $q$, :'rep')), 'reviewed');
SELECT pg_temp.refused('already reviewed', pg_temp.as_user(:'mgr', format($q$ SELECT report_review(%L, 'reviewed', '')::text $q$, :'rep')));

-- no manager → the admin
SELECT pg_temp.expect('without a manager it goes to the admin', pg_temp.as_user(:'other', format($q$ SELECT coalesce(report_save(%L, 'Stock count', '', true)->'report'->>'submitted_to', 'admin') $q$, :'today')), 'admin');
-- an Admin cannot review their own
SELECT pg_temp.as_user(:'adm', format($q$ SELECT report_save(%L, 'Admin work', '', true)::text $q$, :'today'));
SELECT id AS adm_rep FROM work_reports WHERE employee_id = :'adm_emp' \gset
SELECT pg_temp.refused('Admin cannot review own report', pg_temp.as_user(:'adm', format($q$ SELECT report_review(%L, 'reviewed', '')::text $q$, :'adm_rep')));
SELECT pg_temp.expect('Super Admin can review it', pg_temp.as_user(:'super', format($q$ SELECT report_review(%L, 'reviewed', 'ok')->>'status' $q$, :'adm_rep')), 'reviewed');

-- ---- data scope ------------------------------------------------------------------
SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_user_overrides(%L, '[{"key":"portal.reports.view","effect":"allow"},{"key":"portal.reports.approve","effect":"allow"}]', '{"reports":"department"}')::text $q$, :'mgr'));
SELECT pg_temp.expect('department scope lists only Sales', pg_temp.as_user(:'mgr', $q$ SELECT jsonb_array_length(report_admin()->'rows')::text $q$), '2');
SELECT id AS other_rep FROM work_reports WHERE employee_id = :'other_emp' \gset
SELECT pg_temp.refused('cannot review outside the scope', pg_temp.as_user(:'mgr', format($q$ SELECT report_review(%L, 'reviewed', '')::text $q$, :'other_rep')));
-- a manager with no admin permission cannot review a report that has no manager
SELECT pg_temp.as_user(:'super', format($q$ SELECT rbac_admin_set_user_overrides(%L, '[]', '{}')::text $q$, :'mgr'));
SELECT pg_temp.refused('manager cannot review someone outside the team', pg_temp.as_user(:'mgr', format($q$ SELECT report_review(%L, 'reviewed', '')::text $q$, :'other_rep')));
SELECT pg_temp.expect('that report is still waiting', (SELECT status FROM work_reports WHERE id = :'other_rep'), 'submitted');

ROLLBACK;
