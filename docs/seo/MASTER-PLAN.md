# Number One plan — the single execution plan for gcoman.com

**How to use this file.** It is the one place where the plan lives. Every session that works on ranking starts here, does the item under **Next up**, updates the status in the table, and ends by telling the user what to call next. Evidence lives in the ledger (`visibility-ledger.md`), instructions for the user in `ACTION-PACK.md`, standing constraints in `HANDOFF.md`. This file never duplicates them; it sequences them.

**To resume:** say **"continue the Number One plan"** (or run `/number-one-plan`). Claude reads this file, checks the live state of the Next-up item, does it, runs the gates, commits to Develop, updates this table, and reports.

**Last updated:** 2026-10-16 (session 6). **Next up: P0.3** — request Google indexing for the five new hubs (lab, fertilizers, hypochlorite, oilfield, PAC), then the queue. Blocked only on the Chrome extension's permission for search.google.com. Then re-measure nitric acid around 2026-10-20. Phase 2 is complete except P2.3 lubricants (needs the authorised-brand list). Then Phase 3 (needs TDS for proprietary ranges) and Phase 6 measurement.

## Rules that apply to every item

1. Code lands on Develop with `npx tsc -b && npm run lint && npm run verify:sitemap-health && npm run verify:ar-meta && npm run verify:serp-titles && npm run test:e2e` green. Production needs a merge to main plus a Lovable Publish, which the user does or explicitly authorises in-session (the auto-mode policy refused it on 2026-10-13).
2. HANDOFF do-not-do list stands: no bulk FAQ generation, no mass retitling of the 277 products, no product × city programmatic pages, no homepage or JSRS-blog edits.
3. Every number is read live and labelled by source. Google is queried through the signed-in Chrome with `gl=om&pws=0`; after ~50 fetched SERPs Google rate-limits, so pace it.
4. Search Console: URL Inspection only via the top search box; ~9 Request-indexing clicks per day; country filter is ISO-3.
5. One item at a time, verified before marked done. "Done" means seen live (an indexed URL, a listing page that names us, a deploy id), never "I asked for it".

## Phase 0 — ship what exists

| # | Item | Owner | Status | Verify by |
|---|---|---|---|---|
| P0.1 | Merge Develop → main, click Publish in Lovable, confirm the new `x-deployment-id` | Claude (user authorised in-session 2026-10-16) | **done 2026-10-16:** main fast-forwarded 73cd306 → cab895a; Lovable Publish; deploy `psr2.3e4b3c2a…` → `psr2.42699f12…`. Verified live: nitric GCC title, all 5 new hubs with own title + self canonical + FAQPage, consolidated EDTA primary | `curl -sI https://gcoman.com/ \| grep x-deployment-id` changes |
| P0.2 | `npm run submit:indexnow` after the Publish | Claude | **done 2026-10-16:** `--all`, 634 URLs, HTTP 200 (every page changed: prerender-snapshot fallback) | HTTP 200 in the script output |
| P0.3 | Request indexing, ~9 URLs/day, in this order: `/products/ro-chemicals/membrane-antiscalant-ro`, `/products/additives`, `/products/oilfield/activated-carbon`, `/products/oilfield/soda-ash-light`, `/products/swimming-pool/chlorine-powder-pool`, `/products/oilfield/calcium-bromide`, `/products/oilfield/descalant`, `/products/ethanolamines/tea-triethanolamine`, `/products/cooling-water/biological-guard-antifouling`, then the 3 lab pages, 6 `/chemicals/*`, 5 blogs from the GSC "Crawled – currently not indexed" list | Claude | **in progress** — done 2026-10-13: nitric hub, HCl hub, `/chemical-suppliers-oman`, TEG, PAC, `/products/water-treatment`, `/products/inorganic`, `/products/soap-detergent`, `/products/oilfield/meg`. Done 2026-10-16: membrane-antiscalant-ro, `/products/additives`, chlorine-powder-pool, calcium-bromide, descalant, tea-triethanolamine, biological-guard-antifouling (+ soda-ash-light and activated-carbon, already indexed). **Left:** the 3 lab pages, 6 `/chemicals/*`, 5 blogs | each shows "Indexing requested" |
| P0.4 | Re-inspect the four Soft-404 URLs; Pages → Soft 404 count | Claude | **done 2026-10-16** — nitric hub, HCl hub, `/chemical-suppliers-oman`: "URL is on Google"; TEG indexed with issues. Soft 404 19 → **15**; indexed 487 | "URL is on Google" |

