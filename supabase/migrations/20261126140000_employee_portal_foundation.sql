-- Employee Portal, step 1: employees + roles & permissions.
--
-- Every member of staff is one row in public.employees with one login. What a
-- person can do comes from their ROLES (several per person); each role grants
-- PERMISSIONS (`module.action`). Proposal engineers are employees who hold the
-- `proposal_engineer` role, so public.proposal_engineers is folded in here
-- (same ids, so the browser-stored proposal data still points at the right
-- people) and dropped.
--
-- Roles in this step:
--   super_admin        every website admin (user_roles.role = 'admin') counts as
--                      Super Admin and passes every check. Nothing is stored.
--   employee           implicit: anyone with an ACTIVE employee row.
--   manager            implicit: anyone an active employee reports to.
--   proposal_engineer  stored in rbac_user_roles; opens the Proposal Tracker.
-- More roles (HR, team lead…) and permissions are added by later steps.
--
-- The rbac_* tables are not readable by clients: everything goes through the
-- SECURITY DEFINER functions below, which check permissions in the database.

-- ---------------------------------------------------------------------------
-- 1. Roles & permissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rbac_roles (
  key          text PRIMARY KEY CHECK (key ~ '^[a-z_]{2,40}$'),
  name         text NOT NULL,
  description  text NOT NULL DEFAULT '',
  area         text NOT NULL CHECK (area IN ('admin', 'portal')),
  sort_order   int  NOT NULL DEFAULT 100,
  implicit     boolean NOT NULL DEFAULT false  -- derived, never stored per user
);

CREATE TABLE IF NOT EXISTS public.rbac_permissions (
  key          text PRIMARY KEY CHECK (key ~ '^[a-z_.]{2,80}$'),
  area         text NOT NULL CHECK (area IN ('admin', 'portal')),
  label        text NOT NULL,
  description  text NOT NULL DEFAULT '',
  sort_order   int  NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS public.rbac_role_permissions (
  role_key        text NOT NULL REFERENCES public.rbac_roles(key) ON DELETE CASCADE,
  permission_key  text NOT NULL REFERENCES public.rbac_permissions(key) ON DELETE CASCADE,
  PRIMARY KEY (role_key, permission_key)
);

CREATE TABLE IF NOT EXISTS public.rbac_user_roles (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_key    text NOT NULL REFERENCES public.rbac_roles(key) ON DELETE CASCADE,
  granted_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_key)
);

ALTER TABLE public.rbac_roles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_permissions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_user_roles       ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.rbac_roles, public.rbac_permissions, public.rbac_role_permissions, public.rbac_user_roles
  FROM anon, authenticated;

INSERT INTO public.rbac_roles (key, name, description, area, sort_order, implicit) VALUES
  ('super_admin',       'Super Admin',       'Website administrators. Full access to everything.',               'admin',  10, true),
  ('manager',           'Manager',           'An employee other employees report to. Sees their team.',           'portal', 40, true),
  ('proposal_engineer', 'Proposal Engineer', 'Works on proposals in the Proposal Tracker.',                        'portal', 50, false),
  ('employee',          'Employee',          'Everyone with an active Employee Portal account.',                   'portal', 60, true)
ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description,
  area = EXCLUDED.area, sort_order = EXCLUDED.sort_order, implicit = EXCLUDED.implicit;

INSERT INTO public.rbac_permissions (key, area, label, description, sort_order) VALUES
  ('portal.employees.view',   'admin',  'Employees: view',   'See the employee list and details.',           10),
  ('portal.employees.create', 'admin',  'Employees: add',    'Add employees and create their logins.',       11),
  ('portal.employees.edit',   'admin',  'Employees: edit',   'Edit details, roles, passwords, disable.',     12),
  ('portal.employees.delete', 'admin',  'Employees: delete', 'Delete an employee and their login.',          13),
  ('emp.portal.view',         'portal', 'Employee Portal',   'Open the Employee Portal.',                    50),
  ('team.members.view',       'portal', 'My team',           'See the people who report to you.',            60),
  ('proposal.tracker.view',   'portal', 'Proposal Tracker',  'Open the Proposal Tracker as an engineer.',     70)
