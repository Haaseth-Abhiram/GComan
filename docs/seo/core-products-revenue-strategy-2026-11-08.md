# Core products: be #1 where the revenue is. 2026-11-08

User, 2026-11-08: "We are very good to supply sodium hydroxide, sodium hypo, HCl and nitric acid … the chlor-alkali chemicals, we will be able to supply everything. Those product categories we need to be number one … whichever is making the revenues, there we should be number one."


> **Correction 2026-11-09 (invoice-LINE analysis, all 145 non-void invoices, 226 lines, OMR 500,381 ex-VAT):** section 1 below was built from invoice-level searches and mis-attributed revenue. The "hypochlorite → UAE/Bahrain" money is **calcium hypochlorite 65–70% in 45 kg drums (India origin)**, OMR ~136.9k (Bahrain 62k, UAE 48k, Oman 27k; 14 export invoices to 5 customers, the only broad repeat export line). **Sodium hypochlorite earned OMR ~4.2k, all Oman.** Caustic soda is OMR ~48k (not 8k), HCl 17k and PAC 46k, but all three are effectively one Sohar customer. Nitric acid OMR 148k = 4 invoices, 2 Saudi customers, **India origin**. Line table: `scratchpad/zoho-lines-12m.csv` (internal, names customers). Consequences applied on Develop: the unpublished sodium hypochlorite UAE/Bahrain pages were replaced by **calcium hypochlorite UAE/Bahrain** pages (`CalciumHypochloriteCountry.tsx`); panel cells R4–R7 now track calcium hypochlorite.
>
> | Family (12 m, ex-VAT) | OMR | Invoices / customers | Markets |
> |---|---|---|---|
> | Nitric acid 68% | 148,240 | 4 / 2 | KSA 100% |
> | Calcium hypochlorite 65–70% | 136,906 | 29 / 13 | Bahrain 46%, UAE 35%, Oman 20% |
> | Caustic soda (mostly 32% liquid) | 48,255 | 29 / 3 | Oman |
> | PAC 28% | 45,564 | 3 / 2 | Oman |
> | STPP | 18,235 | 5 / 4 | Oman (ceramics) |
> | Hydrochloric acid 33% | 17,075 | 13 / 1 | Oman |
> | Sodium silicate | 10,534 | 2 / 2 | Oman |
> | Citric acid | 9,293 | 5 / 4 | Oman |
> | TCCA 90% | 6,552 | 6 / 5 | Bahrain, Oman, UAE |
> | Paraffin wax, SMBS, lab reagents | 6.3k / 6.2k / 6.0k | | Oman |
> | Sodium hypochlorite | 3,981 | 2 / 2 | Oman |

## 1. Where the revenue comes from (superseded, see correction above) (Zoho Books, live org, 12 months to 2026-11-08)

147 invoices, **OMR 522,806** total. Product figures are the totals of non-void invoices containing the product (invoice-level, so a mixed invoice counts in full; good for ranking, not for exact product P&L). Customers are internal data and are not to be named on the website.

| Product | Revenue (approx. OMR) | Invoices | Markets |
|---|---|---|---|
| **Nitric acid 68%** | ~150,800 | 4 paid | **Saudi Arabia 100%**: a feed/food manufacturer in Riyadh (240 × 300 kg drums on one invoice) and a petrochemical company in Khobar |
| **Sodium hypochlorite** | ~126,000 | 25 | **UAE (Abu Dhabi) ~42k + Bahrain ~53k ≈ 75%**; the rest Oman hotels, pools, water companies |
| Other chlorine/chloride lines | ~49,000 | 3 | Oman (Sohar Free Zone) |
| **Hydrochloric acid** | ~17,000 | 13 (monthly) | Oman (Sohar Free Zone) |
| Caustic soda | ~8,000 | 5 | Oman |

Nitric and the chlor-alkali family are about two thirds of revenue, and **most of that is GCC export**: nitric to Saudi Arabia, hypochlorite to the UAE and Bahrain. Caustic soda is the user's stated strength but small in invoices so far: a growth target, not a defend target.

