-- Centralized Roles & Permissions, part 1: core engine.
--
-- Extends the existing rbac_* tables (no second permission system):
--   * permission catalogue with hierarchy  (module → page → tab → action/field/widget)
--   * roles can be deactivated; built-in roles are protected
--   * per-person overrides (allow / deny) and per-person data scope
--   * data scopes per role: none / own / team / department / all
--   * audit log of every change (who, what, old → new, when)
--
-- Precedence (rbac_user_can):
--   Super Admin (website admin)          → always allowed
--   permission missing or inactive       → denied
--   personal DENY                        → denied
--   personal ALLOW                       → allowed (active employees only)
--   any ACTIVE role of the person has it → allowed
--   otherwise                            → denied (deny by default)
-- Data scope (rbac_scope): Super Admin → all; personal scope if set; else the
-- widest scope among the person's active roles; else none.
--
-- New permissions are never granted to anyone automatically.

-- ---------------------------------------------------------------------------
-- 1. Schema
-- ---------------------------------------------------------------------------
ALTER TABLE public.rbac_roles ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

ALTER TABLE public.rbac_permissions
  ADD COLUMN IF NOT EXISTS page         text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tab          text,
  ADD COLUMN IF NOT EXISTS action_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS kind         text NOT NULL DEFAULT 'action' CHECK (kind IN ('page', 'tab', 'action', 'field', 'widget')),
  ADD COLUMN IF NOT EXISTS sensitive    boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS active       boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.rbac_user_overrides (
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_key  text NOT NULL REFERENCES public.rbac_permissions(key) ON DELETE CASCADE,
  effect          text NOT NULL CHECK (effect IN ('allow', 'deny')),
  reason          text CHECK (reason IS NULL OR length(reason) <= 300),
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, permission_key)
);

-- Resources whose records belong to a person, so a scope makes sense.
CREATE TABLE IF NOT EXISTS public.rbac_scope_resources (
  key          text PRIMARY KEY,
  label        text NOT NULL,
  description  text NOT NULL DEFAULT '',
  scopes       text[] NOT NULL,   -- allowed values, narrowest first
  sort_order   int NOT NULL DEFAULT 100
);
INSERT INTO public.rbac_scope_resources (key, label, description, scopes, sort_order) VALUES
  ('employees',  'Employees',  'Which employees appear on the Employees page.',          '{none,own,team,department,all}', 10),
  ('attendance', 'Attendance', 'Whose attendance and corrections appear on Attendance.', '{none,own,team,department,all}', 20),
  ('leave',      'Leave',      'Whose leave requests and balances appear on Leave.',     '{none,own,team,department,all}', 30)
ON CONFLICT (key) DO UPDATE SET label = EXCLUDED.label, description = EXCLUDED.description,
  scopes = EXCLUDED.scopes, sort_order = EXCLUDED.sort_order;

CREATE TABLE IF NOT EXISTS public.rbac_role_scopes (
  role_key  text NOT NULL REFERENCES public.rbac_roles(key) ON DELETE CASCADE ON UPDATE CASCADE,
  resource  text NOT NULL REFERENCES public.rbac_scope_resources(key) ON DELETE CASCADE,
  scope     text NOT NULL CHECK (scope IN ('none', 'own', 'team', 'department', 'all')),
  PRIMARY KEY (role_key, resource)
);
CREATE TABLE IF NOT EXISTS public.rbac_user_scopes (
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource  text NOT NULL REFERENCES public.rbac_scope_resources(key) ON DELETE CASCADE,
  scope     text NOT NULL CHECK (scope IN ('none', 'own', 'team', 'department', 'all')),
  PRIMARY KEY (user_id, resource)
);

CREATE TABLE IF NOT EXISTS public.rbac_audit_log (
  id              bigserial PRIMARY KEY,
  at              timestamptz NOT NULL DEFAULT now(),
  actor           uuid,                -- null = system / migration
  actor_name      text,
  entity          text NOT NULL,       -- role | role_permission | user_role | user_override | role_scope | user_scope | super_admin
  action          text NOT NULL,       -- created | changed | removed
  role_key        text,
  user_id         uuid,
  user_name       text,
  permission_key  text,
  resource        text,
  old_value       jsonb,
  new_value       jsonb
);
CREATE INDEX IF NOT EXISTS rbac_audit_at ON public.rbac_audit_log (at DESC);
CREATE INDEX IF NOT EXISTS rbac_audit_user ON public.rbac_audit_log (user_id, at DESC);
CREATE INDEX IF NOT EXISTS rbac_audit_role ON public.rbac_audit_log (role_key, at DESC);

