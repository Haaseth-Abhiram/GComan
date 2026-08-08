# GC Oman — Full-Site SEO Audit: GCC-Wide Ranking Readiness

**Prepared:** August 9, 2026
**Scope:** gcoman.com — technical crawlability, local/international SEO across all 6 GCC target markets, content quality across the full product catalog, structured data, Core Web Vitals, sitemap integrity, GEO/AI-search readiness, search-experience/intent match, topical architecture, and off-page authority.
**Method:** GSC live verification (Performance, Product snippets, Core Web Vitals, Links reports), direct curl/Lighthouse/PageSpeed Insights checks against production, and 10 parallel specialist deep-dives against both the live site and the full codebase (`/Users/ayansh/Development/GCOMAN/gcoman-insight-design`).
**Business goal driving this audit:** rank #1 in organic search for chemical-supplier terms across the *entire* GCC — Oman, UAE, Saudi Arabia, Qatar, Kuwait, Bahrain — not just Oman.

**A scoping correction up front:** the product catalog is **270 products across 22 categories**, not ~768 as stated in prior documentation and this audit's own initial brief. Verified independently by three separate specialist passes (direct JSON parse of all 22 category files). Every finding below uses the correct 270 figure.

---

## SEO Health Score: 43/100

| Category | Weight | Score | Why |
|---|---|---|---|
| Technical SEO | 22% | 30/100 | Two severe, previously-undocumented crawlability/indexability bugs (see Critical #1, #2) sit underneath otherwise-clean robots.txt/HTTPS/security fundamentals |
| Content Quality | 23% | 50/100 | Real depth where it exists (lab-chemicals, water-treatment), but 75% of the catalog has zero FAQ content, 14 in-depth guides are invisible to crawlers, zero real SDS/TDS despite copy claiming otherwise |
| On-Page SEO | 20% | 55/100 | Titles/meta/canonicals are genuinely good on sampled pages; the gap is trust-signal depth and GCC geo-framing, not on-page mechanics |
| Schema / Structured Data | 10% | 55/100 | Sophisticated, mostly-correct foundation undermined by dead-code landmines, one live schema conflict, and one entirely-inert schema block |
| Performance (CWV) | 10% | 15/100 | 105/105 desktop URLs POOR, 0/105 mobile "good" — driven by a hosting-config issue plus a genuine 7.5-second main-thread block on every product page |
| AI Search Readiness | 10% | 50/100 | Technical delivery to AI crawlers is verified working well; the gap is off-site corroboration and FAQ coverage, not the technical layer |
| Images | 5% | 25/100 | Zero real product photography sitewide; oversized favicon; hero images partially fixed this session |

**Read this score in context:** the on-page and content fundamentals are more competent than the score alone suggests — several specialists explicitly called out well-built page types, correct hub-and-spoke patterns, and genuinely differentiated city-page content. What's dragging the score down is a small number of severe, systemic technical bugs (Critical #1 and #2 below) that undermine indexation at scale, plus a branch-management gap where real fixes exist in the codebase but were never shipped to production.

---

## Critical Findings (fix immediately — these block indexing or actively suppress rankings sitewide)

### 1. Every URL outside the sitemap returns an indexable duplicate of the homepage, not a 404

**This is the single highest-leverage fix on the entire site.** Verified with real Googlebot-UA requests against production: any path not in the 700-URL sitemap — a typo, an old/removed product URL, a case variant, a fabricated path — returns **HTTP 200** with the homepage's exact `<title>`, `<meta name="description">`, self-referencing canonical, and `robots: index, follow`. This is not the 3 previously-known legacy soft-404s; it's the CDN's fallback behavior for the *entire URL space outside the sitemap*.

**Root cause:** Lovable's CDN serves `dist/index.html` (the fully prerendered homepage, not a neutral shell) for any unrecognized path. The client-side `NotFound.tsx` component correctly sets `noindex, nofollow`, but that only fires after JS executes for that specific URL — the raw HTTP response every crawler sees first is a complete, indexable duplicate of the homepage.

**Why it matters:** at this site's scale (a 22-category catalog with a documented history of category restructuring, 3+ known legacy WordPress paths, and ongoing product changes), this affects a large and growing space of URLs. Every one competes with the real homepage for ranking signals and wastes crawl budget. This is a strong candidate for triggering Google's site-wide soft-404 pattern detection, which throttles crawl rate domain-wide — a very plausible root cause of the 45% GSC indexation rate.

**Fix direction:** the CDN-level fallback needs to serve a genuine 404 status (or at minimum never serve `dist/index.html`) for unmatched paths. This is a Lovable platform-level setting, not something `public/.htaccess`/`public/_redirects` currently control in production (they're inert on this host per this repo's own CLAUDE.md) — raise directly with Lovable, or treat the self-hosted-Apache migration path as more urgent.

### 2. Production has zero Arabic noindex-gating — most `/ar/*` pages are indexable English-content duplicates with false hreflang

Confirmed via code diff: `origin/main` (what Lovable actually deploys) has **no** `arTitle`/`arDescription`/noindex-gating logic in `SEO.tsx` at all — that logic exists only on the `Develop` branch and was never shipped. Live verification on `/ar/chemicals/muscat` and other `/ar/*` non-product pages: English `<title>`, `robots: index, follow`, self-referencing canonical, **no hreflang alternates**. This generalizes to all 20 `/ar/chemicals/*` city pages plus roughly 38 other non-product `/ar/*` pages (about, industries, blog index + posts, certifications, customers, career, contact, privacy, terms) — apparently live since ~March 2026.

**The one bright spot:** Arabic **product** pages (~250 of 270, per the documented opt-in model) are correctly gated and correctly hreflang'd in production — confirmed via a full sitemap cross-check (0 broken hreflang pairs, 0 reciprocity mismatches on 270/270 product entries). This bug is specific to non-product page types that never got the same treatment as `ProductDetail.tsx`.

**Impact for the GCC goal specifically:** this directly undermines the highest-value pages for the stated goal — the 20 GCC city landing pages — by telling Google they have a real Arabic version when they don't.

**Fix:** merge `Develop`'s `SEO.tsx` to `main`. This alone flips these pages to the safe `noindex, follow` default — it does **not** make them indexable/localized. `LocationLanding.tsx` still has no `arTitle`/`arDescription` wired up, so real Arabic city-page copy is a separate, follow-on content task (see Content Findings).

### 3. `Develop` and `main` have diverged in both directions — a naive merge would both fix bugs and regress production

This is critical context for #1 and #2's fixes. `origin/main` has 116+ commits `Develop` doesn't have (Lovable's own auto-editor, through Aug 5); `Develop` has 19+ commits `main` doesn't have (the legacy-redirect layer, the Arabic gating fix, this session's CWV/redirect work). Concretely for the sitemap alone: **production's sitemap.xml (700 URLs, full 270/270 Arabic product parity) is actually ahead of Develop's copy (594 URLs, only 249/270 AR parity)** — pushing Develop's sitemap to production as-is would delete 106 URLs and break working Arabic product hreflang.

**Action:** before shipping any Develop-branch SEO fix, reconcile bidirectionally the way the one prior reconciliation merge (`ce2c996`, July 7) did — pull `main`'s Lovable-side changes into `Develop` first, resolve conflicts deliberately (especially `public/sitemap.xml`), then merge forward. Do not fast-forward or force in one direction.

### 4. `ChemistryHero3D` blocks the main thread for 7.5 seconds on every product detail page

Real Lighthouse lab data: **Total Blocking Time = 7,470ms** on a sampled product page (vs. 30ms on the homepage) — this single component almost certainly dominates the poor CWV/INP field data GSC shows for the 105 measured product URLs. Root cause: a **1.6MB HDRI texture fetched from `raw.githubusercontent.com`** (an uncached, non-CDN third-party origin) plus synchronous three.js scene/shader initialization blocking the main thread for ~11-14 seconds of bootup/mainthread work. The component is already well-architected for prerendering (deferred past hydration, lazy-loaded, static fallback for crawlers/SEO) — this is a real-user performance problem specifically, invisible to the prerender pipeline.

**Fix:** lazy-mount behind an `IntersectionObserver`/idle callback so initialization happens after Time-to-Interactive, and replace the 1.6MB third-party HDRI with a compressed, self-hosted environment map. Medium effort, very high impact — likely the single biggest lever on product-page Core Web Vitals specifically.

### 5. `Cache-Control: no-cache, must-revalidate, max-age=0` on every route (already diagnosed, unresolved)

Confirmed sitewide via curl. Real TTFB ~2s. `public/_headers` correctly declares long-cache policy for static assets but is inert on Lovable's CDN. **This is a hosting/CDN configuration issue, not fixable from application code** — needs a direct conversation with Lovable.

### 6. The 3 known legacy soft-404s are still live in production; fixes exist but are unshipped

`/service/soap-detergent-chemicals/`, `/products/acids/phosphoric-acid` (fixed on `Develop` since July 7), and `/service/glycols/` (fixed by this session, committed to `Develop` today) all still return 200/homepage-duplicate in production — none of the fixes have shipped. Note: `mobil-lubricants`, flagged as a 4th soft-404 in the original PDF audit, was a false positive — it's a real, correctly-prerendered product page.

### 7. Fourteen in-depth GCC regulatory/technical guides are completely invisible to crawlers

Confirmed independently by two specialists. `src/data/blogArticles.ts` holds 14 substantial guides (e.g. "GCC Chemical Import Regulations: Oman, UAE, Saudi Arabia, Qatar Compliance Guide") rendered in `Resources.tsx` only after a user clicks a card (`selectedGuide`/`selectedArticle` state). The Puppeteer prerenderer captures only the default (`null`) state — verified directly against `dist/resources/index.html`: guide body text is absent from the built output. There's also no `/resources/:slug` route, so these guides have no indexable individual URL at all. This is real, substantial content investment that Google cannot see or cite. Fix: give each guide a real route so it prerenders standalone with correct canonical + schema, or retire the pattern.

### 8. Zero real SDS/TDS/CoA documents exist for any product, despite copy claiming otherwise

`documents` fields (`sdsUrl`/`tdsUrl`/`uoaUrl`) are populated on **0 of 270 products**; every "Download SDS/TDS" button actually links to a contact-form request. Multiple product descriptions explicitly claim "SDS, CoA, and transport documentation provided." For a chemical distributor, safety documentation is the single highest-value trust signal a B2B buyer looks for — this is both an E-E-A-T gap and a copy-accuracy problem.

---

## High-Priority Findings

**Content & Trust**
- **75% of the catalog (203/270 products) has zero FAQ content** — worse than previously tracked (67 have FAQs, not the "68" cited in project history, and coverage is *inversely* weighted: the highest-volume, highest-intent categories — oilfield 17%, water-treatment 18%, lab-chemicals 12% — have the *lowest* FAQ coverage).
- **1 of 270 products has GHS/hazard classification data** — a real safety-communication gap given the catalog includes genuinely hazardous chemicals.
- **Zero testimonials, case studies, or customer logos found across every page sampled.** This is the single biggest lever separating GCOMAN's pages from a #1-ranked competitor's — verified by the search-experience audit as the lowest-scoring dimension across every buyer persona tested (9-15/25).
- **Country-specific regulatory content (SASO, ESMA, GSO) is essentially absent at the product level** — 0 matches across all 270 product JSON files — despite existing in a handful of landing/blog pages. This directly undercuts the GCC-wide (not just Oman) positioning the client wants.
- **GCC geo-framing problem**: pages meant to serve pan-GCC queries (e.g. `/chemical-supplier/caustic-soda-oman`) lead with "Oman" in the URL/title/H1 and bury GCC delivery info in FAQ prose (3 mentions in 1,225 words).
- Pricing is 100% quote-gated even though the `Offer` schema already has a scaffolded `price`/`priceRange` field sitting empty.

**Technical**
- **Keyword cannibalization is live now, not hypothetical**: ~20 product titles are duplicated verbatim across 2-3 category JSON files (e.g. caustic soda flakes exists as its own indexed URL in both `water-treatment.json` and `soap-detergent.json`, with near-identical SEO keyword arrays), each generating its own competing indexed URL.
- Homepage carries two contradictory `Service`/`ItemList` schema blocks simultaneously (`index.html`'s 4-service list vs. `Index.tsx`'s 5-service list) — not an error, but schema noise/an "ambiguous entity" risk.
- Three structured-data components (`OrganizationStructuredData`, `LocalBusinessStructuredData`, `WebSiteStructuredData`) are dead code with **stale, drifted data** (different postal code, different `priceRange`) — a landmine if anyone imports them later.
- **Live NAP inconsistency**: two simultaneously-rendered production schema blocks disagree on postal code (`111` vs `100`).
- Google Business Profile status is unclear and the on-site Maps embed shows signs of a fabricated placeholder ID — needs direct manual verification in business.google.com, not inference from the embed.
- Missing high-value GCC industrial hub pages, confirmed independently by two specialists: **Jubail and Yanbu (Saudi Arabia's actual petrochemical centers)**, Ras Laffan (Qatar), Shuaiba/Ahmadi (Kuwait) — all currently only name-checked inside other cities' page copy, meaning that search intent is actively misrouted today.
- `blog/meg-vs-deg-gas-dehydration-oman-gcc` (+ its `/ar/` twin) exists in the committed sitemap but is missing from the *live deployed* sitemap — an orphaned page hitting the Critical #1 fallback bug.

**Off-page**
- Only 10 total backlinks, unchanged in substance since July. A concrete plan now exists (see Action Plan) — including a genuinely underused asset: the site already claims "authorised distributor" status for Shell, Mobil, and Castrol with zero reciprocal links from any of them.

---

## Medium-Priority Findings

- Two parallel, disconnected blog/content systems (`blogPosts` in `Blog.tsx`, 18 live/indexed entries; `blogArticles.ts`, 14 entries only reachable via the broken pattern in Finding #7) — a content-architecture fragmentation problem, not just a technical one.
- `agro` category is the weakest in the catalog: all 8 products have short descriptions (464-589 chars vs. 1,100-1,700 elsewhere) and zero FAQs.
- Three "categories" (`additives`, `calcium-carbonate`, `lab-equipment`) are single-SKU umbrella pages, not real per-product content.
- 87% of sitemap URLs share one identical `lastmod` date — an uninformative recrawl signal.
- Homepage hero images were ~1.8MB before any script runs (partially addressed this session — preload hint added; recompression/resizing still needed).
- Shared JS bundle chunks aren't properly route-split — 40-65% unused JS shipped on every page regardless of route.
- `robots.txt` disallows `/en` and `/login`, which means Googlebot can never see the in-app JS redirect correct itself for those paths if they were ever indexed historically.
- `Organization` schema's `sameAs` lists only 2 social profiles; the live Footer has 6.
- Blog `Article` schema falls back to a generic third-party-hosted logo image on every post (no per-article image threaded through).

---

## Low-Priority / Housekeeping

- `favicon.ico` is 50KB (should be <5KB), fetched on every page load.
- Possible GA/Zoho SalesIQ pre-consent loading — flagged by network evidence, not yet confirmed against `consent.ts` source; worth a quick check given this repo's documented deny-all consent architecture.
- Geo coordinates use 4 decimal places (~11m precision) instead of 5 (~1m).
- Deprecated `priority`/`changefreq` sitemap tags present on 100% of entries (harmless, Google ignores them).

---

## The Realistic Path to "#1 in the GCC"

The topical-architecture specialist's assessment is worth stating plainly: **a uniform #1 ranking across all 6 GCC markets simultaneously is not realistic** against multi-decade, multi-country incumbents (Dubi Chem was the most consistently-found competitor across Dubai/Sharjah/Fujairah/RAK/Abu Dhabi searches). The efficient path is **sequential, not uniform**:

- **Wave 0 (prerequisite):** resolve the ~20 duplicate-title cannibalization pairs before building anything new on top of them.
- **Wave 1 — Oman lockdown:** extend the one proven product×location page pattern (currently only built once, for caustic soda) to 3-4 more high-volume products. Cheapest, least contested, matches existing proof points (GCOMAN's homepage already ranks well for oilfield-chemicals terms).
- **Wave 2 — Saudi expansion:** build the missing Jubail and Yanbu pages; pair with oilfield/corrosion-inhibitor content. Saudi is the largest GCC economy and currently has only 3 city pages vs. Oman's 6.
- **Wave 3 — UAE wedge:** don't fight Dubi Chem head-on for "Dubai" terms; target Sharjah/Fujairah with lab-chemicals/RO content where catalog depth wins.
- **Wave 4 — Qatar/Kuwait/Bahrain + a cross-country pillar:** fill the Ras Laffan/Shuaiba gaps; build one desalination/RO content pillar spanning all 6 countries — every GCC state has this structural water dependency and no competitor sampled has built this.

This sequencing only works once the Critical fixes above are shipped — city-page and product-page architecture is already good; right now it's undermined by the site telling Google the wrong things about half its own URL space.

---

## Full specialist reports

The complete findings behind each section above (exact file:line references, per-category FAQ percentages, full NAP/schema tables, the 90-day backlink sequencing, and the query-by-query SXO scoring) are preserved in this session's transcript. Ask for any section to be expanded into more detail, or for specific fixes to be implemented.
