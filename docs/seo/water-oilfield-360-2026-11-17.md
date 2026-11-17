# Water treatment and oil & gas products: 360° investigation, 2026-11-17

The user asked for a deep check of the water treatment and oil & gas product pages: website, translation and every other angle. Scope: the six categories `water-treatment`, `oilfield`, `ro-chemicals`, `cooling-water`, `corrosion-inhibitor` and `ethanolamines`. That is 129 products, of which 12 are canonicalised duplicates, leaving **117 live pages** plus their 117 `/ar` twins.

Sources, each labelled:
- **SRC**: product JSON and `products-ar.json`, read by a script.
- **LIVE**: production HTML fetched as GPTBot for all 234 URLs.
- **GSC**: Search Console Performance, 3 months, page breakdown filtered per category.
- **LINKS**: grep of the hub pages and blog.

## 1. Website / technical (LIVE): clean

All 234 URLs (EN + AR) return 200. Each has:
- a self-referencing canonical
- en/ar/x-default hreflang
- Product JSON-LD
- FAQPage JSON-LD wherever the page has FAQs

No noindex leaked and no page shows the homepage title. **Technical SEO is not the problem for these pages.**

## 2. English content quality (SRC): the main problem

| Category | Live pages | Old one-paragraph marketing template | Arabic < 60% of English |
|---|---|---|---|
| water-treatment | 39 | 22 | 25 |
| oilfield | 46 | 11 | 12 |
| ro-chemicals | 8 | 7 | 1 |
| cooling-water | 11 | **11 (all)** | 0 |
| corrosion-inhibitor | 10 | 9 | 2 |
| ethanolamines | 3 | 3 | 0 |
| **Total** | **117** | **63** | **40** |

**"Old template"** means one paragraph of about 900–1,300 characters with the following traits:
- It opens "X supplier in Oman - Global Chemicals LLC provides…".
- It uses words like "essential", "advanced formulation", "superior" and "ideal".
- The same sentence pattern repeats across pages.
- It has no composition, no hazard class and no handling or storage text.

The rewritten pages (5 paragraphs, about 2,300 characters, with facts, use, handling, documents and delivery) are the model for the rest.

There are two kinds of old-template page:

**A. Commodity chemicals with a CAS number (about 28 pages).** These can be rewritten from the chemistry and the facts already on the page, fact-checked, then translated, exactly like Arabic batches 7–20. Examples:
- ferric chloride 40%
- calcium hypochlorite (water)
- ethanol 99%
- hydrazine hydrate (boiler)
- potassium hydroxide (water)
- ammonium bisulphite
- activated carbon
- activated alumina
- DEA
- TSP
- sodium metasilicate
- citric acid (monohydrate, and liquid for oilfield)
- glycerine
- sodium bicarbonate
- MPG
- paraffin wax
- petroleum jelly
- industrial salt

**B. Formulated blends with no CAS number (about 35 pages).** These cannot be rewritten honestly without the product's TDS/SDS. They include:
- **Every cooling-water product:** Altreat 4000, Corro Guard, Biological Guard, Micro Biocid, the closed-loop biocide and inhibitor, hardness control.
- **9 corrosion inhibitors:** CI 2000, multi-metal, gas compressor, rust preventive, pH booster, closed system, molybdate, general, oxygen scavenger.
- **The RO range:** antiscalant RO, membrane antiscalant, RO 222 descaler, alka cleaner, membrane cleaner, passivation, alkaleen.
- **Oilfield blends:** corrosion inhibitor, descalant, degreaser HD.
- **Water-treatment blends:** antiscalant, antifoam, biocide, corrosion inhibitor, polyelectrolyte.

Each of these needs these facts from the owner:
- active chemistry
- active content
- pH and specific gravity
- dosage basis
- hazard class / UN number
- packs
- whether it is our own brand or a principal's product

The demulsifier and reverse-demulsifier pages show the right pattern: they name the chemistry family and selection by bottle test.

## 3. Safety statements (SRC)

**Old-template pages with no hazard wording at all**, though the product is classified:
- hydrazine hydrate: toxic, a suspected carcinogen, UN 2030
- ferric chloride: corrosive, UN 2582
- calcium hypochlorite 65–75%: oxidiser, UN 1748/2880
- potassium hydroxide: UN 1814/1813
- ethanol 99%: flammable, UN 1170
- DEA, MEA, TEA
- the RO acid and alkaline cleaners
- sodium metasilicate: corrosive, UN 3253

The blends' hazard class is unknown until their SDS is supplied.

**Internal contradiction:** on `water-treatment/hydrazine-hydrate-water` the text says "1–2 ppm" while the spec says "1-2 ppm per ppm O2".

## 4. Duplicate pages (SRC: same CAS, not canonicalised)

