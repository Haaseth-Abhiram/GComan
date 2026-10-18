# "Are we going down in SEO and GEO?" Investigation, 2026-10-18

**Short answer: there is no broad decline in anything measurable today.** There is one confirmed loss on Google ("chemical company oman", #2 → #15), a competitor-brand term that dropped out of the top 9, and one nitric cell slipping. Everything else on Google is flat, and Bing, Maps and the AI engines are flat or up. The site itself is healthy, and nothing we shipped explains the Google loss.

**What this could not see (and why):**
- **Search Console** is blocked by this session's permission policy, so no clicks, impressions or average-position trend.
- **Bing Webmaster and Lovable Analytics** are signed out in Chrome.
- If the decline you saw came from one of those (clicks, impressions, leads), that number has not been checked here. See "What would settle it" below.

## Method

Only cells measured **the same way** before and now are compared: Google fetched unpersonalised (`pws=0 gl=om`), Bing rendered (`cc=om`), Maps from the Muscat viewport, and ChatGPT logged out / Perplexity signed in with the same prompt. The 2026-10-13 Google readings (#1 for Salalah, Duqm…) were taken in the signed-in, personalised browser. They are **not comparable** with today's unpersonalised fetches, so they are not counted as a decline.

## Same-cell comparison

| Engine | Query | Before (date) | Today | Move |
|---|---|---|---|---|
| Google | chemical suppliers oman | 2 (10-11) | 2 | = |
| Google | chemical suppliers in oman | 1 (10-11) | 1 | = |
| Google | chemical supplier muscat | 3 (10-11) | 3 | = |
| Google | **chemical company oman** | **2 (10-11), 3 (10-13)** | **15** | **↓ 12** |
| Google | oman chemical (competitor's brand) | 4 (10-11) | not in top 9 | ↓ |
| Google | global chemicals llc (our brand) | 1 | 1 | = |
| Google | nitric acid muscat | 16 (10-16) | 9 (hub) | ↑ 7 |
| Google | nitric acid sohar | 8 (10-16) | not in top 9 (page 2 not readable) | ↓ |
| Google | nitric acid supplier oman | not top 20 (10-16) | not in top 9 | = |
| Bing | chemical suppliers oman | 2 (10-11) | 2 | = |
| Bing | nitric acid supplier oman | 2 (10-16) | 1 | ↑ |
| Bing | sodium hypochlorite supplier oman | 3 (10-13) | 2 | ↑ |
| Bing | poly aluminium chloride supplier oman | 5 (10-13) | 4 | ↑ |
| Bing | caustic soda supplier oman | 3 (10-13) | 3 | = |
| Bing | hydrochloric acid supplier oman | 1 (10-13) | 1 | = |
| Maps (Muscat) | chemical supplier | absent from top 50 (10-13) | 7 | ↑ |
| ChatGPT | best chemical suppliers in Oman | 2, Oman Chemical first (10-11) | 2, Oman Chemical first | = |
| Perplexity | best chemical suppliers in Oman | 1 (10-11) | 1 ("especially well positioned") | = |

## The one real loss: "chemical company oman"

- **Who replaced us:** SAC Oman, MEED (an industry news site), Suhail Bahwan Group's chemicals division, Oman Chlorine, madeinoman.gov.om and ensun. These are **manufacturers, conglomerates and industry sources**. Google now reads "chemical company" as "chemical manufacturers / industrial groups in Oman", not "where do I buy chemicals". Our homepage still ranks #1–3 for the *supplier* phrasings.
- **Not caused by us:** the homepage title, description and copy have not changed since 2026-10-12 (the only change that day was the map coordinates, to match the GBP pin). The page passes every live check (`verify:live-pages` 64/64; full build 640 pages, 0 title failures).
- **Timing:** it fits Google's **unconfirmed ranking volatility of 2026-10-16** (Search Engine Roundtable), right after the **September spam update (Sep 24 – Oct 8)**. Without Search Console, the exact day cannot be pinned down.
- **What it's worth:** "chemical company oman" is a lower-intent phrasing than the "supplier" queries we still hold. The GSC 28-day row will show how many clicks it actually carried. Read it before acting.

## Things checked and ruled out

| Suspect | Finding |
|---|---|
| A broken page (homepage title leak, noindex, wrong canonical) | None. 64/64 location and hub pages pass in production |
| The 10-16 Publish (prerender-snapshot fallback, consolidations) | It changes every page, but the head terms that page serves are flat. The 18 canonicalised SKUs were chosen by ≥3× impressions, and their effect is limited to those product terms over 2–6 weeks |
| Brand confusion with Global Chemicals & Maintenance Systems | Our brand query is still #1; the other company is at #5–6 |
| AI engines dropping us | ChatGPT and Perplexity are unchanged |

## What I recommend

1. **Do not change the homepage to chase "chemical company oman".** It brings in about half of all clicks (HANDOFF), and the loss is an intent re-read by Google, not a page defect. Re-read the same cell on the next two daily runs; it is now in the panel notes.
2. **Settle it with Search Console** (user, or allow this session): Performance, 28 days vs. the previous 28, broken down by query and page. If clicks or impressions really fell, the query breakdown will show which queries, and that decides the action.
3. **Keep going on the levers that move "company" and product queries:** a Wikidata entity (P5.8), D-U-N-S and Made in Oman Gate (P5.2 and P5.4). madeinoman.gov.om, the government directory, now ranks on page 2 for this very query. A listing there would put us on a page Google currently rewards for it.

## What would settle it (needs a sign-in or a permission)

- GSC → Performance → 28 days, compared with the previous period. Read clicks, impressions, average position, and the top queries/pages that lost clicks.
- Lovable → Analytics → last 7 vs. the previous 7 days: visits and the google.com / chatgpt.com referrers.
- Bing Webmaster → Search Performance + AI Performance.

## Addendum, 2026-10-18 evening: Search Console read (settles the question)

GSC became reachable after the Publish. Performance, web, **last 28 days (Sep 19 – Oct 16) vs previous 28 (Aug 22 – Sep 18)**:

| Metric | Previous | Last 28 | Move |
|---|---|---|---|
| Clicks | 555 | 535 | −20 (−3.6%) |
| Impressions | 10.7K | 8.87K | −1.8K (−17%) |
| CTR | 5.2% | 6.0% | up |
| Average position | 10.3 | 8.4 | better |

**Where the impressions went (by country):** United States 2,280 → 1,080 (−1,200, two thirds of the whole loss; not a market, 13 clicks both periods). Saudi Arabia 819 → 554, clicks 57 → 37. UAE 998 → 929, clicks 50 → 35. **Oman up**: clicks 205 → 218, impressions 2,098 → 2,336. India clicks 95 → 103.

**By page:** homepage flat (clicks 274 → 281, impressions 3,161 → 3,211). Location and hub pages are the loss: clicks 127 → 100, impressions 3,997 → 2,819 (Middle East page 577 → 213, Oman suppliers page clicks 14 → 3, Riyadh 8 → 3, /ar Riyadh 8 → 0, Jeddah 10 → 2, Dammam 21 → 11, Cairo 7 → 2; Kuwait City up 2 → 9). Products: clicks flat (94 → 95), impressions 2,571 → 1,996.

**Timing (weekly, Saturday-start):** whole site clicks 158 / 146 / 133 / 116 / 113 / 125 / **181** (week of Oct 9 is the best week in 90 days). `/chemicals/*` impressions peaked 820 (Aug 28 week) and bottomed 474 (Sep 25 week), now 586. **Saudi Arabia** clicks 16 / 17 / 16 / 14 → 11 / 7 / 11 / 8 from the **week of Sep 18**; UAE noisy and back to 15 clicks the week of Oct 9.

**Most likely cause of the Saudi part:** commit `f6a30e6` (2026-09-10, on main the same day) retitled the GCC city pages into the export frame, e.g. Riyadh "Chemical Supplier Riyadh, Saudi Arabia" → "Chemical Supplier Riyadh | Export from Oman to KSA", Jeddah "… Industrial Chemicals Saudi Arabia" → "… Export from Oman to KSA", Dammam lost "KSA". The Saudi drop starts one recrawl later (week of Sep 18), **before** the spam update began (Sep 24). The lost clicks are mostly anonymised queries; the named ones are "near me" / "chemical shop near me" searches in Saudi cities, which we cannot serve locally. Probable, not proven: the spam update overlaps the later weeks.

**Verdict:** the drop the user saw is real in impressions (−17%) but mostly US noise; clicks −3.6%, concentrated in Saudi "near me" traffic to the Saudi city pages; Oman clicks are up and the latest week is the best in 90 days. **Action: none on the homepage.** Optional, low-risk test: put "Saudi Arabia" back into the Riyadh and Jeddah titles while keeping "from Oman" (≤60 chars), then compare Saudi clicks after 3 weeks. Not done without the user's yes, because the export frame was a deliberate decision that wins the "exporter from Oman to Saudi" queries.
