-- Undo 20261127090000_four_roles.sql.
-- Restores the previous roles (including custom roles and Proposal Engineer),
-- role permissions, scopes, people's roles, exceptions and tracker codes from
-- public.rbac_four_roles_backup, and the previous functions.
-- Role and permission changes made AFTER the migration are replaced by the
-- backup. Take a database backup first. Run the whole file once.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.rbac_four_roles_backup') IS NULL THEN
    RAISE EXCEPTION 'No backup found: the four-roles migration is not applied.';
  END IF;
END;
$$;

ALTER TABLE public.rbac_roles DROP CONSTRAINT IF EXISTS rbac_roles_four_only;

DELETE FROM public.rbac_user_scopes;
DELETE FROM public.rbac_user_overrides;
DELETE FROM public.rbac_user_roles;
DELETE FROM public.rbac_role_scopes;
DELETE FROM public.rbac_role_permissions;
DELETE FROM public.rbac_roles WHERE key NOT IN (SELECT data->>'key' FROM public.rbac_four_roles_backup WHERE kind = 'role');

INSERT INTO public.rbac_roles
SELECT (jsonb_populate_record(NULL::public.rbac_roles, data)).* FROM public.rbac_four_roles_backup WHERE kind = 'role'
ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, area = EXCLUDED.area,
  sort_order = EXCLUDED.sort_order, implicit = EXCLUDED.implicit, builtin = EXCLUDED.builtin, active = EXCLUDED.active;

INSERT INTO public.rbac_role_permissions
SELECT (jsonb_populate_record(NULL::public.rbac_role_permissions, data)).* FROM public.rbac_four_roles_backup WHERE kind = 'role_permission';
INSERT INTO public.rbac_role_scopes
SELECT (jsonb_populate_record(NULL::public.rbac_role_scopes, data)).* FROM public.rbac_four_roles_backup WHERE kind = 'role_scope';
-- People deleted since the migration are skipped.
INSERT INTO public.rbac_user_roles
SELECT (jsonb_populate_record(NULL::public.rbac_user_roles, data)).* FROM public.rbac_four_roles_backup
 WHERE kind = 'user_role' AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = (data->>'user_id')::uuid);
INSERT INTO public.rbac_user_overrides
SELECT (jsonb_populate_record(NULL::public.rbac_user_overrides, data)).* FROM public.rbac_four_roles_backup
 WHERE kind = 'user_override' AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = (data->>'user_id')::uuid);
INSERT INTO public.rbac_user_scopes
SELECT (jsonb_populate_record(NULL::public.rbac_user_scopes, data)).* FROM public.rbac_four_roles_backup
 WHERE kind = 'user_scope' AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = (data->>'user_id')::uuid);

UPDATE public.employees SET proposal_code = NULL;
UPDATE public.employees e SET proposal_code = b.data->>'proposal_code'
  FROM public.rbac_four_roles_backup b
 WHERE b.kind = 'proposal_code' AND e.id = (b.data->>'id')::uuid;

-- ---------------------------------------------------------------------------
-- Previous functions
-- ---------------------------------------------------------------------------
-- from 20261126180000_rbac_core.sql
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
  IF _effect = 'allow' AND EXISTS (SELECT 1 FROM public.employees WHERE user_id = _user AND active) THEN RETURN true; END IF;
  RETURN EXISTS (SELECT 1 FROM public.rbac_role_permissions rp
                  WHERE rp.permission_key = _perm AND rp.role_key = ANY (public.rbac_roles_of(_user)));
END;
$$;

-- from 20261126140000_employee_portal_foundation.sql
CREATE OR REPLACE FUNCTION public._portal_check_employee(_id uuid, _p jsonb, _roles text[])
RETURNS void
LANGUAGE plpgsql STABLE SET search_path = ''
AS $$
DECLARE _mgr uuid := nullif(_p->>'reporting_manager_id', '')::uuid; _cur uuid; _hops int := 0;
BEGIN
  IF length(trim(coalesce(_p->>'full_name', ''))) NOT BETWEEN 1 AND 120 THEN
    RAISE EXCEPTION 'Enter the employee''s full name.' USING ERRCODE = '22023';
  END IF;
  IF upper(trim(coalesce(_p->>'employee_code', ''))) !~ '^[A-Z0-9-]{2,20}$' THEN
    RAISE EXCEPTION 'Employee ID must be 2-20 letters, numbers or dashes, e.g. GC001.' USING ERRCODE = '22023';
  END IF;
  IF 'proposal_engineer' = ANY (_roles) THEN
    IF upper(trim(coalesce(_p->>'proposal_code', ''))) !~ '^P[0-9]+$' THEN
      RAISE EXCEPTION 'A proposal engineer needs a tracker code: P followed by a number, e.g. P4.' USING ERRCODE = '22023';
    END IF;
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

