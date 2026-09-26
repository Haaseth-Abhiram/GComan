# AI Visibility Check — gcoman.com — 2026-09-26

**Method:** live queries run directly against ChatGPT (chatgpt.com, logged out), Gemini (gemini.google.com, logged in), and Claude (via WebSearch tool — approximates a web-search-enabled Claude session), plus a live Google SERP check for AI Overview presence. Two query types tested: a **generic brand/category query** ("best chemical suppliers in Oman") and a **specific commodity-product query** ("caustic soda supplier Oman") — the second because the keyword-rank-tracker already flags caustic soda as a controlled test where organic search is weak, to see if the same gap shows up in AI answers.

This is a spot-check (2 queries × 3 platforms), not a tracked panel — directional, same caveat as the manual SERP checks in `keyword-rank-tracker.md`.

## Technical foundation — healthy

- **robots.txt**: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Bytespider, Applebot all explicitly `Allow`. Only pure-training crawlers (CCBot, anthropic-ai, cohere-ai) and SEO-audit bots (AhrefsBot, SemrushBot, etc.) are blocked. Correct posture: visible for search/answer generation, opted out of corpus mining.
- **llms.txt**: present, current (last updated 2026-09-21), structured per the emerging standard — core identity, all 22 product categories, ~35 key pages, 18 technical articles, service areas, usage policy. This is why AI answers below quote correct facts (ISO 9001, JSRS, Ghala/Muscat, 275 SKUs) rather than guessing.
- Both of these were previously-completed GEO work (2026-05-25 initiative) and the 09-21 audit's C5 llms.txt-staleness finding — confirmed still live and correct.

## Result 1 — Generic query: "best chemical suppliers in Oman / industrial chemicals for a factory in Muscat"

**Global Chemicals LLC wins the #1 spot on all three platforms tested.**

| Platform | Result |
|---|---|
| **ChatGPT** | #1 of 7+ suppliers listed (map + text). Accurate summary: "covers water-treatment chemicals, caustic soda, sodium hypochlorite, antiscalants, industrial lubricants, oilfield/refinery chemicals, food-grade chemicals and laboratory reagents... ISO 9001 certified and JSRS registered," with a citation link back to the site. |
| **Gemini** | #1 of 5 suppliers listed, and named first again in the generated "Issue RFQs to Vendors" procurement checklist ("Contact Global Chemicals LLC, Muscat Chemical, and Chemstock..."). |
| **Claude (web search)** | Named first, same accurate ISO/JSRS/category framing, sourced directly from gcoman.com. |
| **Google organic** (`gl=om`) | #1 organic result for "best chemical suppliers in oman" (no AI Overview box triggered on this query in this session). |

This matches — and for the AI platforms, exceeds — the keyword-rank-tracker's existing finding that `chemical supplier in oman` and `chemical supplier in muscat` already rank #1 organically. The brand-level positioning work (JSRS credibility, ISO badge, llms.txt, GBP profile) is translating cleanly into AI answers.

## Result 2 — Specific product query: "who supplies caustic soda in Oman (bulk, water treatment)"

**Inconsistent — the same gap the tracker already flags in organic search shows up in AI answers too, and on Gemini it's a total miss.**

| Platform | Result |
|---|---|
| **ChatGPT** | #2 of several, behind **Oman Chlorine** (the actual chlor-alkali manufacturer — reasonable, factually sound advice since a real producer legitimately beats a distributor for tanker-scale RFQs). Description was accurate and included the correct phone number. |
| **Gemini** | **Not mentioned at all.** Top 4 were Hakim Water C&E, Oman Chemical/MBBT, Zenith Gulf Chemical Trading, Muscat Chemical — all real, independently confirmed via organic search (hakimwater.com genuinely ranks). Global Chemicals LLC absent from the list and from the generated RFQ-email checklist. |
| **Claude (web search)** | #3 of 6, behind Hakim Water C&E and Al Ghaith Industries, ahead of OOISS/Muscat Chemical/Innova. |
| **Google organic** (`gl=om`) | Not in top 10 (confirms the tracker's existing "—" entry for this keyword; omanchem, Oman Chlorine, Muscat Chemical, hakimwater.com dominate). |

**This is the same story as organic search, not a new problem**: `keyword-rank-tracker.md` already has caustic soda flagged as a live controlled test (verdict due ~2026-10-01, "do not touch"), precisely because omanchem/muscatchemical/Oman Chlorine own this vertical. The AI platforms are largely reflecting the same competitive reality they're reading off the web — which is itself informative: **it confirms AI visibility here won't improve from AI-specific tactics (schema, llms.txt tweaks) alone; it's downstream of the same organic-authority gap** already being worked (product-positioning-gap-audit.md items 4/6). Don't spend GEO-specific effort on caustic soda before the caustic-soda organic verdict lands.

## Reading across both results

- **Brand/category queries** ("best supplier in Oman", "chemical supplier Muscat"): dominant across ChatGPT, Gemini, and Claude. This is the highest-value pattern to protect — it's driven by the JSRS/ISO credibility signals and llms.txt, not by any one product page.
- **Commodity-product queries** (caustic soda, and by extension probably the other Tier-3/D-band products in the keyword tracker — HCl, industrial salt, soda ash, PAC, etc.): AI answers pull from the same competitive set Google's organic results already show, so they inherit the authority gap. Gemini in particular is more likely than the other two to drop Global Chemicals LLC entirely from a specific-product list, favoring smaller/local manufacturers whose sites happen to rank organically for that exact term.
- No AI Overview box appeared in this session for either query — can't assess AIO-specific behavior from this check; would need repeat sampling (AIO trigger rate is query- and session-dependent).

## What this does and doesn't imply for the roadmap

- **Doesn't change the priority order** already in `product-positioning-gap-audit.md` — authority-building (item 6: GPCA/OCCI/Ithraa/backlinks) and B-band conversion are still the right levers, because that's what's actually driving both the organic AND the AI gap on product-specific queries.
- **Does confirm** the JSRS/ISO/llms.txt/GBP work already shipped is the reason the brand-level query looks this strong across every AI platform tested — worth protecting/not disturbing.
- **New, actionable idea**: since Gemini was the platform most likely to drop Global Chemicals LLC on a specific-product query, and Gemini answers lean on whatever ranks organically, closing organic gaps (B-band FAQs, authority) should read through to Gemini answers specifically once Google re-crawls — a natural thing to re-check when re-measuring B-band impressions in 3-4 weeks.

## Caveats

- Gemini and Claude sessions used are not incognito/geo-controlled the way the tracker's manual SERP checks are — results can vary by account personalization, session state, and day-to-day model behavior. Treat as directional, same as the rest of the tracker.
- Two queries is a spot-check, not a panel. If this becomes a recurring check, extend to 4-5 queries spanning brand, 2-3 product verticals (one winning like agro/lab, one losing like caustic soda), and a location query (e.g. "chemical supplier Sohar").
