# SEO/GEO Strategy & Deployment Watch — from 2026-09-30

**Purpose:** this is deliberately a *restraint* document. A very large change set just went live, the lead flow is at a record high, and the standing instruction is that SEO work must not jeopardise lead generation. The correct next move is therefore **measure, not build.**

---

## 1. What we are protecting (do not put this at risk)

| Asset | Evidence | Why it's fragile |
|---|---|---|
| **Brand #1 across all 6 AI engines** | ChatGPT, Gemini, Google AI Mode, Claude, Perplexity, Bing Copilot — all verified 2026-09-26→29 | Earned by credibility signals (JSRS/ISO/llms.txt/GBP), not by page count. Nothing in the backlog should disturb it. |
| **Homepage = 50% of all clicks** (271 of 536, 28d) | GSC page report | Half the funnel runs through one page. It was touched this week (+9 lines, additive). |
| **September = 27 leads, record month** (+50% MoM) | `/admin/contacts` real rows | Includes OQBI, NOV, Alba Bahrain, Oman Textile Mills. This is the actual business outcome. |
| **JSRS page = 63% of all AI citations** (820 of ~1,300) | Bing AI Performance | One page carries the AI visibility. Do not restructure it. |
| **Locations = 17% of clicks** | GSC page report | Second-biggest cluster. |

---

## 2. Honest risk register for what we just shipped

31 commits went live on 2026-09-29/30. Two carry genuine, self-inflicted uncertainty — naming them plainly:

| Risk | Scale | Why it could go wrong | Detection |
|---|---|---|---|
| **Templated FAQ bulk** | **320 of 470** answers are ~48 words from two templates; one boilerplate sentence repeats on 147 pages | Sits close to Google's "scaled content abuse" definition. I generated these; the citability audit called them "net-neutral at best, a slight liability at scale." | Manual action in GSC; product-page impressions falling rather than rising |
| **52 product retitles** | Titles are the strongest on-page ranking signal | Retitling pages that already rank is inherently risky — this exact work already produced one regression (20 titles lost the word "Oman") that only a purpose-built guard caught | Per-page impression drops on renamed products |
| Arabic changes | 274 `/ar` pages | English FAQ removal reduced page content | `/ar` impressions in GSC |

**None of these can be judged before Google and Bing recrawl.** Anyone claiming today that the work "worked" is guessing.

---

## 3. Baseline — measure against these exact numbers

Captured 2026-09-30, production `psr2.d75791a9…`, git `c85b4d5`, sitemap 657 URLs.

| Metric | Baseline | **Alarm threshold** |
|---|---|---|
| GSC clicks, 28d | **536** | < 450 → investigate |
| GSC impressions, 28d | **10.5K** | < 9K → investigate |
| GSC avg position | **9.0** | > 11 → investigate |
| Homepage clicks, 28d | **271** | < 230 → investigate urgently |
| Google indexed pages | **456** (333 not indexed) | < 430 → investigate |
| Bing indexed | **540**, 0 errors | < 500 or errors > 0 |
| Manual actions | **None** | **Any** → stop everything |
| Leads/month (`/admin/contacts`) | **Sep = 27** | Oct < 18 → investigate |

**Any alarm trip = stop new work and diagnose before building anything further.**

---

## 4. Plan

### Now → 7 Oct — watch only, build nothing
- Read the Bing **Site Scan** result (500-page crawl queued 09-29, emails the account)
- Week-1 GSC check against the table above — looking for *regression*, not improvement (too early for gains)
- Confirm Google/Bing recrawl is picking up the new `lastmod` dates
- **Business track runs in parallel — it is the actual bottleneck and carries zero technical risk:** `omanyp.com` (free), `metoree.com` and `madeinomangate.com` (both proven to link to competitors and counted by Bing), **D&B (highest value — disambiguates the name collision)**, Bing Places (fixes the map-pack absence), and review velocity.

### 7 → 27 Oct — first real signal
- Re-measure B-band/C-band/Z-band product impressions against `product-positioning-gap-audit.md`
- Re-run the 6-engine AI panel; specifically re-test the fertilizer and caustic-soda queries we currently lose
- **Decision point on the 320 templated FAQs:** if product impressions rose → leave them; if flat/down → rewrite editorially (not regenerate) or prune. Deciding this *now*, without data, would be guessing.

