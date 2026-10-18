# GEO (Generative Engine Optimization) Analysis — gcoman.com
**Global Chemicals LLC | B2B chemical supplier, Oman & GCC**
Audit date: 2026-10-18 · production deploy `psr2.eb5a4575…` · replaces the 2026-05-24 version (41/100; still in git history)

Method: live fetches with a `GPTBot/1.1` user agent (no JavaScript — what AI crawlers actually get), parsed for structure, schema, passages and FAQ visibility. Nine URLs sampled: home, `/blog`, one blog post, `/chemical-suppliers-oman`, the nitric/HCl hubs, the UAE nitric country page, the PAC product page and one invalid URL. Platform positions are **not re-measured here**. They come from the dated rows in `visibility-ledger.md` (latest: 2026-10-16), labelled per source.

---

## 1. GEO Readiness Score: 62/100 (was 41 in May)

| Dimension | Weight | Score | Weighted | Change since May |
|---|---|---|---|---|
| Citability | 25% | 65 | 16.3 | Hubs now open with a definition-style answer (CAS, concentration, packs) |
| Structural readability | 20% | 75 | 15.0 | Spec tables on hubs; FAQ Q&As visible on every sampled page |
| Multi-modal | 15% | 40 | 6.0 | Still mostly text; 2 images per page, no video embedded |
| Authority & brand | 20% | 35 | 7.0 | Crunchbase/YouTube in `sameAs`; still no Wikidata, thin third-party mentions |
| Technical accessibility | 20% | 90 | 18.0 | Prerendered HTML, named AI crawlers, llms.txt, RSL license line |
| **Total** | | | **62.3** | |

The score is capped by **authority, not by the site**. This matches the conclusion in HANDOFF §3: technical GEO is not the bottleneck.

## 2. Platform breakdown (from the ledger, not re-read today)

| Platform | Brand query | Product query (nitric acid, 2026-10-16) | Score |
|---|---|---|---|
| Google AI Overviews / AI Mode | #1 | **Not named.** Muscat Chemical, Oman Chemical, Sohar Chemical and uvwater are cited instead | 45 |
| ChatGPT (web) | #1 | #2 for Oman (was #4); absent from the GCC-wide prompt | 60 |
| Perplexity | #1 | #1, gcoman.com cited first | 80 |
| Bing Copilot | #1 | Bing organic #1–2 for nitric Oman queries; Copilot telemetry in Bing WMT not re-read | 65 |

Perplexity and Bing reward the page itself. Google AIO and ChatGPT GCC-wide pick sites that are corroborated elsewhere on the web.

## 3. AI crawler access

| Allowed (explicit block) | Blocked |
|---|---|
| GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Bytespider, Applebot, Bingbot, Googlebot | CCBot, anthropic-ai, cohere-ai (plus Ahrefs/Semrush/MJ12/DotBot/BLEX SEO bots) |

All search and answer crawlers are allowed. One trade-off to decide on purpose: **CCBot (Common Crawl) is blocked**. Common Crawl is a main source of training data for most foundation models. Blocking it makes it less likely that future models "know" Global Chemicals LLC without a live search. That matters for a brand that has no Wikipedia page and shares its name with another company (see the brand-name-collision note). Recommendation: **allow CCBot**. The content is public marketing material, so there's nothing to protect.

## 4. llms.txt: present but stale ⚠

`/llms.txt` returns 200 (14 KB) and is well structured: identity, categories, key pages, blog. `/llms-full.txt` returns 404, which is optional. Problems:

- **Lists 1 of 13 product+geo hubs.** Missing: nitric acid (Oman + UAE, Saudi Arabia, Qatar, Kuwait, Bahrain), the HCl hub, PAC, sodium hypochlorite, laboratory chemicals, fertilizers, oilfield chemicals. These are the pages built to win product queries in AI answers, and the file meant to guide AI crawlers doesn't mention them.
- The "Hydrochloric Acid Supplier" entry links to the product page, not to `/chemical-supplier/hydrochloric-acid-oman`.
- Says "275 SKUs" twice; the catalogue has 277. "Last updated: 2026-09-21".

## 5. Brand mention analysis

| Surface | Status |
|---|---|
| Wikipedia | None. Account blocked; the path is unblock + rename (never a new account) |
| Wikidata | **No entity** (API search for "Global Chemicals LLC" / "gcoman" returns nothing) |
| LinkedIn, Facebook, X, Instagram, Threads, Crunchbase | In Organization `sameAs` ✓ |
| YouTube | Channel exists and is in `sameAs`. No video is embedded on any sampled page |
| Reddit | Not measured this run |
| Third-party directories | User-owned list in `citation-execution-plan-2026-09-30.md` (Bing Places, D-U-N-S, Made in Oman Gate, Metoree, OmanYP) |

