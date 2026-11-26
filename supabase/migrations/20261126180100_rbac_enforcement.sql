-- Centralized Roles & Permissions, part 2: enforcement.
--
-- * Data scopes (none / own / team / department / all) applied inside every
--   admin function for Employees, Attendance and Leave, and in the read policies,
--   so out-of-scope records can't be reached by URL, API call or record id.
-- * Finer permissions: reset password, disable, personal details (phone and
--   joining date are hidden and left unchanged without it), leave allowances /
--   types / holidays.
-- * Website & leads data moves from the all-or-nothing website admin flag to
--   permissions (Super Admins keep full access: rbac_can is always true for them).
--   Features served by edge functions (Search Console, AR indexing check, Zoho
--   re-send, analytics refresh) still check the admin flag in the function code
--   and stay Super Admin only until those functions are republished.
-- Functions below are the previous definitions with exact, minimal patches.
-- Rollback: supabase/rollback/20261126180000_rbac_down.sql

CREATE OR REPLACE FUNCTION public.admin_list_employees()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE _personal boolean := public.rbac_can('portal.employees.personal');
BEGIN
  PERFORM public.rbac_require('portal.employees.view');
  RETURN coalesce((
    SELECT jsonb_agg(to_jsonb(e)
             || CASE WHEN _personal THEN '{}'::jsonb ELSE jsonb_build_object('phone', NULL, 'joined_on', NULL) END
             || jsonb_build_object(
             'roles', coalesce((SELECT jsonb_agg(ur.role_key) FROM public.rbac_user_roles ur WHERE ur.user_id = e.user_id), '[]'::jsonb),
             'manager_name', m.full_name,
             'reports_count', (SELECT count(*) FROM public.employees r WHERE r.reporting_manager_id = e.id AND r.active))
           ORDER BY e.active DESC, e.employee_code)
      FROM public.employees e LEFT JOIN public.employees m ON m.id = e.reporting_manager_id
     WHERE public.rbac_emp_in_scope(auth.uid(), 'employees', e.id)), '[]'::jsonb);
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_update_employee(_id uuid, _p jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  _uid   uuid;
  _roles text[] := public._portal_clean_roles(ARRAY(SELECT jsonb_array_elements_text(coalesce(_p->'roles', '[]'::jsonb))));
BEGIN
  PERFORM public.rbac_require('portal.employees.edit');
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'employees', _id) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
  SELECT user_id INTO _uid FROM public.employees WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
  IF _uid = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own employee record. Ask another administrator.' USING ERRCODE = '42501';
  END IF;
  PERFORM public._portal_check_employee(_id, _p, _roles);
  UPDATE public.employees SET
    employee_code        = upper(trim(_p->>'employee_code')),
    full_name            = trim(_p->>'full_name'),
    phone                = CASE WHEN public.rbac_can('portal.employees.personal') THEN nullif(trim(_p->>'phone'), '') ELSE phone END,
    department           = nullif(trim(_p->>'department'), ''),
    designation          = nullif(trim(_p->>'designation'), ''),
    joined_on            = CASE WHEN public.rbac_can('portal.employees.personal') THEN nullif(_p->>'joined_on', '')::date ELSE joined_on END,
    reporting_manager_id = nullif(_p->>'reporting_manager_id', '')::uuid,
    proposal_code        = CASE WHEN 'proposal_engineer' = ANY (_roles) THEN upper(trim(_p->>'proposal_code')) END,
    updated_at           = now()
  WHERE id = _id;
  IF _uid IS NOT NULL THEN PERFORM public._portal_set_roles(_uid, _roles); END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_set_employee_password(_id uuid, _password text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE _uid uuid;
BEGIN
  PERFORM public.rbac_require('portal.employees.reset_password');
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'employees', _id) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
  PERFORM public._portal_assert_password(_password);
  SELECT user_id INTO _uid FROM public.employees WHERE id = _id;
  IF _uid IS NULL THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
  IF public.has_role(_uid, 'admin') THEN
    RAISE EXCEPTION 'This person is a website administrator; they change their own password.' USING ERRCODE = '42501';
  END IF;
  UPDATE auth.users SET encrypted_password = extensions.crypt(_password, extensions.gen_salt('bf', 10)), updated_at = now()
   WHERE id = _uid;
  UPDATE public.employees SET must_change_password = true, updated_at = now() WHERE id = _id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_set_employee_active(_id uuid, _active boolean)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE _uid uuid;