ON CONFLICT (key) DO UPDATE SET area = EXCLUDED.area, label = EXCLUDED.label,
  description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('employee',          'emp.portal.view'),
  ('manager',           'team.members.view'),
  ('proposal_engineer', 'proposal.tracker.view')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Employees
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code         text NOT NULL UNIQUE CHECK (employee_code ~ '^[A-Z0-9-]{2,20}$'),
  full_name             text NOT NULL CHECK (length(trim(full_name)) BETWEEN 1 AND 120),
  email                 text NOT NULL UNIQUE CHECK (email = lower(trim(email)) AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone                 text,
  department            text,
  designation           text,
  joined_on             date,
  reporting_manager_id  uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  proposal_code         text UNIQUE CHECK (proposal_code ~ '^P[0-9]+$'),
  active                boolean NOT NULL DEFAULT true,
  must_change_password  boolean NOT NULL DEFAULT true,
  user_id               uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  created_by            uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CHECK (reporting_manager_id IS DISTINCT FROM id)
);
CREATE INDEX IF NOT EXISTS employees_manager_idx ON public.employees(reporting_manager_id);
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 3. Permission checks
-- ---------------------------------------------------------------------------
-- The user's roles: stored ones plus the implicit super_admin / employee / manager.
CREATE OR REPLACE FUNCTION public.rbac_roles_of(_user uuid)
RETURNS text[]
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT coalesce(array_agg(k ORDER BY r.sort_order), '{}')
  FROM (
    SELECT 'super_admin' AS k WHERE public.has_role(_user, 'admin')
    UNION SELECT ur.role_key FROM public.rbac_user_roles ur
           JOIN public.employees e ON e.user_id = ur.user_id AND e.active
          WHERE ur.user_id = _user
    UNION SELECT 'employee' WHERE EXISTS (SELECT 1 FROM public.employees WHERE user_id = _user AND active)
    UNION SELECT 'manager' WHERE EXISTS (
            SELECT 1 FROM public.employees m JOIN public.employees r ON r.reporting_manager_id = m.id AND r.active
             WHERE m.user_id = _user AND m.active)
  ) x JOIN public.rbac_roles r ON r.key = x.k;
$$;

