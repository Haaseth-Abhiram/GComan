
CREATE TABLE public.site_analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_visitors integer NOT NULL DEFAULT 0,
  total_pageviews integer NOT NULL DEFAULT 0,
  avg_bounce_rate numeric(5,2) NOT NULL DEFAULT 0,
  avg_pages_per_visit numeric(5,2) NOT NULL DEFAULT 0,
  daily_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  top_pages jsonb NOT NULL DEFAULT '[]'::jsonb,
  traffic_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  device_breakdown jsonb NOT NULL DEFAULT '[]'::jsonb,
  country_breakdown jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read analytics"
  ON public.site_analytics_snapshots
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert analytics"
  ON public.site_analytics_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
