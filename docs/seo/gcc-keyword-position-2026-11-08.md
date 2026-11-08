# GCC keyword investigation: what buyers search, where they click, and whether we are #1. 2026-11-08

Asked by the user: "what are the words people are searching all over the GCC … where most people are clicking … are we coming as number one". This file adds the three things the 10-27 autocomplete study (`gcc-keyword-demand-2026-10-27.md`, phrasing only) could not give: **real clicks/impressions** (GSC), **relative volume** (Google Trends) and **our position** on the whole phrase set.

## Sources (four, labelled, never blended)

| Label | Source | Scope |
|---|---|---|
| GSC | Search Console, property `https://gcoman.com/`, last 3 months, Web | 1.84K clicks, 33.7K impressions, avg position 10.3. Top-1,000 query table, country and page breakdowns for UAE and KSA |
| TR | Google Trends internal API (explore + multiline + relatedsearches), past 12 months, 6 GCC geos, 45 calls | Relative interest only (0–100 within one comparison). Product batches share the anchor "hydrogen peroxide" so ratios can be compared across batches; raw numbers across batches cannot |
| G | Google SERP, `pws=0`, unpersonalised fetch, top 9 | 7 new cells today (25/25 daily cap used, no captcha) + the latest reading of every cell in `location-ledger.md` (10-24..11-08) |
| B | Bing, latest ledger reading (10-25..10-27, `cc=XX`) | Not re-read today: the 11-08 Bing session was degraded |

## 1. Where the clicks actually are (GSC, 3 months)

| Country | Clicks | Impressions | Avg position |
|---|---|---|---|
| Oman | 754 | 7,894 | 5.1 |
| India | 313 | 2,846 | 9.4 |
| Saudi Arabia | 151 | 2,103 | 9.6 |
| UAE | 139 | 3,186 | 11.0 |
| Pakistan | 62 | 1,257 | 7.0 |
| Qatar | 33 | 417 | 7.7 |
| Kuwait | 31 | 492 | 7.8 |
| Bahrain | 16 | 288 | 8.3 |

- **Brand vs non-brand (top-1,000 queries):** brand 479 clicks / 2,446 impressions; **non-brand 81 clicks / 4,169 impressions**. About 200 of the "brand" clicks are for the *other* company (`global chemicals & maintenance systems llc` 100 + 33 + 22, Arabic `شركة جلوبال للانظمة الكيميائية والصيانة` 44; see the brand-collision memory). The remaining ~27K impressions are anonymised long-tail queries (mostly product pages).
- **Non-brand queries naming a place:** Oman 77 queries / 40 clicks / 1,183 impressions; UAE 26 / 1 / 131; KSA 15 / 1 / 51; Kuwait 10 / 1 / 21; Qatar 3 / 0 / 3; Bahrain 3 / 0 / 4; "GCC / Middle East / Gulf" 21 / 0 / 125. **Practically all non-brand clicks are Oman searches.**
- **UAE:** 265 of the UAE impressions are people *in the UAE* searching **"chemical supplier in oman"** (position 2.0), plus "chemical supplier in muscat" 142 (3.2) and "chemical suppliers in oman" 79 (1.6). UAE-local phrases sit on page 4–6: "chemical suppliers in dubai" 51.2, "industrial chemicals dubai" 38.3, "soap chemical supplier in uae" 47.8, `/chemicals/dubai` page average 45.1, `/chemicals/abu-dhabi` 22.2.
- **KSA:** impressions come from "near me" searches ("chemical shop near me" 93 impressions, position 5.2) landing on `/chemicals/dammam` (117 impressions, 8.6), `/chemicals/riyadh` (76, 10.0) and `/chemicals/jeddah` (66, 9.7). Brand clicks from KSA: 7.

### Non-brand queries by topic (GSC, 3 months)

