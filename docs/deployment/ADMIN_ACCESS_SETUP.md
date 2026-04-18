# Admin Access Setup for sales@gcoman.com

## Overview
This document explains how to grant admin access to sales@gcoman.com for the GCOMAN website admin console.

## Prerequisites
✓ Database must be set up (SUPABASE_DATABASE_SETUP.sql must be run)
✓ The user (sales@gcoman.com) must sign up first at https://www.gcoman.com/login

## Step-by-Step Instructions

### Step 1: Ensure User Has Signed Up

1. Have the sales team member go to: https://www.gcoman.com/login
2. Click "Sign Up" or register
3. Use email: **sales@gcoman.com**
4. Complete the registration process
5. Verify email if required

**IMPORTANT**: The user MUST exist in the authentication system before you can assign admin role.

### Step 2: Add Admin Role

#### Method A: Using SQL Script (Recommended)

1. Log into Supabase Dashboard: https://app.supabase.com
2. Select your project: **wgoxcnnrkulrnhcmvdvt**
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Paste this SQL:

```sql
-- Add admin role for sales@gcoman.com
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'sales@gcoman.com';

  -- Check if user exists
  IF v_user_id IS NOT NULL THEN
    -- Add admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin role added successfully for sales@gcoman.com';
  ELSE
    RAISE WARNING 'User sales@gcoman.com does not exist. Please have them sign up first at /login';
  END IF;
END $$;
```

6. Click **Run** button
7. Check the output:
   - ✓ Success: "Admin role added successfully for sales@gcoman.com"
   - ✗ Error: "User does not exist" - Go back to Step 1

#### Method B: Using Helper Function

If you prefer a simpler approach:

```sql
-- Use the helper function
SELECT public.add_admin_role('sales@gcoman.com');
```

This returns either:
- `SUCCESS: Admin role added for sales@gcoman.com`
- `ERROR: User with email sales@gcoman.com does not exist`

### Step 3: Verify Admin Access

1. Have sales@gcoman.com log out and log back in
2. After login, they should see the **Admin Console** link in the navigation
3. Clicking it should show:
   - Contact form submissions
   - Job applications
   - Download tracking
   - Analytics dashboard

### Step 4: Troubleshooting

#### Issue: "Admin Console" link not visible

**Possible Causes:**
1. User hasn't logged out and back in after role was added
2. Admin role wasn't added successfully
3. Browser cache needs clearing

**Solutions:**
```sql
-- Check if admin role exists for the user
SELECT
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'sales@gcoman.com';
```

Expected result:
```
email               | role  | created_at
--------------------+-------+-------------------------
sales@gcoman.com    | admin | 2024-01-XX XX:XX:XX
```

If no row appears or role is NULL:
- Re-run the admin role SQL script
- Ensure database setup was completed

#### Issue: "Permission denied" when accessing admin features

**Possible Cause:** Row Level Security (RLS) policies not set up

**Solution:**
1. Verify RLS policies exist:
```sql
-- Check contact_submissions policies
SELECT * FROM pg_policies WHERE tablename = 'contact_submissions';

-- Check job_applications policies
SELECT * FROM pg_policies WHERE tablename = 'job_applications';

-- Check user_roles policies
SELECT * FROM pg_policies WHERE tablename = 'user_roles';
```

2. If policies missing, re-run SUPABASE_DATABASE_SETUP.sql

#### Issue: User can't sign up

**Possible Causes:**
1. Email confirmations enabled in Supabase
2. Edge function not deployed

**Solutions:**
1. Check Supabase → Authentication → Settings
2. Temporarily disable email confirmations for testing
3. Check edge functions are deployed: `supabase functions list`

---

## Adding Additional Admins

To add more admin users in the future:

```sql
-- Replace with the new admin's email
SELECT public.add_admin_role('newadmin@gcoman.com');
```

Or manually:

```sql
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'newadmin@gcoman.com';

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
```

---

## Removing Admin Access

If you need to remove admin access:

```sql
-- Remove admin role
DELETE FROM public.user_roles
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'sales@gcoman.com'
)
AND role = 'admin';
```

---

## Security Best Practices

1. **Use Strong Passwords**: Ensure admin accounts use strong, unique passwords
2. **Enable MFA**: Consider enabling multi-factor authentication in Supabase
3. **Regular Audits**: Periodically review admin users:
   ```sql
   SELECT
     u.email,
     ur.role,
     ur.created_at
   FROM auth.users u
   INNER JOIN public.user_roles ur ON u.id = ur.user_id
   WHERE ur.role = 'admin'
   ORDER BY ur.created_at DESC;
   ```
4. **Remove Inactive Admins**: Remove admin access for team members who no longer need it

---

## Quick Reference

| Task | SQL Command |
|------|-------------|
| Add admin | `SELECT public.add_admin_role('email@example.com');` |
| Check admin users | `SELECT u.email FROM auth.users u JOIN user_roles ur ON u.id = ur.user_id WHERE ur.role = 'admin';` |
| Remove admin | `DELETE FROM user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'email@example.com') AND role = 'admin';` |

---

## Related Files

- `supabase/migrations/20251216_add_sales_admin.sql` - Migration file for adding admin
- `SUPABASE_DATABASE_SETUP.sql` - Complete database setup including user_roles table
- `SUPABASE_SETUP_GUIDE.md` - Full Supabase configuration guide
