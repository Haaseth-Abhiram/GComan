# gcoman.com — Full Site Audit
**Date:** 2026-05-02
**Branch audited:** `Develop` (commit 57d5acd)
**Scope:** Bugs, security, SEO, infra, deploy chain
**Method:** 3 parallel subagents (security / SEO+infra / bug-quality) + production probes via curl + local build verification

---

## Executive summary

The codebase itself is in good shape. TypeScript is clean, all 17 `<Helmet>` instances correctly set `defer={false}`, `index.html` is pure (no page-meta baked in), there are no XSS sinks or hardcoded secrets, and the local build produces all 336 prerendered pages with correct per-route titles, descriptions and canonicals. The CLAUDE.md verification check `0 routes with homepage default title` passes locally.

**However, production is critically broken.** Every URL on https://gcoman.com (homepage, `/career`, `/products`, `/contact`, etc.) currently returns the same 165,232-byte SPA shell with **homepage** Helmet metadata. Legacy 301 redirects do not fire. 404s return HTTP 200. The serving infrastructure looks like a Vercel-style edge platform that is **completely ignoring the `.htaccess`** that the entire SEO strategy depends on. This is exactly the failure CLAUDE.md describes ("Without it, all 300+ prerendered pages serve as duplicates of the homepage and Google indexing collapses") — and it is happening right now.

Everything else in this report is rounding error compared to fixing this.

---

## 🚨 CRITICAL — Production is serving the SPA shell on every URL

### Evidence

**1. Every URL returns identical HTML.**

```
$ curl -s https://gcoman.com/        -o /tmp/home.html
$ curl -s https://gcoman.com/career  -o /tmp/career.html
$ curl -s https://gcoman.com/products -o /tmp/products.html
$ wc -c /tmp/home.html /tmp/career.html /tmp/products.html
  165232 /tmp/home.html
  165232 /tmp/career.html
  165232 /tmp/products.html
$ diff /tmp/home.html /tmp/career.html
(empty — files are byte-for-byte identical)
```

**2. Helmet output on every URL is the homepage's.**

```
$ curl -s https://gcoman.com/career | grep -oE '<title[^>]*>[^<]+|<link rel="canonical"[^>]*>'
<title>Chemical Suppliers in Oman & GCC | Global Chemicals LLC
<link rel="canonical" href="https://gcoman.com/" data-rh="true">
```

The `data-rh="true"` confirms Helmet rendered server-side, but it rendered *homepage* values for `/career`. This is what you'd see if the SPA shell `index.html` (which contains the homepage's pre-baked Helmet output from prerender) is being served for every URL.

**3. `.htaccess` is being completely bypassed.**

| Probe | Expected (per CLAUDE.md) | Actual |
|---|---|---|
| `curl -sI https://gcoman.com/service/calcium-carbonate/` | `301 → /products/water-treatment/calcium-carbonate-water` | `200` |
| `curl -sI https://gcoman.com/this-route-does-not-exist-zzz` | `404` | `200` |
| `Content-Security-Policy` header (set by .htaccess) | present | **missing** |
| `X-Frame-Options` header (set by .htaccess) | `SAMEORIGIN` | **missing** |
| `Permissions-Policy` header (set by .htaccess) | present | **missing** |
| `www.gcoman.com` → `gcoman.com` | `301` (per .htaccess) | `302` |

**4. Production headers point to a non-Apache platform.**

```
HTTP/2 200
server: cloudflare
cf-ray: 9f5932e7fa768118-DXB
x-deployment-id: 7801ecc6-3d3e-4f11-94b1-abb271d10829
set-cookie: __dpl=7801ecc6-3d3e-4f11-94b1-abb271d10829; ... Max-Age=604800
cache-control: no-cache, must-revalidate, max-age=0
```

The `__dpl` cookie + `x-deployment-id` header are Vercel-style deployment-isolation fingerprints. There is no `Server: Apache` header. Even bypassing Cloudflare and hitting `185.158.133.1` directly produces the same response — meaning the IP at the end of your DNS is the edge platform itself, not a Hostinger Apache origin.

**5. The local build is healthy — the bug is purely in deployment.**

After running `npm run build` fresh:

