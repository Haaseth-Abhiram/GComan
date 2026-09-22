import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { createZohoLead } from "../_shared/zoho-crm.ts";
import { isRateLimited, getClientIp } from "../_shared/rate-limit.ts";

// Allowed origins whitelist
const ALLOWED_ORIGINS = [
  'https://www.gcoman.com',
  'https://gcoman.com',
  'https://gcoman.lovable.app',
  'https://global-chemicals-llc.lovable.app',
  'https://88275aec-3e28-4007-bd65-43d79fa41e87.lovableproject.com',
];

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get('Origin') || '';
  // Also allow Lovable preview URLs (strict suffix match to prevent spoofing)
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith('.lovable.app') || host.endsWith('.lovableproject.com')) {
      return origin;
    }
  } catch (_) {
    // fall through
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

// Rate limiting is DB-backed via ../_shared/rate-limit.ts — the previous
// in-memory Map reset on every cold start and wasn't shared across isolates.
const RATE_LIMIT_MAX = 5; // Max requests per minute per IP

// Email validation
function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const sanitized = email.trim().toLowerCase().slice(0, 255);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : null;
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
    // Initialize Supabase client with service role key (also used by the
    // durable rate limiter below)
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

    const clientIP = getClientIp(req);

    // Rate limiting check (durable, per-IP)
    if (await isRateLimited(supabase, "subscribe-newsletter", clientIP, RATE_LIMIT_MAX)) {
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
    const { data: newSub, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        ip_address: clientIP,
        source: 'website_footer',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[Newsletter] Error inserting subscriber:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to subscribe. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Newsletter] Successfully subscribed: ${email}`);

    // Push to Zoho CRM in the background.
    const zohoTask = (async () => {
      const result = await createZohoLead({
        Last_Name: email.split('@')[0],
        Email: email,
        Company: 'Newsletter Subscriber',
        Lead_Source: 'Website - Newsletter',
        Description: 'Subscribed to newsletter via website footer',
      });
      if (result.success && result.leadId && newSub?.id) {
        await supabase
          .from('newsletter_subscribers')
          .update({ zoho_lead_id: result.leadId, synced_to_zoho: true })
          .eq('id', newSub.id);
      } else if (!result.success) {
        // newsletter_subscribers has no zoho_error column, so log it rather
        // than swallowing the failure silently.
        console.error('[Newsletter] Zoho lead creation failed:', result.error);
      }
    })().catch((err) => console.error('[Newsletter] Zoho push error:', err));

    // Keep the isolate alive until the CRM push settles — otherwise the
    // runtime can terminate it as soon as the response returns.
    const background = Promise.allSettled([zohoTask]);
    // @ts-expect-error EdgeRuntime is provided by the Supabase edge runtime
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
      // @ts-expect-error see above
      EdgeRuntime.waitUntil(background);
    }

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
