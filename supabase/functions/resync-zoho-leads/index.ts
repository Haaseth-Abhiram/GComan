// Admin-only backfill for contact submissions that never reached Zoho CRM.
//
// Why this exists: until 2026-09-22 the CRM push was fire-and-forget without
// EdgeRuntime.waitUntil (so the isolate could be torn down mid-push) and
// submit-contact had no failure branch (so nothing was recorded when it did
// fail). Both are fixed going forward, but the rows that were already lost
// still show "Pending" in the admin table and were never created as Leads.
//
// Safety properties, in order of importance:
//   * DRY RUN BY DEFAULT. Nothing is written to Zoho unless the caller passes
//     { execute: true }. The dry run returns exactly what would be pushed and
//     what would be skipped, so the list can be reviewed first.
//   * IDEMPOTENT. Rows that already carry a zoho_lead_id are always skipped,
//     so re-running can never create a duplicate Lead from this function.
//   * TEST/INTERNAL/SPAM ROWS ARE EXCLUDED. The table contains integration
//     tests, internal @gcoman.com submissions and SEO spam. Pushing those into
//     a production CRM is worse than leaving them Pending, so they are
//     filtered out and reported separately rather than silently dropped.
//   * Failures are recorded (zoho_error) exactly like the live path.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createZohoLead, splitName } from "../_shared/zoho-crm.ts";

const ALLOWED_ORIGINS = [
  "https://www.gcoman.com",
  "https://gcoman.com",
  "https://gcoman.lovable.app",
  "https://global-chemicals-llc.lovable.app",
];

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get("Origin") || "";
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com")) return origin;
    if (host === "localhost" || host === "127.0.0.1") return origin;
  } catch (_) { /* ignore */ }
  return ALLOWED_ORIGINS.includes(origin) ? origin : "https://www.gcoman.com";
}

function corsHeadersFor(req: Request) {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(req),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

interface Submission {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string | null;
  zoho_lead_id: string | null;
  synced_to_zoho: boolean | null;
}

/**
 * Classify a row we are considering pushing. Returning a reason means "do not
 * push"; null means it is a genuine business enquiry.
 */
function excludeReason(s: Submission): string | null {
  const email = (s.email || "").toLowerCase().trim();
  const name = (s.name || "").toLowerCase();
  const company = (s.company || "").toLowerCase();
  const subject = (s.subject || "").toLowerCase();

  if (!email || !email.includes("@")) return "no usable email";

  // Integration/diagnostic rows created while wiring the CRM up.
  if (/@example\.com$/.test(email)) return "test row (example.com)";
  if (/^(zoho|claude|integration|audit)[-.]?test/.test(email)) return "test row (test address)";
  if (/\b(test|diagnostic)\b/.test(name)) return "test row (name)";
  if (/\b(test|audit)\b/.test(company)) return "test row (company)";
  if (/zoho (crm )?integration|functionality test|diagnostic/.test(subject)) return "test row (subject)";

  // Our own staff submitting through the public form.
  if (/@gcoman\.com$/.test(email)) return "internal (gcoman.com address)";

  // Outbound marketing pitched AT us — not inbound demand.
  if (/jmailservice\.com$/.test(email)) return "spam domain";
  if (/drive more traffic|leads & sales for your business|seo/i.test(company)) return "marketing spam";

  return null;
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Admin-only — same gate as the search-console proxy.
  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData } = await userClient.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: uid, _role: "admin" });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Admin role required" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const execute: boolean = body?.execute === true;
    const limit: number = Math.min(Math.max(Number(body?.limit) || 50, 1), 200);
    // Optional allow-list of ids, so a reviewer can push a chosen subset.
    const onlyIds: string[] | null = Array.isArray(body?.ids) && body.ids.length ? body.ids : null;

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: rows, error } = await admin
      .from("contact_submissions")
      .select("id, created_at, name, email, phone, company, subject, message, zoho_lead_id, synced_to_zoho")
      .or("synced_to_zoho.is.null,synced_to_zoho.eq.false")
      .is("zoho_lead_id", null) // idempotency: never touch a row that already has a Lead
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    const all = (rows ?? []) as Submission[];
    const skipped: Array<{ id: string; created_at: string; company: string | null; reason: string }> = [];
    let candidates: Submission[] = [];

    for (const s of all) {
      const reason = excludeReason(s);
      if (reason) {
        skipped.push({ id: s.id, created_at: s.created_at, company: s.company, reason });
        continue;
      }
      candidates.push(s);
    }

    if (onlyIds) candidates = candidates.filter((c) => onlyIds.includes(c.id));
    const batch = candidates.slice(0, limit);

    if (!execute) {
      return new Response(
        JSON.stringify({
          dryRun: true,
          totalUnsynced: all.length,
          wouldPush: batch.length,
          remainingAfterBatch: Math.max(candidates.length - batch.length, 0),
          skipped,
          preview: batch.map((s) => ({
            id: s.id,
            created_at: s.created_at,
            name: s.name,
            email: s.email,
            company: s.company,
            subject: s.subject,
          })),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const pushed: Array<{ id: string; leadId: string; company: string | null }> = [];
    const failed: Array<{ id: string; company: string | null; error: string }> = [];

    for (const s of batch) {
      const { first, last } = splitName(s.name || s.email || "Unknown");
      const result = await createZohoLead({
        Last_Name: last,
        First_Name: first,
        Email: s.email!,
        Phone: s.phone || undefined,
        Company: s.company || "Website Contact",
        Lead_Source: "Website - Contact Form",
        Title: s.subject || undefined,
        // Keep the original submission date visible in the CRM: these are
        // backfilled records, not new enquiries, and a salesperson opening a
        // months-old Lead needs to know that immediately.
        Description: `[Backfilled ${new Date().toISOString().slice(0, 10)} — originally submitted ${s.created_at.slice(0, 10)}]\n\n${s.message || ""}`,
      });

      if (result.success && result.leadId) {
        await admin
          .from("contact_submissions")
          .update({
            zoho_lead_id: result.leadId,
            synced_to_zoho: true,
            zoho_synced_at: new Date().toISOString(),
            zoho_error: null,
          })
          .eq("id", s.id);
        pushed.push({ id: s.id, leadId: result.leadId, company: s.company });
      } else {
        const message = (result.error ?? "Unknown Zoho error").slice(0, 2000);
        await admin.from("contact_submissions").update({ zoho_error: message }).eq("id", s.id);
        failed.push({ id: s.id, company: s.company, error: message });
      }

      // Zoho's API is rate limited; keep the backfill gentle.
      await new Promise((r) => setTimeout(r, 400));
    }

    return new Response(
      JSON.stringify({
        dryRun: false,
        attempted: batch.length,
        pushedCount: pushed.length,
        failedCount: failed.length,
        remaining: Math.max(candidates.length - batch.length, 0),
        pushed,
        failed,
        skipped,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("resync-zoho-leads error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
