---
name: checking-seo-health
description: Use when doing a periodic or ad-hoc SEO health check on gcoman.com — verifying sitemap submission, crawl/index coverage, Search Console query performance, Arabic-vs-English indexing gaps, or a GA4 traffic/conversion swing, especially before or after a deploy.
---

# Checking SEO Health

## Overview

gcoman.com has two SEO data sources, checked in this order:

1. **The site's own admin dashboard** (`gcoman.com/admin`) — pre-authenticated, first-party GSC proxy + a self-hosted weekly index-coverage crawler. No separate Google login. **Always check this first.**
2. **GA4 directly** (`analytics.google.com`) — only needed for event-level debugging (Explore, per-event comparisons) that the admin dashboard doesn't expose. Requires a Google login in Chrome; the account picker may bounce through `authuser=0`, `authuser=1`, `authuser=2` before landing on the one with property access — that redirect is normal, not a sign of failure.

**Core principle:** a metric that moved is not automatically a real SEO problem. This codebase has two known measurement traps (below) — rule them out before reporting a regression as real.

## Quick Reference — where to look

| Question | Where | What you'll see |
|---|---|---|
| Is the sitemap submitted and being read? | `/admin/search-console` → Sitemaps tab | Submitted URL count, last-downloaded date, error count |
| Clicks/impressions/CTR/position trending? | `/admin/search-console` | Total clicks/impressions/CTR/avg position, daily chart, 7d/28d/3mo/12mo toggle |
| Top queries / pages / countries / devices? | `/admin/search-console` → Breakdown tabs | Ranked tables |
| How much of the sitemap is actually indexed? | `/admin/ar-indexing` ("Index Coverage" in sidebar) | Tracked / Indexed / Discovered-not-indexed / Check-errors counts + full per-URL table, filterable |
| Which URLs need attention right now? | `/admin/ar-indexing` → "Run check now" | Triggers a fresh weekly-style check; newly-indexed pages surface as a dismissable feed |
| Is the Arabic version of a page underperforming? | `/admin/seo-languages` ("AR vs EN SEO") | EN vs AR page-by-page clicks/impressions/position side by side |
| Did a real conversion/lead swing happen? | Admin panel `/admin/contacts` and `/admin/jobs` (raw dated rows) | Ground truth — count real submissions in the date range, don't trust a percentage alone |
| Deep event-level GA4 diagnosis | `analytics.google.com` → Explore → Free form, `Event name` row + `Compare: Previous period` | Per-event current-vs-previous counts |
| Are events even firing / correctly marked as Key Events? | GA4 Admin → Data display → Events | Each event's "Streams active in last 28 days" — "No stream data detected" means it's configured but has never fired |

## Routine check (run this periodically)

