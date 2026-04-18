# Supabase Setup Guide

## Issue 1: Contact Form Submission Error

### Problem
Contact form shows "Submission failed" error because Supabase is not configured.

### Solution

1. **Go to Supabase Dashboard**
   - Visit https://app.supabase.com
   - Sign in or create an account
   - Create a new project or select existing one

2. **Get API Credentials**
   - Go to Settings > API
   - Copy these values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon/public key** (long string starting with `eyJ...`)
     - **Project Reference ID**

3. **Update .env File**
   - Open `.env` file in root directory
   - Replace placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_SUPABASE_PROJECT_ID=your-project-id
   ```

4. **Deploy Edge Functions**
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase

   # Link to your project
   supabase link --project-ref your-project-id

   # Deploy edge functions
   supabase functions deploy submit-contact
   supabase functions deploy submit-job-application
   ```

5. **Restart Development Server**
   ```bash
   npm run dev
   ```

---

## Issue 2: Adding Admin Access for sales@gcoman.com

### Steps to Add Admin Access

#### Option A: Via Supabase Dashboard (Easiest)

1. **User Must Sign Up First**
   - Go to your website: `/login`
   - Have sales@gcoman.com create an account

2. **Run SQL in Supabase Dashboard**
   - Go to Supabase Dashboard > SQL Editor
   - Run this query:
   ```sql
   -- Add admin role for sales@gcoman.com
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role
   FROM auth.users
   WHERE email = 'sales@gcoman.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

3. **Verify Admin Access**
   - Log in as sales@gcoman.com
   - Visit `/admin` - you should have access!

#### Option B: Via Migration (Automated)

1. **User Must Sign Up First** (same as above)

2. **Apply Migration**
   ```bash
   supabase db push
   ```

3. **Alternative: Use Helper Function**
   After migration is applied, you can add more admins easily:
   ```sql
   SELECT public.add_admin_role('sales@gcoman.com');
   SELECT public.add_admin_role('another@gcoman.com');
   ```

---

## Verification

### Test Contact Form
1. Go to `/contact`
2. Fill out the form
3. Submit - should show success message
4. Check Supabase Dashboard > Table Editor > `contact_submissions`

### Test Admin Access
1. Log in as sales@gcoman.com
2. Go to `/admin`
3. You should see:
   - Job applications list
   - Contact submissions
   - Download resumes
   - Update application status

---

## Troubleshooting

### Contact Form Still Failing?
- Check browser console for errors
- Verify `.env` values are correct (no spaces, quotes, or `your_` prefixes)
- Ensure edge functions are deployed
- Check Supabase Dashboard > Edge Functions logs

### Admin Access Not Working?
- Verify user has signed up (check `auth.users` table)
- Check `user_roles` table has entry for the user
- Clear browser cache and try logging in again
- Check browser console for errors

### Need Help?
- Check Supabase logs in Dashboard
- Review `supabase/functions/` for edge function code
- Check RLS policies in Supabase Dashboard > Authentication > Policies

---

## Quick Command Reference

```bash
# Link to Supabase project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push

# Deploy edge functions
supabase functions deploy submit-contact
supabase functions deploy submit-job-application

# View edge function logs
supabase functions logs submit-contact

# Reset database (CAREFUL - deletes all data!)
supabase db reset
```
