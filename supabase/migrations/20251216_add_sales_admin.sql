-- Add admin role for sales@gcoman.com
-- This migration adds admin access for the sales email
--
-- IMPORTANT: Run this migration AFTER the user signs up at /login
-- The user must exist in auth.users before this script can assign the admin role

-- Step 1: Find the user ID for sales@gcoman.com (will be null if they haven't signed up yet)
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'sales@gcoman.com';

  -- Only insert if user exists and doesn't already have admin role
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin role added for sales@gcoman.com';
  ELSE
    RAISE NOTICE 'User sales@gcoman.com does not exist yet. Please have them sign up first at /login';
  END IF;
END $$;

-- Alternative: If you prefer to add multiple admins at once, use this function
CREATE OR REPLACE FUNCTION public.add_admin_role(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = user_email;

  -- Check if user exists
  IF v_user_id IS NULL THEN
    RETURN 'ERROR: User with email ' || user_email || ' does not exist';
  END IF;

  -- Add admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN 'SUCCESS: Admin role added for ' || user_email;
END;
$$;

COMMENT ON FUNCTION public.add_admin_role IS 'Helper function to add admin role to a user by email';
