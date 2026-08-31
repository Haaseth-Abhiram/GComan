---
name: checking-seo-health
description: Use when doing a periodic or ad-hoc SEO health check on gcoman.com — verifying sitemap submission, crawl/index coverage, Search Console query performance, Arabic-vs-English indexing gaps, or a GA4 traffic/conversion swing, especially before or after a deploy.
---

# Checking SEO Health

## Overview

**Four independent systems, checked and reported on separately — never substitute one for another, and never present the admin dashboard's data as if it were a direct Search Console or Analytics check.** The user has explicitly asked for this separation (2026-08-16): "Google Search Console belongs to Google Search Console only, Google Analytics belongs to Google Analytics, Lovable to Lovable, website to website — independently." When reporting, label each finding with which of the four it came from.

1. **Real Google Search Console** (`https://search.google.com/search-console?resource_id=https://gcoman.com/&authuser=2`) — the verified owner is the Google account **`globalchemicalsllc8@gmail.com` ("Global Chemicals LLC")**; the `authuser` index drifts as the Chrome profile's session slots change (it was `2`, then `1` on 2026-08-31 after a re-login — match on the account email, not the index). This is the only source for: Manual actions / Security issues, URL Inspection (live indexing status + "Request Indexing"), Core Web Vitals field data, mobile usability, Removals, and authoritative performance numbers. If the current index stops working, try `authuser=0`, `1`, `2`, `3`... until the property loads under `globalchemicalsllc8@gmail.com`; if every slot bounces to a different account or a password challenge, the owner account is signed out of the Chrome profile entirely — ask the user to sign back in (Claude cannot enter passwords).
2. **Real GA4** (`analytics.google.com`, same `authuser=2` account) — traffic, conversions, event-level diagnosis (Explore, per-event comparisons), Key Events configuration.
3. **Lovable** (`https://lovable.dev/projects/88275aec-3e28-4007-bd65-43d79fa41e87`) — build/publish/deploy status, the actual source of truth for whether code changes are live in production. Pushing to `main` doesn't require Lovable AI credits — that's a separate meter for their in-editor "Ask Lovable" chat feature (the low-credits banner sits directly next to that chat box), not for git-sourced pushes or the Publish action. Every `git push`-sourced commit shows a "Build unsuccessful / Preview is out of date" badge in the sidebar — verified (2026-08-16, via a commit's "Details" view showing the correct diff, and two separate successful Publishes with credits at 1.50 and then 0) that this only means Lovable's live-editing preview iframe doesn't hot-sync from external git pushes; it does **not** reflect the actual production build, which runs fresh on every explicit Publish regardless of that badge or credit balance.
4. **The website itself** (`gcoman.com` — direct `curl`/browser checks against production, not through any dashboard) — confirms what's actually being served right now: titles, redirects, deployment ID headers, rendered content.

**The site's own admin dashboard** (`gcoman.com/admin` — a first-party proxy that mirrors *some* Search Console and Analytics data through the app's own backend) is a **fifth, separate, supplementary tool** — useful for fast day-to-day trend-glancing and for data it uniquely provides (the weekly index-coverage crawler, the AR-vs-EN comparison), but it is **not** Google Search Console and **not** Google Analytics, and must never be reported as either. Only use it when explicitly checking "the admin panel" or when its unique tools (index-coverage crawler, AR/EN comparison) are what's needed — and always say "per the admin dashboard" when citing it, exactly as "per Search Console" or "per GA4" would be said for those.

**Core principle:** a metric that moved is not automatically a real SEO problem, and the admin dashboard's cached classification is not always current. This codebase has three known false-alarm patterns (below) — rule them out before reporting a regression as real. When the admin dashboard and real Search Console disagree, **trust real Search Console — it's live, the admin dashboard's index-coverage data is a cached weekly snapshot.**

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
| Is a specific URL *really* indexed right now (not a cached label)? | Real GSC → URL Inspection | Live indexing status, structured-data validation, "Request Indexing" action |
| Any manual action or security issue on the whole site? | Real GSC → Security & Manual Actions | Binary clean/not-clean — check periodically, high severity if not clean |

## Routine check (run this periodically)

**Report each finding labeled by exact source** — "per Search Console", "per GA4", "per Lovable", "per the live site", or "per the admin dashboard." Never write a finding without one of these labels; never let an admin-dashboard number stand in for a claim about Search Console or Analytics.

