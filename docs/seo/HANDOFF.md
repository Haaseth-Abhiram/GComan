# SEO/GEO Handoff — state as of 2026-09-30

> **Update 2026-10-01 (day 1 of the watch):** all alarms clear — manual actions *None*, Bing errors *0*, clicks 533 / impressions 10.4K / position 8.7 / homepage 264 / Google indexed 456, gates + 77/77 e2e green. **One correction to §1 below: production is NOT current.** `8b06c5e` (markdown tables) is merged to `main` but unshipped — prod still serves the 09-30 build and renders two tables as raw pipe text on the MEG/DEG blog. Needs a Lovable Publish, no code.
>
> **Update 2026-10-05 (day 5):** the Publish happened — deploy is now `psr2.c7119f35…` and the MEG/DEG blog serves **2 real `<table>`s / 19 rows, zero raw pipe junk**, matching local verification. The day-1 correction above is resolved; §1 is accurate again. All alarms still clear, two metrics *improved*. Full table in §5a.

**Read this first in a new session.** Then `docs/seo/strategy-and-watch-2026-09-30.md` (the restraint plan + baseline numbers) and `docs/seo/citation-execution-plan-2026-09-30.md` (the user's own task list).

---

## 1. State: everything is shipped, green, and verified

| | |
|---|---|
| Git | `main` == `8b06c5e`; `Develop` ahead by docs commits only |
| Production | deploy `psr2.c7119f35…` — **current with `main`**, homepage 200, sitemap **657 URLs** |
| Gates | tsc · lint · prerender-titles · serp-titles · sitemap-health · ar-meta all clean; **77/77 e2e** |
| Scope shipped | 35 commits since `5e2f873` |

**There is no unfinished code task.** Do not go looking for one.

---

## 2. The single most important instruction

> *"All expectations should not affect our existing SEO leads creation and everything."* — the user, standing constraint

September was a **record month: 27 leads, +50% MoM** (OQBI, NOV, Alba Bahrain, Oman Textile Mills). A large change set just went live. **The correct posture until ~7 Oct is measure, not build.**

When in doubt: do nothing and report. A clean watch period is worth more than any new page.

---

## 3. The strategic conclusion (do not re-derive this — it cost a full investigation)

**Technical GEO is not the bottleneck.** gcoman.com is the best of six sites measured — the only one with a substantive `llms.txt`, the only one naming AI crawlers individually. Brand queries already return **#1 on all six AI engines** (ChatGPT, Gemini, Google AI Mode, Claude, Perplexity, Copilot).

Competitors beat us on *product* queries with **worse** pages — one winning caustic-soda page has no `<h1>` and 479 words. They win on **index footprint (25×)** and **third-party corroboration**.

Bing reports **1 referring domain** for gcoman.com — and it is a job-posting link. Competitor muscatchemical shows 16, but ~10 are their own RXSOL network; their genuine third-party links number about **six**.

**→ More code cannot buy the remaining ground. Roughly six citations closes the measurable gap.** That is a business action, carries zero risk to lead flow, and is the user's current task.

---

## 4. What the user is doing (not us)

They said *"ok i will do these"* re the six citations. Priority order, fully researched in `citation-execution-plan-2026-09-30.md`:

1. **Bing Places** — free, imports from the verified GBP in one step; fixes a confirmed map-pack absence
2. **D&B / D-U-N-S** — free, slowest (up to 30 business days), **highest value** — root record that disambiguates the name collision
3. **Made in Oman Gate** — free, competitor is listed, we are not
4. **Metoree** — free, Bing counts 9 links from it to the competitor
5. **OmanYP — $20 Basic** (the one paid item worth doing; *not* Premium)
6. Yellow Pages Oman — paid, last, optional

**The finding that reframes this:** OmanYP carries **three** listings for the *other* company and **zero** for us. In the directory layer AI engines consult, the name currently resolves only to a company that isn't us. This is identity defence, not link building.

If asked to help: we **cannot** create accounts or submit forms. That is a hard limit. Offer the researched detail, not the submission.

---

## 5. Watch period — the actual next task

Baseline captured 2026-09-30. **Any trip = stop and diagnose before building anything.**

| Metric | Baseline | Alarm |
|---|---|---|
| GSC clicks 28d | 536 | < 450 |
| GSC impressions 28d | 10.5K | < 9K |
| GSC avg position | 9.0 | > 11 |
| Homepage clicks 28d | 271 (50% of all) | < 230 — **urgent** |
| Google indexed | 456 | < 430 |
| Bing indexed | 540, 0 errors | < 500 or any error |
| Manual actions | None | **any → stop everything** |
| Leads/month | Sep = 27 | Oct < 18 |

**Now → 7 Oct:** week-1 regression check only. Too early for gains — look for *damage*, not improvement.

### 5a. Day-5 reading (2026-10-05, measured directly — GSC/Bing/live site/admin, each checked separately)

| Metric | Baseline | Day 5 | |
|---|---|---|---|
| GSC clicks 28d | 536 | **508** | ✅ −5%, well above the 450 alarm |
| GSC impressions 28d | 10.5K | **9.96K** | ✅ −5%, above the 9K alarm |
| GSC avg position | 9.0 | **8.7** | ✅ **improved** |
| Homepage clicks 28d | 271 | **250** | ✅ above the 230 alarm; still ~49% of clicks |
| Google indexed | 456 | **456** | ✅ unchanged (333 not indexed, also unchanged) |
| Google manual actions | None | **None** | ✅ the templated-FAQ risk has not fired |
| Google security issues | — | **None** | ✅ |
| Bing indexed | 540 | **555** | ✅ **improved**, 0 errors |
| Leads | Sep = 27 | **4 in Oct 1–3** | ✅ ~1.3/day vs September's 0.9/day — ahead of pace, but 3 days proves nothing |
| **Bing referring domains** | **1** | **1** | ❌ **unmoved — this is the whole point** |

**Read the −5% correctly.** The 28-day window slid from "Sep 2–29" to "Sep 5–Oct 2", so it is a different sample, not necessarily a decline. Average position *improving* while clicks dip slightly is the opposite signature to a content penalty. Nothing here justifies acting.

**The one number that matters is the one that did not move.** Referring domains is still 1 (`tamol.om`, the job-posting link). None of the six citations have landed. Everything else on this page is noise by comparison — the site is healthy and the authority gap is exactly where it was.

**Two Bing notes:**
- Its "Set up IndexNow" recommendation is a **false alarm** — the IndexNow panel shows **657 URLs submitted**. It is a generic prompt, not a detected gap. Do not "fix" it.
- Its sitemap list carries a stale entry: `https://gcoman.com/sitemap` (submitted 2026-05-14) is the **HTML sitemap page**, not an XML sitemap. It discovers 0 URLs and is the sole source of the permanent "1 sitemap with warnings". Harmless, but worth removing from Bing's sitemap list — a Bing-account change, so it needs the user.

**7 → 27 Oct:** re-measure B/C/Z-band product impressions; re-run the 6-engine AI panel; **decide on the 320 templated FAQs** (see risk register below).

---

## 6. Self-inflicted risks I am watching (named honestly)

| Risk | Scale | Detection |
|---|---|---|
| **Templated FAQ bulk** | 320 of 470 answers are ~48 words from two templates; one boilerplate sentence repeats on 147 pages. Close to Google's "scaled content abuse" definition. The citability audit called it *"net-neutral at best, a slight liability at scale."* I generated these. | Manual action in GSC; product impressions falling |
| **52 product retitles** | Titles are the strongest on-page signal. This exact work **already produced one regression** — 20 products silently lost "Oman" because disambiguating qualifiers pushed titles past the 60-char clamp. Only a purpose-built guard caught it. | Per-page impression drops |
| Arabic changes | 274 `/ar` pages | `/ar` impressions |

None of these can be judged before recrawl. **Anyone claiming today that the work "worked" is guessing.**

---

## 7. Protected assets — do not touch

- **Homepage** — 271 of 536 clicks (50% of the funnel)
- **JSRS blog** — 820 of ~1,300 Copilot citations (**63% of all AI visibility on one page**)
- **Location pages** — 17% of clicks

---

## 8. Conditional work, only if the watch is clean (evidence-ordered)

1. Extend the dosing calculator — Bing proves 30 AI citations; tables added 09-30; nothing to lose
2. Replicate the JSRS pattern (named institution + credential + procedure) for one more vertical — most evidence-backed pattern we have
3. Tables on the PAC and caustic-soda blogs — reformatting published facts, no new claims
4. Fix two fact-vacuums: `/chemical-suppliers-middle-east` (2 numeric facts in 2,758 words) and the JSRS blog (add the real JSRS registration number, ICV %, ISO cert number)

### Explicitly NOT doing
❌ More bulk FAQ generation (compounds risk #1) · ❌ More retitling (already caused a regression) · ❌ MEG/MDEA canonical consolidation (removes indexed pages — **user decision**) · ❌ Programmatic pages chasing the 25× footprint (that is the thin-content strategy that would endanger lead flow) · ❌ Anything touching the homepage or JSRS page

---

## 9. Access facts that cost time to discover

- **Bing Webmaster** — registered via *Sign-in-with-Google* as `globalchemicalsllc8@gmail.com`. **No Microsoft password exists.** That was the whole login mystery.
- **GSC / GA4** — same Google account; the `authuser` index **drifts**. Match on the account email, never the index.
- **GSC is a URL-prefix property, `https://gcoman.com/`** — not a domain property. `resource_id=sc-domain:gcoman.com` returns *"you don't have access to this property"* **even on the correct account**, which is indistinguishable from being signed in as the wrong user. Working shape (verified 2026-10-01): `search.google.com/u/1/search-console/<section>?resource_id=https%3A%2F%2Fgcoman.com%2F`.
- **Supabase** — managed by Lovable Cloud; **no standalone credentials exist**. Never suggest `supabase login`.
- **Edge functions do NOT deploy on a Lovable Publish** (verified) — frontend does. Never call an edge-function fix "live" after a Publish.
- **Legacy redirects are client-side** — `curl` shows 200, not 301. Confirm in a browser, not curl.

---

## 10. Loose ends, honestly listed

- **Lovable flagged "1 security finding"** at Publish — never inspected
- Bing: **Keyword Research**, Configuration subsections, and the **119-URL "Warning" bucket** never examined
- Legacy URLs (`/our-team`, `/food-beverages`) serve **HTTP 200 homepage clones** — platform limitation, needs a Lovable ticket
- **Open user decisions:** MEG and MDEA canonical consolidation

---

## 11. Discipline this engagement established — keep it

- **Never commit on an ambiguous gate.** An e2e run reporting 60/77 in 1.5h was machine contention, not failure — re-ran clean 77/77 in 47s. Check `uptime` before blaming code.
- **Unit-test the pure function before blaming the build.** A 120s puppeteer timeout was load average 9.17 on 11 cores (Zoho Assist, Adobe CC), not my parser.
- **Never kill processes without verifying they are orphans.** They were the user's real apps.
- **`$?` after a pipe reports the wrong command's status.** Redirect to a file first.
- **No force-push.** A diverged remote (weekly scheduled agent) was merged, conflicts resolved keeping both sides.
- Label every finding by source: *per Search Console / per GA4 / per Lovable / per the live site / per the admin dashboard.* Never blend them.
