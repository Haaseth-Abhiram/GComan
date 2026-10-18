---
name: running-search-operations
description: Use when the user asks to keep working on gcoman.com SEO / AEO / GEO continuously, to "check Google and Bing for every location", run the daily/weekly search-operations cycle, verify every location and hub page after a Publish, or when a scheduled search-operations run fires
---

# Running search operations (the continuous cycle)

## Overview

One procedure, run on a fixed cadence, that covers **every location page, every product hub and every engine** without guessing. It orchestrates the existing skills; it does not replace them:

| Skill | Role in this cycle |
|---|---|
| `monitoring-search-visibility` | Head-term scoreboard + AI engines (its fixed panel and Chrome mechanics) |
| `checking-seo-health` | GSC / GA4 / Lovable deep diagnosis when an alarm fires |
| `number-one-plan` | The work queue (`docs/seo/MASTER-PLAN.md`): what to build or submit next |
| `verifying-seo-pipeline` | Post-build / post-deploy checks |

**Core principle: measure with scripts first, read engines second, change code last.** A ranking reading never directly causes a code change. Code changes come from the plan, after the HANDOFF check.

## Before every run (2 min, never skip)

1. `curl -sI https://gcoman.com/ | grep x-deployment-id`, plus `git log --oneline origin/main..Develop`: is production current?
2. Read the last 5 rows of `docs/seo/location-ledger.md` and the latest notes in `docs/seo/visibility-ledger.md`.
3. Read **Next up** in `docs/seo/MASTER-PLAN.md` and the do-NOT-do list in `docs/seo/HANDOFF.md`.

## Cadence

| When | Run | Time |
|---|---|---|
| **Daily** (Sun–Thu, Oman working days) | `verify:live-pages` → GSC indexing quota → Google location batch (`--batch=today`) | ~30 min |
| **Weekly** (Sunday) | Daily steps + Bing full panel (41) + Maps (6 Oman viewports) + `monitoring-search-visibility` `pulse` + AI engines (nitric + Oman prompts) | ~90 min |
| **Monthly** (first Sunday) | Weekly steps + `monitoring-search-visibility` `full` + GEO re-score (`docs/seo/GEO-ANALYSIS.md`) + `audit:product-content` | half day |
| **After every Publish** | The post-Publish checklist below, before anything else | 20 min |

## Step 1: machine checks (no browser, run first)

```bash
npm run verify:live-pages            # 64+ location/hub pages as GPTBot sees them; any FAIL = incident
npm run verify:llms-txt              # llms.txt lists every hub + location
node scripts/sync-sitemap-lastmod.mjs --check   # needs full git history; fails on stale or unmapped lastmod
```

A `FAIL` on a live page is the top priority: homepage title leaking, wrong canonical, missing hreflang, invisible FAQ, or a missing city name. Diagnose it with `verifying-seo-pipeline` before any ranking work, because a broken page makes its rank reading meaningless.

## Step 2: Search Console (signed-in Chrome, owner account)

Account `globalchemicalsllc8@gmail.com`, property `https://gcoman.com/` (URL-prefix). URL Inspection works **only through the top search box**; `inspect?id=` URLs return a 404.

1. **Request indexing, about 10 per day.** Take URLs in the order of `MASTER-PLAN.md` P0.3. Inspect each first: skip "URL is on Google", request the rest. "Quota exceeded" means stop for the day and write that in the log.
2. Weekly: Pages report counts (indexed / not indexed / Soft 404 / crawled-not-indexed / discovered-not-indexed), Manual actions, Sitemaps status.

## Step 3: per-location engine sweep

Get the checks from the panel script. It derives them from the site, so new cities and hubs join automatically:

```bash
npm run -s panel:locations                              # summary: 41 checks
npm run -s panel:locations -- --engine=google --batch=today
npm run -s panel:locations -- --engine=bing
npm run -s panel:locations -- --engine=maps
```

**Google** (≤25 per day, never more, or you get a CAPTCHA and lose the day):

```js
// in a google.com tab: fetch, so results are unpersonalised (pws=0) and don't navigate
const q = '<url from panel>';
const doc = new DOMParser().parseFromString(await (await fetch(q.replace('https://www.google.com',''))).text(), 'text/html');
if (doc.querySelector('form#captcha-form, #recaptcha')) 'CAPTCHA — stop';
else [...doc.querySelectorAll('#search a h3')].map((h, i) => `${i+1} ${h.closest('a').hostname.replace('www.','')} ${new URL(h.closest('a').href).pathname}`).slice(0, 20).join('\n')
```

Space fetches 4–6 s apart. At the first CAPTCHA, stop Google for the day and write `captcha` in the remaining cells.

