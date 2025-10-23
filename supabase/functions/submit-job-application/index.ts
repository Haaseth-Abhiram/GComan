import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  linkedinUrl?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse multipart form data
    const formData = await req.formData();
    
    // Extract application data
    const applicationData: ApplicationData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: formData.get('position') as string,
      experience: formData.get('experience') as string,
      coverLetter: formData.get('coverLetter') as string,
      linkedinUrl: formData.get('linkedinUrl') as string || undefined,
    };

    // Validate required fields
    if (!applicationData.name || !applicationData.email || !applicationData.phone || 
        !applicationData.position || !applicationData.experience || !applicationData.coverLetter) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the resume file
    const resumeFile = formData.get('resume') as File;
    if (!resumeFile) {
      return new Response(
        JSON.stringify({ error: 'Resume file is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resumeFile.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only PDF, DOC, and DOCX are allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 5MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize filename to prevent path traversal
    const sanitizedFileName = resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const filePath = `${timestamp}-${sanitizedFileName}`;

    // Upload resume to storage
    const fileBuffer = await resumeFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, fileBuffer, {
        contentType: resumeFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload resume' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert application data into database
    const { error: insertError } = await supabase
      .from('job_applications')
      .insert({
        name: applicationData.name,
        email: applicationData.email,
        phone: applicationData.phone,
        position: applicationData.position,
        experience: applicationData.experience,
        cover_letter: applicationData.coverLetter,
        resume_path: filePath,
        linkedin_url: applicationData.linkedinUrl,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      // Try to clean up uploaded file
      await supabase.storage.from('resumes').remove([filePath]);
      return new Response(
        JSON.stringify({ error: 'Failed to save application' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Application submitted successfully for ${applicationData.email}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Application submitted successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing application:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
