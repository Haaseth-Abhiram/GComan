/**
 * Cloudflare Worker — canonical routing fix for gcoman.com
 *
 * Problem
 * -------
 * Lovable's CDN serves the SPA shell (root index.html) for every clean URL
 * like /products/glycols, even though the prerender plugin writes the
 * correct per-route HTML to /products/glycols/index.html. Result: every
 * page returns the homepage <title> + canonical, and Google sees 300+
 * duplicates.
 *
 * Fix
 * ---
 * Intercept requests at the edge. First apply the legacy product redirects
 * that Apache .htaccess used to handle. Then, for any extensionless, non-root
 * path, try fetching `<path>/index.html` from the origin first. If that returns
 * 200, serve it. Otherwise fall through to the original request so the SPA
 * shell / 404 handling still works.
 *
 * Deploy
 * ------
 * 1. Cloudflare dashboard → Workers & Pages → Create Worker
 * 2. Paste this file, Save & Deploy
 * 3. Workers Routes → add route `gcoman.com/*` (and `www.gcoman.com/*`)
 *    → bind to this worker
 * 4. Verify:
 *      curl -sI https://gcoman.com/products/glycols | grep -i title
 *      curl -s  https://gcoman.com/products/glycols | grep -oE '<title>[^<]+'
 *    Should return the glycols page title, not the homepage title.
 */

export default {
  async fetch(request) {
    return handle(request);
  },
};

