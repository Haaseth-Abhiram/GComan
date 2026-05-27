/**
 * Cloudflare Worker — canonical routing + legacy URL redirects for gcoman.com
 *
 * Two responsibilities:
 * 1. 301-redirect all legacy/old product URLs to the current canonical URLs.
 *    These were in _redirects / .htaccess but Lovable's CDN ignores those files.
 * 2. Serve prerendered HTML for clean SPA routes (prevents every page from
 *    returning the homepage canonical/title from the SPA shell).
 *
 * Deploy / bind instructions:
 *   Cloudflare dashboard → Workers & Pages → Create Worker (or edit existing)
 *   → paste/save this file
 *   Workers Routes → add:
 *     gcoman.com/*        → this worker
 *     www.gcoman.com/*    → this worker
 *   (make sure both routes are listed — omitting www means www URLs bypass the worker)
 *
 * Verify after deploy:
 *   curl -sI https://gcoman.com/products/acids/citric-acid | head -5
 *     → expect: HTTP/2 301, Location: .../water-treatment/citric-acid-anhydrous
 *   curl -s https://gcoman.com/products/water-treatment/citric-acid-anhydrous | grep -o '<title>[^<]*'
 *     → expect product title, NOT "Chemical Suppliers in Oman..."
 */

// ---------------------------------------------------------------------------
// 301 redirect map — exact path (no trailing slash) → destination path
// Sourced from public/_redirects; kept here because Lovable's CDN ignores _redirects
// ---------------------------------------------------------------------------
const LEGACY_REDIRECTS = new Map([
  // Old /products/acids/* → new categories
  ["/products/acids/citric-acid",       "/products/water-treatment/citric-acid-anhydrous"],
  ["/products/acids/acetic-acid",       "/products/oilfield/acetic-acid"],
  ["/products/acids/nitric-acid",       "/products/lab-chemicals/nitric-acid-lab"],
  ["/products/acids/phosphoric-acid",   "/products/lab-chemicals/phosphoric-acid-lab"],
  ["/products/acids/hydrochloric-acid", "/products/lab-chemicals/hydrochloric-acid-lab"],
  ["/products/acids/sulfuric-acid",     "/products/lab-chemicals/sulfuric-acid-lab"],

  // Old /products/alkalis/* → new categories
  ["/products/alkalis/caustic-soda",    "/products/water-treatment/caustic-soda-flakes"],
  ["/products/alkalis/caustic-potash",  "/products/water-treatment/potassium-hydroxide-water"],
  ["/products/alkalis/sodium-carbonate","/products/water-treatment/soda-ash-water"],
  ["/products/alkalis/ammonia-solution","/products/lab-chemicals/ammonia-solution-lab"],

  // Old /products/salts/*
  ["/products/salts/calcium-chloride",  "/products/water-treatment/calcium-chloride-water"],
  ["/products/salts/sodium-chloride",   "/products/lab-chemicals/sodium-chloride-lab"],
  ["/products/salts/magnesium-sulphate","/products/lab-chemicals/magnesium-sulfate-lab"],
  ["/products/salts/sodium-sulphate",   "/products"],

  // Old /products/oxidizers/*
  ["/products/oxidizers/hydrogen-peroxide",  "/products/soap-detergent/hydrogen-peroxide-35"],
  ["/products/oxidizers/sodium-hypochlorite","/products/water-treatment/sodium-hypochlorite"],

  // Old /products/solvents/* (renamed or moved)
  ["/products/solvents/methanol", "/products/alcohols/methanol-industrial"],
  ["/products/solvents/toluene",  "/products/lab-chemicals/toluene-lab"],
  ["/products/solvents/xylene",   "/products/lab-chemicals/xylene-lab"],
  ["/products/solvents/mek",      "/products/solvents/mek-solvent"],
  ["/products/solvents/acetone",  "/products/lab-chemicals/acetone-lab"],

  // Old /products/glycols/* (renamed slugs)
  ["/products/glycols/mono-ethylene-glycol", "/products/glycols/meg-ethylene-glycol"],
  ["/products/glycols/monoethylene-glycol",  "/products/glycols/meg-ethylene-glycol"],
  ["/products/glycols/diethylene-glycol",    "/products/water-treatment/deg-water"],
  ["/products/glycols/meg",                  "/products/glycols/meg-ethylene-glycol"],
  ["/products/glycols/deg",                  "/products/water-treatment/deg-water"],

  // Old /products/alcohols/* (renamed slugs)
  ["/products/alcohols/ethanol",    "/products/alcohols/ethanol-industrial"],
  ["/products/alcohols/isopropanol","/products/alcohols/isopropanol-industrial"],
  ["/products/alcohols/methanol",   "/products/alcohols/methanol-industrial"],
  ["/products/alcohols/butanol",    "/products/alcohols/butanol-industrial"],

  // Wrong slug in soap-detergent (sitemap corrected to add suffix)
  ["/products/soap-detergent/perchloroethylene", "/products/soap-detergent/perchloroethylene-soap-detergent"],

  // Old top-level category pages that no longer exist
  ["/products/acids",           "/products"],
  ["/products/alkalis",         "/products"],
  ["/products/salts",           "/products"],
  ["/products/oxidizers",       "/products"],
  ["/products/oil-gas",         "/products/oilfield"],
  ["/products/cleaning-products","/products"],

  // Legacy WordPress service pages
  ["/service/calcium-carbonate",      "/products/water-treatment/calcium-carbonate-water"],
  ["/service/soap-detergent-chemicals","/products"],
  ["/service/solvents",               "/products"],
  ["/service/chlorinated-solvents",   "/products"],
  ["/service/construction-chemicals", "/products"],
  ["/service/swimming-1",             "/products/swimming-pool"],
  ["/service/swimming",               "/products/swimming-pool"],
  ["/service/lubricants-greases",     "/products/lubricants"],
  ["/service/lubricants-greases-1",   "/products/lubricants"],
  ["/service/laboratories",           "/products/lab-chemicals"],
  ["/service/construction",           "/products"],
  ["/service/construction-1",         "/products"],
  ["/service/inorganic-chemicals",    "/products"],
  ["/service/container",              "/products"],
  ["/service/food-beverage",          "/industries"],
  ["/service/personal-care",          "/industries"],
  ["/service/water-treatment-2",      "/products/water-treatment"],
  ["/service/water-treatment",        "/products/water-treatment"],
  ["/service/automotive-2",           "/industries"],
  ["/service/air-chemical",           "/products"],
  ["/service/services/oxide",         "/products"],
  ["/service/ethanolamines",          "/products"],
  ["/service/pharmaceutical",         "/industries"],
  ["/service/agriculture",            "/industries"],
  ["/service/oil-gas-1",              "/products/oilfield"],
  ["/service/general-inquiry",        "/contact"],

  // Legacy WordPress category/tag/author pages
  ["/service-category/chlorinated-solvents",     "/products"],
  ["/service-category/oilgas",                   "/products/oilfield"],
  ["/service-category/lab-equipment",            "/products/lab-chemicals"],
  ["/service-category/soap-detergent-chemicals", "/products"],
  ["/category/fashion-retail",  "/industries"],
  ["/category/news-analysis",   "/blog"],
  ["/category/industry-insight","/blog"],
  ["/category/uncategorized",   "/blog"],
  ["/category/lab-equipment",   "/products/lab-chemicals"],
  ["/tag/silk",   "/blog"],
  ["/tag/cotton", "/blog"],
  ["/author/samplework1", "/blog"],

  // Legacy WordPress product/industry pages
  ["/water-waste-water-treatment-chemicals", "/products/water-treatment"],
  ["/swimming-pool-chemicals",               "/products/swimming-pool"],
  ["/lubricants-greases",                    "/products/lubricants"],
  ["/oilfield-refinery",                     "/products/oilfield"],
  ["/glycols",                               "/products"],
  ["/alcohols",                              "/products"],
  ["/food-beverages",                        "/industries"],
  ["/industries-2",                          "/industries"],
  ["/pharmaceutical",                        "/industries"],
  ["/manufacturing",                         "/industries"],
  ["/refinery",                              "/products/oilfield"],
  ["/product/food-beverages",                "/products"],
  ["/products-services",                     "/products"],

  // Legacy company/support pages
  ["/sales-and-comprehensive-support", "/contact"],
  ["/technical-support",               "/contact"],
  ["/company",                         "/about"],
  ["/our-team",                        "/about"],
  ["/partners",                        "/about"],
  ["/our-values",                      "/about"],
  ["/why-choose-us",                   "/about"],
  ["/team-member/james-logan",         "/about"],
  ["/team-member/michal-wincent",      "/about"],
  ["/team-member/john-tyler",          "/about"],
  ["/service-openings",                "/career"],
  ["/jobs/sales-manager",              "/career"],
  ["/what-we-supply-2",                "/products"],
  ["/terms-conditions",                "/terms"],
  ["/privacy-policy",                  "/privacy"],
  ["/blog-news",                       "/blog"],
  ["/whats-new",                       "/blog"],

  // Blog posts with date-based URLs
  ["/2021/03/09/the-story-of-a-silk-lends-cotton-like-comfort", "/blog"],
  ["/2021/02/28/laundry-chemical",                               "/blog"],
  ["/2021/02/15/textilegence-magazine-digital-platform",         "/blog"],
  ["/2021/02/11/contactless-payments-time-has-come",             "/blog"],
  ["/2025/10/15/nonwovens-industry-magazine",                    "/blog"],

  // Malformed URLs with domain in path
  ["/gcoman.com/ethanolamines", "/products"],
  ["/gcoman.com/blog",          "/blog"],
]);

