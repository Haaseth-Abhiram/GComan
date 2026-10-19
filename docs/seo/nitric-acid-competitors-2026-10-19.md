# Nitric acid: why the competitors win, and the plan to be #1. 2026-10-19

Follows [`nitric-acid-review-2026-10-19.md`](./nitric-acid-review-2026-10-19.md) (structure complete). This one answers: *why* does Google put six other domains above us, and what gets us to #1. All readings live on 2026-10-19: Google `gl=om&pws=0`, Bing Webmaster Tools "Backlinks to any site" (owner account), pages fetched as a desktop browser, Google Maps at the Muscat viewport.

## 1. Page 1 for "nitric acid supplier oman" on Google (Oman, unpersonalised)

| # | Page | Words | Images | Schema | Says price / pack / 68% | What ranks it |
|---|---|---|---|---|---|---|
| 1 | omanchem.com/product/Nitric-Acid "Nitric Acid Supplier in Oman" | 503 | 2 | Product, Breadcrumb, LocalBusiness-style address | no / no / no | **41 referring domains** (Bing) |
| 2 | uvwater.biz/product/massive-nitric-acid-oman "Massive Nitric Acid Oman: 68% Industrial Grade Supply" | 1,213 | 20 | Product **+ Offer (OMR price)**, ProfessionalService, Place | yes / 35 kg / yes | the one real page: price, packs, photos |
| 3 | muscatchemical.com/taxonomy/term/2900 "Top nitric acid supplier in Oman" | 934 | 1 | Article, City ×8 | no / 3 / 1 | 16 referring domains; a Drupal tag page |
| 4 | soharchemical.com …/nitric-acid-58-62-45-kg | 1,752 | 10 | Product, Brand | no / no / 58–62% | same operator as 1 and 3 |
| 5 | go4worldbusiness.com/buyers/oman/nitric-acid.html | directory | | | | global B2B marketplace |
| 6 | omanchem.com second product page (68%, 50 kg) | | | | | |
| 7 | muscatchemical.com "Nitric acid suppliers in Salalah" | | | | | tag page |
| 8 | rxsolgroup.com "…Supplier in Sohar Muscat Barka Ruwi Madayn" | 627 | 6 | Organization | | the parent network |
| 9 | omanyellowpagesonline.com/chemicals/nitric-acid.htm | 46 (login wall) | 0 | none | | pure directory authority |
| 17–18 | **gcoman.com homepage** (not the hub) | | | | | |

"People also ask" shows: how much does 1 litre cost · who are chemical suppliers in Oman · is it illegal to buy nitric acid · what is 70% nitric acid used for · price of 1 kg · where can I get nitric acid. No local pack on the query; an AI Overview slot exists but was unavailable at read time (AI Mode names Muscat Chemicals, Oman Chem, rx-sol, Sohar Chemicals, uvwater).

## 2. Why they win

**It is one network, and the network links to itself.** Bing's backlink index for the top three:

| Site | Referring domains | Where the links come from |
|---|---|---|
| omanchem.com | **41** (108 anchors) | sudanchemical.com 1,700 links · rigchemicals.com 991 · **muscatchemical.com 370** · rxsolgroup.com 302 · sharjahchemical.com 113 · rxmarine.org 81 · ennoreindiachemicals.com 20 · rxmarine.com 17 · eastindiachemicals.com 13 · dubichem.com 12 |
| muscatchemical.com | 16 (57 anchors) | ugandachemical.com 587 · sharjahchemical.com 85 · metoree.com 9 · suratchemical.com 6 · rxmarine.com 4 · castingarea.com 4 · **madeinomangate.com 3** · intently.co 2 |
| gcoman.com | **1** | tamol.om |

omanchem.com, muscatchemical.com and soharchemical.com share one phone number (+968 7733 3599) and are part of the RX Marine / RXSOL group (rxsolgroup.com, rxmarine.org, omanchem.rxmarine.org, dubichem.com, sharjahchemical.com, sudanchemical.com, ugandachemical.com, rigchemicals.com…). Each country site links every product on every sister site, with footer anchors like "OMAN" (1,500 links) and "Degreaser" (362). That is where the 41 domains come from. Their pages are thin (omanchem: 503 words, no price, no pack, no spec table, no FAQ); the authority is manufactured, not earned, and it is not something we should copy.

**Second: Google ranks our homepage, not our hub.** For "nitric acid supplier oman" Google's best gcoman.com result is the homepage at 18. The hub (4,000 words, spec table, 10 FAQs) does not appear in the top 38. The hub has been indexed since 2026-10-05 and sits in GSC at 11 impressions / position 9.6 over 90 days. Until today the hub was reachable only from location pages, the two product pages, the Oman/Middle East supplier pages and its own country pages: no site-wide link, no homepage link. Google treats a page that the site itself barely points at as a minor page.

