// Weekly Google Search Console check for Arabic (/ar/*) URLs.
// Inspects every /ar/ URL in the sitemap, stores the current verdict in
// ar_index_status, and logs a row in ar_index_events whenever a URL's
// coverage state changes (especially "Discovered - not indexed" -> Indexed).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ALLOWED_ORIGINS = [
  "https://www.gcoman.com",
  "https://gcoman.com",
  "https://gcoman.lovable.app",
  "https://global-chemicals-llc.lovable.app",
  "https://88275aec-3e28-4007-bd65-43d79fa41e87.lovableproject.com",
];

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get("Origin") || "";
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com")) {
      return origin;
    }
  } catch (_) { /* ignore */ }
  return ALLOWED_ORIGINS.includes(origin) ? origin : "https://www.gcoman.com";
}

function getCorsHeaders(req: Request) {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(req),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITEMAP_URL = "https://gcoman.com/sitemap.xml";

async function gsc(path: string, init: RequestInit = {}) {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const gscKey = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!gscKey) throw new Error("GOOGLE_SEARCH_CONSOLE_API_KEY is not configured");

  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gscKey,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`GSC request failed [${res.status}] ${path}: ${text}`);
    throw new Error(`[${res.status}] ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

async function urlsFromSitemap(scope: "all" | "ar" = "all"): Promise<string[]> {
  const res = await fetch(SITEMAP_URL, { headers: { "User-Agent": "gcoman-index-monitor" } });
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);
  const filtered = scope === "ar"
    ? locs.filter((u) => /^https:\/\/gcoman\.com\/ar(\/|$)/.test(u))
    : locs.filter((u) => /^https:\/\/gcoman\.com\//.test(u));
  return [...new Set(filtered)];
}


Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  // Allow either the internal cron secret path (service role JWT / cron header)
  // or an authenticated admin triggering a manual re-check from the dashboard.
  const authHeader = req.headers.get("Authorization") ?? "";
  const cronKey = Deno.env.get("AR_INDEX_CRON_KEY");
  const isCron = !!cronKey && req.headers.get("x-cron-key") === cronKey;
  if (!isCron) {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: uid, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  try {
    // Resolve a verified property from the connected account.
    const sites = await gsc("/webmasters/v3/sites");
    const entries: Array<{ siteUrl: string; permissionLevel?: string }> = sites.siteEntry ?? [];
    const pick =
      entries.find((e) => e.siteUrl === "https://gcoman.com/") ??
      entries.find((e) => e.siteUrl === "sc-domain:gcoman.com") ??
      entries[0];
    if (!pick) throw new Error("No verified Search Console properties available on this connection");
    const siteUrl = pick.siteUrl;

    const scope = ((await req.json().catch(() => ({})))?.scope === "ar" ? "ar" : "all") as "ar" | "all";
    const allUrls = await urlsFromSitemap(scope);

    const { data: existingRows } = await admin
      .from("ar_index_status")
      .select("url, coverage_state, is_indexed, last_checked_at");
    const existing = new Map((existingRows ?? []).map((r: any) => [r.url, r]));

    // Only inspect URLs not already checked in the last 12 hours, and cap the
    // batch so a single invocation stays well inside the edge runtime limit.
    const staleBefore = Date.now() - 12 * 60 * 60 * 1000;
    const pending = allUrls.filter((u) => {
      const prev: any = existing.get(u);
      return !prev?.last_checked_at || new Date(prev.last_checked_at).getTime() < staleBefore;
    });
    const BATCH = 30;
    const DEADLINE = Date.now() + 100_000; // stop early so the isolate can chain
    const urls = pending.slice(0, BATCH);
    const remaining = Math.max(pending.length - urls.length, 0);



    const now = new Date().toISOString();
    let checked = 0, indexed = 0, failed = 0;
    const newlyIndexed: string[] = [];
    const events: any[] = [];

    let processed = 0;
    for (const url of urls) {
      if (Date.now() > DEADLINE) break;
      processed++;

      try {
        const result = await gsc("/v1/urlInspection/index:inspect", {
          method: "POST",
          body: JSON.stringify({ inspectionUrl: url, siteUrl }),
        });
        const idx = result?.inspectionResult?.indexStatusResult ?? {};
        const coverage: string | null = idx.coverageState ?? null;
        const verdict: string | null = idx.verdict ?? null;
        const isIndexed = verdict === "PASS" && !!coverage && /submitted and indexed|indexed, not submitted/i.test(coverage);

        const prev = existing.get(url);
        const changed = !!prev && prev.coverage_state !== coverage;
        const justIndexed = isIndexed && (!prev || !prev.is_indexed);

        await admin.from("ar_index_status").upsert({
          url,
          verdict,
          coverage_state: coverage,
          indexing_state: idx.indexingState ?? null,
          google_canonical: idx.googleCanonical ?? null,
          user_canonical: idx.userCanonical ?? null,
          last_crawl_time: idx.lastCrawlTime ?? null,
          is_indexed: isIndexed,
          previous_coverage_state: prev ? prev.coverage_state : null,
          state_changed_at: changed || justIndexed ? now : undefined,
          last_checked_at: now,
          error: null,
        }, { onConflict: "url" });

        if (changed || justIndexed) {
          events.push({
            url,
            from_state: prev?.coverage_state ?? null,
            to_state: coverage,
            became_indexed: justIndexed,
          });
        }
        if (justIndexed) newlyIndexed.push(url);
        if (isIndexed) indexed++;
        checked++;
      } catch (e) {
        failed++;
        console.error(`Inspection failed for ${url}:`, (e as Error).message);
        await admin.from("ar_index_status").upsert({
          url,
          last_checked_at: now,
          error: (e as Error).message.slice(0, 500),
        }, { onConflict: "url" });
      }
      // Stay well under Search Console's per-minute inspection quota.
      await new Promise((r) => setTimeout(r, 150));
    }

    if (events.length) await admin.from("ar_index_events").insert(events);

    // Continue the sweep in a follow-up invocation when URLs remain.
    const stillRemaining = Math.max(pending.length - processed, 0);
    if (stillRemaining > 0 && cronKey) {
      const chain = fetch(`${supabaseUrl}/functions/v1/check-ar-indexing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          "x-cron-key": cronKey,
        },
        body: JSON.stringify({ source: "chain" }),
      }).catch((err) => console.error("Chain invocation failed:", err));
      // Keep the isolate alive until the follow-up request is actually sent.
      // @ts-expect-error EdgeRuntime is provided by the Supabase edge runtime
      if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) EdgeRuntime.waitUntil(chain);
      else await chain;
    }

    const summary = { siteUrl, total: allUrls.length, checked, indexed, failed, remaining: stillRemaining, newlyIndexed };

    console.log("AR indexing check complete", JSON.stringify(summary));
    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    const message = (e as Error).message;
    console.error("check-ar-indexing failed:", message);
    return new Response(JSON.stringify({ error: "Indexing check failed", details: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
