-- Track Zoho CRM lead IDs across all lead-generating tables
ALTER TABLE public.download_leads
  ADD COLUMN IF NOT EXISTS zoho_lead_id text,
  ADD COLUMN IF NOT EXISTS synced_to_zoho boolean DEFAULT false;

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS zoho_lead_id text,
  ADD COLUMN IF NOT EXISTS synced_to_zoho boolean DEFAULT false;