## 2. The target cells (revenue-weighted)

| Priority | Cell (Google + Bing + AI) | Page | Status 11-08 |
|---|---|---|---|
| 1 | nitric acid supplier saudi arabia / riyadh / dammam / jubail | `/chemical-supplier/nitric-acid-saudi-arabia` | Google —, Bing — (directional) |
| 2 | sodium hypochlorite supplier uae / abu dhabi / dubai | **`/chemical-supplier/sodium-hypochlorite-uae` (new 11-08)** | no page before today |
| 3 | sodium hypochlorite supplier bahrain | **`/chemical-supplier/sodium-hypochlorite-bahrain` (new 11-08)** | no page before today |
| 4 | nitric acid supplier oman / bulk nitric acid | nitric hub + AR hub | Google —, Bing 1, Perplexity 1st, AI Mode 4th |
| 5 | sodium hypochlorite supplier oman; هيبوكلوريت الصوديوم | hypochlorite hub + **Arabic hub (Develop 11-09)** | Google — (muscatchemical), Bing 2 |
| 6 | hydrochloric acid supplier oman / sohar / uae / saudi | HCl hub + **`hydrochloric-acid-uae` / `-saudi-arabia` (Develop 11-09)** | Google —, Bing 2 |
| 7 | caustic soda supplier oman / uae / saudi; صودا كاوية | caustic hub + **`caustic-soda-uae` / `-saudi-arabia` + Arabic hub (Develop 11-09)** | Google —, Bing 2 |
| 8 | chlor-alkali umbrella ("chlor alkali products supplier", "chlorine products oman") | none | candidate: one umbrella hub linking caustic, hypochlorite, HCl (see `chlor-alkali-position-report-2026-10-05.md`) |

## 3. What gets these to #1

**On the site (Claude):**
1. **Country pages where invoices prove demand.** Done today for hypochlorite UAE + Bahrain (fact-checked, gated). Next by the same rule: caustic soda and HCl for the UAE and Saudi Arabia (P9.3, the user now confirms supply), each only with real lanes and documents, never as a template.
2. **The Saudi nitric page** gets the strongest internal links (Middle East page, Saudi location pages, nitric hub, blog), and its FAQ answers what a Saudi procurement team asks: SASO, food-contact grade for feed/food plants, 300 kg drums and IBCs, importer of record.
3. **Arabic for the four** (nitric is live): Arabic hypochlorite (هيبوكلوريت الصوديوم، كلور سائل) and caustic (صودا كاوية قشور / سائلة) hubs, since GCC procurement and AI answers are bilingual.
4. **Chlor-alkali umbrella hub** if the 11-22 read shows the product hubs still unlinked from each other's queries.

**Off the site (user, prepared by Claude):**
5. **Product citations for the four first** (`product-citation-pack.md`): GBP Products, go4worldbusiness, ensun, Echemi/LookChem, each linking the right country page.
6. **Vendor registration where the buyers already are**: revenue comes from large GCC companies that buy through supplier portals and approved-vendor lists, not only search. Register on the procurement portals of the sectors that buy (Saudi food/feed and petrochemical groups, Etimad for Saudi government entities, UAE utilities' and Bahrain's water and power authorities' vendor lists). A listing page there is also a high-authority citation.
7. **Reviews from these buyers**: one Google review from a repeat GCC customer naming the product is worth more than any page.
8. **Price basis** for nitric and hypochlorite (per drum / IBC, ex-Muscat): no GCC peer shows one.

## 4. Measurement

Rows 1–8 above lead the daily product panel (`product-panel.md`, cells R1–R12) and are read before the rotating cells. AI prompts weekly: "best nitric acid supplier in Saudi Arabia", "sodium hypochlorite supplier in the UAE / Bahrain". Revenue check monthly in Zoho Books (same method): invoices by product × country, so ranking work keeps following the money.