ALTER TABLE public.rbac_user_overrides  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_scope_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_role_scopes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_user_scopes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_audit_log       ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.rbac_user_overrides, public.rbac_scope_resources, public.rbac_role_scopes,
  public.rbac_user_scopes, public.rbac_audit_log FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Permission catalogue (the registry). To add a feature later: add rows here
--    in a new migration, then use the key in code. Nobody gets it until granted.
-- ---------------------------------------------------------------------------
-- Split the old coarse leave "settings" permission into the three tabs it covered.
INSERT INTO public.rbac_permissions (key, area, label) VALUES
  ('portal.leave.types', 'admin', 'x'), ('portal.leave.holidays', 'admin', 'x'), ('portal.leave.allowances', 'admin', 'x'),
  ('portal.employees.personal', 'admin', 'x'), ('portal.employees.reset_password', 'admin', 'x'), ('portal.employees.disable', 'admin', 'x'),
  ('settings.audit.view', 'admin', 'x'),
  ('website.dashboard.view', 'admin', 'x'),
  ('website.contacts.view', 'admin', 'x'), ('website.contacts.delete', 'admin', 'x'), ('website.contacts.export', 'admin', 'x'),
  ('website.jobs.view', 'admin', 'x'), ('website.jobs.edit', 'admin', 'x'), ('website.jobs.notes', 'admin', 'x'),
  ('website.jobs.download', 'admin', 'x'), ('website.jobs.export', 'admin', 'x'),
  ('website.downloads.view', 'admin', 'x'), ('website.downloads.export', 'admin', 'x'),
  ('website.newsletter.view', 'admin', 'x'), ('website.newsletter.edit', 'admin', 'x'), ('website.newsletter.export', 'admin', 'x'),
  ('website.indexing.view', 'admin', 'x'), ('website.indexing.edit', 'admin', 'x')
ON CONFLICT (key) DO NOTHING;

-- Whoever could change leave settings keeps the same abilities.
INSERT INTO public.rbac_role_permissions (role_key, permission_key)
SELECT rp.role_key, k FROM public.rbac_role_permissions rp,
       unnest(ARRAY['portal.leave.types', 'portal.leave.holidays', 'portal.leave.allowances']) k
 WHERE rp.permission_key = 'portal.leave.edit'
ON CONFLICT DO NOTHING;
-- Whoever could edit employees keeps password reset / disable / personal details.
INSERT INTO public.rbac_role_permissions (role_key, permission_key)
SELECT rp.role_key, k FROM public.rbac_role_permissions rp,
       unnest(ARRAY['portal.employees.personal', 'portal.employees.reset_password', 'portal.employees.disable']) k
 WHERE rp.permission_key = 'portal.employees.edit'
ON CONFLICT DO NOTHING;
DELETE FROM public.rbac_permissions WHERE key IN ('portal.leave.edit',
  -- no screen offers these actions, so they are not permissions (an earlier draft listed them)
  'website.contacts.edit', 'website.jobs.delete_files');

