# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

gcoman.com — marketing site + lead-capture platform for Global Chemicals LLC (Oman / GCC chemical supplier).

## Tech stack

Vite 7 + React 18 + TypeScript (loose: `strict: false`, `noImplicitAny: false`) + Tailwind + shadcn/ui (Radix). Routing: `react-router-dom` v7 via `BrowserRouter` in [src/App.tsx](src/App.tsx). Data: `@tanstack/react-query` (the only legitimate `@tanstack/*` package — the router/start packages from the aborted SSR migration were removed; don't reintroduce them). Forms: controlled `useState` + server-side validation in the edge functions (`react-hook-form`/Zod are installed and wrapped in `ui/form.tsx` but no page uses them yet). Backend: Supabase (Postgres + auth + storage + Deno edge functions). i18n: `i18next`, `en` default (unprefixed URLs), `ar` under `/ar/*`. Path alias `@/` → `src/`.

## Commands

```bash
npm run dev               # vite dev server on port 8080
npm run build             # production build → dist/  (prerender plugin; ~5–10 min for 300+ routes)
npm run build:dev         # production-shaped build, mode=development, no prerender
npm run lint              # eslint
npx tsc -b                # typecheck (no npm script; CI runs this)
npm run preview           # serve dist/ locally

# Catalogue audits (read dist/ or src/ — see "Scripts in scripts/")
npm run audit:product-content    # rank product pages by content debt x demand
npm run audit:internal-links     # link graph in dist/ — run `npm run build` first

# Playwright e2e — 3 modes in playwright.config.ts. Nine spec files in tests/e2e/
# (loading-flow, legacy-redirects, dosing-calculator, quote-funnel, internal-linking,
# lazy-arabic-bundle, category-listing, product-seo-surface, caustic-soda-hub):
# targeted coverage of load-bearing flows, not broad assurance.
npm run test:e2e          # vite dev server (port 4179, NOT 8080)
npm run test:e2e:prod     # PROD_BUILD=1 → build:dev + vite preview
BASE_URL=https://gcoman.com npm run test:e2e   # against any remote target
npx playwright test tests/e2e/loading-flow.spec.ts -g "name of test"   # single test

# Supabase edge functions — NOTE: the Supabase project is managed by Lovable
# Cloud and there are NO standalone Supabase credentials (confirmed 2026-09-01).
# In practice functions deploy when Lovable builds/publishes main; the CLI
# commands below only work if someone has a Supabase access token.
./scripts/deploy-supabase.sh                   # deploy all functions
supabase functions deploy submit-contact       # one function
supabase secrets set TURNSTILE_SECRET_KEY=...  # rotate a secret
```

Use **npm**. `bun.lock` is a leftover from a Lovable trial; canonical lockfile is `package-lock.json`.

## CI (GitHub Actions)

[.github/workflows/ci.yml](.github/workflows/ci.yml): typecheck + lint + `verify:sitemap-health` + `verify:ar-meta` + `build:dev` + Playwright smoke on every push/PR to `Develop`/`main`. It is the **only** quality gate before the Lovable auto-deploy ships to production. Before pushing: `npx tsc -b && npm run lint && npm run verify:sitemap-health && npm run verify:ar-meta && npm run test:e2e`.

Note: `ci.yml`'s own header comment and `README.md` still describe the retired "Lovable FTPs `dist/` to Hostinger" story — stale relative to "Deploy chain" below. Don't treat those two as sources of truth for the deploy chain.

## Branch workflow

- **Develop is the working branch** — all commits land here first. New branches fork off `Develop`, not `main`.
- **Main is production.** Don't push to it or open a `Develop → main` PR unprompted — default to the user merging manually after their own QA. Claude may merge `Develop → main` and push (triggering Lovable's auto-deploy) when the user explicitly asks for it in-session; that push is itself the deploy step, since there's no separate deploy trigger (see "Deploy chain").

## Map of the code

Much more than a brochure site. Beyond the obvious marketing pages:

