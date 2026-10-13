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

# SEO gates & maintenance (the `verifying-seo-pipeline` skill explains what each one reads)
npm run verify:serp-titles       # CI gate: all 277 product titles ≤60 chars, unique, "Oman" intact
npm run verify:sitemap-health    # CI gate: sitemap.xml is in sync with what <SEO> actually renders
npm run verify:ar-meta           # CI gate: ar-meta.json matches the full AR translation files
npm run sync:sitemap-lastmod     # derive each English <lastmod> from git history
npm run submit:indexnow          # ping IndexNow (Bing/Yandex) with changed URLs

# Catalogue audits (read dist/ or src/ — see "Scripts in scripts/")
npm run audit:product-content    # rank product pages by content debt x demand
npm run audit:internal-links     # link graph in dist/ — run `npm run build` first

# Playwright e2e — 3 modes in playwright.config.ts. Ten spec files in tests/e2e/
# (loading-flow, legacy-redirects, dosing-calculator, quote-funnel, internal-linking,
# lazy-arabic-bundle, category-listing, product-seo-surface, caustic-soda-hub,
# chemistry-hero-budget): targeted coverage of load-bearing flows, not broad assurance.
npm run test:e2e          # vite dev server (port 4179, NOT 8080)
npm run test:e2e:prod     # PROD_BUILD=1 → build:dev + vite preview
npm run test:e2e:ui       # Playwright UI mode — step through a failing spec
BASE_URL=https://gcoman.com npm run test:e2e   # against any remote target
npx playwright test tests/e2e/loading-flow.spec.ts -g "name of test"   # single test

