-- Employee Portal, step 3: leave (types, balances, holidays, approval chain).
--
-- Leave types are admin-managed (seeded with a standard corporate set; days
-- per year are editable, and can be overridden per employee per year).
-- Holidays are entered by the admin. Weekly off days (attendance_settings)
-- and holidays are never counted as leave days. Half a day is allowed on a
-- single-day request when the type allows it.
--
-- Approval chain:
--   employee has a manager (reporting_manager_id, active):
--     manager_review --manager forwards--> admin_review --admin approves--> manager_final --manager approves--> approved
--   no manager:  admin_review --admin approves--> approved
--   Anyone in the chain can reject (with a reason). The admin may act in place
--   of the manager at either manager step. Nobody decides their own request.
--   The employee can cancel while the request is still in manager_review or
--   admin_review (nobody has approved yet).
-- Pending requests count against the balance.

-- ---------------------------------------------------------------------------
-- 1. Permissions
-- ---------------------------------------------------------------------------
INSERT INTO public.rbac_permissions (key, area, label, description, sort_order) VALUES
  ('portal.leave.view',    'admin',  'Leave: view',      'See everyone''s leave, balances and holidays.',            30),
  ('portal.leave.approve', 'admin',  'Leave: approve',   'Approve or reject leave requests (admin step).',           31),
  ('portal.leave.edit',    'admin',  'Leave: settings',  'Edit leave types, allowances and holidays.',               32),
  ('emp.leave.create',     'portal', 'Apply for leave',  'Apply for your own leave.',                                 53),
  ('emp.leave.delete',     'portal', 'Cancel leave',     'Cancel your own leave before it is approved.',             54),
  ('team.leave.view',      'portal', 'Team leave',       'See your team''s leave requests.',                          61),
  ('team.leave.approve',   'portal', 'Approve team leave', 'Review and give final approval to your team''s leave.',   62)