- **Admin dashboard** — `src/pages/Admin.tsx` + `src/components/admin/`: analytics charts (Recharts), contact/download/job-application/newsletter tables with Excel export (`src/lib/exportToExcel.ts`, xlsx), resume browser with PDF preview (pdfjs-dist), activity feed. Guarded by `AdminRoute` + role checks (`src/hooks/useUserRole.ts`).
- **Auth** — `src/pages/Login.tsx` + `src/contexts/AuthContext.tsx`: Supabase email/password with recovery and role-based access.
- **AI product search** — `src/components/AISearchDialog.tsx` → `ai-search` edge function (LLM-backed, markdown responses).
- **Lead capture** — `DownloadGateDialog.tsx` gates resource downloads behind name/email → `notify-download` edge function → Zoho CRM.
- **3D chemistry hero** — `src/components/products/ChemistryHero3D.tsx` + `scene/` (three.js / @react-three/fiber, custom GLSL dissolve shader, Brownian particle physics). Tuning tool at `/dev/chemistry-playground` (`ChemistryPlayground.tsx`) — internal, deliberately NOT in the sitemap.
- **SEO landing pages** — `LocationLanding.tsx` (dynamic `/chemicals/:location` — city pages plus country hubs `uae`/`saudi-arabia`) with `ChemicalsHub.tsx` as the `/chemicals` index (location list lives in `src/data/locationIndex.ts` — keep slugs in sync with LocationLanding's `locations` record), plus static ones (`ChemicalSuppliersOman.tsx` etc.). Arabic location strings: `src/i18n/locales/location-pages-ar.json`.
- **Dosing calculators** — `src/pages/DosingCalculator.tsx` at `/tools/dosing-calculator`: four water-treatment calculators, the site's linkable asset. Formulas shown in the open; each result block feeds the prefilled quote funnel. Arithmetic pinned by `tests/e2e/dosing-calculator.spec.ts`. `/ar` render deliberately noindex until localized.
- **Public MCP server** — `src/lib/mcp/` (tools: search/get products, list categories, admin-auth'd lead listings) is the SOURCE; the Vite plugin `mcpPlugin()` from `@lovable.dev/mcp-js` bundles it to `supabase/functions/mcp/index.ts` on build. That output file is auto-generated — edit `src/lib/mcp/`, never the bundle.
- **Product+geo hub pages** — hand-written commercial landings outside the catalogue: `CausticSodaOman.tsx` (`/chemical-supplier/caustic-soda-oman`, the controlled product+geo test, pinned by `tests/e2e/caustic-soda-hub.spec.ts`), `ChemicalSuppliersOman.tsx`, `ChemicalSuppliersMiddleEast.tsx`.
- **HTML sitemap page** — `Sitemap.tsx` at `/sitemap` (noindex; distinct from `public/sitemap.xml`).
- **MCP OAuth consent** — `OAuthConsent.tsx` at `/.lovable/oauth/consent`: Lovable-managed consent screen for external MCP clients (ChatGPT, Claude) connecting to the public MCP server. Uses beta `supabase.auth.oauth` behind a narrow typed wrapper.
- **Integrations** — `GoogleAnalytics.tsx`, `ZohoSalesIQ.tsx`, `Turnstile.tsx`, `WhatsAppButton.tsx`, `CookieConsent.tsx`.
- **i18n data** — `src/i18n/locales/`: `en.json`, `ar.json`, plus `products-ar.json` (translated product names/descriptions).

## Deploy chain

- **Hosting: Lovable's CDN serves production** (verified live 2026-07-07: DNS A record `185.158.133.1` is Lovable's ingress — responses carry `x-deployment-id` and Lovable's Cloudflare edge headers). DNS: nameservers `ns1/ns2.dns-parking.com` (Hostinger's), zone managed in Hostinger hPanel.
- **Pipeline:** GitHub `main` → Lovable runs `vite build` → publishes `dist/` to its CDN. The CDN resolves clean URLs to the prerendered `dist/<route>/index.html` automatically.
- **The Hostinger server (`147.93.109.106`) is NOT serving the site** — its `public_html` is empty (everything 404s; run `npm run verify:hostinger-staging` to check its state). The old docs' story that Lovable FTPs `dist/` to Hostinger and `.htaccess` is load-bearing does not match production. `public/.htaccess` / `public/_redirects` / `public/_headers` are inert in production; they are kept in sync as the ready-made config for a future move to self-hosted Apache (which would add real 301s, security headers, and brotli — Lovable's CDN supports none of these).

