-- Four fixed roles: Super Admin, Admin, Manager, Employee.
--
--   super_admin  website administrator (user_roles.role = 'admin'). Everything.
--   admin        NEW built-in role you assign. Website & leads, Employees,
--                Attendance, Leave; Users & Roles (cannot give Admin or Super
--                Admin) and can view the rest of Settings. A Super Admin can
--                change its permissions.
--   manager      can now be assigned, and is still automatic for anyone an
--                active employee reports to.
--   employee     automatic: every active employee (unchanged).
--
-- Proposal Engineer stops being a role. Proposal Tracker access is now a switch
-- on the person: it is ON when the employee has a tracker code (proposal_code).
-- People who had the role keep their code and their access.
--
-- Custom roles are removed. So nobody silently loses or gains access, each
-- holder of an ACTIVE custom role keeps the same permissions as personal "allow"
-- exceptions, and the same data scope as a personal scope. Inactive custom roles
-- gave nothing, so nothing is carried over for them.
-- A custom role whose key is already 'admin' becomes the built-in Admin role and
-- keeps its own permissions and people (no new permissions are added to it).
--
-- Everything removed is first copied to public.rbac_four_roles_backup.
-- Rollback: supabase/rollback/20261127090000_four_roles_down.sql

BEGIN;

-- ---------------------------------------------------------------------------
-- 0. Run once only; keep a copy of what changes
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.rbac_four_roles_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'The four-roles migration has already been applied. Nothing was changed.';
  END IF;
END;
$$;

CREATE TABLE public.rbac_four_roles_backup (
  id    bigserial PRIMARY KEY,
  kind  text NOT NULL,
  data  jsonb NOT NULL
);
ALTER TABLE public.rbac_four_roles_backup ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.rbac_four_roles_backup FROM anon, authenticated;

INSERT INTO public.rbac_four_roles_backup (kind, data) SELECT 'role', to_jsonb(t) FROM public.rbac_roles t;
INSERT INTO public.rbac_four_roles_backup (kind, data) SELECT 'role_permission', to_jsonb(t) FROM public.rbac_role_permissions t;
INSERT INTO public.rbac_four_roles_backup (kind, data) SELECT 'role_scope', to_jsonb(t) FROM public.rbac_role_scopes t;
INSERT INTO public.rbac_four_roles_backup (kind, data) SELECT 'user_role', to_jsonb(t) FROM public.rbac_user_roles t;
INSERT INTO public.rbac_four_roles_backup (kind, data) SELECT 'user_override', to_jsonb(t) FROM public.rbac_user_overrides t;
INSERT INTO public.rbac_four_roles_backup (kind, data) SELECT 'user_scope', to_jsonb(t) FROM public.rbac_user_scopes t;
INSERT INTO public.rbac_four_roles_backup (kind, data)
  SELECT 'proposal_code', jsonb_build_object('id', e.id, 'proposal_code', e.proposal_code)
    FROM public.employees e WHERE e.proposal_code IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 1. Proposal Tracker: the role becomes a per-person switch (the tracker code)
-- ---------------------------------------------------------------------------
-- A code without the role gave no access before, so it must not give access now.
UPDATE public.employees e SET proposal_code = NULL, updated_at = now()
 WHERE e.proposal_code IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM public.rbac_user_roles ur WHERE ur.user_id = e.user_id AND ur.role_key = 'proposal_engineer');

-- Role holders without a code get the next free one.
WITH need AS (
  SELECT e.id, row_number() OVER (ORDER BY e.created_at, e.employee_code) AS n
    FROM public.employees e
    JOIN public.rbac_user_roles ur ON ur.user_id = e.user_id AND ur.role_key = 'proposal_engineer'
   WHERE e.proposal_code IS NULL
), top AS (
  SELECT coalesce(max(substring(proposal_code FROM 2)::int), 0) AS m
    FROM public.employees WHERE proposal_code ~ '^P[0-9]+$'
)
UPDATE public.employees e SET proposal_code = 'P' || (top.m + need.n), updated_at = now()
  FROM need, top WHERE e.id = need.id;

