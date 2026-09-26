# Keyword Rank Tracker — gcoman.com

Live Google positions for the standing keyword set. **Method:** manual/agent SERP checks, Oman-localized (`&gl=om&hl=en`), browser geolocated GCC, personalization on — directional, not rank-tracker-grade. "—" = not in the visible results (top ~10–20). Update the `Last checked` column on every re-check; never delete history — append a dated row to the Change Log instead.

**Re-check cadence:** weekly (scheduled agent) + after every deploy that touches titles/snippets.

## Tier 1 — Brand & company (defend)

| Keyword | Position | Our URL | Last checked | Notes |
|---|---|---|---|---|
| global chemicals llc oman | #1 + sitelinks + Knowledge Panel | / | 2026-09-10 | 5.0★, 2 reviews |
| chemical supplier in oman | #1 | / | 2026-09-10 | Competitor (Sohar Chemicals) panel shows on this SERP |
| chemical supplier in muscat | #1 | / | 2026-09-10 | Snippet fixed 09-20; watch CTR in GSC |

## Tier 2 — Page-1 positions (push to #1)

| Keyword | Position | Our URL | Last checked | Notes |
|---|---|---|---|---|
| laboratory chemicals supplier oman | **#2** | / | 2026-09-21 | NEW find; omanchem #1 |
| shell lubricants distributor oman | #3 | /products/lubricants | 2026-09-10 | Distributor-relationship win |
| glycol supplier oman | **#4** | /products/glycols | 2026-09-21 | NEW find; muscatchemical #1 |
| corrosion inhibitor supplier oman | **#4–5** | /products/corrosion-inhibitor | 2026-09-21 | NEW find; omanchem/muscatchemical above |
| agricultural gypsum oman | #1 | /products/agro/agricultural-gypsum | 2026-09-10 | Exact-phrase win |
| dap npk fertilizer oman | #1 | /products/agro/dap-fertilizer | 2026-09-10 | Exact-phrase win |
| urea fertilizer supplier oman | #7 | /products/agro/urea-fertilizer | 2026-09-10 | Control query; SXO 9/10 fit |
| water treatment chemicals supplier oman | #1 | / | 2026-09-10 | Homepage carries it; category-page rebuild planned |
| chemical suppliers in duqm / rusayl / salalah | #1–2 | / and /chemicals/rusayl | 2026-09-10 | Institution/geo wins |
| jsrs approved chemical supplier pdo oman | #1 + #3 | /blog/jsrs-chemical-supplier-pdo-oman | 2026-09-10 | Strongest content page |
| chemical exporter oman to saudi arabia | #1 + #2 | /blog/chemical-exporter-… | 2026-09-10 | Export frame wins |
| chemical suppliers in jeddah | #4 | /chemicals/jeddah | 2026-09-10 | Best KSA city result |

## Tier 3 — Absent / page 2+ (the battle list)