| Topic | Queries | Clicks | Impr. | Impr.-weighted position | Leading query @ position |
|---|---|---|---|---|---|
| Generic "chemical supplier/company/shop" | 110 | 37 | 1,473 | 8.1 | chemical supplier in oman @2.0; chemical supplier in muscat @3.2 |
| Laboratory | 37 | 1 | 220 | 11.8 | tris laboratory @8.9; Na₂EDTA·2H₂O @8.7 |
| Acetic acid | 10 | 0 | 182 | 43.8 | acetic acid supplier @44.1 (151 impr.) |
| Pool (EN + AR) | 37 | 5 | 157 | 12.6 | كيماويات حمامات السباحة @11.0; بيع كيماويات حمامات السباحة @11.6 (UAE) |
| Corrosion inhibitor | 11 | 0 | 143 | 48.2 | corrosion inhibitor for gas pipelines @47.8 |
| Lubricant brands | 42 | 1 | 120 | 15.0 | castrol oman @8.3; exxonmobil oman @2.8 |
| Glycols | 10 | 0 | 113 | 29.7 | glycol suppliers @31.3 |
| Hypochlorite / chlorine | 42 | 2 | 87 | 7.9 | sodium hypochlorite food grade @3.7; chlorine for swimming pool @4.2 |
| Sulphur / bisulphate | 17 | 1 | 80 | 18.3 | sodium bisulphate @16.2 |
| Fertilizer / urea | 19 | 2 | 56 | 21.9 | سماد يوريا عماني @6.0; سماد اليوريا @10.1 |
| Oilfield | 12 | 0 | 55 | 51.5 | clear brine fluids @82.8 |
| Nitric | 10 | 0 | 54 | 4.3 | nitric acid food grade @3.5; nitric acid 68% @4.4 |
| Detergent raw materials | 11 | 0 | 45 | 32.0 | industrial surfactants @39.4 (KSA) |

## 2. What the GCC searches most (Trends, relative, 12 months)

**Generic phrasing.** In the UAE and KSA the phrase with volume is **"chemical company"** (AE 41, SA 30), not "chemical supplier" (1), "chemical trading" (AE 6) or "industrial chemicals" (0). Oman, Qatar, Kuwait and Bahrain are 0–2 for every generic phrase: **B2B chemical searches in those four countries are below Trends' measurement threshold.** The buyers exist (GSC shows them) but in tens per month, not thousands.

**What "chemical company" means to Google in the GCC (related queries):** UAE: *global chemical company* (100, our name, shared with the other company), Sadara (53), Qatar Chemical Company (38), BASF (17). KSA: Saudi Chemical Company (100), Sadara (96), Dow (7). Qatar: Qatar Chemical (100). Kuwait: Al Sanea Chemical Products (5). Oman `chemicals`: Gulf International Chemicals (43). These are **navigational searches for named manufacturers**, not supplier searches. No buyer phrase is "rising" in any GCC country; the rising lists are students and share prices.

**Products (ratio to the hydrogen-peroxide anchor in the same batch, AE / SA):**

| Product | AE | SA | Note |
|---|---|---|---|
| Urea | ~3.0× | ~4.1× | Also Arabic يوريا SA 69 vs anchor 15; mixed intent (fertilizer + cosmetic cream) |
| Glycerin | ~1.3× | ~1.5× | Mixed (cosmetic) |
| Chlorine | ~1.8× | ~1.3× | Pool intent; Arabic كلور SA 34 vs anchor 15 |
| Hydrogen peroxide | 1.0 | 1.0 | Anchor; Oman's 1st autocomplete for "hydrogen peroxide price" is "…in oman" (10-27) |
| Methanol | ~0.6× | ~0.8× | Navigational (Oman Methanol / SABIC plants) |
| Hydrochloric acid | ~0.35× | ~0.05× | UAE-heavy |
| Isopropyl alcohol | ~0.27× | ~0.19× | |
| Acetic acid | ~0.26× | ~0.16× | GSC: we get 151 impressions at position 44 |
| Bentonite | ~0.24× | ~0.10× | |
| Sulfuric acid | ~0.19× | ~0.21× | |
| Nitric acid | ~0.12× | ~0.07× | Small market by volume; high value per order |
| Caustic soda | ~0.07× | ~0.05× | Arabic صودا كاوية ≈ 0 everywhere |
| Sodium hypochlorite, soda ash, calcium chloride, ethylene glycol | ≤0.05× | ≤0.05× | Below threshold |

