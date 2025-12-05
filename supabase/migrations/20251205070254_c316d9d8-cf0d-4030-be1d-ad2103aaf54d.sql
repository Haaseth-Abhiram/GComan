-- Remove the public INSERT policy on job_applications
-- All job application submissions must go through the secured edge function
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;