## Phase 1 — one URL per product (consolidation)

**Evidence rule (adopted 2026-10-16 after a wrong first pass):** consolidate only when the pages share a CAS number, the primary has **≥ 3× the variant's 90-day Search Console impressions** (read live, never assumed), and the variant is **not a food or lab grade** (different buyers, they rank on their own). Below the threshold, or when clicks and impressions disagree, leave it for the product's hub. After any revert, rebuild `public/sitemap.xml` from a version that still contains the page — the sync script only prunes; its coverage gate fails if a page is missing.

Mechanism: `details.canonicalOverride` on the variant pointing at the primary; the primary's `longDescription` names the grades it absorbs; `node scripts/sync-ar-sitemap.mjs && node scripts/sync-ar-meta.mjs`. Status after 2026-10-16: **live on Develop** — EDTA, calcium chloride, TCCA tablets, hydrogen peroxide (→ 50%, the only page with clicks), TEA, ferric chloride, aluminium sulphate, sodium thiosulphate, caustic lye → caustic liquid; sitemap 629. **Reverted 2026-10-16:** the 10-13 picks for sodium hypochlorite, citric acid and caustic food grade (primaries had 2–5 impressions against 31–122 on the retired pages) — these get one canonical page through their Phase 2 hubs.

| # | Chemical (pages) | Proposed primary | Status |
|---|---|---|---|
| P1.1 | EDTA (4) | soap-detergent/edta-powder-soap (most impressions) | **done 2026-10-16** (liquid, oilfield powder, water-softening → primary; lab disodium EDTA kept) |
| P1.2 | Potassium chloride (3) | agro/potassium-chloride-fertilizer (358 impr) — **user confirms** (lab + oilfield are real SKUs) | open |
| P1.3 | Ethanol (3) | food-beverage/ethanol-70 (171 impr) vs alcohols/ethanol-industrial — **user confirms** | open |
| P1.4 | Calcium carbonate (3) | — | **closed, not consolidating**: water-treatment page (61 impr) beats the base page (23), is a legacy-redirect target and the e2e fixture; food grade is a separate buyer |
| P1.5 | Corrosion inhibitor (3) + typo category `conrosion-inhibitor` | — | typo: **not in the code** — only an old URL in GSC (1 impression); nothing to fix. Generic inhibitors: open, verify they are the same formulation first |
| P1.6 | Calcium chloride (3) | oilfield/calcium-chloride-oil (206 impr) | **done 2026-10-16** (water-treatment → primary; lab kept) |
| P1.7 | Chlorine forms | swimming-pool/chlorine-tablet-pool (162 impr) | **done 2026-10-16** for the true duplicate (water-treatment/chlorine-tablets, same TCCA); tablet / liquid / powder are different chemicals and stay |
| P1.8 | Remaining splits | the page with impressions | **batch done 2026-10-16** (TEA, ferric, alum, thiosulphate, lye). Skipped on evidence: methanol 2.8×, MPG food grade, PCE/TSP/naphtha/hydrazine/glycerine too little data, zinc sulphate clicks vs impressions disagree, soda ash dense vs light are different grades. Earlier note: Rule learned 2026-10-16: lab-grade pages are separate SKUs and stay; MEG and MDEA are **user decisions** (HANDOFF §8); methanol/IPA are industrial vs lab → stay. Still to check: perchloroethylene, biocide, sodium bicarbonate, corrosion-inhibitor generics (each is a distinct formulation — verify CAS before merging) |

## Phase 2 — hubs where demand is proven (one per week, hand-written on the nitric model)