## Architecture: the prerender pipeline

Pure client-side SPA whose SEO depends on three pieces working together. Touching one in isolation silently breaks indexing.

1. **`public/sitemap.xml` is the source of truth for routes.** [vite.config.ts](vite.config.ts) parses it (`routesFromSitemap()`) and feeds `@prerenderer/rollup-plugin`. A route not in the sitemap gets no prerendered HTML — Googlebot sees the empty shell (Soft 404). Conversely, anything meant to stay out of the index (admin, `/dev/*`) must NOT be in the sitemap; the plugin also filters `/admin*` and `/login*` defensively.
2. **Puppeteer prerender** renders each route, waits `renderAfterTime: 2500` ms for the lazy chunk + Helmet to commit, writes `dist/<route>/index.html`.
3. **Apache `.htaccess`** serves the prerendered HTML per URL (SPA shell fallback for unknown routes).

### Three things that silently break SEO — agents have tripped on each

**1. `<Helmet>` without `defer={false}`.** `react-helmet-async` defers head commits to rAF, which is unreliable in headless puppeteer, and each new `<Helmet>` cancels the previous queued frame — prerendered pages ship with the homepage `<title>`. **Every `<Helmet>` must include `defer={false}`** (currently 22 instances). Audit: `grep -rn '<Helmet' src --include='*.tsx' | grep -v 'defer={false}\|HelmetProvider'` — any output (other than multi-line openings) is a bug.

**2. Page-specific meta tags hardcoded in `index.html`.** Helmet **appends** meta tags rather than replacing, so a `description`/`og:*`/`twitter:*`/`hreflang` baked into `index.html` becomes a homepage-default duplicate ahead of the Helmet tag — Google reads the first (wrong) one. `index.html` holds ONLY: charset/viewport, `<title>` fallback, author, verification tokens, `geo.*`/`ICBM`, `content-language`/`distribution`/`target`, font preconnects, favicons, and the global Organization/LocalBusiness/WebSite/BreadcrumbList JSON-LD (single source of site-wide entity schema — never also mount `<LocalBusinessStructuredData />` from pages; same-`@id` duplicates). Everything else belongs in `<SEO>` ([src/components/SEO.tsx](src/components/SEO.tsx)). A comment block in `index.html` says this — preserve it.

**3. The `.htaccess`** — see Deploy chain.

## Routing & i18n

- Routes declared twice in [src/App.tsx](src/App.tsx): English unprefixed, Arabic under `/ar/*` wrapped in `<LangLayout>` (flips i18next to `ar`). `/en` and `/en/*` 301 in-app to unprefixed.
- All pages are lazy + `<Suspense fallback={<Loading />}>` — follow this for new pages so per-route chunks stay small. Use **`lazyRetry()`** ([src/lib/lazyRetry.ts](src/lib/lazyRetry.ts)), never bare `React.lazy`: Googlebot's renderer intermittently fails to fetch a route chunk, which threw at `<Lazy>`, tripped `ErrorBoundary`, and turned a fully prerendered page into "Something went wrong" — Google then filed it as a Soft 404 (diagnosed 2026-08-31). `lazyRetry` retries and force-reloads once per session, sharing the `__gc_chunk_reload__` session key with `productLoader.ts`'s `safeImport` so the app performs at most one recovery reload.
- Locale-aware link helpers: [src/lib/langRouting.ts](src/lib/langRouting.ts), `<LocalizedLink>`.
- `<ScrollToTop>` resets scroll on route change; `<RouteChangeLoader>` covers the chunk fetch.

### Product routes: two per-category shim registries (don't break this)