1. **`/admin/search-console`** — note total clicks/impressions/CTR/avg position for 7d and 28d. Open the Sitemaps tab: error count must be 0, and "Last downloaded" should be recent (Google typically re-reads within a week or two — if it's gone stale for a month+, re-submit the sitemap in real Search Console).
2. **`/admin/ar-indexing`** — despite the sidebar calling it "Index Coverage" and the route name, this covers **every URL in the sitemap, English and Arabic both** — don't skim only the `/ar/*` rows. The page is long: a dismissable "N pages newly indexed" feed sits above the real summary; scroll (or `get_page_text`) past it to the `Tracked / Indexed / Discovered – not indexed / Check errors` counts. Note the Indexed/Tracked ratio and whether it's trending up. `Check errors` should be 0 or explainable. If "Last run" is more than ~7 days old, click **Run check now**. Scan the URL status table for `Excluded by 'noindex' tag` or `URL is unknown to Google` — but expect a batch of these on `/ar/*` pages that don't yet have Arabic translations (see step 3); that's normal, not a regression. A concerning finding is the *English* pages in this state — flag those.
3. **`/admin/seo-languages`** — look for Arabic pages with real impressions but 0 clicks or a very high (>20) average position; per this repo's Arabic SEO model (see `CLAUDE.md`), a page is only eligible to rank once it has `arTitle`/`arDescription` wired through `<SEO>` — a page stuck at 0 clicks with decent impressions may just need that flip. **Its totals won't reconcile exactly with `/admin/search-console`'s totals** (seen: ~14% impression gap over the same 28-day window) — that's a known quirk of the two dashboards querying GSC differently, not a data-integrity bug; don't report the gap itself as a finding.
4. **Verify every product is actually submitted for crawling** (don't just eyeball the dashboards — cross-check the real data). Run:
   ```bash
   python3 - <<'EOF'
   import json, re, glob
   products = []
   for f in glob.glob('src/data/products/*.json'):
       category = f.split('/')[-1].replace('.json', '')
       with open(f) as fh:
           for p in json.load(fh):
               products.append((category, p['id']))
   with open('public/sitemap.xml') as fh:
       sitemap = fh.read()
   sitemap_urls = set(re.findall(r'<loc>(https://gcoman\.com/products/[^<]+)</loc>', sitemap))
   missing = [f"https://gcoman.com/products/{c}/{p}" for c, p in products if f"https://gcoman.com/products/{c}/{p}" not in sitemap_urls]
   print(f"{len(products)} products in data files, {len(missing)} missing from sitemap")
   for m in missing: print(" -", m)
   EOF
   ```
   Any product in the data files but not in `sitemap.xml` was never submitted to Google at all — that's a bigger problem than a slow-to-index page, since it means Google was never told the URL exists. (Sanity check: as of 2026-08, the real count is **270 products**, not the "~768" `CLAUDE.md` currently claims — that figure is stale documentation, not a live discrepancy; don't be alarmed if your count differs from 768.)
5. **If something looks like it moved a lot** (a metric up/down double digits %), don't report it yet — go to Step 6.
6. **Rule out the two known false-alarm patterns** before treating any swing as real (see below).
7. **If tied to a recent deploy**, run the local verification scripts against production: `npm run verify:prerender-titles` and `npm run verify:seo-routing` (see `CLAUDE.md` "Verification commands").
8. **If a specific page is stuck as `Soft 404`/`Error`/`Discovered — not indexed`**, don't assume it's still broken — `git log --follow -- src/data/products/<category>.json` and `git log -- src/pages/ProductDetail.tsx` to check whether a content fix already landed after the coverage tool's last-crawl date, then `curl` the live URL and compare its title/meta/size against a known-healthy page in the same category. GSC's classification can lag real content fixes by weeks; a page with good live content and an old "Last crawl" date is very likely just waiting on Google's next re-evaluation, not indicating a current defect.
9. Report: what's healthy, what moved, and for anything that moved — whether it's real or a measurement artifact, with the evidence either way.

## Two known false-alarm patterns — check these before reporting a regression

**1. GA4 conversion/lead events undercount real leads.** `submit-contact`/`submit-job-application` save to Supabase, email the team, and push to Zoho CRM entirely independently of GA4 — the GA4 tracking call only fires after that already succeeded, and only if the visitor granted analytics-cookie consent (`src/lib/consent.ts` — deny-all default). A visitor who declines cookies still produces a real lead with zero GA4 signal. **Always cross-check `/admin/contacts` and `/admin/jobs` (real dated rows) for the same date range before concluding leads actually dropped.**

**2. A GA4 event can blend two unrelated funnels.** Historically `generate_lead` fired for both the Contact form and the Career form (now split into `generate_lead_contact` / `generate_lead_career` — verify both are still marked as Key Events in GA4 Admin → Events if investigating lead-volume anomalies). A viral spike in job applications can make the *combined* metric swing wildly with zero change in real sales leads. When diagnosing any single blended-sounding event, break it out by source in GA4 Explore before trusting the aggregate.

**Also expected, not a bug:** legacy redirects run client-side (`src/lib/legacyRedirects.ts`), so `curl`/`verify:seo-routing` will show `200` for a legacy URL instead of a `301` — confirm those in an actual browser, not curl.

## GA4 direct access (when the admin dashboard isn't enough)

- Property URL: `https://analytics.google.com/analytics/web/?authuser=2#/a377840852p516606761/reports/intelligenthome` (the `authuser=2` index may drift if the Google account's session slots change — if it redirects to `/provision` or a blank property picker, wait for the automatic authuser bounce, or manually try `authuser=0`, `1`, `2`... until the `Global Chemicals LLC` property loads).
- Home dashboard: Active users / Total users / Key events / Event count, each with a 30-day trend and industry-peer comparison band.
- **Admin → Data display → Events**: the definitive list of what's configured as a Key Event and whether it has fired in the last 28 days. Check this first whenever a "Key events" number looks wrong.
- **Explore → Free form**: drag `Event name` into Rows, enable **Compare: Previous period** in the date picker, remove `Device category` from Columns to simplify — this gives an exact per-event current-vs-previous breakdown, which is how the two false-alarm patterns above get diagnosed in practice.
- Reports → Search Console (Queries / Google organic search traffic) — GA4's own linked GSC view; cross-check its numbers against `/admin/search-console`'s (they should roughly agree; large divergence suggests a linking or date-range mismatch).

## Future links

If given a direct Google Search Console URL (`search.google.com/search-console/...`) later, prefer it for anything not exposed in the admin panel — manual URL Inspection, Removals, Manual Actions/Security Issues, Core Web Vitals field data, mobile usability. Add the property URL here once provided.