-- An "allow" exception never worked without a tracker code; "deny" still applies.
DELETE FROM public.rbac_user_overrides WHERE permission_key = 'proposal.tracker.view' AND effect = 'allow';
DELETE FROM public.rbac_role_permissions WHERE permission_key = 'proposal.tracker.view';

-- ---------------------------------------------------------------------------
-- 2. An existing custom role keyed 'admin' becomes the built-in Admin
-- ---------------------------------------------------------------------------
-- If it was switched off it gave nothing: remove its people before switching it on.
DELETE FROM public.rbac_user_roles ur USING public.rbac_roles r
 WHERE r.key = ur.role_key AND r.key = 'admin' AND NOT r.active;

-- ---------------------------------------------------------------------------
-- 3. Custom roles: keep each holder's access, then delete the roles
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE _custom_holders ON COMMIT DROP AS
SELECT ur.user_id, r.key AS role_key, r.name AS role_name
  FROM public.rbac_user_roles ur
  JOIN public.rbac_roles r ON r.key = ur.role_key
 WHERE r.active AND r.key NOT IN ('super_admin', 'admin', 'manager', 'employee', 'proposal_engineer');

-- Permissions → personal "allow". An existing exception (a deny) wins.
INSERT INTO public.rbac_user_overrides (user_id, permission_key, effect, reason)
SELECT h.user_id, rp.permission_key, 'allow',
       left('Kept from the removed role(s): ' || string_agg(DISTINCT h.role_name, ', '), 300)
  FROM _custom_holders h
  JOIN public.rbac_role_permissions rp ON rp.role_key = h.role_key
 WHERE NOT EXISTS (SELECT 1 FROM public.rbac_role_permissions b
                    WHERE b.role_key = 'employee' AND b.permission_key = rp.permission_key)
 GROUP BY h.user_id, rp.permission_key
ON CONFLICT (user_id, permission_key) DO NOTHING;

-- Data scopes → personal scope, only where the custom role was wider than what
-- the person's remaining roles give. An existing personal scope wins.
INSERT INTO public.rbac_user_scopes (user_id, resource, scope)
SELECT w.user_id, w.resource, w.scope
  FROM (
    SELECT DISTINCT ON (h.user_id, rs.resource) h.user_id, rs.resource, rs.scope
      FROM _custom_holders h
      JOIN public.rbac_role_scopes rs ON rs.role_key = h.role_key
     ORDER BY h.user_id, rs.resource, public._rbac_scope_rank(rs.scope) DESC
  ) w
 WHERE public._rbac_scope_rank(w.scope) > coalesce((
         SELECT max(public._rbac_scope_rank(k.scope)) FROM public.rbac_role_scopes k
          WHERE k.resource = w.resource
            AND k.role_key = ANY (public.rbac_roles_of(w.user_id))
            AND k.role_key IN ('admin', 'manager', 'employee')), 0)
ON CONFLICT (user_id, resource) DO NOTHING;

-- Cascades to their role_permissions, role_scopes and user_roles.
DELETE FROM public.rbac_roles WHERE key NOT IN ('super_admin', 'admin', 'manager', 'employee');

-- ---------------------------------------------------------------------------
-- 4. The four roles
-- ---------------------------------------------------------------------------
DO $$
DECLARE _adopted boolean := EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = 'admin');
BEGIN
  INSERT INTO public.rbac_roles (key, name, description, area, sort_order, implicit, builtin, active)
  VALUES ('admin', 'Admin', 'Runs the website leads and the employee side: employees, attendance and leave.',
          'admin', 20, false, true, true)
  ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name, area = 'admin', sort_order = 20,
    implicit = false, builtin = true, active = true;

  -- Defaults only for a brand-new Admin role: every admin permission except
  -- changing what roles may do (that stays with the Super Admin).
  IF NOT _adopted THEN
    INSERT INTO public.rbac_role_permissions (role_key, permission_key)
    SELECT 'admin', p.key FROM public.rbac_permissions p
     WHERE p.area = 'admin' AND p.active AND p.key <> 'settings.roles.edit'
    ON CONFLICT DO NOTHING;
    INSERT INTO public.rbac_role_scopes (role_key, resource, scope)
    SELECT 'admin', s.key, 'all' FROM public.rbac_scope_resources s
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

