-- Fix 1: Add SECURITY DEFINER to has_role() to prevent admin lockout
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Fix 2: Replace overly permissive resume upload policy with path-scoped one
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;

CREATE POLICY "Users can upload their own resume"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);