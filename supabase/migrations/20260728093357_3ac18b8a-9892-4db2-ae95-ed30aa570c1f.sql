CREATE TABLE public.ar_index_status (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL UNIQUE,
  verdict text,
  coverage_state text,
  indexing_state text,
  google_canonical text,
  user_canonical text,
  last_crawl_time timestamp with time zone,
  is_indexed boolean NOT NULL DEFAULT false,
  previous_coverage_state text,
  state_changed_at timestamp with time zone,
  last_checked_at timestamp with time zone NOT NULL DEFAULT now(),
  error text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ar_index_status TO authenticated;
GRANT ALL ON public.ar_index_status TO service_role;
ALTER TABLE public.ar_index_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view ar index status" ON public.ar_index_status FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_ar_index_status_updated_at BEFORE UPDATE ON public.ar_index_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.ar_index_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL,
  from_state text,
  to_state text,
  became_indexed boolean NOT NULL DEFAULT false,
  acknowledged boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.ar_index_events TO authenticated;
GRANT ALL ON public.ar_index_events TO service_role;
ALTER TABLE public.ar_index_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view ar index events" ON public.ar_index_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update ar index events" ON public.ar_index_events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX idx_ar_index_events_created_at ON public.ar_index_events (created_at DESC);