-- module (grp) · page · tab · action label · kind · sensitive · order
WITH c(key, grp, page, tab, action_label, kind, sensitive, sort_order, description) AS (VALUES
  ('website.dashboard.view',          'Website & leads', 'Dashboard',          NULL,         'View lead counts',          'widget', false, 100, 'Contact, job and download counts on the dashboard and sidebar.'),
  ('website.contacts.view',           'Website & leads', 'Contact Forms',      NULL,         'View',                      'page',   false, 110, 'Open Contact Forms and read submissions.'),
  ('website.contacts.delete',         'Website & leads', 'Contact Forms',      NULL,         'Delete',                    'action', true,  112, 'Permanently delete submissions.'),
  ('website.contacts.export',         'Website & leads', 'Contact Forms',      NULL,         'Export',                    'action', false, 113, 'Download submissions as Excel.'),
  ('website.jobs.view',               'Website & leads', 'Job Applications',   NULL,         'View',                      'page',   false, 120, 'Open Job Applications (list and details).'),
  ('website.jobs.edit',               'Website & leads', 'Job Applications',   NULL,         'Update status & prospect',  'action', false, 121, 'Change an application''s status and prospect rating.'),
  ('website.jobs.notes',              'Website & leads', 'Job Applications',   NULL,         'HR notes',                  'field',  false, 122, 'See and edit the internal HR notes on an application.'),
  ('website.jobs.download',           'Website & leads', 'Job Applications',   NULL,         'Open & download CVs',       'action', false, 123, 'Preview and download CV files, and browse Resume Folders.'),
  ('website.jobs.export',             'Website & leads', 'Job Applications',   NULL,         'Export',                    'action', false, 125, 'Download applications as Excel.'),
  ('website.downloads.view',          'Website & leads', 'Download Leads',     NULL,         'View',                      'page',   false, 130, 'Open Download Leads.'),
  ('website.downloads.export',        'Website & leads', 'Download Leads',     NULL,         'Export',                    'action', false, 131, 'Download leads as Excel.'),
  ('website.newsletter.view',         'Website & leads', 'Newsletter',         NULL,         'View',                      'page',   false, 140, 'Open the newsletter subscriber list.'),
  ('website.newsletter.edit',         'Website & leads', 'Newsletter',         NULL,         'Change status',             'action', false, 141, 'Activate or unsubscribe subscribers.'),
  ('website.newsletter.export',       'Website & leads', 'Newsletter',         NULL,         'Export',                    'action', false, 142, 'Download subscribers as Excel.'),
  ('website.indexing.view',           'Website & leads', 'Index Coverage',     NULL,         'View',                      'page',   false, 150, 'See Arabic page indexing status.'),
  ('website.indexing.edit',           'Website & leads', 'Index Coverage',     NULL,         'Dismiss events',            'action', false, 151, 'Dismiss indexing alerts once handled.'),
  ('portal.employees.view',           'Employees',       'Employees',          NULL,         'View',                      'page',   false, 200, 'Open the Employees page (within the data scope).'),
  ('portal.employees.create',         'Employees',       'Employees',          NULL,         'Add',                       'action', false, 201, 'Add employees and create their logins.'),
  ('portal.employees.edit',           'Employees',       'Employees',          NULL,         'Edit',                      'action', false, 202, 'Edit work details, manager and roles.'),
  ('portal.employees.personal',       'Employees',       'Employees',          NULL,         'Personal details',          'field',  false, 203, 'See and edit phone and joining date.'),
  ('portal.employees.reset_password', 'Employees',       'Employees',          NULL,         'Reset password',            'action', true,  204, 'Set a new temporary password.'),
  ('portal.employees.disable',        'Employees',       'Employees',          NULL,         'Disable / enable',          'action', true,  205, 'Block or restore an employee''s login.'),
  ('portal.employees.delete',         'Employees',       'Employees',          NULL,         'Delete',                    'action', true,  206, 'Delete an employee and their login.'),
  ('portal.attendance.view',          'Attendance',      'Attendance',         NULL,         'View',                      'page',   false, 300, 'Daily, by employee, late and missed punch-out (within the data scope).'),
  ('portal.attendance.approve',       'Attendance',      'Attendance',         'Corrections','Approve / reject',          'action', false, 301, 'Decide correction requests.'),
  ('portal.leave.view',               'Leave',           'Leave',              NULL,         'View',                      'page',   false, 400, 'Requests and balances (within the data scope).'),
  ('portal.leave.approve',            'Leave',           'Leave',              'Requests',   'Approve / reject',          'action', false, 401, 'Admin step of the approval chain.'),
  ('portal.leave.allowances',         'Leave',           'Leave',              'Balances',   'Change allowances',         'action', false, 402, 'Change one employee''s days for a year.'),
  ('portal.leave.types',              'Leave',           'Leave',              'Leave types','Manage leave types',        'action', false, 403, 'Add, edit and hide leave types.'),
  ('portal.leave.holidays',           'Leave',           'Leave',              'Holidays',   'Manage holidays',           'action', false, 404, 'Add, edit and delete holidays.'),
  ('settings.users.view',             'Settings',        'Settings',           'Users',      'View',                      'tab',    true,  500, 'See who has which role and their exceptions.'),
  ('settings.users.edit',             'Settings',        'Settings',           'Users',      'Assign roles & exceptions', 'action', true,  501, 'Give/remove roles, personal permissions and scopes.'),
  ('settings.roles.view',             'Settings',        'Settings',           'Roles',      'View',                      'tab',    true,  502, 'See roles and their permissions.'),
  ('settings.roles.edit',             'Settings',        'Settings',           'Roles',      'Manage roles',              'action', true,  503, 'Create, change, deactivate and delete roles.'),
  ('settings.audit.view',             'Settings',        'Settings',           'Audit log',  'View',                      'tab',    true,  504, 'See the history of permission changes.'),
  ('emp.portal.view',                 'Employee Portal', 'Home',               NULL,         'Open the portal',           'page',   false, 600, 'Sign in to the Employee Portal.'),
  ('emp.attendance.create',           'Employee Portal', 'Attendance',         NULL,         'Punch in / out',            'action', false, 601, 'Record own attendance.'),
  ('emp.attendance.edit',             'Employee Portal', 'Attendance',         NULL,         'Request corrections',       'action', false, 602, 'Ask for a punch time to be corrected.'),
  ('emp.leave.create',                'Employee Portal', 'Leave',              NULL,         'Apply',                     'action', false, 603, 'Apply for own leave.'),
  ('emp.leave.delete',                'Employee Portal', 'Leave',              NULL,         'Cancel',                    'action', false, 604, 'Cancel own leave before approval.'),
  ('team.members.view',               'Managers',        'Home',               'My team',    'View team',                 'widget', false, 700, 'See the people who report to you.'),
  ('team.leave.view',                 'Managers',        'Leave',              'Team leave', 'View',                      'tab',    false, 701, 'See the team''s leave requests.'),
  ('team.leave.approve',              'Managers',        'Leave',              'Team leave', 'Review & final approval',   'action', false, 702, 'Forward, finally approve or reject the team''s leave.'),
  ('proposal.tracker.view',           'Proposal Tracker','Proposal Tracker',   NULL,         'Open as engineer',          'page',   false, 800, 'Open the Proposal Tracker.')
)
UPDATE public.rbac_permissions p
   SET grp = c.grp, page = c.page, tab = c.tab, action_label = c.action_label, kind = c.kind,
       sensitive = c.sensitive, sort_order = c.sort_order, description = c.description,
       label = c.page || coalesce(' › ' || c.tab, '') || ': ' || c.action_label,
       area = CASE WHEN c.grp IN ('Employee Portal', 'Managers', 'Proposal Tracker') THEN 'portal' ELSE 'admin' END
  FROM c WHERE p.key = c.key;

