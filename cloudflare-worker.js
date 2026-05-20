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
 * Intercept requests at the edge. For any extensionless, non-root path,
 * try fetching `<path>/index.html` from the origin first. If that returns
 * 200, serve it. Otherwise fall through to the original request so the
 * SPA shell / 404 handling still works.
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

addEventListener("fetch", (event) => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // Only rewrite GET/HEAD. Never touch POST/PUT/etc (form submissions,
  // edge functions, etc.).
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return fetch(request);
  }

  // Skip the root — origin already serves the correct homepage there.
  if (pathname === "/" || pathname === "") {
    return fetch(request);
  }

  // Skip anything with a file extension (assets, sitemap.xml, robots.txt,
  // .js, .css, images, fonts, etc.).
  const lastSegment = pathname.split("/").pop() || "";
  if (lastSegment.includes(".")) {
    return fetch(request);
  }

  // Skip API / edge function paths and admin/login (they're not prerendered).
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/functions/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login")
  ) {
    return fetch(request);
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
  return fetch(request);
}