# Supabase edge functions — NOTE: the Supabase project is managed by Lovable
# Cloud and there are NO standalone Supabase credentials (confirmed 2026-09-01).
# CORRECTION 2026-09-22: a Lovable Publish does NOT deploy edge functions.
# Verified in Lovable → More → Cloud → Edge functions, which lists each
# function's "Last updated": after pushing edge-function changes to main and
# publishing (site rebuilt, new deployment id), submit-contact / notify-download
# / subscribe-newsletter still read "21–22 days ago" and a NEWLY ADDED function
# did not appear at all (its URL 404s). Only `mcp` refreshes, because the Vite
# build regenerates that file itself. So: frontend changes ship on Publish,
# edge-function changes DO NOT. They need a Supabase access token and the CLI
# below (or someone to deploy them from the Lovable side). Never tell the user
# an edge-function fix is "live" after a Publish — check that panel first.
./scripts/deploy-supabase.sh                   # deploy all functions
supabase functions deploy submit-contact       # one function
supabase secrets set TURNSTILE_SECRET_KEY=...  # rotate a secret
```

Use **npm**. `bun.lock` is a leftover from a Lovable trial; canonical lockfile is `package-lock.json`.

### Local env

`npm run dev` needs a `.env` (see [.env.example](.env.example)): `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL` — without them the Supabase client, admin dashboard, and every form fail at runtime while the marketing pages still render. These values come from the **Lovable Cloud** project (see "Supabase" below), not from `supabase login` — there is no standalone Supabase credential to issue them. `VITE_TURNSTILE_SITE_KEY` is optional and disables the captcha when blank (see "Bot protection").

## CI (GitHub Actions)

[.github/workflows/ci.yml](.github/workflows/ci.yml): typecheck + lint + `verify:sitemap-health` + `verify:ar-meta` + `verify:serp-titles` + `build:dev` + Playwright smoke on every push/PR to `Develop`/`main`. It is the **only** quality gate before the Lovable auto-deploy ships to production. Before pushing: `npx tsc -b && npm run lint && npm run verify:sitemap-health && npm run verify:ar-meta && npm run verify:serp-titles && npm run test:e2e`.

A full-suite e2e run is ~30–50 s. If it reports minutes-long timings or scattered failures, check `uptime` before suspecting the code — load average above ~8 on this 11-core machine starves puppeteer and produces exactly that shape (one run read 60/77 in 1.5 h, then 77/77 in 47 s on an idle machine). Also note `npm run build 2>&1 | tail -1; echo $?` reports the *pipe's* status, not the build's — redirect to a file and check that instead.

`ci.yml`'s header comment now matches "Deploy chain" below (corrected; the retired-Hostinger-FTP story was removed from it).

## Branch workflow

- **Develop is the working branch** — all commits land here first. New branches fork off `Develop`, not `main`.
- **Main is production.** Don't push to it or open a `Develop → main` PR unprompted — default to the user merging manually after their own QA. Claude may merge `Develop → main`, push, and click **Publish** in Lovable when the user explicitly asks for it in-session (authorized 2026-08-15). The push alone does **not** deploy — Publish is the trigger (see "Deploy chain").

## Map of the code

Much more than a brochure site (admin dashboard, Supabase auth, AI search, download-gated lead capture, dosing calculators — `ls src/pages src/components` shows the rest). The parts the code cannot explain on its own:

- **3D chemistry hero** — `src/components/products/ChemistryHero3D.tsx` + `scene/` (three.js / @react-three/fiber, custom GLSL dissolve shader, Brownian particle physics), gated behind `ChemistryHero.tsx`: `canAfford3D()` only allows the 3D render when not prerendering, `prefers-reduced-motion` is off, viewport ≥1024px, no Save-Data/2G/3G, ≥4 CPU cores, ≥4GB memory — everyone else gets the static prerendered fallback (added 2026-09-22 to take the 3D asset off the CWV-critical path; pinned by `tests/e2e/chemistry-hero-budget.spec.ts`). Tuning tool at `/dev/chemistry-playground` (`ChemistryPlayground.tsx`) — internal, deliberately NOT in the sitemap.
- **SEO landing pages** — `LocationLanding.tsx` (dynamic `/chemicals/:location` — city pages plus country hubs `uae`/`saudi-arabia`) with `ChemicalsHub.tsx` as the `/chemicals` index (location list lives in `src/data/locationIndex.ts` — keep slugs in sync with LocationLanding's `locations` record), plus static ones (`ChemicalSuppliersOman.tsx` etc.). Arabic location strings: `src/i18n/locales/location-pages-ar.json`.
- **Public MCP server** — `src/lib/mcp/` (tools: search/get products, list categories, admin-auth'd lead listings) is the SOURCE; the Vite plugin `mcpPlugin()` from `@lovable.dev/mcp-js` bundles it to `supabase/functions/mcp/index.ts` on build. That output file is auto-generated — edit `src/lib/mcp/`, never the bundle.
- **Product+geo hub pages** — hand-written commercial landings outside the catalogue, all under `/chemical-supplier/*`: `CausticSodaOman.tsx` (the original controlled test, pinned by `tests/e2e/caustic-soda-hub.spec.ts`), `NitricAcidOman.tsx`, `HydrochloricAcidOman.tsx` — plus `ChemicalSuppliersOman.tsx` and `ChemicalSuppliersMiddleEast.tsx`. Each hub carries CAS/concentration, a technical specification table, pack formats, cities served, GCC export lead times, and FAQs matched to `FAQStructuredData`. **Before adding a fourth, read the header comment in `NitricAcidOman.tsx`**: hubs were built for products the site was *absent* for, not for products that merely rank badly — caustic soda has had a hub for weeks and still averages position 57, because the ceiling is referring domains, not page quality. A new hub must also be linked from at least the product page's `guideUrl`, `ChemicalSuppliersOman.tsx` and `Sitemap.tsx`, or it ships orphaned (Google reported "Referring page: None detected" when the nitric hub first went live).

## Deploy chain

- **Hosting: Lovable's CDN serves production** (verified live 2026-07-07: DNS A record `185.158.133.1` is Lovable's ingress — responses carry `x-deployment-id` and Lovable's Cloudflare edge headers). DNS: nameservers `ns1/ns2.dns-parking.com` (Hostinger's), zone managed in Hostinger hPanel.
- **Pipeline:** GitHub `main` → Lovable's **Publish** button (top-right of the Lovable project) runs a fresh `vite build` → publishes `dist/` to its CDN. Verified across several deploys (2026-08-15..17): a push to `main` by itself does nothing in production; someone must click Publish. The full build+publish takes ~7–10 min for 300+ prerendered routes — confirm it landed by watching `curl -sI https://gcoman.com/ | grep x-deployment-id` change. Lovable AI credits do not gate git-sourced publishes, and the "Build unsuccessful / Preview is out of date" badge on GitHub-pushed commits is only the live-preview iframe, not the production build. The CDN resolves clean URLs to the prerendered `dist/<route>/index.html` automatically.
- **The Hostinger server (`147.93.109.106`) is NOT serving the site** — its `public_html` is empty (everything 404s; run `npm run verify:hostinger-staging` to check its state). The old docs' story that Lovable FTPs `dist/` to Hostinger and `.htaccess` is load-bearing does not match production. `public/.htaccess` / `public/_redirects` / `public/_headers` are inert in production; they are kept in sync as the ready-made config for a future move to self-hosted Apache (which would add real 301s, security headers, and brotli — Lovable's CDN supports none of these).

## Architecture: the prerender pipeline

Pure client-side SPA whose SEO depends on three pieces working together. Touching one in isolation silently breaks indexing.

1. **`public/sitemap.xml` is the source of truth for routes.** [vite.config.ts](vite.config.ts) parses it (`routesFromSitemap()`) and feeds `@prerenderer/rollup-plugin`. A route not in the sitemap gets no prerendered HTML — Googlebot sees the empty shell (Soft 404). Conversely, anything meant to stay out of the index (admin, `/dev/*`) must NOT be in the sitemap; the plugin also filters `/admin*` and `/login*` defensively.
   **"Prerendered" and "in the sitemap" are separate decisions.** `NOINDEX_PRERENDER_ROUTES` in `vite.config.ts` is merged into the route list so a page can be prerendered *without* being submitted for indexing. This exists because `/thank-you` carries `noIndex` in its `<SEO>`, but with no prerendered HTML the SPA shell's default meta was served instead — so the page advertised `index, follow` to every crawler that doesn't run JS (which is all the AI crawlers). Put a noindex page here rather than in the sitemap. `/sitemap` is deliberately excluded from both: rendering it blows the 120 s puppeteer timeout.
2. **Puppeteer prerender** renders each route, waits `renderAfterTime: 2500` ms for the lazy chunk + Helmet to commit, writes `dist/<route>/index.html`.
3. **Apache `.htaccess`** serves the prerendered HTML per URL (SPA shell fallback for unknown routes).

### Three things that silently break SEO — agents have tripped on each

**1. `<Helmet>` without `defer={false}`.** `react-helmet-async` defers head commits to rAF, which is unreliable in headless puppeteer, and each new `<Helmet>` cancels the previous queued frame — prerendered pages ship with the homepage `<title>`. **Every `<Helmet>` must include `defer={false}`.** Audit: `grep -rn '<Helmet' src --include='*.tsx' | grep -v 'defer={false}\|HelmetProvider'` — any output (other than multi-line openings) is a bug.

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
- **Prerender correctness.** Loading the category list through a dynamic import inside `useEffect` made the product grid a race against `renderAfterTime`. A 2026-09-10 audit of `dist/` found 16 of 22 category pages shipped to Googlebot with zero links to their own products, orphaning 169 of 277 products. Static seeding removes the race.
- **Bundle size.** One entry per category keeps each category's JSON in its own route chunk instead of every product page pulling all 22.
- `PRODUCT_CATEGORIES` is derived from `Object.keys(productDetailEntries)` — deliberately *not* re-imported from `productLoader.ts`, so App.tsx's root bundle never pulls in that module's eager JSON imports. Unknown categories still fall through to the `/products/:category` wildcard.

### Arabic SEO model (opt-in per page)

An `/ar/*` render is **noindex by default**. It becomes indexable only when the page passes BOTH `arTitle` and `arDescription` to `<SEO>` — that flips the `/ar` render to localized meta + self-referencing `/ar` canonical, and makes both language versions emit reciprocal hreflang (`en`/`ar`/`x-default`). Never pass Arabic meta for a page whose body content is still English — that's the duplicate-content trap the default protects against.

- Currently enabled: **product detail pages with a full translation in `src/i18n/locales/products-ar.json`** (277 of 277 products — full coverage maintained since 2026-08-24; title + description present = enabled, enforced in [src/pages/ProductDetail.tsx](src/pages/ProductDetail.tsx)) and **location pages translated in `location-pages-ar.json`** (includes the UAE/Saudi country hubs).
- `scripts/sync-ar-sitemap.mjs` **owns `public/sitemap.xml`.** Hand-editing is limited to adding or removing an *English* `<url>` block for a new/retired page; **never hand-write an `/ar` URL or an `<xhtml:link>` alternate** — the script is the only thing that may touch those, and it rewrites them on every run. It runs three passes: **prune** every URL that renders `noindex` or canonicalises elsewhere, **annotate** each surviving English page with its `en`/`ar`/`x-default` alternates, and **twin** in the matching `/ar` block so the prerenderer generates it. Indexability is derived from the same sources the components read (`products-ar.json` for products, `location-pages-ar.json` for locations, `details.canonicalOverride` for duplicate SKUs), so the sitemap cannot drift from what `<SEO>` renders. Idempotent; rerun after adding any Arabic translation. `npm run verify:sitemap-health` (`--check`) is the CI gate and fails the build if the file is stale. Current shape (as of 2026-10-05): **657 `<loc>` entries, 296 of them `/ar`** — these numbers drift upward as products/pages are added; treat a sudden *drop* as a bug, not a prune.
- `/tools/dosing-calculator` (`DosingCalculator.tsx`) is deliberately noindex under `/ar` until its copy is localized.
- Everything else under `/ar` (home, about, industries, blog…) stays noindex because its page-level prose (FAQs, breadcrumbs, section copy) is hardcoded English even though the `ar.json` UI layer is 100% complete. To enable a page: wire its prose through `t()`, then pass `arTitle`/`arDescription`, then rerun the sitemap sync/add the URL.

## Adding a new page

1. Create the component, lazy-import in [src/App.tsx](src/App.tsx).
2. Add `<SEO defer={false} title description canonical ogUrl />`.
3. Add the English `<url>` block to [public/sitemap.xml](public/sitemap.xml) so it gets prerendered (skip deliberately for internal-only pages), then run `node scripts/sync-ar-sitemap.mjs` — hand-add English URLs only; the script owns every `/ar` URL and every hreflang block.
4. Add an Arabic mirror under `/ar` if localized.
5. Optional structured data via [src/components/StructuredData.tsx](src/components/StructuredData.tsx) — every Helmet there also needs `defer={false}`.

**If you emit `FAQPageStructuredData`, render the same Q&As visibly too** — use [src/components/FAQSection.tsx](src/components/FAQSection.tsx) (the shared accordion, mounted on Index/About/Contact/Industries/Customers/Certifications). Five pages once published FAQPage schema describing content that appeared nowhere on the page, which is schema Google treats as mismatched rather than as a rich-result opportunity.

## The production redirect layer: client-side

Lovable's CDN has no server-side redirect support, so legacy-URL redirects run **inside the app**: [src/lib/legacyRedirects.ts](src/lib/legacyRedirects.ts) (exact + prefix maps, ported from the retired Cloudflare Worker) consulted by `<LegacyRedirectHandler>` in [src/App.tsx](src/App.tsx), which sits above `<Routes>` so it also intercepts legacy paths that would otherwise match live route patterns (e.g. `/products/acids/*` matches `/products/:category/:productSlug`). It also normalizes trailing slashes. Googlebot follows these JS redirects (weaker than real 301s, but the only option on this host). e2e coverage: `tests/e2e/legacy-redirects.spec.ts`.

**The Cloudflare Worker plan is retired** (2026-07-07, user closed that path); `cloudflare-worker.js` remains as reference only.

Verify production after a deploy: `npm run verify:seo-routing` — note the legacy-301 checks only pass server-side (they'll show the client-side behavior as 200s; confirm redirects in a browser instead).

## Adding a redirect

Edit ALL THREE: `src/lib/legacyRedirects.ts` (**the layer that actually runs**), plus `public/_redirects` and `public/.htaccess` (kept in sync for a future self-hosted setup). Add an e2e case to `tests/e2e/legacy-redirects.spec.ts` for anything load-bearing.

## Product data

Per-category JSON files in `src/data/products/` (22 files, 277 products). `src/data/productLoader.ts` imports them, maps `iconName` strings to Lucide components via `ICON_MAP`, and wraps imports in `safeImport()` (auto-retry + force-reload on stale-chunk errors after deploys). `src/data/products.ts` is a re-export shim — **add products to the JSON files, not there**. Minimum fields: `id` (slug = URL segment), `title`, `description`, `category` (= JSON filename), `iconName`, `details` (CAS, long description, applications…). `details.canonicalOverride` marks a duplicate SKU as canonicalising elsewhere — `sync-ar-sitemap.mjs` prunes those from the sitemap and `audit:internal-links` flags anything still linking to one.

Adding a **product**: edit the category JSON → add the English URL to `public/sitemap.xml` → add the Arabic strings to `src/i18n/locales/products-ar.json` (277/277 translated today; skipping it leaves the page's `/ar` twin noindex) → `node scripts/sync-ar-sitemap.mjs && node scripts/sync-ar-meta.mjs`.

Adding a **new category** also needs four more edits or the route 404s / prerenders empty: a shim in `src/pages/productCategory/`, one in `src/pages/productDetail/`, and an entry in each App.tsx registry (see "Product routes" above).

Blog articles are inline TypeScript in `src/data/blogArticles.ts` — no CMS. Post metadata (including the `relatedProducts` pill links that connect articles to catalogue pages) lives in `src/pages/Blog.tsx`; `BlogPost.tsx` renders the body.

**Article bodies are plain text, not markdown — with one exception.** `BlogPost.tsx` splits content on newlines and renders headings/paragraphs itself; `**bold**`, links and lists are *not* parsed. The exception is **pipe tables**: a run of consecutive `| a | b |` lines is folded into a real `<table>` (the `|---|` separator row is dropped). Anything else markdown-flavoured ships as literal text to readers and crawlers alike. Tables are worth using — comparative data in table form is the format AI engines lift wholesale, and only a handful of pages have one. Note the table parser also feeds the table-of-contents, because a pipe row otherwise satisfies every "is this a heading?" test and gets published as a TOC entry.

## Supabase

- Client: [src/integrations/supabase/](src/integrations/supabase/). Migrations: [supabase/migrations/](supabase/migrations/); one-shot bootstrap `supabase/SUPABASE_DATABASE_SETUP.sql`.
- Edge functions ([supabase/functions/](supabase/functions/)): `submit-contact` (form → email + Zoho CRM, Turnstile check), `submit-job-application` (resume upload, rate-limited), `subscribe-newsletter` (→ Zoho), `notify-download` (download-gate leads), `ai-search` (LLM product search), `refresh-analytics` (analytics snapshots), `search-console` (admin-only GSC proxy for the dashboard), `check-ar-indexing` (weekly GSC inspection of `/ar/*` sitemap URLs → `ar_index_status`/`ar_index_events` tables), `resync-zoho-leads` (admin-only dry-run/execute backfill for contact submissions whose Zoho push failed — see "Admin dashboard" above), `mcp` (**auto-generated bundle** of `src/lib/mcp/` — see "Public MCP server" above; do not edit directly). Shared: `_shared/zoho-crm.ts` (OAuth/API helpers), `_shared/rate-limit.ts` (DB-backed sliding window).
- `submit-contact`/`notify-download`/`subscribe-newsletter` record Zoho push outcome on the row (`zoho_error`/`zoho_synced_at`) instead of silently dropping a failed sync (fixed 2026-09-22) — `resync-zoho-leads` + the admin UI button in `ContactSubmissionsTable.tsx` exist to backfill whatever failed before that fix.
- Zoho OAuth token refresh: `scripts/zoho-refresh-token.mjs`.

## Bot protection (Cloudflare Turnstile)

Wired but **disabled** until both env vars exist: `VITE_TURNSTILE_SITE_KEY` (frontend bundle) and `TURNSTILE_SECRET_KEY` (`supabase secrets set` + redeploy `submit-contact`). With only one set, both halves degrade to "captcha disabled" and the form still works. Component: [src/components/Turnstile.tsx](src/components/Turnstile.tsx); server check `verifyTurnstile` in `submit-contact`.

## Cookie consent & third-party script gating

[src/lib/consent.ts](src/lib/consent.ts) is the single source of truth: deny-all default, `cookiePreferences` in localStorage, `hasAnalyticsConsent()`/`hasMarketingConsent()`. **No third-party script may load before its category is granted** — GoogleAnalytics gates on analytics consent, ZohoSalesIQ on marketing consent. Consent can flip mid-session: [CookieConsent.tsx](src/components/CookieConsent.tsx) dispatches `CONSENT_EVENT` (`gc:cookie-consent-changed`) on `window`, and integrations subscribe to load the moment their category is granted. **Any new third-party tag must gate on the consent helper AND subscribe to `CONSENT_EVENT`** — never inject on mount unconditionally.

## Verifying SEO after a build or deploy; the `scripts/` toolbox

Moved to the **`verifying-seo-pipeline`** skill ([.claude/skills/verifying-seo-pipeline/SKILL.md](.claude/skills/verifying-seo-pipeline/SKILL.md)): the post-build / post-deploy verification commands with their expected output, and what each `scripts/*.mjs` tool reads and why it exists. The three CI gates stay listed under "Commands" above. Invoke the skill before claiming a deploy did not regress SEO.

## Repo-local Claude skills & workflows

`.claude/skills/` holds 18 skills that load automatically in this directory (16 tracked in git; `auditing-platform-presence` and `verifying-seo-pipeline` were still untracked as of 2026-10-13 — commit them, or they vanish the way the workflow below nearly did). Most are generic engineering workflows (TDD, systematic debugging, writing/executing plans, code review). Four are project-specific and divide the SEO work between them — use the right one instead of improvising:

- **`checking-seo-health`** — deep diagnosis inside GSC / GA4 / Lovable / the live site for a periodic or pre/post-deploy check (sitemap submission, crawl/index coverage, Search Console queries, the Arabic-vs-English indexing gap, GA4 swings). Enforces the "four sources, labelled, never blended" rule.
- **`monitoring-search-visibility`** — the cross-engine scoreboard: is gcoman.com #1 on Google, Maps, AI Overviews/AI Mode, Bing, ChatGPT, Perplexity, Gemini, Copilot for the money queries? Every number read live and appended to `docs/seo/visibility-ledger.md`. Use when the user says a competitor shows above us, or for the weekly check.
- **`auditing-platform-presence`** — platform-by-platform "is it configured and consistent?" checklist (GBP, GSC, GA4, Bing Webmaster/Places, Wikipedia/Wikidata, social). The website is the source of truth for NAP, hours and coordinates; every platform must match it.
- **`verifying-seo-pipeline`** — after `npm run build` or a production deploy: the verification commands with expected output, plus the reference for every `scripts/*.mjs` audit/verify tool (what it reads, why it exists).

`.claude/workflows/full-repo-analysis.js` — a saved multi-agent Workflow (12 parallel subsystem deep-reads → adversarial verification of every finding → completeness critic). It is **present on disk but untracked in git** (verified 2026-10-01; an earlier note here wrongly declared it gone). Because nothing in git recovers it, treat it as a local artefact: check it still exists before relying on it, and only run a full-repo audit on explicit user opt-in to multi-agent orchestration.

## Reference docs in this repo

- **[docs/seo/ACTION-PACK.md](docs/seo/ACTION-PACK.md) — the operational instruction set.** What is live, the four off-site actions that decide ranking, and the measurement table. The user works from this one; `docs/seo/` holds the evidence behind it.
- **[docs/seo/HANDOFF.md](docs/seo/HANDOFF.md) — read this before doing any SEO/GEO work.** The programme is mid-flight with a live measurement window, a baseline table with alarm thresholds, and an explicit do-NOT-do list (no more bulk FAQ generation, no more retitling, don't touch the homepage or the JSRS blog). It also records conclusions that cost a full investigation to reach — chiefly that technical GEO is *not* the bottleneck, so writing more code cannot move the remaining ground. Starting fresh work without reading it risks undoing a deliberate hold.
- **[docs/seo/visibility-ledger.md](docs/seo/visibility-ledger.md)** and **[docs/seo/keyword-rank-tracker.md](docs/seo/keyword-rank-tracker.md)** — append-only ledgers written by the `monitoring-search-visibility` skill (one row per run; Oman-localised, personalised, directional not rank-tracker-grade). Never rewrite history in them — add a dated row.
- `docs/seo/` — historical SEO audits and plans; `docs/audits/` — written-up full-site audit reports; `docs/deployment/` — Supabase/env/admin setup guides; `docs/security/` — security audit
- `audits/` (repo root, gitignored) — raw snapshot artifacts from `audit-playwright.mjs` (distinct from `docs/audits/` reports)

## Vestigial files (safe to ignore, do not extend)

- `cloudflare-worker.js`, `wrangler.toml` — the retired Cloudflare Worker routing plan (see "The production redirect layer: client-side"). Do not add redirects there; `legacyRedirects.ts` is the live layer. The `deploy:cloudflare-worker` npm script is dead too — `wrangler` was removed from devDependencies.
- `tanstack-react-start-server-1.120.0.tgz`, `bun.lock`, `vercel.json` — leftovers from the aborted SSR migration, a Lovable bun trial, and an old Vercel preview respectively. Production is Lovable's CDN (see "Deploy chain"), not Hostinger; runtime router is `react-router-dom` v7.
- `README.md` — project overview only; this file is the real documentation.
