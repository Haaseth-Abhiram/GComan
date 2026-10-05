# Systematic SEO/traffic audit — 2026-10-05

Every source checked **directly and separately** and labelled. Where two sources disagree, the disagreement is named rather than averaged.

---

## A. The checklist

| # | Check | Source | Result |
|---|---|---|---|
| 1 | Manual actions | Search Console | ✅ None |
| 2 | Security issues | Search Console | ✅ None |
| 3 | Indexed pages | Search Console | ✅ 456, flat |
| 4 | Clicks / impressions / position, 28d | Search Console | ✅ 508 / 9.96K / 8.7 — position improving |
| 5 | Homepage share | Search Console | ✅ 250 clicks, ~49% |
| 6 | Product pages vs prior 28d | Search Console | ✅ clicks +11%, CTR +52%, position +4.8 |
| 7 | Bing indexed / errors | Bing WMT | ✅ 555 / 0 errors |
| 8 | Bing referring domains | Bing WMT | ❌ **1 — unmoved** |
| 9 | Sitemap crawled | Bing WMT | ✅ 657 URLs, crawled 10/3 |
| 10 | IndexNow working | Bing WMT | ✅ 657 submitted (banner is a false alarm) |
| 11 | Lead path code touched? | git diff | ✅ No — zero conversion files changed |
| 12 | Contact form live | live site | ✅ 200, form present, indexable |
| 13 | Lead volume | admin raw rows | ✅ +8 this week (~1.1/day vs Sep 0.9) |
| 14 | Mobile performance | Search Console | ✅ Mobile CTR 5.9% > desktop 4.7% |
| 15 | GA4 measurement integrity | GA4 vs GSC | ❌ **sees ~6.5% of visitors** |
| 16 | **Admin dashboard integrity** | **source code** | ❌ **analytics are synthetic — see B1** |
| 17 | Regional mix | Search Console | ⚠️ 20% of clicks are non-commercial — see B2 |
| 18 | UAE performance | Search Console | ⚠️ 3.7% CTR vs Oman's 9.0% — see B3 |
| 19 | AI-referred traffic | GA4 | ⭐ best-engaging channel on the site — see B4 |

---

## B. Findings

### B1. CRITICAL — the admin dashboard's analytics are generated, not measured

`supabase/functions/refresh-analytics/index.ts` **fabricates** every traffic number the dashboard displays. Verified line by line:

| Dashboard figure | How it is actually produced |
|---|---|
| "Total Visitors 3,707" | `baseDaily = max(8, totalSubmissions × 2.5)`, summed over 30 days |
| Daily traffic curve | `noise = 0.8 + ((i × 37) % 40) / 100` — a deterministic formula that makes a flat line *look* organic |
| "Bounce Rate 56.5%" | `45 + ((i × 17) % 25)` — arithmetic, never measured |
| Top pages | fixed ratios of the invented total (`/` = 32%, `/products` = 28%, …) |
| "Organic Search 51% +12%" | **hardcoded constants**, including the trend strings `+12% / +5% / −2% / +18%` |
| Device split 58/35/7 | **hardcoded array** |
| Country breakdown | derived from `download_leads` — of which there are **4 in total**; if empty, falls back to hardcoded Oman 62 / UAE 16 / Saudi 10 / Qatar 6 |

**What is real on that page:** the submission counts and their dated rows — Contact Forms 147, Job Applications 406, Download Leads 4, and the Recent Activity feed. Those come from actual database rows.

**Everything else is decoration.** The headline cards, the traffic chart, the bounce rate, the conversion rate, the traffic-source split and the device donut are all computed from the submission count or hardcoded.

**Why this matters more than any ranking issue:** business decisions have been taken while looking at this screen. "Visitors +1.1%", "Organic Search 51%", "Social +18%" are not weak data — they are not data. And the fabricated numbers are plausible enough to never look wrong.

**Correction to my own 2026-10-05 report:** I cited "conversion rate +13.3%" as supporting evidence that leads were healthy. That figure comes from this synthetic layer and should not have been used. The conclusion is unaffected — it rests on the raw dated rows (147 total, +8 this week), which are real.

**Recommendation — pick one, do not leave it as is:**
- **(a) Label it.** Fastest, zero risk: relabel the four headline cards as "Estimated" and remove the fake trend percentages, so nobody reads them as measurements.
- **(b) Wire it to real data.** Replace the synthetic block with the Search Console figures the dashboard *already* fetches elsewhere (it has a working `search-console` edge function and a `SearchConsoleDashboard` component). Real clicks/impressions/CTR/position, no invention.
- **(c) Remove the cards.** Keep the lead tables, drop the fictional analytics entirely.