CREATE OR REPLACE FUNCTION public.rbac_user_can(_user uuid, _perm text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT _user IS NOT NULL AND (
    public.has_role(_user, 'admin')
    OR EXISTS (SELECT 1 FROM public.rbac_role_permissions rp
                WHERE rp.permission_key = _perm AND rp.role_key = ANY (public.rbac_roles_of(_user))));
$$;

-- For the signed-in user. Safe to call from RLS policies (false for visitors).
CREATE OR REPLACE FUNCTION public.rbac_can(_perm text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT public.rbac_user_can(auth.uid(), _perm); $$;

CREATE OR REPLACE FUNCTION public.rbac_require(_perm text)
RETURNS void
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _label text;
BEGIN
  IF NOT public.rbac_can(_perm) THEN
    SELECT label INTO _label FROM public.rbac_permissions WHERE key = _perm;
    RAISE EXCEPTION 'You do not have permission for this (%).', coalesce(_label, _perm) USING ERRCODE = '42501';
  END IF;
END;
$$;

-- The signed-in user's employee id (SECURITY DEFINER so policies on
-- employees can use it without recursing into themselves).
CREATE OR REPLACE FUNCTION public.portal_my_employee_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT id FROM public.employees WHERE user_id = auth.uid() AND active; $$;

-- RLS: your own row; your direct reports (managers); everyone (employee admins).
DROP POLICY IF EXISTS "Employees read own row" ON public.employees;
CREATE POLICY "Employees read own row" ON public.employees FOR SELECT TO authenticated
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Managers read their team" ON public.employees;
CREATE POLICY "Managers read their team" ON public.employees FOR SELECT TO authenticated
  USING (reporting_manager_id IS NOT NULL
         AND reporting_manager_id = public.portal_my_employee_id()
         AND public.rbac_can('team.members.view'));
DROP POLICY IF EXISTS "Employee admins read all" ON public.employees;
CREATE POLICY "Employee admins read all" ON public.employees FOR SELECT TO authenticated
  USING (public.rbac_can('portal.employees.view'));
-- No write policies: every change goes through the functions below.

-- ---------------------------------------------------------------------------
-- 4. Passwords
-- ---------------------------------------------------------------------------
-- Same rule as the website sign-up form. Returns NULL when fine, else the problem.
CREATE OR REPLACE FUNCTION public.portal_password_problem(_p text)
RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = ''
AS $$
  SELECT CASE
    WHEN _p IS NULL OR length(_p) < 8 THEN 'Password must be at least 8 characters.'
    WHEN length(_p) > 72 THEN 'Password must be at most 72 characters.'
    WHEN _p !~ '[A-Z]' THEN 'Password needs an uppercase letter.'
    WHEN _p !~ '[a-z]' THEN 'Password needs a lowercase letter.'
    WHEN _p !~ '[0-9]' THEN 'Password needs a number.'
  END;
$$;

CREATE OR REPLACE FUNCTION public._portal_assert_password(_p text)
RETURNS void
LANGUAGE plpgsql IMMUTABLE SET search_path = ''
AS $$
DECLARE _problem text := public.portal_password_problem(_p);
BEGIN
  IF _problem IS NOT NULL THEN RAISE EXCEPTION '%', _problem USING ERRCODE = '22023'; END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. What the signed-in user can do (loaded once by the front end)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rbac_my_access()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _uid   uuid := auth.uid();
  _roles text[];
  _emp   public.employees;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('is_super_admin', false, 'roles', '[]'::jsonb, 'permissions', '[]'::jsonb, 'employee', null);
  END IF;
  _roles := public.rbac_roles_of(_uid);
  SELECT * INTO _emp FROM public.employees WHERE user_id = _uid;

  RETURN jsonb_build_object(
    'is_super_admin', 'super_admin' = ANY (_roles),
    'roles', coalesce((SELECT jsonb_agg(jsonb_build_object('key', r.key, 'name', r.name, 'area', r.area) ORDER BY r.sort_order)
                         FROM public.rbac_roles r WHERE r.key = ANY (_roles)), '[]'::jsonb),
    'permissions', coalesce((SELECT jsonb_agg(p.key ORDER BY p.sort_order) FROM public.rbac_permissions p
                              WHERE public.rbac_user_can(_uid, p.key)), '[]'::jsonb),
    'employee', CASE WHEN _emp.id IS NULL THEN NULL ELSE jsonb_build_object(
      'id', _emp.id, 'employee_code', _emp.employee_code, 'full_name', _emp.full_name, 'email', _emp.email,
      'phone', _emp.phone, 'department', _emp.department, 'designation', _emp.designation, 'joined_on', _emp.joined_on,
      'proposal_code', _emp.proposal_code, 'active', _emp.active, 'must_change_password', _emp.must_change_password,
      'manager_name', (SELECT m.full_name FROM public.employees m WHERE m.id = _emp.reporting_manager_id)) END
  );
END;
$$;

-- The signed-in user changes their own password (current password required).
CREATE OR REPLACE FUNCTION public.my_change_password(_current text, _new text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _hash text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Please sign in again.' USING ERRCODE = '42501'; END IF;
  IF EXISTS (SELECT 1 FROM public.employees WHERE user_id = auth.uid() AND NOT active) THEN
    RAISE EXCEPTION 'Your account has been disabled.' USING ERRCODE = '42501';
  END IF;
  SELECT encrypted_password INTO _hash FROM auth.users WHERE id = auth.uid();
  IF _hash IS NULL OR extensions.crypt(coalesce(_current, ''), _hash) <> _hash THEN
    PERFORM pg_sleep(1);
    RAISE EXCEPTION 'Your current password is incorrect.' USING ERRCODE = '22023';
  END IF;
  PERFORM public._portal_assert_password(_new);
  IF _new = _current THEN
    RAISE EXCEPTION 'Choose a new password that is different from the current one.' USING ERRCODE = '22023';
  END IF;
  UPDATE auth.users SET encrypted_password = extensions.crypt(_new, extensions.gen_salt('bf', 10)), updated_at = now()
   WHERE id = auth.uid();
  UPDATE public.employees SET must_change_password = false, updated_at = now() WHERE user_id = auth.uid();
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. Employee administration
-- ---------------------------------------------------------------------------
-- Roles an admin may hand out from the Employees page (the others are implicit).
CREATE OR REPLACE FUNCTION public._portal_clean_roles(_roles text[])
RETURNS text[]
LANGUAGE plpgsql STABLE SET search_path = ''
AS $$
DECLARE _r text; _out text[] := '{}';
BEGIN
  FOREACH _r IN ARRAY coalesce(_roles, '{}') LOOP
    IF NOT EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _r) THEN
      RAISE EXCEPTION 'Unknown role: %', _r USING ERRCODE = '22023';
    END IF;
    IF EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _r AND NOT implicit) AND NOT _r = ANY (_out) THEN
      _out := _out || _r;
    END IF;
  END LOOP;
  RETURN _out;
