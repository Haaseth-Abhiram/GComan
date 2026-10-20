# GEO (Generative Engine Optimization) Analysis — gcoman.com
**Global Chemicals LLC | B2B chemical supplier, Oman & GCC**
Audit date: 2026-10-20 · production deploy `psr2.b67725d0…` (main `cd3cbd3`, which includes the 2026-10-18 GEO fixes `60c29ef`) · previous reading 2026-10-18 (62/100) and 2026-05-24 (41/100), both in git history.

Method: live fetches with a `GPTBot/1.1` user agent (no JavaScript — what AI crawlers actually get), parsed for structure, schema, passages, dates, media and FAQ visibility. Thirteen URLs sampled: home, nitric hub, nitric UAE, caustic hub, laboratory hub, `/chemical-suppliers-oman`, `/chemicals/muscat`, two product pages (polymer bonding agent, soda ash light), `/blog`, the caustic blog guide, the JSRS blog post, `/tools/dosing-calculator`. Plus: `robots.txt`, `llms.txt`, Wikidata API, a web search for third-party mentions, Bing Webmaster Tools → AI Performance (3 months), and the AI-engine cells read on 10-19/10-20 in `visibility-ledger.md` (not re-read today: Google was CAPTCHA-blocked after the morning's batch).

---

## 1. GEO Readiness Score: 63/100 (was 62 on 10-18, 41 in May)

| Dimension | Weight | 10-18 | **10-20** | Weighted | What changed |
|---|---|---|---|---|---|
| Citability | 25% | 65 | **65** | 16.3 | Same pages, same openings. Still 0 passages in the 134–167-word band on any sampled page (max paragraph 67–109 words); the citable units remain hub openings and FAQ answers |
| Structural readability | 20% | 75 | **75** | 15.0 | Spec tables on every hub (1–5), lists, FAQ visible 100%. Still only 1 question-style H2 per hub |
| Multi-modal | 15% | 40 | **40** | 6.0 | Production nitric/caustic/lab hubs ship **0 `<img>`**; no video anywhere. The IBC image on the nitric hub is on Develop, unpublished. Dosing calculators are the one interactive asset |
| Authority & brand | 20% | 35 | **38** | 7.6 | On-site: `dateModified` now on every sampled page ✓, `llms.txt` complete and dated ✓. Off-site: unchanged and now measured — a web search for the brand or domain returns **zero** third-party pages about us; the name-collision company owns every result |
| Technical accessibility | 20% | 90 | **90** | 18.0 | Prerendered HTML on all 13 URLs, all answer crawlers allowed, CCBot now allowed ✓. Held back by two things: any unknown URL returns the homepage at HTTP 200 with `index, follow`, and RSL is a comment in `llms.txt`, not a `License:` directive |
| **Total** | | 62.3 | **62.9 → 63** | | |

The cap is unchanged: **authority off-site**. Every on-site item from the 10-18 list that could be done in code was shipped and is live; the score moved one point because the remaining 37 points are mentions, citations and an entity record, none of which the site can create for itself (HANDOFF §3 conclusion stands).

## 2. Platform breakdown (ledger cells, 10-19 / 10-20)

| Platform | Brand query | Product query: nitric acid, Oman | Score |
|---|---|---|---|
| Google AI Overviews / AI Mode | #1 | n/m today (CAPTCHA after the morning batch); 10-16: **not named**, Muscat Chemical / Oman Chem / Sohar Chemical / uvwater cited | 45 |
| ChatGPT (web, logged out) | #1 | 10-19: 3rd for Oman; **10-20: not named**. Volatile between readings; never first | 55 |
| Perplexity | #1 | 10-20: **1st for Oman** ("strongest Oman-based option"), 4th for Saudi, absent for UAE | 80 |
| Bing Copilot (Bing WMT AI Performance, 3 months) | — | Only **2 grounding queries** cite us: "jsrs" 785 citations (27% share) and "jsrs meaning" 10. **No product or supplier query** appears. Bing organic: nitric Oman #1 | 55 |

Reading: Perplexity rewards the page itself and we win there. Copilot and Google AI cite what the wider web corroborates, and for nitric acid the wider web corroborates the RX Marine network and uvwater, not us. Copilot's citations are 100% the JSRS article, i.e. one informational page carries the whole AI footprint.

## 3. AI crawler access ✓

| Allowed (explicit) | Blocked |
|---|---|
| GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Bytespider, Applebot, **CCBot (allowed since 10-18, live)**, Googlebot, Bingbot | anthropic-ai, cohere-ai (plus Ahrefs/Semrush/MJ12/DotBot/BLEX SEO bots) |

Every search and answer crawler is allowed. Nothing to change.

## 4. llms.txt ✓ (fixed 10-18, verified live)

`/llms.txt` 200, 16.7 KB, "Last updated: 2026-10-18", **13 of 13 `/chemical-supplier/*` hubs listed**, 277 SKUs, RSL 1.0 line, CI gate `verify:llms-txt` (95 links). `/llms-full.txt` 404 (optional; skip).

## 5. Brand mention analysis (measured today)

| Surface | Status |
|---|---|
| Web search for `"gcoman.com"` or `"Global Chemicals LLC" Oman` (3 queries, non-site results) | **0 pages about us.** Results: Global Chemicals & Maintenance Systems LLC (AroundDeal ×2), Global Chemical Co LLC (UAE, Bloomberg), Muscat Chemical / RXSOL on madeinomangate, GulfBase, D&B category page. The name-collision company and competitors own the brand SERP off-site |
| Wikipedia | None. Account blocked; path = unblock + rename, never a new account |
| Wikidata | **No entity** (`wbsearchentities` for "Global Chemicals LLC" and "gcoman" both return 0) |
| Reddit | 0 results in web search; Reddit's own search API blocks unauthenticated reads |
| YouTube | Channel `@GlobalChemicalsLLC` exists (200), appears to hold 1 video; not embedded on any page |
| LinkedIn, Facebook, X, Instagram, Threads, Crunchbase | In Organization `sameAs` ✓ (plus iso.org and city Wikipedia pages) |
| Bing backlinks | 1 referring domain (tamol.om) vs omanchem.com 41, muscatchemical.com 16 (`nitric-acid-competitors-2026-10-19.md`) |
| Directories | Live: Bing Places, tamol. Open (user): go4worldbusiness, omanyellowpagesonline/GulfYP, metoree, madeinomangate, yellowpages.om, ensun, lookchem, D-U-N-S (`registration-queue` memory, MASTER-PLAN P5) |

This is the whole gap. Ahrefs' 2025 data puts brand mentions at ~3× the weight of backlinks for AI visibility, and we have neither outside our own domain.

## 6. Passage-level citability (same parser as 10-18, `<p(\s|>)`)

| Page | Words | Paragraphs / max | 134–167-word blocks | Opening passage |
|---|---|---|---|---|
| Nitric hub | 1,668 | 68 / 88 | 0 | ✅ Definition first: "Nitric acid (HNO3, CAS 7697-37-2) is a strong mineral acid supplied at 68%…" |
| Nitric UAE | 698 | 5 / 67 | 0 | ✅ Direct answer + lead time (Fujairah 2–4 h, Dubai 3–5 days) in the first line |
| Caustic hub | 1,388 | 68 / 68 | 0 | ✅ "…supplier in Muscat, Oman, stocking flakes (98–99%), prills (99%), and liquid (30–50%)" |
| Laboratory hub | 1,174 | 6 / 71 | 0 | ✅ "supplies 34 laboratory reagents from stock in Muscat for university, hospital…" (5 tables) |
| `/chemical-suppliers-oman` | 1,455 | 53 / 73 | 0 | ✅ 11 FAQ answers visible |
| `/chemicals/muscat` | 608 | 21 / 75 | 0 | ✅ City + districts named in sentence one |
| Product template (polymer bonding agent, soda ash light) | 596 / 427 | 8 / 104, 11 / 106 | 0 | ⚠ First visible text is breadcrumb + badges + "Request a Quote"; the definition sits in the 100-word overview paragraph |
| Caustic blog guide | 1,611 | 26 / 109 | 0 | ✅ H1 states the topic; 1 table, 5 visible FAQs |
| JSRS post (the Copilot asset) | 923 | 32 / 83 | 0 | ✅ 2 question-style H2s; this is the page Copilot lifts |
| Dosing calculator | 838 | 12 / 46 | 0 | WebApplication schema; 4 FAQs; the interactive asset |

Verdict unchanged: structure is citation-ready; paragraphs are short (nothing over 109 words) and FAQ answers are the natural 60–100-word units. Reformatting would not move the score.

## 7. Server-side rendering check ✅ (with one standing defect)

All 13 valid URLs ship full content without JavaScript: correct `<title>`, H1, body (427–1,668 words), tables, schema, FAQ answers visible as text, `dateModified` on every page that has a WebPage node (2026-03-15 to 2026-10-16, derived from git).

**Standing defect:** a URL that does not exist (`/this-page-does-not-exist-xyz`, 165 KB) returns **HTTP 200 with the full prerendered homepage** and `robots: index, follow`. Lovable's CDN has no 404 for unknown routes, so every dead link on the web resolves to a homepage clone for AI crawlers (Bing Site Explorer already lists `/our-team`, `/what-we-supply-2`, `/food-beverages` this way). Not fixable in app code on this host; mitigation is to keep dead URLs out of circulation (legacy redirects, Bing URL removal, IndexNow after Publish).

## 8. Top 5 highest-impact changes (10-20)

| # | Change | Who | Effort | Why |
|---|---|---|---|---|
| 1 | **Off-site corroboration** (unchanged, now measured as a zero): the page-1 directories for the nitric query (go4worldbusiness, omanyellowpagesonline, metoree, madeinomangate), D-U-N-S, one Oman trade-press or association mention, and reviews 2 → 15+ | User (accounts), Claude fills | Business | Every surface where we are not #1 (Google AI, ChatGPT, Copilot) picks sites with third-party mentions; we have none |
| 2 | **Publish** Develop (21 commits): nitric hub image + 2 PAA FAQs, footer Supply Guides + city links, 6 deepened product pages | User | 10 min | The only multi-modal and internal-link gains of the last week are not in production |
| 3 | **Embed one YouTube video** (handling / packaging) on the nitric and caustic hubs with `VideoObject` | User records or picks the clip; Claude embeds | Low | Multi-modal is the cheapest 15% of the score and sits at 40; YouTube mentions are the strongest single AI-citation correlate |
| 4 | **RSL as a real directive**: `License: https://gcoman.com/license.xml` in `robots.txt` + a `license.xml`, instead of the comment line in `llms.txt` | Code | 15 min | Machine-readable licensing is what the RSL-backed crawlers read; the current line is invisible to them |
| 5 | **Wikidata item** once the Wikipedia path is cleared; until then, get the entity onto the directories in #1 so the knowledge graph has something to merge | User | Low | The only durable fix for the name-collision company absorbing our brand results |

Dropped from the 10-18 list as done and verified live: refresh `llms.txt` (#2), true sitemap `<lastmod>` (#3), visible `dateModified` (#4), allow CCBot (#5).

## 9. Schema recommendations

Present and correct on the sampled pages: Organization/LocalBusiness (single global source), Product + Brand + Offer, BreadcrumbList, FAQPage (visible Q&As match 100%), SpeakableSpecification, BlogPosting + Person, WebApplication on the calculator, `dateModified` on WebPage.

- FAQPage on a commercial site earns no Google rich result (Aug 2023); keep for LLM extraction. Info only.
- HowTo on blog posts is deprecated by Google (Sept 2023). Harmless; add no more.
- `VideoObject` when a video is embedded (item 3).
- Wikidata Q-ID into `sameAs` the day one exists (item 5).

## 10. Content reformatting suggestions

1. **Hubs**: one question-style H2 per main section ("What grades of nitric acid are available in Oman?", "How fast can nitric acid be delivered to Sohar?") so headings match query phrasing; today each hub has one.
2. **Product template**: move the one-sentence definition above the badge strip so the first 40–60 words a crawler reads are the answer, not "Request a Quote" (template-level change, no retitling; needs the HANDOFF check).
3. **JSRS post**: it is 100% of our Copilot citations. Add a short dated "What changed in JSRS this year" block so it keeps its freshness signal; do not restructure it (HANDOFF: no JSRS blog changes without the user).

Next GEO re-score: first Sunday of November (monthly cadence, `running-search-operations`), or after Publish + the first directory listings land.
