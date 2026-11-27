-- Paste this whole file into the Supabase SQL editor and Run (after APPLY_ALL_2026-11-27.sql).
-- It is 20261127150000 (leave: first / second half) and 20261127160000 (automatic
-- notifications and reminders) as ONE transaction. Safe to run more than once.
-- Every "ok" in the result should be true. "Timer" false only means reminders are
-- sent while someone is using the portal (pg_cron is not available).

BEGIN;

-- ===================== 20261127150000_leave_half_day_session.sql =====================

ALTER TABLE public.leave_requests
  ADD COLUMN IF NOT EXISTS half_session text CHECK (half_session IS NULL OR half_session IN ('first', 'second'));

CREATE OR REPLACE FUNCTION public._leave_json(r public.leave_requests)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', r.id, 'start_date', r.start_date, 'end_date', r.end_date, 'half_day', r.half_day, 'half_session', r.half_session, 'days', r.days,
    'reason', r.reason, 'status', r.status, 'created_at', r.created_at,
    'type', (SELECT jsonb_build_object('id', t.id, 'code', t.code, 'name', t.name, 'paid', t.paid) FROM public.leave_types t WHERE t.id = r.leave_type_id),
    'employee', (SELECT jsonb_build_object('id', e.id, 'full_name', e.full_name, 'employee_code', e.employee_code, 'designation', e.designation)
                   FROM public.employees e WHERE e.id = r.employee_id),
    'manager', (SELECT jsonb_build_object('id', m.id, 'full_name', m.full_name, 'active', m.active)
                  FROM public.employees m WHERE m.id = r.manager_employee_id),
    'manager_step', CASE WHEN r.manager_at IS NULL THEN NULL ELSE jsonb_build_object('by', public._user_name(r.manager_by), 'at', r.manager_at, 'comment', r.manager_comment) END,
    'admin_step',   CASE WHEN r.admin_at IS NULL THEN NULL ELSE jsonb_build_object('by', public._user_name(r.admin_by), 'at', r.admin_at, 'comment', r.admin_comment) END,
    'final_step',   CASE WHEN r.final_at IS NULL THEN NULL ELSE jsonb_build_object('by', public._user_name(r.final_by), 'at', r.final_at, 'comment', r.final_comment) END,
    'rejected', CASE WHEN r.status = 'rejected' THEN jsonb_build_object('by', public._user_name(r.rejected_by), 'comment', r.rejected_comment) END,
    'cancelled_note', r.cancelled_note);
$$;

