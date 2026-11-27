-- =====================================================================================
-- APPLY THIS ONE FILE to bring the database up to date with the website.
-- Supabase / Lovable -> SQL editor: paste the whole file and Run, ONCE.
--
--   * It is the six migrations 20261127090000 ... 140000, in order, as ONE
--     transaction: everything is applied, or nothing is.
--   * Back up the database first.
--   * Needs the earlier migrations (up to 20261126180100) already applied.
--   * The last result shows one row per part; every "ok" should be true.
-- Undo: the files in supabase/rollback/, newest first.
-- =====================================================================================

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.rbac_scope_resources') IS NULL THEN
    RAISE EXCEPTION 'The earlier Employee Portal migrations (up to 20261126180100) are missing. Nothing was changed.';
  END IF;
  IF to_regclass('public.rbac_four_roles_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'The four-roles change is already applied. Run only the newer files from supabase/migrations. Nothing was changed.';
  END IF;
END;
$$;

-- ===================== 20261127090000_four_roles.sql =====================

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

-- ===================== 20261127100000_admin_change_email.sql =====================

-- Settings → Users & Roles → "Change email": a Super Admin changes the email a
-- person signs in with.
--
--   * Super Admin only (changing a login email is a way to take an account over).
--   * Not your own email.
--   * The password stays the same. The person is signed out, and password-reset
--     links already sent to the old address stop working.
--   * Written to the Settings audit log.
-- Run after 20261127090000_four_roles.sql.
-- Rollback: DROP FUNCTION public.rbac_admin_change_email(uuid, text);

CREATE OR REPLACE FUNCTION public.rbac_admin_change_email(_user uuid, _email text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _new text := lower(trim(coalesce(_email, '')));
  _old text;
BEGIN
  IF NOT coalesce(public.has_role(auth.uid(), 'admin'), false) THEN
    RAISE EXCEPTION 'Only a Super Admin can change a sign-in email.' USING ERRCODE = '42501';
  END IF;
  IF _user = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own email here. Ask another Super Admin.' USING ERRCODE = '42501';
  END IF;
  IF _new !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(_new) > 254 THEN
    RAISE EXCEPTION 'Enter a valid email address.' USING ERRCODE = '22023';
  END IF;
  SELECT lower(email) INTO _old FROM auth.users WHERE id = _user;
  IF NOT FOUND THEN RAISE EXCEPTION 'User not found.' USING ERRCODE = 'P0002'; END IF;
  IF _new = _old THEN
    RAISE EXCEPTION 'That is already their email.' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('portal-email:' || _new));
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = _new AND id <> _user)
     OR EXISTS (SELECT 1 FROM public.employees WHERE email = _new AND user_id IS DISTINCT FROM _user) THEN
    RAISE EXCEPTION 'This email already belongs to another person.' USING ERRCODE = '23505';
  END IF;

  UPDATE auth.users
     SET email = _new, recovery_token = '', confirmation_token = '', email_change = '', email_change_token_new = '',
         updated_at = now()
   WHERE id = _user;
  UPDATE auth.identities
     SET identity_data = identity_data || jsonb_build_object('email', _new), updated_at = now()
   WHERE user_id = _user AND provider = 'email';
  -- Newer auth servers also keep pending reset / confirm tokens here.
  IF to_regclass('auth.one_time_tokens') IS NOT NULL THEN
    EXECUTE 'DELETE FROM auth.one_time_tokens WHERE user_id = $1' USING _user;
  END IF;
  DELETE FROM auth.sessions WHERE user_id = _user;
  UPDATE public.employees SET email = _new, updated_at = now() WHERE user_id = _user;

  INSERT INTO public.rbac_audit_log (actor, actor_name, entity, action, user_id, user_name, old_value, new_value)
  VALUES (auth.uid(),
          (SELECT coalesce(e.full_name, u.raw_user_meta_data->>'name', u.email) FROM auth.users u
             LEFT JOIN public.employees e ON e.user_id = u.id WHERE u.id = auth.uid()),
          'user_email', 'changed', _user,
          (SELECT coalesce(e.full_name, u.email) FROM auth.users u LEFT JOIN public.employees e ON e.user_id = u.id WHERE u.id = _user),
          jsonb_build_object('email', _old), jsonb_build_object('email', _new));
  RETURN _new;
END;
$$;

REVOKE ALL ON FUNCTION public.rbac_admin_change_email(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rbac_admin_change_email(uuid, text) TO authenticated;

-- ===================== 20261127110000_daily_reports.sql =====================

-- Employee Portal: Daily work report.
--
-- One report per employee per day (company date):
--   draft --submit--> submitted --review--> reviewed
--                                  \--send back (comment)--> returned --edit + resubmit--> submitted
-- The employee writes "What did you work on today?" (required to submit) and,
-- optionally, pending work / blockers. Today and the 7 days before can be
-- written; never the future. Draft and returned reports can be edited.
-- A submitted report goes to the reporting manager, or to the admin when there
-- is none. The manager, or an admin with the permission, reviews it. Nobody
-- reviews their own report.
--
-- Everything is read and written through the functions below.
-- Project entries are added when Projects are built.
-- Run after 20261127100000_admin_change_email.sql.
-- Rollback: supabase/rollback/20261127110000_daily_reports_down.sql


CREATE TABLE IF NOT EXISTS public.work_reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  report_date     date NOT NULL,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'returned')),
  summary         text CHECK (summary IS NULL OR length(summary) <= 2000),
  pending         text CHECK (pending IS NULL OR length(pending) <= 2000),
  submitted_to    uuid REFERENCES public.employees(id) ON DELETE SET NULL,  -- manager at submit; NULL = admin
  submitted_at    timestamptz,
  reviewed_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,
  review_comment  text CHECK (review_comment IS NULL OR length(review_comment) <= 1000),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id, report_date)
);
CREATE INDEX IF NOT EXISTS work_reports_status ON public.work_reports (status, report_date DESC);
CREATE INDEX IF NOT EXISTS work_reports_to ON public.work_reports (submitted_to, report_date DESC);
ALTER TABLE public.work_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.work_reports FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- Permissions
-- ---------------------------------------------------------------------------
INSERT INTO public.rbac_permissions (key, area, label, description, sort_order, grp, page, tab, action_label, kind, sensitive) VALUES
  ('portal.reports.view',    'admin',  'Daily Reports: View',            'See daily work reports (within the data scope).', 450, 'Daily reports',   'Daily Reports', NULL,           'View',           'page',   false),
  ('portal.reports.approve', 'admin',  'Daily Reports: Review',          'Mark reports reviewed or send them back.',        451, 'Daily reports',   'Daily Reports', NULL,           'Review',         'action', false),
  ('emp.reports.create',     'portal', 'Daily Report: Write',            'Write and submit own daily work report.',         610, 'Employee Portal', 'Daily Report',  NULL,           'Write & submit', 'action', false),
  ('team.reports.view',      'portal', 'Daily Report › Team: View',      'See the team''s daily reports.',                  710, 'Managers',        'Daily Report',  'Team reports', 'View',           'tab',    false),
  ('team.reports.approve',   'portal', 'Daily Report › Team: Review',    'Mark the team''s reports reviewed or send back.', 711, 'Managers',        'Daily Report',  'Team reports', 'Review',         'action', false)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.rbac_scope_resources (key, label, description, scopes, sort_order)
VALUES ('reports', 'Daily reports', 'Whose reports appear on Daily Reports.', '{none,own,team,department,all}', 40)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('employee', 'emp.reports.create'),
  ('manager',  'team.reports.view'),
  ('manager',  'team.reports.approve'),
  ('admin',    'portal.reports.view'),
  ('admin',    'portal.reports.approve')
ON CONFLICT DO NOTHING;
INSERT INTO public.rbac_role_scopes (role_key, resource, scope) VALUES ('admin', 'reports', 'all')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Helpers (internal)
-- ---------------------------------------------------------------------------
-- May the signed-in user review this report? (manager of the person, or admin)
CREATE OR REPLACE FUNCTION public._report_can_review(r public.work_reports)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  -- coalesce: with no manager the comparisons are NULL, which must mean "no".
  SELECT coalesce(r.status = 'submitted'
     AND NOT EXISTS (SELECT 1 FROM public.employees e WHERE e.id = r.employee_id AND e.user_id = auth.uid())
     AND (
       (public.rbac_can('team.reports.approve')
          AND public.portal_my_employee_id() IS NOT NULL
          AND (r.submitted_to = public.portal_my_employee_id() OR public._leave_manager(r.employee_id) = public.portal_my_employee_id()))
       OR (public.rbac_can('portal.reports.approve') AND public.rbac_emp_visible('reports', r.employee_id))
     ), false);
$$;

CREATE OR REPLACE FUNCTION public._report_json(r public.work_reports)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', r.id, 'report_date', r.report_date, 'status', r.status, 'summary', r.summary, 'pending', r.pending,
    'submitted_at', r.submitted_at, 'reviewed_at', r.reviewed_at, 'review_comment', r.review_comment,
    'reviewed_by', CASE WHEN r.reviewed_by IS NULL THEN NULL ELSE public._user_name(r.reviewed_by) END,
    'submitted_to', (SELECT m.full_name FROM public.employees m WHERE m.id = r.submitted_to),
    'employee', (SELECT jsonb_build_object('id', e.id, 'full_name', e.full_name, 'employee_code', e.employee_code,
                          'designation', e.designation, 'department', e.department)
                   FROM public.employees e WHERE e.id = r.employee_id),
    'worked_minutes', (SELECT d.worked_minutes FROM public._att_days(r.employee_id, r.report_date, r.report_date) d),
    'can_review', public._report_can_review(r));
