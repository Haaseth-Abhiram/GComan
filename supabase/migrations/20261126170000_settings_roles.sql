-- Admin → Settings: Users & Roles, Roles & Permissions.
--
-- The admin controls every permission: create roles (e.g. HR, Accounts), tick
-- the permissions each role has, and give roles to people. Anyone whose roles
-- include an admin-area permission can open the admin panel, but only sees
-- the pages their permissions allow (the database checks every action).
--
-- Safety rules:
--   * Super Admin (= website admin, user_roles.role = 'admin') always has every
--     permission; its column can't be edited. Only a Super Admin can make or
--     remove another Super Admin, and at least one must remain.
--   * Nobody can change their own roles.
--   * Only a Super Admin can change Settings permissions, or give/remove a role
--     that holds a Settings permission (so nobody can promote themselves).
--   * Built-in roles can't be deleted. Employee and Manager are automatic
--     (everyone active / anyone with reports), but their permissions are editable.

-- ---------------------------------------------------------------------------
-- 1. Catalogue changes
-- ---------------------------------------------------------------------------
ALTER TABLE public.rbac_roles ADD COLUMN IF NOT EXISTS builtin boolean NOT NULL DEFAULT false;
UPDATE public.rbac_roles SET builtin = true WHERE key IN ('super_admin', 'manager', 'proposal_engineer', 'employee');

ALTER TABLE public.rbac_permissions ADD COLUMN IF NOT EXISTS grp text NOT NULL DEFAULT 'Other';

INSERT INTO public.rbac_permissions (key, area, label, description, sort_order) VALUES
  ('settings.users.view', 'admin', 'Users & roles: view', 'See who has which role.',                         90),
  ('settings.users.edit', 'admin', 'Users & roles: edit', 'Give and remove roles.',                          91),
  ('settings.roles.view', 'admin', 'Roles & permissions: view', 'See each role''s permissions.',            92),
  ('settings.roles.edit', 'admin', 'Roles & permissions: edit', 'Create roles and change their permissions.', 93)
ON CONFLICT (key) DO UPDATE SET area = EXCLUDED.area, label = EXCLUDED.label,
  description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

UPDATE public.rbac_permissions SET grp = CASE
  WHEN key LIKE 'portal.employees.%'  THEN 'Employees (admin)'
  WHEN key LIKE 'portal.attendance.%' THEN 'Attendance (admin)'
  WHEN key LIKE 'portal.leave.%'      THEN 'Leave (admin)'
  WHEN key LIKE 'settings.%'          THEN 'Settings (admin)'
  WHEN key LIKE 'emp.%'               THEN 'Employee Portal'
  WHEN key LIKE 'team.%'              THEN 'Managers'
  WHEN key LIKE 'proposal.%'          THEN 'Proposal Tracker'
  ELSE 'Other' END;