UPDATE public.rbac_roles SET name = 'Super Admin', sort_order = 10, builtin = true, active = true WHERE key = 'super_admin';
UPDATE public.rbac_roles SET name = 'Manager', sort_order = 40, builtin = true, active = true, implicit = false,
  description = 'Sees their team and approves its leave.' WHERE key = 'manager';
UPDATE public.rbac_roles SET name = 'Employee', sort_order = 60, builtin = true, active = true WHERE key = 'employee';

ALTER TABLE public.rbac_roles ADD CONSTRAINT rbac_roles_four_only
  CHECK (key IN ('super_admin', 'admin', 'manager', 'employee'));

-- Creating, deleting and switching roles off no longer exist.
DROP FUNCTION IF EXISTS public.rbac_admin_save_role(text, text, text);
DROP FUNCTION IF EXISTS public.rbac_admin_delete_role(text, text);
DROP FUNCTION IF EXISTS public.rbac_admin_set_role_active(text, boolean);

-- ---------------------------------------------------------------------------
-- 5. Permission check: the Proposal Tracker follows the person's switch
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rbac_user_can(_user uuid, _perm text)
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _effect text;
BEGIN
  IF _user IS NULL THEN RETURN false; END IF;
  IF public.has_role(_user, 'admin') THEN RETURN true; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.rbac_permissions WHERE key = _perm AND active) THEN RETURN false; END IF;
  SELECT effect INTO _effect FROM public.rbac_user_overrides WHERE user_id = _user AND permission_key = _perm;
  IF _effect = 'deny' THEN RETURN false; END IF;
  IF _perm = 'proposal.tracker.view' THEN
    RETURN EXISTS (SELECT 1 FROM public.employees WHERE user_id = _user AND active AND proposal_code IS NOT NULL);
  END IF;
  IF _effect = 'allow' AND EXISTS (SELECT 1 FROM public.employees WHERE user_id = _user AND active) THEN RETURN true; END IF;
  RETURN EXISTS (SELECT 1 FROM public.rbac_role_permissions rp
                  WHERE rp.permission_key = _perm AND rp.role_key = ANY (public.rbac_roles_of(_user)));
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. Employee administration
-- ---------------------------------------------------------------------------
-- The tracker code to store: NULL when the switch is off, the given code or the
-- next free one when on, unchanged when the request doesn't mention it.
CREATE OR REPLACE FUNCTION public._portal_proposal_code(_p jsonb, _current text)
RETURNS text
LANGUAGE plpgsql SET search_path = ''
AS $$
DECLARE _code text := nullif(upper(trim(coalesce(_p->>'proposal_code', ''))), '');
BEGIN
  IF NOT _p ? 'proposal_access' THEN RETURN _current; END IF;
  IF NOT coalesce((_p->>'proposal_access')::boolean, false) THEN RETURN NULL; END IF;
  _code := coalesce(_code, _current);
  IF _code IS NULL THEN
    PERFORM pg_advisory_xact_lock(hashtextextended('proposal-code', 0));
    SELECT 'P' || (coalesce(max(substring(proposal_code FROM 2)::int), 0) + 1) INTO _code
      FROM public.employees WHERE proposal_code ~ '^P[0-9]+$';
  END IF;
  IF _code !~ '^P[0-9]+$' THEN
    RAISE EXCEPTION 'The tracker code is P followed by a number, e.g. P4.' USING ERRCODE = '22023';
  END IF;
  RETURN _code;
END;
$$;

-- An Admin holds sensitive permissions, so only a Super Admin may take over,
-- block or remove an Admin's login. (Stops someone with a single employee
-- permission from becoming an Admin by resetting an Admin's password.)
CREATE OR REPLACE FUNCTION public._portal_assert_can_manage_login(_uid uuid)
RETURNS void
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF _uid IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin')
     AND EXISTS (SELECT 1 FROM public.rbac_user_roles WHERE user_id = _uid AND role_key = 'admin') THEN
    RAISE EXCEPTION 'Only a Super Admin can do this to an Admin''s account.' USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public._portal_check_employee(_id uuid, _p jsonb, _roles text[])
