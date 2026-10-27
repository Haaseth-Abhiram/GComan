# GCC keyword demand: how buyers search for chemicals, and where we have no page. 2026-10-27

Source: Google autocomplete only (`suggestqueries.google.com`, `client=firefox`), 336 requests on 2026-10-27, 1 s throttle, 0 errors. Seeds: 14 generic English phrases at gl=om, 5 generic phrases at gl=ae/sa/qa/kw/bh, 45 chemical names x (`supplier`, `price`, `oman`) at gl=om plus `supplier` at gl=ae and gl=sa, 19 Arabic seeds at gl=om/sa/ae, and 15 Arabic `<chemical> للبيع` seeds at gl=om. Raw results were kept in the session scratchpad, not in the repo. Autocomplete shows which phrasings exist. It does **not** measure search volume, and this file never claims one.

**Method caveat (important).** The `gl` parameter barely localises this endpoint. For most product seeds the list is the same at om, ae and sa. Where it does change, the change is usually one slot: the first generic suggestion, e.g. "chemical suppliers in qatar" at gl=qa. So the **country named in the phrase** is the demand signal, not the `gl` that returned it. Phrases that appeared only at one `gl` are marked.

## Answer

GCC buyer phrasing is overwhelmingly **"<chemical> supplier(s) in uae"**. That pattern appears for about 33 of the 45 chemicals seeded, in every gl. "in saudi arabia" follows for 7 (caustic soda, HCl, nitric, calcium hypochlorite, acetone, xylene, bentonite). **"in oman" appears for only 5 chemicals with a bare `supplier` seed**: nitric acid, hydrochloric acid, urea, bentonite and acetone. Qatar shows up only for isopropyl alcohol and corrosion inhibitor, Dubai for calcium hypochlorite, chlorine tablets and LABSA, and Dammam for bentonite. Price searches are global ("per kg", "in pakistan/bangladesh"), with two Oman exceptions: **"hydrogen peroxide price in oman"** (first slot at gl=om) and **"urea price in oman"**. Arabic searches are mostly about uses and consumer products; the commercial strings are `للبيع` (for sale) and `اين يباع` (where is it sold). The missed opportunities, in order:
1. UAE and Saudi country pages for the two chemicals that already have an Oman hub, caustic soda and HCl.
2. A bentonite page; it is the strongest Oman-specific product demand with no hub.
3. A GCC water-treatment-chemicals hub.
4. Urea in Arabic.
5. Industrial sulphuric acid, where we only have a lab-grade page.

## Chemical-by-chemical

Countries = the country or city named in a received suggestion. "om-only" = it appeared only when gl=om.