0. **The four independent systems, checked directly, not through each other:**
   - **Search Console** (real, `search.google.com`): Manual actions, Security issues — both should read "No issues detected." Performance totals (clicks/impressions/CTR/position) for the period in question.
   - **GA4** (real, `analytics.google.com`): Key events configuration (Admin → Events), traffic/conversion numbers for the period in question.
   - **Lovable** (`lovable.dev/projects/...`): current publish status — does the top bar say "Publish" (idle, nothing pending) or "Updating"? Does the latest commit match what's on `Develop`/`main`?
   - **The website** (`gcoman.com`, direct `curl`/browser — not via any dashboard): does it actually serve what's expected? `curl -sI https://gcoman.com/ | grep x-deployment-id`, spot-check a page's title/content.
1. **Admin dashboard, `/admin/search-console`** (supplementary — label as "per the admin dashboard", not "per Search Console") — note total clicks/impressions/CTR/avg position for 7d and 28d. Open the Sitemaps tab: error count must be 0, and "Last downloaded" should be recent (Google typically re-reads within a week or two — if it's gone stale for a month+, re-submit the sitemap in real Search Console).
2. **Admin dashboard, `/admin/ar-indexing`** — despite the sidebar calling it "Index Coverage" and the route name, this covers **every URL in the sitemap, English and Arabic both** — don't skim only the `/ar/*` rows. The page is long: a dismissable "N pages newly indexed" feed sits above the real summary; scroll (or `get_page_text`) past it to the `Tracked / Indexed / Discovered – not indexed / Check errors` counts. Note the Indexed/Tracked ratio and whether it's trending up. `Check errors` should be 0 or explainable. If "Last run" is more than ~7 days old, click **Run check now**. Scan the URL status table for `Excluded by 'noindex' tag` or `URL is unknown to Google` — but expect a batch of these on `/ar/*` pages that don't yet have Arabic translations (see step 3); that's normal, not a regression. A concerning finding is the *English* pages in this state — flag those.
3. **Admin dashboard, `/admin/seo-languages`** — look for Arabic pages with real impressions but 0 clicks or a very high (>20) average position; per this repo's Arabic SEO model (see `CLAUDE.md`), a page is only eligible to rank once it has `arTitle`/`arDescription` wired through `<SEO>` — a page stuck at 0 clicks with decent impressions may just need that flip. **Its totals won't reconcile exactly with `/admin/search-console`'s totals** (seen: ~14% impression gap over the same 28-day window) — that's a known quirk of the two dashboards querying GSC differently, not a data-integrity bug; don't report the gap itself as a finding.
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
8. **If a specific page is stuck as `Soft 404`/`Error`/`Discovered — not indexed`** in the admin dashboard, don't trust that cached label — **go inspect it live**: real Search Console → URL Inspection → paste the URL. This is the definitive current status, not the admin dashboard's weekly-cached one (confirmed in practice: two pages the admin dashboard showed as "Soft 404" were actually already "Page is indexed" in live GSC — the admin cache just hadn't caught up since a content fix months earlier). Also `git log --follow -- src/data/products/<category>.json` and `git log -- src/pages/ProductDetail.tsx` to check whether a content fix already landed after the coverage tool's last-crawl date, and `curl` the live URL to compare its title/meta/size against a known-healthy page in the same category.
9. Report: what's healthy, what moved, and for anything that moved — whether it's real or a measurement artifact, with the evidence either way.

## Four known false-alarm patterns — check these before reporting a regression

**1. GA4 conversion/lead events undercount real leads.** `submit-contact`/`submit-job-application` save to Supabase, email the team, and push to Zoho CRM entirely independently of GA4 — the GA4 tracking call only fires after that already succeeded, and only if the visitor granted analytics-cookie consent (`src/lib/consent.ts` — deny-all default). A visitor who declines cookies still produces a real lead with zero GA4 signal. **Always cross-check `/admin/contacts` and `/admin/jobs` (real dated rows) for the same date range before concluding leads actually dropped.**

**2. A GA4 event can blend two unrelated funnels.** Historically `generate_lead` fired for both the Contact form and the Career form (now split into `generate_lead_contact` / `generate_lead_career` — verify both are still marked as Key Events in GA4 Admin → Events if investigating lead-volume anomalies). A viral spike in job applications can make the *combined* metric swing wildly with zero change in real sales leads. When diagnosing any single blended-sounding event, break it out by source in GA4 Explore before trusting the aggregate.

**3. Every product page's "Product snippets" validator shows "1 invalid item detected" — this is intentional, not a bug.** `src/components/StructuredData.tsx:60-64` documents it: pricing isn't published (quote-based B2B sales), so `offers` is deliberately omitted from the Product schema. A prior attempt to include `offers` without a price triggered a worse GSC error ("missing lowPrice"). Dropping `offers` entirely removes that error while keeping the page indexed normally — the trade-off is losing rich-result eligibility (star/price in SERP), not indexing. Only worth revisiting if the business wants to publish prices or start collecting genuine third-party reviews (there's already a dormant `ReviewStructuredData` component that would supply `aggregateRating` if `reviews.length > 0`).

**4. `(none)`-medium desktop traffic is bot noise, not a real audience swing.** Diagnosed 2026-08-19, widened 2026-08-20: `First user medium` exactly `(none)` AND `Device category` exactly `desktop` — with no country restriction — is ~91% of the site's *entire* reported GA4 traffic, with a 100/0 desktop/mobile split (real visitors never split that cleanly). Originally scoped to `Country` exactly `United States` (~85%), but France showed the identical shape, so the country condition was dropped — it isn't US-specific, it's any-country unattributed desktop. For a niche Oman/GCC B2B chemical distributor, that combination is a textbook automated/monitoring-crawler signature (data-center IPs, headless clients reporting as desktop), not real prospects. A GA4 Audience and Comparison named **"Suspected bot traffic (unattributed desktop)"** carry exactly these two conditions (Admin → Data display → Audiences / Comparisons) — add the Comparison alongside "All Users" in any Report/Explore to see the bot segment's share directly, and treat `All Users total − this segment` as the real traffic figure. (The original US-only pair is still present but superseded — GA4 audience archiving is irreversible so it was left in place rather than deleted; don't use it for new checks.) Before reporting any headline traffic dip as real, break it down by `First user medium` × `Device category` (and `Country`, to sanity-check it isn't newly concentrated somewhere) and check whether this same segment is driving it — it was the entire explanation for an apparent 20% MoM traffic drop that turned out to have flat-to-up real signals underneath (Oman organic +2.5%, `contact_click` +10.3%).

**Also expected, not a bug:** legacy redirects run client-side (`src/lib/legacyRedirects.ts`), so `curl`/`verify:seo-routing` will show `200` for a legacy URL instead of a `301` — confirm those in an actual browser, not curl.

## GA4 direct access (when the admin dashboard isn't enough)

- Property URL: `https://analytics.google.com/analytics/web/?authuser=2#/a377840852p516606761/reports/intelligenthome` (the `authuser=2` index may drift if the Google account's session slots change — if it redirects to `/provision` or a blank property picker, wait for the automatic authuser bounce, or manually try `authuser=0`, `1`, `2`... until the `Global Chemicals LLC` property loads).
- Home dashboard: Active users / Total users / Key events / Event count, each with a 30-day trend and industry-peer comparison band.
- **Admin → Data display → Events**: the definitive list of what's configured as a Key Event and whether it has fired in the last 28 days. Check this first whenever a "Key events" number looks wrong.
- **Explore → Free form**: drag `Event name` into Rows, enable **Compare: Previous period** in the date picker, remove `Device category` from Columns to simplify — this gives an exact per-event current-vs-previous breakdown, which is how the two false-alarm patterns above get diagnosed in practice.
- Reports → Search Console (Queries / Google organic search traffic) — GA4's own linked GSC view; cross-check its numbers against `/admin/search-console`'s (they should roughly agree; large divergence suggests a linking or date-range mismatch).

## Direct Search Console access (when the admin dashboard isn't enough)

- Property URL: `https://search.google.com/search-console?resource_id=https://gcoman.com/&authuser=2` — same account/authuser pattern as GA4.
- **URL Inspection** (sidebar): paste any URL to get its *live* status, not a cached one. Shows a "REQUEST INDEXING" action for pages that need a manual recrawl push (e.g., after fixing content that was previously thin/soft-404). Expand "Product snippets" under Enhancements & Experience to see structured-data validation detail per page.
- **Manual actions** / **Security issues** (sidebar, under "Security & Manual Actions"): binary clean/not-clean checks, worth a periodic glance — a manual action or security issue is a much bigger deal than any indexing nuance and would otherwise go unnoticed.
- **Core Web Vitals**, **HTTPS**, **Removals**, **Pages**, **Sitemaps**: all under the standard GSC sidebar, self-explanatory.
- Google's own **Indexing** overview counts (Overview page) differ from the admin dashboard's — GSC's count spans every URL Google has ever discovered for the domain (including old/legacy ones outside the current sitemap), while the admin dashboard only tracks current sitemap URLs. A gap between the two is expected, not a data-integrity problem.
