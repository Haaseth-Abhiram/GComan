-- Generic per-endpoint rate-limit counters for edge functions.
-- notify-download and subscribe-newsletter previously used per-isolate
-- in-memory Maps that reset on every cold start and aren't shared across
-- instances — trivially bypassable. This mirrors ai_search_rate_limits
-- but is keyed by endpoint so all functions can share one table.
CREATE TABLE IF NOT EXISTS public.edge_rate_limits (
  endpoint text NOT NULL,
  ip_address text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT date_trunc('minute', now()),
  request_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (endpoint, ip_address, window_start)
);

CREATE INDEX IF NOT EXISTS idx_edge_rate_limits_window ON public.edge_rate_limits (window_start);

ALTER TABLE public.edge_rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies = no public access; only service role bypasses RLS.