| Chemical | Countries in buyer suggestions | Example phrases received (EN / AR) | Our coverage | Action |
|---|---|---|---|---|
| Caustic soda / sodium hydroxide | OM, UAE, KSA | "caustic soda suppliers in uae", "caustic soda suppliers in saudi arabia", "caustic soda price in oman", "caustic soda manufacturers in oman", "caustic soda flakes oman", "sodium hydroxide suppliers in uae"; AR "صودا كاوية للبيع", "صودا كاوية قشور", "صودا كاوية سائلة", "صودا كاوية السعودية" (gl=sa) | COVERED-HUB (Oman); ARABIC GAP | UAE + KSA country pages (nitric model); Arabic hub candidate |
| Hydrochloric acid | OM, UAE, KSA | "hydrochloric acid supplier in oman", "hydrochloric acid supplier in uae", "hydrochloric acid suppliers in saudi arabia" | COVERED-HUB (Oman) | UAE + KSA country pages |
| Nitric acid | OM, UAE, KSA | "nitric acid supplier in oman", "nitric acid suppliers in uae", "nitric acid supplier in saudi arabia"; AR "حمض النيتريك اين يباع", "حمض النيتريك في الزراعة" (gl=sa) | COVERED-HUB, all 6 countries + Arabic | none (see 10-22 file) |
| Sulphuric / sulfuric acid | OM, UAE | "sulphuric acid oman", "sulphuric acid manufacturers in oman", "sulfuric acid suppliers in uae"; AR "حمض الكبريتيك للبيع", "حمض الكبريتيك للبطاريات", "حمض الكبريتيك في الزراعة" | COVERED-PRODUCT (lab grade only, `sulfuric-acid-lab`) | Industrial-grade product page **if we sell it** (user to confirm) |
| Bentonite | OM, UAE, KSA, Dammam | "bentonite suppliers in oman", "bentonite price in oman", "bentonite manufacturers in oman", "bentonite clay oman", "sulphur bentonite oman", "bentonite supplier in dammam" (gl=sa only) | COVERED-PRODUCT (`oilfield/bentonite-powder`); mentioned in oilfield hub | Hub candidate (bentonite/drilling-mud, Oman + KSA) |
| Barite | UAE | "barite suppliers in uae", "barite oman" | NO PAGE (named in copy only) | Product page if sold; pairs with bentonite |
| Urea | OM, UAE, "middle east" | "urea supplier in oman", "urea price in oman", "urea oman suppliers", "urea oman price", "urea price middle east", "urea suppliers in uae"; AR "يوريا عمان", "يوريا للبيع في عمان", "يوريا للبيع في الامارات", "سماد يوريا للبيع" | COVERED-HUB (fertilizers, generic) + product; ARABIC GAP for the hub | Urea section/FAQ on the fertilizers hub; Arabic fertilizer/urea hub candidate |
| Hydrogen peroxide | OM (om-only first slot), UAE | "hydrogen peroxide price in oman", "hydrogen peroxide oman", "hydrogen peroxide suppliers in uae"; AR "بيروكسيد الهيدروجين للبيع" | COVERED-PRODUCT (`hydrogen-peroxide-50` canonical) | Product page improvement: Oman + price/pack wording |
| Calcium hypochlorite / chlorine tablets | UAE, KSA, Dubai, Kuwait (AR) | "calcium hypochlorite suppliers in uae", "...in saudi arabia", "calcium hypochlorite supplier in dubai", "chlorine tablets suppliers in dubai"; AR "كلور للبيع", "كلور مسابح للبيع", "للبيع كلور مسابح الكويت", "كلور خام للبيع" | COVERED-PRODUCT (swimming-pool, 12 pages) | Hub candidate (pool chlorine, GCC); Arabic candidate |
| Sodium hypochlorite | UAE | "sodium hypochlorite suppliers in uae", "sodium hypochlorite oman" | COVERED-HUB | none (only a UAE country page would add anything) |
| Poly aluminium chloride | UAE | "poly aluminium chloride suppliers in uae"; Arabic seed returned **no suggestions** | COVERED-HUB | none; confirms P2.4's "weak on evidence" |
| Alum / aluminium sulphate | OM, UAE | "alum powder in oman", "alum price in oman", "alum stone oman", "alum price in uae"; "aluminium sulphate" returned no geo phrase | COVERED-PRODUCT (aluminium sulphate) | Low: "alum stone" is the consumer potash-alum stone; add the word "alum" to the aluminium sulphate page at most |
| Soda ash | OM, UAE | "soda ash manufacturers in oman", "soda ash oman", "soda ash supplier in uae"; AR "كربونات الصوديوم للبيع" | COVERED-PRODUCT (5 split pages) | Product page improvement (one primary) |
| Acetone | OM, UAE, KSA | "acetone supplier in oman", "acetone supplier in uae", "acetone supplier in saudi arabia" | COVERED-PRODUCT (lab grade only) | Industrial grade page if sold, else lab page improvement |
| Corrosion inhibitor | UAE, Qatar | "corrosion inhibitor suppliers in uae", "corrosion inhibitor suppliers in qatar", "corrosion inhibitor manufacturers in uae" | COVERED-PRODUCT (10+ pages, category page) | Hub candidate (GCC) |
| LABSA / SLES | OM, UAE, Dubai | "labsa manufacturers in oman", "labsa supplier in dubai", "labsa suppliers in uae", "sles suppliers in uae" | COVERED-PRODUCT | Product page improvement; possible detergent-raw-materials hub |
| Isopropyl alcohol | OM, UAE, Qatar | "isopropyl alcohol oman", "isopropyl alcohol lulu oman" (retail), "isopropyl alcohol suppliers in uae", "isopropyl alcohol supplier in qatar" | COVERED-PRODUCT (`isopropanol-*`; title says "Isopropanol") | Product page: add "isopropyl alcohol / IPA" wording |
| Ethanol | OM, UAE | "ethanol price in oman", "ethanol suppliers in uae" | COVERED-PRODUCT | Product page improvement |
| Citric acid | OM | "citric acid oman", "citric acid powder oman"; AR "حمض الستريك للبيع", "حمض الستريك اين يوجد" (gl=sa) | COVERED-PRODUCT | none / minor |
| Calcium chloride | OM, UAE | "calcium chloride oman", "calcium chloride supplier in uae"; AR "كلوريد الكالسيوم للبيع", "كلوريد الكالسيوم اين يباع" | COVERED-PRODUCT | none / minor |
| Potassium nitrate | OM, UAE | "potassium nitrate oman", "potassium nitrate suppliers in uae" | NO PAGE (named in Products.tsx copy) | Product page if sold |
| Methanol | OM (navigational) | "methanol oman" -> 9 of 10 are "oman methanol company …"; AR "ميثانول صلالة", "ميثانول للبيع" | COVERED-PRODUCT | none: the brand OMC owns the phrase |
| Glycols (MEG, PG), glycerine, TEA, ferric chloride, toluene, xylene, sodium bicarbonate, sodium metabisulphite, antiscalant, phosphoric acid | UAE (xylene also KSA) | "ethylene glycol suppliers in uae", "propylene glycol supplier in uae", "glycerine suppliers in uae", "triethanolamine supplier in uae", "ferric chloride supplier in uae", "toluene suppliers in uae", "xylene suppliers in saudi arabia", "sodium bicarbonate suppliers in uae", "sodium metabisulfite suppliers in uae", "antiscalant suppliers in uae", "phosphoric acid suppliers in uae" | COVERED-PRODUCT (phosphoric: lab only) | none now (UAE-only pattern) |
| EDTA, biocide, defoamer, magnesium chloride, ammonium sulphate, aluminium sulphate, DAP | none (DAP: "dap fertilizer oman") | no GCC buyer phrase received | various | none |