| Keyword | Position | Winner(s) | Last checked | Next lever |
|---|---|---|---|---|
| hydrochloric acid supplier oman | — | muscatchemical, omanchem, Oman Chlorine | 2026-09-21 | NEW page live 09-21 + indexing requested; re-check 10-12 |
| industrial salt / sodium chloride oman | — organic (local pack ✓) | muscatchemical, omanchem | 2026-09-21 | NEW page live 09-21; re-check 10-12 |
| sodium hypochlorite supplier oman | — | Oman Chlorine, omanchem | 2026-09-21 | Snippet shipped; authority-bound |
| calcium chloride supplier oman | — organic (**local pack #2** ✓) | Oman Chlorine | 2026-09-21 | Brine title shipped 09-21 |
| caustic soda supplier oman | — | omanchem #1, muscatchemical #2 | 2026-09-10 | CONTROLLED TEST — verdict ~10-01, do not touch |
| swimming pool chemicals oman | — | omanchem, muscatchemical | 2026-09-21 | Blog/category cannibalization fix queued |
| poly aluminium chloride supplier oman | — | omanchem, muscatchemical, sohar | 2026-09-21 | Authority-bound |
| meg monoethylene glycol supplier oman | — (AI Overview cites competitors) | network ×3 | 2026-09-21 | MEG 3-page consolidation queued |
| soda ash supplier oman | — | muscatchemical + pack | 2026-09-21 | Authority-bound |
| acetic acid supplier oman | — | muscatchemical, omanchem | 2026-09-21 | Authority-bound |
| tank cleaning chemicals oman | — (pack: competitors) | omanchem, sohar, RXSOL net | 2026-09-21 | Authority-bound; marine niche |
| fertilizer supplier oman (generic) | — | specialist fertilizer cos | 2026-09-21 | Different set; keep product-level wins |
| chemical suppliers in dubai / riyadh / bahrain | — | local incumbents | 2026-09-10 | Strategy: export frame only, don't chase |
| co2 carbon dioxide gas supplier oman | — | industrial-gas companies | 2026-09-20 | Deliberately skipped (different market) |

## Queued for first check
food grade chemicals supplier oman · construction chemicals oman · ro chemicals supplier oman · caustic soda flakes oman (post-verdict) · nitric acid food grade oman (re-check) · chlorine tablets pool oman

## Change Log
- **2026-09-26 (4)** — Found and fixed identical-title cannibalization: 38 products across 17 groups (Corrosion Inhibitor, Calcium Chloride, EDTA Powder, Activated Carbon, Biocide, Glycerine, Hydrazine Hydrate, MEA, MEG, DEG, Methanol Tech Grade, Potassium Hydroxide, Soda Ash Dense/Light, Sodium Hypochlorite, Citric Acid Liquid, Calcium Carbonate) had byte-identical page titles across category files despite genuinely different content — most of these were sitting in the Z-band (0 GSC impressions) as a result. Disambiguated every title with a short, honest, application-specific qualifier pulled from the product's own existing description (see product-positioning-gap-audit.md's Z-band section for detail). Not the same as the 2026-08-09 cannibalization audit, which checked content overlap, not title collisions, and correctly left these alone. tsc/lint/build/sitemap-health/ar-meta/prerender-titles/internal-links-audit/77 e2e (incl. the "cross-category SKUs keep distinct titles" test) all clean. Re-check impressions alongside the B-band re-check in 3-4 weeks.
- **2026-09-26 (3)** — First AI-visibility spot-check (ChatGPT/Gemini/Claude + Google AI Overview) — see `docs/seo/ai-visibility-check-2026-09-26.md`. Headline: Global Chemicals LLC is #1 on all 3 platforms for generic "best chemical supplier in Oman" queries; for the specific caustic-soda query it's #2 on ChatGPT, #3 on Claude, and **absent entirely on Gemini** — the same organic-authority gap already tracked above (caustic soda controlled test, B-band/authority items), not a new AI-specific problem. No action taken; informs prioritization only.
- **2026-09-26 (2)** — B-band conversion (product-positioning-gap-audit.md item 4): 211 new FAQ entries across 116 of the 127 "ranks ≤10 but <10 impressions" products — 91 had zero FAQs going in. Every answer is composed only from that product's own `technicalSpecs`/`applications` fields (grade/pack-size fact + top 3 real applications), never invented; wrote a small extraction script, then hand-checked and fixed two generation bugs before applying (a boilerplate spec line getting picked up as a "fact" on one product, and a unit-detection regex false-triggering on rate/density units like "g/cm²" instead of real pack sizes like "500g"). Titles untouched on purpose — these already rank ≤10 on some query and a retitle risks losing that. Re-check impressions in 3-4 weeks.
- **2026-09-26** — Closed out the C-band sprint (docs/seo/product-positioning-gap-audit.md item 5): the internal-links half was still open after the snippet commits. New `relatedProducts` pill-link block on blog posts (mirrors the existing `relatedLocations` idiom) gives all 33 near-miss products a hand-placed, topically-matched inbound link from one of 12 blog posts — on top of the category-listing + automatic same-category rotation links they already had. Build/tsc/lint/sitemap-health/ar-meta/prerender-titles/internal-links-audit all clean; verified the links render as real `<a href>` in the prerendered HTML, not dead markdown text (blog body content and product longDescription both render as plain text with no link support — checked before writing this).
- **2026-09-25** — GSC check, **zero quota spent: the entire 09-22 queue cleared itself.** `/chemicals/qatar` and `/chemicals/kuwait` are both now "URL is on Google" (clean, breadcrumbs valid) — the de-orphaning fix worked, and they indexed without a Request. `nitric-acid-68` and `nitric-acid-lab` are also both indexed. All four skipped under rule 3; nothing left queued.
  - **Page indexing (data 9/21): 456 indexed / 333 not indexed**, vs 447/338 on 09-20. Soft 404 **18 → 14**, Discovered-not-indexed 170 → 169, Crawled-not-indexed flat at 63. No new English cluster.
  - **Performance 28d: 554 clicks · 10.6K impressions · CTR 5.2% · avg position 9.7.** Top-10 queries are almost entirely brand-navigational (`global chemicals llc` 34 clicks, `global chemicals & maintenance systems llc` 21 — note that last one is a *different company*, so some of that impression volume is brand confusion, not our demand). The only non-brand entry in the top 10 is `chemical suppliers in oman` (5 clicks / 41 impr). 485 queries total. This is the authority ceiling showing up in the data, not a content problem.
  - **Job Postings enhancement: 0 invalid / 4 valid** (data 9/24). The "New Job Postings structured data issues" message dated Sep 20 has already resolved — no action, and it answers the open JobPostings question: four postings are live and valid.
  - **MEG/DEG cannibalization — measured, and it is NOT the 3-way split the earlier note assumed.** MEG sits on three URLs with identical titles and CAS (`glycols/meg-ethylene-glycol`, `oilfield/meg`, `water-treatment/meg-water`); DEG on three more. Inspection: **glycols/meg-ethylene-glycol is INDEXED**, **water-treatment/meg-water is ALSO INDEXED**, and **oilfield/meg is "Crawled – currently not indexed" with "Referring page: None detected"** (last crawl Sep 7) — i.e. orphaned *and* rejected. So the live contest is two indexed near-duplicates, not three. Consolidating water-treatment/meg-water via `canonicalOverride` would remove a currently-indexed page, which is a real trade-off and falls under the still-open "duplicate consolidations" decision — **not done, awaiting the user.** Evidence is captured here so the decision can be made without re-measuring.