## 6. Passage-level citability

> **Correction (same day):** the first version of this section reported 400–650-word paragraphs. That was a parser bug: `<p[^>]*>` also matched SVG `<path>` elements and swallowed whole sections. Re-measured with `<p(\s|>)`: **no sampled paragraph exceeds 110 words.** The "split product descriptions" recommendation was withdrawn. Splitting 100–150-word descriptions would move them *away* from the 134–167-word citation target, not towards it.

| Page | Opening passage | Paragraphs (max words) |
|---|---|---|
| Nitric hub | ✅ "Nitric acid (HNO3, CAS 7697-37-2) is a strong mineral acid supplied at 68%…": definition + grades + packs in about 60 words | 82 paragraphs, max 88 |
| Nitric UAE | ✅ Direct answer plus a concrete lead time (3–5 business days) | 19, max 67 |
| PAC product page (template for 277 products) | ⚠ The first visible text is trust badges and a 7-word tagline. The definition is in the 101-word "Detailed Description" | 23, max 101 |
| `/chemical-suppliers-oman`, home, caustic blog | ✅ Short paragraphs; FAQ answers of 60–100 words are the natural citation units | max 73–110 |

Structure is good. The citable units are the FAQ answers and the hub openings. What's missing is *off-site corroboration* of those facts, not reformatting.

## 7. Server-side rendering check ✅

Every valid URL ships its full content without JavaScript: correct `<title>`, canonical, H1, body copy (980–1,950 words), spec tables, and the FAQ answers visible as text (every FAQPage Q&A was matched in the visible HTML, 0 mismatches). One known CDN limitation: an **invalid URL returns 200 with the homepage HTML** and a homepage canonical. The canonical defuses it, but a mistyped link is never a hard 404 for crawlers.

## 8. Top 5 highest-impact changes

| # | Change | Who | Effort | Why |
|---|---|---|---|---|
| 1 | **Off-site corroboration**: finish the citation list (D-U-N-S, Made in Oman Gate, Metoree, Bing Places, OmanYP), plus one Oman/GCC trade press or association mention for nitric acid | User | Business | Google AIO names four competitors on nitric acid with *worse* pages. They win on mentions, and only mentions close that gap |
| 2 | **Refresh `llms.txt`**: add all 13 hubs, fix the HCl link, 277 SKUs, today's date | Code (10 min) | Low | AI crawlers' own guide currently doesn't mention the money pages |
| 3 | ~~Split product descriptions~~ **withdrawn**: based on a parser error (see §6). Replaced by: keep the sitemap `<lastmod>` true. 160 were stale and 12 hubs could never update. Fixed 2026-10-18, and the script now fails on any unmapped page | Code | Done | lastmod is Google's recrawl hint, and `dateModified` (item 4) is derived from it |
| 4 | **Visible "Last updated" + `dateModified`** on hubs and product pages (derive from git like `sync:sitemap-lastmod`) | Code | Low | Hubs and product pages carry no date at all. Freshness is a citation signal for Perplexity/ChatGPT |
| 5 | **Allow CCBot**; create a Wikidata item once the Wikipedia path is cleared | Code / user | Low | Gets the entity into model training data and the knowledge graph, which helps separate it from the name-collision company |

## 9. Schema recommendations

Already present and correct: Organization/LocalBusiness (global, single source), Product + Brand + Offer on product pages, BreadcrumbList, FAQPage, SpeakableSpecification, BlogPosting with Person.

- **FAQPage** is a commercial site, so Google shows no FAQ rich result for it (Aug 2023 restriction). Keep it for the AI/LLM extraction benefit. Info only, not an action item.
- **HowTo** on blog posts was deprecated by Google in Sept 2023. Harmless, but don't add more.
- Add `dateModified` to the hub and product `WebPage` nodes (item 4).
- Once a Wikidata Q-ID exists, add it to Organization `sameAs`. It's the strongest disambiguation link available.
- When a YouTube video is embedded on a hub, add `VideoObject`.

## 10. Content reformatting suggestions

1. ~~Product template / `/chemical-suppliers-oman` paragraph splits~~: withdrawn, see §6.
2. **Hubs**: FAQs render as accordion buttons, not headings (1 question-style H2 per hub). Consider one question-style H2 per main section ("What grades of nitric acid are available in Oman?"), because those match query phrasing.
3. **Multi-modal**: embed one short handling/packaging video from the YouTube channel on the nitric and caustic hubs. It's the strongest brand-mention signal in the Ahrefs data, and the channel already exists.