-- Super Admin needs no scope rows. Any existing role that can view a module keeps seeing everyone there.
INSERT INTO public.rbac_role_scopes (role_key, resource, scope)
SELECT DISTINCT rp.role_key, m.res, 'all' FROM public.rbac_role_permissions rp
  JOIN (VALUES ('portal.employees.view', 'employees'), ('portal.attendance.view', 'attendance'), ('portal.leave.view', 'leave')) m(perm, res)
    ON m.perm = rp.permission_key
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Evaluation
-- ---------------------------------------------------------------------------
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
  ) x JOIN public.rbac_roles r ON r.key = x.k AND r.active;
$$;

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

CREATE OR REPLACE FUNCTION public._rbac_scope_rank(_s text)
RETURNS int
LANGUAGE sql IMMUTABLE SET search_path = ''
AS $$ SELECT CASE _s WHEN 'own' THEN 1 WHEN 'team' THEN 2 WHEN 'department' THEN 3 WHEN 'all' THEN 4 ELSE 0 END; $$;

CREATE OR REPLACE FUNCTION public.rbac_user_scope(_user uuid, _resource text)
RETURNS text
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _s text;
BEGIN
  IF _user IS NULL THEN RETURN 'none'; END IF;
  IF public.has_role(_user, 'admin') THEN RETURN 'all'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.employees WHERE user_id = _user AND active) THEN RETURN 'none'; END IF;
  SELECT scope INTO _s FROM public.rbac_user_scopes WHERE user_id = _user AND resource = _resource;
  IF _s IS NOT NULL THEN RETURN _s; END IF;
  SELECT rs.scope INTO _s FROM public.rbac_role_scopes rs
   WHERE rs.resource = _resource AND rs.role_key = ANY (public.rbac_roles_of(_user))
   ORDER BY public._rbac_scope_rank(rs.scope) DESC LIMIT 1;
  RETURN coalesce(_s, 'none');
END;
$$;

