-- Clean up redundant user_roles policies
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Revoke EXECUTE on SECURITY DEFINER functions from public roles.
-- These are intended to be called from triggers or other SECURITY DEFINER functions only.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- add_admin_role enforces an internal admin check, so only authenticated admins
-- effectively succeed; restrict EXECUTE to authenticated users (no anon).
REVOKE EXECUTE ON FUNCTION public.add_admin_role(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_admin_role(text) TO authenticated;