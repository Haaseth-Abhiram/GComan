# Full SEO Audit — gcoman.com — 2026-09-21

**Overall SEO Health Score: 60 / 100**

Eight specialist audits (technical, content, schema, performance, GEO/AI, local, SXO, backlinks) run in parallel against the live site and this repo, combined with real Search Console and GA4 field data pulled the same day. Weighted per the standard rubric.

| Dimension | Weight | Score | Verdict |
|---|---|---|---|
| Technical SEO | 22% | 61 | Sound core, one critical platform defect |
| Content Quality | 23% | 52 | Flagship pages strong, catalog templated, E-E-A-T thin |
| On-Page / SXO | 20% | 73 | Right page types, right titles — 1 real mismatch |
| Schema | 10% | 70 | Valid everywhere; one critical rendering bug |
| Performance (CWV) | 10% | 32 | 0/85 URLs pass in the field; causes now fully mapped |
| AI Search (GEO) | 10% | 63 | Engineering ahead of authority signals |
| Images | 5% | 65 | Correct formats/loading; 168 KB compression waste |
| **Weighted total** | | **60** | |
| Backlinks (context, unweighted) | — | 12 (low conf.) | 5 domains, 0 editorial — the strategic ceiling |

Field data (same day, per real GSC/GA4): 449 indexed (up from 371 on Sep 8), sitemap 657 healthy, manual actions/security clean, 555 clicks/28d, clean GA4 baseline post-Aug-22.

---

## Critical findings (all newly discovered by this audit)

### C1. FAQ answers don't exist in the crawlable HTML — one-line fix
`src/components/ui/accordion.tsx` lacks `forceMount`, so Radix unmounts closed accordion content entirely. Every FAQ answer on product, category, dosing-calculator, industries, and blog templates ships with the answer text **only inside the JSON-LD script tag** — zero footprint in body HTML. Confirmed by diffing served DOM vs JSON-LD (`<div data-state="closed" ... hidden></div>` — empty). The entire FAQ/GEO content investment (68+ products) is invisible to crawlers and AI engines as body copy. Location pages (static `<p>` cards) are the only template doing it right.
**Fix:** add `forceMount` to `AccordionPrimitive.Content` (Radix still collapses visually via `hidden` + CSS). Then rebuild + verify answers in prerendered dist/.

### C2. Every unmatched URL serves a byte-identical homepage clone with `index,follow`
`curl https://gcoman.com/<anything>` → HTTP 200 with the homepage's full prerendered HTML, including its robots `index,follow` and canonical `https://gcoman.com/`. Verified identical bytes. Affects `/admin`, `/dev/*`, `/ar/` home, and every typo/retired URL. `NotFound.tsx`'s noindex only applies after hydration — non-JS crawlers (Bing classic, most AI bots, link-preview fetchers) see unbounded homepage duplicates. Likely feeds the legacy Soft-404 set in GSC. No `X-Robots-Tag` backstop header exists.
**Fix:** Lovable support ticket — serve a real 404 (or at minimum `X-Robots-Tag: noindex`) for paths outside the prerendered set. Not fixable in app code.

### C3. Product template ships 1.86 MB of 3D assets on all 275+ product pages
Real Lighthouse run: product pages load a **1.11 MB uncompressed HDR environment map** + **331 KB WebGL chunk** for `ChemistryHero3D`. Lab TBT reads 0 ms (simulated CPU masks it) but this is the prime suspect for product-page "Poor" field LCP — bigger than the known 150 KB Supabase issue on those pages.
**Fix:** compress HDR to KTX2/Basis (≤200 KB), lazy-mount the scene behind IntersectionObserver, skip on `prefers-reduced-motion`/low-end devices.

### C4. The two homepage JSON-LD blocks declare structurally different addresses
`Organization`: `addressLocality: "Ghala, Muscat"`, `addressRegion: "Muscat Governorate"`. `LocalBusiness`: `addressLocality: "Ghala"`, `addressRegion: "Muscat"`. Same text to humans, two different addresses to parsers and citation tools — undermines the citation push before it starts. `postalCode` missing from Organization. Phone formats also differ across components (hyphen vs space).
**Fix:** standardize both blocks (`addressLocality: "Muscat"`, region "Muscat Governorate", Ghala in streetAddress); normalize phone format site-wide.

### C5. llms.txt is stale as of today's deploy
Header says "Last updated 2026-08-25"; the two new SKUs shipped today (industrial HCl, industrial salt) are absent from the file AI engines read to map the site.
**Fix:** add both now; longer-term, regenerate llms.txt in the sitemap-sync pipeline so it can't drift.

---

## High-priority findings

**Content / E-E-A-T**
- `/about` contradicts itself on the same page: body copy "263 SKUs across 21 categories" vs its own FAQ "275+ across 22" (ground truth: 277/22). Fix `whoWeAreText` in en.json/ar.json.
- Zero named human expertise anywhere — all bylines are "Global Chemicals Technical Team". Attribute technical content to a named engineer with a short bio.
- 6/6 sampled water-treatment descriptions share one template skeleton (same opener, same "Muscat, Sohar, Salalah" close; ~40–50% boilerplate). Break the template signature across the category.
- Blog prose too dense even for B2B (Flesch 10.4, 22 words/sentence) — hurts both readers and AI extraction (atomic sentences quote better).

