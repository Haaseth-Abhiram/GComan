# Environment Variables Deployment Checklist

## Overview
This checklist ensures all environment variables are properly configured for both local development and production deployment on Lovable Cloud.

## Current Configuration Status

### Local Development (.env file)
✓ File exists at: `/home/user/gcoman-insight-design/.env`
✓ Contains Supabase credentials for project: `wgoxcnnrkulrnhcmvdvt`

```env
VITE_SUPABASE_URL=https://wgoxcnnrkulrnhcmvdvt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=wgoxcnnrkulrnhcmvdvt
```

### Production Deployment (Lovable Cloud)
⚠️ **ACTION REQUIRED**: Environment variables must be configured in Lovable

---

## Deployment Checklist

### Phase 1: Verify Local Environment

- [ ] `.env` file exists in project root
- [ ] `.env` is listed in `.gitignore` (security check)
- [ ] All three Supabase variables are present:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] Local development server runs without errors: `npm run dev`
- [ ] Can connect to Supabase locally (check browser console for errors)

### Phase 2: Configure Lovable Cloud Environment

#### Step 1: Access Lovable Project Settings

1. Go to your Lovable project dashboard
2. Navigate to **Settings** or **Configuration**
3. Find **Environment Variables** or **Secrets** section

#### Step 2: Add Production Environment Variables

Add the following variables (use the EXACT values from your `.env` file):

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://wgoxcnnrkulrnhcmvdvt.supabase.co
```

**Variable 2:**
```
Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb3hjbm5ya3Vscm5oY212ZHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTA3MzgsImV4cCI6MjA1MDAyNjczOH0.ey1hbGc101JIUz11NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb3hjbm5ya3Vscm5oY212ZHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTA3MzgsImV4cCI6MjA1MDAyNjczOH0
```

**Variable 3:**
```
Name: VITE_SUPABASE_PROJECT_ID
Value: wgoxcnnrkulrnhcmvdvt
```

#### Step 3: Save and Verify

- [ ] All three variables saved successfully
- [ ] No typos in variable names (they are case-sensitive!)
- [ ] No extra spaces in values
- [ ] Screenshot taken for documentation (optional but recommended)

### Phase 3: Redeploy Application

- [ ] Trigger a new deployment in Lovable
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for any errors related to environment variables

### Phase 4: Test Production Environment

#### Test 1: Supabase Connection
- [ ] Open production site: https://www.gcoman.com
- [ ] Open browser DevTools → Console
- [ ] Look for any Supabase connection errors
- [ ] Should see no red errors related to Supabase

#### Test 2: Contact Form
- [ ] Navigate to: https://www.gcoman.com/contact
- [ ] Fill out the contact form with test data:
  - Name: Test User
  - Email: test@example.com
  - Company: Test Company
  - Message: Testing contact form after environment variable setup
- [ ] Click Submit
- [ ] Should see success message (not "Submission Failed")
- [ ] Verify in Supabase Dashboard → Table Editor → `contact_submissions`

#### Test 3: Career Application
- [ ] Navigate to: https://www.gcoman.com/career
- [ ] Fill out application form with test data
- [ ] Upload a test resume (PDF)
- [ ] Click Submit
- [ ] Should see success message
- [ ] Verify in Supabase Dashboard → Table Editor → `job_applications`
- [ ] Verify in Storage → `resumes` bucket

#### Test 4: Admin Login (after setup)
- [ ] Navigate to: https://www.gcoman.com/login
- [ ] Sign in as sales@gcoman.com
- [ ] Should see "Admin Console" link after login
- [ ] Click Admin Console
- [ ] Should load without errors

---

## Common Issues & Solutions

### Issue 1: Variables Not Loading in Production

**Symptoms:**
- Contact form shows "Submission Failed"
- Console shows "Supabase client error"
- Features work locally but not in production

**Solution:**
1. Verify environment variables are set in Lovable (not just `.env`)
2. Check variable names are EXACTLY `VITE_SUPABASE_URL` (not `SUPABASE_URL`)
3. Vite requires `VITE_` prefix for client-side variables
4. Redeploy after adding variables

### Issue 2: "Invalid API Key" Error

**Symptoms:**
- Console error: "Invalid API key"
- Supabase requests fail with 401 Unauthorized

**Solution:**
1. Verify `VITE_SUPABASE_PUBLISHABLE_KEY` is the **anon/public key** (not service role key)
2. Get correct key from Supabase Dashboard → Settings → API
3. Should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Update in Lovable and redeploy

### Issue 3: Different Credentials Locally vs Production

**Symptoms:**
- Works locally but fails in production (or vice versa)
- Data shows in one database but not the other

**Solution:**
1. Local uses `.env` file
2. Production uses Lovable environment variables
3. Make sure BOTH point to the same Supabase project:
   - Project ID should be `wgoxcnnrkulrnhcmvdvt` in both places
4. Avoid having different databases for local and production

### Issue 4: CORS Errors

**Symptoms:**
- Console error: "CORS policy blocked"
- Network tab shows preflight requests failing

**Solution:**
1. Add your Lovable domain to Supabase allowed origins:
   - Supabase Dashboard → Settings → API → CORS allowed origins
   - Add: `https://www.gcoman.com`
   - Add: `https://*.lovable.app` (for preview deployments)