BEGIN
  PERFORM public.rbac_require('portal.employees.disable');
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'employees', _id) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
  SELECT user_id INTO _uid FROM public.employees WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
  IF _uid = auth.uid() THEN RAISE EXCEPTION 'You cannot disable yourself.' USING ERRCODE = '42501'; END IF;
  IF NOT _active AND _uid IS NOT NULL AND public.has_role(_uid, 'admin') THEN
    RAISE EXCEPTION 'A website administrator cannot be disabled here.' USING ERRCODE = '42501';
  END IF;
  UPDATE public.employees SET active = _active, updated_at = now() WHERE id = _id;
  IF _uid IS NOT NULL THEN
    -- A real date, not 'infinity': the auth server cannot parse infinity and
    -- fails every sign-in for that user with "Database error querying schema".
    UPDATE auth.users SET banned_until = CASE WHEN _active THEN NULL ELSE '2999-12-31'::timestamptz END, updated_at = now()
     WHERE id = _uid;
    IF NOT _active THEN DELETE FROM auth.sessions WHERE user_id = _uid; END IF;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_delete_employee(_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE _uid uuid;
BEGIN
  PERFORM public.rbac_require('portal.employees.delete');
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'employees', _id) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
  SELECT user_id INTO _uid FROM public.employees WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
  IF _uid = auth.uid() THEN RAISE EXCEPTION 'You cannot delete yourself.' USING ERRCODE = '42501'; END IF;
  DELETE FROM public.employees WHERE id = _id;  -- reports' manager link is cleared (ON DELETE SET NULL)
  IF _uid IS NOT NULL AND NOT public.has_role(_uid, 'admin') THEN
    DELETE FROM auth.users WHERE id = _uid;     -- also removes their rbac_user_roles
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.att_admin_attendance(_from date, _to date, _emp uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
                  FROM public.employees e WHERE (_emp IS NULL OR e.id = _emp) AND public.rbac_emp_in_scope(auth.uid(), 'attendance', e.id)), '[]'::jsonb),
    'days', coalesce((SELECT jsonb_agg(to_jsonb(d)) FROM public._att_days(_emp, _from, _to) d WHERE public.rbac_emp_in_scope(auth.uid(), 'attendance', d.employee_id)), '[]'::jsonb),
    'sessions', coalesce((SELECT jsonb_agg(public._att_session_json(a) ORDER BY a.punch_in_at)
                            FROM public.attendance_sessions a
                           WHERE (_emp IS NULL OR a.employee_id = _emp) AND a.work_date BETWEEN _from AND _to
                             AND public.rbac_emp_in_scope(auth.uid(), 'attendance', a.employee_id)), '[]'::jsonb),
    'holidays', coalesce((SELECT jsonb_agg(jsonb_build_object('date', h.date, 'name', h.name) ORDER BY h.date)
                            FROM public.holidays h WHERE h.date BETWEEN _from AND _to), '[]'::jsonb),
    'leave', coalesce((SELECT jsonb_agg(jsonb_build_object('employee_id', r.employee_id, 'start_date', r.start_date,
                         'end_date', r.end_date, 'half_day', r.half_day, 'type', t.name))
                         FROM public.leave_requests r JOIN public.leave_types t ON t.id = r.leave_type_id
                        WHERE r.status = 'approved' AND r.start_date <= _to AND r.end_date >= _from
                          AND (_emp IS NULL OR r.employee_id = _emp) AND public.rbac_emp_in_scope(auth.uid(), 'attendance', r.employee_id)), '[]'::jsonb),
    'pending_corrections', (SELECT count(*) FROM public.attendance_corrections c WHERE c.status = 'pending' AND public.rbac_emp_in_scope(auth.uid(), 'attendance', c.employee_id)));
