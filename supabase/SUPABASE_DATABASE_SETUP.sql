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
USING (bucket_id = 'resumes');-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();-- Fix function search path for update_updated_at_column
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();-- Create contact_submissions table to store all form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  synced_to_zoho BOOLEAN DEFAULT FALSE,
  zoho_lead_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact submissions
CREATE POLICY "Anyone can submit contact forms"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Admin-only: lead PII must not be readable by every authenticated account.
-- (Matches migration 2025-12-05, which dropped the earlier looser policy.)
CREATE POLICY "Admins can view all contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);-- Create table for download leads
CREATE TABLE public.download_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  resource_title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.download_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to submit download leads
CREATE POLICY "Anyone can submit download leads"
  ON public.download_leads
  FOR INSERT
  WITH CHECK (true);

-- Admin-only: lead PII must not be readable by every authenticated account.
-- (Matches migration 2025-12-05, which dropped the earlier looser policy.)
CREATE POLICY "Admins can view all download leads"
  ON public.download_leads
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster email lookups
CREATE INDEX idx_download_leads_email ON public.download_leads(email);
CREATE INDEX idx_download_leads_created_at ON public.download_leads(created_at DESC);-- Add new columns to download_leads table
ALTER TABLE public.download_leads
ADD COLUMN company TEXT,
ADD COLUMN country TEXT,
ADD COLUMN industry TEXT,
ADD COLUMN marketing_consent BOOLEAN DEFAULT false;

-- Make company and country required for new records
ALTER TABLE public.download_leads
ALTER COLUMN company SET NOT NULL,
ALTER COLUMN country SET NOT NULL;-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin SELECT policy for job_applications
CREATE POLICY "Admins can view all job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update job applications"
ON public.job_applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete job applications"
ON public.job_applications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update storage policies for resumes bucket to remove anonymous access
DROP POLICY IF EXISTS "Anyone can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resume uploads" ON storage.objects;

-- Create new authenticated-only policies
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Users can view their own resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resumes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));-- Fix Critical Security Issues: Restrict Access to Sensitive Data

-- 1. Fix profiles table - restrict to authenticated users only + admin access
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix contact_submissions table - admin-only access
DROP POLICY IF EXISTS "Authenticated users can view contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view all contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix download_leads table - admin-only access
DROP POLICY IF EXISTS "Authenticated users can view download leads" ON public.download_leads;

CREATE POLICY "Admins can view all download leads"
ON public.download_leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update download leads"
ON public.download_leads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete download leads"
ON public.download_leads
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));-- Add ip_address column to contact_submissions table for rate limiting
ALTER TABLE public.contact_submissions 
ADD COLUMN ip_address text;

-- Create an index on ip_address and created_at for efficient rate limiting queries
CREATE INDEX idx_contact_submissions_ip_created 
ON public.contact_submissions(ip_address, created_at);-- Remove the public INSERT policy to prevent direct database writes
-- All contact submissions must go through the secured edge function with rate limiting
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;-- Remove the public INSERT policy on download_leads to prevent direct database writes
-- All download lead submissions must go through the secured edge function with rate limiting and validation
DROP POLICY IF EXISTS "Anyone can submit download leads" ON public.download_leads;-- Remove the public INSERT policy on download_leads (with trailing space in name)
-- All download lead submissions must go through the secured edge function
DROP POLICY IF EXISTS "Anyone can submit download leads " ON public.download_leads;-- Remove the public INSERT policy on job_applications
-- All job application submissions must go through the secured edge function
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;-- Add email notification status tracking to contact_submissions
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_error TEXT;-- Drop the non-functional user resume access policy 
-- This policy doesn't work because files are uploaded as {timestamp}-{filename} 
-- not as {user_id}/{filename}, so the policy condition never matches.
-- Only admin access is needed for job applications (which already works).
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;-- Add admin role for sales@gcoman.com
-- This migration adds admin access for the sales email
--
-- IMPORTANT: Run this migration AFTER the user signs up at /login
-- The user must exist in auth.users before this script can assign the admin role

-- Step 1: Find the user ID for sales@gcoman.com (will be null if they haven't signed up yet)
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'sales@gcoman.com';

  -- Only insert if user exists and doesn't already have admin role
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin role added for sales@gcoman.com';
  ELSE
    RAISE NOTICE 'User sales@gcoman.com does not exist yet. Please have them sign up first at /login';
  END IF;
END $$;

-- Alternative: If you prefer to add multiple admins at once, use this function.
-- HARDENED (mirrors migration 20260418004730): the original version had no
-- caller check and default PUBLIC EXECUTE, letting any anon user grant admin
-- to any signed-up email via POST /rest/v1/rpc/add_admin_role.
CREATE OR REPLACE FUNCTION public.add_admin_role(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Only existing admins may call this function
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = user_email;

  IF v_user_id IS NULL THEN
    RETURN 'ERROR: User with email ' || user_email || ' does not exist';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN 'SUCCESS: Admin role added for ' || user_email;
END;
$$;

-- Revoke default public execute privileges
REVOKE EXECUTE ON FUNCTION public.add_admin_role(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.add_admin_role(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.add_admin_role(TEXT) FROM authenticated;

COMMENT ON FUNCTION public.add_admin_role IS 'Adds admin role to a user by email. Caller must already be an admin.';