-- from 20261126140000_employee_portal_foundation.sql
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
          CASE WHEN 'proposal_engineer' = ANY (_roles) THEN upper(trim(_p->>'proposal_code')) END,
          _uid, auth.uid());
  PERFORM public._portal_set_roles(_uid, _roles);
  RETURN _id;
END;
$$;

-- from 20261126180100_rbac_enforcement.sql
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

-- from 20261126180100_rbac_enforcement.sql
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

-- from 20261126180100_rbac_enforcement.sql
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

-- from 20261126180100_rbac_enforcement.sql
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

-- from 20261126170000_settings_roles.sql
CREATE OR REPLACE FUNCTION public.rbac_admin_set_user_roles(_user uuid, _roles text[])
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _emp public.employees; _clean text[];
BEGIN
  PERFORM public.rbac_require('settings.users.edit');
  IF _user = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own roles. Ask another administrator.' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO _emp FROM public.employees WHERE user_id = _user;
  IF _emp.id IS NULL THEN
    RAISE EXCEPTION 'Only employees can be given roles. Add this person on the Employees page first.' USING ERRCODE = '22023';
  END IF;
  _clean := public._portal_clean_roles(_roles);
  PERFORM pg_advisory_xact_lock(hashtextextended('rbac-roles', 0));
  PERFORM public._portal_set_roles(_user, _clean);
  -- The Proposal Tracker needs a tracker code: give the next free P# when the role is added.
  IF 'proposal_engineer' = ANY (_clean) AND _emp.proposal_code IS NULL THEN
    UPDATE public.employees SET proposal_code = 'P' || (coalesce((SELECT max(substring(proposal_code FROM 2)::int) FROM public.employees
                                                                  WHERE proposal_code ~ '^P[0-9]+$'), 0) + 1), updated_at = now()
     WHERE id = _emp.id;
  ELSIF NOT ('proposal_engineer' = ANY (_clean)) AND _emp.proposal_code IS NOT NULL THEN
    UPDATE public.employees SET proposal_code = NULL, updated_at = now() WHERE id = _emp.id;
  END IF;
END;
$$;

-- from 20261126170000_settings_roles.sql
CREATE OR REPLACE FUNCTION public.rbac_admin_save_role(_key text, _name text, _description text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _k text; _n text := trim(coalesce(_name, ''));
BEGIN
  PERFORM public.rbac_require('settings.roles.edit');
  IF length(_n) NOT BETWEEN 1 AND 40 THEN RAISE EXCEPTION 'Enter a role name (up to 40 characters).' USING ERRCODE = '22023'; END IF;
  IF EXISTS (SELECT 1 FROM public.rbac_roles WHERE lower(name) = lower(_n) AND key IS DISTINCT FROM _key) THEN
    RAISE EXCEPTION 'A role with this name already exists.' USING ERRCODE = '23505';
  END IF;
  IF _key IS NULL OR _key = '' THEN
    _k := left(trim(BOTH '_' FROM regexp_replace(lower(_n), '[^a-z]+', '_', 'g')), 30);
    IF length(_k) < 2 THEN _k := 'role'; END IF;
    WHILE EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _k) LOOP _k := _k || '_x'; END LOOP;
    INSERT INTO public.rbac_roles (key, name, description, area, sort_order, implicit, builtin)
    VALUES (_k, _n, trim(coalesce(_description, '')), 'admin',
            coalesce((SELECT max(sort_order) + 1 FROM public.rbac_roles WHERE sort_order < 60), 35), false, false);
    RETURN _k;
  END IF;
  IF _key = 'super_admin' THEN RAISE EXCEPTION 'Super Admin can''t be changed.' USING ERRCODE = '42501'; END IF;
  UPDATE public.rbac_roles SET name = _n, description = trim(coalesce(_description, '')) WHERE key = _key;
  IF NOT FOUND THEN RAISE EXCEPTION 'Role not found.' USING ERRCODE = 'P0002'; END IF;
  RETURN _key;
END;
$$;