Each hub: `/chemical-supplier/<slug>`, spec table, grades, pack formats, GCC lead-time table, FAQs that appear on the page, linked from the product pages' `guideUrl`, `ChemicalSuppliersOman.tsx`, `Sitemap.tsx`, the location pages' hub block and `ChemicalSuppliersMiddleEast.tsx`; English URL added to `public/sitemap.xml`, then the two sync scripts; Request indexing on go-live.

| # | Hub | Why (evidence) | Data needed from the user | Status |
|---|---|---|---|---|
| P2.1 | Laboratory chemicals | 2,123 impr, category rank #2 | none — grades and packs were already in `lab-chemicals.json` | **built 2026-10-16** on Develop: `/chemical-supplier/laboratory-chemicals-oman`, table generated from the product data (34 reagents), 5 visible FAQs, linked from all lab products, location pages, Oman/ME pages; e2e spec. Request indexing after Publish |
| P2.2 | Fertilizers (urea, KCl, DAP, NPK, gypsum) | 39 clicks; urea 25 clicks @5.8 | none — packs were in `agro.json` (origin and minimum order would still improve it) | **built 2026-10-16** on Develop: `/chemical-supplier/fertilizers-oman`, data-driven table + fertigation compatibility table, 5 FAQs, linked from all agro products and location pages; e2e spec. Request indexing after Publish |
| P2.3 | Lubricants distributor (rebuild the category page) | category 65 clicks + brand pages 29 | which brands are authorised, grade list, pack sizes | open |
| P2.4 | PAC | weak on evidence (PAC queries ~9 impr / 90d) | none — from data | **built 2026-10-16** on Develop: `/chemical-supplier/poly-aluminium-chloride-oman`, grades table + spec-only PAC/alum/ferric comparison, 5 FAQs; PAC product pages link here, hub links the PAC blog. **Flag for the user:** the PAC liquid page names PAEW plants (Ghubrah, Barka, Sohar, Salalah) as users — confirm or remove |
| P2.5 | Sodium hypochlorite | 272 impr / 7 clicks over 6 grade pages; 5 CRM enquiries | none — from data | **built 2026-10-16** on Develop: `/chemical-supplier/sodium-hypochlorite-oman`, grade table from 4 JSON files, storage/safety, 5 FAQs; each grade keeps its own page and links here. **Flag for the user:** the food-grade page's spec says "EPA registered sanitizer" and the municipal page says "on-site generation available" — confirm or remove |
| P2.6 | Oilfield chemicals | 47 live pages, 1,335 impr | none — from data (top sellers would still help ordering) | **built 2026-10-16** on Develop: `/chemical-supplier/oilfield-chemicals-oman`, 47 products grouped by job, JSRS section, 5 FAQs, linked from 45 oilfield products + location pages; e2e spec |
| P2.0 | Price band on the 3 live hubs (B1) | PAA on every SERP; uvwater ranks on price | **the bands** | waiting on user |

## Phase 3 — lift the thin tail (5 pages/week)

`npm run audit:product-content` queue: 45 pages < 200 words (tank cleaners, cooling water, agro, RO first). Real specs, CAS, applications, packs. No templated FAQs. Descriptions can now use blank lines for paragraphs. **Status:** agro done 2026-10-16 (8 pages, 186–223 words; thin 45 → 37). **Next:** cooling water and RO (standard chemistry, writable from the data); **tank cleaners need the user** — they are proprietary formulations (Enviro Soft 2000, Universal Wash, Metal Bright…) and need the actual composition/TDS before content can be written without guessing.

## Phase 4 — Arabic product layer

130 `/ar/products/*` pages "Discovered – currently not indexed". After P0.1: request indexing for the 10 Arabic twins of the highest-impression products; re-read the count on 2026-11-13. Status: open.

## Phase 5 — off-site (user; Claude fills forms once signed in)

