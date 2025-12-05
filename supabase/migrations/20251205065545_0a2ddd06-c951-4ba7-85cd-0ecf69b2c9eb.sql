-- Remove the public INSERT policy on download_leads to prevent direct database writes
-- All download lead submissions must go through the secured edge function with rate limiting and validation
DROP POLICY IF EXISTS "Anyone can submit download leads" ON public.download_leads;