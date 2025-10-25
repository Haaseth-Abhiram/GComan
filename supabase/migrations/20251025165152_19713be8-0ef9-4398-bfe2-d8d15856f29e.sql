-- Create table for download leads
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

-- Create policy to allow authenticated users to view download leads
CREATE POLICY "Authenticated users can view download leads"
  ON public.download_leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create index for faster email lookups
CREATE INDEX idx_download_leads_email ON public.download_leads(email);
CREATE INDEX idx_download_leads_created_at ON public.download_leads(created_at DESC);