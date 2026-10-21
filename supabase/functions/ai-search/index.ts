import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  'https://www.gcoman.com',
  'https://gcoman.com',
  'https://gcoman.lovable.app',
  'https://global-chemicals-llc.lovable.app',
  'https://88275aec-3e28-4007-bd65-43d79fa41e87.lovableproject.com',
];

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get('Origin') || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  // Allow Lovable preview subdomains for this specific project only
  if (origin.endsWith('.lovableproject.com') && origin.includes('88275aec-3e28-4007-bd65-43d79fa41e87')) {
    return origin;
  }
  return 'https://www.gcoman.com';
}

function getCorsHeaders(req: Request) {
  return {
    'Access-Control-Allow-Origin': getCorsOrigin(req),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };
}

// Persistent rate limiter (DB-backed) — shared across all edge function instances.
const RATE_LIMIT_MAX = 10; // requests per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    const windowStart = new Date(Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS).toISOString();
    // Atomic increment via SECURITY DEFINER RPC — prevents race conditions where
    // concurrent requests all read 0 and bypass the limit.
    const { data: count, error } = await supabaseAdmin.rpc("increment_ai_search_rate_limit", {
      p_ip: ip,
      p_window: windowStart,
    });
    if (error) {
      console.error("rate limit rpc failed:", error);
      return false; // Fail-open on infra hiccup
    }

    // Best-effort cleanup of old rows (older than 1 hour) — fire and forget.
    if (Math.random() < 0.05) {
      const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      supabaseAdmin.from("ai_search_rate_limits").delete().lt("window_start", cutoff).then(() => {});
    }

    return (count ?? 0) > RATE_LIMIT_MAX;
  } catch (err) {
    console.error("rate limit check failed:", err);
    return false;
  }
}


const COMPANY_CONTEXT = `You are an AI search assistant for Global Chemicals LLC (gcoman.com), a leading chemical supplier in Oman (Muscat).

COMPANY INFO:
- Full name: Global Chemicals LLC
- Location: Ghala, Muscat, Oman (also serves Sohar, Salalah, Duqm, Rusayl; exports across the GCC)
- 10+ years in business, 200+ clients, 270 products across 22 categories
- Certifications: ISO 9001:2015 certified, JSRS registered (Oman oil & gas), ICV compliant. Do NOT claim any other certification.
- Authorized distributor of Shell, Mobil, Castrol, and GP (IPOL) lubricants
- Email: sales@gcoman.com, Phone/WhatsApp: +968 9277 2305
- Hours: Sunday-Thursday 08:00-18:00 Gulf time

PRODUCT CATEGORIES (22 categories, 270 products):
- Water Treatment Chemicals: PAC, Calcium Hypochlorite, Sodium Hypochlorite, Caustic Soda, Ferric Chloride, Antiscalants, Activated Carbon, Alum, Polyelectrolyte, etc.
- Oilfield & Refinery: Demulsifiers, Corrosion Inhibitors, H2S Scavengers, Scale Inhibitors, Drilling Chemicals, Biocides
- Lubricants & Greases: Shell Tellus, Mobil DTE, Castrol Hyspin, Hydraulic Oils, Gear Oils, Compressor Oils, Turbine Oils
- RO Chemicals: Antiscalants, Membrane Cleaners, Sodium Bisulfite, Biocides for RO
- Cooling Water Chemicals: Scale Inhibitors, Corrosion Inhibitors, Biocides, Dispersants
- Swimming Pool Chemicals: TCCA, Calcium Hypochlorite, pH Plus/Minus, Algaecides, Clarifiers
- Construction Chemicals: Admixtures, Curing Compounds, Waterproofing, Grout
- Food & Beverage: Food-grade chemicals, Citric Acid, Phosphoric Acid
- Lab Equipment & Chemicals: Glassware, Reagents, Analytical Instruments
- Solvents, Inorganic Chemicals, Glycols, Alcohols, Ethanolamines, Agro Products, etc.

INDUSTRIES SERVED:
Oil & Gas, Water Treatment Plants, Desalination, Manufacturing, Construction, Food & Beverage, Swimming Pools, Pharmaceuticals, Agriculture

SERVICES:
- Chemical supply & distribution
- Technical consultation
- Custom chemical blending
- Emergency deliveries
- On-site testing and support

PAGES: Home(/), About(/about), Products(/products), Industries(/industries), Resources(/resources), Contact(/contact), Customers(/customers), Career(/career), Certifications(/certifications), Delivery locations(/chemicals), Blog(/blog)

INSTRUCTIONS:
- Answer in the SAME LANGUAGE the user writes in (Arabic, English, Hindi, etc.)
- Be concise and helpful. If asked about a product, mention if we supply it.
- Provide relevant page links when applicable (e.g., /products, /contact)
- For pricing inquiries, direct to contact page or sales@gcoman.com
- Keep responses under 200 words
- If unsure, suggest contacting sales@gcoman.com`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP. Prefer non-spoofable Cloudflare header, then fall back
    // to the LAST X-Forwarded-For value (infrastructure-appended real IP).
    const ip = req.headers.get('cf-connecting-ip') ||
               req.headers.get('x-real-ip') ||
               req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ||
               'unknown';
    if (await isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { query, turnstileToken } = await req.json();

    // Bot check: required whenever TURNSTILE_SECRET_KEY is configured.
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (turnstileSecret) {
      let ok = false;
      if (typeof turnstileToken === "string" && turnstileToken.length > 0 && turnstileToken.length < 4096) {
        try {
          const form = new FormData();
          form.append("secret", turnstileSecret);
          form.append("response", turnstileToken);
          if (ip !== "unknown") form.append("remoteip", ip);
          const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
          ok = Boolean((await res.json()).success);
        } catch (err) {
          console.error("Turnstile verify error:", err);
        }
      }
      if (!ok) {
        return new Response(
          JSON.stringify({ error: "Security check failed. Please try again." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please enter a search query." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (query.trim().length > 500) {
      return new Response(
        JSON.stringify({ error: "Query too long. Please keep it under 500 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("Service configuration error");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        max_tokens: 500, // prompt asks for <200 words; cap the spend if the model ignores it
        messages: [
          { role: "system", content: COMPANY_CONTEXT },
          { role: "user", content: query },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      throw new Error("Search service unavailable");
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Sorry, I couldn't find an answer.";

    return new Response(
      JSON.stringify({ answer }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("ai-search error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