CREATE OR REPLACE FUNCTION public.leave_overview(_year int DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e    public.employees := public._att_me();
  _y    int := coalesce(_year, extract(year FROM public._att_date(now()))::int);
BEGIN
  RETURN jsonb_build_object(
    'year', _y,
    'half_sessions', true,   -- the screens offer First half / Second half
    'today', public._att_date(now()),
    'weekly_off', to_jsonb((public._att_settings()).weekly_off),
    'manager', (SELECT jsonb_build_object('id', m.id, 'full_name', m.full_name) FROM public.employees m WHERE m.id = public._leave_manager(_e.id)),
    'balances', public._leave_balances(_e.id, _y),
    'requests', coalesce((SELECT jsonb_agg(public._leave_json(r) ORDER BY r.start_date DESC)
                            FROM public.leave_requests r WHERE r.employee_id = _e.id
                             AND (extract(year FROM r.start_date)::int = _y OR r.status IN ('manager_review', 'admin_review', 'manager_final'))), '[]'::jsonb),
    'holidays', coalesce((SELECT jsonb_agg(jsonb_build_object('date', h.date, 'name', h.name) ORDER BY h.date)
                            FROM public.holidays h WHERE extract(year FROM h.date)::int IN (_y, _y + 1)), '[]'::jsonb));
END;
$$;

-- One function only: a second one with fewer arguments would make calls ambiguous.
DROP FUNCTION IF EXISTS public.leave_apply(uuid, date, date, boolean, text);
CREATE OR REPLACE FUNCTION public.leave_apply(_type uuid, _from date, _to date, _half boolean, _reason text, _half_session text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e    public.employees := public._att_me();
  _days numeric;
  _mgr  uuid;
  _r    public.leave_requests;
BEGIN
  PERFORM public.rbac_require('emp.leave.create');
  IF length(trim(coalesce(_reason, ''))) NOT BETWEEN 1 AND 500 THEN
    RAISE EXCEPTION 'Write a reason (up to 500 characters).' USING ERRCODE = '22023';
  END IF;
  IF _half_session IS NOT NULL AND _half_session NOT IN ('first', 'second') THEN
    RAISE EXCEPTION 'Choose the first or the second half.' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('leave:' || _e.id::text, 0));
  _days := public._leave_check(_e.id, _type, _from, _to, coalesce(_half, false));
  _mgr := public._leave_manager(_e.id);
  INSERT INTO public.leave_requests (employee_id, leave_type_id, start_date, end_date, half_day, half_session, days, reason, status, manager_employee_id)
  VALUES (_e.id, _type, _from, _to, coalesce(_half, false), CASE WHEN _half THEN _half_session END, _days, trim(_reason),
          CASE WHEN _mgr IS NULL THEN 'admin_review' ELSE 'manager_review' END, _mgr)
  RETURNING * INTO _r;
  RETURN public._leave_json(_r);
END;
$$;

REVOKE ALL ON FUNCTION public.leave_apply(uuid, date, date, boolean, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.leave_apply(uuid, date, date, boolean, text, text) TO authenticated;

-- ===================== 20261127160000_reminders.sql =====================

-- One automatic notification per person per reason.
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS dedupe_key text;
CREATE UNIQUE INDEX IF NOT EXISTS notifications_once ON public.notifications (employee_id, dedupe_key)
  WHERE dedupe_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.reminder_settings (
  kind        text PRIMARY KEY CHECK (kind IN ('punch_in', 'punch_out', 'report', 'deadline')),
  enabled     boolean NOT NULL DEFAULT true,
  send_at     time NOT NULL,                       -- company time zone (attendance_settings)
  days        smallint[] NOT NULL                  -- ISO weekdays: 1 = Mon … 7 = Sun
              CHECK (days <@ '{1,2,3,4,5,6,7}'::smallint[] AND cardinality(days) BETWEEN 1 AND 7),
  last_run    date,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reminder_settings FROM anon, authenticated;

INSERT INTO public.reminder_settings (kind, send_at, days) VALUES
  ('punch_in',  '10:00', '{1,2,3,4,6,7}'),
  ('deadline',  '10:15', '{1,2,3,4,6,7}'),
  ('report',    '18:30', '{1,2,3,4,6,7}'),
  ('punch_out', '19:30', '{1,2,3,4,5,6,7}')
ON CONFLICT (kind) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Creating automatic notifications (internal)
-- ---------------------------------------------------------------------------
-- Unlike _notify, the person who caused it also receives it (it is about them).
CREATE OR REPLACE FUNCTION public._notify_system(_emp uuid, _kind text, _title text, _body text, _link text, _dedupe text DEFAULT NULL)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _n int;
BEGIN
  INSERT INTO public.notifications (employee_id, kind, title, body, link, dedupe_key)
  SELECT e.id, _kind, left(_title, 150), left(_body, 2000), _link, _dedupe
    FROM public.employees e WHERE e.id = _emp AND e.active
  ON CONFLICT (employee_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n;
END;
$$;

CREATE OR REPLACE FUNCTION public._clock_text(_t time)
RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = ''
AS $$ SELECT to_char(_t, 'FMHH12:MI AM'); $$;

-- Sends one kind of reminder to everyone who needs it now. Returns how many were sent.
CREATE OR REPLACE FUNCTION public._reminder_send(_kind text)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _today date := public._att_date(now());
  _s     public.attendance_settings := public._att_settings();
  _key   text := _kind || ':' || public._att_date(now())::text;
  _n     int := 0;
  _r     record;
BEGIN
  IF _kind = 'punch_in' THEN
    FOR _r IN SELECT e.id, public._day_off(e.id, _today) AS off FROM public.employees e
               WHERE e.active AND public.rbac_user_can(e.user_id, 'emp.attendance.create')
                 AND NOT EXISTS (SELECT 1 FROM public.attendance_sessions a WHERE a.employee_id = e.id AND a.work_date = _today)
    LOOP
      -- A half day of leave is still a working day.
      CONTINUE WHEN _r.off IS NOT NULL AND NOT coalesce((_r.off->>'half_day')::boolean, false);
      _n := _n + public._notify_system(_r.id, 'attendance', 'You have not punched in today',
        'Office starts at ' || public._clock_text(_s.office_start) || '. Punch in when you start work, or apply for leave if you are off.',
        '/portal', _key);
    END LOOP;
  ELSIF _kind = 'punch_out' THEN
    PERFORM public._att_close_overdue(NULL);
    FOR _r IN SELECT DISTINCT a.employee_id AS id FROM public.attendance_sessions a WHERE a.punch_out_at IS NULL LOOP
      _n := _n + public._notify_system(_r.id, 'attendance', 'You are still punched in',
        'You will be punched out automatically at ' || public._clock_text(_s.auto_punch_out) || '. Punch out now if you are done.',
        '/portal/attendance', _key);
    END LOOP;
  ELSIF _kind = 'report' THEN
    FOR _r IN SELECT e.id FROM public.employees e
               WHERE e.active AND public.rbac_user_can(e.user_id, 'emp.reports.create')
                 AND EXISTS (SELECT 1 FROM public.attendance_sessions a WHERE a.employee_id = e.id AND a.work_date = _today)
                 AND NOT EXISTS (SELECT 1 FROM public.work_reports w WHERE w.employee_id = e.id AND w.report_date = _today
                                    AND w.status IN ('submitted', 'reviewed'))
    LOOP
      _n := _n + public._notify_system(_r.id, 'report', 'Submit your daily work report',
        'Your report for today is not submitted yet.', '/portal/reports', _key);
    END LOOP;
  ELSIF _kind = 'deadline' THEN
    FOR _r IN SELECT t.assignee_id AS id, count(*) AS n, count(*) FILTER (WHERE t.due_date < _today) AS late,
                     string_agg(t.title || ' (due ' || to_char(t.due_date, 'DD Mon') || ')', ', ' ORDER BY t.due_date, t.title) AS list
                FROM public.project_tasks t
                JOIN public.projects p ON p.id = t.project_id AND p.status NOT IN ('completed', 'cancelled')
               WHERE t.assignee_id IS NOT NULL AND t.status <> 'done' AND t.due_date <= _today + 1
               GROUP BY t.assignee_id
    LOOP
      _n := _n + public._notify_system(_r.id, 'project',
        CASE WHEN _r.late > 0 THEN 'You have ' || _r.late || CASE WHEN _r.late = 1 THEN ' late task' ELSE ' late tasks' END
             ELSE CASE WHEN _r.n = 1 THEN 'A task is due soon' ELSE _r.n || ' tasks are due soon' END END,
        _r.list, '/portal/projects', _key);
    END LOOP;
  ELSE
    RAISE EXCEPTION 'Reminder not found.' USING ERRCODE = 'P0002';
  END IF;
  RETURN _n;
END;
$$;

-- Sends every reminder whose time has come today (each at most once a day).
CREATE OR REPLACE FUNCTION public.reminders_run_due()
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _local timestamp := now() AT TIME ZONE (public._att_settings()).timezone;
  _s     public.reminder_settings;
  _n     int := 0;
BEGIN
  PERFORM public._att_close_overdue(NULL);   -- so "missed punch-out" arrives on time
  FOR _s IN SELECT * FROM public.reminder_settings
             WHERE enabled AND extract(isodow FROM _local)::smallint = ANY (days) AND _local::time >= send_at
               AND (last_run IS NULL OR last_run < _local::date)
             ORDER BY send_at FOR UPDATE SKIP LOCKED
  LOOP
    _n := _n + public._reminder_send(_s.kind);
    UPDATE public.reminder_settings SET last_run = _local::date WHERE kind = _s.kind;
  END LOOP;
  RETURN _n;
END;
$$;

-- Called by the website, so reminders also arrive without the background timer.
CREATE OR REPLACE FUNCTION public.notif_tick()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF public.portal_my_employee_id() IS NOT NULL OR public.rbac_can('portal.notifications.create') THEN
    PERFORM public.reminders_run_due();
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- Admin: the reminder settings
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._reminders_timer_on()
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _on boolean := false;
BEGIN
  IF to_regclass('cron.job') IS NOT NULL THEN
    EXECUTE 'SELECT EXISTS (SELECT 1 FROM cron.job WHERE jobname = ''portal-reminders'')' INTO _on;
  END IF;
  RETURN _on;
END;
$$;

CREATE OR REPLACE FUNCTION public.reminders_admin()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.notifications.create');
  RETURN jsonb_build_object(
    'timer', public._reminders_timer_on(),
    'items', (SELECT jsonb_agg(jsonb_build_object('kind', s.kind, 'enabled', s.enabled, 'send_at', to_char(s.send_at, 'HH24:MI'),
                       'days', to_jsonb(s.days),
                       'sent_today', (SELECT count(*) FROM public.notifications n
                                       WHERE n.dedupe_key = s.kind || ':' || public._att_date(now())::text))
                     ORDER BY s.send_at, s.kind)
                FROM public.reminder_settings s));
END;
$$;

CREATE OR REPLACE FUNCTION public.reminders_admin_save(_kind text, _enabled boolean, _send_at time, _days smallint[])
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.notifications.create');
  IF _send_at IS NULL THEN RAISE EXCEPTION 'Choose a time.' USING ERRCODE = '22023'; END IF;
  IF coalesce(cardinality(_days), 0) = 0 OR NOT (_days <@ '{1,2,3,4,5,6,7}'::smallint[]) THEN
    RAISE EXCEPTION 'Choose at least one day.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.reminder_settings SET enabled = coalesce(_enabled, false), send_at = _send_at,
         days = (SELECT array_agg(DISTINCT d ORDER BY d) FROM unnest(_days) d), updated_at = now()
   WHERE kind = _kind;
  IF NOT FOUND THEN RAISE EXCEPTION 'Reminder not found.' USING ERRCODE = 'P0002'; END IF;
  RETURN public.reminders_admin();
END;
$$;

-- People already reminded today are not reminded twice.
CREATE OR REPLACE FUNCTION public.reminders_admin_send_now(_kind text)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.notifications.create');
  RETURN public._reminder_send(_kind);
END;
$$;

-- ---------------------------------------------------------------------------
-- Automatic: punch-in, missed punch-out, welcome, reporting manager
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._trg_notify_auto_out()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _tz text := (public._att_settings()).timezone;
BEGIN
  PERFORM public._notify_system(NEW.employee_id, 'attendance', 'You missed punching out',
    'You were punched out automatically on ' || to_char(NEW.work_date, 'DD Mon YYYY') || ' at '
      || public._clock_text((NEW.punch_out_at AT TIME ZONE _tz)::time) || '. Request a correction if the time is wrong.',
    '/portal/attendance', 'auto_out:' || NEW.id::text);
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_auto_out ON public.attendance_sessions;
CREATE TRIGGER notify_auto_out AFTER UPDATE ON public.attendance_sessions
  FOR EACH ROW WHEN (NEW.auto_punched_out AND NOT OLD.auto_punched_out) EXECUTE FUNCTION public._trg_notify_auto_out();

CREATE OR REPLACE FUNCTION public._trg_notify_punch_in()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _s    public.attendance_settings;
  _e    public.employees;
  _at   time;
  _off  jsonb;
  _late boolean;
  _r    record;
BEGIN
  BEGIN
    SELECT * INTO _e FROM public.employees WHERE id = NEW.employee_id;
    -- Only a real punch by the employee, not a session added by an approved correction.
    IF NEW.corrected_at IS NOT NULL OR _e.user_id IS DISTINCT FROM auth.uid() THEN RETURN NULL; END IF;
    _s := public._att_settings();
    _at := (NEW.punch_in_at AT TIME ZONE _s.timezone)::time;
    _off := public._day_off(_e.id, NEW.work_date);
    _late := date_trunc('minute', _at) > _s.late_after
      AND (_off IS NULL OR coalesce((_off->>'half_day')::boolean, false))
      AND NOT EXISTS (SELECT 1 FROM public.attendance_sessions a
                       WHERE a.employee_id = _e.id AND a.work_date = NEW.work_date AND a.id <> NEW.id);
    PERFORM public._notify_system(_e.id, 'attendance', 'You punched in at ' || public._clock_text(_at),
      CASE WHEN _late THEN 'Marked late (after ' || public._clock_text(_s.late_after) || '). ' ELSE '' END
        || 'Remember to punch out before you leave. Automatic punch-out is at ' || public._clock_text(_s.auto_punch_out) || '.',
      '/portal/attendance', 'punched:' || NEW.id::text);
    IF _late THEN
      -- The Admins and the reporting manager.
      FOR _r IN SELECT x.id, x.link FROM (
                  SELECT a.id, '/admin/attendance' AS link, 1 AS n FROM public.employees a
                    JOIN public.rbac_user_roles ur ON ur.user_id = a.user_id AND ur.role_key = 'admin'
                  UNION ALL SELECT _e.reporting_manager_id, '/portal', 2) x
                 WHERE x.id IS NOT NULL AND x.id <> _e.id ORDER BY x.n LOOP
        PERFORM public._notify_system(_r.id, 'attendance', _e.full_name || ' punched in late at ' || public._clock_text(_at),
          to_char(NEW.work_date, 'DD Mon YYYY') || ' · late after ' || public._clock_text(_s.late_after),
          _r.link, 'late:' || NEW.id::text);
      END LOOP;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'punch-in notification skipped: %', SQLERRM;   -- never stop a punch
  END;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_punch_in ON public.attendance_sessions;
CREATE TRIGGER notify_punch_in AFTER INSERT ON public.attendance_sessions
  FOR EACH ROW EXECUTE FUNCTION public._trg_notify_punch_in();

CREATE OR REPLACE FUNCTION public._trg_notify_employee()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _manager text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public._notify_system(NEW.id, 'message', 'Welcome to the Global Chemicals Employee Portal',
      'Your account is ready. Please complete your personal details and emergency contacts in My profile.',
      '/portal/profile', 'welcome');
  ELSIF NEW.reporting_manager_id IS NOT DISTINCT FROM OLD.reporting_manager_id THEN
    RETURN NULL;
  END IF;
  SELECT full_name INTO _manager FROM public.employees WHERE id = NEW.reporting_manager_id AND active;
  IF _manager IS NOT NULL THEN
    PERFORM public._notify_system(NEW.id, 'message', 'Your reporting manager was updated',
      'You now report to ' || _manager || '.', '/portal/profile');
    PERFORM public._notify_system(NEW.reporting_manager_id, 'message', NEW.full_name || ' now reports to you',
      'You review their leave and daily reports.', '/portal');
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_employee_new ON public.employees;
CREATE TRIGGER notify_employee_new AFTER INSERT ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public._trg_notify_employee();
DROP TRIGGER IF EXISTS notify_employee_manager ON public.employees;
CREATE TRIGGER notify_employee_manager AFTER UPDATE OF reporting_manager_id ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public._trg_notify_employee();

REVOKE ALL ON FUNCTION public._notify_system(uuid, text, text, text, text, text), public._clock_text(time),
  public._reminder_send(text), public.reminders_run_due(), public._reminders_timer_on(),
  public._trg_notify_auto_out(), public._trg_notify_employee(), public._trg_notify_punch_in() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notif_tick(), public.reminders_admin(), public.reminders_admin_save(text, boolean, time, smallint[]),
  public.reminders_admin_send_now(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.notif_tick(), public.reminders_admin(), public.reminders_admin_save(text, boolean, time, smallint[]),
  public.reminders_admin_send_now(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- Background timer (optional: without it reminders go out while the portal is in use)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'pg_cron could not be enabled: %', SQLERRM;
  END;
  IF to_regprocedure('cron.schedule(text,text,text)') IS NOT NULL THEN
    BEGIN
      EXECUTE $q$ SELECT cron.schedule('portal-reminders', '*/5 * * * *', 'select public.reminders_run_due()') $q$;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'The reminder timer could not be created: %', SQLERRM;
    END;
  END IF;
END;
$$;

COMMIT;

NOTIFY pgrst, 'reload schema';

SELECT part, ok FROM (VALUES
  (1, 'Half day: first or second half', to_regprocedure('public.leave_apply(uuid, date, date, boolean, text, text)') IS NOT NULL),
  (2, 'Automatic notifications',        to_regclass('public.reminder_settings') IS NOT NULL),
  (3, 'Timer: runs every 5 minutes',    public._reminders_timer_on())
) v(n, part, ok) ORDER BY n;
