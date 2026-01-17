import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Allowed origins whitelist
const ALLOWED_ORIGINS = [
  'https://www.gcoman.com',
  'https://gcoman.com',
  'https://gcoman.lovable.app',
  'https://global-chemicals-llc.lovable.app',
  'https://88275aec-3e28-4007-bd65-43d79fa41e87.lovableproject.com',
  'http://localhost:5173',
  'http://localhost:8080',
];

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get('Origin') || '';
  // Also allow Lovable preview URLs
  if (origin.includes('lovable.app') || origin.includes('lovableproject.com')) {
    return origin;
  }
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

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  record.count++;
  return false;
}

// Email validation
function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const sanitized = email.trim().toLowerCase().slice(0, 255);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : null;
}

// Get client IP from request headers
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('x-real-ip') ||
         req.headers.get('cf-connecting-ip') ||
         'unknown';
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const clientIP = getClientIP(req);
    console.log(`[Newsletter] Subscription request from IP: ${clientIP}`);

    // Rate limiting check
    if (isRateLimited(clientIP)) {
      console.warn(`[Newsletter] Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    let body: { email?: unknown };
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email
    const email = validateEmail(body.email);
    if (!email) {
      console.warn(`[Newsletter] Invalid email provided`);
      return new Response(
        JSON.stringify({ success: false, error: "Please enter a valid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Newsletter] Processing subscription for: ${email}`);

    // Initialize Supabase client with service role key for insert
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Newsletter] Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('[Newsletter] Error checking existing subscriber:', checkError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to process subscription" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        console.log(`[Newsletter] Email already subscribed: ${email}`);
        return new Response(
          JSON.stringify({ success: true, message: "You're already subscribed to our newsletter!" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ 
            is_active: true, 
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id);

        if (updateError) {
          console.error('[Newsletter] Error reactivating subscription:', updateError);
          return new Response(
            JSON.stringify({ success: false, error: "Failed to reactivate subscription" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`[Newsletter] Subscription reactivated for: ${email}`);
        return new Response(
          JSON.stringify({ success: true, message: "Welcome back! Your subscription has been reactivated." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        ip_address: clientIP,
        source: 'website_footer',
      });

    if (insertError) {
      console.error('[Newsletter] Error inserting subscriber:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to subscribe. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Newsletter] Successfully subscribed: ${email}`);
    return new Response(
      JSON.stringify({ success: true, message: "Thank you for subscribing to our newsletter!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('[Newsletter] Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