**(b) is the right answer**, and it is additive — no change to the public site, so it cannot affect SEO or lead capture. It does require an edge-function deploy, which does **not** ship on a Lovable Publish.

---

### B2. One fifth of organic traffic is the name collision, not customers

**Per Search Console**, 28 days, by country:

| Country | Clicks | Impressions | CTR |
|---|---|---|---|
| **Oman** | **201** | 2,245 | 9.0% |
| **India** | **100** | 862 | 11.6% |
| Saudi Arabia | 48 | 650 | 7.4% |
| UAE | 35 | 951 | **3.7%** |
| Pakistan | 14 | 366 | 3.8% |
| Iran | 11 | 61 | 18.0% |
| Egypt | 9 | 247 | 3.6% |

India is the **#2 source at 20% of all clicks**. Its top queries are almost entirely brand lookups — and largely for the *other* company:

> `global chemicals and maintenance systems llc` 13 · `global chemicals llc oman` 8 · `global chemicals llc` 5 · `global chemicals & maintenance systems llc` 3 · `global chemical llc` 3 · `gc oman` 2

**Zero product queries. Zero buying intent.** Of 46 India queries, exactly two have commercial intent (`chemical supplier in oman` 1 click, `distributor in oman` 1 click).

GA4 corroborates the shape: India shows **8m23s** average engagement and 2.3 sessions per user — deep reading, no enquiries. That is research or job-seeking behaviour, consistent with an O&M contractor's workforce, not a chemical buyer.

**Implication:** headline click counts overstate commercial demand by roughly a fifth. When judging whether SEO is "working", measure **Oman + GCC clicks**, not the total. It also puts a number on the collision: ~17–20 clicks in 28 days, from India alone, going to a competitor's name. **This is the strongest evidence yet that D&B registration and the directory citations are the right priority** — they attack exactly this.

---

### B3. UAE is the clearest commercial opportunity on the site

UAE produces **951 impressions — second only to Oman — but converts at 3.7%**, against Oman's 9.0% and Saudi's 7.4%. If UAE reached even Saudi's CTR it would add roughly 35 clicks a month from traffic that is **already being served**.

High impressions with low CTR means Google is showing the pages and users are not choosing them — a title/snippet relevance problem on a country hub, not a ranking problem. `/chemicals/uae` exists and is translated.

This is the single best *on-site* opportunity found in this audit, and it is low-risk: snippet work on one hub page, not a bulk retitle. **Do not act during the watch window** — queue it for after 27 Oct, measured against this 3.7% baseline.

---

### B4. AI-referred traffic is the best-engaging channel on the site

**Per GA4** (consenting sample, 144 sessions):

| Channel | Sessions | Engagement rate | Avg time | Events/session |
|---|---|---|---|---|
| Organic Search | 100 | 55% | 1m04s | 5.50 |
| Direct | 24 | 62.5% | 1m03s | 5.42 |
| **AI Assistant** | **8** | **75%** | **1m14s** | **8.13** |
| Referral | 6 | 66.7% | 16s | 4.17 |
| Organic Social | 1 | 0% | 3s | 4.00 |

**AI Assistant leads every engagement metric** — highest engagement rate, longest sessions, 48% more events per session than organic search. Small volume, but it is the highest-intent traffic arriving.

This is independent validation of the GEO programme: the AI work is not just producing citations, it is producing the site's **best visitors**. Worth protecting and worth continuing — and it argues for the JSRS-pattern replication already queued as conditional work.

Also visible: **Organic Social is 1 session** and Referral is 6 — the latter consistent with Bing's 1 referring domain.

---

## C. What this changes, and what it does not

**Unchanged:** the site is healthy, nothing we shipped harmed it, leads are running ahead of September, and the watch window continues to 27 Oct. No SEO emergency exists.

**Changed:** we now know that one of the five sources — the admin dashboard — has been reporting fiction, and that a fifth of headline traffic is non-commercial. Both make the site look busier than it commercially is, in different ways.

**Priority order from here (all additive, none affects lead capture):**

1. **Fix the admin dashboard** (B1, option b). Highest value: it is the screen that gets looked at daily, and it is wrong. Backend-only, invisible to crawlers and customers.
2. **The six citations** — unchanged as the #1 business lever, now with B2 as fresh evidence for why D&B matters.
3. **After 27 Oct: UAE snippet work** (B3) against the 3.7% baseline.
4. **After 27 Oct: replicate the JSRS pattern** (B4) — AI traffic earns its keep.
5. **Consent Mode v2** (user decision, deferred) — to make GA4 usable at all.

**Explicitly still not doing:** more bulk FAQs, more retitling, homepage or JSRS edits, programmatic pages.