```
336 index.html files generated, 0 have homepage default title
dist/career/index.html size:    134,285 bytes
dist/index.html size:           163,701 bytes
dist/contact/index.html size:   275,964 bytes
dist/products/index.html size:  148,840 bytes
dist/career/index.html title:        "Careers & Jobs | Join Our Team | Global Chemicals LLC"
dist/career/index.html canonical:    https://gcoman.com/career
dist/career/index.html description:  career-specific copy
dist/.htaccess present:              yes (11,282 bytes)
```

Local prerender produces correct, distinct HTML per route. Production serves identical HTML for every route. **The build is not the problem; the deploy chain is.**

### What this means

- ~336 prerendered pages are serving as duplicates of the homepage. Google sees one page.
- ~70 legacy WordPress 301 redirects do not fire. All those legacy URLs serve the homepage shell as 200 (soft-404), worse than a real 301.
- The 404 page never serves; nonexistent URLs return homepage as 200.
- Custom security headers from `.htaccess` are not applied. Only the platform's defaults (HSTS, Referrer-Policy, X-Content-Type-Options) make it through.

### Root cause hypothesis

The deploy chain in CLAUDE.md ("Lovable detects change → vite build → FTP `dist/` to Hostinger Apache") does not match what is actually serving traffic. Either:

- **(a) Lovable is hosting it on Vercel/their own edge platform** rather than FTPing to Hostinger as documented. Vercel ignores `.htaccess` (it's Apache-specific). The `__dpl` cookie strongly supports this.
- **(b) Lovable IS FTPing to Hostinger** but only `index.html` and assets land — the per-route subdirectories and/or `.htaccess` are being stripped on upload (CLAUDE.md already warns Lovable "may strip dotfiles"). However, the response headers don't look like Apache's, which weakens this option.

### Recommended next steps (in order)

1. **Confirm the actual platform.** Log into your Lovable project dashboard → Settings → Domains/Deployment, and into your Hostinger account → File Manager → `public_html/`. Check whether the per-route `career/index.html`, `contact/index.html`, etc. files actually exist on the Hostinger disk. Check whether Lovable shows a Vercel/Cloudflare integration.
2. **If it's Vercel** (most likely given the cookie): you need a `vercel.json` at the repo root with rewrites for the prerendered subdirectory layout and the 70+ legacy 301s. `_redirects` is Netlify format and is ignored on Vercel; `.htaccess` is Apache and ignored on Vercel.
3. **If it's Netlify**: `public/_redirects` already exists as the source-of-truth. Verify Netlify is reading it (Netlify also won't serve the prerendered subdirs without a `[[redirects]]` rule mapping clean URLs to `<route>/index.html`).
4. **If it really is Hostinger**: re-upload `dist/` with `.htaccess` and all subdirectories preserved (Hostinger File Manager → upload manually if FTP keeps stripping things).
5. **Re-run the CLAUDE.md verification commands after the fix** — they're the quickest way to confirm production is back to normal:
   ```bash
   curl -s https://gcoman.com/career | grep -oE '<title>[^<]+'
   # expected: <title>Careers & Jobs | Join Our Team | Global Chemicals LLC

   curl -sI https://gcoman.com/service/calcium-carbonate/ -o /dev/null -w '%{http_code} %{redirect_url}\n'
   # expected: 301 https://gcoman.com/products/water-treatment/calcium-carbonate-water
   ```

---

## HIGH severity

### H1 — Duplicate JSON-LD schemas with the same `@id` and conflicting fields

`index.html` ships a global `LocalBusiness` schema with `@id: https://gcoman.com/#organization`. `src/components/StructuredData.tsx:488–573` (`LocalBusinessStructuredData`) emits a second `LocalBusiness` with the **same `@id`** but different field values:

| Field | `index.html` | `StructuredData.tsx` |
|---|---|---|
| `priceRange` | `"$$$$"` | `"$$"` |
| `email` | `info@gcoman.com` | `sales@gcoman.com` |
| `closes` | `18:00` | `17:00` |
| `postalCode` | (one value) | (different) |

Same risk for `OrganizationStructuredData` at `src/components/StructuredData.tsx:579–687`.

**Fix:** grep for `<LocalBusinessStructuredData` and `<OrganizationStructuredData` mounts. Either drop the components (rely on the `index.html` global) or remove the global from `index.html` and emit per-page only. Pick one. Don't ship both with the same `@id`.

### H2 — Dependency vulnerabilities in production deps

`npm audit --omit=dev`: 0 critical, 5 high, 3 moderate. The exploitable one in this app:

- **`xlsx <0.20.2`** — Prototype Pollution + ReDoS (GHSA-4r6h-8v6p-xvw6, GHSA-5pgg-2g8v-p4x9). User-uploaded xlsx files can land in admin code paths. SheetJS publishes fixes via their CDN, not npm.
  - **Fix:** replace with `exceljs`, or pin `xlsx@^0.20.2` from `cdn.sheetjs.com`.

Other prod-dep highs (`lodash`, `minimatch`, `picomatch`, `glob`) are transitive build/tooling. `npm audit fix` should clear most.

---

## MEDIUM severity

### M1 — Contact form is open to unauthenticated POSTs with weak rate limit

`supabase/functions/submit-contact/index.ts` has 5 / hour / IP rate limit (`:48–64`). No captcha, no honeypot. IPv6 /64 rotation or a small proxy pool defeats it.

Validation and sanitization are otherwise good: name 2-100 chars, email regex + 255 cap, message 10-5000 chars, `<script>` stripping. Tokens are server-side only (`Deno.env.get`) — confirmed clean.

**Fix:** add Cloudflare Turnstile (free) or hCaptcha — embed token on the form, verify server-side before processing the lead.

### M2 — Supabase client logs userAgent + origin to console on every page load

`src/integrations/supabase/client.ts:10–38` runs `console.log` for `VITE_SUPABASE_URL`, current origin, user agent, plus a fetch test that logs response status — **on every page load, in production**. Minor info disclosure (the SUPABASE_URL is anon-public anyway, so not a leak per se), but cluttery in DevTools.

**Fix:** wrap the entire boot block in `if (import.meta.env.DEV) { … }`.

Total `console.*` count across `src/`: 38. The other 37 are reasonable error logging in `catch` blocks; only this one is always-on chatter.

### M3 — Sitemap is missing hreflang `<xhtml:link>` alternates

`public/sitemap.xml` has 336 URLs, all with `<lastmod>`, no duplicates. The `<SEO>` component emits 15 hreflang `<link>` tags per page (en, en-{OM,AE,SA,QA,KW,BH}, ar, ar-{OM,AE,SA,QA,KW,BH}, x-default), but the sitemap doesn't declare these alternates at the sitemap level. Google will discover them, but slower and less reliably.

**Fix:** add `<xhtml:link rel="alternate" hreflang="…" href="…"/>` siblings inside each `<url>` block, or split into per-language sitemaps with cross-references.

### M4 — Prerender wait is time-based (2.5 s)

`vite.config.ts:74` uses `renderAfterTime: 2500`. If a route's lazy chunk loads slow during prerender, Helmet may not flush. Currently working because `defer={false}` is universal, but fragile under CI variability.

**Fix:** add `renderAfterDocumentEvent` (fire `window.dispatchEvent(new Event('render-event'))` after Helmet commits) or `renderAfterElementExists`. Belt-and-suspenders.

### M5 — Verify legacy redirect target exists

`.htaccess` redirects `/service/calcium-carbonate/` → `/products/water-treatment/calcium-carbonate-water`. Sitemap has `/products/calcium-carbonate` (a category) but I couldn't confirm the specific slug `/products/water-treatment/calcium-carbonate-water` exists. If it 404s, this is a chain-to-nowhere. Will become verifiable with a curl probe once #CRITICAL is fixed and 301s actually fire.

---

## LOW severity / hygiene

### L1 — ESLint: 58 errors + 26 warnings

`npm run lint` output (TypeScript `tsc --noEmit` is clean — these are all lint-only):

| Rule | Count | Where | Cause |
|---|---|---|---|
| `@typescript-eslint/no-explicit-any` | ~30 | `src/components/admin/IntelligentJobApplicationsTable.tsx` (16), `src/pages/Admin.tsx` (6), `supabase/functions/submit-contact/index.ts` (5), `submit-job-application/index.ts` (2) | Supabase generated types missing `status`, `prospect`, `hr_notes` columns |
| `@typescript-eslint/no-require-imports` | 1 | `tailwind.config.ts:118` | Standard shadcn `require("tailwindcss-animate")` |
| `no-useless-escape` | 3 | `submit-job-application/index.ts:44` | Overcautious regex |
| `react-hooks/exhaustive-deps` | 1 | `src/pages/Products.tsx:180` | useMemo missing `products` dep |
| `react-refresh/only-export-components` | 26 | shadcn UI components | Convention; harmless |

