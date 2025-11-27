import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, country, industry, resourceTitle, marketingConsent } = await req.json();

    console.log("Sending download notification email for:", resourceTitle);

    // Send email notification
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
Phone: ${phone}
Company: ${company}
Country: ${country}
Industry: ${industry || "Not provided"}
Marketing Consent: ${marketingConsent ? "Yes" : "No"}

---
Downloaded at: ${new Date().toLocaleString()}
      `,
    });

    await client.close();
    console.log("Download notification email sent successfully to sales@gcoman.com");

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error sending download notification:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
