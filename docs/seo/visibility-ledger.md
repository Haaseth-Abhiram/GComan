# Search visibility ledger

One row per run of the `monitoring-search-visibility` skill. Append, never rewrite history.
Rank notation: `1` = first, `2–10` = page-one position, `—` = not in top 10 / not named, `n/m` = not measured.
Personalisation caveat: browser is UAE-located and signed in; Maps/AI answers can differ for a buyer in Barka or Sohar.

## Scoreboard (money queries × engines)

| Date | Mode | G "chemical suppliers oman" | G "chemical suppliers in oman" | G "chemical company oman" | G "chemical supplier muscat" | G "oman chemical" | G "caustic soda supplier oman" | G "poly aluminium chloride supplier oman" | Maps "chemical suppliers oman" | AI Overview (suppliers list) | AI Mode "best chemical suppliers in Oman" | Bing "chemical suppliers oman" | Bing "caustic soda supplier oman" | ChatGPT (logged out) | Perplexity | Gemini | Copilot |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-11 | full | 1 | 1 | 1 | 1 | — | — | — | 1 | 1 | 1 | 2 | 4 | 2 (Oman Chemical 1st) | 1 | — | n/m |
| 2026-10-11 (pm) | pulse | 1p / 2 | 1p / 1 | 1p / 2 | 1p / 3 | 4 | — | — | 1 | n/m | n/m | 2 | 4 | n/m | n/m | n/m | n/m |

## Platform numbers

| Date | GSC clicks 28d | GSC impr 28d | GSC avg pos | GSC pos "chemical supplier(s) in oman" 28d (authority for Google head-term rank) | GSC indexed / not | Non-brand clicks 3mo | Non-brand CTR 3mo | Manual actions | CWV poor URLs | Bing clicks 3mo | Bing referring domains | Copilot citations 3mo | Google reviews (us / #2 map listing) | GA4 users 7d | Leads month-to-date (admin) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-11 | 487 | 9.15K | 8.3 | n/m | 487 / 308 | 121 | 2.2% | None | 58 (LCP >4s) | 169 | 1 (tamol.om) | 1.3K (785 = "jsrs") | 2 / 10 (Green Port) | 22 | n/m (not read this run) |
| 2026-10-11 (pm) | 487 | 9.15K | 8.3 | 2.3 / 2.0 | n/m | n/m | n/m | None | n/m | 313 (WMT default 6-mo view, not comparable to 169) | 1 (tamol.om) | n/m | 2 / 10 (Green Port) | n/m | n/m |

## Action tracker (the plan is docs/seo/ACTION-PACK.md; update status every run)

| # | Action | Owner | Status | Evidence (last verified) | Done date | Judge effect after |
|---|---|---|---|---|---|---|
| B2 | Google reviews → #2 listing's count + 1 (today 11, Green Port has 10), then 20 | user | **open** | Maps panel: 2 reviews (2026-10-11) | | done + 4 weeks (write the date) |
| B3.1 | Claim Bing Places | user + Claude | **done, pending publish** | Imported from Google Business Profile 2026-10-11 (instant verification, weekly Google sync). Primary category "Wholesaler" is locked to Google's "Chemical wholesaler" (Bing has no chemical-supplier category). Added: Laboratory equipment supplier, Cleaning products supplier, Industrial spares & products wholesaler; email; 6 service tags; 4 custom services awaiting Bing approval; LinkedIn fixed to the main page. Bing says publishing takes 7–12 days. | 2026-10-11 | 2026-11-08 (check Bing Maps local results for "chemical suppliers" in Muscat) |
| B3.2 | D&B D-U-N-S (check existing records first) | user | **open** | `site:dnb.com` shows only Global Chemicals & Maintenance Systems (2026-10-11) | | done + 6 weeks (write the date) |
| B3.3 | Made in Oman Gate | user | **open** | Not listed; Muscat Chemical Company (MBBT) is (2026-10-11) | | done + 4 weeks (write the date) |
| B3.4 | Metoree | user | **open** | `site:metoree.com gcoman` → 0 (2026-10-11) | | done + 4 weeks (write the date) |
| B3.5 | OmanYP Basic ($20) | user | **open** | Lists the other company + Oman Chemical Co; not us (2026-10-11) | | done + 4 weeks (write the date) |
| B4 | Wikidata item | user | **open** | `wbsearchentities` "Global Chemicals LLC" → none (2026-10-11) | | done + 4 weeks (write the date) |
| B1 | Indicative price band on the 3 hubs | user decides → Claude builds | **waiting on user's figures** | Hubs carry no OMR price for us (2026-10-11) | | done + 4 weeks (write the date) |
| C1 | Add each new listing / Wikidata URL to Organization `sameAs` | Claude | Bing Places: waiting for its public URL (after publish); others blocked | | | |
| KPI | Bing referring domains 1 → 6+ | — | 1 | Bing WMT (2026-10-11) | | monthly |

## Notes per run

- **2026-10-11 (full)** — Google #1 on all supplier head terms; absent from top 10 on product terms (RXSOL network: omanchem, muscatchemical, rxmarine, rxchemicals hold 4–6 of 10). Bing ranks omanchem.com #1 for "chemical suppliers oman"; ChatGPT mirrors Bing's order. Bing still shows a stale `/sitemap` entry (warning, 0 URLs) and a `www.gcoman.com/sitemap.xml` submission alongside the apex one. Full report: https://claude.ai/artifact/NebA9FcmTy6cYeSeEx943n
- **2026-10-11 pm (pulse) — CORRECTION to the morning row's Google cells.** `1p / 2` = rank in the rendered page of this signed-in browser (`p` = personalised) / rank in a fetched SERP without the browser's rendering. The morning's "1, 1, 1, 1" were the personalised view only. The non-personalised truth is Search Console's 28-day average position: "chemical supplier in oman" **2.3** (134 impr, 2 clicks), "chemical suppliers in oman" **2.0**. So on Google we are #2 behind omanchem.com for most buyers, which matches what the user saw. Treat Google head terms as **#2 and the alarm as active**, not #1. Bing (2, 4), Maps (1; reviews 2 vs 10), referring domains (1), manual actions (none) unchanged. GSC 28d totals identical to the morning (same data day), so no trend yet.
- **2026-10-11 (Bing Places)** — The listing did not exist before: Bing Webmaster Tools ≠ Bing Places. Created via GBP import under globalchemicalsllc8@gmail.com. Found a duplicate misspelled LinkedIn page "Global Chemicalls LLC" (35 followers; the real page has 281) that Google's profile appears to link. Wikidata/Wikipedia: no entity found (wbsearchentities, en/ar Wikipedia search, website-property search); the browser is not signed in to Wikimedia.
