# Did our SEO work damage lead generation? — full investigation, 2026-10-05

**The question:** a GA4 drop trend is visible, and the concern is that something in the recent SEO work is suppressing inquiries.

**The answer: no.** Nothing we shipped touches the lead path, the retitling measurably *improved* product performance, and leads are running ahead of September. The GA4 drop is a measurement artifact — GA4 only sees about 1 visitor in 15, and at that sample size normal variance looks like a collapse.

Each source below was checked **directly and separately** (Search Console, GA4, Bing, the live site, the admin panel) and is labelled as such.

---

## 1. Could our code have broken lead capture? — No. Proven by diff, not by assertion.

Diffed all 35 commits against every file on the conversion path:

| File | Changed? |
|---|---|
| `ContactForm` / form logic | **no** |
| `Turnstile.tsx` (captcha) | **no** |
| `consent.ts` / `CookieConsent.tsx` | **no** |
| `GoogleAnalytics.tsx` | **no** |
| `QuoteDialog` / `DownloadGateDialog` | **no** |
| `ZohoSalesIQ` / `WhatsAppButton` | **no** |
| `supabase/functions/submit-contact` | **no** |
| `supabase/functions/notify-download` | **no** |
| `supabase/functions/subscribe-newsletter` | **no** |
| `src/pages/Contact.tsx` | **yes — +16 lines, purely additive** |

The only edge-function file in the diff is `supabase/functions/mcp/index.ts`, which is the **auto-generated bundle** the Vite build rewrites on every build. No hand-written backend code changed, so the Zoho/email/Supabase lead pipeline is byte-identical to before this work started.

The `Contact.tsx` change adds a visible FAQ block and gates the FAQ *schema* so `/ar` doesn't emit English Q&As. It does not touch the form, its validation, its submit handler, or its tracking.

**Live check (per the live site):** `/contact` returns 200, serves 2 `<form>` elements with name/email/submit fields present in the prerendered HTML, and is `index, follow`. The form is intact and crawlable.

---

## 2. Did the 52 product retitles hurt rankings? — No. They did exactly what they were meant to.

**Per Search Console**, pages containing `/products/`, last 28 days vs the previous 28:

| Metric | Previous 28d | Last 28d | Change |
|---|---|---|---|
| **Clicks** | 94 | **104** | **+11%** ✅ |
| Impressions | 4.42K | 3.29K | −26% ⚠️ |
| **CTR** | 2.1% | **3.2%** | **+52%** ✅ |
| **Average position** | 15.2 | **10.4** | **+4.8 places** ✅ |

**Read the impressions drop correctly — it is the mechanism, not the damage.** We disambiguated 38 identical product titles that were competing against each other. Before, several near-duplicate pages each surfaced for the same query, harvesting impressions at poor positions. Now fewer pages surface per query, but each ranks ~5 positions higher and converts impressions to clicks at 1.5× the old rate. Fewer impressions, better positions, higher CTR, **more clicks** is the textbook signature of a cannibalization fix working.

If the retitling had damaged anything, position would have fallen and CTR would have dropped. Both moved the other way.

---

## 3. Is Google penalising the 320 templated FAQs? — No.

**Per Search Console:**
- Manual actions: **No issues detected**
- Security issues: **No issues detected**
- Indexed pages: **456**, unchanged from baseline (333 not indexed, also unchanged)

This was the single largest self-inflicted risk on the board. Five days of recrawl, no penalty, no de-indexing. Still worth the 27 Oct decision point, but there is no emergency.

---

## 4. Are leads actually down? — No. They are up.

**Per the admin panel (raw dated rows, the only ground truth):**

| | |
|---|---|
| Contact forms, all time | **147** |
| Contact forms **this week** | **+8** |
| Conversion rate | **15.0%**, +13.3% vs prior period |
| Recent activity | contacts at 1, 2, 3 and 4 days ago — no gap |

September ran 27 leads across 30 days ≈ 0.9/day. The current week is running **8 in 7 days ≈ 1.1/day**. October 1–3 alone produced 4 inquiries (Naty & Rose Logistics, Gemini Energy LLC, Ecc.3 Multi Venture, ATTS). The alarm threshold was "October below 18" — the present pace points to the mid-30s.

**Leads are the business outcome, and they are rising, not falling.**

---

## 5. So what is the GA4 drop? — GA4 cannot see your traffic.

This is the real finding, and it is a measurement problem rather than a marketing one.

**Per GA4's own Search Console–linked report**, identical 28-day window, one table:

| Metric | Value |
|---|---|
| Organic Google Search clicks | **479** |
| GA4 active users | **31** |
| GA4 engaged sessions | **50** |

**GA4 is recording roughly 1 in every 15 real visitors (~6.5%).** The homepage alone took 235 organic clicks and registered 16 active users.

### Why (confirmed in the code)

1. `src/lib/consent.ts` defaults to **deny-all** — `{ essential: true, analytics: false, marketing: false }`.
2. `GoogleAnalytics.tsx` only injects the GA script when `hasAnalyticsConsent()` is true. Before consent, **no tag loads at all**.
3. **Google Consent Mode v2 is not configured** — there are no `analytics_storage` / `ad_storage` default signals. So when a visitor declines or ignores the banner, GA sends *nothing*: not even the cookieless pings Google would otherwise use to model the missing traffic.

The result is that GA4 measures only the small, self-selected minority who actively accept cookies.

### Why this makes the "drop trend" meaningless

At n≈31 users, GA4's percentages are noise. The headline "Key events −75%" is a move from roughly 8 to 2 — a difference of six events. That is ordinary week-to-week variation in a tiny sample, not a demand signal. **Any** week will look dramatic at this scale.

This is also false-alarm pattern #1 in the SEO health procedure, in a stronger form than previously documented: it is not only *conversions* that GA4 undercounts, it is **all traffic**.

---

## 6. Verdict

| Question | Answer |
|---|---|
| Did we break the lead path? | **No** — no conversion code touched, form verified live |
| Did the retitling hurt rankings? | **No** — position +4.8, CTR +52%, clicks +11% |
| Did the FAQs trigger a penalty? | **No** — manual actions clean, index flat |
| Are leads falling? | **No** — ~1.1/day vs September's 0.9/day |
| Is the GA4 drop real? | **No** — GA4 sees 6.5% of visitors; the trend is sampling noise |

**Nothing we shipped is suppressing inquiries.** The one thing that genuinely has not moved is **Bing referring domains, still 1** — the authority gap the six citations are meant to close. That remains the only real constraint, and it is a business task, not a code task.

---

## 7. Recommendation — fix the instrument, not the site

The site is healthy. The *measurement* is not, and that is worth correcting because it is currently impossible to judge marketing decisions from GA4.

**Option A — implement Google Consent Mode v2 (recommended).** Set `analytics_storage: denied` as the default signal *before* the banner is answered, instead of withholding the tag entirely. Google then receives anonymous cookieless pings and statistically models the unmeasured traffic. This is the industry-standard approach, keeps the deny-all stance legally intact, and would recover most of the missing ~93%. It is a change to a consent-gated third-party tag, so it needs care and your explicit go-ahead — **not something to do during the current watch window.**

**Option B — accept GA4 as unreliable and stop steering by it.** Treat Search Console (traffic) and the admin panel (leads) as the sources of truth, and read GA4 only for on-site behaviour among consenting users. This costs nothing and is what the four-sources discipline already implies.

**Do not** "fix" the GA4 trend by loosening the cookie banner or firing analytics before consent — that trades a reporting inconvenience for a compliance problem, and it would not improve a single lead.