$$;

-- ---------------------------------------------------------------------------
-- Employee
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.report_get(_date date DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e     public.employees := public._att_me();
  _today date := public._att_date(now());
  _d     date := coalesce(_date, public._att_date(now()));
BEGIN
  PERFORM public.rbac_require('emp.reports.create');
  RETURN jsonb_build_object(
    'date', _d,
    'today', _today,
    'date_allowed', _d BETWEEN _today - 7 AND _today,
    'manager', (SELECT m.full_name FROM public.employees m WHERE m.id = public._leave_manager(_e.id)),
    'worked_minutes', (SELECT d.worked_minutes FROM public._att_days(_e.id, _d, _d) d),
    'report', (SELECT public._report_json(r) FROM public.work_reports r WHERE r.employee_id = _e.id AND r.report_date = _d),
    -- the last 60 days, newest first (for the day buttons and the history list)
    'history', coalesce((SELECT jsonb_agg(jsonb_build_object('report_date', r.report_date, 'status', r.status,
                           'summary', left(r.summary, 160), 'review_comment', r.review_comment) ORDER BY r.report_date DESC)
                          FROM public.work_reports r WHERE r.employee_id = _e.id AND r.report_date >= _today - 60), '[]'::jsonb));
END;
$$;

CREATE OR REPLACE FUNCTION public.report_save(_date date, _summary text, _pending text, _submit boolean)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e     public.employees := public._att_me();
  _today date := public._att_date(now());
  _s     text := nullif(btrim(coalesce(_summary, ''), E' \t\r\n'), '');
  _p     text := nullif(btrim(coalesce(_pending, ''), E' \t\r\n'), '');
  _r     public.work_reports;
BEGIN
  PERFORM public.rbac_require('emp.reports.create');
  IF _date IS NULL OR _date > _today THEN
    RAISE EXCEPTION 'You cannot write a report for a future date.' USING ERRCODE = '22023';
  END IF;
  IF _date < _today - 7 THEN
    RAISE EXCEPTION 'Reports can only be written for today and the last 7 days.' USING ERRCODE = '22023';
  END IF;
  IF coalesce(length(_s), 0) > 2000 OR coalesce(length(_p), 0) > 2000 THEN
    RAISE EXCEPTION 'Each box can have at most 2000 characters.' USING ERRCODE = '22023';
  END IF;
  IF coalesce(_submit, false) AND _s IS NULL THEN
    RAISE EXCEPTION 'Write what you worked on before submitting.' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended('report:' || _e.id::text || _date::text, 0));
  SELECT * INTO _r FROM public.work_reports WHERE employee_id = _e.id AND report_date = _date;
  IF _r.status IN ('submitted', 'reviewed') THEN
    RAISE EXCEPTION 'This report is already submitted and cannot be changed.' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.work_reports (employee_id, report_date, summary, pending)
  VALUES (_e.id, _date, _s, _p)
  ON CONFLICT (employee_id, report_date) DO UPDATE SET summary = EXCLUDED.summary, pending = EXCLUDED.pending, updated_at = now();

  IF coalesce(_submit, false) THEN
    UPDATE public.work_reports
       SET status = 'submitted', submitted_to = public._leave_manager(_e.id), submitted_at = now(),
           reviewed_by = NULL, reviewed_at = NULL, review_comment = NULL, updated_at = now()
     WHERE employee_id = _e.id AND report_date = _date;
  END IF;
  RETURN public.report_get(_date);
END;
$$;

-- ---------------------------------------------------------------------------
-- Manager
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.report_team()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  PERFORM public.rbac_require('team.reports.view');
  RETURN coalesce((
    SELECT jsonb_agg(public._report_json(r) ORDER BY (r.status = 'submitted') DESC, r.report_date DESC, r.submitted_at DESC)
      FROM public.work_reports r
     WHERE r.status <> 'draft' AND r.employee_id <> _e.id
       AND (r.submitted_to = _e.id OR public._leave_manager(r.employee_id) = _e.id)
       AND r.report_date >= public._att_date(now()) - 60), '[]'::jsonb);
END;
$$;

-- ---------------------------------------------------------------------------
-- Review (manager or admin)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.report_review(_id uuid, _action text, _comment text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _r public.work_reports;
  _c text := nullif(btrim(coalesce(_comment, ''), E' \t\r\n'), '');
BEGIN
  SELECT * INTO _r FROM public.work_reports WHERE id = _id FOR UPDATE;
  IF _r.id IS NOT NULL AND _r.status <> 'submitted' AND (public.rbac_can('portal.reports.approve') OR public.rbac_can('team.reports.approve')) THEN
    RAISE EXCEPTION 'Only a submitted report can be reviewed.' USING ERRCODE = '22023';
  END IF;
  IF _r.id IS NULL OR NOT public._report_can_review(_r) THEN
    RAISE EXCEPTION 'You cannot review this report.' USING ERRCODE = '42501';
  END IF;
  IF _action IS NULL OR _action NOT IN ('reviewed', 'returned') THEN
    RAISE EXCEPTION 'Invalid action.' USING ERRCODE = '22023';
  END IF;
  IF _action = 'returned' AND _c IS NULL THEN
    RAISE EXCEPTION 'Write a comment saying what needs to change.' USING ERRCODE = '22023';
  END IF;
  IF coalesce(length(_c), 0) > 1000 THEN
    RAISE EXCEPTION 'The comment can have at most 1000 characters.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.work_reports
     SET status = _action, reviewed_by = auth.uid(), reviewed_at = now(), review_comment = _c, updated_at = now()
   WHERE id = _id RETURNING * INTO _r;
  RETURN public._report_json(_r);
END;
$$;

-- ---------------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------------
-- One day: every employee in scope with their report (drafts are not shown),
-- plus all reports still waiting for review.
CREATE OR REPLACE FUNCTION public.report_admin(_date date DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _d date := coalesce(_date, public._att_date(now()));
BEGIN
  PERFORM public.rbac_require('portal.reports.view');
  RETURN jsonb_build_object(
    'date', _d,
    'today', public._att_date(now()),
    'rows', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
               'employee', jsonb_build_object('id', e.id, 'full_name', e.full_name, 'employee_code', e.employee_code,
                             'designation', e.designation, 'department', e.department),
               'report', CASE WHEN r.id IS NULL THEN NULL ELSE public._report_json(r) END)
             ORDER BY e.full_name)
        FROM public.employees e
        LEFT JOIN public.work_reports r ON r.employee_id = e.id AND r.report_date = _d AND r.status <> 'draft'
       WHERE public.rbac_emp_visible('reports', e.id)
         AND (r.id IS NOT NULL OR (e.active AND public._att_date(e.created_at) <= _d))), '[]'::jsonb),
    'waiting', coalesce((
      SELECT jsonb_agg(public._report_json(w) ORDER BY w.report_date DESC, w.submitted_at DESC)
        FROM (SELECT * FROM public.work_reports x
               WHERE x.status = 'submitted' AND public.rbac_emp_visible('reports', x.employee_id)
               ORDER BY x.report_date DESC LIMIT 100) w), '[]'::jsonb));
END;
$$;