| Product | Pages | Note |
|---|---|---|
| MEA | `ethanolamines/mea-monoethanolamine` (old, 8 impr) · `oilfield/mea` (rewritten, 4) | Same grade on both: 99%, refinery/industrial |
| MDEA | `ethanolamines/mdea-methyldiethanolamine` (old, 11) · `oilfield/mdea` (rewritten, 7) | Same grade |
| DEG | `water-treatment/deg-water` (old, 8) · `oilfield/deg` (35) · `glycols/deg-diethylene-glycol` | Three pages |
| Hydrazine hydrate | `water-treatment/hydrazine-hydrate-water` (old) · `oilfield/hydrazine-hydrate` (rewritten) | Boiler use vs oilfield use; the concentrations overlap |
| Potassium hydroxide | `water-treatment/potassium-hydroxide-water` (old, 4) · `oilfield/potassium-hydroxide` · `inorganic/caustic-potash` · lab pellets | |
| Soda ash, TSP, sodium metasilicate, glycerine, sodium bicarbonate, MPG, industrial salt | Water-treatment page (old) beside a rewritten soap/food/oilfield page | Differ in grade or form in some cases |

These split Google's signal between two thin pages. Each duplicate needs a decision:
- If the grade is the same, canonicalise the old page to the rewritten one. This follows the P10.11 method (GSC evidence first).
- If the grade differs, rewrite the old page so its grade difference is explicit.

## 5. Demand (GSC, 3 months, impressions)

**Oilfield:**

| Page | Impressions |
|---|---|
| calcium-chloride-oil | 251 |
| corrosion-inhibitor | 66 |
| tht-gas-odorant | 58 |
| sodium-thiosulphate-liquid | 56 |
| ammonium-bifluoride | 47 |
| deg | 35 |
| potassium-chloride, butyl-glycol, methanol-tech, ammonium-chloride, reverse-demulsifier | 29–31 each |
| demulsifier | 19 |

**Corrosion inhibitors and cooling water:**

| Page | Impressions |
|---|---|
| corrosion-inhibitor-closed-loop | 53 |
| corrosion-inhibitor-molybdate | 52 |
| rust-preventive | 34 |
| algae-control | 29 |
| multi-metal | 20 |
| sodium-molybdate | 14 |
| biocide-closed-loop-chiller, micro-biocid, cool-water-treat | 12–13 each |

**Water treatment:**

| Page | Impressions |
|---|---|
| sodium-bisulphate-bisulphite | 111 |
| caustic-soda-liquid, sodium-metabisulphite, soda-ash-water, aluminium-sulphate-liquid | 33–34 each |
| copper-sulphate, calcium-hypochlorite-water | 24 each |
| ferric chloride | 21 |
| ethanol-99 | 19 |

**RO and ethanolamines:** RO pages get 1–15 each and ethanolamines 8–11.

Whole categories earn only single-digit clicks. As `keyword-intelligence-2026-11-14.md` found:
- corrosion-inhibitor queries average position 35–52, the oilfield family about 50 and water treatment about 22.
- The ranking ceiling is referring domains (`project_nitric_authority_gap`), not copy.
- Content work fixes accuracy, trust and conversion (SXO) and makes AI engines quote us correctly. It will not on its own lift these pages to page 1.

## 6. Internal links (LINKS)

**50 of the 117 pages get no link from the water-treatment hub, the oilfield hub or any blog post.** They are linked only from their category grid. The gaps:
- most cooling-water products
- 7 of the 10 corrosion-inhibitor pages
- 5 of the 8 RO products
- all 3 ethanolamines
- 21 water-treatment pages, including sodium hexametaphosphate, sodium sulphite, ferrous sulphate and sulphamic acid

## 7. Plan

| # | Work | Who | Order |
|---|---|---|---|
| 1 | Rewrite and translate the ~28 commodity old-template pages in batches of 5, with independent fact-check. Hazard statements first; highest risk and demand first: ferric chloride, calcium hypochlorite (water), ethanol 99%, hydrazine (boiler), ammonium bisulphite, then the rest | Claude (Develop) | now |
| 2 | Duplicates: canonicalise same-grade pairs (MEA, MDEA first) to the rewritten page; make grade differences explicit elsewhere | Claude, after a GSC check per pair | after 1 starts |
| 3 | Hub links: add the 50 unlinked products to the water-treatment GCC hub and the oilfield hub (grouped lists, EN + AR) | Claude (Develop) | after 1 |
| 4 | TDS/SDS for the ~35 formulated blends (cooling water, corrosion inhibitors, RO range, oilfield/water blends): active chemistry, active %, pH, SG, dosage, hazard class, packs, own brand vs principal | **Owner** | needed to rewrite group B |
| 5 | Remaining Arabic for the short pages in these categories (overlaps with 1) | Claude | with 1 |
| 6 | Off-page: product listings for water treatment and oilfield chemicals (ensun.io, go4worldbusiness, qatar oil & gas directory), supplier/principal partner pages | **User** | open |
