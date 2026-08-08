# Lovable Platform Support Request — Two Hosting-Level Issues

Both issues below are confirmed via direct testing against production (gcoman.com) and are **outside application code** — this repo's own `public/_headers` and `public/.htaccess` already declare the correct behavior, but per this project's CLAUDE.md they are documented as inert on Lovable's CDN. Neither is fixable by changing the React app; both need a platform-side change or guidance from Lovable.

---

## Issue 1: SPA fallback serves the full homepage (not a neutral 404) for any unmatched URL

**What's happening:** Any request to a path outside the ~700-URL sitemap — a typo, an old/removed product URL, a case-variant path, a completely fabricated path — returns **HTTP 200** with the homepage's exact `<title>`, meta description, self-referencing canonical, and `robots: index, follow`.

**Reproduce:**
```bash
curl -sI https://gcoman.com/this-page-definitely-does-not-exist-xyz123
# HTTP/2 200 — should be 404

curl -s https://gcoman.com/this-page-definitely-does-not-exist-xyz123 | grep -oE '<title>[^<]+'
# <title>Chemical Suppliers in Oman &amp; GCC | Global Chemicals LLC   <- the homepage's title
```

**Root cause (as best we can tell from our side):** the CDN's SPA-fallback rule serves `dist/index.html` for any unrecognized path. Because our Puppeteer prerender step writes the fully-rendered homepage HTML to `dist/index.html`, the fallback isn't a neutral shell — it's a complete, indexable copy of the homepage. Our client-side `NotFound.tsx` component does correctly set `noindex, nofollow`, but that only takes effect after JavaScript executes for that specific URL; the raw HTTP response every crawler sees first is the indexable homepage duplicate.

**Why this matters:** Google Search Console currently shows only 315 of 700 sitemap URLs indexed (45%), and its own Page Indexing report lists 16 URLs failing with reason "Soft 404." We believe this CDN fallback behavior is a strong contributor — at our site's scale (a 22-category product catalog with a history of category restructuring, several known legacy WordPress-era URLs, and routine product changes) the space of URLs that hit this fallback is large and growing, and this is a known pattern for triggering Google's site-wide soft-404 crawl-rate throttling.

**What we're asking:** is there a CDN-level setting to serve a genuine 404 status (or at minimum a non-indexable, non-homepage response) for paths that don't match a prerendered route? If Lovable's CDN has no such setting today, we'd appreciate knowing so we can plan around it (e.g. evaluate a self-hosted Apache migration, for which we already maintain `public/.htaccess`/`public/_redirects` as a ready-made config).

---

## Issue 2: `Cache-Control: no-cache, must-revalidate, max-age=0` on every route, including static assets

**What's happening:** every response — HTML pages, JS bundles, CSS, fonts, images — carries `Cache-Control: no-cache, must-revalidate, max-age=0`. No browser or intermediate cache ever reuses a previous response; every asset is re-fetched on every visit, even repeat visits from the same user.

**Reproduce:**
```bash
curl -sI https://gcoman.com/ | grep -i cache-control
curl -sI https://gcoman.com/products/water-treatment/caustic-soda-flakes | grep -i cache-control
curl -sI https://gcoman.com/about | grep -i cache-control
# all three: cache-control: no-cache, must-revalidate, max-age=0
```

**What we expected:** our repo's `public/_headers` (a Netlify-style headers file we maintain for exactly this purpose) already declares a sane policy — `Cache-Control: public, max-age=31536000, immutable` for hashed JS/CSS/font assets, shorter TTLs for HTML/sitemap. This file appears to have no effect on Lovable's CDN.

**Why this matters:** Google's CrUX field data (visible in Search Console → Core Web Vitals) shows 105/105 measured desktop URLs rated POOR and 0/105 mobile URLs rated "good." PageSpeed Insights field data on a sample product page shows TTFB alone at ~2 seconds. Real visitors — especially repeat visitors, who should get near-instant loads from cached static assets — are instead paying full network cost on every page view.

**What we're asking:** can Lovable's CDN be configured to respect `public/_headers`, or is there an equivalent platform-level cache policy setting we should use instead? We'd like static, hashed assets (JS/CSS/fonts/images) cached long-term at minimum, even if HTML itself needs to stay short-TTL or revalidated for freshness.

---

## Context for whoever picks this up

- Site: gcoman.com, a Vite/React SPA with a Puppeteer prerender step, deployed via Lovable's build pipeline (`vite build` → Lovable's CDN).
- Both issues were found via a full SEO/performance audit conducted 2026-08-09, cross-verified against live Google Search Console data (GSC account attached to the property).
- Happy to grant temporary access, run additional diagnostics, or join a call if that speeds up triage.