RETURNS void
LANGUAGE plpgsql SET search_path = ''
AS $$
DECLARE _mgr uuid := nullif(_p->>'reporting_manager_id', '')::uuid; _cur uuid; _hops int := 0;
BEGIN
  IF length(trim(coalesce(_p->>'full_name', ''))) NOT BETWEEN 1 AND 120 THEN
    RAISE EXCEPTION 'Enter the employee''s full name.' USING ERRCODE = '22023';
  END IF;
  IF upper(trim(coalesce(_p->>'employee_code', ''))) !~ '^[A-Z0-9-]{2,20}$' THEN
    RAISE EXCEPTION 'Employee ID must be 2-20 letters, numbers or dashes, e.g. GC001.' USING ERRCODE = '22023';
  END IF;
  IF _mgr IS NOT NULL THEN
    IF _mgr = _id THEN RAISE EXCEPTION 'An employee cannot report to themselves.' USING ERRCODE = '22023'; END IF;
    IF NOT EXISTS (SELECT 1 FROM public.employees WHERE id = _mgr AND active) THEN
      RAISE EXCEPTION 'The reporting manager must be an active employee.' USING ERRCODE = '22023';
    END IF;
    -- No loops: walk up from the new manager; we must never reach this employee.
    _cur := _mgr;
    WHILE _cur IS NOT NULL AND _hops < 50 LOOP
      IF _cur = _id THEN
        RAISE EXCEPTION 'That manager reports (directly or indirectly) to this employee.' USING ERRCODE = '22023';
      END IF;
      SELECT reporting_manager_id INTO _cur FROM public.employees WHERE id = _cur;
      _hops := _hops + 1;
    END LOOP;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_create_employee(_p jsonb)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _uid   uuid := gen_random_uuid();
  _id    uuid := gen_random_uuid();
  _em    text := lower(trim(coalesce(_p->>'email', '')));
  _roles text[] := public._portal_clean_roles(ARRAY(SELECT jsonb_array_elements_text(coalesce(_p->'roles', '[]'::jsonb))));
BEGIN
  PERFORM public.rbac_require('portal.employees.create');
  PERFORM public._portal_check_employee(_id, _p, _roles);
  PERFORM public._portal_assert_password(_p->>'password');
  IF _em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(_em) > 254 THEN
    RAISE EXCEPTION 'Enter a valid email address.' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('portal-email:' || _em));
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = _em) THEN
    RAISE EXCEPTION 'A login with this email already exists. Use a different email.' USING ERRCODE = '23505';
  END IF;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', _uid, 'authenticated', 'authenticated', _em,
    extensions.crypt(_p->>'password', extensions.gen_salt('bf', 10)), now(),
    '', '', '', '',
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('name', trim(_p->>'full_name')), now(), now()
  );
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
  VALUES (_uid::text, _uid,
          jsonb_build_object('sub', _uid::text, 'email', _em, 'email_verified', true, 'phone_verified', false),
          'email', now(), now());

  INSERT INTO public.employees (id, employee_code, full_name, email, phone, department, designation, joined_on,
                                reporting_manager_id, proposal_code, user_id, created_by)
  VALUES (_id, upper(trim(_p->>'employee_code')), trim(_p->>'full_name'), _em,
          nullif(trim(_p->>'phone'), ''), nullif(trim(_p->>'department'), ''), nullif(trim(_p->>'designation'), ''),
          nullif(_p->>'joined_on', '')::date, nullif(_p->>'reporting_manager_id', '')::uuid,
          public._portal_proposal_code(_p, NULL),
          _uid, auth.uid());
  PERFORM public._portal_set_roles(_uid, _roles);
  RETURN _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_employee(_id uuid, _p jsonb)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _uid   uuid;
  _code  text;
  _roles text[] := public._portal_clean_roles(ARRAY(SELECT jsonb_array_elements_text(coalesce(_p->'roles', '[]'::jsonb))));
