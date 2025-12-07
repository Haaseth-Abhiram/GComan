import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get('ALLOWED_ORIGIN') || 'https://www.gcoman.com',
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window

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

// Input validation helpers
function sanitizeString(input: unknown, maxLength: number = 200): string {
  if (typeof input !== 'string') return '';
  // Remove potential HTML/script injection and trim
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"'&]/g, '') // Remove special chars that could be used for injection
    .trim()
    .slice(0, maxLength);
}

function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const sanitized = email.trim().toLowerCase().slice(0, 255);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : null;
}

function validatePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  // Allow only digits, spaces, plus, hyphens, parentheses
  return phone.replace(/[^\d\s+\-()]/g, '').trim().slice(0, 20);
}

interface DownloadNotificationInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  industry: string;
  resourceTitle: string;
  marketingConsent: boolean;
}

function validateInput(data: unknown): { valid: true; data: DownloadNotificationInput } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const input = data as Record<string, unknown>;

  // Validate required fields
  const email = validateEmail(input.email);
  if (!email) {
    return { valid: false, error: 'Invalid email address' };
  }

  const name = sanitizeString(input.name, 100);
  if (!name || name.length < 2) {
    return { valid: false, error: 'Name is required (min 2 characters)' };
  }

  const phone = validatePhone(input.phone);
  if (!phone || phone.length < 8) {
    return { valid: false, error: 'Valid phone number is required' };
  }

  const company = sanitizeString(input.company, 150);
  if (!company || company.length < 2) {
    return { valid: false, error: 'Company name is required' };
  }

  const country = sanitizeString(input.country, 100);
  if (!country || country.length < 2) {
    return { valid: false, error: 'Country is required' };
  }

  const resourceTitle = sanitizeString(input.resourceTitle, 200);
  if (!resourceTitle) {
    return { valid: false, error: 'Resource title is required' };
  }

  return {
    valid: true,
    data: {
      name,
      email,
      phone,
      company,
      country,
      industry: sanitizeString(input.industry, 100),
      resourceTitle,
      marketingConsent: input.marketingConsent === true,
    }
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    // Check rate limit
    if (isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429 
        }
      );
    }

    // Parse and validate input
    let rawData: unknown;
    try {
      rawData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    const validation = validateInput(rawData);
    if (!validation.valid) {
      console.warn(`Validation failed: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    const { name, email, phone, company, country, industry, resourceTitle, marketingConsent } = validation.data;

    console.log("Processing download lead for:", resourceTitle);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert lead into database
    const { data: leadData, error: dbError } = await supabase
      .from('download_leads')
      .insert({
        name,
        email,
        phone,
        company,
        country,
        industry: industry || null,
        marketing_consent: marketingConsent,
        resource_title: resourceTitle
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save your information. Please try again.' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    console.log("Download lead saved successfully:", leadData.id);

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
          subject: `New Brochure Download: ${resourceTitle}`,
          content: `
New brochure/resource download:

Resource: ${resourceTitle}
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Company: ${company || "Not provided"}
Country: ${country || "Not provided"}
Industry: ${industry || "Not provided"}
Marketing Consent: ${marketingConsent ? "Yes" : "No"}

---
Downloaded at: ${new Date().toLocaleString()}
        `,
        });

        await client.close();
        console.log("Download notification email sent successfully to sales@gcoman.com");
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    })();

    return new Response(
      JSON.stringify({ success: true, message: "Lead saved successfully", id: leadData.id }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing download lead:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
