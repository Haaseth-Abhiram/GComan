-- Undo 20261127110000_daily_reports.sql. THIS DELETES ALL DAILY REPORTS.
-- Back up the database first.
BEGIN;
DROP FUNCTION IF EXISTS public.report_get(date), public.report_save(date, text, text, boolean), public.report_team(),
  public.report_review(uuid, text, text), public.report_admin(date);
DROP FUNCTION IF EXISTS public._report_json(public.work_reports), public._report_can_review(public.work_reports);
DROP TABLE IF EXISTS public.work_reports;
-- Role grants, personal exceptions and scopes for these go with them (cascade).
DELETE FROM public.rbac_permissions WHERE key IN
  ('portal.reports.view', 'portal.reports.approve', 'emp.reports.create', 'team.reports.view', 'team.reports.approve');
DELETE FROM public.rbac_scope_resources WHERE key = 'reports';
COMMIT;