-- Is employee _emp inside the viewer's scope for _resource?
CREATE OR REPLACE FUNCTION public.rbac_emp_in_scope(_user uuid, _resource text, _emp uuid)
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _scope text := public.rbac_user_scope(_user, _resource); _me public.employees;
BEGIN
  IF _scope = 'all' THEN RETURN true; END IF;
  IF _scope = 'none' OR _emp IS NULL THEN RETURN false; END IF;
  SELECT * INTO _me FROM public.employees WHERE user_id = _user;
  IF _me.id IS NULL THEN RETURN false; END IF;
  IF _emp = _me.id THEN RETURN true; END IF;                       -- own is inside every scope above none
  IF _scope = 'team' THEN
    RETURN EXISTS (WITH RECURSIVE t(id, depth) AS (
                     SELECT id, 1 FROM public.employees WHERE reporting_manager_id = _me.id
                     UNION SELECT e.id, t.depth + 1 FROM public.employees e JOIN t ON e.reporting_manager_id = t.id WHERE t.depth < 20)
                   SELECT 1 FROM t WHERE t.id = _emp);
  END IF;
  IF _scope = 'department' THEN
    RETURN _me.department IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.employees e WHERE e.id = _emp AND lower(trim(e.department)) = lower(trim(_me.department)));
  END IF;
  RETURN false;
END;
$$;

