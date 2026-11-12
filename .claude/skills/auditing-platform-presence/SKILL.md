---
name: auditing-platform-presence
description: Use when the user asks whether Google Business Profile, Search Console, GA4, Bing Webmaster, Bing Places, Wikipedia, Wikidata, social profiles or AI search (AIO/GEO) are "correct", "configured" or "maintained" for gcoman.com, or asks for a platform-by-platform status list
---

# Auditing Platform Presence

## Overview

One checklist for every external platform that carries gcoman.com's identity. Each row is checked **live today**, gets a status, and names who fixes it. Rankings live in `monitoring-search-visibility`; deep GSC/GA4 diagnosis lives in `checking-seo-health`. This skill answers "is every platform set up and consistent?"

**Core rule: the website is the source of truth for NAP + hours + coordinates.** Every platform must match it exactly:

| Field | Canonical value |
|---|---|
| Name | Global Chemicals LLC |
| Website | `https://gcoman.com/` (not www, not http) |
| Phone | +968 9277 2305 |
| Address | Office-3, Building 1737, Near Oman LNG, Ghala, Muscat 111, Oman |
| Hours | Sun–Thu 08:00–18:00, Fri–Sat closed |
| Coordinates | 23.5791, 58.3414 (the GBP pin; `index.html` geo + LocalBusiness) |
| Google listing | `https://www.google.com/maps?cid=11905976882639061346` |
| LinkedIn | `https://www.linkedin.com/company/global-chemicals-llc/` |

## Checklist (run every row; never copy a previous status)

| # | Platform | Check | How | Pass |
|---|---|---|---|---|
| 1 | Google Business Profile | Website, phone, hours, category, pending "Google updates", reviews count, last post | Public: open the cid link, JS `a[data-item-id="authority"]` + hours table. Owner: `business.google.com/u/1/locations` (red dot on pencil = pending update) | Matches table; 0 pending updates; post < 30 days; WhatsApp button set to +968 9277 2305 (shown in the local panel since 2026-11) |
| 2 | Google Search Console | Manual actions, security, 28d clicks, indexed pages, sitemap read date, CWV poor URLs | `search.google.com/u/1/search-console?resource_id=https://gcoman.com/` | No issues; clicks ≥ 450; indexed ≥ 430 |
| 3 | GA4 | Key events fire (`contact_click`, `generate_lead_*`), retention 14 mo | Admin → Events, "streams active" | Events fired in last 28d. Never read traffic trends (consent-blind) |
| 4 | Bing Webmaster Tools | Errors, sitemaps, indexed count, backlinks, AI Performance citations | `bing.com/webmasters/*?siteUrl=https://gcoman.com/` (property may be `https://www.gcoman.com/`) | 0 errors; sitemap read < 14 d |
| 5 | Bing Places | Published? NAP matches? | `bingplaces.com` (Google sign-in → account chooser = user) | Live on Bing Maps; matches table |
| 6 | IndexNow | Last submission after last Publish | `npm run submit:indexnow <urls>` | HTTP 200 |
| 7 | Wikipedia | Block status, admin replies awaiting us | `curl` API `list=blocks&bkusers=Global_Chemicals_LLC`; raw talk page tail | No unanswered admin message |
| 8 | Wikidata | Item exists, official website, coordinates, sameAs | Only after the Wikipedia rename | Item live, added to `sameAs` |
| 9 | Social profiles | Each `sameAs` URL resolves and links back to `https://gcoman.com/` | `curl -L` (FB/IG/Crunchbase block curl: open in Chrome) | All 200 + website link correct |
| 10 | Website entity data | `sameAs`, geo, hasMap, hours in `index.html` match the table | grep `index.html`, curl live homepage | Identical to the table |
| 11 | AI search (AIO/GEO) | Brand + head-term answers in Google AI Overview, ChatGPT, Perplexity, Copilot | Panel in `monitoring-search-visibility` | We are named, with correct facts |
| 12 | Directories | Status per site | `project_registration_queue` memory | Queue up to date |

## Output

One table: platform, status (✅ / ⚠️ / ❌ / ⏳ waiting on others), evidence read today, fix, owner (**Claude** or **user**). Append a dated note to `docs/seo/visibility-ledger.md`.

## Hard limits

These are **user-owned** actions. Claude cannot do them, and an auto-mode classifier blocks them even when the user asks:
- GBP edits
- Lovable Publish
- account choosers
- sign-ups
- CAPTCHAs

Prepare everything up to the final click, then hand over exact steps. Never report an edit as done until the **public** view shows it. GBP edits can take up to 3 days to appear.

## Common mistakes

| Mistake | Fix |
|---|---|
| Reporting "done" because the user said so | Verify from the public side (curl, Maps, raw wiki) |
| Writing to a CodeMirror editor via `textarea.value` | It doesn't sync. Click into the editor and type, then screenshot |
| Treating `www.gcoman.com` on GBP as fine | It's a 302 to the apex; set GBP to `https://gcoman.com/` |
| Pressing "Sync" in Bing Places and walking away | Sync copies Google's data over Bing's: it wiped the 3 extra categories and 6 services (2026-10-12). After every sync, re-add: Industrial spares & products wholesaler, Laboratory equipment supplier, Cleaning products supplier; services Raw Materials Wholesaler, Disinfectants, Shipping, Industrial Cleaning, Wholesale Supplier, Delivery |
| Bulk-clicking Bing service chips with JS `.click()` | Only one registers. Click each chip separately |
| Trusting the GBP LinkedIn link | It held a typo (`global-chemicalls-llc`) until 2026-10-12. Read the URL character by character |
| Treating Bing's robots.txt tester "1 error" as a real problem | It is line `License:` (the RSL 1.0 licence directive, P2.13). Unknown directives are ignored; the tester shows Bingbot "Allowed". Leave it |
| Assuming Bing re-read a page after it became indexable | Bing kept `/ar/chemical-supplier/nitric-acid-oman` as "Not indexed due to NOINDEX" from a 10-08 crawl until re-requested on 11-13. After flipping any page to indexable, inspect it in Bing (deep link `urlinspection?siteUrl=…&url=<enc>&urlToInspect=<double-enc>`) and use Request indexing |
| Changing site coordinates to match a directory | The GBP pin is the reference; directories follow the site |
