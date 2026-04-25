DO $$ BEGIN
  CREATE TYPE public.application_status AS ENUM ('new','reviewed','shortlisted','interview','offer','hired','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.application_prospect AS ENUM ('low','medium','high','top');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.job_applications
  ADD COLUMN IF NOT EXISTS status public.application_status NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS prospect public.application_prospect NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS hr_notes text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;

CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_prospect ON public.job_applications(prospect);
CREATE INDEX IF NOT EXISTS idx_job_applications_position ON public.job_applications(position);