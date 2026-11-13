# Product deep dive: water treatment, urea, nitric acid, lubricants, pool / calcium hypochlorite, construction — 2026-11-13

The user asked: where do we stand for water treatment chemicals, urea, nitric acid and the other most-searched products, everywhere, and what to do. Readings below are from 2026-11-13. Sources are labelled and not blended: **GSC** (Search Console, 3 months, page filters), **G** (Google `pws=0` panel, latest ledger reading; today's 25 cells were used at 02:40), **B** (Bing, navigated today), **AI** (ChatGPT logged out, Perplexity signed-out session, today), **TR** (Google Trends, 12 months, `gcc-keyword-map-2026-11-13.md`). Google readings until ~12-01 fall in the November 2026 core update.

## 1. One table

| Product family | Demand (TR, GCC) | GSC pages, 3M (clicks / impressions / avg pos) | Google (G) | Bing (B) | ChatGPT | Perplexity | Verdict |
|---|---|---|---|---|---|---|---|
| **Lubricants** (Shell / Mobil / Castrol) | engine oil high in all 6 countries | **132 / 1,920 / 7.1** (category 95 clicks; Mobil 19, Shell 13, Castrol 3); Arabic pages 3–7 impr | "lubricants supplier oman" absent (mobil.com #1) | **#1** Oman | n/m | n/m | **Our strongest product family on Google.** Arabic lubricants almost invisible |
| **Urea** | highest product interest (KSA 67, UAE 44); Arabic يوريا high in KSA | **25 / 328 / 6.6**, CTR 7.6% (urea-fertilizer 20 clicks; Arabic 4) | "urea supplier oman" absent (omanchem); "buy urea in oman" absent | 6 Oman; absent UAE (chemstock.ae) | **not named** (lists producers OMIFCO, SIUCI, then Muscat Chemicals) | **named first** ("most directly relevant… Muscat stock") | Page converts well and produces RFQs (3 since 10-01); Google and ChatGPT don't see us as a urea source |
| **Nitric acid** | small volume, high value per order | **24 / 734 / 9.0** (68% food grade 12 / 415; **Saudi page 5 clicks**; Oman hub 2 / 58) | Oman, Saudi, Riyadh, Dammam absent (uvwater, nassguard.sa) | **#1** Oman, #3 Saudi | — (11-09: not named for nitric) | **"strongest GCC option"** for KSA | Google traffic comes from the food-grade grade, not "supplier" queries; Saudi page already earns clicks |
| **Water treatment** (71 product pages + GCC hub) | sodium bicarbonate, chlorine, "water treatment chemicals" low | **18 / 801 / 14.6** spread over 71 pages (sodium bisulphate 3 / 161 best) | "water treatment chemicals oman" absent (innovacorporate); "…supplier oman" 2 (10-27) | #3 Oman; absent UAE, KSA | **#2** (after OOISS; ahead of Metito) | **first** for RO + cooling towers | Wide but thin: many pages, each with little demand; AI engines rate us; Google doesn't |
| **Pool / calcium hypochlorite** | chlorine AE 28, KSA 21; Arabic pool searches | pool 17 / 549 / 10; **calcium hypochlorite 0 / 40 / 9.9 over 3 pages** (pool granules 16, water-treatment SKU 15, AR 9) | cal-hypo UAE / Dubai / Bahrain / Oman absent | **#1** "swimming pool chemicals oman"; Bahrain cal-hypo 2 | n/m | **first** (Bahrain + UAE) | **Top revenue product is nearly invisible on Google**, and its demand is split across two SKUs of the same chemical |
| **Construction** (epoxy / resin / sealants) | epoxy, resin, sealant: the most consistent GCC interest | epoxy-coating 6 clicks / 28d | — | epoxy resin Oman #3 (coating page) | n/m | n/m | New resin + sealant pages on Develop (`63d0c0b`) |

## 2. What this means

1. **Google is the gap for every product; Bing and the AI engines already favour us.** The pattern is the same as in `360-investigation-2026-11-13.md`: our pages win where a search engine reads the page (Bing, Perplexity, ChatGPT on water treatment) and lose where Google weighs link authority (1 referring domain vs omanchem's 41).
2. **Lubricants and urea already earn Google clicks** (6.9% and 7.6% CTR at positions 7.1 and 6.6): these are the families where a move from position 7 to the top 3 would roughly triple clicks with no new pages.
3. **Calcium hypochlorite, the largest invoiced line, has almost no Google presence**: 40 impressions in 3 months, split between `swimming-pool/calcium-hypochlorite-granules` and `water-treatment/calcium-hypochlorite-water` (same chemical, CAS 7778-54-3). The two GCC country pages (UAE, Bahrain) are 3 days old and not indexed by Google yet.
4. **ChatGPT answers urea with producers** (OMIFCO, SIUCI). A distributor is cited only when the wider web says it distributes that product: directories and trade listings that name us for urea.
5. **Water treatment is wide, not deep**: 71 pages share 801 impressions. More pages will not help; one strong hub plus the 5–6 revenue products will.
6. **Arabic is missing where demand is high**: Arabic lubricants pages get 3–7 impressions in 3 months while engine oil is one of the most searched terms in every GCC country.

## 3. Actions, by product

| # | Action | Evidence | Who | When |
|---|---|---|---|---|
| 1 | **Calcium hypochlorite: one strong URL.** Decide on GSC evidence whether `calcium-hypochlorite-water` canonicalises to `calcium-hypochlorite-granules` (or the reverse), as P10.11 did for PAC, soda ash and citric | 16 vs 15 impressions, same CAS, revenue #1 | Claude (P10.11 next family) | next daily run |
| 2 | **Lubricants Arabic**: check the Arabic titles/descriptions of the lubricants category and Mobil / Shell / Castrol pages carry the terms Arabic buyers search (زيوت التشحيم, زيت محرك, شحم) — fact-checked, page by page | AR pages 3–7 impressions | Claude | this week |
| 3 | **Urea**: P9.6 Arabic urea section on the fertilizers hub; reply to the 3 open urea RFQs; list on fertilizer / agri directories that name us as a urea distributor | ChatGPT names producers only; Perplexity names us | Claude / Sales / User | this week |
| 4 | **Nitric**: keep the food-grade page as the Google entry; the Saudi page is earning clicks — first full Google read of the country pages ~11-17 | 68% food 415 impr; Saudi 5 clicks | Claude | 11-17 |
| 5 | **Water treatment**: no new pages; continue P10.11 duplicate consolidation in this category; strengthen the GCC hub's internal links from the 5–6 revenue products (done today for cal-hypo / caustic / HCl via country links) | 71 pages, 801 impressions | Claude | ongoing |
| 6 | **Construction**: Publish the epoxy resin + sealant pages; add brands / packs once confirmed | most consistent GCC interest | User (publish, facts) | now |
| 7 | **Authority for all of the above**: directory listings and reviews naming the products (calcium hypochlorite, nitric, urea, lubricants) | the cause of every Google gap | User signs up, Claude fills | weeks 1–4 |
| 8 | **Reply to every enquiry within 24 hours** | 23 buyer RFQs uncontacted since 10-01 | Sales | now |
