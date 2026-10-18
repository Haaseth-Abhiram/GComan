---
name: verifying-seo-pipeline
description: Use after `npm run build` or a production deploy of gcoman.com to confirm SEO did not regress (prerendered titles, legacy 301s, Arabic product pages), or when choosing which scripts/*.mjs verify/audit/sync tool to run and what it reads.
---

# Verifying the SEO pipeline

Reference moved out of `CLAUDE.md` on 2026-10-13 so it loads only when needed. Run from `gcoman-insight-design/`.

## Verification commands (after a build or deploy)

After a build or production deploy, confirm SEO didn't regress:

```bash
npm run verify:prerender-titles   # scan dist/ for pages with homepage default <title>; expect 0
npm run verify:seo-routing        # production: prerendered HTML, legacy 301s, Arabic product pages

# Production: prerendered HTML served (not SPA shell)
curl -s https://gcoman.com/career | grep -oE '<title>[^<]+'
# expected: <title>Careers & Jobs | Join Our Team | Global Chemicals LLC

# Production: legacy 301s fire
curl -sI https://gcoman.com/service/calcium-carbonate/ -o /dev/null -w '%{http_code} %{redirect_url}\n'
# expected: 301 https://gcoman.com/products/water-treatment/calcium-carbonate-water
```

## Scripts in `scripts/` — what each reads and why it exists

- `deploy-supabase.sh` — deploy all edge functions
- `sync-ar-sitemap.mjs` — owns `public/sitemap.xml` (prune + hreflang + /ar twins); see "Arabic SEO model". `--check` is wired into CI as `npm run verify:sitemap-health`
- `sync-ar-meta.mjs` — regenerates `src/i18n/locales/ar-meta.json`, the small eager subset (product title/description, location metaTitle/metaDescription) that keeps the hreflang/indexability gates synchronous while the full `products-ar.json`/`location-pages-ar.json` lazy-load only on `/ar` (they were ~80% of the main JS bundle when statically imported — never re-add a static import of either file). Rerun after editing either translation file; `--check` is CI's `npm run verify:ar-meta`
- `verify-serp-titles.mjs` (`npm run verify:serp-titles`) — CI gate over all 277 products' **composed** titles: ≤60 chars, unique, geo signal present. Exists because a batch of disambiguating qualifiers pushed titles past the 60-char clamp and `fitForSerp` silently truncated 20 of them before the word "Oman" — the only title e2e test sampled 3 hardcoded URLs and saw nothing. Treat a failure here as a real ranking regression, not a lint nit
- `sync-sitemap-lastmod.mjs` (`npm run sync:sitemap-lastmod`) — derives each English `<lastmod>` from git history (per-product for products, per-post for blogs, file-level otherwise) instead of stamping everything with today's date
- `submit-indexnow.mjs` (`npm run submit:indexnow`) — pushes URLs to IndexNow (Bing/Yandex). Pre-flight fetches the live key file (`public/<key>.txt`) and aborts if it isn't being served, since a missing key silently voids the whole submission
- `audit-playwright.mjs` — timestamped site snapshots → `audits/<date>-local|prod/`
- `serve-dist.mjs` — serve `dist/` to sanity-check prerendered HTML without rebuilding
- `zoho-refresh-token.mjs` — refresh the Zoho CRM OAuth token
- `verify-prerender-titles.mjs` — see Verification commands
- `verify-seo-routing.mjs` — see "The production redirect layer: client-side"
- `verify-hostinger-staging.mjs` — smoke-test the site against Hostinger's IP directly (bypassing DNS) before switching A records
- `audit-product-content.mjs` (`npm run audit:product-content`) — ranks product pages by content debt x demand. Built on the 2026-09-08 finding that indexing was never the bottleneck (82% indexed) — thin bodies were. Scores identity (CAS/formula), prose depth, applications, specs and FAQs; pass a GSC Pages export to weight by real impressions
- `audit-internal-links.mjs` (`npm run audit:internal-links`) — reads the **prerendered `dist/`**, not src, because that's the link graph Googlebot sees. Flags links into `canonicalOverride` products, unrelated duplicate SKUs both in the sitemap, and landing pages nothing links to. Run `npm run build` first
- `scan-bordered-surfaces.mjs` — UI consistency sweep: bordered/rounded surfaces that are candidates for `.logo-gradient-border` but don't use it yet. Exits 1 when candidates exist

