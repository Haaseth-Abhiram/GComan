-- Leave: a half day can be the first half or the second half (like the Zyllo portal).
-- Safe to run more than once. Needs 20261126160000_leave.sql.
-- Rollback: supabase/rollback/20261127150000_leave_half_day_session_down.sql

BEGIN;

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

COMMIT;

NOTIFY pgrst, 'reload schema';

SELECT 'Half day: first or second half' AS part,
       to_regprocedure('public.leave_apply(uuid, date, date, boolean, text, text)') IS NOT NULL AS ok;