- **2026-09-22** — GSC: sitemap 657 healthy; indexing requested for /chemicals/bahrain, /chemicals/uae, /chemicals/saudi-arabia (shortage-FAQ pages) before hitting the rolling 24h quota. **Crawl defect found & fixed:** /chemicals/qatar was "Discovered – never crawled" and /chemicals/kuwait "unknown to Google" — all four GCC country hubs had only ONE inbound internal link. City pages now link up to their country hub and hubs cross-link siblings (qatar/kuwait 1→6, uae/saudi 1→11 inbound), live on prod. Also fixed 12 blog guides starved at 1 inbound link (shell/mobil/castrol 240 impr, GBL 264 impr) via product guideUrl cross-links → 3–8 each. Queued for next quota window: qatar, kuwait, nitric-acid-68, nitric-acid-lab.
- **2026-09-21** — Tracker created. 6 fresh checks (3 new page-1 finds: lab chemicals #2, glycols #4, corrosion inhibitors #4–5). Sitemap 657 resubmitted to GSC (read same day). Indexing requested: 2 new pages + 3 stale soft-404s + 4 changed-snippet pages (9 of ~10 daily quota).
- Baselines from 2026-09-10 21-query audit and 2026-09-20/21 chlor-alkali + category sweeps (see docs/audits/2026-09-21-full-seo-audit.md and memory).

## How to update
Run the weekly scheduled agent, or in a Claude session: search each keyword with `&gl=om&hl=en&num=20`, record position + our URL + winner, update the table and append a Change Log line. Cross-check high-impression queries in GSC Performance for real average positions (SERP checks are directional). When a Tier-3 keyword enters page 1, promote the row to Tier 2 and note the shipped change that likely caused it.
