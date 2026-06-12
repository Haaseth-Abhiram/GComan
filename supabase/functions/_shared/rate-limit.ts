// Durable, DB-backed rate limiting shared by edge functions.
//
// Why not an in-memory Map: edge isolates cold-start constantly and run as
// many parallel instances, so a Map-based limiter resets at random and is
// never shared — a scripted loop sails straight through it. Counters live in
// public.edge_rate_limits (see migration 20260612120000), written with the
// service-role client which bypasses its deny-all RLS.

// deno-lint-ignore no-explicit-any
type SupabaseAdmin = any;

/**
 * Fixed-window limiter. Returns true when `ip` has exceeded `max` requests
 * to `endpoint` within the current window. Fails OPEN on infra errors (and
 * before the migration is applied) so legitimate traffic is never blocked
 * by a rate-limit hiccup.
 */
export async function isRateLimited(
  supabaseAdmin: SupabaseAdmin,
  endpoint: string,
  ip: string,
  max: number,
  windowMs: number = 60_000,
): Promise<boolean> {
  try {
    const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs).toISOString();

    const { data: existing, error: readError } = await supabaseAdmin
      .from("edge_rate_limits")
      .select("request_count")
      .eq("endpoint", endpoint)
      .eq("ip_address", ip)
      .eq("window_start", windowStart)
      .maybeSingle();
    if (readError) throw readError;

    const nextCount = (existing?.request_count ?? 0) + 1;
    const { error: writeError } = await supabaseAdmin
      .from("edge_rate_limits")
      .upsert({ endpoint, ip_address: ip, window_start: windowStart, request_count: nextCount });
    if (writeError) throw writeError;

    // Best-effort cleanup of stale windows — fire and forget.
    if (Math.random() < 0.05) {
      const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      supabaseAdmin.from("edge_rate_limits").delete().lt("window_start", cutoff).then(() => {});
    }

    return nextCount > max;
  } catch (err) {
    console.error(`[rate-limit:${endpoint}] check failed:`, err);
    return false;
  }
}

/**
 * Client IP for rate limiting. cf-connecting-ip is set by Cloudflare and not
 * client-spoofable in this deploy; the leftmost x-forwarded-for entry IS
 * attacker-controlled, so it's only a fallback.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