-- The same, for the signed-in user only. Used in table policies (safe to call:
-- it can't be used to probe someone else's access).
CREATE OR REPLACE FUNCTION public.rbac_emp_visible(_resource text, _emp uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT public.rbac_emp_in_scope(auth.uid(), _resource, _emp); $$;

CREATE OR REPLACE FUNCTION public.rbac_can(_perm text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT public.rbac_user_can(auth.uid(), _perm); $$;

-- ---------------------------------------------------------------------------
-- 4. Audit log (written by triggers, so every path is covered)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._rbac_audit()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _o jsonb := CASE WHEN TG_OP <> 'INSERT' THEN to_jsonb(OLD) END;
  _n jsonb := CASE WHEN TG_OP <> 'DELETE' THEN to_jsonb(NEW) END;
  _r jsonb := coalesce(_n, _o);
  _entity text;
  _user uuid;
BEGIN
  IF TG_OP = 'UPDATE' AND _o = _n THEN RETURN NULL; END IF;
  _entity := CASE TG_TABLE_NAME
    WHEN 'rbac_roles' THEN 'role' WHEN 'rbac_role_permissions' THEN 'role_permission'
    WHEN 'rbac_user_roles' THEN 'user_role' WHEN 'rbac_user_overrides' THEN 'user_override'
    WHEN 'rbac_role_scopes' THEN 'role_scope' WHEN 'rbac_user_scopes' THEN 'user_scope'
    WHEN 'user_roles' THEN 'super_admin' ELSE TG_TABLE_NAME END;
  IF _entity = 'super_admin' AND _r->>'role' <> 'admin' THEN RETURN NULL; END IF;
  _user := (_r->>'user_id')::uuid;
  INSERT INTO public.rbac_audit_log (actor, actor_name, entity, action, role_key, user_id, user_name, permission_key, resource, old_value, new_value)
  VALUES (auth.uid(),
          (SELECT coalesce(e.full_name, u.raw_user_meta_data->>'name', u.email) FROM auth.users u
             LEFT JOIN public.employees e ON e.user_id = u.id WHERE u.id = auth.uid()),
          _entity, CASE TG_OP WHEN 'INSERT' THEN 'created' WHEN 'UPDATE' THEN 'changed' ELSE 'removed' END,
          coalesce(_r->>'role_key', CASE WHEN _entity = 'role' THEN _r->>'key' END),
          _user,
          (SELECT coalesce(e.full_name, u.email) FROM auth.users u LEFT JOIN public.employees e ON e.user_id = u.id WHERE u.id = _user),
          _r->>'permission_key', _r->>'resource',
          _o - 'granted_at' - 'created_at', _n - 'granted_at' - 'created_at');
  RETURN NULL;
END;
$$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['rbac_roles', 'rbac_role_permissions', 'rbac_user_roles', 'rbac_user_overrides',
                           'rbac_role_scopes', 'rbac_user_scopes', 'user_roles'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS rbac_audit ON public.%I', t);
    EXECUTE format('CREATE TRIGGER rbac_audit AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public._rbac_audit()', t);
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. Anti-escalation helpers
-- ---------------------------------------------------------------------------
-- A non-Super-Admin may only hand out permissions they hold themselves, never
-- Settings permissions, and never roles that contain Settings permissions.
CREATE OR REPLACE FUNCTION public._rbac_assert_can_grant(_perms text[])
RETURNS void
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _bad text;
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN RETURN; END IF;
  SELECT p INTO _bad FROM unnest(_perms) p WHERE p LIKE 'settings.%' LIMIT 1;
  IF _bad IS NOT NULL THEN
    RAISE EXCEPTION 'Only a Super Admin can give Settings permissions (%).', _bad USING ERRCODE = '42501';
  END IF;
  SELECT p INTO _bad FROM unnest(_perms) p WHERE NOT public.rbac_user_can(auth.uid(), p) LIMIT 1;
  IF _bad IS NOT NULL THEN
    RAISE EXCEPTION 'You can only give permissions you have yourself (%).',
      (SELECT label FROM public.rbac_permissions WHERE key = _bad) USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public._rbac_role_perms(_role text)
RETURNS text[]
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT coalesce(array_agg(permission_key), '{}') FROM public.rbac_role_permissions WHERE role_key = _role; $$;

-- Replaces a user's stored roles (used by the Employees page and Settings).
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

-- ---------------------------------------------------------------------------
-- 6. What the signed-in user can do
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
    RETURN jsonb_build_object('is_super_admin', false, 'admin_pages', false, 'roles', '[]'::jsonb,
      'permissions', '[]'::jsonb, 'scopes', '{}'::jsonb, 'employee', null);
  END IF;
  _roles := public.rbac_roles_of(_uid);
  SELECT * INTO _emp FROM public.employees WHERE user_id = _uid;
  RETURN jsonb_build_object(
    'is_super_admin', public.has_role(_uid, 'admin'),
    'admin_pages', public.has_role(_uid, 'admin') OR EXISTS (
        SELECT 1 FROM public.rbac_permissions p WHERE p.area = 'admin' AND p.active AND public.rbac_user_can(_uid, p.key)),
    'roles', coalesce((SELECT jsonb_agg(jsonb_build_object('key', r.key, 'name', r.name, 'area', r.area) ORDER BY r.sort_order)
                         FROM public.rbac_roles r WHERE r.key = ANY (_roles)), '[]'::jsonb),
    'permissions', coalesce((SELECT jsonb_agg(p.key ORDER BY p.sort_order) FROM public.rbac_permissions p
                              WHERE p.active AND public.rbac_user_can(_uid, p.key)), '[]'::jsonb),
    'scopes', coalesce((SELECT jsonb_object_agg(s.key, public.rbac_user_scope(_uid, s.key)) FROM public.rbac_scope_resources s), '{}'::jsonb),
    'employee', CASE WHEN _emp.id IS NULL THEN NULL ELSE jsonb_build_object(
      'id', _emp.id, 'employee_code', _emp.employee_code, 'full_name', _emp.full_name, 'email', _emp.email,
      'phone', _emp.phone, 'department', _emp.department, 'designation', _emp.designation, 'joined_on', _emp.joined_on,
      'proposal_code', _emp.proposal_code, 'active', _emp.active, 'must_change_password', _emp.must_change_password,
      'manager_name', (SELECT m.full_name FROM public.employees m WHERE m.id = _emp.reporting_manager_id)) END
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Settings: roles
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.rbac_admin_set_permission(text, text, boolean);
DROP FUNCTION IF EXISTS public.rbac_admin_delete_role(text);

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

-- Saves a role's whole permission set and scopes at once (Save Changes).
-- _scopes: {"employees": "all", "leave": "team", ...}; missing resource = no scope row.
CREATE OR REPLACE FUNCTION public.rbac_admin_save_role_access(_role text, _perms text[], _scopes jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _super   boolean := public.has_role(auth.uid(), 'admin');
  _old     text[];
  _added   text[];
  _removed text[];
  _res     text;
  _scope   text;
BEGIN
  PERFORM public.rbac_require('settings.roles.edit');
  IF NOT EXISTS (SELECT 1 FROM public.rbac_roles WHERE key = _role) THEN RAISE EXCEPTION 'Role not found.' USING ERRCODE = 'P0002'; END IF;
  IF _role = 'super_admin' THEN RAISE EXCEPTION 'Super Admin always has every permission.' USING ERRCODE = '42501'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(coalesce(_perms, '{}')) p WHERE NOT EXISTS (SELECT 1 FROM public.rbac_permissions WHERE key = p)) THEN
    RAISE EXCEPTION 'Unknown permission in the list.' USING ERRCODE = '22023';
  END IF;
  IF NOT _super THEN
    IF _role = ANY (public.rbac_roles_of(auth.uid())) THEN
      RAISE EXCEPTION 'You cannot change a role you hold yourself. Ask a Super Admin.' USING ERRCODE = '42501';
    END IF;
    IF public._rbac_role_is_sensitive(_role) THEN
      RAISE EXCEPTION 'Only a Super Admin can change a role that has Settings permissions.' USING ERRCODE = '42501';
    END IF;
  END IF;

  _old := public._rbac_role_perms(_role);
  _added := ARRAY(SELECT p FROM unnest(coalesce(_perms, '{}')) p WHERE NOT p = ANY (_old));
  _removed := ARRAY(SELECT p FROM unnest(_old) p WHERE NOT p = ANY (coalesce(_perms, '{}')));
  PERFORM public._rbac_assert_can_grant(_added);
  IF NOT _super AND EXISTS (SELECT 1 FROM unnest(_removed) p WHERE p LIKE 'settings.%') THEN
    RAISE EXCEPTION 'Only a Super Admin can remove Settings permissions.' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.rbac_role_permissions WHERE role_key = _role AND permission_key = ANY (_removed);
  INSERT INTO public.rbac_role_permissions (role_key, permission_key) SELECT _role, p FROM unnest(_added) p ON CONFLICT DO NOTHING;

  FOR _res IN SELECT key FROM public.rbac_scope_resources LOOP
    _scope := nullif(_scopes->>_res, '');
    IF _scope IS NULL THEN
      DELETE FROM public.rbac_role_scopes WHERE role_key = _role AND resource = _res;
    ELSE
      IF NOT EXISTS (SELECT 1 FROM public.rbac_scope_resources WHERE key = _res AND _scope = ANY (scopes)) THEN
        RAISE EXCEPTION 'Invalid scope % for %.', _scope, _res USING ERRCODE = '22023';
      END IF;
      IF NOT _super AND public._rbac_scope_rank(_scope) > public._rbac_scope_rank(public.rbac_user_scope(auth.uid(), _res)) THEN
        RAISE EXCEPTION 'You can only give a % scope up to your own.', _res USING ERRCODE = '42501';
      END IF;
      INSERT INTO public.rbac_role_scopes (role_key, resource, scope) VALUES (_role, _res, _scope)
      ON CONFLICT (role_key, resource) DO UPDATE SET scope = EXCLUDED.scope;
    END IF;
  END LOOP;
  RETURN jsonb_build_object('added', to_jsonb(_added), 'removed', to_jsonb(_removed));
END;
$$;

-- (Copying roles was removed on request.)
DROP FUNCTION IF EXISTS public.rbac_admin_duplicate_role(text, text);

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

-- Delete a custom role. If people hold it, _reassign must name the role they move
-- to, or be '-' to just remove it from them.
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

-- ---------------------------------------------------------------------------
-- 8. Settings: people
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
      'employee_id', e.id, 'employee_code', e.employee_code, 'department', e.department,
      'full_name', coalesce(e.full_name, u.raw_user_meta_data->>'name', u.email),
      'active', coalesce(e.active, true), 'proposal_code', e.proposal_code,
      'is_super_admin', public.has_role(u.id, 'admin'),
      'is_self', u.id = auth.uid(),
      'roles', coalesce((SELECT jsonb_agg(ur.role_key) FROM public.rbac_user_roles ur WHERE ur.user_id = u.id), '[]'::jsonb),
      'automatic', to_jsonb(array_remove(ARRAY[
          CASE WHEN e.active THEN 'employee' END,
          CASE WHEN e.active AND EXISTS (SELECT 1 FROM public.employees r WHERE r.reporting_manager_id = e.id AND r.active) THEN 'manager' END], NULL)),
      'overrides', (SELECT count(*) FROM public.rbac_user_overrides o WHERE o.user_id = u.id)
                   + (SELECT count(*) FROM public.rbac_user_scopes s WHERE s.user_id = u.id)
    ) AS x
    FROM auth.users u LEFT JOIN public.employees e ON e.user_id = u.id
    WHERE e.id IS NOT NULL OR public.has_role(u.id, 'admin')) t), '[]'::jsonb);
