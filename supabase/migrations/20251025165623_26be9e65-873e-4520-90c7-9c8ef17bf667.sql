-- Add new columns to download_leads table
ALTER TABLE public.download_leads
ADD COLUMN company TEXT,
ADD COLUMN country TEXT,
ADD COLUMN industry TEXT,
ADD COLUMN marketing_consent BOOLEAN DEFAULT false;

-- Make company and country required for new records
ALTER TABLE public.download_leads
ALTER COLUMN company SET NOT NULL,
ALTER COLUMN country SET NOT NULL;