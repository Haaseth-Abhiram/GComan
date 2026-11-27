-- Automatic notifications and reminders. Runs in a transaction that is rolled back.
-- psql "$SUPABASE_DB_URL" -At -f supabase/tests/reminders_test.sql
\set ON_ERROR_STOP on
BEGIN;

CREATE FUNCTION pg_temp.as_user(_uid uuid, _sql text) RETURNS text LANGUAGE plpgsql AS $$
DECLARE _r text;
BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('sub', _uid, 'role', 'authenticated')::text, true);
  SET LOCAL ROLE authenticated;
  BEGIN
    EXECUTE _sql INTO _r;
  EXCEPTION WHEN OTHERS THEN
    _r := 'ERROR: ' || SQLERRM;
  END;
  RESET ROLE;
  PERFORM set_config('request.jwt.claims', '', true);
  RETURN _r;
END $$;
CREATE FUNCTION pg_temp.expect(_name text, _got text, _want text) RETURNS text LANGUAGE sql AS
  $$ SELECT CASE WHEN _got IS NOT DISTINCT FROM _want THEN 'PASS ' || _name ELSE 'FAIL ' || _name || ': got ' || coalesce(_got, 'null') || ', want ' || _want END $$;
CREATE FUNCTION pg_temp.refused(_name text, _got text) RETURNS text LANGUAGE sql AS
  $$ SELECT CASE WHEN _got LIKE 'ERROR:%' THEN 'PASS ' || _name ELSE 'FAIL ' || _name || ': was allowed, got ' || coalesce(_got, 'null') END $$;
-- how many notifications with this title a person has
CREATE FUNCTION pg_temp.got(_emp uuid, _title text) RETURNS text LANGUAGE sql AS
  $$ SELECT count(*)::text FROM public.notifications WHERE employee_id = _emp AND title LIKE _title $$;

SELECT user_id AS super FROM public.user_roles WHERE role = 'admin' LIMIT 1 \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"REM1","full_name":"Mina Manager","email":"rem1@test.local","password":"Test1234x","roles":[]}')::text $q$) AS mgr_emp \gset
SELECT pg_temp.as_user(:'super', format($q$ SELECT admin_create_employee('{"employee_code":"REM2","full_name":"Omar Staff","email":"rem2@test.local","password":"Test1234x","roles":[],"reporting_manager_id":"%s"}')::text $q$, :'mgr_emp')) AS staff_emp \gset
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"REM3","full_name":"Lina Leave","email":"rem3@test.local","password":"Test1234x","roles":[]}')::text $q$) AS leave_emp \gset
SELECT user_id AS staff FROM public.employees WHERE id = :'staff_emp' \gset
SELECT user_id AS mgr FROM public.employees WHERE id = :'mgr_emp' \gset

-- welcome and reporting manager
SELECT pg_temp.expect('new employee is welcomed', pg_temp.got(:'staff_emp', 'Welcome to%'), '1');
SELECT pg_temp.expect('employee is told the manager', pg_temp.got(:'staff_emp', 'Your reporting manager was updated'), '1');
SELECT pg_temp.expect('manager is told about the new report', pg_temp.got(:'mgr_emp', 'Omar Staff now reports to you'), '1');
SELECT pg_temp.as_user(:'super', format($q$ SELECT admin_update_employee(%L, '{"employee_code":"REM3","full_name":"Lina Leave","phone":"","department":"","designation":"","joined_on":"","roles":[],"reporting_manager_id":"%s","proposal_access":false,"proposal_code":""}')::text $q$, :'leave_emp', :'mgr_emp'));
SELECT pg_temp.expect('a manager change is announced', pg_temp.got(:'leave_emp', 'Your reporting manager was updated'), '1');
UPDATE public.employees SET reporting_manager_id = reporting_manager_id WHERE id = :'leave_emp';
SELECT pg_temp.expect('saving without a change says nothing', pg_temp.got(:'leave_emp', 'Your reporting manager was updated'), '1');

-- today is a working day, Lina is on leave
UPDATE public.attendance_settings SET weekly_off = '{}', auto_punch_out = '23:59';
SELECT public._att_date(now())::text AS today \gset
INSERT INTO public.leave_requests (employee_id, leave_type_id, start_date, end_date, half_day, days, reason, status)
SELECT :'leave_emp', id, :'today', :'today', false, 1, 'Away', 'approved' FROM public.leave_types WHERE code = 'CL';

