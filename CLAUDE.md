# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

gcoman.com — marketing site for Global Chemicals LLC (Oman / GCC chemical supplier).

## Tech stack

Vite 7 + React 18 + TypeScript (loose: `strict: false`, `noImplicitAny: false`) + Tailwind + shadcn/ui (Radix). Routing is `react-router-dom` v7 (the `@tanstack/*` deps are vestigial from an aborted SSR migration — current runtime uses `BrowserRouter` in [src/App.tsx](src/App.tsx)). Data form: `react-hook-form` + Zod. Server-side: Supabase (Postgres + edge functions in `supabase/functions/`). i18n: `i18next` with `en` (default, unprefixed URLs) and `ar` (prefixed `/ar/*`). Path alias `@/` → `src/`.

## Commands

```bash
npm run dev               # vite dev server on port 8080
npm run build             # production build → dist/  (runs the prerender plugin; ~5–10 min for 300+ routes)
npm run build:dev         # production-shaped build with mode=development, no prerender
npm run lint              # eslint
npm run preview           # serve dist/ locally

# Playwright e2e — see playwright.config.ts for the three modes.
# Coverage is currently a single file: tests/e2e/loading-flow.spec.ts. "Tests pass" is a smoke check, not broad assurance.
npm run test:e2e          # vite dev server, fast (default port 4179, NOT 8080)
npm run test:e2e:ui       # interactive UI mode
npm run test:e2e:prod     # PROD_BUILD=1 → build:dev + vite preview (same JS as prod, no prerender)
BASE_URL=https://gcoman.com npm run test:e2e   # run against any remote target, no local server
npx playwright test tests/e2e/loading-flow.spec.ts -g "name of test"   # single test

# Supabase edge functions
./scripts/deploy-supabase.sh                                  # deploys all functions
supabase functions deploy submit-contact                      # one function
supabase secrets set TURNSTILE_SECRET_KEY=...                 # rotate a secret
```

Use **npm** — the commands above assume it. `bun.lock` is a leftover from a Lovable build trial; the canonical lockfile is `package-lock.json`.

## Scripts in `scripts/`

- `deploy-supabase.sh` — deploys all edge functions in one shot
- `add-hreflang-to-sitemap.mjs` — keeps hreflang annotations in `public/sitemap.xml` in sync after adding/removing localized routes
- `audit-playwright.mjs` — drives the timestamped snapshots under `audits/<date>-local|prod/`
- `serve-dist.mjs` — serves `dist/` so you can sanity-check prerendered HTML without rebuilding
- `zoho-refresh-token.mjs` — refreshes the Zoho CRM OAuth token (the Zoho SalesIQ widget is mounted via [src/components/ZohoSalesIQ.tsx](src/components/ZohoSalesIQ.tsx))

## Branch workflow

- **Develop is the working branch.** All commits and pushes land here first.
- **Main is the production branch.** Only updated after the user has tested changes from `Develop` (locally and/or on Lovable preview) and explicitly approves promotion.
- **Never push directly to `main`** and never open a PR `Develop → main` automatically. The user merges manually after their own QA.
- New work without an existing branch: branch off `Develop`, not `main`.

## Deploy chain

- **Hosting:** Hostinger (Apache), fronted by Cloudflare. Domain resolves to `185.158.133.1`, nameservers `ns1/ns2.dns-parking.com`.
- **Pipeline:** GitHub `main` → Lovable detects change → Lovable runs `vite build` → Lovable FTPs `dist/` to Hostinger `public_html/`.
- **`public/.htaccess` is load-bearing.** It's what makes Hostinger serve prerendered subfolder HTML instead of the SPA shell for every URL. Without it, all 300+ prerendered pages serve as duplicates of the homepage and Google indexing collapses.
- **`public/_redirects` and `public/_headers` are Netlify format and ignored on Hostinger.** They remain as the source-of-truth that `.htaccess` was generated from. Don't rely on them at runtime.
- **Lovable may strip dotfiles when FTPing.** If a deploy doesn't update `.htaccess` on production, log into Hostinger File Manager → `public_html/` → upload it manually from local `dist/.htaccess`.

## Architecture: the prerender pipeline

The site is a pure client-side SPA whose SEO depends on three pieces working together. Touching any one of them in isolation is the fastest way to silently break indexing.

