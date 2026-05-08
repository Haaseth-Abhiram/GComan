# gcoman.com — Full Site Audit (Playwright)
**Date:** 2026-05-04
**Branch audited:** `Develop` (commit cae7d99)
**Scope:** SEO, accessibility, lead-capture surface, infra/security headers, JS console health, structured data — all 336 sitemap URLs
**Method:** Playwright + headless Chromium crawl of every URL in `public/sitemap.xml`, plus `curl` HTML probes, plus `npm audit` / `npm run lint` deltas.

Two parallel crawls were run for comparison:
- **Production** (`https://gcoman.com`) — what real users and crawlers see today
- **Local prerender** (`dist/` served by [scripts/serve-dist.mjs](scripts/serve-dist.mjs)) — the build the deploy chain *should* have shipped

Tooling and raw data are committed for reproducibility:
- [scripts/audit-playwright.mjs](scripts/audit-playwright.mjs)
- [scripts/serve-dist.mjs](scripts/serve-dist.mjs)
- [audits/2026-05-04-prod/](audits/2026-05-04-prod/) — `report.md`, `raw.json`, `pages.csv`
- [audits/2026-05-04-local/](audits/2026-05-04-local/) — same three files

---

## Executive summary

The May 2 critical issue — *"every URL on production returns the homepage SPA shell"* — is **partially still true and not actually fixed**. What changed is my visibility into it: Playwright executes JavaScript, so it sees the *post-hydration* page (correct title, correct canonical) on 335/336 URLs. But the underlying server-rendered HTML is still **identical 162,620 bytes for every URL**, with homepage Helmet metadata baked in, and the Hostinger `.htaccess` is still being completely bypassed by whatever edge platform is actually serving traffic (Vercel-style `__dpl` cookie, no `Server: Apache` header).

This is fine for human visitors in browsers — React + Helmet rewrite the meta after JS loads. It is **not fine** for:
- **Bing, social-media unfurl crawlers (Facebook/LinkedIn/Twitter), AI crawlers (ChatGPT, Perplexity, Claude), Ahrefs/Semrush** — none of these reliably execute JavaScript, so they see homepage HTML on every URL.
- **Googlebot's first crawl pass** — HTML-only; sees homepage everywhere. Indexing depends on the second-pass JS render which is rate-limited and probabilistic.
- **`/blog/top-chemical-suppliers-oman-2026`** — this single URL fails even after JS hydration on production (homepage title, no H1, 63 chars of body text). The same URL renders correctly in the local prerender. Production is shipping a code path that misses this slug.
- **Legacy WordPress 301s** — none fire. `/service/calcium-carbonate/` returns 200 (soft-404).
- **404s** — return 200, not 404.
- **Security headers** (CSP, X-Frame-Options, Permissions-Policy) — absent because the `.htaccess` that would set them is being ignored.

The local build is clean (336/336 pages with unique correct titles, 0 with homepage default, all SEO meta in place). **The bug is still purely in deployment.**

There are also several real issues that exist independent of the deploy problem and would still be issues even after deployment is fixed: 143 pages have over-length titles (SERP truncation), 299 pages have over-length descriptions (10 of them are >1,600 chars), `/contact` has 218 `<img>` without `alt`, and every page on production fails a Supabase REST + Google Analytics request (CSP/CORS or permissions issue).

---

## Verdict at a glance

| Check | Local prerender (build) | Production (live) |
|---|---|---|
| Pages returning 200 | 336 / 336 | 336 / 336 |
| Pages with homepage default title | **0** ✓ | **1** ✗ |
| Pages whose canonical points to homepage | 0 ✓ | 1 ✗ |
| Pages missing canonical | 0 ✓ | 0 ✓ |
| Pages missing meta description | 0 ✓ | 0 ✓ |
| Pages with no H1 | 0 ✓ | 1 ✗ |
| Pages with multiple H1s | 0 ✓ | 0 ✓ |
| Pages with title >70 chars | 143 | 143 (same) |
| Pages with description >170 chars | 299 | 299 (same) |
| Pages with `<img>` truly missing alt attribute | 0 | 0 |
| Pages with `<img alt="">` (decorative) | 1 (`/contact`, 218 flag SVGs — correct WCAG behavior) | 1 (same) |
| Pages with JS console errors | 336 (Supabase 401) | 336 (same) |
| Pages with failed network requests | 336 (GA, Supabase) | 336 (same) |
| Hreflang count per page (target ≥13) | ≥13 on all | ≥13 on all ✓ |
| Helmet flushed (`data-rh="true"`) | yes | yes |
| CSP header in response | n/a (local) | **missing** |
| X-Frame-Options header | n/a (local) | **missing** |
| Server header reads Apache | n/a | **no** (Cloudflare + edge) |
| `__dpl` deployment cookie | n/a | **present** (Vercel-style) |

