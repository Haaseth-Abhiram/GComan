import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { isRateLimited, getClientIp } from "../_shared/rate-limit.ts";

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
  const phoneRegex = /^[\d\s+\-()]+$/;
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
  // CRLF in values that reach the email subject would allow header injection
  return str.replace(/[\r\n]+/g, ' ').trim().replace(/[<>]/g, '');
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

// Cloudflare Turnstile verification (no-op if secret not configured)
async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) return true;
  if (!token) return false;
  try {
    const form = new FormData();
    form.append('secret', secret);
    form.append('response', token);
    if (ip && ip !== 'unknown') form.append('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const json = await res.json();
    if (!json.success) console.warn('Turnstile verify failed:', json['error-codes']);
    return Boolean(json.success);
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return false;
  }
}

// IP extraction and the durable per-IP rate limiter live in
// ../_shared/rate-limit.ts (the previous in-memory Map reset on cold starts).

// Server-side file-type validation via magic-byte inspection. The client-supplied
// MIME type (resumeFile.type) is trivially forgeable in a raw multipart request,
// so we sniff the actual file signature instead.
function detectFileType(bytes: Uint8Array): 'pdf' | 'doc' | 'docx' | null {
  if (bytes.length < 8) return null;
  // PDF: "%PDF"
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'pdf';
  }
  // DOCX (ZIP-based OOXML): "PK\x03\x04"
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return 'docx';
  }
  // Legacy DOC (OLE Compound File): D0 CF 11 E0 A1 B1 1A E1
  if (
    bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0 &&
    bytes[4] === 0xa1 && bytes[5] === 0xb1 && bytes[6] === 0x1a && bytes[7] === 0xe1
  ) {
    return 'doc';
  }
  return null;
}
const IP_RATE_LIMIT_MAX = 3;
const IP_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
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

    const ipAddress = getClientIp(req);

    // IP-based rate limiting (defence against rotating-email abuse)
    if (await isRateLimited(supabase, 'submit-job-application', ipAddress, IP_RATE_LIMIT_MAX, IP_RATE_LIMIT_WINDOW_MS)) {
      console.log('IP rate limit exceeded:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'Too many applications from your network. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse multipart form data
    const formData = await req.formData();

    // Verify Cloudflare Turnstile (no-op if TURNSTILE_SECRET_KEY not set)
    const turnstileToken = (formData.get('turnstileToken') as string | null) || undefined;
    const captchaOk = await verifyTurnstile(turnstileToken, ipAddress);
    if (!captchaOk) {
      return new Response(
        JSON.stringify({ error: 'Captcha verification failed. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
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

    // Validate file size first (cheap check before buffering)
    if (resumeFile.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 5MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read the buffer and validate real file type via magic bytes.
    // The client-supplied resumeFile.type is forgeable, so we sniff the signature.
    const fileBuffer = await resumeFile.arrayBuffer();
    const sniffed = detectFileType(new Uint8Array(fileBuffer, 0, Math.min(16, fileBuffer.byteLength)));
    if (!sniffed) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only PDF, DOC, and DOCX are allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cross-check the sniffed type against the declared MIME to reject mismatches
    // (e.g. an .exe uploaded with Content-Type: application/pdf).
    const mimeToSniff: Record<string, 'pdf' | 'doc' | 'docx'> = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    };
    const expected = mimeToSniff[resumeFile.type];
    if (!expected || expected !== sniffed) {
      return new Response(
        JSON.stringify({ error: 'File contents do not match declared type. Only genuine PDF, DOC, or DOCX files are allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize the stored content-type to the sniffed value (defence-in-depth).
    const safeContentType =
      sniffed === 'pdf' ? 'application/pdf' :
      sniffed === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
      'application/msword';

    // Organize resumes by position and month for HR: {position-slug}/{YYYY-MM}/{timestamp}-{applicant}-{filename}
    const sanitizedFileName = resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const positionSlug = (applicationData.position || 'general')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60) || 'general';
    const applicantSlug = applicationData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40);
    const now = new Date();
    const yearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const timestamp = now.getTime();
    const filePath = `${positionSlug}/${yearMonth}/${timestamp}-${applicantSlug}-${sanitizedFileName}`;

    // Upload resume to storage with the sniffed content-type (not the client-supplied one).
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, fileBuffer, {
        contentType: safeContentType,
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

        // Convert resume to base64 for email attachment
        const resumeBytes = new Uint8Array(fileBuffer);
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < resumeBytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(
            null,
            Array.from(resumeBytes.subarray(i, i + chunkSize)) as any
          );
        }
        const resumeBase64 = btoa(binary);

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

Resume: Attached (also stored at ${filePath})

---
Submitted at: ${new Date().toLocaleString()}
          `,
          attachments: [
            {
              filename: sanitizedFileName,
              content: resumeBase64,
              encoding: "base64",
              contentType: safeContentType,
            },
          ],
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