END;
$$;

-- Validates the editable fields shared by create and update.
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

CREATE OR REPLACE FUNCTION public._portal_set_roles(_user uuid, _roles text[])
RETURNS void
LANGUAGE plpgsql SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.rbac_user_roles WHERE user_id = _user AND NOT role_key = ANY (_roles);
  INSERT INTO public.rbac_user_roles (user_id, role_key, granted_by)
  SELECT _user, r, auth.uid() FROM unnest(_roles) r
  ON CONFLICT DO NOTHING;
END;
$$;

-- Every employee with their stored roles and manager name.
CREATE OR REPLACE FUNCTION public.admin_list_employees()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('portal.employees.view');
  RETURN coalesce((
    SELECT jsonb_agg(to_jsonb(e) || jsonb_build_object(
             'roles', coalesce((SELECT jsonb_agg(ur.role_key) FROM public.rbac_user_roles ur WHERE ur.user_id = e.user_id), '[]'::jsonb),
             'manager_name', m.full_name,
             'reports_count', (SELECT count(*) FROM public.employees r WHERE r.reporting_manager_id = e.id AND r.active))
           ORDER BY e.active DESC, e.employee_code)
      FROM public.employees e LEFT JOIN public.employees m ON m.id = e.reporting_manager_id), '[]'::jsonb);
END;
$$;

-- Creates the login (already confirmed, temporary password) and the employee row.
-- _p: employee_code, full_name, email, password, phone, department, designation,
--     joined_on, reporting_manager_id, proposal_code, roles (text array)
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

-- Edits everything except the email (the login) and the password.
CREATE OR REPLACE FUNCTION public.admin_update_employee(_id uuid, _p jsonb)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _uid   uuid;
  _roles text[] := public._portal_clean_roles(ARRAY(SELECT jsonb_array_elements_text(coalesce(_p->'roles', '[]'::jsonb))));
BEGIN
  PERFORM public.rbac_require('portal.employees.edit');
  SELECT user_id INTO _uid FROM public.employees WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
  IF _uid = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own employee record. Ask another administrator.' USING ERRCODE = '42501';
  END IF;
  PERFORM public._portal_check_employee(_id, _p, _roles);
  UPDATE public.employees SET
    employee_code        = upper(trim(_p->>'employee_code')),
    full_name            = trim(_p->>'full_name'),
    phone                = nullif(trim(_p->>'phone'), ''),
    department           = nullif(trim(_p->>'department'), ''),
    designation          = nullif(trim(_p->>'designation'), ''),
    joined_on            = nullif(_p->>'joined_on', '')::date,
    reporting_manager_id = nullif(_p->>'reporting_manager_id', '')::uuid,
    proposal_code        = CASE WHEN 'proposal_engineer' = ANY (_roles) THEN upper(trim(_p->>'proposal_code')) END,
    updated_at           = now()
  WHERE id = _id;
  IF _uid IS NOT NULL THEN PERFORM public._portal_set_roles(_uid, _roles); END IF;
END;
$$;

