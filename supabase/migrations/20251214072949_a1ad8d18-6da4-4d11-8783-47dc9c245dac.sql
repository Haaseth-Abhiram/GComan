-- Drop the non-functional user resume access policy 
-- This policy doesn't work because files are uploaded as {timestamp}-{filename} 
-- not as {user_id}/{filename}, so the policy condition never matches.
-- Only admin access is needed for job applications (which already works).
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;