### Conditional, evidence-gated work (only if the watch is clean)
Ordered by evidence strength, all additive and low-risk:
1. **Extend the dosing calculator further** — Bing proves 30 AI citations at ~0 clicks; tables added 09-30. Nothing to lose, demonstrated AI pickup.
2. **Replicate the JSRS page pattern** (named institution + credential + procedure) for one more vertical. This is the single most evidence-backed content pattern we have — 63% of citations.
3. **Tables on the PAC and caustic-soda blogs** — reformatting existing published facts, no new claims.
4. **Fix the two fact-vacuums**: `/chemical-suppliers-middle-east` (2 numeric facts in 2,758 words) and the JSRS blog (2 facts in 852 words — add the real JSRS registration number, ICV %, ISO cert number).

### Explicitly NOT doing, and why
- ❌ **More bulk FAQ generation** — would compound the one risk I already flagged
- ❌ **More retitling** — already caused one regression; nothing currently justifies the risk
- ❌ **MEG/MDEA canonical consolidation** — removes currently-indexed pages; user decision, and not while we're mid-measurement
- ❌ **Chasing competitors' 25× index footprint** with programmatic pages — that is precisely the thin-content strategy that would endanger the lead flow
- ❌ **Anything touching the homepage or the JSRS page** — 50% of clicks and 63% of citations respectively

---

## 5. The strategic truth, stated plainly

Competitors beat us on product queries with **worse** pages — one winning caustic-soda page has no `<h1>` and 479 words. They win on **index footprint** and **third-party corroboration**, not quality. Our technical GEO is the best of six sites measured and **is not the bottleneck**.

Which means: **more code cannot buy the remaining ground.** Bing shows **1 referring domain** for gcoman.com — and it is a job-posting link. The good news is the gap is smaller than it looks: competitor muscatchemical's 16 domains are mostly their own network; their genuine third-party links number about **six**.

**Roughly six good citations — directories, D&B, a trade listing — would close the measurable authority gap.** That is the highest-leverage work available, it is a business action rather than a code change, and it cannot harm the lead flow.

---

## 6. Week-1 check — 2026-10-01 (day 1 of the watch)

Too early for gains; this pass was looking for **damage**. None found. One deploy gap found.

| Metric | Baseline 09-30 | 10-01 | Alarm | |
|---|---|---|---|---|
| GSC clicks 28d | 536 | **533** | < 450 | ✅ |
| GSC impressions 28d | 10.5K | **10.4K** | < 9K | ✅ |
| GSC avg position | 9.0 | **8.7** | > 11 | ✅ |
| GSC CTR | — | 5.1% | — | — |
| Homepage clicks 28d | 271 | **264** (49.5% of all) | < 230 | ✅ |
| Google indexed | 456 (333 not) | **456 (333 not)** | < 430 | ✅ |
| **Manual actions** | None | **No issues detected** | any | ✅ |
| Security issues | — | **No issues detected** | any | ✅ |
| Bing indexed | 540, 0 errors | **544, 0 errors** (117 warn, 7 excl) | < 500 or any error | ✅ |
| Bing AI citations 3M | ~1,300 | **1.3K** | collapse | ✅ |

*Per Search Console* (property `https://gcoman.com/`, data 8.5h old) · *per Bing Webmaster* · *per the live site*.
Leads not yet readable — 1 Oct.

Gates re-run locally at `c998313`: tsc · lint · sitemap-health · ar-meta · prerender-titles · serp-titles all clean; **77/77 e2e in 27.8s**. Production: 657-URL sitemap, 297 `/ar`, robots + llms.txt 200, homepage/JSRS/dosing-calculator/location/caustic-soda hub all 200 with correct prerendered titles.

### Open deploy gap — `8b06c5e` is merged but NOT live

`main` is at `8b06c5e` (the markdown-table fix) while production still serves deploy `psr2.d75791a9…` from the 09-30 baseline (`c85b4d5`). Proof, not inference:

| `/blog/meg-vs-deg-gas-dehydration-oman-gcc` | raw `\|---\|` rows | `<table>` |
|---|---|---|
| production | 9 | 0 |
| local `dist/` built from HEAD | 0 | 2 |

Two comparison tables on a 2,275-word page are rendering to readers and crawlers as raw pipe text. **Fix is a Lovable Publish — no code work.** Consistent with the known rule that a git merge alone does not ship.

### Verdict
Watch continues unchanged. Nothing to build. Next real signal ~7 Oct.
