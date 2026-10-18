# Bing Webmaster Tools, Bing Places and the AI engines: audit 2026-10-18

Read live on the evening of 2026-10-18 in the Claude-controlled Chrome, signed in to Bing Webmaster Tools and Bing Places through the company Google account (user-authorised this session). Companion to the [Oman](./oman-investigation-2026-10-18.md) and [KSA](./ksa-investigation-2026-10-18.md) investigations.

## 1. Bing Search Performance (last 3 months, web traffic)

**176 clicks, 2.8K impressions, CTR 6.33%**, 542 keywords, 138 pages. About 2 clicks a day.

| Keyword (top by impressions) | Impr | Clicks | Pos | Reading |
|---|---|---|---|---|
| gcoman | 45 | 7 | 4.9 | brand |
| global oil gas and chemicals company | 26 | 0 | 7.1 | a different company |
| global chemicals llc / oman / & maintenance systems… | 18 / 14 / 8 | 4 / 4 / 0 | 1.5–8 | brand + the name collision |
| muscat chemical | 15 | 1 | 8.3 | the competitor's brand |
| castrol dealer in oman | 9 | 0 | 6.4 | product |
| soda ash manufacturers oman | 7 | 2 | 65 | product |
| sodium hydroxide supplier muscat oman | 6 | 0 | 4.3 | product |
| tcca tablet in oman | 6 | 0 | 2.5 | product |
| meg producers oman | 6 | 1 | 2.5 | product |

| Page | Impr | Clicks | Pos |
|---|---|---|---|
| / | 472 | 42 | 6.9 |
| /products/lubricants | 58 | 6 | 5.5 |
| /products/oilfield/bentonite-powder | 57 | 2 | 2.5 |
| /chemical-suppliers-oman | 51 | 4 | 6.4 |
| /chemicals/cairo | 44 | 3 | 4.1 |
| /products/lab-equipment | 37 | 5 | 4.7 |
| /tools/dosing-calculator | 34 | 0 | 5.6 |
| /chemical-suppliers-middle-east | 28 | 0 | 3.6 |
| /chemicals/bahrain · amman · riyadh · baghdad | 19 · 15 · 14 · 13 | 1 · 1 · 2 · 5 | 4.6 · 7.7 · 5.0 · 4.8 |
| /chemical-supplier/caustic-soda-oman | 15 | 3 | 3.9 |

Country split: the report returned "momentary issue" twice; not measured. Bing is brand-plus-long-tail, like Google, at about a third of Google's volume.

## 2. AI Performance (Microsoft Copilot and partners, last 3 months)

**1,300 citations, about 2 cited pages a day.** Grounding queries Bing itemises:

| Grounding query | Intent | Citations | Our citation share |
|---|---|---|---|
| jsrs | Informational | **785** | 27.1% |
| jsrs meaning | — | 10 | 22.7% |
| oman chemical | Informational | 6 | 14.3% |

A burst of 60–123 citations a day ran Sep 11–22. **Almost every Copilot citation we get is the JSRS article** (`/blog/jsrs-chemical-supplier-pdo-oman`). That is the HANDOFF "don't touch the JSRS blog" rule, measured. "oman chemical" at 14% share is the only commercial query cited. The new "Topics Portfolio" view (opportunity queries where other sites are cited) was not read tonight; add it to the Sunday run.

## 3. Backlinks (Bing's index)

**1 referring domain, 1 referring page: tamol.om.** This is the ceiling under every product and city query on both engines (established 2026-09-08, unchanged).

## 4. Indexing plumbing: all healthy

| Report | State |
|---|---|
| IndexNow | 646 URLs submitted in the last 18 hours (today's two pushes), 1.3K in 30 days, source "Self". Working |
| Sitemaps | 1 sitemap, 657 URLs discovered, last crawl 10/16, Success, 0 errors, 0 warnings |
| Site Scan (Post-deploy audit 2026-09-29, 374 pages) | 1 error: `/login` blocked by robots.txt (**intended**). 10 warnings: image missing `alt` on `/contact?product=…` URLs (all canonicalise to `/contact`; cosmetic) |
| Recommendations | none |
| URL Inspection / crawl errors | not read tonight |

## 5. Bing Places

| | |
|---|---|
| Status | **Pending publish** (created 2026-10-11 by GBP import; ETA 7–12 days → expect by about 10-23) |
| Google sync | Last synced 6 days ago, success |
| Name / address / phone / website / email / hours | Match the site (Beside Oman LNG Office-3 Ghala; 9375 4388; https://gcoman.com/; info@gcoman.com; Sun–Thu 8–6) |
| Categories (mapped by Bing from GBP) | Wholesaler; Industrial spares & products wholesaler; Laboratory equipment supplier; Cleaning products supplier. **No "chemical" category** in the mapping |

## 6. AI engines for Saudi Arabia (read tonight; the Oman reads are in the 19:20 panel)

| Engine | "best chemical suppliers in Saudi Arabia" | Who is named |
|---|---|---|
| Perplexity (signed in) | **not named** | Brenntag KSA, Chemtrade, SACHLO, Adwan, Nassguard, Gemicals. Sources include ensun, kompass, nassguard |
| ChatGPT (logged out, search) | **not named** | Fouz, Brenntag, REDA, BCI, Bayouni, NSC + 5 others |
| Google AI Mode | **not named** | SABIC, Sadara, Fouz, Chemtrade, Atlad… |

Same conclusion as the KSA report: AI engines answer the Saudi question from Saudi-registered companies and the directories (ensun, kompass) that list them.

## 7. What this adds to the plan

| # | Action | Who |
|---|---|---|
| B1 | **Bing Places categories**: once the listing publishes (≈10-23), add a "Chemical supplier / wholesaler" category if Bing's picker has one. Keep the name as it is | User (or Claude on a go-ahead, owner account is signed in) |
| B2 | **ensun.io and kompass**: both are the sources the AI engines read for Saudi. Same K1 listing covers it | User signs up; Claude fills |
| B3 | **Backlinks**: 1 domain on Bing. No change to B3 in ACTION-PACK; it is the whole game | User + Claude |
| B4 | **AI citations**: don't touch the JSRS article. Read Topics Portfolio on Sunday for the opportunity queries before writing anything new | Claude |
| B5 | The 10 `alt` warnings on `/contact?product=…`: cosmetic (canonical → /contact). Fix only if the image is in shared code; not a ranking factor here | Claude, low priority |

**Nothing on the Bing technical side is broken.** Sitemap, IndexNow and crawl are clean; the hubs were pushed again today.