2. Edge functions may need CORS headers configured

---

## Environment Variables Reference

| Variable | Purpose | Where to Find | Example |
|----------|---------|---------------|---------|
| `VITE_SUPABASE_URL` | Supabase project API URL | Supabase Dashboard → Settings → API → Project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public/anon key for client-side | Supabase Dashboard → Settings → API → anon public key | `eyJhbGc...` (long JWT token) |
| `VITE_SUPABASE_PROJECT_ID` | Project reference ID | Supabase Dashboard → Settings → General → Reference ID | `xxxxx` (short alphanumeric) |

**Security Note:** The publishable/anon key is safe to expose in client-side code. Row Level Security (RLS) policies protect your data.

---

## Additional Environment Variables (Future)

If you add more features, you may need:

```env
# Email service (e.g., SendGrid, Mailgun)
VITE_EMAIL_SERVICE_KEY=

# Analytics (already using Google Analytics)
# No additional env vars needed for GA4

# Payment processing (future)
VITE_STRIPE_PUBLISHABLE_KEY=

# Third-party APIs
VITE_GOOGLE_MAPS_API_KEY=
```

Remember: All client-side environment variables in Vite MUST start with `VITE_` prefix!

---

## Verification Script

Run this locally to verify environment variables are loaded:

```javascript
// Add to any component temporarily for debugging
console.log('Environment Check:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID
});
```

Expected output:
```
Environment Check: {
  url: "https://wgoxcnnrkulrnhcmvdvt.supabase.co",
  hasKey: true,
  projectId: "wgoxcnnrkulrnhcmvdvt"
}
```

If any value is `undefined`, the variable is not loading correctly.

---

## Final Checklist Summary

### Before Deployment
- [ ] `.env` file configured locally
- [ ] Local development tested and working
- [ ] Database migrations run in Supabase
- [ ] Edge functions deployed
- [ ] Admin access configured

### During Deployment
- [ ] Environment variables added to Lovable
- [ ] All three variables present and correct
- [ ] Application redeployed
- [ ] No deployment errors

### After Deployment
- [ ] Production site loads without errors
- [ ] Contact form works
- [ ] Career applications work
- [ ] Admin can log in
- [ ] Data appears in correct Supabase project

---

## Related Documentation

- `SUPABASE_SETUP_GUIDE.md` - Complete Supabase configuration guide
- `ADMIN_ACCESS_SETUP.md` - Admin user setup instructions
- `.env.example` - Template for environment variables (if created)
- Vite Env Variables: https://vitejs.dev/guide/env-and-mode.html
- Supabase Docs: https://supabase.com/docs/guides/api

---

## Support

If you encounter issues not covered here:

1. Check Supabase dashboard logs: Dashboard → Logs
2. Check browser console for client-side errors
3. Check Lovable deployment logs
4. Verify all steps in this checklist were completed
5. Consult SUPABASE_SETUP_GUIDE.md for troubleshooting section