`/products/:category` and `/products/:category/:productSlug` are NOT served by one generic component. [src/App.tsx](src/App.tsx) holds two registries — `productCategoryEntries` and `productDetailEntries` — mapping each of the 22 category slugs to a one-line shim in `src/pages/productCategory/` / `src/pages/productDetail/` that **statically** imports only its own `src/data/products/<cat>.json` and renders `Products` / `ProductDetail` with it seeded as a prop.

Why it must stay this way:
- **Prerender correctness.** Loading the category list through a dynamic import inside `useEffect` made the product grid a race against `renderAfterTime`. A 2026-09-10 audit of `dist/` found 16 of 22 category pages shipped to Googlebot with zero links to their own products, orphaning 169 of 275 products. Static seeding removes the race.
- **Bundle size.** One entry per category keeps each category's JSON in its own route chunk instead of every product page pulling all 22.
- `PRODUCT_CATEGORIES` is derived from `Object.keys(productDetailEntries)` — deliberately *not* re-imported from `productLoader.ts`, so App.tsx's root bundle never pulls in that module's eager JSON imports. Unknown categories still fall through to the `/products/:category` wildcard.

### Arabic SEO model (opt-in per page)

An `/ar/*` render is **noindex by default**. It becomes indexable only when the page passes BOTH `arTitle` and `arDescription` to `<SEO>` — that flips the `/ar` render to localized meta + self-referencing `/ar` canonical, and makes both language versions emit reciprocal hreflang (`en`/`ar`/`x-default`). Never pass Arabic meta for a page whose body content is still English — that's the duplicate-content trap the default protects against.

- Currently enabled: **product detail pages with a full translation in `src/i18n/locales/products-ar.json`** (275 of 275 products — full coverage maintained since 2026-08-24; title + description present = enabled, enforced in [src/pages/ProductDetail.tsx](src/pages/ProductDetail.tsx)) and **location pages translated in `location-pages-ar.json`** (includes the UAE/Saudi country hubs).
- `scripts/sync-ar-sitemap.mjs` **owns `public/sitemap.xml`.** Hand-editing is limited to adding or removing an *English* `<url>` block for a new/retired page; **never hand-write an `/ar` URL or an `<xhtml:link>` alternate** — the script is the only thing that may touch those, and it rewrites them on every run. It runs three passes: **prune** every URL that renders `noindex` or canonicalises elsewhere, **annotate** each surviving English page with its `en`/`ar`/`x-default` alternates, and **twin** in the matching `/ar` block so the prerenderer generates it. Indexability is derived from the same sources the components read (`products-ar.json` for products, `location-pages-ar.json` for locations, `details.canonicalOverride` for duplicate SKUs), so the sitemap cannot drift from what `<SEO>` renders. Idempotent; rerun after adding any Arabic translation. `npm run verify:sitemap-health` (`--check`) is the CI gate and fails the build if the file is stale.
- Everything else under `/ar` (home, about, industries, blog…) stays noindex because its page-level prose (FAQs, breadcrumbs, section copy) is hardcoded English even though the `ar.json` UI layer is 100% complete. To enable a page: wire its prose through `t()`, then pass `arTitle`/`arDescription`, then rerun the sitemap sync/add the URL.

## Adding a new page

1. Create the component, lazy-import in [src/App.tsx](src/App.tsx).
2. Add `<SEO defer={false} title description canonical ogUrl />`.
3. Add the English `<url>` block to [public/sitemap.xml](public/sitemap.xml) so it gets prerendered (skip deliberately for internal-only pages), then run `node scripts/sync-ar-sitemap.mjs` — hand-add English URLs only; the script owns every `/ar` URL and every hreflang block.
4. Add an Arabic mirror under `/ar` if localized.
5. Optional structured data via [src/components/StructuredData.tsx](src/components/StructuredData.tsx) — every Helmet there also needs `defer={false}`.

## The production redirect layer: client-side

