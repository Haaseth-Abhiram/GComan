import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createZohoLead, splitName } from "../_shared/zoho-crm.ts";

// Allowed origins whitelist - prevents wildcard CORS misconfiguration
const ALLOWED_ORIGINS = [
  'https://www.gcoman.com',
  'https://gcoman.com',
  'https://gcoman.lovable.app',
  'https://global-chemicals-llc.lovable.app',
  'https://88275aec-3e28-4007-bd65-43d79fa41e87.lovableproject.com',
];

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get('Origin') || '';
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  // Allow all lovable.app subdomains (preview URLs)
  if (origin.endsWith('.lovable.app')) return origin;
  return 'https://www.gcoman.com';
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

// Sanitize input by removing HTML/script tags
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[\r\n]+/g, ' ') // CRLF in the subject would allow SMTP header injection
    .trim();
}

// Sanitize multi-line fields (message body): strips HTML/scripts but preserves
// line breaks so quote templates stay readable in email and CRM. Newlines are
// safe here — the body is never used in SMTP headers.
function sanitizeMultilineInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Cloudflare Turnstile verification.
// Returns true if no secret is configured (graceful no-op while wiring is shipped
// before a key is provisioned), else verifies the token against Cloudflare's API.
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
    if (!json.success) {
      console.warn('Turnstile verify failed:', json['error-codes']);
    }
    return Boolean(json.success);
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return false;
  }
}

// Rate limiting check
async function checkRateLimit(supabase: any, ipAddress: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id')
    .eq('ip_address', ipAddress)
    .gte('created_at', oneHourAgo);

  if (error) {
    console.error('Rate limit check error:', error);
    return false;
  }

  // Max 5 submissions per IP per hour
  return (data?.length || 0) < 5;
}

// Send email notification (DB already has email_sent=true optimistically)
async function sendEmailNotification(
  supabase: any,
  submissionId: string,
  sanitizedData: any,
  ipAddress: string
): Promise<void> {
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
      subject: `New Contact Form Submission: ${sanitizedData.subject}`,
      content: `
New contact form submission received:

Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone || "Not provided"}
Company: ${sanitizedData.company || "Not provided"}
Subject: ${sanitizedData.subject}

Message:
${sanitizedData.message}

---
Submitted at: ${new Date().toLocaleString()}
IP Address: ${ipAddress}
      `,
    });

    console.log("Email notification sent successfully to sales@gcoman.com");

    // Don't await close - it can hang and cause CPU timeout
    try { await client.close(); } catch (e) { console.warn("SMTP close warning:", e); }
  } catch (emailError: unknown) {
    console.error("Failed to send email notification:", emailError);
    
    // Revert optimistic status on failure
    const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error';
    await supabase
      .from('contact_submissions')
      .update({ 
        email_sent: false, 
        email_sent_at: null,
        email_error: errorMessage
      })
      .eq('id', submissionId);
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP address. Prefer non-spoofable Cloudflare header, then fall
    // back to the LAST X-Forwarded-For value (infrastructure-appended real IP).
    const ipAddress = req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
      || 'unknown';

    console.log('Contact form submission from IP:', ipAddress);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check rate limit
    const withinRateLimit = await checkRateLimit(supabase, ipAddress);
    if (!withinRateLimit) {
      console.log('Rate limit exceeded for IP:', ipAddress);
      return new Response(
        JSON.stringify({ 
          error: 'Too many submissions. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const { name, email, phone, company, subject, message, turnstileToken } = body;

    // Verify Turnstile (early reject before doing any work)
    const captchaOk = await verifyTurnstile(turnstileToken, ipAddress);
    if (!captchaOk) {
      console.log('Turnstile verification failed for IP:', ipAddress);
      return new Response(
        JSON.stringify({
          error: 'Captcha verification failed. Please refresh and try again.',
          code: 'CAPTCHA_FAILED',
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Server-side validation
    const errors: string[] = [];

    // Validate name
    if (!name || typeof name !== 'string') {
      errors.push('Name is required');
    } else if (sanitizeInput(name).length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (sanitizeInput(name).length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
    } else if (!isValidEmail(email)) {
      errors.push('Invalid email format');
    } else if (email.length > 255) {
      errors.push('Email must be less than 255 characters');
    }

    // Validate phone (optional)
    if (phone && typeof phone === 'string' && phone.length > 20) {
      errors.push('Phone number must be less than 20 characters');
    }

    // Validate company (optional)
    if (company && typeof company === 'string' && sanitizeInput(company).length > 100) {
      errors.push('Company name must be less than 100 characters');
    }

    // Validate subject
    if (!subject || typeof subject !== 'string' || subject.length === 0) {
      errors.push('Subject is required');
    } else if (sanitizeInput(subject).length > 200) {
      errors.push('Subject must be less than 200 characters');
    }

    // Validate message
    if (!message || typeof message !== 'string') {
      errors.push('Message is required');
    } else if (sanitizeInput(message).length < 10) {
      errors.push('Message must be at least 10 characters');
    } else if (sanitizeInput(message).length > 5000) {
      errors.push('Message must be less than 5000 characters');
    }

    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return new Response(
        JSON.stringify({ 
          error: errors.join(', '),
          code: 'VALIDATION_ERROR'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: email.trim().toLowerCase(),
      phone: phone ? sanitizeInput(phone) : null,
      company: company ? sanitizeInput(company) : null,
      subject: sanitizeInput(subject),
      message: sanitizeMultilineInput(message),
      ip_address: ipAddress,
      email_sent: true,
      email_sent_at: new Date().toISOString(),
    };

    console.log('Inserting contact submission:', { ...sanitizedData, ip_address: '[REDACTED]' });

    // Insert into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to submit contact form. Please try again.',
          code: 'DATABASE_ERROR'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Contact submission successful:', data.id);

    // Fire email notification in the background — do NOT await it.
    // Awaiting it caused SMTP timeouts to propagate as a failed response even
    // though the DB insert had already succeeded and the email was delivered.
    sendEmailNotification(supabase, data.id, sanitizedData, ipAddress).catch(
      (err) => console.error('Background email notification error:', err)
    );

    // Push to Zoho CRM in background (fire-and-forget)
    (async () => {
      const { first, last } = splitName(sanitizedData.name);
      const result = await createZohoLead({
        Last_Name: last,
        First_Name: first,
        Email: sanitizedData.email,
        Phone: sanitizedData.phone || undefined,
        Company: sanitizedData.company || 'Website Contact',
        Lead_Source: 'Website - Contact Form',
        Title: sanitizedData.subject,
        Description: sanitizedData.message,
      });
      if (result.success && result.leadId) {
        await supabase
          .from('contact_submissions')
          .update({ zoho_lead_id: result.leadId, synced_to_zoho: true })
          .eq('id', data.id);
      }
    })().catch((err) => console.error('Zoho push error:', err));

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
        id: data.id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in submit-contact function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR'
      }),
      { 
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
      }
    );
  }
});