| # | Item | Status | Verify |
|---|---|---|---|
| P5.1 | Bing Places | done 2026-10-11, pending publish | Bing Maps "chemical suppliers" Muscat, 2026-11-08 |
| P5.2 | D&B D-U-N-S (check existing records first) | open | `site:dnb.com "Global Chemicals LLC"` |
| P5.3 | OmanYP ($20) | open | listing page names us |
| P5.4 | Made in Oman Gate, Metoree, Records Marine, EasyOman, ensun.io | open | `site:` hit naming us |
| P5.5 | Yellow-pages directories: Oman, UAE, Saudi, Qatar, Kuwait, Bahrain + go4worldbusiness | open (they hold page-1 for products in all six) | listing page |
| P5.6 | Google reviews → 11, then 20 | 2 today | Maps panel |
| P5.7 | GBP secondary categories + product Services; website → `https://gcoman.com/` | open | GBP |
| P5.8 | Wikidata item (after the Wikipedia unblock; talk page check 2026-10-18) | waiting | `wbsearchentities` |
| P5.9 | Each live listing URL → Organization `sameAs` in `index.html` | Claude, as each lands | live HTML |

## Phase 6 — measure and extend (monthly; the plan grows here)

Run `monitoring-search-visibility` (full) plus the product panel (12 products × 3 forms, Bing on the hub products, AI Mode + ChatGPT on caustic/hypochlorite/PAC). Compare with the targets below. New evidence → a new row in the phase it belongs to, never a side plan.

