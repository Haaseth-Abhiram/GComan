# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

gcoman.com — marketing site + lead-capture platform for Global Chemicals LLC (Oman / GCC chemical supplier).

## Tech stack

Vite 7 + React 18 + TypeScript (loose: `strict: false`, `noImplicitAny: false`) + Tailwind + shadcn/ui (Radix). Routing: `react-router-dom` v7 via `BrowserRouter` in [src/App.tsx](src/App.tsx). Data: `@tanstack/react-query` (the only legitimate `@tanstack/*` package — the router/start packages from the aborted SSR migration were removed; don't reintroduce them). Forms: `react-hook-form` + Zod. Backend: Supabase (Postgres + auth + storage + Deno edge functions). i18n: `i18next`, `en` default (unprefixed URLs), `ar` under `/ar/*`. Path alias `@/` → `src/`.

## Commands

```bash
npm run dev               # vite dev server on port 8080
npm run build             # production build → dist/  (prerender plugin; ~5–10 min for 300+ routes)
npm run build:dev         # production-shaped build, mode=development, no prerender
npm run lint              # eslint
npx tsc -b                # typecheck (no npm script; CI runs this)
npm run preview           # serve dist/ locally

# Playwright e2e — 3 modes in playwright.config.ts. Coverage is one smoke file
# (tests/e2e/loading-flow.spec.ts): "tests pass" is a smoke check, not broad assurance.
npm run test:e2e          # vite dev server (port 4179, NOT 8080)
npm run test:e2e:prod     # PROD_BUILD=1 → build:dev + vite preview
BASE_URL=https://gcoman.com npm run test:e2e   # against any remote target
npx playwright test tests/e2e/loading-flow.spec.ts -g "name of test"   # single test

# Supabase edge functions
./scripts/deploy-supabase.sh                   # deploy all functions
supabase functions deploy submit-contact       # one function
supabase secrets set TURNSTILE_SECRET_KEY=...  # rotate a secret
```

Use **npm**. `bun.lock` is a leftover from a Lovable trial; canonical lockfile is `package-lock.json`.

## CI (GitHub Actions)

[.github/workflows/ci.yml](.github/workflows/ci.yml): typecheck + lint + `build:dev` + Playwright smoke on every push/PR to `Develop`/`main`. It is the **only** quality gate before the Lovable auto-deploy ships to production. Before pushing: `npx tsc -b && npm run lint && npm run test:e2e`.

## Branch workflow

- **Develop is the working branch** — all commits land here first. New branches fork off `Develop`, not `main`.
- **Main is production.** Never push to it or open a `Develop → main` PR automatically; the user merges manually after their own QA.

## Map of the code

Much more than a brochure site. Beyond the obvious marketing pages:

- **Admin dashboard** — `src/pages/Admin.tsx` + `src/components/admin/`: analytics charts (Recharts), contact/download/job-application/newsletter tables with Excel export (`src/lib/exportToExcel.ts`, xlsx), resume browser with PDF preview (pdfjs-dist), activity feed. Guarded by `AdminRoute` + role checks (`src/hooks/useUserRole.ts`).
- **Auth** — `src/pages/Login.tsx` + `src/contexts/AuthContext.tsx`: Supabase email/password with recovery and role-based access.
- **AI product search** — `src/components/AISearchDialog.tsx` → `ai-search` edge function (LLM-backed, markdown responses).
- **Lead capture** — `DownloadGateDialog.tsx` gates resource downloads behind name/email → `notify-download` edge function → Zoho CRM.
- **3D chemistry hero** — `src/components/products/ChemistryHero3D.tsx` + `scene/` (three.js / @react-three/fiber, custom GLSL dissolve shader, Brownian particle physics). Tuning tool at `/dev/chemistry-playground` (`ChemistryPlayground.tsx`) — internal, deliberately NOT in the sitemap.
- **SEO landing pages** — `LocationLanding.tsx` (dynamic `/chemicals/:location`), plus static ones (`ChemicalSuppliersOman.tsx` etc.).
- **Integrations** — `GoogleAnalytics.tsx`, `ZohoSalesIQ.tsx`, `Turnstile.tsx`, `WhatsAppButton.tsx`, `CookieConsent.tsx`.
- **i18n data** — `src/i18n/locales/`: `en.json`, `ar.json`, plus `products-ar.json` (translated product names/descriptions).

## Deploy chain

- **Hosting:** Hostinger (Apache) fronted by Cloudflare. Domain → `185.158.133.1`, nameservers `ns1/ns2.dns-parking.com`.
- **Pipeline:** GitHub `main` → Lovable runs `vite build` → Lovable FTPs `dist/` to Hostinger `public_html/`.
- **`public/.htaccess` is load-bearing** — it makes Hostinger serve per-route prerendered HTML instead of the SPA shell. Without it, all 300+ pages serve as homepage duplicates and Google indexing collapses.
- `public/_redirects` / `public/_headers` are Netlify format, **ignored on Hostinger** — kept only as the human-readable source `.htaccess` was generated from.
- **Lovable may strip dotfiles when FTPing.** If a deploy doesn't update `.htaccess`, upload it manually via Hostinger File Manager from local `dist/.htaccess`.

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
- All pages are `React.lazy` + `<Suspense fallback={<Loading />}>` — follow this for new pages so per-route chunks stay small.
- Locale-aware link helpers: [src/lib/langRouting.ts](src/lib/langRouting.ts), `<LocalizedLink>`.

## Adding a new page

1. Create the component, lazy-import in [src/App.tsx](src/App.tsx).
2. Add `<SEO defer={false} title description canonical ogUrl />`.
3. Add the route to [public/sitemap.xml](public/sitemap.xml) so it gets prerendered (skip deliberately for internal-only pages).
4. Add an Arabic mirror under `/ar` if localized.
5. Optional structured data via [src/components/StructuredData.tsx](src/components/StructuredData.tsx) — every Helmet there also needs `defer={false}`.

## Cloudflare Worker (the live routing layer)

`cloudflare-worker.js` (repo root) is the **only routing mechanism that actually fires in production** — Lovable's CDN ignores `_redirects` and sits in front of Hostinger so `.htaccess` is never reached. The Worker 301s legacy URLs (`EXACT_REDIRECTS`/`PREFIX_REDIRECTS` maps) and rewrites clean URLs to `path/index.html` for crawlers.

- Deploy: `CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... npm run deploy:cloudflare-worker`
- Verify: `npm run verify:seo-routing` — all 5 checks must pass with `[worker: prerender-rewrite]` on product pages. `(no header)` means DNS hasn't switched to Cloudflare yet.
- **Prerequisite:** the Worker only intercepts traffic once gcoman.com's nameservers are `dion.ns.cloudflare.com`/`jule.ns.cloudflare.com`. They are currently `ns1/ns2.dns-parking.com` (zone `pending`), so deploys upload the Worker but traffic bypasses it. Before switching NS, add in Cloudflare DNS: `A gcoman.com → 185.158.133.1` (proxied) and `CNAME www → gcoman.com` (proxied).

## Adding a redirect

Edit ALL THREE: `public/_redirects` (readable source of truth), `public/.htaccess` (runs if traffic hits Hostinger directly), and `cloudflare-worker.js` maps (the layer that actually fires — then `npm run deploy:cloudflare-worker`).

## Product data

Per-category JSON files in `src/data/products/` (22 files, ~768 products). `src/data/productLoader.ts` imports them, maps `iconName` strings to Lucide components via `ICON_MAP`, and wraps imports in `safeImport()` (auto-retry + force-reload on stale-chunk errors after deploys). `src/data/products.ts` is a re-export shim — **add products to the JSON files, not there**. Minimum fields: `id` (slug = URL segment), `title`, `description`, `category` (= JSON filename), `iconName`, `details` (CAS, long description, applications…). After adding a product, add its canonical URL to `public/sitemap.xml`. Arabic product strings live in `src/i18n/locales/products-ar.json`.

Blog articles are inline TypeScript in `src/data/blogArticles.ts` — no CMS.

## Supabase

- Client: [src/integrations/supabase/](src/integrations/supabase/). Migrations: [supabase/migrations/](supabase/migrations/); one-shot bootstrap `supabase/SUPABASE_DATABASE_SETUP.sql`.
- Edge functions ([supabase/functions/](supabase/functions/)): `submit-contact` (form → email + Zoho CRM, Turnstile check), `submit-job-application` (resume upload, rate-limited), `subscribe-newsletter` (→ Zoho), `notify-download` (download-gate leads), `ai-search` (LLM product search), `refresh-analytics` (analytics snapshots). Shared: `_shared/zoho-crm.ts` (OAuth/API helpers), `_shared/rate-limit.ts` (DB-backed sliding window).
- Zoho OAuth token refresh: `scripts/zoho-refresh-token.mjs`.

## Bot protection (Cloudflare Turnstile)

Wired but **disabled** until both env vars exist: `VITE_TURNSTILE_SITE_KEY` (frontend bundle) and `TURNSTILE_SECRET_KEY` (`supabase secrets set` + redeploy `submit-contact`). With only one set, both halves degrade to "captcha disabled" and the form still works. Component: [src/components/Turnstile.tsx](src/components/Turnstile.tsx); server check `verifyTurnstile` in `submit-contact`.

## Cookie consent & third-party script gating

[src/lib/consent.ts](src/lib/consent.ts) is the single source of truth: deny-all default, `cookiePreferences` in localStorage, `hasAnalyticsConsent()`/`hasMarketingConsent()`. **No third-party script may load before its category is granted** — GoogleAnalytics gates on analytics consent, ZohoSalesIQ on marketing consent. Consent can flip mid-session: [CookieConsent.tsx](src/components/CookieConsent.tsx) dispatches `CONSENT_EVENT` (`gc:cookie-consent-changed`) on `window`, and integrations subscribe to load the moment their category is granted. **Any new third-party tag must gate on the consent helper AND subscribe to `CONSENT_EVENT`** — never inject on mount unconditionally.

## Verification commands

After a build or production deploy, confirm SEO didn't regress:

```bash
npm run verify:prerender-titles   # scan dist/ for pages with homepage default <title>; expect 0
npm run verify:seo-routing        # production: Worker rewriting clean URLs to prerendered HTML

# Production: prerendered HTML served (not SPA shell)
curl -s https://gcoman.com/career | grep -oE '<title>[^<]+'
# expected: <title>Careers & Jobs | Join Our Team | Global Chemicals LLC

# Production: legacy 301s fire
curl -sI https://gcoman.com/service/calcium-carbonate/ -o /dev/null -w '%{http_code} %{redirect_url}\n'
# expected: 301 https://gcoman.com/products/water-treatment/calcium-carbonate-water
```

## Scripts in `scripts/`

- `deploy-supabase.sh` — deploy all edge functions
- `add-hreflang-to-sitemap.mjs` — re-sync hreflang annotations in `public/sitemap.xml` after route changes
- `audit-playwright.mjs` — timestamped site snapshots → `audits/<date>-local|prod/`
- `serve-dist.mjs` — serve `dist/` to sanity-check prerendered HTML without rebuilding
- `zoho-refresh-token.mjs` — refresh the Zoho CRM OAuth token
- `verify-prerender-titles.mjs` — see Verification commands
- `verify-seo-routing.mjs` — see Cloudflare Worker
- `verify-hostinger-staging.mjs` — smoke-test the site against Hostinger's IP directly (bypassing DNS) before switching A records

## Reference docs in this repo

- `docs/seo/` — historical SEO audits and plans; `docs/audits/` — written-up full-site audit reports; `docs/deployment/` — Supabase/env/admin setup guides; `docs/security/` — security audit
- `audits/` (repo root, gitignored) — raw snapshot artifacts from `audit-playwright.mjs` (distinct from `docs/audits/` reports)

## Vestigial files (safe to ignore, do not extend)

- `tanstack-react-start-server-1.120.0.tgz`, `bun.lock`, `vercel.json` — leftovers from the aborted SSR migration, a Lovable bun trial, and an old Vercel preview respectively. Production is Hostinger; runtime router is `react-router-dom` v7.
- `README.md` — generic Lovable template; this file is the real documentation.