END;
$$;

-- One person: roles, personal exceptions, and effective permissions with their source.
CREATE OR REPLACE FUNCTION public.rbac_admin_user_detail(_user uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _roles text[] := public.rbac_roles_of(_user);
BEGIN
  PERFORM public.rbac_require('settings.users.view');
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = _user) THEN RAISE EXCEPTION 'User not found.' USING ERRCODE = 'P0002'; END IF;
  RETURN jsonb_build_object(
    'user_id', _user,
    'is_super_admin', public.has_role(_user, 'admin'),
    'active_roles', to_jsonb(_roles),
    'overrides', coalesce((SELECT jsonb_agg(jsonb_build_object('key', o.permission_key, 'effect', o.effect, 'reason', o.reason))
                             FROM public.rbac_user_overrides o WHERE o.user_id = _user), '[]'::jsonb),
    'scope_overrides', coalesce((SELECT jsonb_object_agg(s.resource, s.scope) FROM public.rbac_user_scopes s WHERE s.user_id = _user), '{}'::jsonb),
    'effective', coalesce((SELECT jsonb_agg(jsonb_build_object(
                    'key', p.key, 'allowed', public.rbac_user_can(_user, p.key),
                    'override', (SELECT o.effect FROM public.rbac_user_overrides o WHERE o.user_id = _user AND o.permission_key = p.key),
                    'from_roles', coalesce((SELECT jsonb_agg(r.name ORDER BY r.sort_order) FROM public.rbac_role_permissions rp
                                              JOIN public.rbac_roles r ON r.key = rp.role_key
                                             WHERE rp.permission_key = p.key AND rp.role_key = ANY (_roles)), '[]'::jsonb))
                    ORDER BY p.sort_order) FROM public.rbac_permissions p WHERE p.active), '[]'::jsonb),
    'effective_scopes', coalesce((SELECT jsonb_object_agg(s.key, public.rbac_user_scope(_user, s.key)) FROM public.rbac_scope_resources s), '{}'::jsonb));
