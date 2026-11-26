-- Employee Portal, step 2: attendance (punch in / out) and correction requests.
--
-- Rules (Global Chemicals, Oman time, editable in attendance_settings):
--   office 09:45 – 19:00 · late = first punch-in of the day after 10:00
--   day status: < 4 h worked → absent · ≥ 4 h and worked until 19:00 → present
--               · ≥ 4 h but left before 19:00 → half_day · still punched in → working
--   automatic punch-out at 20:00 (a session started after 20:00 closes at midnight)
--   weekly off: Friday
-- Overdue sessions are closed "lazily" by every attendance function, so the
-- result is the same as a scheduled job: the punch-out is always the cut-off
-- time, never the time of the check.
--
-- Employees punch only through att_punch_in / att_punch_out. Nobody edits punch
-- times directly: mistakes go through a correction request an admin approves.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance_settings (
  id                  boolean PRIMARY KEY DEFAULT true CHECK (id),
  timezone            text     NOT NULL DEFAULT 'Asia/Muscat',
  office_start        time     NOT NULL DEFAULT '09:45',
  late_after          time     NOT NULL DEFAULT '10:00',
  office_end          time     NOT NULL DEFAULT '19:00',
  half_day_min_hours  numeric  NOT NULL DEFAULT 4 CHECK (half_day_min_hours > 0 AND half_day_min_hours < 24),
  auto_punch_out      time     NOT NULL DEFAULT '20:00',
  weekly_off          smallint[] NOT NULL DEFAULT '{5}',  -- ISO weekdays: 1 = Mon … 5 = Fri … 7 = Sun
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CHECK (weekly_off <@ '{1,2,3,4,5,6,7}'::smallint[])
);
INSERT INTO public.attendance_settings (id) VALUES (true) ON CONFLICT DO NOTHING;
ALTER TABLE public.attendance_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.attendance_settings FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public._att_settings()
RETURNS public.attendance_settings
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT * FROM public.attendance_settings WHERE id; $$;

-- Local (company timezone) date of a moment, and a local date+time as a moment.
CREATE OR REPLACE FUNCTION public._att_date(_t timestamptz)
RETURNS date
LANGUAGE sql STABLE SET search_path = ''
AS $$ SELECT (_t AT TIME ZONE (public._att_settings()).timezone)::date; $$;

CREATE OR REPLACE FUNCTION public._att_at(_d date, _t time)
RETURNS timestamptz
LANGUAGE sql STABLE SET search_path = ''
AS $$ SELECT (_d + _t) AT TIME ZONE (public._att_settings()).timezone; $$;

CREATE OR REPLACE FUNCTION public.attendance_rules()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'timezone', s.timezone, 'office_start', to_char(s.office_start, 'HH24:MI'),
    'late_after', to_char(s.late_after, 'HH24:MI'), 'office_end', to_char(s.office_end, 'HH24:MI'),
    'half_day_min_hours', s.half_day_min_hours, 'auto_punch_out', to_char(s.auto_punch_out, 'HH24:MI'),
    'weekly_off', to_jsonb(s.weekly_off), 'today', public._att_date(now()))
  FROM public.attendance_settings s WHERE s.id;
$$;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
INSERT INTO public.rbac_permissions (key, area, label, description, sort_order) VALUES
  ('portal.attendance.view',    'admin',  'Attendance: view',    'See everyone''s attendance.',                 20),
  ('portal.attendance.approve', 'admin',  'Attendance: approve', 'Approve or reject correction requests.',      21),
  ('emp.attendance.create',     'portal', 'Punch in / out',      'Record your own attendance.',                 51),
  ('emp.attendance.edit',       'portal', 'Request corrections', 'Ask for a punch time to be corrected.',       52)
ON CONFLICT (key) DO UPDATE SET area = EXCLUDED.area, label = EXCLUDED.label,
  description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('employee', 'emp.attendance.create'),
  ('employee', 'emp.attendance.edit')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id       uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  work_date         date NOT NULL,
  punch_in_at       timestamptz NOT NULL DEFAULT now(),
  punch_out_at      timestamptz CHECK (punch_out_at IS NULL OR punch_out_at >= punch_in_at),
  auto_punched_out  boolean NOT NULL DEFAULT false,
  corrected_at      timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS attendance_one_open ON public.attendance_sessions (employee_id) WHERE punch_out_at IS NULL;
