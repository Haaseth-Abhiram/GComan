-- Remove the public INSERT policy on download_leads (with trailing space in name)
-- All download lead submissions must go through the secured edge function
DROP POLICY IF EXISTS "Anyone can submit download leads " ON public.download_leads;