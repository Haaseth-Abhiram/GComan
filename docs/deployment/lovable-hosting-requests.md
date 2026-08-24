# Hosting requests for Lovable support — drafted 2026-08-24

Three hosting-level changes surfaced by the Aug 2026 SEO audit. None can be
fixed in code — they are CDN behaviour. Send to Lovable support (or raise in
their Discord); if they can't accommodate them, the fallback is moving the
origin to Netlify/Cloudflare Pages, where our existing `public/_redirects` and
`public/_headers` execute as-is.

---

## Request 1 — Cacheable HTML (highest impact: fixes our failing LCP)

> Our project (gcoman.com, deployment 774b8163-41c8-48e8-ba97-7d31a13ea7cd)
> serves fully prerendered static HTML, but every HTML response carries
> `cache-control: no-cache, must-revalidate, max-age=0`, so Cloudflare
> revalidates against origin on every request. We measure 830–1,020 ms TTFB
> from Dubai for static files, which alone pushes our mobile LCP to 5.6 s
> (fails Core Web Vitals).
>
> Could HTML responses be served with
> `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400`
> (or any config that lets the edge cache HTML and revalidate in the
> background)? Our HTML is regenerated only on deploy, so an hour of edge
> caching is safe. If cache purge on deploy is automatic, even better.

## Request 2 — Real 404 status for unmatched paths

> Unmatched paths currently return HTTP 200 with `index.html` as the body.
> Because our build prerenders `index.html` into the full homepage, every
> mistyped or stale URL serves an indexable duplicate of our homepage to
> crawlers (soft-404). We ship a `dist/404.html`.
>
> Can the CDN be configured to serve `404.html` with an HTTP 404 status for
> paths that don't match a deployed file or directory?

## Request 3 — Redirects and headers files

> Does the platform support a `_redirects` and/or `_headers` file (Netlify
> convention)? Both already exist in our build output, currently inert. They
> would give us real 301s for ~200 legacy URLs (currently client-side JS
> redirects) and security headers (CSP, X-Frame-Options).

---

## If Lovable declines

Move the origin to **Netlify** or **Cloudflare Pages**:

- `public/_redirects` (66 KB, maintained and in sync) executes natively → real
  301s for every legacy URL.
- `public/_headers` executes natively → security headers.
- Both serve 404.html with a real 404 by default and edge-cache HTML properly,
  and both serve Brotli.
- Migration is: connect the GitHub repo, set the build command (`npm run
  build`), then repoint DNS in Hostinger hPanel. The Lovable deploy chain
  simply stops being the origin; nothing in the app changes.

Decision and timing are the owner's call — flagged here so the trade-off is
written down.