-- from 20261126180000_rbac_core.sql
CREATE OR REPLACE FUNCTION public.rbac_admin_set_role_active(_role text, _active boolean)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('settings.roles.edit');
  IF EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _role AND builtin) THEN
    RAISE EXCEPTION 'Built-in roles are always active.' USING ERRCODE = '42501';
  END IF;
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    IF public._rbac_role_is_sensitive(_role) THEN
      RAISE EXCEPTION 'Only a Super Admin can change a role that has Settings permissions.' USING ERRCODE = '42501';
    END IF;
    IF _role = ANY (public.rbac_roles_of(auth.uid())) OR EXISTS (SELECT 1 FROM public.rbac_user_roles WHERE user_id = auth.uid() AND role_key = _role) THEN
      RAISE EXCEPTION 'You cannot change a role you hold yourself.' USING ERRCODE = '42501';
    END IF;
  END IF;
  UPDATE public.rbac_roles SET active = _active WHERE key = _role;
  IF NOT FOUND THEN RAISE EXCEPTION 'Role not found.' USING ERRCODE = 'P0002'; END IF;
END;
$$;

-- from 20261126180000_rbac_core.sql
CREATE OR REPLACE FUNCTION public.rbac_admin_delete_role(_key text, _reassign text DEFAULT NULL)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _n int;
BEGIN
  PERFORM public.rbac_require('settings.roles.edit');
  IF EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _key AND builtin) THEN
    RAISE EXCEPTION 'Built-in roles can''t be deleted.' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _key) THEN RAISE EXCEPTION 'Role not found.' USING ERRCODE = 'P0002'; END IF;
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    IF public._rbac_role_is_sensitive(_key) THEN
      RAISE EXCEPTION 'Only a Super Admin can delete a role that has Settings permissions.' USING ERRCODE = '42501';
    END IF;
    IF EXISTS (SELECT 1 FROM public.rbac_user_roles WHERE user_id = auth.uid() AND role_key = _key) THEN
      RAISE EXCEPTION 'You cannot delete a role you hold yourself.' USING ERRCODE = '42501';
    END IF;
  END IF;
  SELECT count(*) INTO _n FROM public.rbac_user_roles WHERE role_key = _key;
  IF _n > 0 THEN
    IF _reassign IS NULL THEN
      RAISE EXCEPTION '% people have this role. Choose a role to move them to first.', _n USING ERRCODE = '22023';
    END IF;
    IF _reassign <> '-' THEN
      IF NOT EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _reassign AND NOT implicit AND active AND key <> _key) THEN
        RAISE EXCEPTION 'Choose an active role to move them to.' USING ERRCODE = '22023';
      END IF;
      PERFORM public._rbac_assert_can_grant(public._rbac_role_perms(_reassign));
      INSERT INTO public.rbac_user_roles (user_id, role_key, granted_by)
      SELECT user_id, _reassign, auth.uid() FROM public.rbac_user_roles WHERE role_key = _key
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  DELETE FROM public.rbac_roles WHERE key = _key;
  RETURN _n;
END;
$$;

-- from 20261126180000_rbac_core.sql
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
                           WHEN 'manager' THEN (SELECT count(DISTINCT m.id) FROM public.employees m
                                                  JOIN public.employees e ON e.reporting_manager_id = m.id AND e.active WHERE m.active)
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

-- from 20261126180000_rbac_core.sql
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
      PERFORM public._rbac_assert_can_grant(public._rbac_role_perms(_changed));
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

-- from 20261126180000_rbac_core.sql
CREATE OR REPLACE FUNCTION public.rbac_admin_set_user_overrides(_user uuid, _overrides jsonb, _scopes jsonb)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _super boolean := public.has_role(auth.uid(), 'admin');
  _o jsonb; _res text; _scope text; _allow text[];
BEGIN
  PERFORM public.rbac_require('settings.users.edit');
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

REVOKE ALL ON FUNCTION public.rbac_admin_save_role(text, text, text), public.rbac_admin_set_role_active(text, boolean),
  public.rbac_admin_delete_role(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rbac_admin_save_role(text, text, text), public.rbac_admin_set_role_active(text, boolean),
  public.rbac_admin_delete_role(text, text) TO authenticated;

DROP FUNCTION IF EXISTS public._portal_proposal_code(jsonb, text);
DROP FUNCTION IF EXISTS public._portal_assert_can_manage_login(uuid);
DROP TABLE public.rbac_four_roles_backup;

COMMIT;