**Local**
- All "Leave a Google Review" CTAs link to a Maps *search page*, not the one-tap review composer (`g.page/r/…/review`). Fix before starting the review push.
- No `Service` schema on any of the 20 `/chemicals/*` pages (bind areaServed to the `#local-business` @id).
- Sohar/Rustaq pages never state the warehouse address in their own copy; no map embeds on location pages; the /contact map iframe looks hand-assembled — regenerate from the verified GBP Share panel.

**Technical / platform**
- No CSP, X-Frame-Options, or Permissions-Policy on any response (Lovable CDN limitation — ticket alongside C2).
- `www → apex` redirect is 302, should be 301 (platform-level).
- Lovable's own `/~flock.js` telemetry fires pre-consent (our GA/Zoho/Turnstile gating is verified clean) — confirm with Lovable or document as accepted exception.

**Performance (beyond C3)**
- Homepage LCP is 70% element-render-delay (2.7 s of 3.9 s) — hydration-blocked, confirming the entry-bundle diagnosis (150 KB Supabase + 76 KB ar-meta.json in the 388 KB entry; fix designed, awaiting its own deploy).
- 168 KB reclaimable from 4 over-heavy homepage WebPs (81–86% waste each); CSS 78% unused and render-blocking.

**Schema**
- JobPosting `datePosted` hardcoded to 2025-01-01 on all 4 listings — Google may auto-expire them. Give each job a real date.
- `sales@gcoman.com` cited in FAQ copy but absent from any ContactPoint — add it or reference info@.
- HowTo schema (deprecated for rich results since 2023) — keep existing for GEO, stop adding to new posts.

**SXO / structure**
- `/products/water-treatment` is a catalog shelf, but the SERP for "water treatment chemicals oman" rewards Service-Page/company-authority pages (4 of 9 winners are specialist homepages). Rebuild as capability hub: certs + case studies + process above, 22-SKU list below. **This is the one big head-term fixable without backlinks.**
- Pool-chemicals blog cannibalizes `/products/swimming-pool` (same target phrase, two page types) — retarget the blog long-tail, cross-link to category.
- MEG split across 3 near-duplicate pages with no canonical — consolidate on `products/oilfield/meg`.

---

## Strategic confirmations (three independent methods agree)

1. **Backlinks remain the binding constraint** — SXO confirmed our pages are the correct type with exact-match titles on the commodity terms we lose; content depth measured at r=-0.11; backlink profile 5 domains/0 editorial. No amount of on-page work outranks the incumbent network on those terms without authority.
2. **The competitor network is vertical-specific** — muscatchemical/omanchem/soharchemical dominate industrial + water-treatment SERPs but are *absent from agro* (why urea ranks). Map more open verticals (food-beverage, construction) for Q4-shaped wins before spending on contested terms.
3. **AI Overviews are won on numeric trust signals** ("30 years", "1M+ litres", "99.8% on-time") + third-party presence — our YouTube/Reddit/Wikidata footprint is zero while our schema engineering leads the market. Publish real numbers and build minimal third-party surface (1 YouTube video, Wikidata entity).

---

## Action plan

### Code (Claude can implement — in order)
1. `forceMount` on AccordionContent (C1) + verify FAQ text in prerendered HTML
2. llms.txt: add HCl + industrial-salt entries, bump date (C5)
3. NAP standardization in index.html JSON-LD + phone format normalization (C4)
4. Review CTAs → real GBP review link (needs the `g.page/r/...` link from the GBP dashboard)
5. Fix `/about` 263/21 stat drift; JobPosting real dates; sales@ ContactPoint
6. CWV deploy: Supabase out of entry + ar-meta to route chunks + HDR compression/lazy 3D (C3) — own deploy with before/after
7. Service schema on 20 location pages; address in Sohar/Rustaq copy
8. `/products/water-treatment` service-page rebuild (needs commercial facts: case studies, named industries)
9. Water-treatment template de-duplication; image re-encode; MEG consolidation (business decision on canonical); pool blog retarget

### Platform (Lovable tickets — user files)
- Real 404 / X-Robots-Tag for unprerendered paths (C2)
- Security headers (CSP/XFO/Permissions-Policy)
- www→apex 301; pre-consent ~flock.js question

### Business (user)
- Review velocity plan: WhatsApp ask post-delivery, GBP short link, 2–4 asks/week, target 12–15 reviews in 90 days (full playbook in local audit)
- Citations: yellowpages.om (exact categories), OCCI, Bing Places, OmanYP, Kompass, D&B + LinkedIn/Facebook NAP field check
- Backlinks: GPCA, OCCI, Ithraa, MEDRC, ICIS/ChemOrbis, TradeKey/EC21 (live-checked 2026-09-21; verify listings manually)
- Named technical author (one person, short bio) for blog/product attribution
- Real trust numbers for the site: years operating, tonnes supplied, on-time %, client count
- YouTube (1 facility/how-to video) + Wikidata entity

### Already in flight (don't duplicate)
- Caustic-soda hub experiment — verdict ~Oct 1 gates geo-hub replication
- New HCl/salt pages indexed-requested; ranking check ~Oct 12
- GA4 cleaned (key events = 3 real lead types; Aug-22 annotation)

**Limitations:** backlink competitor comparison unavailable from free sources (needs a free Moz API key — recommended); SXO SERPs were global-index, not Oman-localized; GBP internals (categories, photos, posts) not API-accessible; homepage accordion variant of C1 strongly indicated but not source-verified.
