# gcoman.com — Global Chemicals LLC

Project-specific guidance for Claude Code working in this repo.

## Branch workflow

- **Develop is the working branch.** All commits and pushes land here first.
- **Main is the production branch.** It only gets updated after the user has tested changes from `Develop` (locally and/or on Lovable preview) and explicitly approves promotion.
- **Never push directly to `main`** and never open a PR `Develop → main` automatically. The user merges manually after their own QA.
- New work without an existing branch: branch off `Develop`, not `main`.

## Deploy chain

- **Hosting:** Hostinger (Apache), fronted by Cloudflare. Domain resolves to `185.158.133.1`, nameservers `ns1/ns2.dns-parking.com`.
- **Pipeline:** GitHub `main` → Lovable detects change → Lovable runs `vite build` → Lovable FTPs `dist/` to Hostinger `public_html/`.
- **`public/.htaccess` is load-bearing.** It's what makes Hostinger serve prerendered subfolder HTML instead of the SPA shell for every URL. Without it, all 300+ prerendered pages serve as duplicates of the homepage and Google indexing collapses.
- **`public/_redirects` and `public/_headers` are Netlify format and ignored on Hostinger.** They remain as the source-of-truth that `.htaccess` was generated from. Don't rely on them at runtime.
- **Lovable may strip dotfiles when FTPing.** If a deploy doesn't update `.htaccess` on production, log into Hostinger File Manager → `public_html/` → upload it manually from local `dist/.htaccess`.

## SEO architecture (don't break these)

The site uses **client-side React + build-time prerendering** for SEO. Three load-bearing pieces:

1. **`@prerenderer/rollup-plugin`** in `vite.config.ts`. Walks every URL in `public/sitemap.xml` and writes `dist/<route>/index.html` with React + Helmet output baked in.
2. **Apache `.htaccess`** serves the per-route prerendered HTML on Hostinger.
3. **`<SEO>` component** ([src/components/SEO.tsx](src/components/SEO.tsx)) renders a single `<Helmet>` per page with title, meta, og:*, hreflang, canonical.

**Three things that silently break SEO** — agents have tripped on each of these:

### 1. `<Helmet>` without `defer={false}`

`react-helmet-async` defaults `defer: true`, deferring head commits to `requestAnimationFrame`. rAF is unreliable inside the headless puppeteer prerender, and each new `<Helmet>` cancels the previous queued frame, so prerendered pages ship with the homepage `<title>` baked in. **Every `<Helmet>` in this codebase must include `defer={false}`** — there are 17 instances (1 in SEO.tsx, 11 in StructuredData.tsx, plus one each in Login/Privacy/Terms/Sitemap/NotFound). When adding a new `<Helmet>`, always include the prop.

### 2. Hardcoded page-specific meta tags in `index.html`

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

### 3. The `.htaccess`

See "Deploy chain" above. Without it on Hostinger, every URL serves the homepage shell.

## Adding a new page

1. Create the page component (lazy-loaded in [src/App.tsx](src/App.tsx)).
2. Add `<SEO defer={false} title="…" description="…" canonical="https://gcoman.com/…" ogUrl="…" />`.
3. Add the route to [public/sitemap.xml](public/sitemap.xml) so the prerender plugin generates HTML for it.
4. If the page deserves it, add structured data via `[src/components/StructuredData.tsx](src/components/StructuredData.tsx)` — every Helmet inside there also needs `defer={false}`.

## Adding a redirect

Edit BOTH:
- `public/_redirects` (Netlify format, source of truth, easy to read)
- `public/.htaccess` (Apache `RewriteRule ^pattern/?$ /target [R=301,L]` — what actually runs on Hostinger)

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
- [docs/audits/](docs/audits/) — full-site audit reports (security + SEO + bugs combined)
- `public/sitemap.xml` — drives the prerender plugin
