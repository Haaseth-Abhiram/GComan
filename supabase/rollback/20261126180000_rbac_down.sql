-- ROLLBACK for 20261126180000_rbac_core.sql + 20261126180100_rbac_enforcement.sql
-- Run with psql from the repo root:
--   psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -1 -f supabase/rollback/20261126180000_rbac_down.sql
-- Restores the website access policies saved before the change, removes the new
-- tables/columns/functions, then re-applies the earlier portal migrations (which
-- are idempotent) so every function returns to its previous definition.

-- 1. Website & leads policies back to the website admin flag
DROP POLICY IF EXISTS "Contacts: view" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contacts: change status" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contacts: delete" ON public.contact_submissions;
DROP POLICY IF EXISTS "Jobs: view" ON public.job_applications;
DROP POLICY IF EXISTS "Jobs: update" ON public.job_applications;
DROP TRIGGER IF EXISTS jobs_field_guard ON public.job_applications;
DROP FUNCTION IF EXISTS public._jobs_field_guard();
DROP POLICY IF EXISTS "Download leads: view" ON public.download_leads;
DROP POLICY IF EXISTS "Newsletter: view" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Newsletter: change status" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Indexing: view status" ON public.ar_index_status;
DROP POLICY IF EXISTS "Indexing: view events" ON public.ar_index_events;
DROP POLICY IF EXISTS "Indexing: update events" ON public.ar_index_events;
DROP POLICY IF EXISTS "Resumes: download" ON storage.objects;
DROP POLICY IF EXISTS "Resumes: delete" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update ar index events" ON public.ar_index_events;
CREATE POLICY "Admins can update ar index events" ON public.ar_index_events AS PERMISSIVE FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view ar index events" ON public.ar_index_events;
CREATE POLICY "Admins can view ar index events" ON public.ar_index_events AS PERMISSIVE FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view ar index status" ON public.ar_index_status;
CREATE POLICY "Admins can view ar index status" ON public.ar_index_status AS PERMISSIVE FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions AS PERMISSIVE FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions AS PERMISSIVE FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view all contact submissions" ON public.contact_submissions AS PERMISSIVE FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete download leads" ON public.download_leads;
CREATE POLICY "Admins can delete download leads" ON public.download_leads AS PERMISSIVE FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update download leads" ON public.download_leads;
CREATE POLICY "Admins can update download leads" ON public.download_leads AS PERMISSIVE FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all download leads" ON public.download_leads;
CREATE POLICY "Admins can view all download leads" ON public.download_leads AS PERMISSIVE FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete job applications" ON public.job_applications;
CREATE POLICY "Admins can delete job applications" ON public.job_applications AS PERMISSIVE FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update job applications" ON public.job_applications;
CREATE POLICY "Admins can update job applications" ON public.job_applications AS PERMISSIVE FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;
CREATE POLICY "Admins can view all job applications" ON public.job_applications AS PERMISSIVE FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter subscribers" ON public.newsletter_subscribers AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::app_role)))));
DROP POLICY IF EXISTS "Admins can view all newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view all newsletter subscribers" ON public.newsletter_subscribers AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1 FROM user_roles WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::app_role)))));
DROP POLICY IF EXISTS "Admins can delete resumes" ON storage.objects;
CREATE POLICY "Admins can delete resumes" ON storage.objects AS PERMISSIVE FOR DELETE TO authenticated USING (((bucket_id = 'resumes'::text) AND has_role(auth.uid(), 'admin'::app_role)));
DROP POLICY IF EXISTS "Admins can view all resumes" ON storage.objects;
CREATE POLICY "Admins can view all resumes" ON storage.objects AS PERMISSIVE FOR SELECT TO authenticated USING (((bucket_id = 'resumes'::text) AND has_role(auth.uid(), 'admin'::app_role)));

-- 2. New engine objects
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['rbac_roles', 'rbac_role_permissions', 'rbac_user_roles', 'rbac_user_overrides',
                           'rbac_role_scopes', 'rbac_user_scopes', 'user_roles'] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS rbac_audit ON public.%I', t);
    END IF;
  END LOOP;
END $$;
DROP FUNCTION IF EXISTS public._rbac_audit();
DROP FUNCTION IF EXISTS public.rbac_admin_save_role_access(text, text[], jsonb);
DROP FUNCTION IF EXISTS public.rbac_admin_duplicate_role(text, text);
DROP FUNCTION IF EXISTS public.rbac_admin_set_role_active(text, boolean);
DROP FUNCTION IF EXISTS public.rbac_admin_delete_role(text, text);
DROP FUNCTION IF EXISTS public.rbac_admin_user_detail(uuid);
DROP FUNCTION IF EXISTS public.rbac_admin_set_user_overrides(uuid, jsonb, jsonb);
DROP FUNCTION IF EXISTS public.rbac_admin_audit(uuid, text, date, date);
DROP FUNCTION IF EXISTS public._rbac_assert_can_grant(text[]);
DROP FUNCTION IF EXISTS public._rbac_role_perms(text);
-- Policies that use the scope helper are recreated by the migrations re-applied below.
DROP POLICY IF EXISTS "Employee admins read all" ON public.employees;
DROP POLICY IF EXISTS "Read own or as attendance admin" ON public.attendance_sessions;
DROP POLICY IF EXISTS "Read own or as attendance admin" ON public.attendance_corrections;
DROP FUNCTION IF EXISTS public.rbac_emp_visible(text, uuid);
DROP FUNCTION IF EXISTS public.rbac_emp_in_scope(uuid, text, uuid);
DROP FUNCTION IF EXISTS public.rbac_user_scope(uuid, text);
DROP FUNCTION IF EXISTS public._rbac_scope_rank(text);
DROP TABLE IF EXISTS public.rbac_audit_log, public.rbac_user_scopes, public.rbac_role_scopes,
  public.rbac_scope_resources, public.rbac_user_overrides;
DELETE FROM public.rbac_permissions WHERE key LIKE 'website.%' OR key IN ('portal.leave.types', 'portal.leave.holidays',
  'portal.leave.allowances', 'portal.employees.personal', 'portal.employees.reset_password', 'portal.employees.disable', 'settings.audit.view');
ALTER TABLE public.rbac_permissions DROP COLUMN IF EXISTS page, DROP COLUMN IF EXISTS tab, DROP COLUMN IF EXISTS action_label,
  DROP COLUMN IF EXISTS kind, DROP COLUMN IF EXISTS sensitive, DROP COLUMN IF EXISTS active;
ALTER TABLE public.rbac_roles DROP COLUMN IF EXISTS active;

-- 3. Previous definitions (idempotent re-runs)
\ir ../migrations/20261126140000_employee_portal_foundation.sql
\ir ../migrations/20261126150000_attendance.sql
\ir ../migrations/20261126160000_leave.sql
\ir ../migrations/20261126170000_settings_roles.sql