-- (No ready-made admin roles: the admin creates their own in Settings → Roles.)

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._rbac_is_super(_uid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT _uid IS NOT NULL AND public.has_role(_uid, 'admin'); $$;

-- Does the role hold any Settings permission?
CREATE OR REPLACE FUNCTION public._rbac_role_is_sensitive(_role text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (SELECT 1 FROM public.rbac_role_permissions WHERE role_key = _role AND permission_key LIKE 'settings.%'); $$;

-- Replaces the user's stored roles. Shared by the Employees page and Settings.
-- Only a Super Admin may add or remove a role that holds Settings permissions.
CREATE OR REPLACE FUNCTION public._portal_set_roles(_user uuid, _roles text[])
RETURNS void
LANGUAGE plpgsql SET search_path = ''
AS $$
DECLARE _changed text;
BEGIN
  IF NOT public._rbac_is_super(auth.uid()) THEN
    SELECT r INTO _changed FROM (
      SELECT role_key AS r FROM public.rbac_user_roles WHERE user_id = _user AND NOT role_key = ANY (_roles)
      UNION
      SELECT x FROM unnest(_roles) x WHERE NOT EXISTS (SELECT 1 FROM public.rbac_user_roles WHERE user_id = _user AND role_key = x)
    ) c WHERE public._rbac_role_is_sensitive(c.r) LIMIT 1;
    IF _changed IS NOT NULL THEN
      RAISE EXCEPTION 'Only a Super Admin can give or remove the % role (it can change settings).',
        (SELECT name FROM public.rbac_roles WHERE key = _changed) USING ERRCODE = '42501';
    END IF;
  END IF;
  DELETE FROM public.rbac_user_roles WHERE user_id = _user AND NOT role_key = ANY (_roles);
  INSERT INTO public.rbac_user_roles (user_id, role_key, granted_by)
  SELECT _user, r, auth.uid() FROM unnest(_roles) r
  ON CONFLICT DO NOTHING;
END;
$$;

-- ---------------------------------------------------------------------------
-- 3. What the signed-in user can do (now also: may they open the admin panel?)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rbac_my_access()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _uid   uuid := auth.uid();
  _roles text[];
  _emp   public.employees;
  _perms jsonb;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('is_super_admin', false, 'admin_pages', false, 'roles', '[]'::jsonb, 'permissions', '[]'::jsonb, 'employee', null);
  END IF;
  _roles := public.rbac_roles_of(_uid);
  SELECT * INTO _emp FROM public.employees WHERE user_id = _uid;
  _perms := coalesce((SELECT jsonb_agg(p.key ORDER BY p.sort_order) FROM public.rbac_permissions p
                       WHERE public.rbac_user_can(_uid, p.key)), '[]'::jsonb);
  RETURN jsonb_build_object(
    'is_super_admin', 'super_admin' = ANY (_roles),
    'admin_pages', 'super_admin' = ANY (_roles) OR EXISTS (
        SELECT 1 FROM public.rbac_permissions p WHERE p.area = 'admin' AND public.rbac_user_can(_uid, p.key)),
    'roles', coalesce((SELECT jsonb_agg(jsonb_build_object('key', r.key, 'name', r.name, 'area', r.area) ORDER BY r.sort_order)
                         FROM public.rbac_roles r WHERE r.key = ANY (_roles)), '[]'::jsonb),
    'permissions', _perms,
    'employee', CASE WHEN _emp.id IS NULL THEN NULL ELSE jsonb_build_object(
      'id', _emp.id, 'employee_code', _emp.employee_code, 'full_name', _emp.full_name, 'email', _emp.email,
      'phone', _emp.phone, 'department', _emp.department, 'designation', _emp.designation, 'joined_on', _emp.joined_on,
      'proposal_code', _emp.proposal_code, 'active', _emp.active, 'must_change_password', _emp.must_change_password,
      'manager_name', (SELECT m.full_name FROM public.employees m WHERE m.id = _emp.reporting_manager_id)) END
  );
END;
$$;

-- Roles that can be given to people (everything except the automatic ones).
CREATE OR REPLACE FUNCTION public.rbac_assignable_roles()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT (public.rbac_can('portal.employees.view') OR public.rbac_can('settings.users.view')) THEN
    RAISE EXCEPTION 'You do not have permission for this.' USING ERRCODE = '42501';
  END IF;
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('key', r.key, 'name', r.name, 'description', r.description,
                     'sensitive', public._rbac_role_is_sensitive(r.key)) ORDER BY r.sort_order, r.name)
                     FROM public.rbac_roles r WHERE NOT r.implicit), '[]'::jsonb);
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. Roles & Permissions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rbac_admin_overview()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT (public.rbac_can('settings.roles.view') OR public.rbac_can('settings.users.view')) THEN
    RAISE EXCEPTION 'You do not have permission for this (Settings).' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'can_edit_roles', public.rbac_can('settings.roles.edit'),
    'can_edit_users', public.rbac_can('settings.users.edit'),
    'is_super_admin', public._rbac_is_super(auth.uid()),
    'roles', (SELECT jsonb_agg(jsonb_build_object(
                'key', r.key, 'name', r.name, 'description', r.description, 'area', r.area,
                'implicit', r.implicit, 'builtin', r.builtin,
                'users', CASE r.key
                           WHEN 'super_admin' THEN (SELECT count(*) FROM public.user_roles WHERE role = 'admin')
                           WHEN 'employee' THEN (SELECT count(*) FROM public.employees WHERE active)
                           WHEN 'manager' THEN (SELECT count(DISTINCT m.id) FROM public.employees m
                                                  JOIN public.employees e ON e.reporting_manager_id = m.id AND e.active WHERE m.active)
                           ELSE (SELECT count(*) FROM public.rbac_user_roles ur JOIN public.employees e ON e.user_id = ur.user_id AND e.active
                                  WHERE ur.role_key = r.key) END,
                'permissions', CASE WHEN r.key = 'super_admin'
                                    THEN (SELECT jsonb_agg(p.key) FROM public.rbac_permissions p)
                                    ELSE coalesce((SELECT jsonb_agg(rp.permission_key) FROM public.rbac_role_permissions rp WHERE rp.role_key = r.key), '[]'::jsonb) END)
              ORDER BY r.sort_order, r.name) FROM public.rbac_roles r),
    'permissions', (SELECT jsonb_agg(jsonb_build_object('key', p.key, 'area', p.area, 'grp', p.grp, 'label', p.label,
                      'description', p.description) ORDER BY p.area, p.sort_order) FROM public.rbac_permissions p));
END;
$$;

CREATE OR REPLACE FUNCTION public.rbac_admin_set_permission(_role text, _perm text, _on boolean)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('settings.roles.edit');
  IF NOT EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _role) THEN RAISE EXCEPTION 'Role not found.' USING ERRCODE = 'P0002'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.rbac_permissions WHERE key = _perm) THEN RAISE EXCEPTION 'Permission not found.' USING ERRCODE = 'P0002'; END IF;
  IF _role = 'super_admin' THEN RAISE EXCEPTION 'Super Admin always has every permission.' USING ERRCODE = '42501'; END IF;
  IF NOT public._rbac_is_super(auth.uid()) AND (_perm LIKE 'settings.%' OR public._rbac_role_is_sensitive(_role)) THEN
    RAISE EXCEPTION 'Only a Super Admin can change Settings permissions or a role that has them.' USING ERRCODE = '42501';
  END IF;
  IF NOT public._rbac_is_super(auth.uid())
     AND EXISTS (SELECT 1 FROM public.rbac_user_roles WHERE user_id = auth.uid() AND role_key = _role) THEN
    RAISE EXCEPTION 'You cannot change a role you hold yourself. Ask a Super Admin.' USING ERRCODE = '42501';
  END IF;
  IF _on THEN
    INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES (_role, _perm) ON CONFLICT DO NOTHING;
  ELSE
    DELETE FROM public.rbac_role_permissions WHERE role_key = _role AND permission_key = _perm;
  END IF;