function withWorkerHeader(response, mode, extraHeaders = {}) {
  const headers = new Headers(response.headers);
  headers.set("x-gcoman-worker", mode);
  for (const [key, value] of Object.entries(extraHeaders)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const LEGACY_REDIRECTS = new Map([
  ["/products/acids/citric-acid", "/products/water-treatment/citric-acid-anhydrous"],
  ["/products/acids/acetic-acid", "/products/oilfield/acetic-acid"],
  ["/products/acids/nitric-acid", "/products/lab-chemicals/nitric-acid-lab"],
  ["/products/acids/phosphoric-acid", "/products/lab-chemicals/phosphoric-acid-lab"],
  ["/products/acids/hydrochloric-acid", "/products/lab-chemicals/hydrochloric-acid-lab"],
  ["/products/acids/sulfuric-acid", "/products/lab-chemicals/sulfuric-acid-lab"],
  ["/products/alkalis/caustic-soda", "/products/water-treatment/caustic-soda-flakes"],
  ["/products/alkalis/caustic-potash", "/products/water-treatment/potassium-hydroxide-water"],
  ["/products/alkalis/sodium-carbonate", "/products/water-treatment/soda-ash-water"],
  ["/products/alkalis/ammonia-solution", "/products/lab-chemicals/ammonia-solution-lab"],
  ["/products/salts/calcium-chloride", "/products/water-treatment/calcium-chloride-water"],
  ["/products/salts/sodium-chloride", "/products/lab-chemicals/sodium-chloride-lab"],
  ["/products/salts/magnesium-sulphate", "/products/lab-chemicals/magnesium-sulfate-lab"],
  ["/products/oxidizers/hydrogen-peroxide", "/products/soap-detergent/hydrogen-peroxide-35"],
  ["/products/oxidizers/sodium-hypochlorite", "/products/water-treatment/sodium-hypochlorite"],
  ["/products/soap-detergent/perchloroethylene", "/products/soap-detergent/perchloroethylene-soap-detergent"],
  ["/products/solvents/methanol", "/products/alcohols/methanol-industrial"],
  ["/products/solvents/toluene", "/products/lab-chemicals/toluene-lab"],
  ["/products/solvents/xylene", "/products/lab-chemicals/xylene-lab"],
  ["/products/solvents/mek", "/products/solvents/mek-solvent"],
  ["/products/solvents/acetone", "/products/lab-chemicals/acetone-lab"],
  ["/products/glycols/mono-ethylene-glycol", "/products/glycols/meg-ethylene-glycol"],
  ["/products/glycols/monoethylene-glycol", "/products/glycols/meg-ethylene-glycol"],
  ["/products/glycols/diethylene-glycol", "/products/water-treatment/deg-water"],
  ["/products/glycols/meg", "/products/glycols/meg-ethylene-glycol"],
  ["/products/glycols/deg", "/products/water-treatment/deg-water"],
  ["/products/alcohols/ethanol", "/products/alcohols/ethanol-industrial"],
  ["/products/alcohols/isopropanol", "/products/alcohols/isopropanol-industrial"],
  ["/products/alcohols/methanol", "/products/alcohols/methanol-industrial"],
  ["/products/alcohols/butanol", "/products/alcohols/butanol-industrial"],
  ["/products/oil-gas", "/products/oilfield"],
  ["/products/cleaning-products", "/products"],
]);

const LEGACY_PREFIX_REDIRECTS = new Map([
  ["/products/acids", "/products"],
  ["/products/alkalis", "/products"],
  ["/products/salts", "/products"],
  ["/products/oxidizers", "/products"],
]);

async function handle(request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // Only rewrite GET/HEAD. Never touch POST/PUT/etc (form submissions,
  // edge functions, etc.).
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return fetch(request);
  }

  // Keep one canonical host for SEO. This is safe here because the Worker route
  // is expected to be bound to both gcoman.com/* and www.gcoman.com/*.
  if (url.hostname === "www.gcoman.com") {
    const redirectUrl = new URL(url.toString());
    redirectUrl.hostname = "gcoman.com";
    return Response.redirect(redirectUrl.toString(), 301);
  }

  // Skip the root — origin already serves the correct homepage there.
  if (pathname === "/" || pathname === "") {
    return withWorkerHeader(await fetch(request), "root-passthrough");
  }

  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const legacyTarget = LEGACY_REDIRECTS.get(normalizedPath);
  if (legacyTarget) {
    const redirectUrl = new URL(url.toString());
    redirectUrl.hostname = "gcoman.com";
    redirectUrl.pathname = legacyTarget;
    redirectUrl.search = "";
    return Response.redirect(redirectUrl.toString(), 301);
  }

  for (const [prefix, target] of LEGACY_PREFIX_REDIRECTS) {
    if (normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)) {
      const redirectUrl = new URL(url.toString());
      redirectUrl.hostname = "gcoman.com";
      redirectUrl.pathname = target;
      redirectUrl.search = "";
      return Response.redirect(redirectUrl.toString(), 301);
    }
  }

  // Skip anything with a file extension (assets, sitemap.xml, robots.txt,
  // .js, .css, images, fonts, etc.).
  const lastSegment = pathname.split("/").pop() || "";
  if (lastSegment.includes(".")) {
    return withWorkerHeader(await fetch(request), "asset-passthrough");
  }

  // Skip API / edge function paths and admin/login (they're not prerendered).
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/functions/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login")
  ) {
    return withWorkerHeader(await fetch(request), "app-passthrough");
  }

  // Build the rewritten URL: /products/glycols → /products/glycols/index.html
  const rewrittenPath = pathname.endsWith("/")
    ? pathname + "index.html"
    : pathname + "/index.html";

  const rewrittenUrl = new URL(url.toString());
  rewrittenUrl.pathname = rewrittenPath;

  try {
    const rewrittenResponse = await fetch(rewrittenUrl.toString(), {
      method,
      headers: request.headers,
      redirect: "manual",
    });

    if (rewrittenResponse.status === 200) {
      // Return a fresh Response so headers are mutable and the body
      // streams correctly back to the client.
      const headers = new Headers(rewrittenResponse.headers);
      headers.set("x-gcoman-worker", "prerender-rewrite");
      headers.set("x-gcoman-worker-rewrite", rewrittenPath);
      // Make sure the client treats this as HTML even if origin guessed wrong.
      if (!headers.has("content-type")) {
        headers.set("content-type", "text/html; charset=utf-8");
      }
      return new Response(rewrittenResponse.body, {
        status: 200,
        statusText: "OK",
        headers,
      });
    }
  } catch (err) {
    // Network error fetching the prerendered file — fall through.
  }

  // Fallback: original request (SPA shell handles routing / 404).
  return withWorkerHeader(await fetch(request), "fallback-origin");
}
