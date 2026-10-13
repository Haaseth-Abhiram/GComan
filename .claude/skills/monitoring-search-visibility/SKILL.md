---
name: monitoring-search-visibility
description: Use when checking whether gcoman.com is #1 across Google, Google Maps, AI Overviews/AI Mode, Bing, ChatGPT, Perplexity, Gemini or Copilot; when the user says a competitor (Oman Chemical, omanchem, Muscat Chemical) shows above us; or for a recurring weekly/monthly SEO, AEO, GEO or Bing Webmaster check.
---

# Monitoring Search Visibility

## Overview

Measure where gcoman.com ranks across **every** engine a buyer uses, record it in a ledger, and turn changes into a short, ranked to-do list. Never report from memory or old notes. Every number must be read live today and labelled with its source.

**Companion skill:** use `checking-seo-health` for deep GSC/GA4/Lovable diagnosis and its false-alarm patterns. This skill is the cross-engine scoreboard.

**Before acting on any finding, read `docs/seo/HANDOFF.md`.** It has the do-not-do list: no bulk FAQs, no mass retitling, no JSRS blog edits, and caution on the homepage. One bad reading never justifies a code change.

## Modes

| Mode | When | Covers | Output |
|---|---|---|---|
| `pulse` | Weekly, or after a deploy | GSC 28d totals + manual actions, Bing clicks + backlinks, Google + Bing for the 4 head queries, Maps (rank + our review count + the #2 listing's count) | One row in each ledger table (unmeasured cells `n/m`); alarms only |
| `full` | Monthly, or when the user asks for an audit | Everything in Quick Reference, plus the `checking-seo-health` routine and the repo gates (`tsc`, sitemap/ar-meta/serp-title verifiers, `audit:product-content`) | Ledger row + republished report artifact |
| `incident` | User says "competitor X is above us" | First reproduce **their exact query, engine, device and location**. Then run `pulse`. | Answer: real or personalisation, and why |

**Incident rule:** ask which engine and which words before concluding anything. "Oman Chemical first" was true on Bing, in ChatGPT, for "oman chemical" and for product terms, and false on Google for "chemical suppliers oman". The answer depends on the engine and the exact query.

## Quick Reference: the fixed panel (do not change between runs, or trends break)

**Queries:**
- Head terms: `chemical suppliers oman`, `chemical suppliers in oman`, `chemical company oman`, `chemical supplier muscat`
- Competitor name: `oman chemical`
- Products: `caustic soda supplier oman`, `poly aluminium chloride supplier oman`
- AI prompt: `Who are the best chemical suppliers in Oman?`

| Engine | URL / method | Gotchas |
|---|---|---|
| Google | `google.com/search?q=…&hl=en`, then JS: `[...document.querySelectorAll('#search a h3')]` → title + `closest('a').hostname` | **The signed-in browser is personalised and shows us #1 when most buyers see #2.** Record both the rendered rank and a fetched rank (`fetch('/search?hl=en&q=…')` + DOMParser), as `1p / 2`. The authority is GSC's 28-day average position for the query. Also expand the AI Overview. |
| Google Maps | `google.com/maps/search/<q>/@23.58,58.38,11z?hl=en`, then `div[role=feed] a[aria-label]` | Muscat viewport. Rank depends on distance. |
| Google AI Mode | `google.com/search?q=…&udm=50&hl=en`, wait 10 s, then regex `^([A-Z][^\n:]{3,60}):` for named companies | JS output is truncated at about 1.5K chars: return compact lists, never raw text |
| Bing | `bing.com/search?q=…&setlang=en`, then `#b_results > li.b_algo` → `h2` + `cite` | ChatGPT and Copilot follow Bing. Treat Bing as a primary engine. |
| ChatGPT | `chatgpt.com`, logged out, type the prompt plus "Search the web." | `?q=` deep links misroute; type into the box instead |
| Perplexity | `perplexity.ai`, signed in as the user | Logged-out view says "Sign up". The input may hold stray clipboard text: select all before typing. |
| Gemini | `gemini.google.com/app`, signed in | Personalised by the user's history; note that in the ledger |
| Copilot | Needs a Microsoft sign-in, so record `n/m` | Use Bing rank + Bing WMT "AI Performance" citations as the proxy |

**Platforms:**

| Platform | Where | Read |
|---|---|---|
| Search Console | `search.google.com/u/1/search-console/...?resource_id=https://gcoman.com/` (match account `globalchemicalsllc8@gmail.com`; the `/u/N` index drifts) | Manual actions, Security, Performance, Pages, Sitemaps, CWV |
| GSC URL params | `num_of_days=7/28/90` only. For ranges over 90 days use `start_date=YYYYMMDD&end_date=…`. Filters: `query=*text` contains, `query=-text` excludes. Add `compare_date=PREV` and `breakdown=page` / `country`. | Set rows per page to 100, then parse `tr` cells into compact lines |
| GSC country filter + URL Inspection | Country filter is the ISO-3 code: `country=OMN` / `ARE` / `SAU` / `QAT` / `KWT` / `BHR`. **URL Inspection cannot be opened by URL** (`inspect?id=…` returns Google's 404 page): click the "Inspect any URL" box at the top, type the URL, press Enter. "Test live URL" and "View crawled page" are buttons on the result; "View crawled page" is greyed out for Soft 404s. The generative-AI report has no stable URL either — click "Generative AI" in the sidebar. | Soft 404 on a page whose live test passes = Google's renderer saw the spinner-only shell (`createRoot` wipes the prerendered HTML until the route chunk loads); the fix is Request indexing, and the list of victims is Pages → Soft 404 |
| Bing Webmaster | `bing.com/webmasters/{home,searchperf,backlinks,aiperformance,sitemaps}?siteUrl=https://gcoman.com/` | Sign-in goes through Google's account chooser, which the browser tool cannot click. Ask the user to sign in. If they are unavailable, record the Bing WMT cells as `n/m`, never as the previous values. |
| GA4 | `analytics.google.com/analytics/web/?authuser=1#/a377840852p516606761/…` | Blind (consent): use for event health only, never for traffic trends |
| Leads | `gcoman.com/admin/contacts` (dated rows, month to date) | Label it "per the admin dashboard". This is the business outcome the rankings exist for. |

## Alarms (stop and diagnose, don't build)

- Lost #1 on Google, or in Maps, for any head term.
- On Bing or ChatGPT, we drop below #3 for "chemical suppliers oman". Being #2 behind omanchem.com is the **standing gap** (2026-10-11): track it every run and report when it closes or widens.
- Bing referring domains fall, or Bing errors are above 0.
- Any GSC manual action or security issue.
- GSC 28d clicks fall below 450, or GSC indexed pages fall below 430. These thresholds come from the HANDOFF baseline (536 clicks, 456 indexed on 2026-09-30).
- CWV poor URLs rise.
- Our Google review count is below the #2 map listing's count (2 vs 10 on 2026-10-11, so this alarm is already active).
- Monthly leads fall below 18 (September 2026 was 27).

## Improvement loop (every run, every mode)

Measuring is half the job. Every run also moves the plan forward.

**The plan lives in `docs/seo/ACTION-PACK.md`** (items B1–B4, F). **Progress lives in the "Action tracker" table** in the ledger. Never invent a new plan in chat. Update these two files.

1. **Verify each open tracker item live.** Never take "done" from memory or from the user's intention.

   | Item | How to verify |
   |---|---|
   | Reviews | Count on the Maps panel |
   | Bing Places | `bing.com/maps?q=Global+Chemicals+LLC+Muscat`: the category must read "Chemical supplier", not "Wholesaler" |
   | Directories | Google `site:omanyp.com "Global Chemicals LLC"`, `site:madeinomangate.com "global chemicals"`, `site:metoree.com gcoman`, `site:dnb.com "Global Chemicals" Oman`. A hit for *Global Chemicals & Maintenance Systems* is the other company and does not count. |
   | Wikidata | `wbsearchentities` API for "Global Chemicals LLC" |
   | Links | Bing WMT → Backlinks, referring domains |
   | Price band | `grep OMR` in the hub pages |

   A new Bing referring domain or a user's "I did it" is a lead, not proof. Mark an item done only after opening our own listing page or getting a `site:` hit that names us.

   **Moving targets:** the review target is always the #2 Maps listing's current count + 1. Restate it in the tracker each run.

   **Dates:** "Judge effect after" is written as an absolute date (done date + lag), never as "+4 weeks".

2. **Map each alarm to its lever.** Don't improvise.

   | Alarm | Lever (ACTION-PACK) |
   |---|---|
   | Google/Bing head term #2 behind omanchem | B3 citations + B4 Wikidata (links, not code) |
   | Maps reviews behind | B2 reviews |
   | Product terms absent | B1 price band, then B3 |
   | Referring domains flat | B3 |

3. **Complete a Claude-owned item when its input exists.**
   - B1 needs the user's price bands.
   - When a listing or a Wikidata item goes live, add its URL to the `sameAs` in `index.html`'s Organization JSON-LD. Each live listing unblocks its own URL, so don't wait for the whole set.
   - After a Publish, run `npm run submit:indexnow`.
   - Code goes to Develop with the CI gates passing, after the user approves.
4. **Hand over each user-owned item as one concrete next step:** link, the text to paste (the NAP block is in `docs/seo/authority-building-kit-2026-09-26.md` §2) and the time it takes. Give one step per item, not the whole list again.
5. **Judge effect only after the lag.** Listings and reviews take 2–6 weeks. Record the done date in the tracker and evaluate it at the first `full` run after the lag.
6. **When the user asks for an on-page fix to win a head term** (more FAQs, a new homepage title, rewrites), decline and give the reason:
   - We are #2 behind omanchem because of off-site links and listings, not page quality.
   - HANDOFF forbids bulk FAQs and retitling.
   - The homepage brings in about 50% of all clicks, so its title and structure are not changed to chase a ranking.

   Then give the user's next tracker step instead.
7. **Revise the plan only on evidence.** New evidence (a competitor's new link source, a new SERP feature) means a new ACTION-PACK item plus a tracker row, checked against HANDOFF's do-not-do list first.

## Implementation

1. Pick the mode. In `incident` mode, get the user's exact query and engine first.
2. Run the panel. For every cell, write the rank and who is #1.
3. Run the improvement loop above and update the Action tracker.
4. Append one row to each table in `docs/seo/visibility-ledger.md`, plus a dated note. Compare with the previous row and name what moved.
5. In `full` mode, republish the report artifact to the **same URL** (the link is in the ledger notes) by calling Artifact with that `url`.
6. Report to the user:
   - the scoreboard
   - what changed since the last run
   - the tracker's status changes
   - the top 3 next steps, each labelled with its owner: **user** (accounts, listings, reviews, sign-ins) or **Claude** (code, on approval)

## Hard limits

These are things Claude cannot do: create accounts, sign in, pass account choosers, submit directory or Bing Places or D&B forms, post GBP updates, or reply to reviews. List them as **user** actions with exact steps. Never claim they were done.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Trusting the signed-in Google page | It said #1 while GSC said average position 2.0–2.3 (2026-10-11). Use GSC as the authority. |
| Fetching Bing in the background | Fetching `bing.com/search` returns unrelated junk results. Navigate to the page and read the rendered results. |
| Checking Google only | Bing drives ChatGPT and Copilot. Always include it. |
| Treating "oman chemical" as a lost ranking | It is the competitor's own name. Track it, but don't chase it. |
| Reporting a personalised AI or Maps answer as universal | State the location and sign-in state for each cell |
| Changing the query panel | Breaks the trend line. Add new queries as extra columns. |
| Prescribing more on-page code by reflex | The site's technical health is strong. The gaps are links, listings, reviews and Bing. Check HANDOFF first. |
| Using a one-off reading as a trend | Act only on alarms or on a move confirmed in two consecutive runs |