| Signal | 2026-10-13 | 2026-10-27 | 2026-12-01 |
|---|---|---|---|
| Soft 404 count | 19 (10-16: **15**) | ≤ 10 | ≤ 5 |
| Hubs indexed | 1 of 3 (10-16: **3 of 3**) | 3 of 3 | all |
| "nitric acid supplier oman", Google `gl=om` | absent (10-16: homepage #17, hub not top 40; hub #10 for "nitric acid sohar") | top 10 | top 5 |
| Product-page clicks, 90d | ~230 | — | 400+ |
| Lab / fertilizer / lubricants clicks | 20 / 39 / 97 | — | +50 % |
| Bing referring domains | 1 | 3 | 6+ |
| Leads with a country | 15 of 88 | all new | — |
| Google head term "chemical suppliers oman" | #2 | #2 | #1 |

## Session log

- 2026-10-13 (sessions 1–3): diagnosis (nitric, product-level, family-by-family), Soft-404 fix, hub GCC title, hub links, 4 consolidations, contact-form country, 9 indexing requests, reports published. Publish refused by policy → P0.1 with the user.
- 2026-10-16 (session 4): Publish still not done (P0.1). Merged Lovable's main commits into Develop (clean). P0.4 done — all three hubs and the Oman page indexed, Soft 404 19 → 15. P0.3: 7 new indexing requests. P1: EDTA, calcium chloride, TCCA consolidated (sitemap 625); calcium carbonate tried and reverted on evidence. Fixed a CI blind spot: the sitemap gate now fails if an indexable product is missing.
- 2026-10-16 pm: nitric acid measured on every surface (ledger). Google weak (hub indexed but not top 40 for the head term; #10 for "nitric acid sohar"); Bing #2 / #1 for price; ChatGPT #4; Perplexity #1; Google AI Overview and AI Mode do not mention us. Biggest lever unchanged: Publish (GCC title + hub links from all location pages, incl. the Saudi page ChatGPT hedges on), then citations.
- 2026-10-16 late: Publish still pending. Found Monday's consolidation primaries were the weakest pages → reverted hypochlorite/citric/caustic-food, re-pointed H2O2 to 50%, added the ≥3× evidence rule; consolidated TEA, ferric chloride, alum, sodium thiosulphate, lye. Sitemap 629. Indexing quota for 10-16 already used.
- 2026-10-16 evening: Phase 3 started — 8 fertilizer pages deepened, thin 45 → 37. Publish still pending; indexing resumes 10-17.
- 2026-10-16 (session 5): P2.1 lab chemicals hub built from our own data (no user input needed after all). Phase 3: cooling-water and RO pages are 17 proprietary formulations without CAS — need TDS from the user, like tank cleaners. Develop now ~23 commits ahead of main.
- 2026-10-16 (session 6): P2.2 fertilizer hub built from agro data. Next hubs: P2.3 lubricants needs the user (which brands are authorised — the site claims Shell/Mobil/Castrol/GP); P2.4 PAC and P2.5 hypochlorite can be built from data.
- 2026-10-16 (session 7): P2.5 hypochlorite hub built (hypochlorite evidence > PAC). Develop ~26 commits ahead of main.
- 2026-10-16 (session 8): P2.6 oilfield hub built. Four new hubs now wait on the Publish. Fixed a wrong link (butyl glycol → butylene glycol guide).
- 2026-10-16 (session 9): P2.4 PAC hub built. Phase 2: 5 of 6 hubs done; only lubricants (user input) left. Develop 30 commits ahead of main.
- 2026-10-16 (session 10): pre-publish full build of Develop passed (635 pages, 0 title failures). Everything Claude can do without the Publish or user input is done.

- 2026-10-16 (session 6): P0.1 Publish done by Claude on the user's in-session instruction (deploy 42699f12, 6 hubs verified live). P0.2 IndexNow 634 URLs HTTP 200. P0.3 blocked: the Chrome extension denied actions on search.google.com. Edge functions (submit-contact country) still need a Lovable-side deploy.
- 2026-10-16 (session 6, later): Search Console reachable again. Lab hub inspected: "URL is unknown to Google"; Request indexing hit "Quota Exceeded" (today's quota used by the morning batch). Sitemap resubmitted in GSC (success) so Google rediscovers the 5 new hubs. P0.3 resumes 2026-10-17: lab, fertilizers, hypochlorite, oilfield, PAC first.
- 2026-10-16 (session 6, 16:13): Bing Webmaster URL Submission — 6 hubs (nitric, lab, fertilizers, hypochlorite, oilfield, PAC) submitted, "Success". Contact form checked safe on the old submit-contact (extra `country` field ignored; country still reaches the message text).
- 2026-10-16 (session 6, 16:40): **P2.7 nitric acid country pages** (new item, user asked for #1 on "nitric acid supplier" across the GCC). Investigation: every GCC #1 (Google and Bing) is a page titled for that country (chemstock.ae, deluxechemical, enviroblend, chimisrl/alchemora/gabeco country templates), mostly 190–260 words; our hub covered each country in one table row, so we were absent. Built `NitricAcidCountry.tsx`: /chemical-supplier/nitric-acid-{uae,saudi-arabia,qatar,kuwait,bahrain}, each with its own route, lead times, delivery points, industrial areas, documents and FAQs (site-published facts only); linked from the hub GCC cards, matching /chemicals/* pages, Middle East page, /sitemap. Scope closed at 1 product × 5 countries. Gates + 94/94 e2e. Published (deploy `eb5a4575`), verified live; IndexNow 12 URLs HTTP 200; Bing URL Submission 5 "Success". Google indexing requests queue for 10-17 after the 5 hubs. Off-site lever per country: get listed on the directory pages that themselves rank #1 (yellowpages-uae.com/uae/nitric-acid, bahrainyellowpagesonline, go4worldbusiness Saudi, trademo Kuwait).
- 2026-10-18 (session 11): GEO audit (62/100, `GEO-ANALYSIS.md`) → on Develop: dateModified stamped into every prerendered page from git-true lastmod (160 stale lastmods fixed; the 12 hubs were unmapped), llms.txt lists all 13 hubs + CI gate, CCBot allowed, stale-English FAQPage dedupe on /ar. New continuous procedure: skill `running-search-operations`, agents `search-sweeper` / `release-verifier`, `verify:live-pages`, `panel:locations`, `location-ledger.md`. First sweep recorded (Google 25 / Bing 41 / Maps 6). P0.3: nitric UAE, Saudi Arabia and Qatar indexing requested; Kuwait, Bahrain and the 5 hubs remain (GSC blocked by the session permission policy). **Publish needed (user)** for the Develop commits 60c29ef…1b9d769.