-- permissions
SELECT pg_temp.refused('employee cannot read reminder settings', pg_temp.as_user(:'staff', $q$ SELECT reminders_admin()::text $q$));
SELECT pg_temp.refused('employee cannot change reminders', pg_temp.as_user(:'staff', $q$ SELECT reminders_admin_save('punch_in', false, '10:00', '{1}')::text $q$));
SELECT pg_temp.refused('employee cannot send a reminder', pg_temp.as_user(:'staff', $q$ SELECT reminders_admin_send_now('punch_in')::text $q$));
SELECT pg_temp.refused('employee cannot run the timer directly', pg_temp.as_user(:'staff', $q$ SELECT reminders_run_due()::text $q$));
SELECT pg_temp.refused('employee cannot write notifications', pg_temp.as_user(:'staff', format($q$ SELECT _notify_system(%L, 'message', 'x', 'y', '/portal')::text $q$, :'mgr_emp')));

-- punch-in reminder
SELECT pg_temp.as_user(:'super', $q$ SELECT reminders_admin_send_now('punch_in')::text $q$);
SELECT pg_temp.expect('not punched in is reminded', pg_temp.got(:'staff_emp', 'You have not punched in today'), '1');
SELECT pg_temp.expect('on leave is not reminded', pg_temp.got(:'leave_emp', 'You have not punched in today'), '0');
SELECT pg_temp.expect('never twice a day', pg_temp.as_user(:'super', $q$ SELECT reminders_admin_send_now('punch_in')::text $q$), '0');
SELECT pg_temp.expect('the employee sees it', pg_temp.as_user(:'staff', $q$ SELECT count(*)::text FROM jsonb_array_elements(notif_mine()->'items') i WHERE i->>'title' = 'You have not punched in today' $q$), '1');

-- punching in (late: the office "late after" is set to midnight)
UPDATE public.attendance_settings SET late_after = '00:00';
SELECT pg_temp.as_user(:'super', $q$ SELECT admin_create_employee('{"employee_code":"REM4","full_name":"Adel Admin","email":"rem4@test.local","password":"Test1234x","roles":["admin"]}')::text $q$) AS adm_emp \gset
SELECT pg_temp.as_user(:'staff', $q$ SELECT att_punch_in()->>'id' $q$);
SELECT pg_temp.expect('punching in notifies the employee', pg_temp.got(:'staff_emp', 'You punched in at %'), '1');
SELECT pg_temp.expect('and says it is late', (SELECT (body LIKE 'Marked late%')::text FROM public.notifications WHERE employee_id = :'staff_emp' AND title LIKE 'You punched in at %'), 'true');
SELECT pg_temp.expect('the manager hears about the late punch', pg_temp.got(:'mgr_emp', 'Omar Staff punched in late at %'), '1');
SELECT pg_temp.expect('so does an Admin', pg_temp.got(:'adm_emp', 'Omar Staff punched in late at %'), '1');
SELECT pg_temp.expect('others do not', pg_temp.got(:'leave_emp', '%punched in late%'), '0');
SELECT pg_temp.as_user(:'staff', $q$ SELECT att_punch_out()->>'id' $q$);
SELECT pg_temp.as_user(:'staff', $q$ SELECT att_punch_in()->>'id' $q$);
SELECT pg_temp.expect('a second punch in is confirmed', pg_temp.got(:'staff_emp', 'You punched in at %'), '2');
SELECT pg_temp.expect('but is not late again', pg_temp.got(:'mgr_emp', 'Omar Staff punched in late at %'), '1');
INSERT INTO public.attendance_sessions (employee_id, work_date, punch_in_at, punch_out_at, corrected_at)
VALUES (:'mgr_emp', (:'today')::date - 3, now() - interval '3 days', now() - interval '3 days' + interval '8 hours', now());
SELECT pg_temp.expect('an approved correction is not announced as a punch', pg_temp.got(:'mgr_emp', 'You punched in at %'), '0');
UPDATE public.attendance_settings SET late_after = '10:00';
-- keep one open session for the checks below
DELETE FROM public.attendance_sessions WHERE employee_id = :'staff_emp' AND punch_out_at IS NOT NULL;

-- still punched in, report
SELECT pg_temp.as_user(:'super', $q$ SELECT reminders_admin_send_now('punch_out')::text $q$);
SELECT pg_temp.expect('still punched in is reminded', pg_temp.got(:'staff_emp', 'You are still punched in'), '1');
SELECT pg_temp.expect('not punched in gets no punch-out reminder', pg_temp.got(:'mgr_emp', 'You are still punched in'), '0');
SELECT pg_temp.as_user(:'super', $q$ SELECT reminders_admin_send_now('report')::text $q$);
SELECT pg_temp.expect('worked without a report is reminded', pg_temp.got(:'staff_emp', 'Submit your daily work report'), '1');
SELECT pg_temp.expect('did not work, no report reminder', pg_temp.got(:'mgr_emp', 'Submit your daily work report'), '0');