**Fix:** regenerate Supabase types with `supabase gen types typescript` to clear the bulk of the `any` casts. The rest are 5-minute fixes.

### L2 — CSP allows `'unsafe-eval'`

`public/.htaccess` CSP allows both `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. `'unsafe-inline'` is needed for GTM blocks; `'unsafe-eval'` is rarely actually needed. **Fix:** drop `'unsafe-eval'`, smoke-test GTM/SalesIQ. (Moot until #CRITICAL is fixed and CSP actually applies in production.)

### L3 — Deprecated `X-XSS-Protection` header

`.htaccess:190` sets `X-XSS-Protection: 1; mode=block`. Modern browsers ignore it; some treat it as harmful. Remove on next edit.

### L4 — Stale doc

`docs/seo/SEO_ISSUES_FOUND.md` lists "critical issues" (duplicate AppRoutes, no `_redirects`, no `/en` 301s, no `/ar/certifications`) that are all already resolved. Archive or delete to avoid confusing future agents.

### L5 — `SEO/gcoman_GSC_Issues_ActionPlan.docx` is binary + untracked

Convert to markdown and commit, or delete if superseded by `docs/seo/SEO_Audit_gcoman_March2026_by_Claude.md`. I couldn't read its contents in this session.

### L6 — Cache-Control mismatch on hashed assets

`.htaccess` sets JS/CSS to 30-day cache. Vite produces hashed filenames (e.g. `index-abc123.js`) — these can safely be `max-age=31536000, immutable`. Free perf win. (Moot until `.htaccess` is applied.)

### L7 — `robots.txt` blocks Ahrefs/Semrush

Intentional, but blocks your own competitive-intel tools if you ever subscribe. Heads-up only.

### L8 — Helmet count drift in CLAUDE.md

CLAUDE.md says 16 Helmet instances; actual is **17** (one extra in `StructuredData.tsx`). Update on next edit.

---

## What's clean — don't worry about these

- **TypeScript** — `tsc --noEmit` produces zero errors.
- **`defer={false}` compliance** — all 17 `<Helmet>` instances correctly set the prop. CLAUDE.md verification (0 routes with homepage default title in `dist/`) passes.
- **`index.html` purity** — no `description`/`og:*`/`twitter:*`/`hreflang`/`canonical` baked in. The "do not hardcode" comment block is preserved.
- **Routes ↔ sitemap consistency** — every sitemap segment maps to a real route in `src/App.tsx`. Login/Admin/ThankYou correctly excluded. No 404s in sitemap.
- **No XSS sinks** — only `dangerouslySetInnerHTML` is in `src/components/ui/chart.tsx:70`, fed by hardcoded `THEMES` constant. No `eval`, `new Function`, `innerHTML`, `document.write` anywhere.
- **No exposed admin routes** — `/admin/*` gated by `<AdminRoute>` requiring authenticated admin role; redirects to `/login` otherwise.
- **No secrets in repo** — `.env*` gitignored, `.env.example` clean, all Zoho/SMTP/service-role tokens read from `Deno.env.get` server-side. `git log -p` confirms no token literals ever committed.
- **HTTPS / HSTS / TLS** — TLS cert valid (Google Trust Services, expires Jul 17 2026), `http://` correctly 301s to `https://`, HSTS preload-eligible.
- **Login flow** — real Supabase Auth with Zod validation, errors redacted in production, `noindex,nofollow` set.
- **Public folder** — no backups, dumps, .env, or sensitive files checked in.
- **A11y static checks** — no `<img>` without `alt`, no `<div onClick>` without `role`. Not a full a11y audit, but no obvious smells.
- **TODOs / dead code** — exactly one `XXXX XXXX` placeholder in a phone input (`Contact.tsx:298`), not a real TODO. No `@ts-ignore`.

---

## What I couldn't verify in this session

- **RLS on `user_roles` table** — would need Supabase dashboard access. If a regular user can `INSERT/UPDATE` their own role, the open `/login` signup becomes an admin-elevation vector. Verify in Supabase that `user_roles` RLS only allows `SELECT` for the row owner, no `INSERT/UPDATE/DELETE`.
- **GSC issue specifics** — `SEO/gcoman_GSC_Issues_ActionPlan.docx` is a binary that I'd need converted to markdown to read.
- **Which platform actually serves production** — needs Lovable/Hostinger dashboard access.

---

## Recommended fix order

| # | Severity | Item | Effort |
|---|---|---|---|
| 1 | 🚨 CRITICAL | Identify what platform actually serves prod, then either deploy prerendered subdirs to it or write platform-equivalent rewrite/redirect rules. | High — needs investigation |
| 2 | HIGH | `npm audit fix` + replace `xlsx` with `exceljs` | 1–2 hours |
| 3 | HIGH | Resolve `LocalBusiness`/`Organization` JSON-LD duplication | 30 min |
| 4 | MEDIUM | Add Turnstile/hCaptcha to contact form | 2–3 hours |
| 5 | MEDIUM | Wrap supabase client `console.log` boot block in `import.meta.env.DEV` | 5 min |
| 6 | LOW | Regenerate Supabase types to clear ~22 `any` casts; fix 3 regex escapes; review `Products.tsx` useMemo dep | 30 min |
| 7 | MEDIUM | Add hreflang `<xhtml:link>` alternates to sitemap | 2–4 hours (or generator) |
| 8 | various | Once `.htaccess` is back in path: drop `unsafe-eval` from CSP (L2), remove `X-XSS-Protection` (L3), set hashed assets to 1y immutable (L6), verify the `/service/calcium-carbonate/` redirect target (M5), add `renderAfterDocumentEvent` to prerender (M4) | Bundle as one PR |
| 9 | LOW | Archive `docs/seo/SEO_ISSUES_FOUND.md` (L4); convert or delete `SEO/*.docx` (L5); update CLAUDE.md Helmet count to 17 (L8) | 15 min |

Item #1 is worth more than every other item combined for SEO. If indexing has dropped on GSC, this is why.

---

## Appendix — raw probe output

### Production headers (homepage)

```
HTTP/2 200
date: Sat, 02 May 2026 17:23:58 GMT
content-type: text/html; charset=utf-8
cache-control: no-cache, must-revalidate, max-age=0
x-deployment-id: 7801ecc6-3d3e-4f11-94b1-abb271d10829
strict-transport-security: max-age=31536000; includeSubDomains
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
set-cookie: __dpl=7801ecc6-3d3e-4f11-94b1-abb271d10829; Path=/; Max-Age=604800; ...
set-cookie: __cf_bm=...; HttpOnly; Secure; ...
server: cloudflare
cf-ray: 9f58b77f3c86c71e-DXB
```

### TLS cert

```
notBefore=Apr 18 22:02:28 2026 GMT
notAfter=Jul 17 23:02:21 2026 GMT
issuer = Google Trust Services / WE1
subject = CN=gcoman.com
```

### robots.txt (live)

```
User-agent: Googlebot / Bingbot / Twitterbot / facebookexternalhit
Allow: /

User-agent: AhrefsBot / SemrushBot / MJ12bot / DotBot / BLEXBot
Disallow: /

User-agent: *
Allow: /

Sitemap: https://gcoman.com/sitemap.xml
```

### Local build output (verifies build half is healthy)

```
336 index.html files generated, 0 have homepage default title
dist/.htaccess: present (11,282 bytes)

dist/career/index.html
  size:        134,285 bytes
  title:       "Careers & Jobs | Join Our Team | Global Chemicals LLC"
  canonical:   https://gcoman.com/career
  description: "Join Global Chemicals LLC team in Oman. View open positions in our growing GCC export operations..."

dist/index.html       163,701 bytes
dist/contact/         275,964 bytes
dist/products/        148,840 bytes
```

### Production probe — every URL returns identical bytes

```
$ wc -c /tmp/gcoman-{home,career,products}.html
  165232 /tmp/gcoman-home.html
  165232 /tmp/gcoman-career.html
  165232 /tmp/gcoman-products.html
$ diff /tmp/gcoman-home.html /tmp/gcoman-career.html
(empty)
```

### Production probe — Helmet emits homepage values for /career

```
<title>Chemical Suppliers in Oman & GCC | Global Chemicals LLC
<link rel="canonical" href="https://gcoman.com/" data-rh="true">
<meta name="description" content="Global Chemicals LLC — Leading chemical supplier in Oman..." data-rh="true">
<meta property="og:url" content="https://gcoman.com/" data-rh="true">
```

---

*End of report. File: `AUDIT_REPORT_2026-05-02.md` at repo root.*
