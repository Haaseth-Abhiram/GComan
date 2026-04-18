# How to Get Supabase Credentials from Lovable

## Your Supabase is Managed by Lovable Cloud

Since your project uses Lovable Cloud's managed Supabase, the credentials are NOT in your Supabase dashboard. You must get them from Lovable.

## Steps to Get Credentials:

### Method 1: Via Lovable Integrations
1. Go to https://lovable.dev/projects/88275aec-3e28-4007-bd65-43d79fa41e87
2. Look for **"Integrations"** button (usually in top-right toolbar or sidebar)
3. Find **"Supabase"** integration
4. You should see:
   - Project URL (VITE_SUPABASE_URL)
   - Anon Key (VITE_SUPABASE_PUBLISHABLE_KEY)
5. Copy these values

### Method 2: Via Browser DevTools (if deployed)
1. Open your deployed Lovable app (the published URL)
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for "🔍 Supabase Connection Diagnostics" output
5. It will show the ACTUAL URLs being used in production
6. Copy those values

### Method 3: Check Lovable Code Editor
1. In your Lovable project
2. Click on "Code" or "Editor"
3. Look for integrations/supabase/client.ts or similar
4. Lovable might show the actual values there

### Method 4: Ask Lovable Support
If you can't find the credentials:
1. Open Lovable chat/support
2. Ask: "What are my Supabase URL and anon key for local development?"
3. They can provide them

## Once You Have the Credentials:

1. Edit `/home/user/gcoman-insight-design/.env`
2. Replace:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   ```
   With actual value:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   ```

3. Replace:
   ```
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
   ```
   With actual value:
   ```
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
   ```

4. Save the file
5. Restart your dev server: `npm run dev`

## Why This Is Required

- ✅ On Lovable deployment: Environment variables are injected automatically
- ❌ On local development: You must manually configure .env file

The error "Load failed" happens because your browser is trying to connect to "your_supabase_url_here" which is not a real URL.