Site-level probes against production:

| Probe | Status | Expected |
|---|---|---|
| `/this-route-does-not-exist-zzz999` | 200 ✗ | 404 |
| `/service/calcium-carbonate/` | 200 ✗ | 301 → `/products/water-treatment/calcium-carbonate-water` |
| `/chemicals/` | 200 ✗ | 301 → `/products` |
| `www.gcoman.com` → `gcoman.com` | 200 ✗ | 301 |
| `/robots.txt` | 200 ✓ | 200 |
| `/sitemap.xml` | 200 ✓ | 200 |

---

## 🚨 CRITICAL — Deployment is still bypassing the prerendered HTML and `.htaccess`

### The same evidence as May 2, re-verified today

```
$ curl -s https://gcoman.com/        -o /tmp/h.html
$ curl -s https://gcoman.com/career  -o /tmp/c.html
$ curl -s https://gcoman.com/products -o /tmp/p.html
$ wc -c /tmp/h.html /tmp/c.html /tmp/p.html
  162620 /tmp/h.html
  162620 /tmp/c.html
  162620 /tmp/p.html
$ diff /tmp/h.html /tmp/c.html
(empty — byte-for-byte identical)

$ curl -sI https://gcoman.com/career | grep -E '^(server|x-deployment-id|set-cookie):' | head -3
server: cloudflare
x-deployment-id: f5d2addb-c796-4656-a47b-6f788142528d
set-cookie: __dpl=f5d2addb-...; Path=/; Max-Age=604800; SameSite=Lax; Secure
```

The platform is the same Vercel-style edge that the May 2 audit identified. None of the May 2 recommended remediations (write `vercel.json` rewrites for the prerendered subdir layout, port the 70+ legacy 301s into platform-native config, OR re-FTP `dist/` with subdirectories preserved to actual Hostinger Apache) appear to have happened.

### Why the symptoms look milder this time

The May 2 audit used `curl` (no JS). Today I used Playwright with a real Chromium. Playwright sees the same broken HTML come down from the server, then waits ~1.5 s for React + react-helmet-async to re-render the head. Because every `<Helmet>` in the codebase has `defer={false}` (verified — 17/17 instances compliant), the rewrite happens deterministically. So Playwright reports correct titles on 335 of 336 pages.

This client-side rescue does help real users and helps Googlebot's second-pass render. It does **not** help any HTML-only crawler. **The SEO problem is structurally the same as May 2.**

### The one page that even client-side rescue doesn't fix

`https://gcoman.com/blog/top-chemical-suppliers-oman-2026`

| Property | Local prerender | Production |
|---|---|---|
| `<title>` | "Top Chemical Suppliers in Oman 2026: Industry Guide \| Global Chemicals LLC" | **"Chemical Suppliers in Oman & GCC \| Global Chemicals LLC"** (homepage) |
| canonical | `https://gcoman.com/blog/top-chemical-suppliers-oman-2026` | **`https://gcoman.com/`** (homepage) |
| H1 count | 1 | **0** |
| Body text length | full article | **63 chars** |
| Helmet tags applied (`data-rh="true"`) | many | 41 |

