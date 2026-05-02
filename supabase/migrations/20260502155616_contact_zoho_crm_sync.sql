-- Add observability columns for the contact form -> Zoho CRM Lead push.
-- The existing synced_to_zoho (boolean) and zoho_lead_id (text) columns were
-- scaffolded in the original contact_submissions migration but never wired up;
-- the submit-contact edge function now populates them, plus the two added here.

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS zoho_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS zoho_error TEXT;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_zoho_status
  ON public.contact_submissions(synced_to_zoho, created_at DESC);