**Third: uvwater.biz is the only competitor winning on the page itself.** 20 photos, a price in OMR, Offer schema, 35 kg can named in the H1. Everything else on page 1 is network authority or directories.

**What is not the reason.** Content: our hub is 2–8× longer than every competitor page and has the only specification table. Technical SEO: title, canonical, FAQPage, Breadcrumb, Speakable all correct in the prerendered HTML. Maps: at the Muscat viewport Google Maps already lists **Global Chemicals LLC first** for "nitric acid supplier" (we have 2 reviews; the next listings carry 12, 17, 13, 71). Bing: we are #1 (hub) for "nitric acid supplier oman" and #1 + #2 for "nitric acid oman". Perplexity: #1.

## 3. What was done today (Develop, unpublished)

| # | Change | Why |
|---|---|---|
| N1 | **Footer "Supply Guides" list**: all eight `/chemical-supplier/*` hubs linked from every page with descriptive anchors ("Nitric Acid Supplier Oman"…) | Gives the hub ~650 internal links; the only on-site lever that addresses "homepage ranks, hub doesn't". `footer.supplyGuides` key added to `en.json` and `ar.json`. **Note: this changes the footer on the homepage too.** HANDOFF protects the homepage's title and content; the footer is a shared component. Flagging it so you can veto before Publish |
| N2 | Two FAQs on the hub matching the open "People also ask" questions: "Where can I buy nitric acid in Oman?" and "What is 70% nitric acid used for?" | Both restate facts already on the page. The "is it illegal / what documents does a buyer need" question is **not** answered: it needs your statement of who you sell to (companies only? end-use declaration?) |
| N3 | One licensed packaging image (IBC tote, CC BY-SA, already used by the catalogue) with descriptive alt and caption on the hub | Every page-1 competitor has 2–20 images; the hub had none |
| N4 | Related-chemicals strips on the nitric and caustic hubs (earlier today) | Hub-to-hub links in every direction |

## 4. The plan to #1 for nitric acid in Oman

| # | Action | Who | Moves what | Judge it on |
|---|---|---|---|---|
| N5 | **Publish** N1–N4, then request indexing for the hub and the Qatar page | you (Publish), Claude (GSC) | hub replaces homepage as the ranking URL; target top 10 | 2 weeks after Publish |
| N6 | **Google Business Profile → Products: add "Nitric Acid 68%"** (and HCl, caustic) with the hub URL as the product link; also the secondary categories from the Oman plan | you (GBP owner; the editor's category search is blocked for Claude) | Maps card + AI Mode, which answers from Maps cards | AI Mode names us for "nitric acid supplier in oman" |
| N7 | **Reviews 2 → 15+** (link `https://g.page/r/CWLBtunkhjqlEBM/review`). We are already Maps #1 at Muscat for this query with 2 reviews; the competitors' Maps cards show 5.0 (1) | you | Maps hold + AI Mode | weekly |
| N8 | **Directories that hold page 1 for this exact query**: go4worldbusiness.com (free supplier profile; we are not on it, #5), omanyellowpagesonline.com / GulfYP (free listing; it lists the name-collision company, not us, #9), metoree.com (links to muscatchemical), madeinomangate.com (links to muscatchemical; Oman-government-backed). Plus yellowpages.om, lookchem, ensun from the Oman plan | you create the account; Claude fills and asks before submit | a second and third page-1 presence for "nitric acid oman"; referring domains 1 → 5+ | listed + 4 weeks |
| N9 | **Earned Oman links**: OCCI member directory (needs CR number), tamol.om (have), Tender Board supplier registry, PDO/JSRS vendor list if public, customers' "approved suppliers" pages, the certification body's client list | you + Claude | the referring-domain ceiling | 1–3 months |
| N10 | **Price guidance**: the one content signal uvwater has and we don't. Publish an indicative "from OMR … per 35 kg carboy, volume-tiered" line **only if you want a number public**; the hub's cost FAQ currently cites competitors' figures without ours | you decide | CTR on the price PAA; Offer schema | after Publish |
| N11 | **Do not**: build a sister-site network, buy links, add nitric × city pages, or retitle. The network is the competitor's weakness long-term (thin pages, manufactured authority); ours is the opposite problem and fixes with real citations | — | — | — |

**Expected sequence.** N1 after Publish and a recrawl should make the hub, not the homepage, our ranking URL and lift it into the top 10 (the homepage already reaches 17–18 with zero nitric relevance in its title). N6–N7 decide AI Mode. N8–N9 are what take page 1 from an exact-match network with 41 interlinked domains: each legitimate Oman directory listing is a referring domain they also have (madeinomangate, metoree) or a page-1 slot they occupy (go4worldbusiness, omanyellowpagesonline). Bing and Perplexity are already won; Google is the only engine where nitric is not top 3, and these are the levers for it.