1. **`public/sitemap.xml` is the source of truth for routes.** [vite.config.ts](vite.config.ts) parses it at build time (`routesFromSitemap()`) and feeds the URL list to `@prerenderer/rollup-plugin`. A route that isn't in the sitemap doesn't get a prerendered HTML file — Googlebot sees the empty SPA shell, which Google classifies as Soft 404. Conversely, anything you want kept *out* of the index (admin, internal tools like `/dev/chemistry-playground`) must NOT be in the sitemap; the prerender plugin also filters `/admin*` and `/login*` defensively.
2. **Puppeteer prerender** renders each route, waits `renderAfterTime: 2500` ms for the lazy chunk + Helmet to commit, and writes `dist/<route>/index.html`.
3. **Apache `.htaccess`** on Hostinger serves the per-route prerendered HTML when the URL is hit (and falls back to the SPA shell for unknown routes).

### Three things that silently break SEO — agents have tripped on each

#### 1. `<Helmet>` without `defer={false}`

`react-helmet-async` defaults `defer: true`, deferring head commits to `requestAnimationFrame`. rAF is unreliable inside the headless puppeteer prerender, and each new `<Helmet>` cancels the previous queued frame, so prerendered pages ship with the homepage `<title>` baked in. **Every `<Helmet>` in this codebase must include `defer={false}`** — currently 17 instances (1 in SEO.tsx, 11 in StructuredData.tsx, plus one each in Login/Privacy/Terms/Sitemap/NotFound). When adding a new `<Helmet>`, always include the prop.

#### 2. Hardcoded page-specific meta tags in `index.html`

Helmet **appends** new `<meta>` tags rather than replacing existing ones. So any `description`/`og:*`/`twitter:*`/`hreflang` baked into `index.html` produces a homepage-default duplicate ahead of the page-specific Helmet-injected tag. Google reads the first occurrence (the wrong one).

