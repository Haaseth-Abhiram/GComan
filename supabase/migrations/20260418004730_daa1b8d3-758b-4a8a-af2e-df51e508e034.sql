-- Harden add_admin_role: revoke public access, add auth check, fix search_path
CREATE OR REPLACE FUNCTION public.add_admin_role(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Only existing admins may call this function
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = user_email;

  IF v_user_id IS NULL THEN
    RETURN 'ERROR: User with email ' || user_email || ' does not exist';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN 'SUCCESS: Admin role added for ' || user_email;
END;
$$;

-- Revoke default public execute privileges
REVOKE EXECUTE ON FUNCTION public.add_admin_role(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.add_admin_role(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.add_admin_role(TEXT) FROM authenticated;

COMMENT ON FUNCTION public.add_admin_role IS 'Adds admin role to a user by email. Caller must already be an admin.';