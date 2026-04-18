# Supabase Setup Guide for GCOMAN Website

## Current Situation

Your Lovable Cloud project is currently connected to Lovable's built-in Supabase backend (project ID: `yawbaqdywfrmuajaiptw`).

You created a new external Supabase project (project ID: `wgoxcnnrkulrnhcmvdvt`) and want to use it instead.

## Option 1: Use External Supabase Project (Recommended Based on Your Setup)

Since you've already created the external Supabase project and we've configured the environment variables, here's how to complete the setup:

### Step 1: Run Database Migrations

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: `wgoxcnnrkulrnhcmvdvt`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `SUPABASE_DATABASE_SETUP.sql` file
6. Paste into the SQL editor
7. Click **Run** button
8. Verify you see success messages (no red errors)

This creates:
- `job_applications` table
- `contact_submissions` table
- `user_roles` table
- Storage buckets for resumes and brochures
- Row Level Security policies
- Edge function configurations

### Step 2: Deploy Edge Functions

You have 3 edge functions that need to be deployed:

#### Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

#### Login to Supabase

```bash
supabase login
```

#### Link Your Project

```bash
supabase link --project-ref wgoxcnnrkulrnhcmvdvt
```

#### Deploy Functions

```bash
# Deploy contact form function
supabase functions deploy submit-contact

# Deploy job application function
supabase functions deploy submit-job-application

# Deploy download notification function
supabase functions deploy notify-download
```

### Step 3: Add Admin Access for sales@gcoman.com

After sales@gcoman.com signs up on your website (at /login), run this SQL:

1. Go to **SQL Editor** in Supabase dashboard
2. Run this query:

```sql
-- Find and add admin role for sales@gcoman.com
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'sales@gcoman.com';

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin role added successfully';
  ELSE
    RAISE NOTICE 'User must sign up first at /login';
  END IF;
END $$;
```

Alternatively, use the helper function:

```sql
SELECT public.add_admin_role('sales@gcoman.com');
```

### Step 4: Configure Environment Variables in Lovable

**IMPORTANT**: You need to add these environment variables to your Lovable deployment:

1. Go to your Lovable project settings
2. Find **Environment Variables** section
3. Add these variables:

```
VITE_SUPABASE_URL=https://wgoxcnnrkulrnhcmvdvt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb3hjbm5ya3Vscm5oY212ZHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTA3MzgsImV4cCI6MjA1MDAyNjczOH0.ey1hbGc101JIUz11NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb3hjbm5ya3Vscm5oY212ZHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTA3MzgsImV4cCI6MjA1MDAyNjczOH0
VITE_SUPABASE_PROJECT_ID=wgoxcnnrkulrnhcmvdvt
```

4. Save and redeploy your application

### Step 5: Disconnect from Lovable Cloud Backend (if needed)

If Lovable requires you to disconnect from the built-in backend:

1. In Lovable project settings, find **Integrations** or **Backend** section
2. Disconnect from Lovable Cloud Supabase
3. The project will now use your external Supabase credentials from environment variables

### Step 6: Test Everything

After deployment:

1. **Test Contact Form**:
   - Go to https://www.gcoman.com/contact
   - Submit a test message
   - Check Supabase dashboard → Table Editor → `contact_submissions`
   - Verify the submission appears

2. **Test Career Application**:
   - Go to https://www.gcoman.com/career
   - Submit a test application
   - Check Supabase dashboard → Table Editor → `job_applications`
   - Verify the application appears

3. **Test Admin Access**:
   - Have sales@gcoman.com sign up at /login
   - Run the admin SQL script from Step 3
   - Log in and verify admin panel access

---

## Option 2: Use Lovable Cloud Backend

If you decide to use Lovable Cloud's built-in Supabase instead:

### Advantages:
- Already integrated with your Lovable deployment
- No need to manage separate Supabase project
- Simpler setup

### Steps Required:

1. **Run Database Migrations in Lovable Cloud Supabase**:
   - You'll need to access project `yawbaqdywfrmuajaiptw`
   - Run the same `SUPABASE_DATABASE_SETUP.sql` file
   - Deploy the same edge functions

2. **Update Environment Variables**:
   - Change `.env` to use Lovable Cloud credentials
   - Get credentials from Lovable project settings

3. **Add Admin Access**:
   - Run same admin SQL script
   - Use Lovable Cloud's SQL editor

---

## Troubleshooting

### Contact Form Shows "Submission Failed"

**Cause**: Edge function not deployed or database tables missing

**Fix**:
1. Check Supabase Functions dashboard - ensure `submit-contact` is deployed
2. Check Table Editor - verify `contact_submissions` table exists
3. Check browser console for specific error messages

### Admin Panel Not Accessible

**Cause**: User doesn't have admin role or hasn't signed up

**Fix**:
1. Ensure sales@gcoman.com has signed up at /login
2. Check Table Editor → `user_roles` - verify admin entry exists
3. Re-run admin SQL script if needed

### Environment Variables Not Working

**Cause**: Variables not set in Lovable deployment

**Fix**:
1. Local `.env` file is for local development only
2. Must also set variables in Lovable project settings
3. Redeploy after adding variables

---

## Summary of Files

- `SUPABASE_DATABASE_SETUP.sql` - Complete database schema (run this first)
- `supabase/migrations/20251216_add_sales_admin.sql` - Admin role helper
- `.env` - Local development environment variables
- `supabase/functions/` - Edge functions directory

---

## Next Steps

1. Choose which backend option you want to use
2. Follow the corresponding steps above
3. Test contact form and career applications
4. Add admin access for sales@gcoman.com
5. Verify everything works on production

If you encounter any errors during setup, check the Supabase dashboard logs and browser console for specific error messages.