-- deadline
INSERT INTO public.projects (code, name, status) VALUES ('REM-P', 'Reminder project', 'in_progress');
INSERT INTO public.project_tasks (project_id, title, assignee_id, due_date)
SELECT id, 'Late thing', :'staff_emp', (:'today')::date - 2 FROM public.projects WHERE code = 'REM-P';
INSERT INTO public.project_tasks (project_id, title, assignee_id, due_date)
SELECT id, 'Soon thing', :'mgr_emp', (:'today')::date + 1 FROM public.projects WHERE code = 'REM-P';
INSERT INTO public.project_tasks (project_id, title, assignee_id, due_date)
SELECT id, 'Far thing', :'leave_emp', (:'today')::date + 9 FROM public.projects WHERE code = 'REM-P';
SELECT pg_temp.as_user(:'super', $q$ SELECT reminders_admin_send_now('deadline')::text $q$);
SELECT pg_temp.expect('late task reminder', pg_temp.got(:'staff_emp', 'You have 1 late task'), '1');
SELECT pg_temp.expect('due soon reminder', pg_temp.got(:'mgr_emp', 'A task is due soon'), '1');
SELECT pg_temp.expect('far deadline is quiet', pg_temp.got(:'leave_emp', '%due soon'), '0');

-- missed punch out: yesterday's session left open
UPDATE public.attendance_settings SET auto_punch_out = '20:00';
UPDATE public.attendance_sessions SET work_date = (:'today')::date - 1, punch_in_at = public._att_at((:'today')::date - 1, '09:50') WHERE employee_id = :'staff_emp';
SELECT pg_temp.as_user(:'staff', $q$ SELECT att_me()->>'today' $q$);
SELECT pg_temp.expect('missed punch-out is announced (even when their own page closed it)', pg_temp.got(:'staff_emp', 'You missed punching out'), '1');
SELECT pg_temp.expect('with the time', (SELECT (body LIKE '%at 8:00 PM.%')::text FROM public.notifications WHERE employee_id = :'staff_emp' AND title = 'You missed punching out'), 'true');

-- the schedule
DELETE FROM public.notifications WHERE dedupe_key LIKE 'punch_in:%';
UPDATE public.reminder_settings SET enabled = (kind = 'punch_in'), send_at = '00:00', days = '{1,2,3,4,5,6,7}', last_run = NULL;
SELECT pg_temp.as_user(:'mgr', $q$ SELECT 'ok' || coalesce(notif_tick()::text, '') $q$);
SELECT pg_temp.expect('using the portal sends what is due', pg_temp.got(:'mgr_emp', 'You have not punched in today'), '1');
DELETE FROM public.notifications WHERE dedupe_key LIKE 'punch_in:%';
SELECT pg_temp.expect('once a day', public.reminders_run_due()::text, '0');
UPDATE public.reminder_settings SET last_run = NULL, enabled = false;
SELECT pg_temp.expect('a reminder switched off stays quiet', public.reminders_run_due()::text, '0');
UPDATE public.reminder_settings SET enabled = true WHERE kind = 'punch_in';
UPDATE public.reminder_settings SET days = ARRAY[(extract(isodow FROM (:'today')::date)::int % 7 + 1)::smallint] WHERE kind = 'punch_in';
SELECT pg_temp.expect('not on a day that is switched off', public.reminders_run_due()::text, '0');
SELECT pg_temp.expect('admin saves a time and days', pg_temp.as_user(:'super', $q$ SELECT i->>'send_at' || ' ' || (i->>'days') FROM jsonb_array_elements(reminders_admin_save('punch_in', true, '10:30', '{3,1,3}')->'items') i WHERE i->>'kind' = 'punch_in' $q$), '10:30 [1, 3]');
SELECT pg_temp.refused('no days is refused', pg_temp.as_user(:'super', $q$ SELECT reminders_admin_save('punch_in', true, '10:30', '{}')::text $q$));
SELECT pg_temp.refused('unknown reminder is refused', pg_temp.as_user(:'super', $q$ SELECT reminders_admin_send_now('lunch')::text $q$));

ROLLBACK;
