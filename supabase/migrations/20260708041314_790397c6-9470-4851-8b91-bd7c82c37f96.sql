-- Revoke default PUBLIC execute on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_ai_search_rate_limit(text, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.add_admin_role(text) FROM PUBLIC, anon;

-- has_role is referenced by RLS policies for authenticated users
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Rate-limit helper is called from an edge function using the service role
GRANT EXECUTE ON FUNCTION public.increment_ai_search_rate_limit(text, timestamptz) TO service_role;

-- Admin bootstrap is only for signed-in admins (function re-checks the role)
GRANT EXECUTE ON FUNCTION public.add_admin_role(text) TO authenticated, service_role;

-- Trigger helpers only need to run as their trigger owner
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;