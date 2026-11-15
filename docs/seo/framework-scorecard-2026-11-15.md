# gcoman.com against the "Million-Dollar Blog Post" checklist and the five layers (SEO/AEO/GEO/AIO/SXO), 2026-11-15

The user shared three infographics (a 14-point AI-era article checklist, "Layers of SEO in 2026", "Modern SEO cluster") and asked for the site's position. Read live as GPTBot (raw prerendered HTML, no JS) on 5 pages: two blog posts (`top-chemical-suppliers-oman-2026`, `shell-mobil-castrol-lubricants-oman`), the nitric 68% product page, the nitric hub, `/chemicals/muscat`. Plus `robots.txt`, the blog schema source (`StructuredData.tsx`, `BlogPost.tsx`) and the post dates in `Blog.tsx`.

## The 14-point checklist

| # | Item | Blog posts (24) | Product / hub / location pages | Verdict |
|---|---|---|---|---|
| 1 | H1 = the buyer's question, brand + topic | Topic titles ("Top Chemical Suppliers in Oman 2026: Industry Guide"), no brand, not questions | Keyword H1s ("Chemical Supplier in Muscat") that match how buyers search | Partial |
| 2 | Named author with photo, credentials, profile | "Global Chemicals Editorial Team" / "Technical Team", and the schema types that team as a **Person** (`StructuredData.tsx:134`) | none | **Missing** |
| 3 | Published + last-updated dates | `dateModified` is hard-wired to the publish date (`BlogPost.tsx:142`), so no post ever shows an update; 6 posts date from 2024, the "2026" suppliers guide from Feb | `dateModified` present (pinned by `verify:live-pages --strict-modified`) | Partial |
| 4 | 40–60-word answer first | A ~25-word subtitle, then the table of contents | Products open with a facts strip (CAS, formula, delivery, SDS/CoA) then the overview | Partial |
| 5 | H2s as real questions | 1 of 5, 0 of 6 | Hub 4 of 10, product 0 of 6 (its FAQ items are questions), Muscat 1 of 5 | Weak |
| 6 | Self-contained sections | Mostly yes | Yes | OK |
| 7 | Quotable sentences | Moderate | Strong (CAS, concentration, packs, "same-day Muscat") | Good |
| 8 | Original first-party data | Little | Packs, lead times, GCC transit days; no prices | **Weak** |
| 9 | Links to primary sources | ~9–10 external links per page | Same, plus `wikiUrl` on 55 products | Partial |
| 10 | A comparison table | **0 of 24 posts** have one (the renderer supports pipe tables) | Hubs: 1; product spec block is a list, not a `<table>` | **Weak** |
| 11 | Visible FAQ + FAQ schema | Some | Yes, matched to `FAQPage` | Done |
| 12 | Article, Organization, FAQ schema | BlogPosting + publisher Organization + HowTo + Speakable (author type wrong, see 2) | Product, FAQPage, LocalBusiness, Breadcrumb | Done (fix 2) |
| 13 | Server-rendered HTML, alt text, AI crawlers allowed | Prerendered; 0 images without alt; robots.txt allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended | Same | **Done** |
| 14 | Internal links + one clear action | ~90 internal links, quote CTA | Same | Done |

Score: done 5, partial 5, weak/missing 4. The build and schema side (12–14) is best-in-class; the editorial side (2, 4, 5, 8, 10) is where the blog falls short.

## The five layers

| Layer | Purpose | Our position (evidence) | Grade |
|---|---|---|---|
| SEO: found | Rank in Google/Bing | Technical clean (crawl, prerender, sitemap 645, hreflang). #1–2 for "chemical supplier(s) in oman", #3 Muscat; products page 4+. **Off-page: a handful of referring domains vs omanchem 41** | Technical A, off-page D |
| AEO: answered | Snippets, AI answers | Visible FAQs on 277 products + hubs + locations; 6,880 AI Overview/AI Mode impressions in 3 months; blogs lack answer blocks and question H2s | B |
| GEO: remembered | Cited by ChatGPT, Gemini, Perplexity | AI Mode, Perplexity, Copilot name us 1st; ChatGPT 2nd after Oman Chemical; **Gemini does not name us**. Few brand mentions off-site, no Wikipedia/Wikidata, name collision with "Global Chemicals & Maintenance Systems" | C |
| AIO: understood | Entities, structured data | Organization/LocalBusiness single-source JSON-LD, llms.txt, CAS numbers, consistent NAP. Entity weakened by the name collision and no Wikidata item | B+ |
| SXO: converted | Speed, UX, trust, CTA | Quote CTA everywhere; but homepage LCP 4.4 s (CrUX), **1.4% CTR at position 2**, 2 Google reviews, 39 of 40 leads since 10-01 still "New" | D |

"Remove one layer, break the system": ours are off-page SEO, GEO brand mentions and SXO conversion. All three are mostly off-site or operational.

## What to do (code first, then user)

Code (Develop, ships on "publish"; no bulk FAQs, no retitling, homepage and JSRS blog untouched):

1. Blog schema author → `Organization` (Global Chemicals LLC) until a real named reviewer exists; stop forcing `dateModified` = publish date, and add a per-post `updated` field shown on the page.
2. The top blog posts by GSC (lubricants guide, top suppliers guide, MEG vs DEG): a 40–60-word answer paragraph first, question-form H2s, one comparison table each (e.g. Shell vs Mobil vs Castrol grades for 50 °C; supplier selection criteria). Fact-check per batch.
3. Product spec block rendered as a real `<table>` (CAS, concentration, density, packs), so AI can lift it whole.

User (decides or supplies):

4. A real named author/reviewer with real credentials (e.g. the Sales Manager or a chemist) and a photo. Never invented: Google's guidance warns on deceptive authorship.
5. First-party data we can publish: price bands, typical lead times by country, stock pack sizes. This is item 8, and the thing competitors cannot copy.
6. Reviews (2 → 15), directory sign-ups, outreach: the off-page and GEO layers.
7. Work the leads: the SXO layer ends at the sales reply.
