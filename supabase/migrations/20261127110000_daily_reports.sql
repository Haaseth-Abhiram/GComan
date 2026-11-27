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

BEGIN;

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

COMMIT;