## Generic "chemical supplier / company" phrasing per country

| gl | First-slot local suggestions received |
|---|---|
| om | "chemical suppliers in oman" (1st for both "chemical supplier" and "chemical suppliers in"), "chemical company in oman" (1st) |
| ae | "chemical suppliers in uae", "chemical suppliers in dubai", **"chemical supplier in oman"**, "chemical suppliers in abu dhabi", **"chemical supplier in muscat"**, "chemical suppliers in sharjah", "chemical suppliers in ajman"; "chemical company dubai", "chemical company in jebel ali"; "water treatment chemicals suppliers in uae" (1st at gl=ae) |
| sa | "chemical suppliers in saudi arabia", "...in dammam", "chemical supplier in riyadh", "...in jeddah", "...in jubail"; "chemical company in riyadh", "...in dammam" |
| qa / kw / bh | "chemical suppliers in qatar / kuwait / bahrain" (1st); "chemical company in qatar / kuwait" (1st) |
| all | "chemical distributors in uae", "chemical trading company in uae", "chemical trading company in dubai", "chemicals uae" (from "chemicals near me", gl=om), "lubricants suppliers in uae / qatar / saudi arabia", "wholesale lubricant oil suppliers" |

Coverage: Oman, UAE and KSA country phrasing and Muscat, Dubai, Abu Dhabi, Sharjah, Riyadh, Jeddah, Dammam, Jubail, Doha, Kuwait City and Bahrain are all covered by `/chemicals/*` pages and the two supplier hubs. **Gaps: Ajman and Jebel Ali** ("chemical suppliers in ajman", "chemical company in jebel ali") have no city page. There is also **no water-treatment-chemicals hub** and **no lubricants hub** (P2.3 is still open). The UAE list offering "chemical supplier in oman" and "in muscat" is a cross-border signal: people searching from UAE look for Oman suppliers.

## Arabic demand findings

- Generic supplier phrasing barely exists. "مورد كيماويات" returns only itself in om, sa and ae. The commercial strings are "شركات توريد كيماويات صناعية" (industrial chemical supply companies) and "مواد كيميائية للبيع". "شركة كيماويات" is all Egyptian and Jordanian company names.
- **Caustic soda is the most commercial Arabic product query**: "صودا كاوية قشور" (flakes), "صودا كاوية سائلة" (liquid), "صودا كاوية للبيع", "صودا كاوية السعودية" (gl=sa), "صودا كاوية لصناعة الصابون" (gl=sa). This makes caustic the best candidate for a second Arabic hub after nitric.
- **Urea**: "يوريا عمان" (gl=om), "يوريا للبيع في عمان", "يوريا للبيع في الامارات", "سماد يوريا للبيع", "يوريا سابك للبيع". This is the only Arabic phrase naming Oman for a product. Most other urea suggestions are cosmetic creams.
- Where-to-buy: "حمض النيتريك اين يباع", "كلوريد الكالسيوم اين يباع", "حمض الستريك اين يوجد" (gl=sa).
- Pool chlorine: "كلور مسابح للبيع", "للبيع كلور مسابح الكويت", "كلور خام للبيع".
- Mostly noise: "كلور" (Clorox), "جلايكول" (glycolic-acid skincare), "شبة" (deodorant stone, "شبة نار"), "بيروكسيد الهيدروجين" (teeth/hair), and "هيبوكلوريت الصوديوم" (dental). "بولي ألومنيوم كلورايد" returned **nothing** in all three gl, as did the `للبيع` seeds for HCl, nitric, hypochlorite, PAC and glycol.
- Locality: "ميثانول صلالة" (gl=om) refers to the Salalah methanol plant, which is navigational.