CREATE INDEX IF NOT EXISTS attendance_employee_date ON public.attendance_sessions (employee_id, work_date DESC);
CREATE INDEX IF NOT EXISTS attendance_date ON public.attendance_sessions (work_date);

CREATE TABLE IF NOT EXISTS public.attendance_corrections (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id       uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  work_date         date NOT NULL,
  session_id        uuid REFERENCES public.attendance_sessions(id) ON DELETE SET NULL,  -- null = add a missing session
  requested_in      timestamptz,
  requested_out     timestamptz,
  old_in            timestamptz,   -- snapshot at request time; null = "add"
  old_out           timestamptz,
  reason            text NOT NULL CHECK (length(trim(reason)) BETWEEN 1 AND 500),
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  decided_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at        timestamptz,
  decision_comment  text CHECK (decision_comment IS NULL OR length(decision_comment) <= 500),
  created_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (requested_in IS NOT NULL OR requested_out IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS attendance_corr_one_pending ON public.attendance_corrections (employee_id, work_date) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS attendance_corr_status ON public.attendance_corrections (status, created_at DESC);

ALTER TABLE public.attendance_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_corrections ENABLE ROW LEVEL SECURITY;
-- Reads only (own rows, or attendance admins); all writes go through the functions below.
DROP POLICY IF EXISTS "Read own or as attendance admin" ON public.attendance_sessions;
CREATE POLICY "Read own or as attendance admin" ON public.attendance_sessions FOR SELECT TO authenticated
  USING (employee_id = public.portal_my_employee_id() OR public.rbac_can('portal.attendance.view'));
DROP POLICY IF EXISTS "Read own or as attendance admin" ON public.attendance_corrections;
CREATE POLICY "Read own or as attendance admin" ON public.attendance_corrections FOR SELECT TO authenticated
  USING (employee_id = public.portal_my_employee_id() OR public.rbac_can('portal.attendance.view'));
REVOKE INSERT, UPDATE, DELETE ON public.attendance_sessions, public.attendance_corrections FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Core helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._att_me()
RETURNS public.employees
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees;
BEGIN
  SELECT * INTO _e FROM public.employees WHERE user_id = auth.uid() AND active;
  IF _e.id IS NULL THEN
    RAISE EXCEPTION 'Only an active employee can do this.' USING ERRCODE = '42501';
  END IF;
  RETURN _e;
END;
$$;

-- When an open session is closed automatically.
CREATE OR REPLACE FUNCTION public.att_auto_punch_out_at(_work_date date, _punch_in timestamptz)
RETURNS timestamptz
LANGUAGE sql STABLE SET search_path = ''
AS $$
  SELECT CASE WHEN _punch_in < public._att_at(_work_date, (public._att_settings()).auto_punch_out)
              THEN public._att_at(_work_date, (public._att_settings()).auto_punch_out)
              ELSE public._att_at(_work_date + 1, '00:00') END;
$$;

-- Closes overdue open sessions (one employee, or everyone when null). Returns how many.
CREATE OR REPLACE FUNCTION public._att_close_overdue(_emp uuid DEFAULT NULL)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _n int;
BEGIN
  UPDATE public.attendance_sessions s
     SET punch_out_at = public.att_auto_punch_out_at(s.work_date, s.punch_in_at), auto_punched_out = true
   WHERE s.punch_out_at IS NULL
     AND (_emp IS NULL OR s.employee_id = _emp)
     AND now() >= public.att_auto_punch_out_at(s.work_date, s.punch_in_at);
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n;
END;
$$;

-- One row per employee per day with punches, plus the computed status.
CREATE OR REPLACE FUNCTION public._att_days(_emp uuid, _from date, _to date)
RETURNS TABLE (employee_id uuid, work_date date, first_in timestamptz, last_out timestamptz, worked_minutes int,
               sessions int, is_open boolean, is_late boolean, auto_out boolean, corrected boolean, status text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  WITH s AS (SELECT * FROM public._att_settings()),
  g AS (
    SELECT a.employee_id, a.work_date, min(a.punch_in_at) AS first_in, max(a.punch_out_at) AS last_out,
           floor(extract(epoch FROM sum(coalesce(a.punch_out_at, now()) - a.punch_in_at)) / 60)::int AS worked_minutes,
           count(*)::int AS sessions, bool_or(a.punch_out_at IS NULL) AS is_open,
           bool_or(a.auto_punched_out) AS auto_out, bool_or(a.corrected_at IS NOT NULL) AS corrected
      FROM public.attendance_sessions a
     WHERE (_emp IS NULL OR a.employee_id = _emp) AND a.work_date BETWEEN _from AND _to
     GROUP BY a.employee_id, a.work_date)
  SELECT g.employee_id, g.work_date, g.first_in, g.last_out, g.worked_minutes, g.sessions, g.is_open,
         g.first_in > public._att_at(g.work_date, s.late_after) AS is_late,
         g.auto_out, g.corrected,
         CASE WHEN g.is_open THEN 'working'
              WHEN g.worked_minutes < s.half_day_min_hours * 60 THEN 'absent'
              WHEN g.last_out >= public._att_at(g.work_date, s.office_end) THEN 'present'
              ELSE 'half_day' END
    FROM g, s;
$$;

CREATE OR REPLACE FUNCTION public._att_session_json(a public.attendance_sessions)
RETURNS jsonb
LANGUAGE sql STABLE SET search_path = ''
AS $$
  SELECT jsonb_build_object('id', a.id, 'employee_id', a.employee_id, 'work_date', a.work_date,
    'punch_in_at', a.punch_in_at, 'punch_out_at', a.punch_out_at, 'auto_punched_out', a.auto_punched_out,
    'corrected_at', a.corrected_at,
    'auto_punch_out_at', CASE WHEN a.punch_out_at IS NULL THEN public.att_auto_punch_out_at(a.work_date, a.punch_in_at) END);
$$;

CREATE OR REPLACE FUNCTION public._att_correction_json(c public.attendance_corrections)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT jsonb_build_object('id', c.id, 'work_date', c.work_date, 'session_id', c.session_id,
    'requested_in', c.requested_in, 'requested_out', c.requested_out, 'old_in', c.old_in, 'old_out', c.old_out,
    'kind', CASE WHEN c.old_in IS NULL THEN 'add' ELSE 'fix' END, 'reason', c.reason, 'status', c.status,
    'created_at', c.created_at, 'decided_at', c.decided_at, 'decision_comment', c.decision_comment,
    'decided_by', (SELECT coalesce(e.full_name, u.raw_user_meta_data->>'name', u.email)
                     FROM auth.users u LEFT JOIN public.employees e ON e.user_id = u.id WHERE u.id = c.decided_by),
    'employee', (SELECT jsonb_build_object('id', e.id, 'full_name', e.full_name, 'employee_code', e.employee_code)
                   FROM public.employees e WHERE e.id = c.employee_id));
$$;

-- ---------------------------------------------------------------------------
-- 5. Employee: today, punch in / out, history
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.att_me()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e     public.employees := public._att_me();
  _today date := public._att_date(now());
  _open  public.attendance_sessions;
BEGIN
  PERFORM public._att_close_overdue(_e.id);
  SELECT * INTO _open FROM public.attendance_sessions WHERE employee_id = _e.id AND punch_out_at IS NULL;
  RETURN jsonb_build_object(
    'rules', public.attendance_rules(),
    'today', _today,
    'is_weekly_off', extract(isodow FROM _today)::smallint = ANY ((public._att_settings()).weekly_off),
    'open_session', CASE WHEN _open.id IS NULL THEN NULL ELSE public._att_session_json(_open) END,
    'today_summary', (SELECT to_jsonb(d) FROM public._att_days(_e.id, _today, _today) d),
    'today_sessions', coalesce((SELECT jsonb_agg(public._att_session_json(a) ORDER BY a.punch_in_at)
                                  FROM public.attendance_sessions a WHERE a.employee_id = _e.id AND a.work_date = _today), '[]'::jsonb));
END;
$$;

CREATE OR REPLACE FUNCTION public.att_punch_in()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me(); _s public.attendance_sessions;
BEGIN
  PERFORM public.rbac_require('emp.attendance.create');
  PERFORM pg_advisory_xact_lock(hashtextextended('att:' || _e.id::text, 0));
  PERFORM public._att_close_overdue(_e.id);
  IF EXISTS (SELECT 1 FROM public.attendance_sessions WHERE employee_id = _e.id AND punch_out_at IS NULL) THEN
    RAISE EXCEPTION 'You are already punched in.';
  END IF;
  INSERT INTO public.attendance_sessions (employee_id, work_date) VALUES (_e.id, public._att_date(now()))
  RETURNING * INTO _s;
  RETURN public._att_session_json(_s);
END;
$$;

CREATE OR REPLACE FUNCTION public.att_punch_out()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me(); _s public.attendance_sessions;
BEGIN
  PERFORM public.rbac_require('emp.attendance.create');
  PERFORM pg_advisory_xact_lock(hashtextextended('att:' || _e.id::text, 0));
  -- Past the cut-off: the session was already closed at the cut-off time; report that (no error).
  IF public._att_close_overdue(_e.id) > 0 THEN
    SELECT * INTO _s FROM public.attendance_sessions WHERE employee_id = _e.id ORDER BY punch_in_at DESC LIMIT 1;
    RETURN public._att_session_json(_s);
  END IF;
  UPDATE public.attendance_sessions SET punch_out_at = greatest(now(), punch_in_at)
   WHERE employee_id = _e.id AND punch_out_at IS NULL RETURNING * INTO _s;
  IF _s.id IS NULL THEN RAISE EXCEPTION 'You are not punched in.'; END IF;
  RETURN public._att_session_json(_s);
END;
$$;

-- Days, sessions and correction requests for a date range (max 62 days).
CREATE OR REPLACE FUNCTION public.att_my_attendance(_from date, _to date)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  IF _from IS NULL OR _to IS NULL OR _to < _from OR _to - _from > 62 THEN
    RAISE EXCEPTION 'Choose a date range of at most 62 days.' USING ERRCODE = '22023';
  END IF;
  PERFORM public._att_close_overdue(_e.id);
  RETURN jsonb_build_object(
    'rules', public.attendance_rules(),
    'days', coalesce((SELECT jsonb_agg(to_jsonb(d) ORDER BY d.work_date DESC) FROM public._att_days(_e.id, _from, _to) d), '[]'::jsonb),
    'sessions', coalesce((SELECT jsonb_agg(public._att_session_json(a) ORDER BY a.punch_in_at)
                            FROM public.attendance_sessions a WHERE a.employee_id = _e.id AND a.work_date BETWEEN _from AND _to), '[]'::jsonb),
    'corrections', coalesce((SELECT jsonb_agg(public._att_correction_json(c) ORDER BY c.created_at DESC)
                               FROM (SELECT * FROM public.attendance_corrections WHERE employee_id = _e.id
                                      ORDER BY created_at DESC LIMIT 50) c), '[]'::jsonb));
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. Corrections
-- ---------------------------------------------------------------------------
-- Validates a requested fix/add and returns the resulting punch in/out.
CREATE OR REPLACE FUNCTION public._att_correction_check(_emp uuid, _date date, _session uuid,
                                                        _in timestamptz, _out timestamptz,
                                                        OUT new_in timestamptz, OUT new_out timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _cur public.attendance_sessions; _today date := public._att_date(now());
BEGIN
  IF _date IS NULL OR _date > _today OR _date < _today - 30 THEN
    RAISE EXCEPTION 'Corrections are possible for today and the last 30 days only.' USING ERRCODE = '22023';
  END IF;
  IF _in IS NULL AND _out IS NULL THEN
    RAISE EXCEPTION 'Enter the correct punch in and/or punch out time.' USING ERRCODE = '22023';
  END IF;
  IF _session IS NOT NULL THEN
    SELECT * INTO _cur FROM public.attendance_sessions WHERE id = _session AND employee_id = _emp AND work_date = _date;
    IF _cur.id IS NULL THEN
      RAISE EXCEPTION 'That punch session was not found on this day.' USING ERRCODE = 'P0002';
    END IF;
    IF _cur.punch_out_at IS NULL AND _out IS NULL THEN
      RAISE EXCEPTION 'This session is still open. Punch out first, or enter the punch out time.' USING ERRCODE = '22023';
    END IF;
    new_in := coalesce(_in, _cur.punch_in_at);
    new_out := coalesce(_out, _cur.punch_out_at);
  ELSE
    IF _in IS NULL OR _out IS NULL THEN
      RAISE EXCEPTION 'To add a missing session, enter both punch in and punch out.' USING ERRCODE = '22023';
    END IF;
    new_in := _in;
    new_out := _out;
  END IF;
  IF public._att_date(new_in) <> _date THEN
    RAISE EXCEPTION 'Punch in must be on %.', to_char(_date, 'DD Mon YYYY') USING ERRCODE = '22023';
  END IF;
  IF new_out <= new_in THEN RAISE EXCEPTION 'Punch out must be after punch in.' USING ERRCODE = '22023'; END IF;
  IF new_out > public._att_at(_date + 1, '00:00') THEN
    RAISE EXCEPTION 'Punch out must be on the same day (before midnight).' USING ERRCODE = '22023';
  END IF;
  IF new_out > now() THEN RAISE EXCEPTION 'Times cannot be in the future.' USING ERRCODE = '22023'; END IF;
  IF EXISTS (SELECT 1 FROM public.attendance_sessions a
              WHERE a.employee_id = _emp AND a.id IS DISTINCT FROM _session
                AND tstzrange(a.punch_in_at, coalesce(a.punch_out_at, now())) && tstzrange(new_in, new_out)) THEN
    RAISE EXCEPTION 'These times overlap another punch session.' USING ERRCODE = '22023';
  END IF;
END;
$$;

-- _in / _out are local times (company timezone) on _date; null = keep / not given.
CREATE OR REPLACE FUNCTION public.att_request_correction(_date date, _session uuid, _in time, _out time, _reason text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e    public.employees := public._att_me();
  _cur  public.attendance_sessions;
  _ri   timestamptz := CASE WHEN _in IS NOT NULL THEN public._att_at(_date, _in) END;
  _ro   timestamptz := CASE WHEN _out IS NOT NULL THEN public._att_at(_date, _out) END;
  _chk  record;
  _c    public.attendance_corrections;
BEGIN
  PERFORM public.rbac_require('emp.attendance.edit');
  IF length(trim(coalesce(_reason, ''))) NOT BETWEEN 1 AND 500 THEN
    RAISE EXCEPTION 'Write a reason (up to 500 characters).' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (SELECT 1 FROM public.attendance_corrections WHERE employee_id = _e.id AND work_date = _date AND status = 'pending') THEN
    RAISE EXCEPTION 'You already have a pending correction for this day.' USING ERRCODE = '23505';
  END IF;
  PERFORM public._att_close_overdue(_e.id);
  SELECT * INTO _chk FROM public._att_correction_check(_e.id, _date, _session, _ri, _ro);
  IF _session IS NOT NULL THEN
    SELECT * INTO _cur FROM public.attendance_sessions WHERE id = _session;
    IF _cur.punch_in_at = _chk.new_in AND _cur.punch_out_at IS NOT DISTINCT FROM _chk.new_out THEN
      RAISE EXCEPTION 'The times are the same as now — nothing to correct.' USING ERRCODE = '22023';
    END IF;
  END IF;
  INSERT INTO public.attendance_corrections (employee_id, work_date, session_id, requested_in, requested_out, old_in, old_out, reason)
  VALUES (_e.id, _date, _session,
          CASE WHEN _cur.id IS NULL OR _chk.new_in <> _cur.punch_in_at THEN _chk.new_in END,
          CASE WHEN _cur.id IS NULL OR _chk.new_out IS DISTINCT FROM _cur.punch_out_at THEN _chk.new_out END,
          _cur.punch_in_at, _cur.punch_out_at, trim(_reason))
  RETURNING * INTO _c;
  RETURN public._att_correction_json(_c);
END;
$$;

CREATE OR REPLACE FUNCTION public.att_cancel_correction(_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  UPDATE public.attendance_corrections SET status = 'cancelled'
   WHERE id = _id AND employee_id = _e.id AND status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Only your pending requests can be cancelled.'; END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Admin
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.att_admin_attendance(_from date, _to date, _emp uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.attendance.view');
  IF _from IS NULL OR _to IS NULL OR _to < _from OR _to - _from > 62 THEN
    RAISE EXCEPTION 'Choose a date range of at most 62 days.' USING ERRCODE = '22023';
  END IF;
  PERFORM public._att_close_overdue(_emp);
  RETURN jsonb_build_object(
    'rules', public.attendance_rules(),
    'employees', coalesce((SELECT jsonb_agg(jsonb_build_object('id', e.id, 'employee_code', e.employee_code,
                    'full_name', e.full_name, 'department', e.department, 'designation', e.designation,
                    'active', e.active, 'since', public._att_date(e.created_at)) ORDER BY e.full_name)
                  FROM public.employees e WHERE _emp IS NULL OR e.id = _emp), '[]'::jsonb),
    'days', coalesce((SELECT jsonb_agg(to_jsonb(d)) FROM public._att_days(_emp, _from, _to) d), '[]'::jsonb),
    'sessions', coalesce((SELECT jsonb_agg(public._att_session_json(a) ORDER BY a.punch_in_at)
                            FROM public.attendance_sessions a
                           WHERE (_emp IS NULL OR a.employee_id = _emp) AND a.work_date BETWEEN _from AND _to), '[]'::jsonb),
    'pending_corrections', (SELECT count(*) FROM public.attendance_corrections WHERE status = 'pending'));
END;
$$;

CREATE OR REPLACE FUNCTION public.att_admin_corrections(_status text DEFAULT 'pending')
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.attendance.view');
  RETURN coalesce((SELECT jsonb_agg(public._att_correction_json(c) ORDER BY c.created_at DESC)
                     FROM (SELECT * FROM public.attendance_corrections
                            WHERE _status = 'all' OR status = _status ORDER BY created_at DESC LIMIT 200) c), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.att_admin_decide_correction(_id uuid, _action text, _comment text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _c public.attendance_corrections; _chk record;
BEGIN
  PERFORM public.rbac_require('portal.attendance.approve');
  IF _action NOT IN ('approved', 'rejected') THEN RAISE EXCEPTION 'Choose approve or reject.' USING ERRCODE = '22023'; END IF;
  IF _action = 'rejected' AND length(trim(coalesce(_comment, ''))) = 0 THEN
    RAISE EXCEPTION 'Write a reason for rejecting.' USING ERRCODE = '22023';
  END IF;
  IF length(coalesce(_comment, '')) > 500 THEN RAISE EXCEPTION 'The comment can be at most 500 characters.' USING ERRCODE = '22023'; END IF;
  SELECT * INTO _c FROM public.attendance_corrections WHERE id = _id FOR UPDATE;
  IF _c.id IS NULL THEN RAISE EXCEPTION 'Correction request not found.' USING ERRCODE = 'P0002'; END IF;
  IF EXISTS (SELECT 1 FROM public.employees WHERE id = _c.employee_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'You cannot decide your own request.' USING ERRCODE = '42501';
  END IF;
  IF _c.status <> 'pending' THEN RAISE EXCEPTION 'This request was already %.', _c.status; END IF;

  IF _action = 'approved' THEN
    IF _c.old_in IS NOT NULL AND (_c.session_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.attendance_sessions WHERE id = _c.session_id)) THEN
      RAISE EXCEPTION 'The punch session of this request no longer exists.' USING ERRCODE = 'P0002';
    END IF;
    PERFORM pg_advisory_xact_lock(hashtextextended('att:' || _c.employee_id::text, 0));
    PERFORM public._att_close_overdue(_c.employee_id);
    SELECT * INTO _chk FROM public._att_correction_check(_c.employee_id, _c.work_date,
      CASE WHEN _c.old_in IS NULL THEN NULL ELSE _c.session_id END, _c.requested_in, _c.requested_out);
    IF _c.old_in IS NULL THEN
      INSERT INTO public.attendance_sessions (employee_id, work_date, punch_in_at, punch_out_at, corrected_at)
      VALUES (_c.employee_id, _c.work_date, _chk.new_in, _chk.new_out, now());
    ELSE
      UPDATE public.attendance_sessions SET punch_in_at = _chk.new_in, punch_out_at = _chk.new_out,
             auto_punched_out = false, corrected_at = now()
       WHERE id = _c.session_id;
    END IF;
  END IF;

  UPDATE public.attendance_corrections SET status = _action, decided_by = auth.uid(), decided_at = now(),
         decision_comment = nullif(trim(coalesce(_comment, '')), '')
   WHERE id = _id RETURNING * INTO _c;
  RETURN public._att_correction_json(_c);
END;
$$;

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public._att_settings(), public._att_date(timestamptz), public._att_at(date, time),
  public._att_me(), public._att_close_overdue(uuid), public._att_days(uuid, date, date),
  public._att_session_json(public.attendance_sessions), public._att_correction_json(public.attendance_corrections),
  public._att_correction_check(uuid, date, uuid, timestamptz, timestamptz),
  public.att_auto_punch_out_at(date, timestamptz)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.attendance_rules(), public.att_me(),
  public.att_punch_in(), public.att_punch_out(), public.att_my_attendance(date, date),
  public.att_request_correction(date, uuid, time, time, text), public.att_cancel_correction(uuid),
  public.att_admin_attendance(date, date, uuid), public.att_admin_corrections(text),
  public.att_admin_decide_correction(uuid, text, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.attendance_rules(), public.att_me(),
  public.att_punch_in(), public.att_punch_out(), public.att_my_attendance(date, date),
  public.att_request_correction(date, uuid, time, time, text), public.att_cancel_correction(uuid),
  public.att_admin_attendance(date, date, uuid), public.att_admin_corrections(text),
  public.att_admin_decide_correction(uuid, text, text)
  TO authenticated;