Bare product names include consumer and student intent, so these ratios rank *interest*, not buyer volume. Oman, Qatar, Kuwait and Bahrain round to 0–4 for almost everything (Oman: urea 21 and chlorine 7 vs anchor 0–1 are the only readings above noise).

## 3. Are we #1? The position grid

Latest reading per cell. G = Google `pws=0`, B = Bing `cc=XX`, GSC = 3-month average position. **Bold = today's new cells.**

### Oman, generic

| Phrase | G | B | GSC | #1 if not us |
|---|---|---|---|---|
| chemical suppliers in oman | **1** (10-27) | 2 | 1.7 | B: omanchem.com |
| chemical supplier in oman | — | 3 | 2.0 | |
| chemical suppliers oman | 2 (11-08) | 2 | | omanchem.com |
| chemical supplier muscat | 3 (11-05) | 4 | 3.2 | muscatchemical.com |
| chemical company (in) oman | — (10-27) | 10 | 6.6–8.0 | omanchem.com |
| chemical shop near me (gl=om) | 7 (10-27) | | 5.8 | dubichem.com |
| chemical suppliers gcc | | **1** | | |
| Cities: rustaq 1, duqm 7, salalah 5, rusayl 7 (G 11-05) | | rustaq 1, rusayl 1, duqm 1, salalah 3, sohar 3 | | salalahchemical.com, soharchemical.com |

### Oman, products (Google)

| Phrase | G | #1 |
|---|---|---|
| laboratory chemicals supplier oman | 2 | omanchem.com |
| water treatment chemicals supplier oman | 2 (10-27) | innovacorporate.com |
| water treatment chemicals gcc supplier oman | 4 | ooiss.com |
| pool chlorine gcc supplier oman | 4 | uvwater.biz |
| nitric / caustic / hydrochloric / hypochlorite / PAC / oilfield / fertilizer / urea / bentonite supplier oman | — (all) | omanchem.com ×5, muscatchemical.com ×3, omanagrifertilizer.com |
| **hydrogen peroxide supplier oman** | **—** | omanchem.com |
| **sulphuric acid supplier oman** | **—** | omanchem.com |
| **swimming pool chemicals oman** | **—** | omanchem.com |
| **glycerin supplier oman** | **—** | muscatchemical.com |

On Bing the same product cells read 1–6 (nitric 1, lab 1, caustic 2, HCl 2, hypochlorite 2, bentonite 3, fertilizer 3, oilfield 3, PAC 4, water treatment 6).

### Rest of the GCC

| Phrase | G | B | #1 (Google) |
|---|---|---|---|
| **chemical supplier in oman, searched from UAE (gl=ae)** | **1** | | gcoman.com |
| chemical suppliers in uae | — | — | kemipex.com (B: yellowpages-uae.com) |
| **chemical company in uae** | **—** | | basf.com, altaherchemicals.com, kemipex.com |
| chemical supplier dubai / abu dhabi / sharjah / fujairah | — | — | kemipex.com, yellowpages-uae.com, fujairahchemical.com |
| chemical supplier ras al khaimah | 4 | — | yellowpages-uae.com |
| chemical suppliers in saudi arabia | — | — | chemadd.com.sa (B: ensun.io) |
| **chemical company in saudi arabia** | **—** | | saudichemical.com, dow, sadara (navigational) |
| chemical supplier riyadh / jeddah / dammam / jubail | — | —/2/—/3 | chemadd.com.sa, nassguard.sa, takweenchem.com |
| chemical suppliers in qatar / doha | — | —/2 | deluxechemical.com (B: ensun.io) |
| chemical suppliers in kuwait / kuwait city | — | —/4 | alsanea.com (B: ensun.io) |
| chemical supplier bahrain | — | 8 | safic-alcan.com |
| nitric acid supplier uae / ksa / qatar / kuwait / bahrain | — (all) | 2 for Qatar (directional) | yellowpages sites, nassguard.sa, deluxechemical.com |
| caustic soda / HCl / calcium hypochlorite / water treatment suppliers in uae | — (all) | | yellowpages-uae, chemstock.ae, dutcotennant.com, emveestech.com |