Lovable's CDN has no server-side redirect support, so legacy-URL redirects run **inside the app**: [src/lib/legacyRedirects.ts](src/lib/legacyRedirects.ts) (exact + prefix maps, ported from the retired Cloudflare Worker) consulted by `<LegacyRedirectHandler>` in [src/App.tsx](src/App.tsx), which sits above `<Routes>` so it also intercepts legacy paths that would otherwise match live route patterns (e.g. `/products/acids/*` matches `/products/:category/:productSlug`). It also normalizes trailing slashes. Googlebot follows these JS redirects (weaker than real 301s, but the only option on this host). e2e coverage: `tests/e2e/legacy-redirects.spec.ts`.

**The Cloudflare Worker plan is retired** (2026-07-07, user closed that path); `cloudflare-worker.js` remains as reference only.

Verify production after a deploy: `npm run verify:seo-routing` — note the legacy-301 checks only pass server-side (they'll show the client-side behavior as 200s; confirm redirects in a browser instead).

## Adding a redirect

Edit ALL THREE: `src/lib/legacyRedirects.ts` (**the layer that actually runs**), plus `public/_redirects` and `public/.htaccess` (kept in sync for a future self-hosted setup). Add an e2e case to `tests/e2e/legacy-redirects.spec.ts` for anything load-bearing.

## Product data

Per-category JSON files in `src/data/products/` (22 files, 275 products). `src/data/productLoader.ts` imports them, maps `iconName` strings to Lucide components via `ICON_MAP`, and wraps imports in `safeImport()` (auto-retry + force-reload on stale-chunk errors after deploys). `src/data/products.ts` is a re-export shim — **add products to the JSON files, not there**. Minimum fields: `id` (slug = URL segment), `title`, `description`, `category` (= JSON filename), `iconName`, `details` (CAS, long description, applications…). `details.canonicalOverride` marks a duplicate SKU as canonicalising elsewhere — `sync-ar-sitemap.mjs` prunes those from the sitemap and `audit:internal-links` flags anything still linking to one.

Adding a **product**: edit the category JSON → add the English URL to `public/sitemap.xml` → add the Arabic strings to `src/i18n/locales/products-ar.json` (275/275 translated today; skipping it leaves the page's `/ar` twin noindex) → `node scripts/sync-ar-sitemap.mjs && node scripts/sync-ar-meta.mjs`.

Adding a **new category** also needs four more edits or the route 404s / prerenders empty: a shim in `src/pages/productCategory/`, one in `src/pages/productDetail/`, and an entry in each App.tsx registry (see "Product routes" above).

Blog articles are inline TypeScript in `src/data/blogArticles.ts` — no CMS.

## Supabase

- Client: [src/integrations/supabase/](src/integrations/supabase/). Migrations: [supabase/migrations/](supabase/migrations/); one-shot bootstrap `supabase/SUPABASE_DATABASE_SETUP.sql`.
- Edge functions ([supabase/functions/](supabase/functions/)): `submit-contact` (form → email + Zoho CRM, Turnstile check), `submit-job-application` (resume upload, rate-limited), `subscribe-newsletter` (→ Zoho), `notify-download` (download-gate leads), `ai-search` (LLM product search), `refresh-analytics` (analytics snapshots), `search-console` (admin-only GSC proxy for the dashboard), `check-ar-indexing` (weekly GSC inspection of `/ar/*` sitemap URLs → `ar_index_status`/`ar_index_events` tables), `mcp` (**auto-generated bundle** of `src/lib/mcp/` — see "Public MCP server" above; do not edit directly). Shared: `_shared/zoho-crm.ts` (OAuth/API helpers), `_shared/rate-limit.ts` (DB-backed sliding window).
- Zoho OAuth token refresh: `scripts/zoho-refresh-token.mjs`.

## Bot protection (Cloudflare Turnstile)

Wired but **disabled** until both env vars exist: `VITE_TURNSTILE_SITE_KEY` (frontend bundle) and `TURNSTILE_SECRET_KEY` (`supabase secrets set` + redeploy `submit-contact`). With only one set, both halves degrade to "captcha disabled" and the form still works. Component: [src/components/Turnstile.tsx](src/components/Turnstile.tsx); server check `verifyTurnstile` in `submit-contact`.

## Cookie consent & third-party script gating

[src/lib/consent.ts](src/lib/consent.ts) is the single source of truth: deny-all default, `cookiePreferences` in localStorage, `hasAnalyticsConsent()`/`hasMarketingConsent()`. **No third-party script may load before its category is granted** — GoogleAnalytics gates on analytics consent, ZohoSalesIQ on marketing consent. Consent can flip mid-session: [CookieConsent.tsx](src/components/CookieConsent.tsx) dispatches `CONSENT_EVENT` (`gc:cookie-consent-changed`) on `window`, and integrations subscribe to load the moment their category is granted. **Any new third-party tag must gate on the consent helper AND subscribe to `CONSENT_EVENT`** — never inject on mount unconditionally.

## Verification commands

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

## Scripts in `scripts/`

- `deploy-supabase.sh` — deploy all edge functions
- `sync-ar-sitemap.mjs` — owns `public/sitemap.xml` (prune + hreflang + /ar twins); see "Arabic SEO model". `--check` is wired into CI as `npm run verify:sitemap-health`
- `sync-ar-meta.mjs` — regenerates `src/i18n/locales/ar-meta.json`, the small eager subset (product title/description, location metaTitle/metaDescription) that keeps the hreflang/indexability gates synchronous while the full `products-ar.json`/`location-pages-ar.json` lazy-load only on `/ar` (they were ~80% of the main JS bundle when statically imported — never re-add a static import of either file). Rerun after editing either translation file; `--check` is CI's `npm run verify:ar-meta`
- `audit-playwright.mjs` — timestamped site snapshots → `audits/<date>-local|prod/`
- `serve-dist.mjs` — serve `dist/` to sanity-check prerendered HTML without rebuilding
- `zoho-refresh-token.mjs` — refresh the Zoho CRM OAuth token
- `verify-prerender-titles.mjs` — see Verification commands
- `verify-seo-routing.mjs` — see "The production routing layer"
- `verify-hostinger-staging.mjs` — smoke-test the site against Hostinger's IP directly (bypassing DNS) before switching A records
- `audit-product-content.mjs` (`npm run audit:product-content`) — ranks product pages by content debt x demand. Built on the 2026-09-08 finding that indexing was never the bottleneck (82% indexed) — thin bodies were. Scores identity (CAS/formula), prose depth, applications, specs and FAQs; pass a GSC Pages export to weight by real impressions
- `audit-internal-links.mjs` (`npm run audit:internal-links`) — reads the **prerendered `dist/`**, not src, because that's the link graph Googlebot sees. Flags links into `canonicalOverride` products, unrelated duplicate SKUs both in the sitemap, and landing pages nothing links to. Run `npm run build` first
- `scan-bordered-surfaces.mjs` — UI consistency sweep: bordered/rounded surfaces that are candidates for `.logo-gradient-border` but don't use it yet. Exits 1 when candidates exist

## Reference docs in this repo

- `docs/seo/` — historical SEO audits and plans; `docs/audits/` — written-up full-site audit reports; `docs/deployment/` — Supabase/env/admin setup guides; `docs/security/` — security audit
- `audits/` (repo root, gitignored) — raw snapshot artifacts from `audit-playwright.mjs` (distinct from `docs/audits/` reports)

## Vestigial files (safe to ignore, do not extend)

- `cloudflare-worker.js`, `wrangler.toml` — the retired Cloudflare Worker routing plan (see "The production routing layer"). Do not add redirects there; `legacyRedirects.ts` is the live layer. The `deploy:cloudflare-worker` npm script is dead too — `wrangler` was removed from devDependencies.
- `tanstack-react-start-server-1.120.0.tgz`, `bun.lock`, `vercel.json` — leftovers from the aborted SSR migration, a Lovable bun trial, and an old Vercel preview respectively. Production is Lovable's CDN (see "Deploy chain"), not Hostinger; runtime router is `react-router-dom` v7.
- `README.md` — project overview only; this file is the real documentation.
