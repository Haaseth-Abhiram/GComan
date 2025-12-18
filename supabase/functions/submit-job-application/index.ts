import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Allowed origins whitelist - prevents wildcard CORS misconfiguration
const ALLOWED_ORIGINS = [
  'https://www.gcoman.com',
  'https://gcoman.com',
  'https://gcoman.lovable.app',
  'https://88275aec-3e28-4007-bd65-43d79fa41e87.lovableproject.com',
];

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get('Origin') || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : 'https://www.gcoman.com';
}

function getCorsHeaders(req: Request) {
  return {
    'Access-Control-Allow-Origin': getCorsOrigin(req),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  linkedinUrl?: string;
}

// Validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 7 && phone.length <= 20;
}

// LinkedIn URL validation - only allow actual LinkedIn domains
function isValidLinkedInUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const allowedDomains = [
      'linkedin.com',
      'www.linkedin.com',
      'om.linkedin.com', // Oman regional
      'ae.linkedin.com', // UAE regional
      'in.linkedin.com', // India regional
    ];
    return urlObj.protocol === 'https:' &&
           allowedDomains.some(domain => 
             urlObj.hostname === domain || 
             urlObj.hostname.endsWith('.' + domain)
           ) &&
           url.length <= 255;
  } catch {
    return false;
  }
}

function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

function validateApplicationData(data: ApplicationData): { valid: boolean; error?: string } {
  // Name validation
  if (!data.name || data.name.trim().length < 2 || data.name.length > 100) {
    return { valid: false, error: 'Name must be between 2 and 100 characters' };
  }

  // Email validation
  if (!isValidEmail(data.email)) {
    return { valid: false, error: 'Invalid email format or email too long' };
  }

  // Phone validation
  if (!isValidPhone(data.phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }

  // Position validation
  if (!data.position || data.position.trim().length < 2 || data.position.length > 100) {
    return { valid: false, error: 'Position must be between 2 and 100 characters' };
  }

  // Experience validation
  if (!data.experience || data.experience.trim().length < 1 || data.experience.length > 500) {
    return { valid: false, error: 'Experience must be between 1 and 500 characters' };
  }

  // Cover letter validation
  if (!data.coverLetter || data.coverLetter.trim().length < 10 || data.coverLetter.length > 2000) {
    return { valid: false, error: 'Cover letter must be between 10 and 2000 characters' };
  }

  // LinkedIn URL validation (optional but must be valid LinkedIn domain if provided)
  if (data.linkedinUrl && data.linkedinUrl.trim() !== '' && !isValidLinkedInUrl(data.linkedinUrl)) {
    return { valid: false, error: 'LinkedIn URL must be a valid linkedin.com URL' };
  }

  return { valid: true };
}

// Rate limiting function
async function checkRateLimit(supabase: any, email: string): Promise<{ allowed: boolean; error?: string }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Check applications in last hour (max 2)
  const { data: recentApps, error: hourError } = await supabase
    .from('job_applications')
    .select('id')
    .eq('email', email)
    .gte('created_at', oneHourAgo);

  if (hourError) {
    console.error('Rate limit check error (hour):', hourError);
    return { allowed: true }; // Allow on error to avoid blocking legitimate users
  }

  if (recentApps && recentApps.length >= 2) {
    return { allowed: false, error: 'Too many applications. Please wait at least 1 hour before submitting again.' };
  }

  // Check applications in last day (max 3)
  const { data: dailyApps, error: dayError } = await supabase
    .from('job_applications')
    .select('id')
    .eq('email', email)
    .gte('created_at', oneDayAgo);

  if (dayError) {
    console.error('Rate limit check error (day):', dayError);
    return { allowed: true };
  }

  if (dailyApps && dailyApps.length >= 3) {
    return { allowed: false, error: 'Maximum applications per day reached. Please try again tomorrow.' };
  }

  return { allowed: true };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
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
    
    // Extract and sanitize application data
    const applicationData: ApplicationData = {
      name: sanitizeString(formData.get('name') as string || ''),
      email: (formData.get('email') as string || '').trim().toLowerCase(),
      phone: (formData.get('phone') as string || '').trim(),
      position: sanitizeString(formData.get('position') as string || ''),
      experience: sanitizeString(formData.get('experience') as string || ''),
      coverLetter: sanitizeString(formData.get('coverLetter') as string || ''),
      linkedinUrl: (formData.get('linkedinUrl') as string || '').trim() || undefined,
    };

    // Comprehensive validation
    const validation = validateApplicationData(applicationData);
    if (!validation.valid) {
      console.log('Validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const rateLimitCheck = await checkRateLimit(supabase, applicationData.email);
    if (!rateLimitCheck.allowed) {
      console.log('Rate limit exceeded for:', applicationData.email);
      return new Response(
        JSON.stringify({ error: rateLimitCheck.error }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Send email notification asynchronously (fire and forget, don't block response)
    (async () => {
      try {
        const client = new SMTPClient({
          connection: {
            hostname: Deno.env.get("ZOHO_SMTP_HOST") || "smtppro.zoho.com",
            port: parseInt(Deno.env.get("ZOHO_SMTP_PORT") || "465"),
            tls: true,
            auth: {
              username: Deno.env.get("ZOHO_SMTP_USER") || "",
              password: Deno.env.get("ZOHO_SMTP_PASSWORD") || "",
            },
          },
        });

        await client.send({
          from: Deno.env.get("ZOHO_SMTP_USER") || "sales@gcoman.com",
          to: "sales@gcoman.com",
          subject: `New Job Application: ${applicationData.position} - ${applicationData.name}`,
          content: `
New job application received:

Position: ${applicationData.position}
Name: ${applicationData.name}
Email: ${applicationData.email}
Phone: ${applicationData.phone}
Experience: ${applicationData.experience}
LinkedIn: ${applicationData.linkedinUrl || "Not provided"}

Cover Letter:
${applicationData.coverLetter}

Resume: Uploaded to storage at ${filePath}

---
Submitted at: ${new Date().toLocaleString()}
          `,
        });

        await client.close();
        console.log("Email notification sent successfully to sales@gcoman.com");
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    })();

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
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});