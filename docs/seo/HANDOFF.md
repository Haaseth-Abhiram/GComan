# SEO/GEO Handoff — state as of 2026-09-30

> **Update 2026-10-01 (day 1 of the watch):** all alarms clear — manual actions *None*, Bing errors *0*, clicks 533 / impressions 10.4K / position 8.7 / homepage 264 / Google indexed 456, gates + 77/77 e2e green. **One correction to §1 below: production is NOT current.** `8b06c5e` (markdown tables) is merged to `main` but unshipped — prod still serves the 09-30 build and renders two tables as raw pipe text on the MEG/DEG blog. Needs a Lovable Publish, no code.
>
> **Update 2026-10-05 (day 5):** the Publish happened — deploy is now `psr2.c7119f35…` and the MEG/DEG blog serves **2 real `<table>`s / 19 rows, zero raw pipe junk**, matching local verification. The day-1 correction above is resolved; §1 is accurate again. All alarms still clear, two metrics *improved*. Full table in §5a.

> **Update 2026-10-05 (late):** shipped and live at `psr2.ef1e3fcd` — the Arabic FAQ route gate, the admin dashboard rebuilt on real Search Console data, a live security audit (data access clean), and the **nitric acid product+geo hub** at `/chemical-supplier/nitric-acid-oman` (4,014 words, 11-row spec table, 8 FAQs, submitted to Google's priority crawl queue and accepted by IndexNow). See §11 for the one question that matters now.

> **Update 2026-10-08 — THE WATCH IS CLOSED, AND IT CLOSED CLEAN.** Final reading: GSC 28d **497 clicks / 9.49K impressions / CTR 5.2% / average position 8.4**, manual actions and security issues both *None*. Every alarm threshold in §5 is clear, and average position has now improved three readings running (9.0 baseline → 8.7 day 5 → **8.4**) — the opposite signature to a content penalty. **None of the §6 self-inflicted risks fired.** The restraint hold in §2 is therefore lifted and §8 conditional work is unlocked; §8 item 3 is now done (see below). The measurement cadence returns to monthly — next read early November. Also shipped: **leaked-password protection is now ON** (Lovable → Cloud → Users → Auth settings → "Password HIBP check"; saved, "Auth config updated"), closing one of the three §11 operational items.
>
> **If you only read one file, read [`ACTION-PACK.md`](./ACTION-PACK.md)** — it is the instruction set (what is live, the four off-site actions, how to measure). This handoff is the background and the standing constraints.

**Read this first in a new session.** Then `docs/seo/strategy-and-watch-2026-09-30.md` (the restraint plan + baseline numbers) and `docs/seo/citation-execution-plan-2026-09-30.md` (the user's own task list).

---

## 1. State: everything is shipped, green, and verified

| | |
|---|---|
| Git | `main` == `Develop` == `acee74b`, working tree clean |
| Production | deploy `psr2.ef1e3fcd` — **current with `main`**, homepage 200, sitemap **658 URLs** |
| Gates | tsc · lint · prerender-titles · serp-titles · sitemap-health · ar-meta all clean; **77/77 e2e** |

**There is no unfinished code task.** Do not go looking for one — see §11.

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
3. ~~Tables on the PAC and caustic-soda blogs — reformatting published facts, no new claims~~ **DONE 2026-10-08** (`ed788cf`): 4 tables added — caustic soda grades; PAC liquid-vs-powder, dosing rates, and PAC-vs-alum. Every cell sourced from the prose it replaced. Verified against `BlogPost.tsx`'s actual parser (no ragged rows, no stray pipe lines, no TOC leakage) and 77/77 e2e. **Needs a Lovable Publish to reach production.**
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

---

## 11. "What else do we need to do to be #1?" — answered 2026-10-05

**Nothing further on the website.** That is the honest answer, and the nitric acid work proved it with a controlled example.

We built a page that beats the Oman #1 on every content dimension — 4,014 words against ~250, an 11-row specification table against none, published pack formats against none, a price answer against none, JSRS + ISO 9001 + ICV against no certifications at all. **It still will not outrank them on content**, because `omanchem.com` ranks on domain authority and Bing reports gcoman.com at **1 referring domain** (a job-posting link).

That is the whole constraint, stated once: **we win on pages and lose on corroboration.**

### What actually moves #1 now — all off-site, all yours

| # | Action | Why it is the lever | Cost |
|---|---|---|---|
| 1 | **The six citations** — Bing Places, **D&B**, Made in Oman Gate, Metoree, OmanYP, Yellow Pages | Referring domains is the binding constraint. D&B first: it is a root record others inherit, and it is the fix for the name collision that costs ~20 clicks/month from India alone | ~$20 total |
| 2 | **A Wikidata entry** | **Verified 2026-10-05: none exists.** ChatGPT grounds heavily on Wikipedia/Wikidata, and we are optimising for AI where this site already outperforms. It also disambiguates us from Al Barami's "Global Chemicals & Maintenance Systems", which *does* hold the third-party record layer | free |
| 3 | **Google reviews** | 5.0★ on only **2 reviews**. Review velocity is the documented lever for the local pack | free |
| 4 | Industry directories — ChemNet, Chemical Register, TradeKey, Zauba | For a B2B chemical supplier these are links *and* lead sources at once | mostly free |

Brand mentions correlate roughly **3× more strongly with AI citation than backlinks do**, so items 2–4 pay into the AI channel, which is where this site is already strongest (277 generative-AI impressions on nitric acid against 43 classic).

### What is left on-site — marginal, and deferred

After the watch closes **27 Oct**: UAE snippet work (951 impressions converting at 3.7% against Oman's 9.0%), replicating the JSRS pattern at a commercial query, and the decision on the 320 templated FAQs. None of these changes the #1 answer.

### Operational items still open (not SEO)

- `resync-zoho-leads` returns **404** in production — the admin CRM-backfill button cannot work. Needs a Supabase CLI deploy.
- ~~Leaked-password protection **off**~~ — **FIXED 2026-10-08.** The control is Lovable → Cloud → Users → Auth settings → **"Password HIBP check"** (not a Supabase-console toggle, as earlier notes assumed). Enabled and saved.
- Lovable's **deep security scan never completed** — re-run started 2026-10-08 from Lovable → More → Security → "Run again" (~12–15 min); the browser session dropped before the result could be read, so **the outcome is still unseen**. The one standing finding it had already surfaced was the leaked-password warning now fixed above.

**Do not let a future session answer "what else for #1?" with more code.** The ceiling is authority, and authority is bought with citations, an entity record, and reviews — not with pages.