## Phase 2 cross-check (MASTER-PLAN)

- Supported: **fertilizers** (urea is the Oman phrase in EN and AR), **P2.3 lubricants** ("lubricants suppliers in uae/qatar/saudi arabia", "wholesale lubricant oil suppliers"; no Oman-specific string), **P2.7 nitric country pages** (the same "in uae / in saudi arabia" pattern exists for caustic and HCl, which argues for extending the model).
- Not supported by autocomplete: **PAC** (UAE-only English phrase, empty Arabic), **laboratory chemicals** (only "near me" and "list" phrases, no GCC geo), **sodium hypochlorite** (UAE-only plus bare "sodium hypochlorite oman"), and **oilfield chemicals** (market and conference phrases only; the oilfield demand is product-level, in bentonite). Those hubs rest on GSC evidence, which this check neither confirms nor contradicts.
- Standing caution from HANDOFF and the hub header comment: hubs were built where the site was *absent*. Caustic soda still sat around position 57 with a hub. A country page adds a target but not referring domains.

## Top 10 opportunities (ranked)

1. **Caustic soda UAE + Saudi country pages**: "caustic soda suppliers in uae" and "caustic soda suppliers in saudi arabia" appeared in om, ae and sa; also "sodium hydroxide suppliers in uae" and Arabic "صودا كاوية السعودية" (gl=sa). Oman hub exists; these countries have no page.
2. **Hydrochloric acid UAE + Saudi country pages**: "hydrochloric acid supplier in uae" and "hydrochloric acid suppliers in saudi arabia" (om, ae, sa). "hydrochloric acid supplier in oman" is already served by the hub.
3. **Bentonite hub (Oman + KSA)**: "bentonite suppliers in oman", "bentonite price in oman", "bentonite manufacturers in oman", "bentonite clay oman", "sulphur bentonite oman" (gl=om), "bentonite supplier in dammam" (gl=sa), "bentonite suppliers in saudi arabia". Today it has one product page. Add barite ("barite suppliers in uae", "barite oman") if we sell it.
4. **Water-treatment-chemicals GCC hub**: "water treatment chemicals suppliers in uae" (1st suggestion at gl=ae, present in all gl), "water treatment chemicals price list". We have no hub, only the category page.
5. **Urea, English section + Arabic**: "urea supplier in oman", "urea price in oman", "urea oman suppliers", "urea oman price" (gl=om); AR "يوريا عمان", "يوريا للبيع في عمان", "يوريا للبيع في الامارات". The fertilizers hub has no Arabic body.
6. **Hydrogen peroxide price in Oman**: "hydrogen peroxide price in oman" is the **1st** suggestion for "hydrogen peroxide price" at gl=om; also "hydrogen peroxide oman" and AR "بيروكسيد الهيدروجين للبيع". Improve the `hydrogen-peroxide-50` page (Oman, packs, price-request wording). A price band needs the user.
7. **Industrial sulphuric acid**: "sulphuric acid oman", "sulphuric acid manufacturers in oman", "sulfuric acid suppliers in uae", AR "حمض الكبريتيك للبيع". The only page is lab grade. The user needs to confirm whether industrial grade is sold.
8. **Pool chlorine / calcium hypochlorite hub (GCC, EN + AR)**: "calcium hypochlorite suppliers in uae", "calcium hypochlorite suppliers in saudi arabia", "calcium hypochlorite supplier in dubai", "chlorine tablets suppliers in dubai"; AR "كلور مسابح للبيع", "للبيع كلور مسابح الكويت", "كلور خام للبيع". Today there are 12 product pages and no hub.
9. **Lubricants distributor hub (P2.3)**: "lubricants suppliers in uae", "lubricants suppliers in qatar", "lubricants suppliers in saudi arabia", "wholesale lubricant oil suppliers" (gl=om). Still blocked on the user's brand and grade list.
10. **Corrosion inhibitor GCC hub**: "corrosion inhibitor suppliers in uae", "corrosion inhibitor suppliers in qatar", "corrosion inhibitor manufacturers in uae". This is one of only two Qatar product phrases received. Today there are 10+ product pages and no hub.

Runners-up: acetone ("acetone supplier in oman / uae / saudi arabia"; lab grade only); soda ash ("soda ash manufacturers in oman"); LABSA ("labsa manufacturers in oman", "labsa supplier in dubai"); IPA wording ("isopropyl alcohol supplier in qatar"); city pages for Ajman and Jebel Ali; a caustic-soda Arabic hub (see Arabic findings).