END;
$$;

-- Replace a person's exceptions. _overrides: [{"key": "...", "effect": "allow"|"deny", "reason": "..."}];
-- _scopes: {"employees": "team", ...}; a missing resource = follow the roles.
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

CREATE OR REPLACE FUNCTION public.rbac_admin_audit(_user uuid DEFAULT NULL, _role text DEFAULT NULL, _from date DEFAULT NULL, _to date DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.rbac_require('settings.audit.view');
  RETURN coalesce((SELECT jsonb_agg(to_jsonb(a) ORDER BY a.at DESC) FROM (
    SELECT a.*, (SELECT name FROM public.rbac_roles WHERE key = a.role_key) AS role_name,
           (SELECT label FROM public.rbac_permissions WHERE key = a.permission_key) AS permission_label
      FROM public.rbac_audit_log a
     WHERE (_user IS NULL OR a.user_id = _user OR a.actor = _user)
       AND (_role IS NULL OR a.role_key = _role)
       AND (_from IS NULL OR a.at >= _from)
       AND (_to IS NULL OR a.at < _to + 1)
     ORDER BY a.at DESC LIMIT 500) a), '[]'::jsonb);
END;
$$;

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public._rbac_scope_rank(text), public._rbac_audit(), public._rbac_assert_can_grant(text[]),
  public._rbac_role_perms(text), public._portal_set_roles(uuid, text[]), public.rbac_user_scope(uuid, text),
  public.rbac_emp_in_scope(uuid, text, uuid)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rbac_admin_save_role_access(text, text[], jsonb),
  public.rbac_admin_set_role_active(text, boolean), public.rbac_admin_delete_role(text, text),
  public.rbac_admin_user_detail(uuid), public.rbac_admin_set_user_overrides(uuid, jsonb, jsonb),
  public.rbac_admin_audit(uuid, text, date, date)
  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.rbac_emp_visible(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rbac_emp_visible(text, uuid) TO authenticated;  -- used in table policies
GRANT EXECUTE ON FUNCTION public.rbac_admin_save_role_access(text, text[], jsonb),
  public.rbac_admin_set_role_active(text, boolean), public.rbac_admin_delete_role(text, text),
  public.rbac_admin_user_detail(uuid), public.rbac_admin_set_user_overrides(uuid, jsonb, jsonb),
  public.rbac_admin_audit(uuid, text, date, date)
  TO authenticated;
