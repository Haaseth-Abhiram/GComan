# GEO & SERP Position Assessment — gcoman.com — 2026-09-28

**What this is:** a systematic measurement of where Global Chemicals LLC actually ranks in AI answers (GEO) and Google results (SERP), why, and what it would take to be #1 in both. Every number below was measured this week, not estimated. Method and caveats at the end.

---

## 1. Scorecard

| Dimension | Score | Evidence |
|---|---|---|
| **Technical GEO readiness** | **9/10 — best in market** | Only site of 6 with a substantive llms.txt (1,449 words vs omanchem's 258; 3 competitors have none). Only site naming GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot individually. Prerendered HTML, rich schema. |
| **Brand-query AI visibility** | **10/10 — #1 everywhere** | #1 on ChatGPT, Gemini, Claude and Perplexity for "best chemical suppliers in Oman". |
| **Product-query AI visibility** | **3/10** | Caustic soda: #2 ChatGPT, #3 Claude, **absent on Gemini**. Fertilizer: **absent entirely on ChatGPT**. JSRS/PDO: only #3. |
| **Page citability** | **3.8/10** | **4 of 360 pages contain a table.** 334 pages have no visible author or date. 320 of 470 product FAQs sit below the citable-passage floor. |
| **Third-party entity footprint** | **0/10** | **Zero** distinct third-party properties vs competitors' 2–15. No Wikipedia, Wikidata, Reddit, YouTube, or directory listing. Plus an active, damaging name collision. |
| **Index footprint** | **2/10** | 657 URLs vs muscatchemical 16,195 / omanchem 13,955 / sohar 9,381 — a **25× gap**. |

**Overall: strong foundation, no corroboration.** We have the best-engineered site in the market and almost no independent evidence that we exist.

---

## 2. Where we position today (measured)

### Brand / category queries — we win, everywhere

| Platform | Result |
|---|---|
| ChatGPT | **#1 of 7**, accurate ISO 9001 + JSRS detail, cites gcoman |
| Gemini | **#1 of 5**, and named first again in its generated RFQ checklist |
| Claude | **#1**, same framing, sourced from gcoman |
| Perplexity | **#1 of 5** — "ISO 9001:2015, JSRS-certified, 275+ products", cites gcoman |
| Google organic (`gl=om`) | **#1** |

This is genuinely excellent and is the payoff of the JSRS/ISO/llms.txt/schema work. **It is also the ceiling of what on-site work alone can buy.**

### Product & vertical queries — we lose, and sometimes vanish

| Query | Our position | Who wins |
|---|---|---|
| Caustic soda, bulk, water treatment | #2 ChatGPT · #3 Claude · **absent Gemini** · not in Google top-10 | Oman Chlorine (real manufacturer), Hakim Water, MBBT |
| **Urea / DAP fertilizer for a date-palm farm** | **ABSENT from ChatGPT's 7-supplier answer** | Sohar International Development, OMIFCO, Makan, Oman Fertilizer, EGT |
| **JSRS-registered oilfield production chemicals** | **#3 of 5** | Nibras Oil & Gas, Shmookh Energy |

**The two findings that matter most:**

**(a) We are absent from the fertilizer answer while ranking #1 on Google for agro terms.** The keyword tracker has `agricultural gypsum oman` #1 and `dap npk fertilizer oman` #1 — agro is our single best-performing vertical. Yet ChatGPT listed seven suppliers and we were not one of them. This is the clearest possible proof that **SERP rank and AI visibility are different games.**

**(b) We are only #3 on the JSRS query — our strongest content asset.** `/blog/jsrs-chemical-supplier-pdo-oman` ranks #1 on Google. In ChatGPT it loses to two oilfield-services companies. The audit shows why: that page carries **852 words and exactly 2 checkable numeric facts.** It asserts credibility without evidence a model can quote.

---

## 3. Diagnosis — why we win brand and lose product

Three independent gaps, in order of impact.

### Gap 1 — Zero third-party corroboration (the dominant factor)

| Signal | Us | omanchem | muscatchemical | Oman Chlorine |
|---|---|---|---|---|
| Distinct 3rd-party properties | **0** | 3 | 4 | 15+ |
| Directory listings | **0** | ✓ | ✓ (Made in Oman Gate, Metoree) | ✓ (Zawya, MSX, Crunchbase, NTC) |
| YouTube | 1 video, 3 subscribers | shared channel | shared channel | — |
| Wikipedia / Wikidata | ✗ / ✗ | ✗ / ✗ | ✗ / ✗ | named in Ominvest article |

AI engines corroborate entities against independent sources. We have none. Brand queries still work because our *own* site is unambiguous and well-structured — but for "who supplies X", models reach for directories and vendor lists, where we do not appear.

### Gap 2 — Active brand confusion (worse than absence)

Every third-party "Global Chemicals + Oman" record resolves to **Global Chemicals & Maintenance Systems LLC** (Al Barami Group, est. 1976) — a *different* company that holds the D&B, OmanYP, LinkedIn and Facebook records a model would retrieve. GSC already shows this bleeding into our data (21 clicks on that company's name).

A model asked "who is Global Chemicals in Oman?" may describe an O&M contractor. *(Partially mitigated: I added a disambiguation FAQ to the homepage on 09-27 — but that only fixes our own site, not the third-party records.)*

### Gap 3 — Low citability: we are hard to quote

| Signal | Finding |
|---|---|
| Pages with a table | **4 of 360** |
| Pages with visible author + date | 26 (blogs only) — **334 without** |
| Product FAQs below the ~134-word citable floor | **320 of 470** (median 48 words) |
| Agro product pages | **score 27/100** — 419 words, **zero question headings** |
| `/chemical-suppliers-middle-east` | 2,758 words, **2 numeric facts** — and its own H2 promises "Export Lead Times, Incoterms & Documentation" |

Competitors win with *worse* pages — muscatchemical's caustic landing has **zero H2s**; omanchem's has **no H1** and 479 words. They win on footprint and corroboration, not quality. But our best content is still formatted as prose where AI wants tables and self-contained blocks.

**Honest note on the FAQs I generated this week:** 320 of 470 are ~48 words and templated — a supplier-availability statement, not an answer. At that scale they read as boilerplate and won't be cited. The other 144 (≥80 words, real dosing/spec facts) are genuinely good and are the model to follow. **Recommendation: stop adding FAQs; rewrite the short tier.**

---

## 4. What's required

### Track A — Business actions (the actual bottleneck; I cannot do these)

These address Gaps 1 & 2, which are worth more than everything in Track B combined.

1. **Claim directory listings.** Specific open slots found, in priority order:
   `omanyp.com` (free "Get Listed") · `yellowpages.om` (paid, info@yellowpages.om) · `recordsmarine.com` (vendor onboarding — currently lists 4 competitors, us absent) · `ensun.io` · `lookchem.com` ("Join Free") · `go4worldbusiness.com` · `chemicalbusinessdirectory.com` · Crunchbase · Zawya · OCCI.
   Use the NAP block in `docs/seo/authority-building-kit-2026-09-26.md` verbatim so records match.
2. **D&B registration — specifically to disambiguate** from Global Chemicals & Maintenance Systems LLC. This is the highest-value single action on the list.
3. **Wikidata entity** — ready-to-paste statements in `docs/seo/geo-entity-kit-2026-09-27.md`.
4. **Reviews** — 2 today vs a competitor's 8; the map pack is already earned for several product terms.
5. **PR is uncontested ground.** No Oman Observer / Times of Oman / Muscat Daily coverage exists for *any* trading-house competitor. A single placement would be a genuine differentiator.

### Track B — Content & code (I can do these)

Ordered by measured leverage:

1. **Add tables.** Only 4 of 360 pages have one. Start with: PAC vs alum (dose, pH range, sludge volume, cost/m³); caustic soda grades (assay × pack × application × lead time) — *the data already exists as structured arrays, this is pure reformatting*; GCC lead times by country.
2. **Rewrite the 320 short FAQs** to 130–170 words each with a real dosing/spec/compatibility fact, and drop the "Contact us for current pricing and a Certificate of Analysis" closer (on 147 answers). **This is an editorial job, not an automation job** — mass-generating longer templates would make the scaled-content problem worse, not better.
3. **Fill the two fact vacuums**: `/chemical-suppliers-middle-east` (2 facts / 2,758 words) and the JSRS blog (2 facts / 852 words — add the actual JSRS registration number, ICV %, ISO cert number, vendor-qualification turnaround). The JSRS one directly explains our #3 AI position.
4. **Add a ~30-word TL;DR answer block under every H1** — copied from muscatchemical, who do this site-wide and beat us on product queries with 141-word pages.
5. **Fix the agro cluster** (score 27/100): split the dense fact paragraph into a 150-word "What is X used for in Oman fertigation?" block. Agro already has 15–17 unit facts per page — they're just compressed into unquotable prose. **This is the cheapest path to fixing the fertilizer-answer absence.**
6. **Add author + dateModified** to commercial and product pages (currently blog-only).
7. **Amplify `/tools/dosing-calculator`** — 22 unit facts, 4 named formulas, an explicit reuse licence, and **genuinely unique in this market** (no competitor publishes calculators, prices, or open SDS libraries). At 595 words it is under-built for what it could earn.

### Track C — Strategic question for you

Competitors hold 9,381–16,195 indexed URLs to our 657 by generating **product × city permutations**. That 25× footprint is a large part of why they own product queries. Replicating it means programmatic pages — which conflicts with the thin-content risk already flagged. **I'd advise against chasing it**, and instead winning the verticals where authority is contestable (agro, lab, food-grade, JSRS) with genuinely better, quotable pages. Worth an explicit decision rather than drift.

---

## 5. Realistic expectation

**"#1 everywhere" is achievable for brand and for our open verticals — it is not realistic for commodity product terms** (caustic soda, PAC, soda ash) in the near term. Oman Chlorine *manufactures* chlor-alkali; AI engines are correct to rank a producer above a distributor for bulk tanker enquiries. Competing there means competing on facts we don't have.

The winnable path: agro, lab chemicals, food-grade, JSRS/vendor-qualification, and the GCC export frame — where competitors are weak, we already rank, and the only missing piece is quotability plus third-party corroboration.

---

## Method & caveats

- AI platforms queried live on 2026-09-28: ChatGPT (logged out), Gemini (logged-in account — **results may carry personalization bias**), Perplexity (logged out; capped after 1 query by a sign-in wall — I did not create an account), Claude via web search. Google checked with `gl=om&hl=en`.
- This is a spot-check across ~6 queries, not a tracked rank panel — directional, same caveat as the manual SERP checks in `keyword-rank-tracker.md`.
- Competitor technical data fetched from raw HTML with AI-crawler user agents. `hakimwater.com` could not be assessed: a local FortiGuard firewall MITM's the connection from this network (confirmed via the TLS chain) — that is our network, not their blocking.
- Citability figures parsed programmatically from all 360 prerendered English pages, not sampled.
- No AI Overview box triggered for the tested queries this session; AIO behaviour is query- and session-dependent and would need repeat sampling.