The slug **is** present in [src/pages/Blog.tsx:30](src/pages/Blog.tsx#L30) on both `main` and `Develop`. [src/pages/BlogPost.tsx:16](src/pages/BlogPost.tsx#L16) does `blogPosts.find((p) => p.id === slug)` and falls back to an "Article Not Found" branch that **does not render `<SEO>`**. On production this fallback is firing — meaning the deployed JS bundle's `blogPosts` array on production does *not* contain this slug. Almost certainly a stale-deploy issue (the deployed bundle predates this article being added to `Blog.tsx`). The local build behaves correctly.

**Fix:** trigger a fresh deploy. Independent of that, [src/pages/BlogPost.tsx](src/pages/BlogPost.tsx) was hardened in this session to render `<SEO title="Article Not Found" noIndex canonical="https://gcoman.com/blog" />` in the not-found branch, so this class of failure noindexes itself instead of inheriting whatever Helmet ran before it.

### Recommended next steps (carry-over from May 2 — none done yet)

1. **Confirm the actual platform.** Open the Lovable dashboard → Settings → Domains/Deployment. The cookie says it's a Vercel-style edge, not Hostinger Apache.
2. **If Vercel:** add `vercel.json` at repo root with:
   - rewrites mapping clean URLs to `<route>/index.html` (so prerendered subdirs serve)
   - the 70+ legacy 301s from `public/_redirects` translated to Vercel's `redirects` schema
   - the `headers` block from `.htaccess` translated to Vercel's `headers` schema (CSP, X-Frame-Options, Permissions-Policy)
3. **If actually Hostinger:** re-upload `dist/` via Hostinger File Manager preserving every subdirectory and `.htaccess` (Lovable FTP is known to strip dotfiles).
4. **Re-run** `node scripts/audit-playwright.mjs --base https://gcoman.com --label prod` to confirm. The verdict table above is the comparison target — production should match the local column.

Item 1 is worth more than every other item in this report combined.

---

## HIGH severity

### H1 — ~~`/contact` 218 imgs missing alt~~ — FALSE POSITIVE, withdrawn

Initial run flagged 218 imgs on `/contact`, but verification showed they all have `alt=""` (decorative twemoji flag SVGs from `react-international-phone`). Empty alt on decorative imagery is the correct WCAG behavior, not a violation. The crawler was over-counting by treating empty-string alt as missing. Fixed in [scripts/audit-playwright.mjs](scripts/audit-playwright.mjs) — now distinguishes `imgsMissingAlt` (truly absent attribute) from `imgsEmptyAlt` (intentionally decorative). Across the whole site, **0 imgs are truly missing the alt attribute**.

### H2 — Universal Supabase 401 console error on every page (336/336)

Every page logs `Failed to load resource: the server responded with a status of 401` for `https://yawbaqdywfrmuajaiptw.supabase.co/rest/v1/`. This is the boot-test fetch in [src/integrations/supabase/client.ts:10-38](src/integrations/supabase/client.ts) — the same code the May 2 audit (M2) flagged. RLS is rejecting the unauthenticated probe. Real-user impact is zero because the fetch itself is just a connectivity test, but it pollutes every browser DevTools console and every error-monitoring tool, hiding signal.

**Fix:** wrap the entire boot block in `if (import.meta.env.DEV) { … }`. **Done in this session** — see [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts).

### H3 — Google Analytics `/g/collect` requests fail on every page

418 failed `https://analytics.google.com/g/collect?v=2&tid=G-6VX4FTG809&...` requests across the crawl (~1.2 per page). Caused by the absent CSP allowing the request, then Cloudflare's edge or an ad-blocker pattern killing it (the bot user-agent triggers some blockers). The result: GA4 is **under-counting traffic** by an unknown amount on real traffic too.

**Fix:** verify GA4 is actually receiving events from real visitors using GA4's DebugView. If under-counting is real, switch to server-side tagging or the GA4 Measurement Protocol from a Supabase edge function.

### H4 — Production deployment lag — `/blog/top-chemical-suppliers-oman-2026`

Covered in the CRITICAL section. The page exists in source and prerenders correctly locally; production behaves as if the deployed bundle predates it. Either the deploy chain isn't picking up commits to `main`, or it ran but failed silently. Worth investigating *how recent* the deployed bundle is (Lovable build log, or hash-fingerprint `index.js` on prod vs local).

### H5 — Dependency vulnerabilities still present (carry-over)

`npm audit --omit=dev` today: 5 high + 3 moderate, identical to May 2's count.

| Severity | Package | Note |
|---|---|---|
| HIGH | `xlsx@0.18.5` | Prototype Pollution + ReDoS. The only one in actual app code. SheetJS publishes fixes via `cdn.sheetjs.com`, not npm. |
| HIGH | `lodash` | Transitive |
| HIGH | `glob`, `minimatch`, `picomatch` | Transitive build/tooling |
| MOD | `brace-expansion`, `postcss`, `yaml` | Transitive |

**Fix:** replace `xlsx` with `exceljs`, run `npm audit fix` for the rest. Same recommendation as May 2's H2, still pending.

---

## MEDIUM severity

### M1 — 143 pages have titles >70 chars (SERP truncation)

Google truncates titles at ~580 px (≈55-65 chars in practice). Worst offenders:

| Length | URL | Title |
|---|---|---|
| 109 | `/blog/food-grade-chemicals-supplier-oman` | "Food Grade Chemical Supplier in Oman: HACCP-Compliant Chemicals for Food Manufacturing \| Global Chemicals LLC" |
| 102 | `/blog/swimming-pool-chemicals-oman-muscat` | "Swimming Pool Chemicals in Oman: Complete Guide for Hotels, Villas & Facilities \| Global Chemicals LLC" |
| 100 | `/blog/chemical-exporter-oman-uae-dubai` | "Exporting Chemicals from Oman to UAE (Dubai & Abu Dhabi): 2026 Supplier Guide \| Global Chemicals LLC" |
| 99  | `/blog/chemical-exporter-oman-saudi-arabia-qatar-kuwait` | "Chemical Supply from Oman to Saudi Arabia, Qatar & Kuwait: Export Guide 2026 \| Global Chemicals LLC" |
| 97  | `/blog/jsrs-chemical-supplier-pdo-oman` | "JSRS-Certified Chemical Supplier for PDO & Oil and Gas Contractors in Oman \| Global Chemicals LLC" |
| 96  | `/products/corrosion-inhibitor/corrosion-inhibitor-molybdate` | … |

Full list of 143 in [audits/2026-05-04-prod/raw.json](audits/2026-05-04-prod/raw.json) and [audits/2026-05-04-prod/report.md](audits/2026-05-04-prod/report.md).

**Fix:** audit the title-builder. The repeated " | Global Chemicals LLC" suffix consumes 25 chars. Drop it from blog/product titles where the brand can ride in the meta description or breadcrumb instead.

### M2 — 299 pages have meta descriptions >170 chars; 10 of them are >1,600 chars

Worst offenders (all on `/products/*`):

| Length | URL |
|---|---|
| 1753 | `/products/chlorinated/trichloroethylene` |
| 1693 | `/products/alcohols/ethanol-industrial` |
| 1677 | `/products/inorganic/sodium-silicate-solution` |
| 1676 | `/products/solvents/thinner-402` |
| 1675 | `/products/swimming-pool/chlorine-powder-pool` |
| 1672 | `/products/swimming-pool/tcca-tablet-pool` |
| 1662 | `/products/oilfield/sodium-thiosulphate-powder` |
| 1652 | `/products/chlorinated/methylene-chloride-industrial` |

Lengths >1,000 chars almost certainly mean the full product description body is being passed to `<SEO description={…} />`. Google truncates at ~155-160 chars and ignores the rest. The remaining 289 pages are between 170 and ~600 chars — all over-length but less egregious.

**Fix:** in the product page component, derive description as `description.slice(0, 155).trim()` or maintain a separate short-meta field on each product.

### M3 — Sitemap is missing hreflang `<xhtml:link>` alternates (carry-over)

Same as May 2's M3 — page-level Helmet emits 15 `hreflang` links per page (Playwright confirmed all 336 pages have ≥13), but the sitemap doesn't declare them. Google discovers them anyway, just slower and less reliably.

### M4 — Contact form still open with 5/hr/IP rate limit, no captcha (carry-over)

Same as May 2's M1. Playwright confirmed: every page on the site (336/335 — all but the broken blog post) has a contact form mounted, plus tel/mail/WhatsApp links. The lead-capture surface is broad and unprotected:

| Surface | Total occurrences across crawl |
|---|---|
| `<form>` elements | 337 (one per page + an extra on contact) |
| `tel:` links | 625 |
| `mailto:` links | 338 |
| WhatsApp (`wa.me` / "whatsapp") | 622 |
| Quote/Inquiry/Contact CTAs | 3,455 |

This is great for conversion intent and shows lead-capture is everywhere — exactly what you'd want for a B2B chemical supplier — but every one of those `<form>` mounts is a POST endpoint protected only by the May 2 audit's noted rate limit. **Fix:** Cloudflare Turnstile.

### M5 — Prerender wait still time-based (carry-over)

`renderAfterTime: 2500` in `vite.config.ts`. Belt-and-suspenders fix unchanged from May 2's M4: switch to `renderAfterDocumentEvent` once Helmet commits.

---

## LOW severity / hygiene

### L1 — ESLint regressed: 84 → 95 errors

| Rule | May 2 | Today | Δ |
|---|---|---|---|
| `@typescript-eslint/no-explicit-any` | 30 | 56 | +26 |
| `no-useless-escape` | 3 | 3 | 0 |
| `@typescript-eslint/no-empty-object-type` | 0 | 2 | +2 |
| `no-empty` | 0 | 2 | +2 |
| `@typescript-eslint/no-unused-expressions` | 0 | 1 | +1 |
| `react-hooks/exhaustive-deps` | 1 | 3 | +2 |
| `react-refresh/only-export-components` | 26 | 27 | +1 |
| `@typescript-eslint/no-require-imports` | 1 | 1 | 0 |

`tsc --noEmit` is still clean (no type errors). The drift is mostly new code added with `any` rather than properly typed. **Fix:** regenerate Supabase types (`supabase gen types typescript`), then sweep the rest.

### L2 — Duplicate JSON-LD schemas with same `@id` (carry-over from H1 in May 2)

Frequency on production crawl:

| `@type` | Total occurrences |
|---|---|
| `BreadcrumbList` | 670 (≈2 per page) |
| `Organization` | 384 |
| `LocalBusiness` | 376 |
| `ItemList` | 336 |
| `WebSite` | 336 |
| `Product` | 263 |
| `FAQPage` | 51 |
| `Service` | 25 |
| `Article` | 17 |
| `JobPosting` | 3 |

670 BreadcrumbList for 336 pages = exactly 2x. 384 Organization + 376 LocalBusiness on 336 pages confirms the duplicate-with-same-`@id` issue from May 2 H1 is still present. Schema validators will warn; Google may pick the wrong one.

**Fix:** as May 2 — drop either the global `index.html` schemas or the per-page `<LocalBusinessStructuredData />` / `<OrganizationStructuredData />` components. Pick one source.

### L3 — One blog post is fully content-thin

Only `/blog/top-chemical-suppliers-oman-2026` has `<500` chars of body text on production (63 chars — the "Article Not Found" message). Same root cause as the CRITICAL section.

### L4 — Stale doc + binary `.docx` still present (carry-over)

`docs/seo/SEO_ISSUES_FOUND.md` (May 2 L4) and `SEO/gcoman_GSC_Issues_ActionPlan.docx` (May 2 L5) are still untouched. Recommend converting the `.docx` to markdown and committing, then archiving the stale issues file.

### L5 — Helmet count drift in CLAUDE.md (carry-over from May 2 L8)

CLAUDE.md still says 16 Helmet instances; actual on `Develop` is **17**, all with `defer={false}` ✓.

---

## What's clean — don't worry about these

Verified by Playwright crawl + source inspection:

- **Helmet `defer={false}` compliance** — 17/17 instances compliant. No regression.
- **Hreflang coverage** — 0/336 pages had fewer than 13 hreflang alternates (all have the full 15 from `<SEO>`).
- **Per-page canonical / description / og:* presence** — 0/336 missing canonical, 0/336 missing description, 0/336 with empty title (excluding the one broken blog).
- **No duplicate H1s** — 0/336 pages have multiple H1s.
- **JSON-LD parses cleanly** — 0 parse errors across all 336 pages.
- **TLS / HSTS** — valid Google Trust Services cert, HSTS preload-eligible.
- **Sitemap shape** — 336 unique `<loc>` entries, all return 200, all have `<lastmod>`.
- **`robots.txt` shape** — Googlebot/Bingbot allowed, Ahrefs/Semrush blocked, sitemap declared.
- **No broken nav** — every sitemap URL returned 200 in both audits.
- **All images outside `/contact` have `alt`** — only the contact-page flag picker is the offender.
- **TypeScript** — `tsc --noEmit` is clean.

---

## Recommended fix order

| # | Severity | Item | Effort |
|---|---|---|---|
| 1 | 🚨 CRITICAL | Identify the actual production platform; deploy prerendered subdirs + 301s + headers there. (Carry-over from May 2 #1.) | High — needs dashboard access |
| 2 | HIGH | Trigger a fresh production deploy; confirm `/blog/top-chemical-suppliers-oman-2026` recovers. ✅ `BlogPost.tsx` not-found branch hardened with `noIndex` SEO this session. | 30 min |
| 3 | ~~HIGH~~ | ~~Add `alt` attributes to `/contact` imgs.~~ Withdrawn — false positive (decorative `alt=""` is correct). | — |
| 4 | ✅ HIGH | Wrap supabase client boot block in `if (import.meta.env.DEV)`. **Done this session.** | — |
| 5 | HIGH | Investigate GA4 under-count via DebugView; consider server-side tagging. | 2-3 hours |
| 6 | HIGH | ✅ `npm audit fix` ran; transitive vulns 8 → 1. Only `xlsx` remains (no fix without replacing — still pending). | xlsx replacement: 1-2 hours |
| 7 | MEDIUM | Product descriptions ✅ truncated to 155 chars at word boundary in `ProductDetail.tsx`. Titles still need a human pass (143 pages — SEO-tuned strings, judgment call). | titles: 2-4 hours |
| 8 | MEDIUM | Add Turnstile/hCaptcha to contact form (337 form mounts). (Carry-over.) | 2-3 hours |
| 9 | ✅ MEDIUM | LocalBusiness duplicate-`@id` resolved — removed all 12 `<LocalBusinessStructuredData />` mounts; `index.html` global is now sole source. **Done this session.** | — |
| 10 | LOW | Lint went 95 → 86 (mechanical fixes done). Remaining 56 `no-explicit-any` need Supabase types regen — needs DB access. | — / 30 min |
| 11 | ✅ LOW | CLAUDE.md updated: Helmet count 16 → 17, schema-source guidance added. **Done.** | — |
| 12 | ✅ LOW | `docs/seo/SEO_ISSUES_FOUND.md` moved to `docs/seo/archive/`. `SEO/*.docx` left alone (untracked, possibly user's working draft). | — |

---

## Re-running this audit

```bash
# install once
npm install        # picks up the new playwright dev dep
npx playwright install chromium

# production
node scripts/audit-playwright.mjs --base https://gcoman.com --label prod

# local prerender (rebuilds dist if stale)
npm run build
PORT=8787 node scripts/serve-dist.mjs &     # leave running
node scripts/audit-playwright.mjs --base http://127.0.0.1:8787 --label local

# both write into audits/<YYYY-MM-DD>-<label>/{report.md,raw.json,pages.csv}
```

The `report.md` files emitted by the crawler are machine-generated section-by-section views. This document is the human-readable synthesis on top.

---

## Appendix — what changed since May 2

| Item | May 2 | 2026-05-04 |
|---|---|---|
| Production serves prerendered HTML | ✗ | ✗ (same SPA-shell-everywhere) |
| `.htaccess` applied | ✗ | ✗ |
| Legacy 301s fire | ✗ | ✗ |
| 404 returns 404 | ✗ | ✗ |
| CSP / X-Frame-Options headers | ✗ | ✗ |
| Helmet `defer={false}` compliance | 17/17 | 17/17 ✓ |
| Local build healthy (336 pages, 0 default-title) | ✓ | ✓ |
| `npm audit` (prod deps) | 5 high + 3 mod | 5 high + 3 mod (unchanged) |
| ESLint problems | 84 | 95 (regressed) |
| Pages with broken hydration in browser | (not measured) | 1 (`/blog/top-chemical-suppliers-oman-2026`) |
| Pages with `<img>` missing alt | (not measured) | 1 (`/contact`, 218 imgs) |
| Pages with title >70 chars | (not measured) | 143 |
| Pages with description >170 chars | (not measured) | 299 |
| Universal Supabase 401 errors | flagged (M2) | confirmed on 336/336 |
| GA4 `/g/collect` failing | (not measured) | 418 failures across crawl |

Net: nothing on the May 2 critical/high list has been resolved; the new Playwright-only findings (alt attrs, title/desc length, GA4 failures, single broken blog) are all real and worth fixing once the deploy chain is sorted.

*End of report. Raw data: [audits/2026-05-04-prod/](audits/2026-05-04-prod/) and [audits/2026-05-04-local/](audits/2026-05-04-local/).*