END;
$function$;

CREATE OR REPLACE FUNCTION public.att_admin_corrections(_status text DEFAULT 'pending'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  PERFORM public.rbac_require('portal.attendance.view');
  RETURN coalesce((SELECT jsonb_agg(public._att_correction_json(c) ORDER BY c.created_at DESC)
                     FROM (SELECT * FROM public.attendance_corrections
                            WHERE (_status = 'all' OR status = _status) AND public.rbac_emp_in_scope(auth.uid(), 'attendance', employee_id)
                            ORDER BY created_at DESC LIMIT 200) c), '[]'::jsonb);
END;
$function$;

CREATE OR REPLACE FUNCTION public.att_admin_decide_correction(_id uuid, _action text, _comment text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'attendance', _c.employee_id) THEN
    RAISE EXCEPTION 'This request is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
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
$function$;

CREATE OR REPLACE FUNCTION public.leave_admin_requests(_filter text DEFAULT 'action'::text, _year integer DEFAULT NULL::integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE _y int := coalesce(_year, extract(year FROM public._att_date(now()))::int);
BEGIN
  PERFORM public.rbac_require('portal.leave.view');
  RETURN coalesce((SELECT jsonb_agg(public._leave_json(r) ORDER BY
                      CASE r.status WHEN 'admin_review' THEN 0 WHEN 'manager_review' THEN 1 WHEN 'manager_final' THEN 2 ELSE 3 END,
                      r.start_date DESC)
                     FROM public.leave_requests r
                    WHERE public.rbac_emp_in_scope(auth.uid(), 'leave', r.employee_id) AND CASE _filter
                            WHEN 'action'  THEN r.status = 'admin_review'
                            WHEN 'pending' THEN r.status IN ('manager_review', 'admin_review', 'manager_final')
                            ELSE extract(year FROM r.start_date)::int = _y END), '[]'::jsonb);
END;
$function$;

CREATE OR REPLACE FUNCTION public.leave_admin_decide(_id uuid, _action text, _comment text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE _r public.leave_requests; _c text := nullif(trim(coalesce(_comment, '')), '');
BEGIN
  PERFORM public.rbac_require('portal.leave.approve');
  IF _action NOT IN ('approve', 'reject') THEN RAISE EXCEPTION 'Choose approve or reject.' USING ERRCODE = '22023'; END IF;
  IF _action = 'reject' AND _c IS NULL THEN RAISE EXCEPTION 'Write a reason for rejecting.' USING ERRCODE = '22023'; END IF;
  IF length(coalesce(_c, '')) > 500 THEN RAISE EXCEPTION 'The comment can be at most 500 characters.' USING ERRCODE = '22023'; END IF;
  SELECT * INTO _r FROM public.leave_requests WHERE id = _id FOR UPDATE;
  IF _r.id IS NULL THEN RAISE EXCEPTION 'Leave request not found.' USING ERRCODE = 'P0002'; END IF;
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'leave', _r.employee_id) THEN
    RAISE EXCEPTION 'This request is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
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
$function$;

CREATE OR REPLACE FUNCTION public.leave_admin_balances(_year integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  PERFORM public.rbac_require('portal.leave.view');
  RETURN jsonb_build_object(
    'year', _year,
    'employees', coalesce((SELECT jsonb_agg(jsonb_build_object('id', e.id, 'employee_code', e.employee_code, 'full_name', e.full_name,
                    'designation', e.designation, 'balances', public._leave_balances(e.id, _year)) ORDER BY e.full_name)
                  FROM public.employees e WHERE e.active AND public.rbac_emp_in_scope(auth.uid(), 'leave', e.id)), '[]'::jsonb));
END;
$function$;

CREATE OR REPLACE FUNCTION public.leave_admin_set_allowance(_emp uuid, _type uuid, _year integer, _days numeric)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  PERFORM public.rbac_require('portal.leave.allowances');
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'leave', _emp) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
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
$function$;

CREATE OR REPLACE FUNCTION public.leave_admin_save_type(_p jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  _id    uuid := nullif(_p->>'id', '')::uuid;
  _code  text := upper(trim(coalesce(_p->>'code', '')));
  _name  text := trim(coalesce(_p->>'name', ''));
  _days  numeric := nullif(_p->>'days_per_year', '')::numeric;
BEGIN
  PERFORM public.rbac_require('portal.leave.types');
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
$function$;

CREATE OR REPLACE FUNCTION public.leave_admin_save_holiday(_date date, _name text, _old_date date DEFAULT NULL::date)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE _n int := 0;
BEGIN
  PERFORM public.rbac_require('portal.leave.holidays');
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
$function$;

CREATE OR REPLACE FUNCTION public.leave_admin_delete_holiday(_date date)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  PERFORM public.rbac_require('portal.leave.holidays');
  DELETE FROM public.holidays WHERE date = _date;
  IF NOT FOUND THEN RAISE EXCEPTION 'Holiday not found.' USING ERRCODE = 'P0002'; END IF;
  RETURN public._leave_recount(_date);
END;
$function$;

CREATE OR REPLACE FUNCTION public.rbac_assignable_roles()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF NOT (public.rbac_can('portal.employees.view') OR public.rbac_can('settings.users.view')) THEN
    RAISE EXCEPTION 'You do not have permission for this.' USING ERRCODE = '42501';
  END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('key', r.key, 'name', r.name, 'description', r.description,
                     'sensitive', public._rbac_role_is_sensitive(r.key)) ORDER BY r.sort_order, r.name)
                     FROM public.rbac_roles r WHERE NOT r.implicit AND r.active), '[]'::jsonb);
