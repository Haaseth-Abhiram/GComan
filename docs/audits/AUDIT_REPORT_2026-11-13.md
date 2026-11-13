# Full-site audit, 2026-11-13 (after Publish #15, `psr2.0cfdbdce`)

Scope: every sitemap URL as crawlers see it, rendered pages in a real browser, the Arabic translation layer, and the code (forms, edge functions, consent, routing, data). Three independent read-only reviewers plus direct checks; every finding below was re-verified before a fix. Fixes are on Develop (not live until Publish).

## 1. Live crawl (647 sitemap URLs, raw HTML as GPTBot)

| Check | Result |
|---|---|
| HTTP status | 647 × 200 |
| One `<title>`, one `<h1>`, one description | 647 / 647 |
| Duplicate titles / descriptions | 0 / 0 |
| Self canonical, `index, follow` | 647 / 647 |
| `<html lang>` | 363 `en`, 284 `ar`, all correct |
| hreflang (en / ar / x-default), reciprocal | 0 problems |
| Internal links outside the sitemap | 69: 61 correctly prerendered noindex, **8 served the homepage shell** (`/privacy`, `/terms`, `/sitemap`, `/login` + /ar twins) → fixed for privacy/terms (below); `/sitemap` (render timeout) and `/login` (admin filter) left by design |

## 2. Rendered pages (Playwright, desktop 1366 + mobile 390, 17 key EN/AR pages)

0 JavaScript errors, 0 failed same-origin requests, 0 horizontal overflow, correct H1 and language switch on every page.

## 3. Fixed on Develop

| # | Finding | Fix |
|---|---|---|
| 1 | `submit-contact`: `leadCountry` used outside its scope in `sendEmailNotification` → every sales email would fail (ReferenceError, swallowed) once the function is redeployed | pass it as a parameter |
| 2 | `submit-contact`: rate-limit lookup error returned "over limit" → a DB hiccup turns every visitor away | fail open, log |
| 3 | `/privacy`, `/terms` (+ /ar) gave non-JS crawlers the homepage shell (`index, follow`, canonical "/") from the footer of every page | prerendered (`NOINDEX_PRERENDER_ROUTES`); pages moved from bare Helmet to `<SEO noIndex>` — required, the prerenderer waits for `prerender-ready`, which only `<SEO>` fires (first build attempt timed out at 130 s on exactly this) |
| 4 | Arabic: 12 pool products used bare حمامات / الحمام ("bathrooms") for pools (67 strings) | → مسابح / المسبح; حمامات السباحة kept; 7 redundant SEO keywords fixed after review |
| 5 | Arabic: `calcium-hypochlorite-water` specs garbled ("65-70-75%"), wrong appearance, missing moisture, different application list | re-translated from the English |
| 6 | Arabic: `hydrochloric-acid-industrial`, `sodium-chloride-industrial` had no Arabic applications/specs (English shown on /ar) | translated |
| 7 | Arabic: `epoxy-coating` said "corrosion" for abrasion, "smooth" for seamless | التآكل بالاحتكاك, الخالي من الفواصل |
| 8 | Hard-coded English on every /ar product page and the footer (delivery badge, SDS/CoA badge, Formula, quote blurb, pricing prompt) | `t()` keys in en.json / ar.json, English unchanged |
| 9 | Arabic contact submissions landed on the English `/thank-you` | `/ar/thank-you` on /ar |
| 10 | Client accepted 5,000-char messages; the server re-checks after appending the country line → 400 | client cap 4,900 |
| 11 | Two legacy redirects pointed at duplicate SKUs that canonicalise elsewhere | point at the canonical SKU (all 3 redirect files, e2e case added) |

Independent Arabic review of fixes 4–7: no remaining errors after its must/should-fixes were applied.

## 4. Open (not fixed, need a decision or a larger job)

| Item | Why open |
|---|---|
| Edge-function fixes 1–2 are **not live**: a Publish does not deploy edge functions | needs a deploy from the Lovable side (Cloud → Edge functions) |
| `Career.tsx` sends no Turnstile token; enabling the captcha would reject every job application | only matters if Turnstile is enabled (it is off) — fix before enabling |
| 157 of 279 Arabic long descriptions are short old summaries (e.g. caustic flakes 45 vs 404 words) and miss packs / lead times; `nitric-acid-68` AR still carries claims removed from the English | large re-translation; do revenue products first, each with independent review |
| 70 products: Arabic specs/applications lists shorter than English | same batch as above |
| LocationLanding guide cards and category blurbs are English on /ar city pages (50–180 English words) | route through `t()` with Arabic copy |
| Newsletter/download error toasts show the generic SDK message instead of the server's | low |
| `nitric-acid-68` English: spec says "30L, 200L drums", body says 35 kg carboys / 60 kg / 200 L / IBC | owner to confirm packs |

## 5. Checked and clean

Typecheck (0 errors), lint (0 errors), all CI gates, e2e 146 passed (1 load flake re-run green), every Helmet `defer={false}`, `index.html` meta, `lazyRetry` on all routes, EN/AR route parity, both product registries (22), FAQ schema ↔ visible FAQs (34 sites), hub links, consent gating (GA / SalesIQ), language switcher, 131 + 10 redirects (no loops / chains / sitemap collisions), product data integrity (279, no duplicate ids, all guide / country / canonical targets resolve), no committed secrets, admin guarded, CAS / UN numbers EN = AR on revenue products.