-- New temporary password; the employee must choose their own at next sign-in.
CREATE OR REPLACE FUNCTION public.admin_set_employee_password(_id uuid, _password text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _uid uuid;
BEGIN
  PERFORM public.rbac_require('portal.employees.edit');
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
$$;

-- Disable = blocked at the login itself (banned) and signed out everywhere.
CREATE OR REPLACE FUNCTION public.admin_set_employee_active(_id uuid, _active boolean)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _uid uuid;
BEGIN
  PERFORM public.rbac_require('portal.employees.edit');
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
$$;

-- Removes the employee and their login. Never deletes an admin's login.
CREATE OR REPLACE FUNCTION public.admin_delete_employee(_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _uid uuid;
BEGIN
  PERFORM public.rbac_require('portal.employees.delete');
  SELECT user_id INTO _uid FROM public.employees WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
  IF _uid = auth.uid() THEN RAISE EXCEPTION 'You cannot delete yourself.' USING ERRCODE = '42501'; END IF;
  DELETE FROM public.employees WHERE id = _id;  -- reports' manager link is cleared (ON DELETE SET NULL)
  IF _uid IS NOT NULL AND NOT public.has_role(_uid, 'admin') THEN
    DELETE FROM auth.users WHERE id = _uid;     -- also removes their rbac_user_roles
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Move proposal engineers into employees, then drop the old table
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.proposal_engineers') IS NOT NULL THEN
    INSERT INTO public.employees (id, employee_code, full_name, email, proposal_code, active,
                                  must_change_password, user_id, created_at, created_by, updated_at)
    SELECT pe.id,
           'GC' || lpad((row_number() OVER (ORDER BY substring(pe.code from 2)::int))::text, 3, '0'),
           pe.name, pe.email, pe.code, pe.active, pe.must_change_password, pe.user_id,
           pe.created_at, pe.created_by, pe.updated_at
      FROM public.proposal_engineers pe
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.rbac_user_roles (user_id, role_key, granted_by)
    SELECT pe.user_id, 'proposal_engineer', pe.created_by FROM public.proposal_engineers pe WHERE pe.user_id IS NOT NULL
    ON CONFLICT DO NOTHING;

    DROP TABLE public.proposal_engineers CASCADE;
  END IF;
END;
$$;
DROP FUNCTION IF EXISTS public.proposal_engineers_link_user();
DROP FUNCTION IF EXISTS public.admin_create_engineer(text, text, text, text);
DROP FUNCTION IF EXISTS public.admin_set_engineer_password(uuid, text);
DROP FUNCTION IF EXISTS public.admin_set_engineer_active(uuid, boolean);
DROP FUNCTION IF EXISTS public.admin_delete_engineer(uuid);
DROP FUNCTION IF EXISTS public.engineer_change_password(text, text);
DROP FUNCTION IF EXISTS public._assert_engineer_password(text);
DROP FUNCTION IF EXISTS public._assert_admin();

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.rbac_roles_of(uuid), public.rbac_user_can(uuid, text),
  public._portal_assert_password(text), public._portal_clean_roles(text[]),
  public._portal_check_employee(uuid, jsonb, text[]), public._portal_set_roles(uuid, text[])
  FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.rbac_can(text), public.rbac_require(text), public.rbac_my_access(),
  public.portal_password_problem(text), public.my_change_password(text, text),
  public.admin_list_employees(), public.admin_create_employee(jsonb), public.admin_update_employee(uuid, jsonb),
  public.admin_set_employee_password(uuid, text), public.admin_set_employee_active(uuid, boolean),
  public.admin_delete_employee(uuid)
  FROM PUBLIC, anon;

REVOKE ALL ON FUNCTION public.portal_my_employee_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.portal_my_employee_id() TO authenticated;  -- used in RLS policies
GRANT EXECUTE ON FUNCTION public.rbac_can(text) TO anon, authenticated;  -- used in RLS policies
GRANT EXECUTE ON FUNCTION public.rbac_require(text), public.rbac_my_access(),
  public.portal_password_problem(text), public.my_change_password(text, text),
  public.admin_list_employees(), public.admin_create_employee(jsonb), public.admin_update_employee(uuid, jsonb),
  public.admin_set_employee_password(uuid, text), public.admin_set_employee_active(uuid, boolean),
  public.admin_delete_employee(uuid)
  TO authenticated;