// Wildcard prefix redirects — checked after exact-match fails.
const LEGACY_PREFIX_REDIRECTS = new Map([
  ["/products/acids",    "/products"],
  ["/products/alkalis",  "/products"],
  ["/products/salts",    "/products"],
  ["/products/oxidizers","/products"],
  ["/2021",              "/blog"],
  ["/2025",              "/blog"],
  ["/category",          "/blog"],
  ["/tag",               "/blog"],
  ["/author",            "/blog"],
  ["/team-member",       "/about"],
]);

// ---------------------------------------------------------------------------

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

export default {
  async fetch(request) {
    return handle(request);
  },
};

async function handle(request) {
  const url = new URL(request.url);
  let { pathname } = url;
  const method = request.method.toUpperCase();

  // Only rewrite GET / HEAD — leave POST / PUT etc untouched.
  if (method !== "GET" && method !== "HEAD") {
    return fetch(request);
  }

  // www → non-www (keeps path and query intact).
  if (url.hostname === "www.gcoman.com") {
    const redirectUrl = new URL(url.toString());
    redirectUrl.hostname = "gcoman.com";
    return Response.redirect(redirectUrl.toString(), 301);
  }

  // Pass through root — origin already serves the correct homepage there.
  if (pathname === "/" || pathname === "") {
    return withWorkerHeader(await fetch(request), "root-passthrough");
  }

  // Normalize: strip trailing slash for lookup (except root "/").
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  // ------------------------------------------------------------------
  // Step 1: Exact 301 redirect
  // ------------------------------------------------------------------
  const legacyTarget = LEGACY_REDIRECTS.get(normalizedPath);
  if (legacyTarget) {
    const redirectUrl = new URL(url.toString());
    redirectUrl.hostname = "gcoman.com";
    redirectUrl.pathname = legacyTarget;
    redirectUrl.search = "";
    return Response.redirect(redirectUrl.toString(), 301);
  }

  // ------------------------------------------------------------------
  // Step 2: /en/* → strip /en prefix (English is the default, no prefix)
  // ------------------------------------------------------------------
  if (normalizedPath === "/en" || normalizedPath.startsWith("/en/")) {
    const redirectUrl = new URL(url.toString());
    redirectUrl.pathname = normalizedPath === "/en" ? "/" : normalizedPath.slice(3);
    return Response.redirect(redirectUrl.toString(), 301);
  }

  // ------------------------------------------------------------------
  // Step 3: Wildcard prefix 301 redirects
  // ------------------------------------------------------------------
  for (const [prefix, target] of LEGACY_PREFIX_REDIRECTS) {
    if (normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)) {
      const redirectUrl = new URL(url.toString());
      redirectUrl.hostname = "gcoman.com";
      redirectUrl.pathname = target;
      redirectUrl.search = "";
      return Response.redirect(redirectUrl.toString(), 301);
    }
  }

  // ------------------------------------------------------------------
  // Step 4: Pass-through for static assets
  // ------------------------------------------------------------------
  const lastSegment = pathname.split("/").pop() || "";
  if (lastSegment.includes(".")) {
    return withWorkerHeader(await fetch(request), "asset-passthrough");
  }

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/functions/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login")
  ) {
    return withWorkerHeader(await fetch(request), "app-passthrough");
  }

  // ------------------------------------------------------------------
  // Step 5: Serve prerendered HTML for clean SPA routes.
  //
  // Lovable's CDN does NOT auto-serve /route/index.html when /route is
  // requested — it falls back to the root SPA shell (homepage title +
  // canonical on every page). Fetching /route/index.html explicitly
  // returns the per-route prerendered file that the build wrote there.
  // ------------------------------------------------------------------
  const rewrittenPath = pathname.endsWith("/")
    ? pathname + "index.html"
    : pathname + "/index.html";

  const rewrittenUrl = new URL(url.toString());
  rewrittenUrl.pathname = rewrittenPath;

  try {
    const prerendered = await fetch(rewrittenUrl.toString(), {
      method,
      headers: request.headers,
      redirect: "manual",
    });

    if (prerendered.status === 200) {
      const headers = new Headers(prerendered.headers);
      headers.set("x-gcoman-worker", "prerender-rewrite");
      headers.set("x-gcoman-worker-rewrite", rewrittenPath);
      if (!headers.has("content-type")) {
        headers.set("content-type", "text/html; charset=utf-8");
      }
      return new Response(prerendered.body, {
        status: 200,
        statusText: "OK",
        headers,
      });
    }
  } catch (_) {
    // Network error fetching the prerendered file — fall through to SPA shell.
  }

  // SPA shell fallback (handles /ar/* routes, unknown paths, etc.)
  return withWorkerHeader(await fetch(request), "fallback-origin");
}
