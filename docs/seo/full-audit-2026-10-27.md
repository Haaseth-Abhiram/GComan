# Full SEO / AEO / GEO check, every source: 2026-10-27

The user asked for a check of everything that decides whether gcoman.com is #1 when a GCC buyer needs a chemical: Google, Bing, Maps, AI engines, Search Console, Google Analytics and Bing Webmaster Tools, plus keyword research on how buyers actually search. Every number below was read live today, or carries its date. The four sources are kept apart, never blended (GSC, GA4, Bing WMT, live engines).

Keyword research: [`gcc-keyword-demand-2026-10-27.md`](./gcc-keyword-demand-2026-10-27.md) (336 Google autocomplete requests across OM/AE/SA/QA/KW/BH, English and Arabic).

## 1. Where we stand, by source

| Source | Reading | Verdict |
|---|---|---|
| **Search Console, 28 days** | 589 clicks (prev 536, **+10%**), 9.23K impressions (10.5K), CTR 6.4% (5.1%), position 8.7 (9.0) | Improving: fewer impressions, but better ones (US noise down) |
| **Search Console, 7 days** | 158 clicks (171). Oman 64, Saudi 20, UAE 11, Qatar 2, Bahrain 1, Kuwait 0 | Saudi at its best week; Kuwait and Qatar near zero |
| **Search Console, indexing** (as of 10-23) | 524 indexed, 273 not. Noindex 49 and alternate-canonical 37 are expected. Discovered-not-indexed 103, crawled-not-indexed 62, **Soft 404 13** (validation started), duplicate-canonical 3, redirect 5, 404 1 | Soft 404s are old WordPress /service/* URLs (fixed today, see 3) |
| **Search Console, manual actions** | None | No penalty: the templated-FAQ risk has not materialised |
| **Google Analytics** | 7 days: 17 users, 5 key events | Blind by design: analytics loads only after cookie consent (GSC shows 158 clicks). Don't use for traffic decisions |
| **Bing WMT, 3 months** | 182 clicks, 2.9K impressions, CTR 6.3% | Queries are long, procurement-agent style (see 2.4) |
| **Bing WMT, AI Performance (Copilot citations)** | 1.4K citations in 3 months. Pages: JSRS blog 820, dosing calculator 65, homepage 54, /products/agro 30, top-suppliers blog 30, solvents 29 … nitric Saudi page 10 | AI cites guides and tools, not product pages |
| **Bing WMT, backlinks / recommendations** | 1 referring domain; no open recommendations | Technically clean; authority is the gap |
| **Google, Oman head terms** | suppliers oman 2, in oman 1, muscat 3, company oman — ; suppliers gcc 1 | Unchanged |
| **Google, product hubs (Oman)** | caustic, fertilizer, HCl, oilfield, PAC, hypochlorite, nitric: absent from top 9; lab chemicals 2 (homepage) | Authority gap (Phase 8) |
| **Google, Maps pack "chemical supplier in oman"** | Global Chemicals LLC **2nd** (5.0, 2 reviews), behind Oman Formaldehyde (4.0, **11 reviews**) | Reviews decide the #1 slot |
| **Bing, Oman head terms** | suppliers oman 2, in oman 2, muscat 4 (was 5), company oman 10 | Muscat recovering |
| **Bing, legacy nitric URL** | `/products/acids/nitric-acid` gone from "gcoman nitric acid supplier oman", replaced by our food-grade nitric page | Yesterday's redirect stubs already working |
| **AI engines, bulk nitric Oman** (10-25) | ChatGPT, Copilot, Perplexity, Google AI Mode name us 1st; Gemini and Claude do not | Page wins on Bing-side engines; authority gap on Google/Brave |

## 2. Findings, most important first

1. **The Maps pack is the first thing an Oman buyer sees, and we are 2nd on reviews.** For "chemical supplier in oman" Google shows a Places pack above the organic results. Our website is organic #1 under it, but GSC records 142 impressions at position 2.1 and **0 clicks**: the pack takes them. Oman Formaldehyde leads with 11 reviews against our 2. Every review moves this.
2. **Demand is phrased by destination country, and the UAE dominates.** Autocomplete returns "<chemical> supplier(s) in uae" for about 33 of 45 chemicals, "in saudi arabia" for 7, and "in oman" for only 5 (nitric, HCl, urea, bentonite, acetone). UAE users are also suggested "chemical supplier in oman" and "chemical supplier in muscat", so UAE buyers do look for Oman suppliers.
3. **AI engines cite guides and tools, not product pages.** The JSRS guide alone earns 58% of Copilot citations; the dosing calculator is 2nd. A buyer-question guide (documents, import rules, how to order bulk chemicals in the GCC) is the highest-leverage GEO content we don't have. This is the "replicate the JSRS pattern at a commercial query" item that HANDOFF unlocked for today.
4. **Procurement agents search Bing like this:** "granular urea prilled urea trader distributor oman official contact -marketplace", "average price soda ash dense light oman", "oman white spirit solvent supplier producer", "castrol dealer in oman". They want an official contact, a distributor or authorised status, and a price. Product pages that state these plainly win agent answers.
5. **The brand-name collision still leaks.** We rank about 1.8 for "Global Chemicals & Maintenance Systems LLC" (132 impressions, 31 clicks) and its Arabic name. Those are someone else's customers. "global chemical company" (154 impressions, position 13) and "global chemical supplier" (52, position 15.7) are generic and contested.
6. **A wrong city page is matching a local query.** "chemical shop near me" (gl=om, 33 impressions in GSC at 5.8) shows our **Abu Dhabi** city page at 7, not Muscat.
7. **Soft 404s are old WordPress addresses.** /service/construction, /service/alcohols, /alcohols and others were redirected to the generic /products page, which Google treats as a soft 404, or had no rule.

## 3. Done today

- **Redirects (Develop `5b0e4dc`):** 16 legacy URLs now land on their matching category instead of /products, and the missing `/service/alcohols` rule was added. All three layers; 15/15 redirect e2e.
- **Indexing:** requested `/ar/products/ethanolamines/{mea,mdea}` and `/ar/products/food-beverage/{calcium-carbonate-food, calcium-lactate}`. Skipped as already indexed: tea-triethanolamine, ascorbic-acid.
- **Reads:** Google 15 reads + the "chemical supplier in oman" layout; Bing 4 head terms + the legacy-URL check; GSC 7d / 28d / queries / indexing / manual actions; GA4; Bing WMT performance, AI citations and recommendations.

## 4. Opportunities ranked (MASTER-PLAN Phase 9)

| # | Opportunity | Evidence | Who |
|---|---|---|---|
| 1 | **Reviews 2 → 15** (Maps pack #1 for "chemical supplier in oman / muscat") | Pack #2 behind 11 reviews; 142 + 59 impressions with 0 clicks | User |
| 2 | **Buyer guide in the JSRS pattern:** "How to buy industrial chemicals in Oman and the GCC: documents, import rules, bulk ordering" | JSRS guide = 820 of 1.4K Copilot citations | Claude (needs a fact pass by the user on regulations) |
| 3 | **Caustic soda and HCl pages for the UAE and Saudi Arabia** (the nitric country-page model) | "caustic soda suppliers in uae / in saudi arabia", "hydrochloric acid supplier in uae / suppliers in saudi arabia"; nitric country pages reach Bing 6 and Perplexity mentions | Claude, after the user confirms GCC export of both |
| 4 | **GCC water-treatment-chemicals hub** | "water treatment chemicals suppliers in uae" is the first suggestion at gl=ae and appears in all six countries | Claude |
| 5 | **Bentonite page upgrade** (+ barite if sold) | "bentonite suppliers / price / manufacturers in oman", "sulphur bentonite oman", "bentonite supplier in dammam" | User confirms barite; Claude builds |
| 6 | **Arabic urea / fertilizer page** | "يوريا عمان", "يوريا للبيع في عمان", "...في الامارات", "سماد يوريا للبيع" | Claude (Arabic review step as for nitric) |
| 7 | **Agent-friendly product facts:** "official contact", "authorised distributor", price basis, on the top 20 product pages | Bing procurement-agent queries | User gives price basis + authorised brands; Claude edits |
| 8 | **Synonym wording:** "isopropyl alcohol / IPA", "alum", "hydrogen peroxide price in oman" on the existing product pages | Autocomplete phrasing vs our titles | Claude (no retitles; body wording only) |
| 9 | **Pool chlorine / calcium hypochlorite (EN + AR)** | "calcium hypochlorite suppliers in uae / in saudi arabia", "كلور مسابح للبيع", "للبيع كلور مسابح الكويت" | Claude |
| 10 | **"near me" → Muscat:** link the Muscat city page from the homepage local block and GBP | Abu Dhabi page shown for "chemical shop near me" in Oman | Claude |

Unchanged and still first: the Phase 8 authority work (listings and earned links) is what moves Google organic, Gemini and Claude. Nothing above replaces it.

## 5. HANDOFF decisions due today (27 Oct)

- **The 320 templated FAQs:** the watch closed clean. No manual action, 28-day clicks +10%, position 9.0 → 8.7. **Recommendation:** don't delete them in bulk (they feed FAQ answers AI engines quote). Remove only the one boilerplate sentence that repeats on 147 pages, and stop adding templated FAQs. This needs the user's yes.
- **UAE snippet work:** now evidence-backed. UAE is where buyers name a destination (finding 2). It is covered by items 3, 4 and 9.
- **Replicate the JSRS pattern:** item 2.