BEGIN
  PERFORM public.rbac_require('portal.employees.edit');
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'employees', _id) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
  SELECT user_id, proposal_code INTO _uid, _code FROM public.employees WHERE id = _id;
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
    proposal_code        = public._portal_proposal_code(_p, _code),
    updated_at           = now()
  WHERE id = _id;
  IF _uid IS NOT NULL THEN PERFORM public._portal_set_roles(_uid, _roles); END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_employee_password(_id uuid, _password text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
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
  PERFORM public._portal_assert_can_manage_login(_uid);
  UPDATE auth.users SET encrypted_password = extensions.crypt(_password, extensions.gen_salt('bf', 10)), updated_at = now()
   WHERE id = _uid;
  UPDATE public.employees SET must_change_password = true, updated_at = now() WHERE id = _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_employee_active(_id uuid, _active boolean)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
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
  PERFORM public._portal_assert_can_manage_login(_uid);
  UPDATE public.employees SET active = _active, updated_at = now() WHERE id = _id;
  IF _uid IS NOT NULL THEN
    -- A real date, not 'infinity': the auth server cannot parse infinity and
    -- fails every sign-in for that user with "Database error querying schema".
    UPDATE auth.users SET banned_until = CASE WHEN _active THEN NULL ELSE '2999-12-31'::timestamptz END, updated_at = now()
     WHERE id = _uid;
    IF NOT _active THEN DELETE FROM auth.sessions WHERE user_id = _uid; END IF;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_employee(_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _uid uuid;
BEGIN
  PERFORM public.rbac_require('portal.employees.delete');
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'employees', _id) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
  SELECT user_id INTO _uid FROM public.employees WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
  IF _uid = auth.uid() THEN RAISE EXCEPTION 'You cannot delete yourself.' USING ERRCODE = '42501'; END IF;
  PERFORM public._portal_assert_can_manage_login(_uid);
  DELETE FROM public.employees WHERE id = _id;  -- reports' manager link is cleared (ON DELETE SET NULL)
  IF _uid IS NOT NULL AND NOT public.has_role(_uid, 'admin') THEN
    DELETE FROM auth.users WHERE id = _uid;     -- also removes their rbac_user_roles
  END IF;
END;
$$;

-- Giving roles in Settings no longer touches the tracker code.
CREATE OR REPLACE FUNCTION public.rbac_admin_set_user_roles(_user uuid, _roles text[])
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('settings.users.edit');
  IF _user = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own roles. Ask another administrator.' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.employees WHERE user_id = _user) THEN
    RAISE EXCEPTION 'Only employees can be given roles. Add this person on the Employees page first.' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('rbac-roles', 0));
  PERFORM public._portal_set_roles(_user, public._portal_clean_roles(_roles));
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Manager is assignable: count its holders, and who may give it
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rbac_admin_overview()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT (public.rbac_can('settings.roles.view') OR public.rbac_can('settings.users.view') OR public.rbac_can('settings.audit.view')) THEN
    RAISE EXCEPTION 'You do not have permission for this (Settings).' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'can_edit_roles', public.rbac_can('settings.roles.edit'),
    'can_edit_users', public.rbac_can('settings.users.edit'),
    'is_super_admin', public.has_role(auth.uid(), 'admin'),
    'my_role_keys', to_jsonb(public.rbac_roles_of(auth.uid())),
    'roles', (SELECT jsonb_agg(jsonb_build_object(
                'key', r.key, 'name', r.name, 'description', r.description, 'implicit', r.implicit,
                'builtin', r.builtin, 'active', r.active,
                'users', CASE r.key
                           WHEN 'super_admin' THEN (SELECT count(*) FROM public.user_roles WHERE role = 'admin')
                           WHEN 'employee' THEN (SELECT count(*) FROM public.employees WHERE active)
                           WHEN 'manager' THEN (SELECT count(*) FROM public.employees m WHERE m.active AND (
                                                  EXISTS (SELECT 1 FROM public.employees e WHERE e.reporting_manager_id = m.id AND e.active)
                                                  OR EXISTS (SELECT 1 FROM public.rbac_user_roles ur WHERE ur.user_id = m.user_id AND ur.role_key = 'manager')))
                           ELSE (SELECT count(*) FROM public.rbac_user_roles ur JOIN public.employees e ON e.user_id = ur.user_id
                                  WHERE ur.role_key = r.key) END,
                'permissions', CASE WHEN r.key = 'super_admin'
                                    THEN (SELECT jsonb_agg(p.key) FROM public.rbac_permissions p WHERE p.active)
                                    ELSE coalesce((SELECT jsonb_agg(rp.permission_key) FROM public.rbac_role_permissions rp WHERE rp.role_key = r.key), '[]'::jsonb) END,
                'scopes', CASE WHEN r.key = 'super_admin'
                               THEN (SELECT jsonb_object_agg(s.key, 'all') FROM public.rbac_scope_resources s)
                               ELSE coalesce((SELECT jsonb_object_agg(rs.resource, rs.scope) FROM public.rbac_role_scopes rs WHERE rs.role_key = r.key), '{}'::jsonb) END)
              ORDER BY r.sort_order, r.name) FROM public.rbac_roles r),
    'permissions', (SELECT jsonb_agg(jsonb_build_object('key', p.key, 'area', p.area, 'module', p.grp, 'page', p.page, 'tab', p.tab,
                      'action', p.action_label, 'label', p.label, 'kind', p.kind, 'sensitive', p.sensitive, 'description', p.description)
                      ORDER BY p.sort_order) FROM public.rbac_permissions p WHERE p.active),
    'scope_resources', (SELECT jsonb_agg(jsonb_build_object('key', s.key, 'label', s.label, 'description', s.description, 'scopes', to_jsonb(s.scopes))
                          ORDER BY s.sort_order) FROM public.rbac_scope_resources s));
