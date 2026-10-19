# Nitric acid: is the cluster complete? Review 2026-10-19

Asked by the user after the morning position check: "our structure, our plan, everything is properly planned? Is anything missing? Anything to be improved?" Every reading below was taken live on 2026-10-19 (Google `gl=om&pws=0`, Bing `cc=om`, GSC owner account, Bing Webmaster Tools, live prerendered HTML as GPTBot).

## 1. What the cluster is

| Page | Route | Role | Indexed (Google) |
|---|---|---|---|
| Oman hub | `/chemical-supplier/nitric-acid-oman` | 4,000-word hub: 3 grades, spec table, 8 FAQs, GCC table, delivery grid, FAQ + Breadcrumb + Speakable schema | yes |
| 5 country pages | `/chemical-supplier/nitric-acid-{uae,saudi-arabia,qatar,kuwait,bahrain}` | 2,400–2,700 words each, own lead times / crossings / zones / FAQs; FAQ + Breadcrumb + Speakable schema | uae, saudi-arabia, kuwait, bahrain yes; **qatar: Crawled, currently not indexed** |
| Food/technical product | `/products/food-beverage/nitric-acid-68` (+ `/ar`) | Product schema, 5 FAQs, wikiUrl, `guideUrl` → hub | yes (182 impressions / 28 days at position 4.3, the most visible nitric page) |
| Lab product | `/products/lab-chemicals/nitric-acid-lab` (+ `/ar`) | Product schema, 2 FAQs, wikiUrl, `guideUrl` → hub | yes |
| Legacy redirect | `/products/acids/nitric-acid` → lab product | `legacyRedirects.ts` | — |

Everything that should exist does: sitemap (all 6 hub URLs + both products with `/ar` twins and hreflang), `llms.txt` (all 6 hub URLs), App.tsx routes (EN + `/ar`), `Sitemap.tsx`, both products' `guideUrl`, Arabic product translations, e2e spec `nitric-country-pages.spec.ts`. Live HTML: titles, canonicals, `index,follow`, FAQPage with 8 / 6 / 5 Q&As, every link present as GPTBot sees it. No Helmet or prerender defect.

## 2. Inbound links to the hub (who points at it)

Both product pages (`guideUrl`), all 5 country pages (breadcrumb + body), every `/chemicals/<location>` page (PRODUCT_HUBS strip), `/chemical-suppliers-oman`, `/chemical-suppliers-middle-east` (all 6 URLs), the hydrochloric hub, the laboratory chemicals hub, `/sitemap`. Country pages receive: the hub's GCC table, each other, `ChemicalSuppliersMiddleEast`, `Sitemap.tsx`, and their own country's `/chemicals/<country>` page.

## 3. What was missing (fixed today, Develop)

| # | Gap | Fix |
|---|---|---|
| 1 | The nitric hub linked to no sibling hub. HCl → nitric existed; nitric → nothing. The caustic hub linked to neither acid | "Related Chemicals We Supply in Oman" strip on the nitric hub (HCl, caustic, lab chemicals, Passivation Liquid) and on the caustic hub (HCl, nitric, sodium hypochlorite, lab chemicals). The acid/alkali family is now linked in every direction. tsc, lint, `caustic-soda-hub` + `nitric-country-pages` specs pass (10/10) |
| 2 | Qatar country page: "Crawled, currently not indexed", referring page = the Bahrain page, "no referring sitemaps detected" although it is in `sitemap.xml` | Indexing request attempted; **Quota Exceeded** (yesterday's six hub requests). Sitemap resubmitted in GSC (previous read 10-16 saw 634 URLs, file has 657). Qatar is first in tomorrow's indexing queue |

## 4. Checked and deliberately left alone

- **Lead times.** The hub says Nizwa/Sur 2–3 days; `/chemical-suppliers-oman` says 1–3 (its own FAQ's figure). The ranges nest, so no buyer sees a contradiction. Not worth churn.
- **Product schema on the hub.** The hub carries FAQ/Breadcrumb/Speakable, not Product. The two product pages carry Product. Putting Product on the hub too would create a second entity for the same SKU; GSC already flags the site-wide "offers/review/aggregateRating" gap. Leave.
- **A nitric acid blog guide.** None exists. Bing's AI "Topic Portfolio" (read today) lists 14 opportunity queries and none is nitric (silica gel desiccant, industrial degreaser, antifoam, caustic soda pearls, 99% IPA, activated carbon, sulfuric acid anodising…). So there is no measured AI demand to write against; a passivation guide stays optional, not a gap.
- **Content vs. ranking.** Google page 1 for every nitric phrasing in Oman is the same six domains (omanchem, uvwater.biz, muscatchemical, soharchemical, go4worldbusiness, rx-sol). The hub is 16× their word count with a spec table nobody else has; it sits at 18 (homepage, not hub). Google AI Mode answers from the competitors' Maps cards. That is referring domains + Maps reviews, the ceiling named in `oman-investigation-2026-10-18.md`, not structure.

## 5. Positions today

| Query | Google (gl=om) | Bing (cc=om) | AI |
|---|---|---|---|
| nitric acid supplier oman | 18 (homepage) | **1** (hub) | Perplexity **1**; ChatGPT 3rd of 4; AI Mode not named |
| nitric acid oman | — (top 38) | **1 + 2** | |
| nitric acid supplier muscat | 17 (homepage) | 2 | |
| nitric acid supplier uae / dubai | — | 7 (hub) | |
| nitric acid supplier qatar | — (page not indexed) | 6 | |
| nitric acid supplier saudi arabia / kuwait / bahrain | — | — | |

GSC 28 days, all nitric URLs: 7 clicks / 225 impressions / position 5.3. Country pages (3 days old): 0 impressions yet.

## 6. What moves nitric from here

The same three levers as the Oman plan, in order: Google reviews (2 today), the GBP secondary categories, and the directory listings (yellowpages.om, ensun.io, lookchem). Nothing further to build on the site for nitric acid.
