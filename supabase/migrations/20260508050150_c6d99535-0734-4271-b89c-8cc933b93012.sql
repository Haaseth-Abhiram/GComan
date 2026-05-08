CREATE TABLE IF NOT EXISTS public.ai_search_rate_limits (
  ip_address text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT date_trunc('minute', now()),
  request_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_address, window_start)
);

CREATE INDEX IF NOT EXISTS idx_ai_search_rate_limits_window ON public.ai_search_rate_limits (window_start);

ALTER TABLE public.ai_search_rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies = no public access; only service role bypasses RLS.