REVOKE ALL ON FUNCTION public._report_can_review(public.work_reports), public._report_json(public.work_reports)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.report_get(date), public.report_save(date, text, text, boolean), public.report_team(),
  public.report_review(uuid, text, text), public.report_admin(date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.report_get(date), public.report_save(date, text, text, boolean), public.report_team(),
  public.report_review(uuid, text, text), public.report_admin(date) TO authenticated;

-- ===================== 20261127120000_notifications.sql =====================

-- Employee Portal: Notifications.
--
-- Every employee has a list of notifications (bell, urgent banner, mark read).
-- They are created automatically (daily reports, leave, attendance corrections;
-- projects add theirs in the next migration) and by messages:
--   * Admins (portal.notifications.create) message people or everyone.
--   * Managers (team.messages.create) message their whole team.
--   * Employees (emp.messages.create) message colleagues they choose.
-- Everything is read and written through the functions below.
-- Run after 20261127110000_daily_reports.sql.
-- Rollback: supabase/rollback/20261127120000_notifications_down.sql


CREATE TABLE IF NOT EXISTS public.notifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  kind          text NOT NULL CHECK (kind IN ('message', 'report', 'leave', 'attendance', 'project')),
  priority      text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  title         text NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  body          text CHECK (body IS NULL OR length(body) <= 2000),
  link          text,
  sender_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_label  text,
  message_id    uuid,          -- the same for every copy of one message
  read_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_mine ON public.notifications (employee_id, read_at, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_sent ON public.notifications (sender_id, created_at DESC) WHERE message_id IS NOT NULL;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.notifications FROM anon, authenticated;

INSERT INTO public.rbac_permissions (key, area, label, description, sort_order, grp, page, tab, action_label, kind, sensitive) VALUES
  ('portal.notifications.create', 'admin',  'Notifications: Send',        'Send messages to employees, or to everyone.', 460, 'Notifications', 'Notifications', NULL,           'Send',         'page',   false),
  ('team.messages.create',        'portal', 'Notifications › Team: Send', 'Send messages to the people who report to you.', 720, 'Managers',   'Notifications', 'Team messages', 'Send',         'action', false),
  ('emp.messages.create',         'portal', 'Notifications: Send',        'Send messages to colleagues you choose.',          640, 'Employee Portal', 'Notifications', NULL,       'Send messages', 'action', false)
ON CONFLICT (key) DO NOTHING;
INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('admin', 'portal.notifications.create'), ('manager', 'team.messages.create'), ('employee', 'emp.messages.create')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Creating notifications (internal)
-- ---------------------------------------------------------------------------
-- One notification for one active employee; never to the person who caused it.
CREATE OR REPLACE FUNCTION public._notify(_emp uuid, _kind text, _title text, _body text, _link text, _priority text DEFAULT 'normal')
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
  INSERT INTO public.notifications (employee_id, kind, priority, title, body, link, sender_id)
  SELECT e.id, _kind, _priority, left(_title, 150), nullif(left(_body, 2000), ''), _link, auth.uid()
    FROM public.employees e
   WHERE e.id = _emp AND e.active AND e.user_id IS DISTINCT FROM auth.uid();
$$;

-- Everyone with the Admin role, except the employee the news is about.
CREATE OR REPLACE FUNCTION public._notify_admins(_about uuid, _kind text, _title text, _body text, _link text)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
  SELECT public._notify(e.id, _kind, _title, _body, _link)
    FROM public.employees e JOIN public.rbac_user_roles ur ON ur.user_id = e.user_id AND ur.role_key = 'admin'
   WHERE e.active AND e.id IS DISTINCT FROM _about;
$$;

CREATE OR REPLACE FUNCTION public._trg_notify_report()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _name text := (SELECT full_name FROM public.employees WHERE id = NEW.employee_id);
        _day  text := to_char(NEW.report_date, 'DD Mon YYYY');
BEGIN
  IF NEW.status = 'submitted' THEN
    IF NEW.submitted_to IS NOT NULL THEN
      PERFORM public._notify(NEW.submitted_to, 'report', _name || ' submitted a daily report', 'For ' || _day, '/portal/reports?tab=team');
    ELSE
      PERFORM public._notify_admins(NEW.employee_id, 'report', _name || ' submitted a daily report', 'For ' || _day, '/admin/reports');
    END IF;
  ELSIF NEW.status = 'reviewed' THEN
    PERFORM public._notify(NEW.employee_id, 'report', 'Your daily report was reviewed', 'For ' || _day, '/portal/reports?date=' || NEW.report_date);
  ELSIF NEW.status = 'returned' THEN
    PERFORM public._notify(NEW.employee_id, 'report', 'Your daily report was sent back',
      'For ' || _day || ': ' || coalesce(NEW.review_comment, ''), '/portal/reports?date=' || NEW.report_date, 'urgent');
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_report ON public.work_reports;
CREATE TRIGGER notify_report AFTER UPDATE ON public.work_reports
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public._trg_notify_report();

CREATE OR REPLACE FUNCTION public._trg_notify_leave()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _name  text := (SELECT full_name FROM public.employees WHERE id = NEW.employee_id);
        _dates text := to_char(NEW.start_date, 'DD Mon') || CASE WHEN NEW.end_date <> NEW.start_date THEN ' – ' || to_char(NEW.end_date, 'DD Mon') ELSE '' END;
BEGIN
  IF NEW.status = 'manager_review' THEN
    PERFORM public._notify(NEW.manager_employee_id, 'leave', _name || ' applied for leave', _dates, '/portal/leave');
  ELSIF NEW.status = 'admin_review' THEN
    PERFORM public._notify_admins(NEW.employee_id, 'leave', 'Leave of ' || _name || ' needs your approval', _dates, '/admin/leave');
  ELSIF NEW.status = 'manager_final' THEN
    PERFORM public._notify(NEW.manager_employee_id, 'leave', 'Leave of ' || _name || ' needs your final approval', _dates, '/portal/leave');
  ELSIF NEW.status IN ('approved', 'rejected') THEN
    PERFORM public._notify(NEW.employee_id, 'leave', 'Your leave was ' || NEW.status,
      _dates || CASE WHEN NEW.status = 'rejected' THEN ': ' || coalesce(NEW.rejected_comment, '') ELSE '' END, '/portal/leave');
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_leave_new ON public.leave_requests;
CREATE TRIGGER notify_leave_new AFTER INSERT ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public._trg_notify_leave();
DROP TRIGGER IF EXISTS notify_leave_change ON public.leave_requests;
CREATE TRIGGER notify_leave_change AFTER UPDATE ON public.leave_requests
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public._trg_notify_leave();

CREATE OR REPLACE FUNCTION public._trg_notify_correction()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.status IN ('approved', 'rejected') THEN
    PERFORM public._notify(NEW.employee_id, 'attendance', 'Your attendance correction was ' || NEW.status,
      'For ' || to_char(NEW.work_date, 'DD Mon YYYY') || coalesce(': ' || NEW.decision_comment, ''), '/portal/attendance');
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_correction ON public.attendance_corrections;
CREATE TRIGGER notify_correction AFTER UPDATE ON public.attendance_corrections
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public._trg_notify_correction();

-- ---------------------------------------------------------------------------
-- Reading (own only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notif_mine()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  RETURN jsonb_build_object(
    'unread', (SELECT count(*) FROM public.notifications WHERE employee_id = _e.id AND read_at IS NULL),
    'urgent', coalesce((SELECT jsonb_agg(to_jsonb(u) ORDER BY u.created_at DESC) FROM (
                 SELECT id, title, body, link, sender_label, created_at FROM public.notifications
                  WHERE employee_id = _e.id AND read_at IS NULL AND priority = 'urgent' ORDER BY created_at DESC LIMIT 5) u), '[]'::jsonb),
    -- unread first, newest first
    'items', coalesce((SELECT jsonb_agg(to_jsonb(i) ORDER BY (i.read_at IS NULL) DESC, i.created_at DESC) FROM (
                 SELECT id, kind, priority, title, body, link, sender_label, read_at, created_at FROM public.notifications
                  WHERE employee_id = _e.id ORDER BY (read_at IS NULL) DESC, created_at DESC LIMIT 100) i), '[]'::jsonb));
END;
$$;

-- _ids = NULL marks everything read.
CREATE OR REPLACE FUNCTION public.notif_read(_ids uuid[] DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  UPDATE public.notifications SET read_at = now()
   WHERE employee_id = _e.id AND read_at IS NULL AND (_ids IS NULL OR id = ANY (_ids));
END;
$$;

-- ---------------------------------------------------------------------------
-- Messages
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notif_options()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _all  boolean := public.rbac_can('portal.notifications.create');
  _me   uuid := public.portal_my_employee_id();
  _team boolean;
  _own  boolean;
BEGIN
  _team := coalesce(public.rbac_can('team.messages.create') AND _me IS NOT NULL
             AND EXISTS (SELECT 1 FROM public.employees WHERE reporting_manager_id = _me AND active), false);
  _own := coalesce(public.rbac_can('emp.messages.create') AND _me IS NOT NULL, false);
  IF NOT _all AND NOT _team AND NOT _own THEN
    RETURN jsonb_build_object('can_send', false, 'can_all', false, 'can_team', false, 'people', '[]'::jsonb, 'sent', '[]'::jsonb);
  END IF;
  RETURN jsonb_build_object(
    'can_send', true,
    'can_all', _all,
    'can_team', _team,
    'people', coalesce((SELECT jsonb_agg(jsonb_build_object('id', e.id, 'full_name', e.full_name, 'employee_code', e.employee_code,
                 'designation', e.designation) ORDER BY e.full_name)
                 FROM public.employees e
                WHERE e.active AND e.id IS DISTINCT FROM _me
                  AND (_all OR _own OR (_team AND e.reporting_manager_id = _me))), '[]'::jsonb),
    -- my messages of the last 90 days
    'sent', coalesce((SELECT jsonb_agg(to_jsonb(s) ORDER BY s.created_at DESC) FROM (
                 SELECT n.message_id AS id, min(n.title) AS title, min(n.body) AS body, min(n.priority) AS priority,
                        min(n.created_at) AS created_at, count(*) AS recipients, count(n.read_at) AS read,
                        (array_agg(e.full_name ORDER BY e.full_name))[1:4] AS "to"
                   FROM public.notifications n JOIN public.employees e ON e.id = n.employee_id
                  WHERE n.sender_id = auth.uid() AND n.message_id IS NOT NULL AND n.created_at > now() - interval '90 days'
                  GROUP BY n.message_id ORDER BY min(n.created_at) DESC LIMIT 50) s), '[]'::jsonb));
END;
$$;

-- _audience: 'people' (_to required) | 'team' | 'all'. Returns how many got it.
CREATE OR REPLACE FUNCTION public.notif_send(_audience text, _to uuid[], _title text, _body text, _priority text)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _all   boolean := public.rbac_can('portal.notifications.create');
  _me    uuid := public.portal_my_employee_id();
  _team  boolean;
  _own   boolean;
  _t     text := btrim(coalesce(_title, ''), E' \t\r\n');
  _b     text := nullif(btrim(coalesce(_body, ''), E' \t\r\n'), '');
  _msg   uuid := gen_random_uuid();
  _n     int;
BEGIN
  _team := coalesce(public.rbac_can('team.messages.create') AND _me IS NOT NULL, false);
  _own := coalesce(public.rbac_can('emp.messages.create') AND _me IS NOT NULL, false);
  IF NOT _all AND NOT _team AND NOT _own THEN
    RAISE EXCEPTION 'You do not have permission to send messages.' USING ERRCODE = '42501';
  END IF;
  IF length(_t) NOT BETWEEN 1 AND 150 THEN RAISE EXCEPTION 'Subject must be 1 to 150 characters.' USING ERRCODE = '22023'; END IF;
  IF coalesce(length(_b), 0) > 2000 THEN RAISE EXCEPTION 'Message must be at most 2000 characters.' USING ERRCODE = '22023'; END IF;
  IF coalesce(_priority, '') NOT IN ('normal', 'urgent') THEN RAISE EXCEPTION 'Invalid priority.' USING ERRCODE = '22023'; END IF;
  IF coalesce(_audience, '') NOT IN ('people', 'team', 'all') THEN RAISE EXCEPTION 'Invalid audience.' USING ERRCODE = '22023'; END IF;
  IF _audience = 'all' AND NOT _all THEN RAISE EXCEPTION 'Only an admin can message everyone.' USING ERRCODE = '42501'; END IF;
  IF _audience = 'team' AND NOT _team THEN RAISE EXCEPTION 'You do not have a team to message.' USING ERRCODE = '42501'; END IF;
  IF _audience = 'people' AND coalesce(cardinality(_to), 0) = 0 THEN RAISE EXCEPTION 'Choose at least one person.' USING ERRCODE = '22023'; END IF;
  IF _audience = 'people' AND cardinality(_to) > 100 THEN RAISE EXCEPTION 'Choose at most 100 people.' USING ERRCODE = '22023'; END IF;
  -- Without the employee permission a manager may only choose their own team.
  IF _audience = 'people' AND NOT _all AND NOT _own AND EXISTS (
       SELECT 1 FROM unnest(_to) x WHERE NOT EXISTS (
         SELECT 1 FROM public.employees e WHERE e.id = x AND e.reporting_manager_id = _me)) THEN
    RAISE EXCEPTION 'You can only message people in your team.' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.notifications (employee_id, kind, priority, title, body, link, sender_id, sender_label, message_id)
  SELECT e.id, 'message', _priority, _t, _b, NULL, auth.uid(), coalesce(public._user_name(auth.uid()), 'Admin'), _msg
    FROM public.employees e
   WHERE e.active AND e.user_id IS DISTINCT FROM auth.uid()
     AND CASE _audience WHEN 'all' THEN true WHEN 'team' THEN e.reporting_manager_id = _me ELSE e.id = ANY (_to) END;
  GET DIAGNOSTICS _n = ROW_COUNT;
  IF _n = 0 THEN RAISE EXCEPTION 'There is nobody to send this to.' USING ERRCODE = '22023'; END IF;
  RETURN _n;
END;
$$;

REVOKE ALL ON FUNCTION public._notify(uuid, text, text, text, text, text), public._notify_admins(uuid, text, text, text, text),
  public._trg_notify_report(), public._trg_notify_leave(), public._trg_notify_correction() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notif_mine(), public.notif_read(uuid[]), public.notif_options(),
  public.notif_send(text, uuid[], text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.notif_mine(), public.notif_read(uuid[]), public.notif_options(),
  public.notif_send(text, uuid[], text, text, text) TO authenticated;

-- ===================== 20261127130000_projects.sql =====================

-- Employee Portal: Projects and tasks (a simple admin-managed list), and project
-- entries in the daily work report.
--
--   * An admin creates projects, picks the members and a project manager, and
--     can add or remove tasks.
--   * Members see their projects, add tasks for the team, change task status and
--     post updates. Finishing a task after its due date needs a reason.
--   * The daily report can list hours and work per project.
-- Everything is read and written through the functions below.
-- Run after 20261127120000_notifications.sql.
-- Rollback: supabase/rollback/20261127130000_projects_down.sql


CREATE TABLE IF NOT EXISTS public.projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code         text NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9-]{2,20}$'),
  name         text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
  description  text CHECK (description IS NULL OR length(description) <= 2000),
  status       text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  priority     text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  start_date   date,
  end_date     date,
  manager_id   uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);
CREATE TABLE IF NOT EXISTS public.project_members (
  project_id   uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  employee_id  uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  added_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, employee_id)
);
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title         text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 200),
  description   text CHECK (description IS NULL OR length(description) <= 2000),
  assignee_id   uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  due_date      date,
  priority      text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status        text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  delay_reason  text CHECK (delay_reason IS NULL OR length(delay_reason) <= 1000),
  completed_at  timestamptz,
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS project_tasks_project ON public.project_tasks (project_id, status);
CREATE INDEX IF NOT EXISTS project_tasks_assignee ON public.project_tasks (assignee_id, status);
CREATE TABLE IF NOT EXISTS public.project_updates (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  body         text NOT NULL CHECK (length(trim(body)) BETWEEN 1 AND 2000),
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.work_report_items (
  report_id    uuid NOT NULL REFERENCES public.work_reports(id) ON DELETE CASCADE,
  project_id   uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  work         text NOT NULL CHECK (length(trim(work)) BETWEEN 1 AND 2000),
  hours        numeric(4, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  position     smallint NOT NULL DEFAULT 0,
  PRIMARY KEY (report_id, project_id)
);
ALTER TABLE public.projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_report_items ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.projects, public.project_members, public.project_tasks, public.project_updates, public.work_report_items
  FROM anon, authenticated;

INSERT INTO public.rbac_permissions (key, area, label, description, sort_order, grp, page, tab, action_label, kind, sensitive) VALUES
  ('portal.projects.view',   'admin',  'Projects: View',      'See every project, its team and tasks.',            470, 'Projects',        'Projects',    NULL, 'View',          'page',   false),
  ('portal.projects.edit',   'admin',  'Projects: Edit',      'Create, change and delete projects, teams, tasks.', 471, 'Projects',        'Projects',    NULL, 'Manage',        'action', false),
  ('emp.projects.view',      'portal', 'My Projects: View',   'See own projects, change task status, post updates.', 620, 'Employee Portal', 'My Projects', NULL, 'View',          'page',   false),
  ('emp.projects.create',    'portal', 'My Projects: Create', 'Add tasks on own projects.',                        621, 'Employee Portal', 'My Projects', NULL, 'Add tasks',     'action', false)
ON CONFLICT (key) DO NOTHING;
INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('admin', 'portal.projects.view'), ('admin', 'portal.projects.edit'),
  ('employee', 'emp.projects.view'), ('employee', 'emp.projects.create')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._proj_is_member(_project uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT coalesce(EXISTS (SELECT 1 FROM public.project_members WHERE project_id = _project AND employee_id = public.portal_my_employee_id()), false);
$$;

CREATE OR REPLACE FUNCTION public._proj_json(p public.projects)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', p.id, 'code', p.code, 'name', p.name, 'description', p.description, 'status', p.status, 'priority', p.priority,
    'start_date', p.start_date, 'end_date', p.end_date, 'manager_id', p.manager_id,
    'manager', (SELECT full_name FROM public.employees WHERE id = p.manager_id),
    'overdue', coalesce(p.end_date < public._att_date(now()) AND p.status NOT IN ('completed', 'cancelled'), false),
    'members', (SELECT count(*) FROM public.project_members WHERE project_id = p.id),
    'tasks_total', (SELECT count(*) FROM public.project_tasks WHERE project_id = p.id),
    'tasks_done', (SELECT count(*) FROM public.project_tasks WHERE project_id = p.id AND status = 'done'));
$$;

CREATE OR REPLACE FUNCTION public._proj_task_json(t public.project_tasks)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', t.id, 'project_id', t.project_id, 'title', t.title, 'description', t.description, 'assignee_id', t.assignee_id,
    'assignee', (SELECT full_name FROM public.employees WHERE id = t.assignee_id),
    'due_date', t.due_date, 'priority', t.priority, 'status', t.status, 'delay_reason', t.delay_reason,
    'completed_at', t.completed_at,
    'overdue', coalesce(t.due_date < public._att_date(now()) AND t.status <> 'done', false));
$$;

CREATE OR REPLACE FUNCTION public._trg_notify_member()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public._notify(NEW.employee_id, 'project', 'You were added to a project',
    (SELECT code || ' · ' || name FROM public.projects WHERE id = NEW.project_id), '/portal/projects/' || NEW.project_id);
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_member ON public.project_members;
CREATE TRIGGER notify_member AFTER INSERT ON public.project_members FOR EACH ROW EXECUTE FUNCTION public._trg_notify_member();

CREATE OR REPLACE FUNCTION public._trg_notify_task()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.assignee_id IS NOT NULL THEN
    PERFORM public._notify(NEW.assignee_id, 'project', 'A task was assigned to you',
      NEW.title || coalesce(' (due ' || to_char(NEW.due_date, 'DD Mon YYYY') || ')', ''), '/portal/projects/' || NEW.project_id);
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_task ON public.project_tasks;
CREATE TRIGGER notify_task AFTER INSERT ON public.project_tasks FOR EACH ROW EXECUTE FUNCTION public._trg_notify_task();

-- ---------------------------------------------------------------------------
-- Employee and shared
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.proj_mine()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  PERFORM public.rbac_require('emp.projects.view');
  RETURN jsonb_build_object(
    'projects', coalesce((SELECT jsonb_agg(public._proj_json(p) ORDER BY (p.status IN ('completed', 'cancelled')), p.end_date NULLS LAST, p.name)
                   FROM public.projects p JOIN public.project_members m ON m.project_id = p.id AND m.employee_id = _e.id), '[]'::jsonb),
    -- my open tasks, overdue and soonest first
    'tasks', coalesce((SELECT jsonb_agg(public._proj_task_json(t) || jsonb_build_object('project', p.name) ORDER BY t.due_date NULLS LAST, t.created_at)
                   FROM public.project_tasks t JOIN public.projects p ON p.id = t.project_id
                   JOIN public.project_members m ON m.project_id = p.id AND m.employee_id = _e.id
                  WHERE t.assignee_id = _e.id AND t.status <> 'done' AND p.status <> 'cancelled'), '[]'::jsonb));
END;
$$;

-- One project, for a team member or an admin with Projects: View.
CREATE OR REPLACE FUNCTION public.proj_get(_id uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _p      public.projects;
  _member boolean := public._proj_is_member(_id) AND public.rbac_can('emp.projects.view');
  _admin  boolean := public.rbac_can('portal.projects.view');
BEGIN
  SELECT * INTO _p FROM public.projects WHERE id = _id;
  IF _p.id IS NULL OR NOT (_member OR _admin) THEN
    RAISE EXCEPTION 'Project not found, or you are not on it.' USING ERRCODE = '42501';
  END IF;
  RETURN public._proj_json(_p) || jsonb_build_object(
    'team', coalesce((SELECT jsonb_agg(jsonb_build_object('id', e.id, 'full_name', e.full_name, 'employee_code', e.employee_code,
                         'designation', e.designation) ORDER BY e.full_name)
                  FROM public.project_members m JOIN public.employees e ON e.id = m.employee_id WHERE m.project_id = _id), '[]'::jsonb),
    'tasks', coalesce((SELECT jsonb_agg(public._proj_task_json(t) ORDER BY (t.status = 'done'), t.due_date NULLS LAST, t.created_at)
                  FROM public.project_tasks t WHERE t.project_id = _id), '[]'::jsonb),
    'updates', coalesce((SELECT jsonb_agg(jsonb_build_object('id', u.id, 'body', u.body, 'created_at', u.created_at,
                         'author', coalesce(public._user_name(u.author_id), 'Someone')) ORDER BY u.created_at DESC)
                  FROM (SELECT * FROM public.project_updates WHERE project_id = _id ORDER BY created_at DESC LIMIT 50) u), '[]'::jsonb),
    'can_add_task', public.rbac_can('portal.projects.edit') OR (_member AND public.rbac_can('emp.projects.create')),
    'can_work', _member OR public.rbac_can('portal.projects.edit'),
    'can_manage', public.rbac_can('portal.projects.edit'));
END;
$$;

CREATE OR REPLACE FUNCTION public.proj_add_task(_project uuid, _p jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _title    text := btrim(coalesce(_p->>'title', ''), E' \t\r\n');
  _assignee uuid := nullif(_p->>'assignee_id', '')::uuid;
BEGIN
  IF NOT (public.rbac_can('portal.projects.edit') OR (public._proj_is_member(_project) AND public.rbac_can('emp.projects.create'))) THEN
    RAISE EXCEPTION 'You cannot add tasks to this project.' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.projects WHERE id = _project) THEN RAISE EXCEPTION 'Project not found.' USING ERRCODE = 'P0002'; END IF;
  IF length(_title) NOT BETWEEN 1 AND 200 THEN RAISE EXCEPTION 'The task title must be 1 to 200 characters.' USING ERRCODE = '22023'; END IF;
  IF _assignee IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.project_members WHERE project_id = _project AND employee_id = _assignee) THEN
    RAISE EXCEPTION 'The assignee must be on the project team.' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.project_tasks (project_id, title, description, assignee_id, due_date, priority, created_by)
  VALUES (_project, _title, nullif(btrim(coalesce(_p->>'description', '')), ''), _assignee,
          nullif(_p->>'due_date', '')::date, coalesce(nullif(_p->>'priority', ''), 'medium'), auth.uid());
  RETURN public.proj_get(_project);
END;
$$;

-- Done after the due date needs a reason.
CREATE OR REPLACE FUNCTION public.proj_set_task_status(_task uuid, _status text, _reason text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _t public.project_tasks;
  _r text := nullif(btrim(coalesce(_reason, ''), E' \t\r\n'), '');
BEGIN
  SELECT * INTO _t FROM public.project_tasks WHERE id = _task FOR UPDATE;
  IF _t.id IS NULL OR NOT (public.rbac_can('portal.projects.edit') OR (public._proj_is_member(_t.project_id) AND public.rbac_can('emp.projects.view'))) THEN
    RAISE EXCEPTION 'You are not on this project.' USING ERRCODE = '42501';
  END IF;
  IF coalesce(_status, '') NOT IN ('todo', 'in_progress', 'done') THEN RAISE EXCEPTION 'Invalid status.' USING ERRCODE = '22023'; END IF;
  IF coalesce(length(_r), 0) > 1000 THEN RAISE EXCEPTION 'The reason can have at most 1000 characters.' USING ERRCODE = '22023'; END IF;
  IF _status = 'done' AND _t.status <> 'done' AND _t.due_date < public._att_date(now()) AND coalesce(_r, _t.delay_reason) IS NULL THEN
    RAISE EXCEPTION 'This task is past its due date. Write why it was late.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.project_tasks
     SET status = _status, delay_reason = coalesce(_r, delay_reason), updated_at = now(),
         completed_at = CASE WHEN _status = 'done' THEN coalesce(completed_at, now()) ELSE NULL END
   WHERE id = _task;
  RETURN public.proj_get(_t.project_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.proj_post_update(_project uuid, _body text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _b text := btrim(coalesce(_body, ''), E' \t\r\n');
BEGIN
  IF NOT (public.rbac_can('portal.projects.edit') OR (public._proj_is_member(_project) AND public.rbac_can('emp.projects.view'))) THEN
    RAISE EXCEPTION 'You are not on this project.' USING ERRCODE = '42501';
  END IF;
  IF length(_b) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'The update must be 1 to 2000 characters.' USING ERRCODE = '22023'; END IF;
  INSERT INTO public.project_updates (project_id, author_id, body) VALUES (_project, auth.uid(), _b);
  RETURN public.proj_get(_project);
END;
$$;

-- ---------------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.proj_admin_list()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.projects.view');
  RETURN jsonb_build_object(
    'can_edit', public.rbac_can('portal.projects.edit'),
    'projects', coalesce((SELECT jsonb_agg(public._proj_json(p) ORDER BY (p.status IN ('completed', 'cancelled')), p.name) FROM public.projects p), '[]'::jsonb),
    -- names for choosing the team (active employees)
    'people', CASE WHEN public.rbac_can('portal.projects.edit') THEN coalesce((SELECT jsonb_agg(jsonb_build_object('id', e.id, 'full_name', e.full_name,
                 'employee_code', e.employee_code) ORDER BY e.full_name) FROM public.employees e WHERE e.active), '[]'::jsonb) ELSE '[]'::jsonb END);
END;
$$;

-- Create (_id NULL) or change a project; _p.members is the whole team.
CREATE OR REPLACE FUNCTION public.proj_admin_save(_id uuid, _p jsonb)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _code    text := upper(btrim(coalesce(_p->>'code', '')));
  _name    text := btrim(coalesce(_p->>'name', ''));
  _manager uuid := nullif(_p->>'manager_id', '')::uuid;
  _members uuid[] := ARRAY(SELECT DISTINCT x::uuid FROM jsonb_array_elements_text(coalesce(_p->'members', '[]'::jsonb)) x);
  _pid     uuid := _id;
BEGIN
  PERFORM public.rbac_require('portal.projects.edit');
  IF _code !~ '^[A-Z0-9-]{2,20}$' THEN RAISE EXCEPTION 'Project code: 2-20 letters, numbers or dashes.' USING ERRCODE = '22023'; END IF;
  IF length(_name) NOT BETWEEN 1 AND 120 THEN RAISE EXCEPTION 'Enter the project name.' USING ERRCODE = '22023'; END IF;
  IF EXISTS (SELECT 1 FROM public.projects WHERE code = _code AND id IS DISTINCT FROM _id) THEN
    RAISE EXCEPTION 'That project code is already used.' USING ERRCODE = '23505';
  END IF;
  IF nullif(_p->>'end_date', '')::date < nullif(_p->>'start_date', '')::date THEN
    RAISE EXCEPTION 'The deadline is before the start date.' USING ERRCODE = '22023';
  END IF;
  -- The project manager is always part of the team.
  IF _manager IS NOT NULL AND NOT _manager = ANY (_members) THEN _members := _members || _manager; END IF;
  IF EXISTS (SELECT 1 FROM unnest(_members) x WHERE NOT EXISTS (SELECT 1 FROM public.employees WHERE id = x)) THEN
    RAISE EXCEPTION 'Unknown team member.' USING ERRCODE = '22023';
  END IF;
  IF _pid IS NULL THEN
    INSERT INTO public.projects (code, name) VALUES (_code, _name) RETURNING id INTO _pid;
  ELSIF NOT EXISTS (SELECT 1 FROM public.projects WHERE id = _pid) THEN
    RAISE EXCEPTION 'Project not found.' USING ERRCODE = 'P0002';
  END IF;
  UPDATE public.projects SET code = _code, name = _name, description = nullif(btrim(coalesce(_p->>'description', '')), ''),
    status = coalesce(nullif(_p->>'status', ''), 'planning'), priority = coalesce(nullif(_p->>'priority', ''), 'medium'),
    start_date = nullif(_p->>'start_date', '')::date, end_date = nullif(_p->>'end_date', '')::date,
    manager_id = _manager, updated_at = now()
   WHERE id = _pid;
  DELETE FROM public.project_members WHERE project_id = _pid AND NOT employee_id = ANY (_members);
  INSERT INTO public.project_members (project_id, employee_id) SELECT _pid, x FROM unnest(_members) x ON CONFLICT DO NOTHING;
  UPDATE public.project_tasks SET assignee_id = NULL WHERE project_id = _pid AND assignee_id IS NOT NULL AND NOT assignee_id = ANY (_members);
  RETURN _pid;
END;
$$;

CREATE OR REPLACE FUNCTION public.proj_admin_delete(_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.projects.edit');
  DELETE FROM public.projects WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Project not found.' USING ERRCODE = 'P0002'; END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.proj_admin_delete_task(_task uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.projects.edit');
  DELETE FROM public.project_tasks WHERE id = _task;
  IF NOT FOUND THEN RAISE EXCEPTION 'Task not found.' USING ERRCODE = 'P0002'; END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- Daily report: project entries
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._report_json(r public.work_reports)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', r.id, 'report_date', r.report_date, 'status', r.status, 'summary', r.summary, 'pending', r.pending,
    'submitted_at', r.submitted_at, 'reviewed_at', r.reviewed_at, 'review_comment', r.review_comment,
    'reviewed_by', CASE WHEN r.reviewed_by IS NULL THEN NULL ELSE public._user_name(r.reviewed_by) END,
    'submitted_to', (SELECT m.full_name FROM public.employees m WHERE m.id = r.submitted_to),
    'employee', (SELECT jsonb_build_object('id', e.id, 'full_name', e.full_name, 'employee_code', e.employee_code,
                          'designation', e.designation, 'department', e.department)
                   FROM public.employees e WHERE e.id = r.employee_id),
    'worked_minutes', (SELECT d.worked_minutes FROM public._att_days(r.employee_id, r.report_date, r.report_date) d),
    'items', coalesce((SELECT jsonb_agg(jsonb_build_object('project_id', i.project_id, 'code', p.code, 'name', p.name,
                          'work', i.work, 'hours', i.hours) ORDER BY i.position)
                   FROM public.work_report_items i JOIN public.projects p ON p.id = i.project_id WHERE i.report_id = r.id), '[]'::jsonb),
    'can_review', public._report_can_review(r));
$$;

CREATE OR REPLACE FUNCTION public.report_get(_date date DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e     public.employees := public._att_me();
  _today date := public._att_date(now());
  _d     date := coalesce(_date, public._att_date(now()));
BEGIN
  PERFORM public.rbac_require('emp.reports.create');
  RETURN jsonb_build_object(
    'date', _d, 'today', _today, 'date_allowed', _d BETWEEN _today - 7 AND _today,
    'manager', (SELECT m.full_name FROM public.employees m WHERE m.id = public._leave_manager(_e.id)),
    'worked_minutes', (SELECT d.worked_minutes FROM public._att_days(_e.id, _d, _d) d),
    'report', (SELECT public._report_json(r) FROM public.work_reports r WHERE r.employee_id = _e.id AND r.report_date = _d),
    'projects', coalesce((SELECT jsonb_agg(jsonb_build_object('id', p.id, 'code', p.code, 'name', p.name) ORDER BY p.name)
                   FROM public.projects p JOIN public.project_members m ON m.project_id = p.id AND m.employee_id = _e.id
                  WHERE p.status <> 'cancelled'), '[]'::jsonb),
    'history', coalesce((SELECT jsonb_agg(jsonb_build_object('report_date', r.report_date, 'status', r.status,
                           'summary', left(coalesce(r.summary, (SELECT i.work FROM public.work_report_items i WHERE i.report_id = r.id ORDER BY i.position LIMIT 1)), 160),
                           'review_comment', r.review_comment) ORDER BY r.report_date DESC)
                          FROM public.work_reports r WHERE r.employee_id = _e.id AND r.report_date >= _today - 60), '[]'::jsonb));
END;
$$;

DROP FUNCTION IF EXISTS public.report_save(date, text, text, boolean);
-- _items: [{"project_id": "...", "work": "...", "hours": 2.5}]
CREATE OR REPLACE FUNCTION public.report_save(_date date, _summary text, _pending text, _submit boolean, _items jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e     public.employees := public._att_me();
  _today date := public._att_date(now());
  _s     text := nullif(btrim(coalesce(_summary, ''), E' \t\r\n'), '');
  _p     text := nullif(btrim(coalesce(_pending, ''), E' \t\r\n'), '');
  _list  jsonb := coalesce(_items, '[]'::jsonb);
  _r     public.work_reports;
  _item  jsonb;
  _pid   uuid;
  _hours numeric;
  _total numeric := 0;
  _seen  uuid[] := '{}';
  _pos   int := 0;
BEGIN
  PERFORM public.rbac_require('emp.reports.create');
  IF _date IS NULL OR _date > _today THEN RAISE EXCEPTION 'You cannot write a report for a future date.' USING ERRCODE = '22023'; END IF;
  IF _date < _today - 7 THEN RAISE EXCEPTION 'Reports can only be written for today and the last 7 days.' USING ERRCODE = '22023'; END IF;
  IF coalesce(length(_s), 0) > 2000 OR coalesce(length(_p), 0) > 2000 THEN
    RAISE EXCEPTION 'Each box can have at most 2000 characters.' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(_list) <> 'array' OR jsonb_array_length(_list) > 20 THEN RAISE EXCEPTION 'Invalid project entries.' USING ERRCODE = '22023'; END IF;
  IF coalesce(_submit, false) AND _s IS NULL AND jsonb_array_length(_list) = 0 THEN
    RAISE EXCEPTION 'Write what you worked on before submitting.' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended('report:' || _e.id::text || _date::text, 0));
  SELECT * INTO _r FROM public.work_reports WHERE employee_id = _e.id AND report_date = _date;
  IF _r.status IN ('submitted', 'reviewed') THEN
    RAISE EXCEPTION 'This report is already submitted and cannot be changed.' USING ERRCODE = '22023';
  END IF;

  -- Check every entry before writing anything.
  FOR _item IN SELECT * FROM jsonb_array_elements(_list) LOOP
    BEGIN
      _pid := (_item->>'project_id')::uuid;
      _hours := (_item->>'hours')::numeric;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Enter the hours for every project.' USING ERRCODE = '22023';
    END;
    IF _pid IS NULL OR NOT EXISTS (SELECT 1 FROM public.project_members WHERE project_id = _pid AND employee_id = _e.id) THEN
      RAISE EXCEPTION 'You can only report on projects you are on.' USING ERRCODE = '42501';
    END IF;
    IF _pid = ANY (_seen) THEN RAISE EXCEPTION 'Add each project only once.' USING ERRCODE = '22023'; END IF;
    _seen := _seen || _pid;
    IF _hours IS NULL OR _hours <= 0 OR _hours > 24 THEN RAISE EXCEPTION 'Hours must be more than 0 and at most 24.' USING ERRCODE = '22023'; END IF;
    _total := _total + _hours;
    IF length(btrim(coalesce(_item->>'work', ''), E' \t\r\n')) NOT BETWEEN 1 AND 2000 THEN
      RAISE EXCEPTION 'Write what you did on every project you added.' USING ERRCODE = '22023';
    END IF;
  END LOOP;
  IF _total > 24 THEN RAISE EXCEPTION 'Total hours for the day cannot be more than 24.' USING ERRCODE = '22023'; END IF;

  INSERT INTO public.work_reports (employee_id, report_date, summary, pending)
  VALUES (_e.id, _date, _s, _p)
  ON CONFLICT (employee_id, report_date) DO UPDATE SET summary = EXCLUDED.summary, pending = EXCLUDED.pending, updated_at = now()
  RETURNING * INTO _r;

  DELETE FROM public.work_report_items WHERE report_id = _r.id;
  FOR _item IN SELECT * FROM jsonb_array_elements(_list) LOOP
    INSERT INTO public.work_report_items (report_id, project_id, work, hours, position)
    VALUES (_r.id, (_item->>'project_id')::uuid, btrim(_item->>'work', E' \t\r\n'), (_item->>'hours')::numeric, _pos);
    _pos := _pos + 1;
  END LOOP;

  IF coalesce(_submit, false) THEN
    UPDATE public.work_reports
       SET status = 'submitted', submitted_to = public._leave_manager(_e.id), submitted_at = now(),
           reviewed_by = NULL, reviewed_at = NULL, review_comment = NULL, updated_at = now()
     WHERE id = _r.id;
  END IF;
  RETURN public.report_get(_date);
END;
$$;

REVOKE ALL ON FUNCTION public._proj_is_member(uuid), public._proj_json(public.projects), public._proj_task_json(public.project_tasks),
  public._trg_notify_member(), public._trg_notify_task() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.proj_mine(), public.proj_get(uuid), public.proj_add_task(uuid, jsonb),
  public.proj_set_task_status(uuid, text, text), public.proj_post_update(uuid, text), public.proj_admin_list(),
  public.proj_admin_save(uuid, jsonb), public.proj_admin_delete(uuid), public.proj_admin_delete_task(uuid),
  public.report_save(date, text, text, boolean, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.proj_mine(), public.proj_get(uuid), public.proj_add_task(uuid, jsonb),
  public.proj_set_task_status(uuid, text, text), public.proj_post_update(uuid, text), public.proj_admin_list(),
  public.proj_admin_save(uuid, jsonb), public.proj_admin_delete(uuid), public.proj_admin_delete_task(uuid),
  public.report_save(date, text, text, boolean, jsonb) TO authenticated;

-- ===================== 20261127140000_profile_documents.sql =====================

-- Employee Portal: fuller profile (personal details, emergency contacts) and
-- employee documents.
--
--   * Employees edit their own personal details and 1-3 emergency contacts.
--     Work details (ID, department, manager…) stay with the admin.
--   * Employees upload their own documents (PDF or image, 10 MB, up to 50) and
--     delete the ones they uploaded.
--   * An admin with "Employees: Documents" sees them and can add company
--     documents (e.g. a certificate) that the employee can open but not delete.
--   * An admin with "Employees: Personal details" can see (not edit) the
--     personal details and contacts.
-- Files are in the PRIVATE bucket "employee-documents", under "<employee id>/".
-- Run after 20261127130000_projects.sql.
-- Rollback: supabase/rollback/20261127140000_profile_documents_down.sql


-- Work details shown on the profile (set by the admin).
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS employment_type text CHECK (employment_type IS NULL OR employment_type IN ('full_time', 'part_time', 'intern', 'contract')),
  ADD COLUMN IF NOT EXISTS work_location   text CHECK (work_location IS NULL OR length(work_location) <= 120);

CREATE TABLE IF NOT EXISTS public.employee_profiles (
  employee_id        uuid PRIMARY KEY REFERENCES public.employees(id) ON DELETE CASCADE,
  date_of_birth      date CHECK (date_of_birth IS NULL OR date_of_birth > '1920-01-01'),
  gender             text CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  blood_group        text CHECK (blood_group IS NULL OR blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  marital_status     text CHECK (marital_status IS NULL OR marital_status IN ('single', 'married', 'divorced', 'widowed', 'prefer_not_to_say')),
  nationality        text CHECK (nationality IS NULL OR length(nationality) <= 60),
  personal_email     text CHECK (personal_email IS NULL OR (personal_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(personal_email) <= 254)),
  alternate_phone    text CHECK (alternate_phone IS NULL OR alternate_phone ~ '^\+?[0-9 ()-]{7,20}$'),
  current_address    text CHECK (current_address IS NULL OR length(current_address) <= 500),
  permanent_address  text CHECK (permanent_address IS NULL OR length(permanent_address) <= 500),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  employee_id      uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  position         smallint NOT NULL CHECK (position BETWEEN 1 AND 3),
  name             text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
  relationship     text NOT NULL CHECK (length(trim(relationship)) BETWEEN 1 AND 40),
  phone            text NOT NULL CHECK (phone ~ '^\+?[0-9 ()-]{7,20}$'),
  alternate_phone  text CHECK (alternate_phone IS NULL OR alternate_phone ~ '^\+?[0-9 ()-]{7,20}$'),
  PRIMARY KEY (employee_id, position)
);
CREATE TABLE IF NOT EXISTS public.employee_documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  category      text NOT NULL CHECK (category IN ('certificate', 'education', 'experience', 'id_proof', 'address_proof', 'photo', 'other')),
  title         text NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  storage_path  text NOT NULL UNIQUE,
  file_name     text NOT NULL CHECK (length(file_name) BETWEEN 1 AND 255),
  file_size     bigint NOT NULL CHECK (file_size BETWEEN 1 AND 10485760),
  by_company    boolean NOT NULL DEFAULT false,   -- added by an admin
  uploaded_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS employee_documents_emp ON public.employee_documents (employee_id, uploaded_at DESC);
ALTER TABLE public.employee_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.employee_profiles, public.emergency_contacts, public.employee_documents FROM anon, authenticated;

INSERT INTO public.rbac_permissions (key, area, label, description, sort_order, grp, page, tab, action_label, kind, sensitive) VALUES
  ('portal.employees.documents', 'admin',  'Employees: Documents',      'See employees'' documents and add company documents.', 207, 'Employees',       'Employees',  NULL, 'Documents',  'action', true),
  ('emp.profile.edit',           'portal', 'My profile: Edit',          'Edit own personal details and emergency contacts.',    630, 'Employee Portal', 'My profile', NULL, 'Edit',       'action', false),
  ('emp.documents.create',       'portal', 'My profile › Documents',    'Upload and delete own documents.',                     631, 'Employee Portal', 'My profile', NULL, 'Documents',  'action', false)
ON CONFLICT (key) DO NOTHING;
INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('admin', 'portal.employees.documents'), ('employee', 'emp.profile.edit'), ('employee', 'emp.documents.create')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Access helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._doc_is_mine(_emp uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT coalesce(_emp = public.portal_my_employee_id(), false); $$;

CREATE OR REPLACE FUNCTION public._doc_is_admin(_emp uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT coalesce(public.rbac_can('portal.employees.documents') AND public.rbac_emp_visible('employees', _emp), false); $$;

-- Used by the storage policies: the folder name is the employee id.
CREATE OR REPLACE FUNCTION public.doc_folder_access(_folder text, _write boolean)
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _emp uuid;
BEGIN
  BEGIN _emp := _folder::uuid; EXCEPTION WHEN OTHERS THEN RETURN false; END;
  RETURN public._doc_is_admin(_emp)
      OR (public._doc_is_mine(_emp) AND (NOT _write OR public.rbac_can('emp.documents.create')));
END;
$$;

-- ---------------------------------------------------------------------------
-- Profile
-- ---------------------------------------------------------------------------
-- _emp NULL = my own. Admins need "Employees: Personal details" for someone else.
CREATE OR REPLACE FUNCTION public.profile_get(_emp uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _id uuid := coalesce(_emp, public.portal_my_employee_id()); _personal boolean;
BEGIN
  IF _id IS NULL THEN RAISE EXCEPTION 'Only an active employee can do this.' USING ERRCODE = '42501'; END IF;
  _personal := public._doc_is_mine(_id)
    OR coalesce(public.rbac_can('portal.employees.personal') AND public.rbac_emp_visible('employees', _id), false);
  IF NOT _personal AND NOT public._doc_is_admin(_id) THEN
    RAISE EXCEPTION 'You do not have permission to see this profile.' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'employee_id', _id,
    'can_see_personal', _personal,
    'work', (SELECT jsonb_build_object('full_name', e.full_name, 'employee_code', e.employee_code, 'email', e.email,
               'department', e.department, 'designation', e.designation,
               'joined_on', CASE WHEN _personal THEN e.joined_on END,
               'employment_type', e.employment_type, 'work_location', e.work_location,
               'manager', (SELECT m.full_name FROM public.employees m WHERE m.id = e.reporting_manager_id))
               FROM public.employees e WHERE e.id = _id),
    'personal', CASE WHEN _personal THEN coalesce(
        (SELECT to_jsonb(p) - 'employee_id' - 'updated_at' FROM public.employee_profiles p WHERE p.employee_id = _id), '{}'::jsonb)
        || jsonb_build_object('phone', (SELECT phone FROM public.employees WHERE id = _id)) END,
    'contacts', CASE WHEN _personal THEN coalesce((SELECT jsonb_agg(to_jsonb(c) - 'employee_id' ORDER BY c.position)
        FROM public.emergency_contacts c WHERE c.employee_id = _id), '[]'::jsonb) ELSE '[]'::jsonb END,
    'can_see_documents', public._doc_is_mine(_id) OR public._doc_is_admin(_id),
    'documents', CASE WHEN public._doc_is_mine(_id) OR public._doc_is_admin(_id) THEN coalesce((
        SELECT jsonb_agg(jsonb_build_object('id', d.id, 'category', d.category, 'title', d.title, 'storage_path', d.storage_path,
                 'file_name', d.file_name, 'file_size', d.file_size, 'by_company', d.by_company, 'uploaded_at', d.uploaded_at,
                 'can_delete', public._doc_is_admin(_id) OR (public._doc_is_mine(_id) AND NOT d.by_company AND public.rbac_can('emp.documents.create')))
               ORDER BY d.by_company DESC, d.uploaded_at DESC)
          FROM public.employee_documents d WHERE d.employee_id = _id), '[]'::jsonb) ELSE '[]'::jsonb END);
END;
$$;

CREATE OR REPLACE FUNCTION public.profile_save(_p jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e     public.employees := public._att_me();
  _dob   date;
  _phone text := nullif(btrim(coalesce(_p->>'phone', '')), '');
  _mail  text := nullif(btrim(coalesce(_p->>'personal_email', '')), '');
  _alt   text := nullif(btrim(coalesce(_p->>'alternate_phone', '')), '');
BEGIN
  PERFORM public.rbac_require('emp.profile.edit');
  _dob := nullif(_p->>'date_of_birth', '')::date;
  IF _dob IS NOT NULL AND (_dob <= '1920-01-01' OR _dob > (current_date - interval '14 years')::date) THEN
    RAISE EXCEPTION 'Enter a valid date of birth (at least 14 years ago).' USING ERRCODE = '22023';
  END IF;
  IF (_phone IS NOT NULL AND _phone !~ '^\+?[0-9 ()-]{7,20}$') OR (_alt IS NOT NULL AND _alt !~ '^\+?[0-9 ()-]{7,20}$') THEN
    RAISE EXCEPTION 'Phone numbers: 7-20 digits; +, spaces, ( ) and - are allowed.' USING ERRCODE = '22023';
  END IF;
  IF _mail IS NOT NULL AND (_mail !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(_mail) > 254) THEN
    RAISE EXCEPTION 'Enter a valid personal email address.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.employees SET phone = _phone, updated_at = now() WHERE id = _e.id;
  INSERT INTO public.employee_profiles (employee_id) VALUES (_e.id) ON CONFLICT DO NOTHING;
  UPDATE public.employee_profiles SET
    date_of_birth = _dob, personal_email = _mail, alternate_phone = _alt,
    gender = nullif(_p->>'gender', ''), blood_group = nullif(_p->>'blood_group', ''),
    marital_status = nullif(_p->>'marital_status', ''), nationality = nullif(btrim(coalesce(_p->>'nationality', '')), ''),
    current_address = nullif(btrim(coalesce(_p->>'current_address', '')), ''),
    permanent_address = nullif(btrim(coalesce(_p->>'permanent_address', '')), ''), updated_at = now()
   WHERE employee_id = _e.id;
  RETURN public.profile_get(NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.profile_save_contacts(_list jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me(); _c jsonb; _n int := 0;
BEGIN
  PERFORM public.rbac_require('emp.profile.edit');
  IF _list IS NULL OR jsonb_typeof(_list) <> 'array' OR jsonb_array_length(_list) NOT BETWEEN 1 AND 3 THEN
    RAISE EXCEPTION 'Add 1 to 3 emergency contacts.' USING ERRCODE = '22023';
  END IF;
  DELETE FROM public.emergency_contacts WHERE employee_id = _e.id;
  FOR _c IN SELECT * FROM jsonb_array_elements(_list) LOOP
    _n := _n + 1;
    IF btrim(coalesce(_c->>'name', '')) = '' OR btrim(coalesce(_c->>'relationship', '')) = ''
       OR btrim(coalesce(_c->>'phone', '')) !~ '^\+?[0-9 ()-]{7,20}$'
       OR (btrim(coalesce(_c->>'alternate_phone', '')) <> '' AND btrim(_c->>'alternate_phone') !~ '^\+?[0-9 ()-]{7,20}$') THEN
      RAISE EXCEPTION 'Each contact needs a name, relationship and a valid phone number.' USING ERRCODE = '22023';
    END IF;
    INSERT INTO public.emergency_contacts (employee_id, position, name, relationship, phone, alternate_phone)
    VALUES (_e.id, _n, btrim(_c->>'name'), btrim(_c->>'relationship'), btrim(_c->>'phone'), nullif(btrim(coalesce(_c->>'alternate_phone', '')), ''));
  END LOOP;
  RETURN public.profile_get(NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_work_details(_id uuid, _type text, _location text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT (public.rbac_can('portal.employees.edit') OR public.rbac_can('portal.employees.create')) THEN
    RAISE EXCEPTION 'You do not have permission to change work details.' USING ERRCODE = '42501';
  END IF;
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'employees', _id) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
  IF EXISTS (SELECT 1 FROM public.employees WHERE id = _id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'You cannot change your own employee record. Ask another administrator.' USING ERRCODE = '42501';
  END IF;
  UPDATE public.employees SET employment_type = nullif(_type, ''), work_location = nullif(btrim(coalesce(_location, '')), ''),
    updated_at = now() WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
END;
$$;

-- The first day the attendance calendar may mark as absent.
CREATE OR REPLACE FUNCTION public.att_my_since()
RETURNS date
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT greatest(public._att_date(e.created_at), coalesce(e.joined_on, public._att_date(e.created_at)))
    FROM public.employees e WHERE e.user_id = auth.uid() AND e.active;
$$;

-- ---------------------------------------------------------------------------
-- Documents
-- ---------------------------------------------------------------------------
-- Registers an uploaded file. _emp is the owner (the caller, or someone an admin manages).
CREATE OR REPLACE FUNCTION public.doc_add(_emp uuid, _category text, _title text, _path text, _name text, _size bigint)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _company boolean := NOT public._doc_is_mine(_emp);
  _id uuid;
BEGIN
  IF _emp IS NULL OR NOT (public._doc_is_admin(_emp) OR (public._doc_is_mine(_emp) AND public.rbac_can('emp.documents.create'))) THEN
    RAISE EXCEPTION 'You do not have permission to add this document.' USING ERRCODE = '42501';
  END IF;
  IF _path IS NULL OR split_part(_path, '/', 1) <> _emp::text OR _path LIKE '%..%' THEN
    RAISE EXCEPTION 'Invalid file location.' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'employee-documents' AND name = _path) THEN
    RAISE EXCEPTION 'The file was not uploaded.' USING ERRCODE = 'P0002';
  END IF;
  IF coalesce(_size, 0) NOT BETWEEN 1 AND 10485760 THEN RAISE EXCEPTION 'The file must be 10 MB or smaller.' USING ERRCODE = '22023'; END IF;
  IF (SELECT count(*) FROM public.employee_documents WHERE employee_id = _emp) >= 50 THEN
    RAISE EXCEPTION 'Up to 50 documents can be kept. Delete one first.' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.employee_documents (employee_id, category, title, storage_path, file_name, file_size, by_company, uploaded_by)
  VALUES (_emp, _category, left(coalesce(nullif(btrim(coalesce(_title, '')), ''), btrim(_name)), 120), _path,
          left(btrim(_name), 255), _size, _company, auth.uid())
  RETURNING id INTO _id;
  IF _company THEN
    PERFORM public._notify(_emp, 'message', 'A new document was added to your profile',
      (SELECT title FROM public.employee_documents WHERE id = _id), '/portal/profile');
  END IF;
  RETURN _id;
END;
$$;

-- Returns the file path, so the caller can remove the file too.
CREATE OR REPLACE FUNCTION public.doc_delete(_id uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _d public.employee_documents;
BEGIN
  SELECT * INTO _d FROM public.employee_documents WHERE id = _id;
  IF _d.id IS NULL OR NOT (public._doc_is_admin(_d.employee_id)
       OR (public._doc_is_mine(_d.employee_id) AND NOT _d.by_company AND public.rbac_can('emp.documents.create'))) THEN
    RAISE EXCEPTION 'You cannot delete this document.' USING ERRCODE = '42501';
  END IF;
  DELETE FROM public.employee_documents WHERE id = _id;
  RETURN _d.storage_path;
END;
$$;

CREATE OR REPLACE FUNCTION public.doc_path_in_use(_path text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (SELECT 1 FROM public.employee_documents WHERE storage_path = _path); $$;

REVOKE ALL ON FUNCTION public._doc_is_mine(uuid), public._doc_is_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.doc_folder_access(text, boolean), public.doc_path_in_use(text), public.profile_get(uuid),
  public.profile_save(jsonb), public.profile_save_contacts(jsonb), public.doc_add(uuid, text, text, text, text, bigint),
  public.doc_delete(uuid), public.admin_set_work_details(uuid, text, text), public.att_my_since() FROM PUBLIC, anon;
-- doc_folder_access and doc_path_in_use are used inside the storage policies.
GRANT EXECUTE ON FUNCTION public.doc_folder_access(text, boolean), public.doc_path_in_use(text), public.profile_get(uuid),
  public.profile_save(jsonb), public.profile_save_contacts(jsonb), public.doc_add(uuid, text, text, text, text, bigint),
  public.doc_delete(uuid), public.admin_set_work_details(uuid, text, text), public.att_my_since() TO authenticated;

-- ---------------------------------------------------------------------------
-- Private storage bucket
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('employee-documents', 'employee-documents', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Employee documents: read" ON storage.objects;
CREATE POLICY "Employee documents: read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'employee-documents' AND public.doc_folder_access((storage.foldername(name))[1], false));
DROP POLICY IF EXISTS "Employee documents: upload" ON storage.objects;
CREATE POLICY "Employee documents: upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'employee-documents' AND public.doc_folder_access((storage.foldername(name))[1], true));
-- A file may be removed once nothing refers to it (after doc_delete), so an
-- employee can't remove the file behind a company document.
DROP POLICY IF EXISTS "Employee documents: delete" ON storage.objects;
CREATE POLICY "Employee documents: delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'employee-documents' AND public.doc_folder_access((storage.foldername(name))[1], true)
         AND NOT public.doc_path_in_use(name));

COMMIT;

-- Tell the API about the new functions straight away.
NOTIFY pgrst, 'reload schema';

SELECT part, ok FROM (VALUES
  (1, 'Four roles',              to_regclass('public.rbac_four_roles_backup') IS NOT NULL),
  (2, 'Change email',            to_regprocedure('public.rbac_admin_change_email(uuid, text)') IS NOT NULL),
  (3, 'Daily reports',           to_regclass('public.work_reports') IS NOT NULL),
  (4, 'Notifications',           to_regclass('public.notifications') IS NOT NULL),
  (5, 'Projects',                to_regclass('public.projects') IS NOT NULL),
  (6, 'Profile and documents',   to_regclass('public.employee_documents') IS NOT NULL)
) v(n, part, ok) ORDER BY n;