`index.html` should ONLY hold:
- charset, viewport
- `<title>` fallback (Helmet replaces this — title is a singleton)
- author
- search-engine verification tokens (`google-site-verification`, `msvalidate.01`)
- `geo.*` and `ICBM` (Helmet doesn't manage these)
- `content-language`, `distribution`, `target`
- font preconnect/preload `<link>`s
- favicons
- the global Organization / LocalBusiness / WebSite / BreadcrumbList JSON-LD scripts (these are the single source of truth for site-wide entity schema; do not also mount `<LocalBusinessStructuredData />` from page components — it produces same-`@id` duplicates)

Everything else (`description`, `keywords`, `robots`, `og:*`, `twitter:*`, `hreflang`, `canonical`) belongs in `<SEO>`. There's a comment block in `index.html` calling this out — preserve it.

#### 3. The `.htaccess`

See "Deploy chain" above. Without it on Hostinger, every URL serves the homepage shell.

## Routing & i18n

- Routes are declared once for English (unprefixed) and again under `/ar/*` in [src/App.tsx](src/App.tsx). The `/ar` branch wraps children in `<LangLayout>`, which flips `i18next` to `ar`. `/en` and `/en/*` 301 in-app to the unprefixed equivalents to avoid duplicate-content.
- All page components are lazy-loaded via `React.lazy` + `<Suspense fallback={<Loading />}>`. New pages should follow the same pattern so the prerender per-route chunk stays small.
- Locale-aware link helpers live in [src/lib/langRouting.ts](src/lib/langRouting.ts).

## Adding a new page

1. Create the page component and lazy-import it in [src/App.tsx](src/App.tsx).
2. Add `<SEO defer={false} title="…" description="…" canonical="https://gcoman.com/…" ogUrl="…" />` ([src/components/SEO.tsx](src/components/SEO.tsx)).
3. Add the route to [public/sitemap.xml](public/sitemap.xml) so the prerender plugin generates HTML for it. (Skip this step deliberately for internal-only pages.)
4. Add an Arabic mirror under the `/ar` route block if the page should be localized.
5. If the page deserves it, add structured data via [src/components/StructuredData.tsx](src/components/StructuredData.tsx) — every Helmet inside there also needs `defer={false}`.

## Adding a redirect

Edit BOTH:
- `public/_redirects` (Netlify format, source of truth, easy to read)
- `public/.htaccess` (Apache `RewriteRule ^pattern/?$ /target [R=301,L]` — what actually runs on Hostinger)

## Supabase

- Client config: [src/integrations/supabase/](src/integrations/supabase/).
- Edge functions in [supabase/functions/](supabase/functions/): `submit-contact`, `submit-job-application`, `subscribe-newsletter`, `notify-download`, `ai-search`, `refresh-analytics`. Shared helpers in `supabase/functions/_shared/`.
- Migrations in [supabase/migrations/](supabase/migrations/); the one-shot DB bootstrap is `supabase/SUPABASE_DATABASE_SETUP.sql`.
- Deploy with `./scripts/deploy-supabase.sh` or per-function `supabase functions deploy <name>`.

## Bot protection (Cloudflare Turnstile)

The contact form is wired for Turnstile but ships with the captcha **disabled** until both env vars are set:

- **`VITE_TURNSTILE_SITE_KEY`** — public key in the bundle. Set in your Vercel/Hostinger frontend env, redeploy.
- **`TURNSTILE_SECRET_KEY`** — server secret for the Supabase edge function. Set with `supabase secrets set TURNSTILE_SECRET_KEY=...`, then `supabase functions deploy submit-contact`.

If only one is set, both halves degrade to "captcha disabled" and the form still works. Get free keys at <https://dash.cloudflare.com/?to=/:account/turnstile>.

Component: [src/components/Turnstile.tsx](src/components/Turnstile.tsx). Server check: [supabase/functions/submit-contact/index.ts](supabase/functions/submit-contact/index.ts) (`verifyTurnstile`).

## Verification commands

After a build (or after a production deploy), run these to confirm SEO didn't regress:

```bash
# Local: count prerendered pages with the homepage default title baked in.
# Should always be 0.
python3 -c "
import re, os
DIST='dist'; HOME_T='Chemical Suppliers in Oman & GCC | Global Chemicals LLC'
strip=lambda s: re.sub(r'<!--.*?-->','',s,flags=re.DOTALL)
bad=[]
for r,_,fs in os.walk(DIST):
    for f in fs:
        if f!='index.html': continue
        p=os.path.join(r,f); rel=re.sub(r'/?index\.html$','',p[len(DIST)+1:]) or '(home)'
        with open(p) as h: html=strip(h.read())
        m=re.search(r'<title[^>]*>([^<]+)</title>', html); t=(m.group(1) if m else '').replace('&amp;','&')
        if rel!='(home)' and t==HOME_T: bad.append(rel)
print(f'{len(bad)} routes with homepage default title')
for b in bad[:10]: print(' -',b)
"

# Production: confirm Hostinger is serving prerendered HTML (not the SPA shell).
curl -s https://gcoman.com/career | grep -oE '<title>[^<]+'
# expected: <title>Careers & Jobs | Join Our Team | Global Chemicals LLC

curl -sI https://gcoman.com/career/index.html -o /dev/null -w '%{http_code}\n'
# expected: 200

# Production: confirm legacy 301s fire (proves Apache is reading .htaccess).
curl -sI https://gcoman.com/service/calcium-carbonate/ -o /dev/null -w '%{http_code} %{redirect_url}\n'
# expected: 301 https://gcoman.com/products/water-treatment/calcium-carbonate-water
```

## Reference docs in this repo

- [docs/seo/](docs/seo/) — historical SEO audits, GSC issue reports, improvement plans
- [docs/audits/](docs/audits/) — full-site audit **reports** (markdown, security + SEO + bugs combined)
- `audits/` (repo root) — full-site audit **snapshots** produced by `scripts/audit-playwright.mjs`, one folder per run (e.g. `2026-05-04-local/`, `2026-05-04-prod/`). Distinct from `docs/audits/` — these are raw artifacts, those are written-up reports.
- `public/sitemap.xml` — drives the prerender plugin

## Vestigial files (safe to ignore, do not extend)

- `tanstack-react-start-server-1.120.0.tgz` at repo root — leftover from the aborted SSR migration. Don't add new `@tanstack/react-router` or `@tanstack/react-start` usage; the runtime is `react-router-dom` v7.
- `vercel.json` — `cleanUrls`/`trailingSlash` config from an earlier Vercel preview setup. Production is Hostinger (see "Deploy chain"); Vercel is not the host.