END;
$$;

CREATE OR REPLACE FUNCTION public._portal_set_roles(_user uuid, _roles text[])
RETURNS void
LANGUAGE plpgsql SET search_path = ''
AS $$
DECLARE _changed text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    FOR _changed IN
      SELECT role_key FROM public.rbac_user_roles WHERE user_id = _user AND NOT role_key = ANY (_roles)
      UNION
      SELECT x FROM unnest(_roles) x WHERE NOT EXISTS (SELECT 1 FROM public.rbac_user_roles WHERE user_id = _user AND role_key = x)
    LOOP
      IF public._rbac_role_is_sensitive(_changed) THEN
        RAISE EXCEPTION 'Only a Super Admin can give or remove the % role (it can change settings).',
          (SELECT name FROM public.rbac_roles WHERE key = _changed) USING ERRCODE = '42501';
      END IF;
      -- Manager's team permissions only reach the holder's own team, so whoever may
      -- assign roles may give it; any admin permission added to it still needs to be held.
      PERFORM public._rbac_assert_can_grant(CASE WHEN _changed = 'manager'
        THEN ARRAY(SELECT p.key FROM public.rbac_permissions p WHERE p.area = 'admin' AND p.key = ANY (public._rbac_role_perms(_changed)))
        ELSE public._rbac_role_perms(_changed) END);
    END LOOP;
  END IF;
  IF EXISTS (SELECT 1 FROM unnest(_roles) x JOIN public.rbac_roles r ON r.key = x WHERE NOT r.active) THEN
    RAISE EXCEPTION 'That role is inactive. Activate it first.' USING ERRCODE = '22023';
  END IF;
  DELETE FROM public.rbac_user_roles WHERE user_id = _user AND NOT role_key = ANY (_roles);
  INSERT INTO public.rbac_user_roles (user_id, role_key, granted_by)
  SELECT _user, r, auth.uid() FROM unnest(_roles) r
  ON CONFLICT DO NOTHING;
END;
$$;

-- ---------------------------------------------------------------------------
-- 8. Personal permissions and data scopes: Super Admin only
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rbac_admin_set_user_overrides(_user uuid, _overrides jsonb, _scopes jsonb)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _super boolean := public.has_role(auth.uid(), 'admin');
  _o jsonb; _res text; _scope text; _allow text[];
