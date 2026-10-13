# Number One plan — the single execution plan for gcoman.com

**How to use this file.** It is the one place where the plan lives. Every session that works on ranking starts here, does the item under **Next up**, updates the status in the table, and ends by telling the user what to call next. Evidence lives in the ledger (`visibility-ledger.md`), instructions for the user in `ACTION-PACK.md`, standing constraints in `HANDOFF.md`. This file never duplicates them; it sequences them.

**To resume:** say **"continue the Number One plan"** (or run `/number-one-plan`). Claude reads this file, checks the live state of the Next-up item, does it, runs the gates, commits to Develop, updates this table, and reports.

**Last updated:** 2026-10-13 (session 3 of the plan). **Next up: P0.1** (user) then **P0.3** (Claude).

## Rules that apply to every item

1. Code lands on Develop with `npx tsc -b && npm run lint && npm run verify:sitemap-health && npm run verify:ar-meta && npm run verify:serp-titles && npm run test:e2e` green. Production needs a merge to main plus a Lovable Publish, which the user does or explicitly authorises in-session (the auto-mode policy refused it on 2026-10-13).
2. HANDOFF do-not-do list stands: no bulk FAQ generation, no mass retitling of the 277 products, no product × city programmatic pages, no homepage or JSRS-blog edits.
3. Every number is read live and labelled by source. Google is queried through the signed-in Chrome with `gl=om&pws=0`; after ~50 fetched SERPs Google rate-limits, so pace it.
4. Search Console: URL Inspection only via the top search box; ~9 Request-indexing clicks per day; country filter is ISO-3.
5. One item at a time, verified before marked done. "Done" means seen live (an indexed URL, a listing page that names us, a deploy id), never "I asked for it".

## Phase 0 — ship what exists

| # | Item | Owner | Status | Verify by |
|---|---|---|---|---|
| P0.1 | Merge Develop → main, click Publish in Lovable, confirm the new `x-deployment-id` | **user** (or authorise Claude) | **open** — Develop is 8 commits ahead (Soft-404 fix, GCC hub title, hub links, 4 consolidations, contact-form country) | `curl -sI https://gcoman.com/ \| grep x-deployment-id` changes |
| P0.2 | `npm run submit:indexnow` after the Publish | Claude | open (blocked by P0.1) | HTTP 200 in the script output |
| P0.3 | Request indexing, ~9 URLs/day, in this order: `/products/ro-chemicals/membrane-antiscalant-ro`, `/products/additives`, `/products/oilfield/activated-carbon`, `/products/oilfield/soda-ash-light`, `/products/swimming-pool/chlorine-powder-pool`, `/products/oilfield/calcium-bromide`, `/products/oilfield/descalant`, `/products/ethanolamines/tea-triethanolamine`, `/products/cooling-water/biological-guard-antifouling`, then the 3 lab pages, 6 `/chemicals/*`, 5 blogs from the GSC "Crawled – currently not indexed" list | Claude | **in progress** — done 2026-10-13: nitric hub, HCl hub, `/chemical-suppliers-oman`, TEG, PAC, `/products/water-treatment`, `/products/inorganic`, `/products/soap-detergent`, `/products/oilfield/meg` | each shows "Indexing requested" |
| P0.4 | Re-inspect the four Soft-404 URLs; Pages → Soft 404 count (19 today) | Claude | due **2026-10-20** | "URL is on Google" |

## Phase 1 — one URL per product (consolidation)

Mechanism: `details.canonicalOverride` on the variant pointing at the primary; the primary's `longDescription` names the grades it absorbs; `node scripts/sync-ar-sitemap.mjs && node scripts/sync-ar-meta.mjs`. Done 2026-10-13: sodium hypochlorite, caustic soda liquid, citric acid, hydrogen peroxide (11 variants).

| # | Chemical (pages) | Proposed primary | Status |
|---|---|---|---|
| P1.1 | EDTA (4) | water-treatment/edta-powder-water | open |
| P1.2 | Potassium chloride (3) | agro/potassium-chloride-fertilizer (358 impr) — **user confirms** (lab + oilfield are real SKUs) | open |
| P1.3 | Ethanol (3) | food-beverage/ethanol-70 (171 impr) vs alcohols/ethanol-industrial — **user confirms** | open |
| P1.4 | Calcium carbonate (3) | calcium-carbonate/calcium-carbonate | open |
| P1.5 | Corrosion inhibitor (3) + typo category `conrosion-inhibitor` | corrosion-inhibitor/corrosion-inhibitor-general; fix the category slug + redirect | open |
| P1.6 | Calcium chloride (3) | oilfield/calcium-chloride-oil (203 impr) | open |
| P1.7 | Chlorine pool forms (3) | swimming-pool/chlorine-tablet-pool (161 impr) | open |
| P1.8 | Methanol, isopropanol, perchloroethylene, biocide, MDEA, MEG, sodium bicarbonate, and the remaining 2-page splits (22 chemicals) | the page with impressions | open |

## Phase 2 — hubs where demand is proven (one per week, hand-written on the nitric model)

Each hub: `/chemical-supplier/<slug>`, spec table, grades, pack formats, GCC lead-time table, FAQs that appear on the page, linked from the product pages' `guideUrl`, `ChemicalSuppliersOman.tsx`, `Sitemap.tsx`, the location pages' hub block and `ChemicalSuppliersMiddleEast.tsx`; English URL added to `public/sitemap.xml`, then the two sync scripts; Request indexing on go-live.

| # | Hub | Why (evidence) | Data needed from the user | Status |
|---|---|---|---|---|
| P2.1 | Laboratory chemicals | 2,123 impr, category rank #2 | which grades (AR/ACS/HPLC) and pack sizes are stocked | open |
| P2.2 | Fertilizers (urea, KCl, DAP, NPK, gypsum) | 39 clicks; urea 25 clicks @5.8 | bag sizes, origin, min order | open |
| P2.3 | Lubricants distributor (rebuild the category page) | category 65 clicks + brand pages 29 | which brands are authorised, grade list, pack sizes | open |
| P2.4 | PAC | leads ask; Bing #5 | liquid/powder grades, basicity, packs | open |
| P2.5 | Sodium hypochlorite | Bing #3; 5 pages consolidated | strengths, packs | open |
| P2.6 | Oilfield chemicals | 41 pages, 1,335 impr | top 10 SKUs by sales | open |
| P2.0 | Price band on the 3 live hubs (B1) | PAA on every SERP; uvwater ranks on price | **the bands** | waiting on user |

## Phase 3 — lift the thin tail (5 pages/week)

`npm run audit:product-content` queue: 45 pages < 200 words (tank cleaners, cooling water, agro, RO first). Real specs, CAS, applications, packs. No templated FAQs. Status: open.

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
| Soft 404 count | 19 | ≤ 10 | ≤ 5 |
| Hubs indexed | 1 of 3 | 3 of 3 | all |
| "nitric acid supplier oman", Google `gl=om` | absent | top 10 | top 5 |
| Product-page clicks, 90d | ~230 | — | 400+ |
| Lab / fertilizer / lubricants clicks | 20 / 39 / 97 | — | +50 % |
| Bing referring domains | 1 | 3 | 6+ |
| Leads with a country | 15 of 88 | all new | — |
| Google head term "chemical suppliers oman" | #2 | #2 | #1 |

## Session log

- 2026-10-13 (sessions 1–3): diagnosis (nitric, product-level, family-by-family), Soft-404 fix, hub GCC title, hub links, 4 consolidations, contact-form country, 9 indexing requests, reports published. Publish refused by policy → P0.1 with the user.