END;
$$;

-- Create (no _key) or rename/describe a role. Returns its key.
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

CREATE OR REPLACE FUNCTION public.rbac_admin_delete_role(_key text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('settings.roles.edit');
  IF EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _key AND builtin) THEN
    RAISE EXCEPTION 'Built-in roles can''t be deleted.' USING ERRCODE = '42501';
  END IF;
  IF NOT public._rbac_is_super(auth.uid()) AND public._rbac_role_is_sensitive(_key) THEN
    RAISE EXCEPTION 'Only a Super Admin can delete a role that has Settings permissions.' USING ERRCODE = '42501';
  END IF;
  IF NOT public._rbac_is_super(auth.uid())
     AND EXISTS (SELECT 1 FROM public.rbac_user_roles WHERE user_id = auth.uid() AND role_key = _key) THEN
    RAISE EXCEPTION 'You cannot delete a role you hold yourself.' USING ERRCODE = '42501';
  END IF;
  DELETE FROM public.rbac_roles WHERE key = _key;   -- also removes it from everyone (cascade)
  IF NOT FOUND THEN RAISE EXCEPTION 'Role not found.' USING ERRCODE = 'P0002'; END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. Users & Roles
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rbac_admin_users()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('settings.users.view');
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY (x->>'is_super_admin')::boolean DESC, x->>'full_name') FROM (
    SELECT jsonb_build_object(
      'user_id', u.id, 'email', u.email, 'last_sign_in_at', u.last_sign_in_at,
      'employee_id', e.id, 'employee_code', e.employee_code,
      'full_name', coalesce(e.full_name, u.raw_user_meta_data->>'name', u.email),
      'active', coalesce(e.active, true), 'proposal_code', e.proposal_code,
      'is_super_admin', public._rbac_is_super(u.id),
      'is_self', u.id = auth.uid(),
      'roles', coalesce((SELECT jsonb_agg(ur.role_key) FROM public.rbac_user_roles ur WHERE ur.user_id = u.id), '[]'::jsonb),
      'automatic', to_jsonb(array_remove(ARRAY[
          CASE WHEN e.active THEN 'employee' END,
          CASE WHEN EXISTS (SELECT 1 FROM public.employees r WHERE r.reporting_manager_id = e.id AND r.active) AND e.active THEN 'manager' END], NULL))
    ) AS x
    FROM auth.users u LEFT JOIN public.employees e ON e.user_id = u.id
    WHERE e.id IS NOT NULL OR public._rbac_is_super(u.id)) t), '[]'::jsonb);
END;
$$;

-- Replaces a person's roles. Only employees hold roles (Super Admins already have everything).
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

-- Make or remove a Super Admin (website administrator). Super Admins only.
CREATE OR REPLACE FUNCTION public.rbac_admin_set_super_admin(_user uuid, _on boolean)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT public._rbac_is_super(auth.uid()) THEN
    RAISE EXCEPTION 'Only a Super Admin can do this.' USING ERRCODE = '42501';
  END IF;
  IF _user = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own Super Admin access. Ask another Super Admin.' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = _user) THEN RAISE EXCEPTION 'User not found.' USING ERRCODE = 'P0002'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('rbac-super', 0));
  IF _on THEN
    IF NOT public.has_role(_user, 'admin') THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (_user, 'admin');
    END IF;
  ELSE
    DELETE FROM public.user_roles WHERE user_id = _user AND role = 'admin';
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
      RAISE EXCEPTION 'At least one Super Admin must remain.' USING ERRCODE = '22023';
    END IF;
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. Grants
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public._rbac_is_super(uuid), public._rbac_role_is_sensitive(text), public._portal_set_roles(uuid, text[])
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rbac_assignable_roles(), public.rbac_admin_overview(), public.rbac_admin_set_permission(text, text, boolean),
  public.rbac_admin_save_role(text, text, text), public.rbac_admin_delete_role(text), public.rbac_admin_users(),
  public.rbac_admin_set_user_roles(uuid, text[]), public.rbac_admin_set_super_admin(uuid, boolean)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rbac_assignable_roles(), public.rbac_admin_overview(), public.rbac_admin_set_permission(text, text, boolean),
  public.rbac_admin_save_role(text, text, text), public.rbac_admin_delete_role(text), public.rbac_admin_users(),
  public.rbac_admin_set_user_roles(uuid, text[]), public.rbac_admin_set_super_admin(uuid, boolean)
  TO authenticated;
