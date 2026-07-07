CREATE OR REPLACE FUNCTION public.increment_ai_search_rate_limit(p_ip text, p_window timestamptz)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.ai_search_rate_limits (ip_address, window_start, request_count)
  VALUES (p_ip, p_window, 1)
  ON CONFLICT (ip_address, window_start)
  DO UPDATE SET request_count = public.ai_search_rate_limits.request_count + 1
  RETURNING request_count;
$$;

REVOKE ALL ON FUNCTION public.increment_ai_search_rate_limit(text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_ai_search_rate_limit(text, timestamptz) TO service_role;