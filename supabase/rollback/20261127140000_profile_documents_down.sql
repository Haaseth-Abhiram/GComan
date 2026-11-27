-- Undo 20261127140000_profile_documents.sql. THIS DELETES personal details,
-- emergency contacts and the document records. Back up first. The files stay in
-- the "employee-documents" bucket: empty and delete it in Storage if wanted.
BEGIN;
DROP POLICY IF EXISTS "Employee documents: read" ON storage.objects;
DROP POLICY IF EXISTS "Employee documents: upload" ON storage.objects;
DROP POLICY IF EXISTS "Employee documents: delete" ON storage.objects;
DROP FUNCTION IF EXISTS public.doc_folder_access(text, boolean), public.doc_path_in_use(text), public.profile_get(uuid),
  public.profile_save(jsonb), public.profile_save_contacts(jsonb), public.doc_add(uuid, text, text, text, text, bigint),
  public.doc_delete(uuid), public._doc_is_mine(uuid), public._doc_is_admin(uuid);
DROP FUNCTION IF EXISTS public.admin_set_work_details(uuid, text, text), public.att_my_since();
ALTER TABLE public.employees DROP COLUMN IF EXISTS employment_type, DROP COLUMN IF EXISTS work_location;
DROP TABLE IF EXISTS public.employee_documents, public.emergency_contacts, public.employee_profiles;
DELETE FROM public.rbac_permissions WHERE key IN ('portal.employees.documents', 'emp.profile.edit', 'emp.documents.create');
COMMIT;