END;
$function$;


-- ---------------------------------------------------------------------------
-- Read policies follow the data scope
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Employee admins read all" ON public.employees;
CREATE POLICY "Employee admins read all" ON public.employees FOR SELECT TO authenticated
  USING (public.rbac_can('portal.employees.view') AND public.rbac_emp_visible('employees', id));

DROP POLICY IF EXISTS "Read own or as attendance admin" ON public.attendance_sessions;
CREATE POLICY "Read own or as attendance admin" ON public.attendance_sessions FOR SELECT TO authenticated
  USING (employee_id = public.portal_my_employee_id()
         OR (public.rbac_can('portal.attendance.view') AND public.rbac_emp_visible('attendance', employee_id)));
DROP POLICY IF EXISTS "Read own or as attendance admin" ON public.attendance_corrections;
CREATE POLICY "Read own or as attendance admin" ON public.attendance_corrections FOR SELECT TO authenticated
  USING (employee_id = public.portal_my_employee_id()
         OR (public.rbac_can('portal.attendance.view') AND public.rbac_emp_visible('attendance', employee_id)));

-- (rbac_emp_visible checks the signed-in user only; the 3-argument helper stays internal.)
REVOKE ALL ON FUNCTION public.rbac_emp_in_scope(uuid, text, uuid) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Website & leads: permissions instead of the admin flag
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contacts: view" ON public.contact_submissions;
CREATE POLICY "Contacts: view" ON public.contact_submissions FOR SELECT TO authenticated USING (public.rbac_can('website.contacts.view'));
-- Contact submissions have no edit screen: updating stays Super Admin only ("Admins can update contact submissions").
DROP POLICY IF EXISTS "Contacts: change status" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Contacts: delete" ON public.contact_submissions;
CREATE POLICY "Contacts: delete" ON public.contact_submissions FOR DELETE TO authenticated USING (public.rbac_can('website.contacts.delete'));

DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can update job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Jobs: view" ON public.job_applications;
CREATE POLICY "Jobs: view" ON public.job_applications FOR SELECT TO authenticated USING (public.rbac_can('website.jobs.view'));
-- Status/prospect and HR notes are saved together; either permission may update,
-- and the trigger below stops a field the person may not change.
DROP POLICY IF EXISTS "Jobs: update" ON public.job_applications;
CREATE POLICY "Jobs: update" ON public.job_applications FOR UPDATE TO authenticated
  USING (public.rbac_can('website.jobs.edit') OR public.rbac_can('website.jobs.notes'))
  WITH CHECK (public.rbac_can('website.jobs.edit') OR public.rbac_can('website.jobs.notes'));
-- (Deleting applications has no screen; it stays with the Super Admin policy.)

CREATE OR REPLACE FUNCTION public._jobs_field_guard()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _o jsonb := to_jsonb(OLD) - 'hr_notes' - 'reviewed_at' - 'reviewed_by'; _n jsonb := to_jsonb(NEW) - 'hr_notes' - 'reviewed_at' - 'reviewed_by';
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN RETURN NEW; END IF;
  IF OLD.hr_notes IS DISTINCT FROM NEW.hr_notes AND NOT public.rbac_can('website.jobs.notes') THEN
    RAISE EXCEPTION 'You do not have permission to change HR notes.' USING ERRCODE = '42501';
  END IF;
  IF _o IS DISTINCT FROM _n AND NOT public.rbac_can('website.jobs.edit') THEN
    RAISE EXCEPTION 'You do not have permission to update applications.' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS jobs_field_guard ON public.job_applications;
CREATE TRIGGER jobs_field_guard BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public._jobs_field_guard();
REVOKE ALL ON FUNCTION public._jobs_field_guard() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Admins can view all download leads" ON public.download_leads;
DROP POLICY IF EXISTS "Download leads: view" ON public.download_leads;
CREATE POLICY "Download leads: view" ON public.download_leads FOR SELECT TO authenticated USING (public.rbac_can('website.downloads.view'));

DROP POLICY IF EXISTS "Admins can view all newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Newsletter: view" ON public.newsletter_subscribers;
CREATE POLICY "Newsletter: view" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.rbac_can('website.newsletter.view'));
DROP POLICY IF EXISTS "Newsletter: change status" ON public.newsletter_subscribers;
CREATE POLICY "Newsletter: change status" ON public.newsletter_subscribers FOR UPDATE TO authenticated
  USING (public.rbac_can('website.newsletter.edit')) WITH CHECK (public.rbac_can('website.newsletter.edit'));
-- ("Admins can manage newsletter subscribers" stays: Super Admin keeps insert/delete.)

DROP POLICY IF EXISTS "Admins can view ar index status" ON public.ar_index_status;
DROP POLICY IF EXISTS "Admins can view ar index events" ON public.ar_index_events;
DROP POLICY IF EXISTS "Admins can update ar index events" ON public.ar_index_events;
DROP POLICY IF EXISTS "Indexing: view status" ON public.ar_index_status;
CREATE POLICY "Indexing: view status" ON public.ar_index_status FOR SELECT TO authenticated USING (public.rbac_can('website.indexing.view'));
DROP POLICY IF EXISTS "Indexing: view events" ON public.ar_index_events;
CREATE POLICY "Indexing: view events" ON public.ar_index_events FOR SELECT TO authenticated USING (public.rbac_can('website.indexing.view'));
DROP POLICY IF EXISTS "Indexing: update events" ON public.ar_index_events;
CREATE POLICY "Indexing: update events" ON public.ar_index_events FOR UPDATE TO authenticated
  USING (public.rbac_can('website.indexing.edit')) WITH CHECK (public.rbac_can('website.indexing.edit'));

DROP POLICY IF EXISTS "Admins can view all resumes" ON storage.objects;
DROP POLICY IF EXISTS "Resumes: download" ON storage.objects;
CREATE POLICY "Resumes: download" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND public.rbac_can('website.jobs.download'));
-- CV files have no delete screen: deleting stays Super Admin only ("Admins can delete resumes").
DROP POLICY IF EXISTS "Resumes: delete" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete resumes" ON storage.objects;
CREATE POLICY "Admins can delete resumes" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND has_role(auth.uid(), 'admin'::app_role));
