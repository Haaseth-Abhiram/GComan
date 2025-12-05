-- Remove the public INSERT policy to prevent direct database writes
-- All contact submissions must go through the secured edge function with rate limiting
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;