**Bing**: navigate to each URL and read the rendered page. Background fetches return junk results.

```js
[...document.querySelectorAll('#b_results > li.b_algo')].map((li, i) => `${i+1} ${li.querySelector('cite')?.textContent.slice(0,60)}`).slice(0,10).join('\n')
```

**Maps** (Oman viewports only): navigate, wait 4 s, then read `[...document.querySelectorAll('div[role=feed] a[aria-label]')].map(a=>a.getAttribute('aria-label')).slice(0,20)`. Our listing is "Global Chemicals LLC".

**AI engines** (weekly, panel unchanged): `monitoring-search-visibility` covers ChatGPT (logged out), Perplexity (signed in), Google AI Mode (`udm=50`) and the AI Overview. Use these prompts: "Who are the best chemical suppliers in Oman?" and "best nitric acid supplier in Oman". Record whether we are named, our position, and the first-named company.

### Reading a result: the four facts per cell

| Field | Rule |
|---|---|
| Our rank | Position of the first `gcoman.com` result, organic only, or `—` if absent from the top 20 (Google) / top 10 (Bing) |
| Our URL | **Which** gcoman page ranks. If it isn't the panel's target page, write it in the notes: the wrong page ranking is a finding (cannibalisation or a missing internal link) |
| #1 | Domain in position 1 |
| State | `pws=0 gl=XX` (Google), `cc=XX` (Bing), viewport (Maps), and sign-in state (AI) |

Never write a number you didn't read today. If something wasn't measured, write `n/m`.

## Step 4: record (append-only)

Append one row per check to `docs/seo/location-ledger.md`:

`| date | engine | query | target page | our rank | our URL (if not target) | #1 domain | state |`

Then add a dated note to `docs/seo/visibility-ledger.md`: what moved compared with the previous reading of the **same cell**. Never rewrite earlier rows.

## Step 5: decide (the mistake filter)

| Observation | Action |
|---|---|
| Live-page FAIL | Fix it now (code → Develop → gates → ask/Publish per authorisation) |
| Rank moved once | Nothing. Note it. One reading is noise |
| Same move in 2 consecutive readings of the same cell | Map it to its lever (see the `monitoring-search-visibility` improvement loop) |
| Wrong gcoman URL ranking for a target | Check internal links to the target (`audit:internal-links`) before any copy change |
| Absent everywhere for a country | Off-site lever (the country directories that hold #1, MASTER-PLAN P5.5), not a new page |
| New page idea | Only through MASTER-PLAN, after the HANDOFF check. No product × city pages, no bulk FAQs, no retitling |

## Post-Publish checklist (in this order)

1. `x-deployment-id` changed and is the build you expect.
2. `npm run verify:live-pages -- --strict-modified` passes (from the 2026-10-18 build on, a missing `dateModified` fails the run).
3. `npm run verify:seo-routing` (legacy 301 checks show as 200 client-side; that is expected).
4. `npm run submit:indexnow` (HTTP 200).
5. New URLs: Bing Webmaster → URL Submission; GSC → request indexing (counts against the daily quota); sitemap resubmit if the URL count changed.
6. Ledger note with the deploy id.

## Authority and limits

- Code goes to **Develop** with all gates green (`npx tsc -b && npm run lint && npm run verify:sitemap-health && npm run verify:ar-meta && npm run verify:serp-titles && npm run verify:llms-txt && npm run test:e2e`).
- Merge to `main` + Publish only on the user's explicit in-session instruction (CLAUDE.md, Branch workflow).
- Never create accounts, sign in, or submit directory or listing forms. Those are user actions, handed over as one concrete step each (`number-one-plan`).
- Edge-function changes do **not** ship on Publish (CLAUDE.md, Commands).

## Common mistakes

| Mistake | Fix |
|---|---|
| Reading the signed-in, personalised Google page | Use the fetch with `pws=0`. Cross-check head terms against the GSC 28-day position |
| More than 25 Google searches in a day | Batches exist for this. A CAPTCHA costs the rest of the day's Google reads |
| Bing via fetch | Navigate and read the rendered page |
| Counting the other company (Global Chemicals **& Maintenance Systems**) as us | Only the `gcoman.com` hostname counts |
| Treating "absent from the top 20 in Egypt" as a failure | Iraq, Jordan and Egypt are export-only lanes. Record them, but they are not targets |
| A parser picking up `<path>` as `<p>` (it happened on 2026-10-18) | Match `<p(\s\|>)`. Sanity-check any surprising number against the rendered page before reporting it |
| Reporting a fix as live after a Publish when it was an edge function | Check Lovable → Cloud → Edge functions → "Last updated" |