BEGIN
  PERFORM public.rbac_require('settings.users.edit');
  -- Admins give roles; only a Super Admin adds or lifts one person's exceptions.
  IF NOT _super THEN RAISE EXCEPTION 'Only a Super Admin can change personal permissions.' USING ERRCODE = '42501'; END IF;
  IF _user = auth.uid() THEN RAISE EXCEPTION 'You cannot change your own permissions. Ask another administrator.' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.employees WHERE user_id = _user) THEN
    RAISE EXCEPTION 'Personal permissions are only for employees.' USING ERRCODE = '22023';
  END IF;
  IF public.has_role(_user, 'admin') THEN
    RAISE EXCEPTION 'A Super Admin always has every permission.' USING ERRCODE = '22023';
  END IF;
  FOR _o IN SELECT * FROM jsonb_array_elements(coalesce(_overrides, '[]'::jsonb)) LOOP
    IF NOT EXISTS (SELECT 1 FROM public.rbac_permissions WHERE key = _o->>'key') OR _o->>'effect' NOT IN ('allow', 'deny') THEN
      RAISE EXCEPTION 'Invalid personal permission.' USING ERRCODE = '22023';
    END IF;
  END LOOP;
  IF NOT _super THEN
    IF EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(_overrides, '[]'::jsonb)) o WHERE o->>'key' LIKE 'settings.%')
       OR EXISTS (SELECT 1 FROM public.rbac_user_overrides WHERE user_id = _user AND permission_key LIKE 'settings.%') THEN
      RAISE EXCEPTION 'Only a Super Admin can change Settings permissions.' USING ERRCODE = '42501';
    END IF;
    _allow := ARRAY(SELECT o->>'key' FROM jsonb_array_elements(coalesce(_overrides, '[]'::jsonb)) o
                     WHERE o->>'effect' = 'allow'
                       AND NOT EXISTS (SELECT 1 FROM public.rbac_user_overrides x WHERE x.user_id = _user AND x.permission_key = o->>'key' AND x.effect = 'allow'));
    PERFORM public._rbac_assert_can_grant(_allow);
  END IF;

  DELETE FROM public.rbac_user_overrides WHERE user_id = _user
     AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(_overrides, '[]'::jsonb)) o
                      WHERE o->>'key' = permission_key AND o->>'effect' = effect);
  INSERT INTO public.rbac_user_overrides (user_id, permission_key, effect, reason, created_by)
  SELECT _user, o->>'key', o->>'effect', nullif(left(trim(coalesce(o->>'reason', '')), 300), ''), auth.uid()
    FROM jsonb_array_elements(coalesce(_overrides, '[]'::jsonb)) o
  ON CONFLICT (user_id, permission_key) DO UPDATE SET effect = EXCLUDED.effect, reason = EXCLUDED.reason;

  FOR _res IN SELECT key FROM public.rbac_scope_resources LOOP
    _scope := nullif(_scopes->>_res, '');
    IF _scope IS NULL THEN
      DELETE FROM public.rbac_user_scopes WHERE user_id = _user AND resource = _res;
    ELSE
      IF NOT EXISTS (SELECT 1 FROM public.rbac_scope_resources WHERE key = _res AND _scope = ANY (scopes)) THEN
        RAISE EXCEPTION 'Invalid scope % for %.', _scope, _res USING ERRCODE = '22023';
      END IF;
      IF NOT _super AND public._rbac_scope_rank(_scope) > public._rbac_scope_rank(public.rbac_user_scope(auth.uid(), _res)) THEN
        RAISE EXCEPTION 'You can only give a % scope up to your own.', _res USING ERRCODE = '42501';
      END IF;
      INSERT INTO public.rbac_user_scopes (user_id, resource, scope) VALUES (_user, _res, _scope)
      ON CONFLICT (user_id, resource) DO UPDATE SET scope = EXCLUDED.scope;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public._portal_proposal_code(jsonb, text), public._portal_assert_can_manage_login(uuid)
  FROM PUBLIC, anon, authenticated;

COMMIT;