ON CONFLICT (key) DO UPDATE SET area = EXCLUDED.area, label = EXCLUDED.label,
  description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('employee', 'emp.leave.create'), ('employee', 'emp.leave.delete'),
  ('manager', 'team.leave.view'), ('manager', 'team.leave.approve')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leave_types (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text NOT NULL UNIQUE CHECK (code ~ '^[A-Z]{1,6}$'),
  name            text NOT NULL UNIQUE CHECK (length(trim(name)) BETWEEN 1 AND 60),
  description     text NOT NULL DEFAULT '',
  days_per_year   numeric(5,1) CHECK (days_per_year IS NULL OR days_per_year >= 0),  -- null = no limit
  paid            boolean NOT NULL DEFAULT true,
  allow_half_day  boolean NOT NULL DEFAULT true,
  active          boolean NOT NULL DEFAULT true,
  sort_order      int NOT NULL DEFAULT 100,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.leave_types (code, name, description, days_per_year, paid, allow_half_day, sort_order) VALUES
  ('CL',  'Casual Leave',      'Planned personal time off.',                               12,   true,  true,  10),
  ('SL',  'Sick Leave',        'Illness; a medical certificate may be required.',          12,   true,  true,  20),
  ('EL',  'Emergency Leave',   'Urgent personal or family matters.',                        6,   true,  true,  30),
  ('UL',  'Unpaid Leave',      'Leave without pay; no yearly limit.',                    NULL,   false, true,  40)
ON CONFLICT (code) DO NOTHING;

-- Per-employee override of a type's days for one year.
CREATE TABLE IF NOT EXISTS public.leave_allowances (
  employee_id    uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type_id  uuid NOT NULL REFERENCES public.leave_types(id) ON DELETE CASCADE,
  year           int  NOT NULL CHECK (year BETWEEN 2000 AND 2100),
  days           numeric(5,1) NOT NULL CHECK (days >= 0),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (employee_id, leave_type_id, year)
);

CREATE TABLE IF NOT EXISTS public.holidays (
  date        date PRIMARY KEY,
  name        text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leave_requests (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id          uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type_id        uuid NOT NULL REFERENCES public.leave_types(id),
  start_date           date NOT NULL,
  end_date             date NOT NULL,
  half_day             boolean NOT NULL DEFAULT false,
  days                 numeric(5,1) NOT NULL CHECK (days >= 0),
  reason               text NOT NULL CHECK (length(trim(reason)) BETWEEN 1 AND 500),
  status               text NOT NULL CHECK (status IN ('manager_review', 'admin_review', 'manager_final', 'approved', 'rejected', 'cancelled')),
  manager_employee_id  uuid REFERENCES public.employees(id) ON DELETE SET NULL,  -- manager at the time of applying
  manager_by           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  manager_at           timestamptz,
  manager_comment      text,
  admin_by             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_at             timestamptz,
  admin_comment        text,
  final_by             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  final_at             timestamptz,
  final_comment        text,
  rejected_by          uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  rejected_comment     text,
  cancelled_note       text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date),
  CHECK (NOT half_day OR start_date = end_date)
);
CREATE INDEX IF NOT EXISTS leave_requests_employee ON public.leave_requests (employee_id, start_date DESC);
CREATE INDEX IF NOT EXISTS leave_requests_status ON public.leave_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS leave_requests_dates ON public.leave_requests (start_date, end_date);

ALTER TABLE public.leave_types      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests   ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.leave_types, public.leave_allowances, public.holidays, public.leave_requests FROM anon, authenticated;
-- Everything is read and written through the functions below.

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------
-- Leave days between two dates: weekly off days and holidays don't count.
CREATE OR REPLACE FUNCTION public._leave_count_days(_from date, _to date, _half boolean)
RETURNS numeric
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT (CASE WHEN _half THEN 0.5 ELSE 1 END) * count(*)
    FROM generate_series(_from, _to, interval '1 day') g(d)
   WHERE NOT (extract(isodow FROM g.d)::smallint = ANY ((public._att_settings()).weekly_off))
     AND NOT EXISTS (SELECT 1 FROM public.holidays h WHERE h.date = g.d::date);
$$;

CREATE OR REPLACE FUNCTION public._leave_entitled(_emp uuid, _type uuid, _year int)
RETURNS numeric
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT coalesce((SELECT a.days FROM public.leave_allowances a
                    WHERE a.employee_id = _emp AND a.leave_type_id = _type AND a.year = _year),
                  (SELECT t.days_per_year FROM public.leave_types t WHERE t.id = _type));
$$;

CREATE OR REPLACE FUNCTION public._leave_taken(_emp uuid, _type uuid, _year int, _statuses text[])
RETURNS numeric
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT coalesce(sum(r.days), 0) FROM public.leave_requests r
   WHERE r.employee_id = _emp AND r.leave_type_id = _type
     AND extract(year FROM r.start_date)::int = _year AND r.status = ANY (_statuses);
$$;

CREATE OR REPLACE FUNCTION public._leave_balances(_emp uuid, _year int)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT coalesce(jsonb_agg(jsonb_build_object(
           'id', t.id, 'code', t.code, 'name', t.name, 'description', t.description, 'paid', t.paid,
           'allow_half_day', t.allow_half_day, 'active', t.active,
           'entitled', public._leave_entitled(_emp, t.id, _year),
           'overridden', EXISTS (SELECT 1 FROM public.leave_allowances a WHERE a.employee_id = _emp AND a.leave_type_id = t.id AND a.year = _year),
           'used', public._leave_taken(_emp, t.id, _year, ARRAY['approved']),
           'pending', public._leave_taken(_emp, t.id, _year, ARRAY['manager_review', 'admin_review', 'manager_final']),
           'remaining', public._leave_entitled(_emp, t.id, _year)
                        - public._leave_taken(_emp, t.id, _year, ARRAY['approved', 'manager_review', 'admin_review', 'manager_final']))
         ORDER BY t.sort_order, t.name), '[]'::jsonb)
    FROM public.leave_types t
   WHERE t.active OR EXISTS (SELECT 1 FROM public.leave_requests r WHERE r.employee_id = _emp AND r.leave_type_id = t.id
                               AND extract(year FROM r.start_date)::int = _year AND r.status NOT IN ('rejected', 'cancelled'));
$$;

-- The user's display name (employee name, else login name/email).
CREATE OR REPLACE FUNCTION public._user_name(_uid uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT coalesce(e.full_name, u.raw_user_meta_data->>'name', u.email)
    FROM auth.users u LEFT JOIN public.employees e ON e.user_id = u.id WHERE u.id = _uid;
$$;

CREATE OR REPLACE FUNCTION public._leave_json(r public.leave_requests)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', r.id, 'start_date', r.start_date, 'end_date', r.end_date, 'half_day', r.half_day, 'days', r.days,
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

-- Validates a new request; returns the number of leave days.
CREATE OR REPLACE FUNCTION public._leave_check(_emp uuid, _type uuid, _from date, _to date, _half boolean, _exclude uuid DEFAULT NULL)
RETURNS numeric
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _t      public.leave_types;
  _today  date := public._att_date(now());
  _days   numeric;
  _left   numeric;
BEGIN
  SELECT * INTO _t FROM public.leave_types WHERE id = _type AND active;
  IF _t.id IS NULL THEN RAISE EXCEPTION 'Choose a leave type.' USING ERRCODE = '22023'; END IF;
  IF _from IS NULL OR _to IS NULL THEN RAISE EXCEPTION 'Choose the dates.' USING ERRCODE = '22023'; END IF;
  IF _to < _from THEN RAISE EXCEPTION 'The end date is before the start date.' USING ERRCODE = '22023'; END IF;
  IF _from < _today - 30 THEN
    RAISE EXCEPTION 'Leave can start at most 30 days in the past.' USING ERRCODE = '22023';
  END IF;
  IF extract(year FROM _from) <> extract(year FROM _to) THEN
    RAISE EXCEPTION 'A request cannot cross into the next year. Split it into two requests.' USING ERRCODE = '22023';
  END IF;
  IF _half AND _from <> _to THEN RAISE EXCEPTION 'A half day must be a single date.' USING ERRCODE = '22023'; END IF;
  IF _half AND NOT _t.allow_half_day THEN
    RAISE EXCEPTION '% cannot be taken as a half day.', _t.name USING ERRCODE = '22023';
  END IF;
  _days := public._leave_count_days(_from, _to, coalesce(_half, false));
  IF _days = 0 THEN
    RAISE EXCEPTION 'Those dates are all weekly off days or holidays — no leave is needed.' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (SELECT 1 FROM public.leave_requests r
              WHERE r.employee_id = _emp AND r.id IS DISTINCT FROM _exclude
                AND r.status NOT IN ('rejected', 'cancelled')
                AND daterange(r.start_date, r.end_date, '[]') && daterange(_from, _to, '[]')) THEN
    RAISE EXCEPTION 'You already have leave on some of these dates.' USING ERRCODE = '22023';
  END IF;
  IF _t.days_per_year IS NOT NULL THEN
    _left := public._leave_entitled(_emp, _type, extract(year FROM _from)::int)
             - public._leave_taken(_emp, _type, extract(year FROM _from)::int, ARRAY['approved', 'manager_review', 'admin_review', 'manager_final']);
    IF _days > _left THEN
      RAISE EXCEPTION 'Not enough % left: % day(s) requested, % remaining (pending requests included).',
        _t.name, trim(to_char(_days, 'FM999.0')), trim(to_char(greatest(_left, 0), 'FM999.0')) USING ERRCODE = '22023';
    END IF;
  END IF;
  RETURN _days;
END;
$$;

-- The active manager of an employee (or null).
CREATE OR REPLACE FUNCTION public._leave_manager(_emp uuid)
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT m.id FROM public.employees e JOIN public.employees m ON m.id = e.reporting_manager_id AND m.active
   WHERE e.id = _emp;
$$;

-- ---------------------------------------------------------------------------
-- 4. Employee
-- ---------------------------------------------------------------------------
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

CREATE OR REPLACE FUNCTION public.leave_preview(_type uuid, _from date, _to date, _half boolean)
RETURNS numeric
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  RETURN public._leave_check(_e.id, _type, _from, _to, coalesce(_half, false));
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_apply(_type uuid, _from date, _to date, _half boolean, _reason text)
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
  PERFORM pg_advisory_xact_lock(hashtextextended('leave:' || _e.id::text, 0));
  _days := public._leave_check(_e.id, _type, _from, _to, coalesce(_half, false));
  _mgr := public._leave_manager(_e.id);
  INSERT INTO public.leave_requests (employee_id, leave_type_id, start_date, end_date, half_day, days, reason, status, manager_employee_id)
  VALUES (_e.id, _type, _from, _to, coalesce(_half, false), _days, trim(_reason),
          CASE WHEN _mgr IS NULL THEN 'admin_review' ELSE 'manager_review' END, _mgr)
  RETURNING * INTO _r;
  RETURN public._leave_json(_r);
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_cancel(_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  PERFORM public.rbac_require('emp.leave.delete');
  UPDATE public.leave_requests SET status = 'cancelled', updated_at = now()
   WHERE id = _id AND employee_id = _e.id AND status IN ('manager_review', 'admin_review');
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Only your requests that nobody has approved yet can be cancelled.';
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. Manager
-- ---------------------------------------------------------------------------
-- Requests of the signed-in manager's team: the ones waiting for them, plus recent ones.
CREATE OR REPLACE FUNCTION public.leave_team_requests()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  IF NOT public.rbac_can('team.leave.view') THEN RETURN '[]'::jsonb; END IF;
  RETURN coalesce((SELECT jsonb_agg(public._leave_json(r) || jsonb_build_object(
                     'my_turn', r.manager_employee_id = _e.id AND r.status IN ('manager_review', 'manager_final'))
                   ORDER BY (r.manager_employee_id = _e.id AND r.status IN ('manager_review', 'manager_final')) DESC, r.start_date DESC)
                     FROM public.leave_requests r
                    WHERE r.employee_id <> _e.id
                      AND (r.manager_employee_id = _e.id
                           OR r.employee_id IN (SELECT id FROM public.employees WHERE reporting_manager_id = _e.id))
                      AND (r.status IN ('manager_review', 'admin_review', 'manager_final') OR r.start_date >= public._att_date(now()) - 60)), '[]'::jsonb);
END;
$$;

-- action: 'approve' (forward at the review step / final approval at the final step) or 'reject'.
CREATE OR REPLACE FUNCTION public.leave_manager_decide(_id uuid, _action text, _comment text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me(); _r public.leave_requests; _c text := nullif(trim(coalesce(_comment, '')), '');
BEGIN
  PERFORM public.rbac_require('team.leave.approve');
  IF _action NOT IN ('approve', 'reject') THEN RAISE EXCEPTION 'Choose approve or reject.' USING ERRCODE = '22023'; END IF;
  IF _action = 'reject' AND _c IS NULL THEN RAISE EXCEPTION 'Write a reason for rejecting.' USING ERRCODE = '22023'; END IF;
  IF length(coalesce(_c, '')) > 500 THEN RAISE EXCEPTION 'The comment can be at most 500 characters.' USING ERRCODE = '22023'; END IF;
  SELECT * INTO _r FROM public.leave_requests WHERE id = _id FOR UPDATE;
  IF _r.id IS NULL THEN RAISE EXCEPTION 'Leave request not found.' USING ERRCODE = 'P0002'; END IF;
  IF _r.employee_id = _e.id THEN RAISE EXCEPTION 'You cannot decide your own request.' USING ERRCODE = '42501'; END IF;
  IF _r.manager_employee_id IS DISTINCT FROM _e.id THEN
    RAISE EXCEPTION 'Only this employee''s manager can do this.' USING ERRCODE = '42501';
  END IF;
  IF _r.status NOT IN ('manager_review', 'manager_final') THEN
    RAISE EXCEPTION 'This request is not waiting for you (it is %).', replace(_r.status, '_', ' ');
  END IF;

  IF _action = 'reject' THEN
    UPDATE public.leave_requests SET status = 'rejected', rejected_by = auth.uid(), rejected_comment = _c,
           manager_by = CASE WHEN status = 'manager_review' THEN auth.uid() ELSE manager_by END,
           manager_at = CASE WHEN status = 'manager_review' THEN now() ELSE manager_at END,
           final_by = CASE WHEN status = 'manager_final' THEN auth.uid() ELSE final_by END,
           final_at = CASE WHEN status = 'manager_final' THEN now() ELSE final_at END,
           updated_at = now()
     WHERE id = _id RETURNING * INTO _r;
  ELSIF _r.status = 'manager_review' THEN
    UPDATE public.leave_requests SET status = 'admin_review', manager_by = auth.uid(), manager_at = now(),
           manager_comment = _c, updated_at = now()
     WHERE id = _id RETURNING * INTO _r;
  ELSE
    -- Final approval: re-check the balance and dates are still valid.
    PERFORM public._leave_check(_r.employee_id, _r.leave_type_id, _r.start_date, _r.end_date, _r.half_day, _r.id);
    UPDATE public.leave_requests SET status = 'approved', final_by = auth.uid(), final_at = now(),
           final_comment = _c, updated_at = now()
     WHERE id = _id RETURNING * INTO _r;
  END IF;
  RETURN public._leave_json(_r);
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. Admin
-- ---------------------------------------------------------------------------
-- _filter: 'action' (waiting for the admin, incl. manager steps the admin can take over), 'pending' (any pending) or 'all'.
CREATE OR REPLACE FUNCTION public.leave_admin_requests(_filter text DEFAULT 'action', _year int DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _y int := coalesce(_year, extract(year FROM public._att_date(now()))::int);
BEGIN
  PERFORM public.rbac_require('portal.leave.view');
  RETURN coalesce((SELECT jsonb_agg(public._leave_json(r) ORDER BY
                      CASE r.status WHEN 'admin_review' THEN 0 WHEN 'manager_review' THEN 1 WHEN 'manager_final' THEN 2 ELSE 3 END,
                      r.start_date DESC)
                     FROM public.leave_requests r
                    WHERE CASE _filter
                            WHEN 'action'  THEN r.status = 'admin_review'
                            WHEN 'pending' THEN r.status IN ('manager_review', 'admin_review', 'manager_final')
                            ELSE extract(year FROM r.start_date)::int = _y END), '[]'::jsonb);
END;
$$;

-- action 'approve' | 'reject'. At a manager step the admin acts in place of the manager.
CREATE OR REPLACE FUNCTION public.leave_admin_decide(_id uuid, _action text, _comment text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _r public.leave_requests; _c text := nullif(trim(coalesce(_comment, '')), '');
BEGIN
  PERFORM public.rbac_require('portal.leave.approve');
  IF _action NOT IN ('approve', 'reject') THEN RAISE EXCEPTION 'Choose approve or reject.' USING ERRCODE = '22023'; END IF;
  IF _action = 'reject' AND _c IS NULL THEN RAISE EXCEPTION 'Write a reason for rejecting.' USING ERRCODE = '22023'; END IF;
  IF length(coalesce(_c, '')) > 500 THEN RAISE EXCEPTION 'The comment can be at most 500 characters.' USING ERRCODE = '22023'; END IF;
  SELECT * INTO _r FROM public.leave_requests WHERE id = _id FOR UPDATE;
  IF _r.id IS NULL THEN RAISE EXCEPTION 'Leave request not found.' USING ERRCODE = 'P0002'; END IF;
  IF EXISTS (SELECT 1 FROM public.employees WHERE id = _r.employee_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'You cannot decide your own request.' USING ERRCODE = '42501';
  END IF;
  IF _r.status NOT IN ('manager_review', 'admin_review', 'manager_final') THEN
    RAISE EXCEPTION 'This request was already %.', _r.status;
  END IF;

  IF _action = 'reject' THEN
    UPDATE public.leave_requests SET status = 'rejected', rejected_by = auth.uid(), rejected_comment = _c, updated_at = now()
     WHERE id = _id RETURNING * INTO _r;
    RETURN public._leave_json(_r);
  END IF;

  PERFORM public._leave_check(_r.employee_id, _r.leave_type_id, _r.start_date, _r.end_date, _r.half_day, _r.id);
  IF _r.status = 'manager_final' THEN
    -- Final approval in place of the manager.
    UPDATE public.leave_requests SET status = 'approved', final_by = auth.uid(), final_at = now(),
           final_comment = coalesce(_c, 'Approved by the admin in place of the manager'), updated_at = now()
     WHERE id = _id RETURNING * INTO _r;
  ELSE
    -- Admin approval (at manager_review this also stands in for the manager's review).
    UPDATE public.leave_requests SET
           manager_by = CASE WHEN status = 'manager_review' THEN auth.uid() ELSE manager_by END,
           manager_at = CASE WHEN status = 'manager_review' THEN now() ELSE manager_at END,
           manager_comment = CASE WHEN status = 'manager_review' THEN 'Reviewed by the admin in place of the manager' ELSE manager_comment END,
           admin_by = auth.uid(), admin_at = now(), admin_comment = _c,
           -- The manager still gives final approval, unless there is no active manager any more.
           status = CASE WHEN public._leave_manager(employee_id) IS NOT NULL AND manager_employee_id = public._leave_manager(employee_id)
                         THEN 'manager_final' ELSE 'approved' END,
           updated_at = now()
     WHERE id = _id RETURNING * INTO _r;
  END IF;
  RETURN public._leave_json(_r);
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_admin_balances(_year int)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.leave.view');
  RETURN jsonb_build_object(
    'year', _year,
    'employees', coalesce((SELECT jsonb_agg(jsonb_build_object('id', e.id, 'employee_code', e.employee_code, 'full_name', e.full_name,
                    'designation', e.designation, 'balances', public._leave_balances(e.id, _year)) ORDER BY e.full_name)
                  FROM public.employees e WHERE e.active), '[]'::jsonb));
END;
$$;

-- _days null = go back to the leave type's default.
CREATE OR REPLACE FUNCTION public.leave_admin_set_allowance(_emp uuid, _type uuid, _year int, _days numeric)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.leave.edit');
  IF EXISTS (SELECT 1 FROM public.employees WHERE id = _emp AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'You cannot change your own leave allowance.' USING ERRCODE = '42501';
  END IF;
  IF _days IS NULL THEN
    DELETE FROM public.leave_allowances WHERE employee_id = _emp AND leave_type_id = _type AND year = _year;
  ELSE
    IF _days < 0 OR _days > 366 OR _days * 2 <> floor(_days * 2) THEN
      RAISE EXCEPTION 'Enter 0–366 days in steps of 0.5.' USING ERRCODE = '22023';
    END IF;
    INSERT INTO public.leave_allowances (employee_id, leave_type_id, year, days) VALUES (_emp, _type, _year, _days)
    ON CONFLICT (employee_id, leave_type_id, year) DO UPDATE SET days = EXCLUDED.days, updated_at = now();
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_admin_types()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.leave.view');
  RETURN coalesce((SELECT jsonb_agg(to_jsonb(t) ORDER BY t.sort_order, t.name) FROM public.leave_types t), '[]'::jsonb);
END;
$$;

-- Insert (no id) or update a leave type. _p: id?, code, name, description, days_per_year (null = no limit), paid, allow_half_day, active
CREATE OR REPLACE FUNCTION public.leave_admin_save_type(_p jsonb)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _id    uuid := nullif(_p->>'id', '')::uuid;
  _code  text := upper(trim(coalesce(_p->>'code', '')));
  _name  text := trim(coalesce(_p->>'name', ''));
  _days  numeric := nullif(_p->>'days_per_year', '')::numeric;
BEGIN
  PERFORM public.rbac_require('portal.leave.edit');
  IF _code !~ '^[A-Z]{1,6}$' THEN RAISE EXCEPTION 'The code must be 1–6 letters, e.g. AL.' USING ERRCODE = '22023'; END IF;
  IF length(_name) NOT BETWEEN 1 AND 60 THEN RAISE EXCEPTION 'Enter a name.' USING ERRCODE = '22023'; END IF;
  IF _days IS NOT NULL AND (_days < 0 OR _days > 366 OR _days * 2 <> floor(_days * 2)) THEN
    RAISE EXCEPTION 'Days per year: 0–366 in steps of 0.5, or empty for no limit.' USING ERRCODE = '22023';
  END IF;
  IF _id IS NULL THEN
    INSERT INTO public.leave_types (code, name, description, days_per_year, paid, allow_half_day, active, sort_order)
    VALUES (_code, _name, trim(coalesce(_p->>'description', '')), _days, coalesce((_p->>'paid')::boolean, true),
            coalesce((_p->>'allow_half_day')::boolean, true), coalesce((_p->>'active')::boolean, true),
            coalesce((SELECT max(sort_order) + 10 FROM public.leave_types), 10))
    RETURNING id INTO _id;
  ELSE
    UPDATE public.leave_types SET code = _code, name = _name, description = trim(coalesce(_p->>'description', '')),
           days_per_year = _days, paid = coalesce((_p->>'paid')::boolean, paid),
           allow_half_day = coalesce((_p->>'allow_half_day')::boolean, allow_half_day),
           active = coalesce((_p->>'active')::boolean, active), updated_at = now()
     WHERE id = _id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Leave type not found.' USING ERRCODE = 'P0002'; END IF;
  END IF;
  RETURN _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_admin_holidays(_year int)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.leave.view');
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('date', h.date, 'name', h.name) ORDER BY h.date)
                     FROM public.holidays h WHERE extract(year FROM h.date)::int = _year), '[]'::jsonb);
END;
$$;

-- After holidays change: recount open/approved leave that covers the date; a request
-- left with 0 days (every date is now off) is cancelled. Returns how many changed.
CREATE OR REPLACE FUNCTION public._leave_recount(_date date)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _r record; _n int := 0; _d numeric;
BEGIN
  FOR _r IN SELECT * FROM public.leave_requests
             WHERE status NOT IN ('rejected', 'cancelled') AND _date BETWEEN start_date AND end_date FOR UPDATE LOOP
    _d := public._leave_count_days(_r.start_date, _r.end_date, _r.half_day);
    IF _d = 0 THEN
      UPDATE public.leave_requests SET days = 0, status = 'cancelled',
             cancelled_note = 'Cancelled automatically: every date became a holiday.', updated_at = now() WHERE id = _r.id;
      _n := _n + 1;
    ELSIF _d <> _r.days THEN
      UPDATE public.leave_requests SET days = _d, updated_at = now() WHERE id = _r.id;
      _n := _n + 1;
    END IF;
  END LOOP;
  RETURN _n;
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_admin_save_holiday(_date date, _name text, _old_date date DEFAULT NULL)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _n int := 0;
BEGIN
  PERFORM public.rbac_require('portal.leave.edit');
  IF _date IS NULL THEN RAISE EXCEPTION 'Choose a date.' USING ERRCODE = '22023'; END IF;
  IF length(trim(coalesce(_name, ''))) NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'Enter the holiday name.' USING ERRCODE = '22023'; END IF;
  IF _old_date IS NOT NULL AND _old_date <> _date THEN
    DELETE FROM public.holidays WHERE date = _old_date;
    _n := _n + public._leave_recount(_old_date);
  END IF;
  INSERT INTO public.holidays (date, name) VALUES (_date, trim(_name))
  ON CONFLICT (date) DO UPDATE SET name = EXCLUDED.name;
  RETURN _n + public._leave_recount(_date);
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_admin_delete_holiday(_date date)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.leave.edit');
  DELETE FROM public.holidays WHERE date = _date;
  IF NOT FOUND THEN RAISE EXCEPTION 'Holiday not found.' USING ERRCODE = 'P0002'; END IF;
  RETURN public._leave_recount(_date);
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Attendance knows about holidays and leave
-- ---------------------------------------------------------------------------
-- Why a date is off for an employee: weekly off, holiday, or approved leave (null = working day).
CREATE OR REPLACE FUNCTION public._day_off(_emp uuid, _d date)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT coalesce(
    (SELECT jsonb_build_object('kind', 'holiday', 'name', h.name) FROM public.holidays h WHERE h.date = _d),
    (SELECT jsonb_build_object('kind', 'leave', 'name', t.name, 'half_day', r.half_day)
       FROM public.leave_requests r JOIN public.leave_types t ON t.id = r.leave_type_id
      WHERE r.employee_id = _emp AND r.status = 'approved' AND _d BETWEEN r.start_date AND r.end_date
      ORDER BY r.half_day LIMIT 1),
    CASE WHEN extract(isodow FROM _d)::smallint = ANY ((public._att_settings()).weekly_off)
         THEN jsonb_build_object('kind', 'weekly', 'name', 'Weekly off') END);
$$;

CREATE OR REPLACE FUNCTION public.att_me()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e     public.employees := public._att_me();
  _today date := public._att_date(now());
  _open  public.attendance_sessions;
  _off   jsonb;
BEGIN
  PERFORM public._att_close_overdue(_e.id);
  SELECT * INTO _open FROM public.attendance_sessions WHERE employee_id = _e.id AND punch_out_at IS NULL;
  _off := public._day_off(_e.id, _today);
  RETURN jsonb_build_object(
    'rules', public.attendance_rules(),
    'today', _today,
    -- A half day of leave is still a working day (they punch in for the other half).
    'is_weekly_off', _off IS NOT NULL AND NOT coalesce((_off->>'half_day')::boolean, false),
    'day_off', _off,
    'open_session', CASE WHEN _open.id IS NULL THEN NULL ELSE public._att_session_json(_open) END,
    'today_summary', (SELECT to_jsonb(d) FROM public._att_days(_e.id, _today, _today) d),
    'today_sessions', coalesce((SELECT jsonb_agg(public._att_session_json(a) ORDER BY a.punch_in_at)
                                  FROM public.attendance_sessions a WHERE a.employee_id = _e.id AND a.work_date = _today), '[]'::jsonb));
END;
$$;

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
    'holidays', coalesce((SELECT jsonb_agg(jsonb_build_object('date', h.date, 'name', h.name) ORDER BY h.date)
                            FROM public.holidays h WHERE h.date BETWEEN _from AND _to), '[]'::jsonb),
    'leave', coalesce((SELECT jsonb_agg(jsonb_build_object('employee_id', r.employee_id, 'start_date', r.start_date,
                         'end_date', r.end_date, 'half_day', r.half_day, 'type', t.name))
                         FROM public.leave_requests r JOIN public.leave_types t ON t.id = r.leave_type_id
                        WHERE r.status = 'approved' AND r.start_date <= _to AND r.end_date >= _from
                          AND (_emp IS NULL OR r.employee_id = _emp)), '[]'::jsonb),
    'pending_corrections', (SELECT count(*) FROM public.attendance_corrections WHERE status = 'pending'));
END;
$$;

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public._leave_count_days(date, date, boolean), public._leave_entitled(uuid, uuid, int),
  public._leave_taken(uuid, uuid, int, text[]), public._leave_balances(uuid, int), public._user_name(uuid),
  public._leave_json(public.leave_requests), public._leave_check(uuid, uuid, date, date, boolean, uuid),
  public._leave_manager(uuid), public._leave_recount(date), public._day_off(uuid, date)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.leave_overview(int), public.leave_preview(uuid, date, date, boolean),
  public.leave_apply(uuid, date, date, boolean, text), public.leave_cancel(uuid),
  public.leave_team_requests(), public.leave_manager_decide(uuid, text, text),
  public.leave_admin_requests(text, int), public.leave_admin_decide(uuid, text, text),
  public.leave_admin_balances(int), public.leave_admin_set_allowance(uuid, uuid, int, numeric),
  public.leave_admin_types(), public.leave_admin_save_type(jsonb), public.leave_admin_holidays(int),
  public.leave_admin_save_holiday(date, text, date), public.leave_admin_delete_holiday(date)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.leave_overview(int), public.leave_preview(uuid, date, date, boolean),
  public.leave_apply(uuid, date, date, boolean, text), public.leave_cancel(uuid),
  public.leave_team_requests(), public.leave_manager_decide(uuid, text, text),
  public.leave_admin_requests(text, int), public.leave_admin_decide(uuid, text, text),
  public.leave_admin_balances(int), public.leave_admin_set_allowance(uuid, uuid, int, numeric),
  public.leave_admin_types(), public.leave_admin_save_type(jsonb), public.leave_admin_holidays(int),
  public.leave_admin_save_holiday(date, text, date), public.leave_admin_delete_holiday(date)
  TO authenticated;
