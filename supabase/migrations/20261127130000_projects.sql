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

BEGIN;

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

COMMIT;
