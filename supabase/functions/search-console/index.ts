// Admin-only Google Search Console proxy.
// Returns search performance (clicks/impressions/CTR/position) broken down by
// date, query, page, country and device, plus submitted sitemap status.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

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

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  // Admin-only.
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
    const days: number = Math.min(Math.max(Number(body?.days) || 28, 7), 480);
    // GSC data lags ~2 days.
    const endDate: string = body?.endDate ?? isoDaysAgo(2);
    const startDate: string = body?.startDate ?? isoDaysAgo(2 + days);
    const rowLimit = Math.min(Number(body?.rowLimit) || 25, 100);

    // Resolve a verified property (never construct one).
    const sites = await gsc("/webmasters/v3/sites");
    const entries: Array<{ siteUrl: string }> = sites.siteEntry ?? [];
    const pick =
      entries.find((e) => e.siteUrl === "https://gcoman.com/") ??
      entries.find((e) => e.siteUrl === "sc-domain:gcoman.com") ??
      entries[0];
    if (!pick) throw new Error("No verified Search Console property on this connection");
    const siteUrl = pick.siteUrl;
    const enc = encodeURIComponent(siteUrl);

    const query = (dimensions: string[], limit = rowLimit) =>
      gsc(`/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, dimensions, rowLimit: limit, dataState: "all" }),
      }).then((r) => r.rows ?? []).catch((e) => {
        console.error(`searchAnalytics ${dimensions.join(",")} failed:`, (e as Error).message);
        return [];
      });

    const [totalsRows, byDate, byQuery, byPage, byCountry, byDevice, sitemaps] = await Promise.all([
      gsc(`/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({ startDate, endDate, dimensions: [], dataState: "all" }),
      }).then((r) => r.rows ?? []).catch(() => []),
      query(["date"], 500),
      query(["query"]),
      query(["page"]),
      query(["country"], 10),
      query(["device"], 5),
      gsc(`/webmasters/v3/sites/${enc}/sitemaps`).catch(() => ({ sitemap: [] })),
    ]);

    const totals = totalsRows[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    return new Response(
      JSON.stringify({
        siteUrl, startDate, endDate, totals,
        byDate, byQuery, byPage, byCountry, byDevice,
        sitemaps: sitemaps?.sitemap ?? [],
        availableSites: entries.map((e) => e.siteUrl),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const message = (e as Error).message;
    console.error("search-console failed:", message);
    return new Response(JSON.stringify({ error: "Search Console request failed", details: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
