-- Add ip_address column to contact_submissions table for rate limiting
ALTER TABLE public.contact_submissions 
ADD COLUMN ip_address text;

-- Create an index on ip_address and created_at for efficient rate limiting queries
CREATE INDEX idx_contact_submissions_ip_created 
ON public.contact_submissions(ip_address, created_at);