**Answer: we are #1 (or #2) only for Oman generic "chemical supplier(s) in oman", including when UAE buyers search it. Everything else (product × Oman, and any phrase naming a non-Oman GCC country) is page 1 on Bing at best and absent on Google.**

## 4. Who beats us, and why

- **Product × Oman on Google** belongs to omanchem.com, muscatchemical.com, soharchemical.com and salalahchemical.com: exact-match domains, with omanchem's 41 referring domains vs our ~1 (`project_nitric_authority_gap`). The pages are not better than ours. The domains have authority.
- **UAE / KSA / Qatar / Kuwait / Bahrain** belong to local distributors (kemipex, chemadd, nassguard, deluxechemical, alsanea) and **directories** (yellowpages-uae, ensun.io, bahrain/uae yellowpages). On Bing, **ensun.io is #1 for "chemical suppliers in saudi arabia", "…in qatar" and "…in kuwait"**: one listing there puts us inside the #1 result in three countries.
- **"chemical company"** in UAE/KSA is navigational for manufacturers (BASF, Sadara, Saudi Chemical, Dow). Not winnable, and not buyers looking for a supplier.

## 5. What to do (ranked by expected effect; HANDOFF do-not-do respected)

1. **Directories that already hold #1 in the countries where we're absent (user signs up, Claude fills)**: ensun.io (Bing #1 in KSA, Qatar, Kuwait), yellowpages-uae.com (Google/Bing #1 in Dubai, Abu Dhabi, Sharjah, RAK, "suppliers in uae"), bahrainyellowpagesonline / uaeyellowpagesonline (Google #1 for nitric Bahrain/UAE), Made in Oman Gate (WS #1 for Oman head terms). This is P8.A plus P5.5, now with the evidence of which directory wins which country.
2. **Referring domains for product × Oman**: the only lever that moves the omanchem-held cells. Earned links (P8, `earned-links-outreach-2026-10-25.md`). No new pages.
3. **Product-page deepening on the GCC-demand products we already sell, with the independent fact-check**: hydrogen peroxide (highest anchor-level interest, and "price in oman" is its 1st Oman autocomplete), glycerin, isopropyl alcohol (add "isopropyl alcohol / IPA" wording), acetic acid (151 impressions at position 44: the industrial grade has no page; confirm whether we sell it), bentonite. This is the queued Phase 3 demand-tail item.
4. **Striking distance (positions 4–15) already earning impressions:** "chemical supplier in muscat" (3.2, 146 impr., 0 clicks: the snippet isn't winning the click), Arabic pool chemicals "كيماويات حمامات السباحة" (11.0, UAE: the new Arabic pool-chlorine hub went live today, re-read 11-22), "سماد يوريا عماني" (6.0: the new Arabic urea hub), "chemical companies in oman" (8.0), "chemical shop near me" (5.8 OM, 5.2 KSA: Maps/GBP-driven).
5. **"chemical company" wording**: GBP description and directory listings should say "chemical company" as well as "supplier", because that is the dominant GCC phrasing. No retitling of site pages (HANDOFF).
6. **Not worth chasing:** "chemical company in uae/saudi arabia" (manufacturers' brand searches), Trends-"rising" terms (students, share prices), caustic soda Arabic (≈0 volume), product × city pages (HANDOFF).

## Re-read

Together with the Phase 9 cells on **2026-11-22**: the 7 new Google cells above, GSC 3-month non-brand totals (81 clicks / 4,169 impressions baseline) and the UAE "chemical supplier in oman" impressions.
