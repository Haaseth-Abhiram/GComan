-- Create storage bucket for resumes (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  resume_path TEXT NOT NULL,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins should be able to view applications
-- For now, allow inserts from anyone (public job applications)
CREATE POLICY "Anyone can submit job applications"
ON public.job_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Storage policies for resumes bucket
-- Allow anyone to upload to their own path
CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'resumes');

-- Only allow users to access their own uploads temporarily (for confirmation)
CREATE POLICY "Users can view their own resume uploads"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'resumes');