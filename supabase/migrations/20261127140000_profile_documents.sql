-- Employee Portal: fuller profile (personal details, emergency contacts) and
-- employee documents.
--
--   * Employees edit their own personal details and 1-3 emergency contacts.
--     Work details (ID, department, manager…) stay with the admin.
--   * Employees upload their own documents (PDF or image, 10 MB, up to 50) and
--     delete the ones they uploaded.
--   * An admin with "Employees: Documents" sees them and can add company
--     documents (e.g. a certificate) that the employee can open but not delete.
--   * An admin with "Employees: Personal details" can see (not edit) the
--     personal details and contacts.
-- Files are in the PRIVATE bucket "employee-documents", under "<employee id>/".
-- Run after 20261127130000_projects.sql.
-- Rollback: supabase/rollback/20261127140000_profile_documents_down.sql

BEGIN;

-- Work details shown on the profile (set by the admin).
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS employment_type text CHECK (employment_type IS NULL OR employment_type IN ('full_time', 'part_time', 'intern', 'contract')),
  ADD COLUMN IF NOT EXISTS work_location   text CHECK (work_location IS NULL OR length(work_location) <= 120);

CREATE TABLE IF NOT EXISTS public.employee_profiles (
  employee_id        uuid PRIMARY KEY REFERENCES public.employees(id) ON DELETE CASCADE,
  date_of_birth      date CHECK (date_of_birth IS NULL OR date_of_birth > '1920-01-01'),
  gender             text CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  blood_group        text CHECK (blood_group IS NULL OR blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  marital_status     text CHECK (marital_status IS NULL OR marital_status IN ('single', 'married', 'divorced', 'widowed', 'prefer_not_to_say')),
  nationality        text CHECK (nationality IS NULL OR length(nationality) <= 60),
  personal_email     text CHECK (personal_email IS NULL OR (personal_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(personal_email) <= 254)),
  alternate_phone    text CHECK (alternate_phone IS NULL OR alternate_phone ~ '^\+?[0-9 ()-]{7,20}$'),
  current_address    text CHECK (current_address IS NULL OR length(current_address) <= 500),
  permanent_address  text CHECK (permanent_address IS NULL OR length(permanent_address) <= 500),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  employee_id      uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  position         smallint NOT NULL CHECK (position BETWEEN 1 AND 3),
  name             text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
  relationship     text NOT NULL CHECK (length(trim(relationship)) BETWEEN 1 AND 40),
  phone            text NOT NULL CHECK (phone ~ '^\+?[0-9 ()-]{7,20}$'),
  alternate_phone  text CHECK (alternate_phone IS NULL OR alternate_phone ~ '^\+?[0-9 ()-]{7,20}$'),
  PRIMARY KEY (employee_id, position)
);
CREATE TABLE IF NOT EXISTS public.employee_documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  category      text NOT NULL CHECK (category IN ('certificate', 'education', 'experience', 'id_proof', 'address_proof', 'photo', 'other')),
  title         text NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  storage_path  text NOT NULL UNIQUE,
  file_name     text NOT NULL CHECK (length(file_name) BETWEEN 1 AND 255),
  file_size     bigint NOT NULL CHECK (file_size BETWEEN 1 AND 10485760),
  by_company    boolean NOT NULL DEFAULT false,   -- added by an admin
  uploaded_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS employee_documents_emp ON public.employee_documents (employee_id, uploaded_at DESC);
ALTER TABLE public.employee_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.employee_profiles, public.emergency_contacts, public.employee_documents FROM anon, authenticated;

INSERT INTO public.rbac_permissions (key, area, label, description, sort_order, grp, page, tab, action_label, kind, sensitive) VALUES
  ('portal.employees.documents', 'admin',  'Employees: Documents',      'See employees'' documents and add company documents.', 207, 'Employees',       'Employees',  NULL, 'Documents',  'action', true),
  ('emp.profile.edit',           'portal', 'My profile: Edit',          'Edit own personal details and emergency contacts.',    630, 'Employee Portal', 'My profile', NULL, 'Edit',       'action', false),
  ('emp.documents.create',       'portal', 'My profile › Documents',    'Upload and delete own documents.',                     631, 'Employee Portal', 'My profile', NULL, 'Documents',  'action', false)
ON CONFLICT (key) DO NOTHING;
INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('admin', 'portal.employees.documents'), ('employee', 'emp.profile.edit'), ('employee', 'emp.documents.create')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Access helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._doc_is_mine(_emp uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT coalesce(_emp = public.portal_my_employee_id(), false); $$;

CREATE OR REPLACE FUNCTION public._doc_is_admin(_emp uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT coalesce(public.rbac_can('portal.employees.documents') AND public.rbac_emp_visible('employees', _emp), false); $$;

-- Used by the storage policies: the folder name is the employee id.
CREATE OR REPLACE FUNCTION public.doc_folder_access(_folder text, _write boolean)
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _emp uuid;
BEGIN
  BEGIN _emp := _folder::uuid; EXCEPTION WHEN OTHERS THEN RETURN false; END;
  RETURN public._doc_is_admin(_emp)
      OR (public._doc_is_mine(_emp) AND (NOT _write OR public.rbac_can('emp.documents.create')));
END;
$$;

-- ---------------------------------------------------------------------------
-- Profile
-- ---------------------------------------------------------------------------
-- _emp NULL = my own. Admins need "Employees: Personal details" for someone else.
CREATE OR REPLACE FUNCTION public.profile_get(_emp uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _id uuid := coalesce(_emp, public.portal_my_employee_id()); _personal boolean;
BEGIN
  IF _id IS NULL THEN RAISE EXCEPTION 'Only an active employee can do this.' USING ERRCODE = '42501'; END IF;
  _personal := public._doc_is_mine(_id)
    OR coalesce(public.rbac_can('portal.employees.personal') AND public.rbac_emp_visible('employees', _id), false);
  IF NOT _personal AND NOT public._doc_is_admin(_id) THEN
    RAISE EXCEPTION 'You do not have permission to see this profile.' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'employee_id', _id,
    'can_see_personal', _personal,
    'work', (SELECT jsonb_build_object('full_name', e.full_name, 'employee_code', e.employee_code, 'email', e.email,
               'department', e.department, 'designation', e.designation,
               'joined_on', CASE WHEN _personal THEN e.joined_on END,
               'employment_type', e.employment_type, 'work_location', e.work_location,
               'manager', (SELECT m.full_name FROM public.employees m WHERE m.id = e.reporting_manager_id))
               FROM public.employees e WHERE e.id = _id),
    'personal', CASE WHEN _personal THEN coalesce(
        (SELECT to_jsonb(p) - 'employee_id' - 'updated_at' FROM public.employee_profiles p WHERE p.employee_id = _id), '{}'::jsonb)
        || jsonb_build_object('phone', (SELECT phone FROM public.employees WHERE id = _id)) END,
    'contacts', CASE WHEN _personal THEN coalesce((SELECT jsonb_agg(to_jsonb(c) - 'employee_id' ORDER BY c.position)
        FROM public.emergency_contacts c WHERE c.employee_id = _id), '[]'::jsonb) ELSE '[]'::jsonb END,
    'can_see_documents', public._doc_is_mine(_id) OR public._doc_is_admin(_id),
    'documents', CASE WHEN public._doc_is_mine(_id) OR public._doc_is_admin(_id) THEN coalesce((
        SELECT jsonb_agg(jsonb_build_object('id', d.id, 'category', d.category, 'title', d.title, 'storage_path', d.storage_path,
                 'file_name', d.file_name, 'file_size', d.file_size, 'by_company', d.by_company, 'uploaded_at', d.uploaded_at,
                 'can_delete', public._doc_is_admin(_id) OR (public._doc_is_mine(_id) AND NOT d.by_company AND public.rbac_can('emp.documents.create')))
               ORDER BY d.by_company DESC, d.uploaded_at DESC)
          FROM public.employee_documents d WHERE d.employee_id = _id), '[]'::jsonb) ELSE '[]'::jsonb END);
END;
$$;

CREATE OR REPLACE FUNCTION public.profile_save(_p jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _e     public.employees := public._att_me();
  _dob   date;
  _phone text := nullif(btrim(coalesce(_p->>'phone', '')), '');
  _mail  text := nullif(btrim(coalesce(_p->>'personal_email', '')), '');
  _alt   text := nullif(btrim(coalesce(_p->>'alternate_phone', '')), '');
BEGIN
  PERFORM public.rbac_require('emp.profile.edit');
  _dob := nullif(_p->>'date_of_birth', '')::date;
  IF _dob IS NOT NULL AND (_dob <= '1920-01-01' OR _dob > (current_date - interval '14 years')::date) THEN
    RAISE EXCEPTION 'Enter a valid date of birth (at least 14 years ago).' USING ERRCODE = '22023';
  END IF;
  IF (_phone IS NOT NULL AND _phone !~ '^\+?[0-9 ()-]{7,20}$') OR (_alt IS NOT NULL AND _alt !~ '^\+?[0-9 ()-]{7,20}$') THEN
    RAISE EXCEPTION 'Phone numbers: 7-20 digits; +, spaces, ( ) and - are allowed.' USING ERRCODE = '22023';
  END IF;
  IF _mail IS NOT NULL AND (_mail !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(_mail) > 254) THEN
    RAISE EXCEPTION 'Enter a valid personal email address.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.employees SET phone = _phone, updated_at = now() WHERE id = _e.id;
  INSERT INTO public.employee_profiles (employee_id) VALUES (_e.id) ON CONFLICT DO NOTHING;
  UPDATE public.employee_profiles SET
    date_of_birth = _dob, personal_email = _mail, alternate_phone = _alt,
    gender = nullif(_p->>'gender', ''), blood_group = nullif(_p->>'blood_group', ''),
    marital_status = nullif(_p->>'marital_status', ''), nationality = nullif(btrim(coalesce(_p->>'nationality', '')), ''),
    current_address = nullif(btrim(coalesce(_p->>'current_address', '')), ''),
    permanent_address = nullif(btrim(coalesce(_p->>'permanent_address', '')), ''), updated_at = now()
   WHERE employee_id = _e.id;
  RETURN public.profile_get(NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.profile_save_contacts(_list jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me(); _c jsonb; _n int := 0;
BEGIN
  PERFORM public.rbac_require('emp.profile.edit');
  IF _list IS NULL OR jsonb_typeof(_list) <> 'array' OR jsonb_array_length(_list) NOT BETWEEN 1 AND 3 THEN
    RAISE EXCEPTION 'Add 1 to 3 emergency contacts.' USING ERRCODE = '22023';
  END IF;
  DELETE FROM public.emergency_contacts WHERE employee_id = _e.id;
  FOR _c IN SELECT * FROM jsonb_array_elements(_list) LOOP
    _n := _n + 1;
    IF btrim(coalesce(_c->>'name', '')) = '' OR btrim(coalesce(_c->>'relationship', '')) = ''
       OR btrim(coalesce(_c->>'phone', '')) !~ '^\+?[0-9 ()-]{7,20}$'
       OR (btrim(coalesce(_c->>'alternate_phone', '')) <> '' AND btrim(_c->>'alternate_phone') !~ '^\+?[0-9 ()-]{7,20}$') THEN
      RAISE EXCEPTION 'Each contact needs a name, relationship and a valid phone number.' USING ERRCODE = '22023';
    END IF;
    INSERT INTO public.emergency_contacts (employee_id, position, name, relationship, phone, alternate_phone)
    VALUES (_e.id, _n, btrim(_c->>'name'), btrim(_c->>'relationship'), btrim(_c->>'phone'), nullif(btrim(coalesce(_c->>'alternate_phone', '')), ''));
  END LOOP;
  RETURN public.profile_get(NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_work_details(_id uuid, _type text, _location text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT (public.rbac_can('portal.employees.edit') OR public.rbac_can('portal.employees.create')) THEN
    RAISE EXCEPTION 'You do not have permission to change work details.' USING ERRCODE = '42501';
  END IF;
  IF NOT public.rbac_emp_in_scope(auth.uid(), 'employees', _id) THEN
    RAISE EXCEPTION 'This employee is outside the records you may manage.' USING ERRCODE = '42501';
  END IF;
  IF EXISTS (SELECT 1 FROM public.employees WHERE id = _id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'You cannot change your own employee record. Ask another administrator.' USING ERRCODE = '42501';
  END IF;
  UPDATE public.employees SET employment_type = nullif(_type, ''), work_location = nullif(btrim(coalesce(_location, '')), ''),
    updated_at = now() WHERE id = _id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Employee not found.' USING ERRCODE = 'P0002'; END IF;
END;
$$;

-- The first day the attendance calendar may mark as absent.
CREATE OR REPLACE FUNCTION public.att_my_since()
RETURNS date
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT greatest(public._att_date(e.created_at), coalesce(e.joined_on, public._att_date(e.created_at)))
    FROM public.employees e WHERE e.user_id = auth.uid() AND e.active;
$$;

-- ---------------------------------------------------------------------------
-- Documents
-- ---------------------------------------------------------------------------
-- Registers an uploaded file. _emp is the owner (the caller, or someone an admin manages).
CREATE OR REPLACE FUNCTION public.doc_add(_emp uuid, _category text, _title text, _path text, _name text, _size bigint)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _company boolean := NOT public._doc_is_mine(_emp);
  _id uuid;
BEGIN
  IF _emp IS NULL OR NOT (public._doc_is_admin(_emp) OR (public._doc_is_mine(_emp) AND public.rbac_can('emp.documents.create'))) THEN
    RAISE EXCEPTION 'You do not have permission to add this document.' USING ERRCODE = '42501';
  END IF;
  IF _path IS NULL OR split_part(_path, '/', 1) <> _emp::text OR _path LIKE '%..%' THEN
    RAISE EXCEPTION 'Invalid file location.' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'employee-documents' AND name = _path) THEN
    RAISE EXCEPTION 'The file was not uploaded.' USING ERRCODE = 'P0002';
  END IF;
  IF coalesce(_size, 0) NOT BETWEEN 1 AND 10485760 THEN RAISE EXCEPTION 'The file must be 10 MB or smaller.' USING ERRCODE = '22023'; END IF;
  IF (SELECT count(*) FROM public.employee_documents WHERE employee_id = _emp) >= 50 THEN
    RAISE EXCEPTION 'Up to 50 documents can be kept. Delete one first.' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.employee_documents (employee_id, category, title, storage_path, file_name, file_size, by_company, uploaded_by)
  VALUES (_emp, _category, left(coalesce(nullif(btrim(coalesce(_title, '')), ''), btrim(_name)), 120), _path,
          left(btrim(_name), 255), _size, _company, auth.uid())
  RETURNING id INTO _id;
  IF _company THEN
    PERFORM public._notify(_emp, 'message', 'A new document was added to your profile',
      (SELECT title FROM public.employee_documents WHERE id = _id), '/portal/profile');
  END IF;
  RETURN _id;
END;
$$;

-- Returns the file path, so the caller can remove the file too.
CREATE OR REPLACE FUNCTION public.doc_delete(_id uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _d public.employee_documents;
BEGIN
  SELECT * INTO _d FROM public.employee_documents WHERE id = _id;
  IF _d.id IS NULL OR NOT (public._doc_is_admin(_d.employee_id)
       OR (public._doc_is_mine(_d.employee_id) AND NOT _d.by_company AND public.rbac_can('emp.documents.create'))) THEN
    RAISE EXCEPTION 'You cannot delete this document.' USING ERRCODE = '42501';
  END IF;
  DELETE FROM public.employee_documents WHERE id = _id;
  RETURN _d.storage_path;
END;
$$;

CREATE OR REPLACE FUNCTION public.doc_path_in_use(_path text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (SELECT 1 FROM public.employee_documents WHERE storage_path = _path); $$;

REVOKE ALL ON FUNCTION public._doc_is_mine(uuid), public._doc_is_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.doc_folder_access(text, boolean), public.doc_path_in_use(text), public.profile_get(uuid),
  public.profile_save(jsonb), public.profile_save_contacts(jsonb), public.doc_add(uuid, text, text, text, text, bigint),
  public.doc_delete(uuid), public.admin_set_work_details(uuid, text, text), public.att_my_since() FROM PUBLIC, anon;
-- doc_folder_access and doc_path_in_use are used inside the storage policies.
GRANT EXECUTE ON FUNCTION public.doc_folder_access(text, boolean), public.doc_path_in_use(text), public.profile_get(uuid),
  public.profile_save(jsonb), public.profile_save_contacts(jsonb), public.doc_add(uuid, text, text, text, text, bigint),
  public.doc_delete(uuid), public.admin_set_work_details(uuid, text, text), public.att_my_since() TO authenticated;

-- ---------------------------------------------------------------------------
-- Private storage bucket
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('employee-documents', 'employee-documents', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Employee documents: read" ON storage.objects;
CREATE POLICY "Employee documents: read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'employee-documents' AND public.doc_folder_access((storage.foldername(name))[1], false));
DROP POLICY IF EXISTS "Employee documents: upload" ON storage.objects;
CREATE POLICY "Employee documents: upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'employee-documents' AND public.doc_folder_access((storage.foldername(name))[1], true));
-- A file may be removed once nothing refers to it (after doc_delete), so an
-- employee can't remove the file behind a company document.
DROP POLICY IF EXISTS "Employee documents: delete" ON storage.objects;
CREATE POLICY "Employee documents: delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'employee-documents' AND public.doc_folder_access((storage.foldername(name))[1], true)
         AND NOT public.doc_path_in_use(name));

COMMIT;
