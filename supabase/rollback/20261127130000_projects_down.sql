-- Undo 20261127130000_projects.sql. THIS DELETES all projects, tasks, updates
-- and the project entries of daily reports. Back up first. Run the profile
-- rollback (140000) before this one.
BEGIN;
DROP FUNCTION IF EXISTS public.report_save(date, text, text, boolean, jsonb), public.proj_mine(), public.proj_get(uuid),
  public.proj_add_task(uuid, jsonb), public.proj_set_task_status(uuid, text, text), public.proj_post_update(uuid, text),
  public.proj_admin_list(), public.proj_admin_save(uuid, jsonb), public.proj_admin_delete(uuid),
  public.proj_admin_delete_task(uuid), public._proj_is_member(uuid);

-- The daily report functions as they were before.
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
REVOKE ALL ON FUNCTION public.report_save(date, text, text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.report_save(date, text, text, boolean) TO authenticated;

DROP FUNCTION IF EXISTS public._proj_task_json(public.project_tasks);
DROP TABLE IF EXISTS public.work_report_items, public.project_updates, public.project_tasks, public.project_members;
DROP FUNCTION IF EXISTS public._proj_json(public.projects);
DROP TABLE IF EXISTS public.projects;
DROP FUNCTION IF EXISTS public._trg_notify_member(), public._trg_notify_task();
DELETE FROM public.rbac_permissions WHERE key IN
  ('portal.projects.view', 'portal.projects.edit', 'emp.projects.view', 'emp.projects.create');
COMMIT;
