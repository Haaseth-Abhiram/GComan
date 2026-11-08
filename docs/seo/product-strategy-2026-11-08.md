# Product-by-product strategy: demand, who is #1, and what it takes for us to rank. 2026-11-08

The user's question: "Muscat Chemical / omanchem come #1 product-wise everywhere; we don't come at all. For each product: what is the demand, what do the peers have, how many people see their sites and for which SEO / AEO / GEO keywords, and what must we do to come #1 everywhere."

Sources, labelled: **GSC** (our Search Console, 3 months, page level), **TR** (Google Trends, 12 months, GCC, `gcc-keyword-position-2026-11-08.md`), **AC** (Google autocomplete phrasings, `gcc-keyword-demand-2026-10-27.md`), **G / B** (latest Google `pws=0` / Bing reading in `location-ledger.md`), **SW** (Similarweb public estimates, Sept 2026: directional only), **SM** (the competitors' own sitemaps, fetched today).

## 1. How the peers "come everywhere"

| | omanchem.com | muscatchemical.com | soharchemical.com | gcoman.com |
|---|---|---|---|---|
| Pages in sitemap (SM) | **14,105** (7,048 product + 6,963 content) | **16,319** (9,427 product + ~6,500 root-level programmatic URLs) | 8,439 | **645** (277 products) |
| Product categories | 68 | 68 (identical tree) | 66 | 22 |
| Traffic (SW, directional) | global rank ~2.07M, ~10K visits/month; Oman 42%, US 24%, India 21%, UAE 7% | global rank ~3.59M; US 42%, Oman 40%, India 18% | n/a | below Similarweb's threshold; GSC ~600 clicks/month, Oman 41% |
| Keywords SW sees | 276, e.g. "buy hydrogen peroxide in oman", "nitric acid oman", "zinc based corrosion inhibitors", "oman chem" | 77, e.g. "buy fe3o4 in oman", "light liquid paraffin in oman", "oman xylene producer", "cu so4x5h2o" | | "nitric acid 68% supplier", "sodium bisulphate" |
| Referring domains (Bing WMT, 10-19) | 41, mostly its own sister sites | 16 | (same network) | ~1 |
| GEO | has `/llms.txt` | | | llms.txt + full schema + prerender |

**The method:** one operator (RXSOL), three-plus exact-match domains on one 68-category CMS, a page for every product × pack size × grade with "supplier Oman Muscat Barka Salalah Sohar …" in the URL (e.g. `/CAUSTIC-SODA-FLAKE-25-KG-Supplier-Oman-Muscat-Barka-Salalah-Sohar-Ruwi-Mutrah-Nizwa-Al-Hamra-Manah`), cross-linked between the sister domains. Each page catches a few searches; 30,000 pages catch thousands. Oman's search volume per product is tiny (Trends: 0–4 for most chemicals), so **breadth and authority beat depth** in this market.

**What we must not copy:** the programmatic pack × city URLs and the self-linking network are Google "scaled content abuse" and "link scheme" patterns, and the HANDOFF do-not-do list forbids mass product × city pages. They work for RXSOL today because the Oman SERPs have almost no competition. If Google acts on them, we want to be the clean site left standing.

**What we can legitimately match:** (a) breadth with **real** products we actually supply, each with real specs; (b) the long-tail phrasings inside each page (grades, packs, formula strings, "buy … in oman", "price"); (c) product-level citations from real third-party sites; (d) one strong URL per product instead of several weak ones.

## 2. The product grid

Demand: TR = relative interest UAE/KSA vs the hydrogen-peroxide anchor (H = high ≥1×, M = 0.2–1×, L <0.2×); AC = GCC buyer phrasings that exist; GSC = our impressions in 3 months (best page) @ average position. Position: G / B for "<product> supplier oman". #1 = Google #1.

| # | Product | Demand (TR / AC) | GSC impr @ pos (best page) | G / B | Google #1 | What we have | What is missing → action |
|---|---|---|---|---|---|---|---|
| 1 | Nitric acid | L / OM, UAE, KSA, AR "اين يباع" | 460 @ 4.9 (`nitric-acid-68`) | — / 1 | omanchem | hub + AR hub + 5 country pages | citations (go4worldbusiness product, GBP product), reviews naming nitric, price band (P8.C2) |
| 2 | Urea | **H** / OM "price in oman", AR "يوريا للبيع في عمان" | 301 @ 6.3 | — / — | omanchem | fertilizer hub EN + AR (live 11-08), batch-1 FAQs | product citations; 11-22 read |
| 3 | Caustic soda | L (TR) but strongest AC: "suppliers in uae / saudi", "price in oman", AR "صودا كاوية قشور" | hub 91 @ 13.9; flakes 3 | — / 2 | omanchem | hub (since 09), 4 product pages (3 soap SKUs canonicalised) | citations; UAE/KSA country pages if exported (P9.3) |
| 4 | Hydrochloric acid | M (UAE) / OM, UAE, KSA | hub 36 @ 9.5; industrial ~0 | — / 2 | omanchem | hub + industrial + lab | citations; country pages (P9.3) |
| 5 | Sodium hypochlorite | L / UAE | soap-12-15 106 @ 8.8, food 105 @ 7.7; main page 4 | — / 2 | muscatchemical | hub + 5 indexable SKUs | impressions sit on the soap/food SKUs, not the main page: point hub + main page FAQs at those grades; do **not** merge blindly |
| 6 | Hydrogen peroxide | **H** / OM "price in oman" (1st), UAE | 50%: 11 @ 4.1 | — / n/m | omanchem (SW keyword "buy hydrogen peroxide in oman") | 50% page, batch-1 FAQs | add "buy … in oman" phrasing; citations; Bing read |
| 7 | Sulphuric acid | M / OM "manufacturers in oman", UAE, AR "للبيع" | lab 69 @ 8.4 | — / n/m | omanchem | lab grade only | **user: do we sell industrial grade?** → page |
| 8 | Glycerine | **H** (mixed intent) / UAE | 10 @ 12.0 | — / n/m | muscatchemical | 2 pages (batch-1 deepened soap grade) | consolidate water → soap (P10.4); citations |
| 9 | Isopropyl alcohol | M / OM, UAE, Qatar | 28 @ 8.0 | n/m | n/m | industrial + lab, batch-1 FAQs | citations; Google read |
| 10 | Methanol | M (navigational: OMC/SABIC) | industrial 58 @ 7.4, tech 30 @ 6.1, lab 24, cleaner 20 | n/m | Oman Methanol Co. | 4 pages | low priority (brand-owned SERP); keep |
| 11 | Acetic acid | M / "acetic acid supplier" | **lab 263 @ 38**, industrial 24 @ 12.5 | n/m | n/m | industrial page deepened (batch 1) | wrong page ranks: lab page must hand buyers to the industrial page (guide link / related products) |
| 12 | Calcium chloride | L / OM, UAE, AR "اين يباع" | oil 268 @ 17.9 | n/m | n/m | 3 pages | deepen the oilfield page (Phase 3); Google read |
| 13 | Pool chlorine / calcium hypochlorite | **H** (chlorine) / UAE, KSA, Dubai, AR "كلور مسابح للبيع" | water 24 @ 9.1, granules 16 @ 10.9 | — (pool chemicals) | omanchem | pool hub EN + AR (live 11-08) | citations; 11-22 read |
| 14 | PAC | L / UAE only | powder 18 @ 33, liquid 9 @ 11, inorganic dup 7 @ 45 | — / 4 | omanchem | hub + 3 pages | canonical the `inorganic/poly-aluminum-chloride` duplicate |
| 15 | Bentonite | M / OM "suppliers/price/manufacturers in oman", Dammam | 40 @ 6.4 | — / 3 | muscatchemical | 1 product page | P9.5 upgrade (barite? user) |
| 16 | Soda ash | L / OM "manufacturers in oman", UAE | water 33 @ 14; 4 more SKUs ≤8 | n/m | n/m | 5 pages | canonical the two soap SKUs to light/dense |
| 17 | Citric acid | L / OM | 7 pages, 5–17 impr each | n/m | n/m | **7 pages** | consolidate to 2–3 (anhydrous food, monohydrate, liquid) |
| 18 | Glycols (MEG/DEG/MPG) | L / UAE | category 125 @ 22.9; "glycol suppliers" 52 @ 31 | n/m | n/m | MEG ×3 pages | canonical `meg-water` (55.4) to `meg`; category intro |
| 19 | Corrosion inhibitor | — / UAE, Qatar | product 169 @ 38.8; category 58 @ 10.6 | n/m | n/m | 10+ pages | GCC hub candidate (P9 runner-up) |
| 20 | **Lubricants (Mobil, Castrol, Shell)** | AC "lubricants suppliers in uae/qatar/ksa" | **category 1,274 @ 6.9, 90 clicks; mobil 308 / 19 clicks** | n/m | n/m | category + brand pages | **our strongest product line**: P2.3 lubricants hub, blocked only on the authorised-brands list (user) |
| 21 | Fertilizers (KCl, gypsum) | — | KCl 259 @ 7.2; gypsum 187 @ 7.0 (129 of it Arabic) | n/m | n/m | product pages + hub | working; keep |

Pattern in GSC: our product pages already reach positions 5–10 for **specific** queries (grade, spec, Arabic), but get **near-zero impressions for the head "<product> supplier oman" query**, where the RXSOL domains sit. Example: caustic flakes 3 impressions in 3 months.

## 3. AEO / GEO per product

- **Bing is our product-level strength** (nitric 1, caustic 2, HCl 2, hypochlorite 2, bentonite 3, fertilizer 3, PAC 4). ChatGPT search and Copilot draw on Bing's index, so the fastest product-level AI wins come from keeping Bing positions and making each product page answer "where to buy <product> in Oman / price / packs / delivery to UAE-KSA" in plain sentences (batch-1 pattern).
- **Google AI Mode / AI Overviews** lean on Maps cards and directories → reviews (B1), GBP Products (one per priority product, linking to its page) and product listings on go4worldbusiness / ensun / Echemi / LookChem.
- **Measure per product:** weekly prompts "where can I buy <product> in Oman", "best <product> supplier in Oman/UAE" on ChatGPT, Perplexity, AI Mode for the top 10 products; record whether we're named and who is.

## 4. The strategy: six workstreams

| # | Workstream | What exactly | Owner | Cadence |
|---|---|---|---|---|
| S1 | **Product citations** (beats self-linking legitimately) | For each of the top 20 products: a GBP Product, a go4worldbusiness product, an ensun product, an Echemi/LookChem listing, each linking to that product's page. Claude writes every text (`product-citation-pack`) | user signs up once per site; Claude fills | 5 products/week |
| S2 | **Breadth with real products** | Compare our 277 products with the peers' 68 categories; the user marks which missing products and categories we truly supply (boiler, electroplating, marine, fuel treatment, rubber, textile, feed additives, test kits…); Claude builds real pages from the user's specs, fact-checked | user list → Claude | 10 pages/week once the list exists |
| S3 | **One strong URL per product** | Per-family decision with GSC evidence (table rows 5, 8, 11, 14, 16, 17, 18): canonical true duplicates, keep distinct grades, cross-link lab ↔ industrial | Claude | 1 family/day |
| S4 | **Long-tail inside each page** | Grades, pack sizes, formula strings (`CuSO4·5H2O`), synonyms, "buy … in oman", "price" and "delivery to UAE/KSA" FAQs: what RXSOL catches with thousands of URLs, we catch inside one page | Claude, fact-checked | 5 products/week (P10.3 batches) |
| S5 | **AEO/GEO per product** | Answer-first FAQs (S4), Bing upkeep (IndexNow on every change), GBP Products, weekly AI product prompts | Claude + user (GBP) | weekly |
| S6 | **Measurement** | Daily Google grid of 25 product cells (`<product> supplier oman`, `buy <product> in oman`, `<product> price oman`) rotating through the 21 products; Bing weekly; GSC product-page table monthly | Claude (cron) | daily |

Expected sequence: Bing and AI engines first (weeks), Google product cells only after S1 + reviews raise authority (months). Without S1/S2 inputs from the user, on-site work alone has not moved Google product cells (caustic hub since September is still ~14).
