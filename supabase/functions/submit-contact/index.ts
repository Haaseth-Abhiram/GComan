import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sanitize input by removing HTML/script tags
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP address
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
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
    const { name, email, phone, company, subject, message } = body;

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
      message: sanitizeInput(message),
      ip_address: ipAddress,
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});