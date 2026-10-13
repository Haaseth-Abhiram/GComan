# Action Pack — getting to #1 and converting inquiries

**This is the only document you need to work from.** The other 26 files in `docs/seo/` are the evidence behind it; this is the instruction set.

*For an engineer picking this up cold: [`HANDOFF.md`](./HANDOFF.md) carries the standing constraints (the measurement window, the protected pages, and what deliberately must **not** be done).*

Everything the website can do has been done. What remains is four things only you can do, and they are ordered by effect. Nothing here needs a developer.

---

## PART A — What is already live (nothing for you to do)

Verified in production on 2026-10-05, deploy `psr2.37ba0086`:

| Product hub | Words | Spec table | FAQs | Status |
|---|---|---|---|---|
| [Nitric Acid Oman](https://gcoman.com/chemical-supplier/nitric-acid-oman) | 4,014 | ✅ 11 rows | 8 | Live · submitted to Google + Bing |
| [Hydrochloric Acid Oman](https://gcoman.com/chemical-supplier/hydrochloric-acid-oman) | 3,701 | ✅ 11 rows | 8 | Live · submitted to Google + Bing |
| [Caustic Soda Oman](https://gcoman.com/chemical-supplier/caustic-soda-oman) | 3,470 | ✅ 10 rows | 8 | Live |

Each carries: CAS number, concentration, **pack formats from carboy to bulk tanker**, cities served, every GCC market named, JSRS/ISO 9001/ICV, FAQ schema, and a specification table.

**No competitor on page 1 in Oman or the UAE publishes a specification table or a full pack range.** On content, you now win. Also done: the duplicate hypochlorite page consolidated, all hubs internally linked, 657 URLs in the sitemap, zero technical errors, data access audited and clean.

---

## PART B — The four things that decide #1

### B1. Publish price and stock status ⭐ highest impact, costs nothing

**The evidence.** `uvwater.biz` reaches page 1 in Oman for **both** caustic soda and nitric acid. It is not a larger or more authoritative site than yours. It wins because its search result reads:

> **OMR 25.000 · In stock** — Caustic Soda Flakes, 99% NaOH in 25kg bags, COA & MSDS supplied

Google's own "People also ask" box on the nitric acid SERP asks *"How much does 1 litre of nitric acid cost?"* and *"How much does 5 litres cost?"* — twice. **Buyers are asking the price question and almost nobody answers it.**

**What to decide:** are you willing to publish an indicative price band (e.g. "from OMR X per 35 kg carboy, volume-tiered") on the three hub pages? It does not have to be your real quoted price — a *from* figure or a band is enough to win the snippet.

**If yes, tell me the bands and I will implement it the same day.** This is the single cheapest competitive move available to you.

---

### B2. Google reviews ⭐ visible on the result page itself

**The evidence.** On the caustic soda SERP, `hakimwater.com` shows **5.0★** and `innovacorporate.com` shows **4.8★ (156 reviews)** — rendered directly in the Google result. Global Chemicals has **2 reviews** and shows nothing.

This is competitive real estate you are forfeiting *on the search page*, before anyone clicks.

**Target: 20 reviews.** At your lead volume that is roughly two months of asking.

**Ready-to-send message** — WhatsApp or email, after every delivery:

> Thank you for your order with Global Chemicals LLC. If the product and service met your expectations, would you take 30 seconds to leave us a Google review? It genuinely helps other buyers in Oman find a reliable supplier.
> [your Google review link]

**Who to ask first:** your September customers — OQBI, NOV, Alba Bahrain, Oman Textile Mills. Industrial buyers who had a good delivery will usually oblige if you ask directly and make it one tap.

---

### B3. The six citations ⭐ the measured constraint

**The evidence.** Bing reports **1 referring domain** for gcoman.com — a job-posting link. Your competitors' pages are thinner than yours and still outrank you, because they have corroboration and you do not. This is why a better page alone has not been enough.

Separately: **Oman Yellow Pages Online ranks on page 1 for both caustic soda and hydrochloric acid.** The directories you are absent from are literally occupying the positions you want.

Use the **NAP block in [`authority-building-kit-2026-09-26.md`](./authority-building-kit-2026-09-26.md) §2 verbatim** on every one — identical records are what make them count as one entity.

| Order | Where | Cost | Time | Why first |
|---|---|---|---|---|
| 1 | **[Bing Places](https://www.bing.com/forbusiness/)** | free | 10 min | Imports your verified Google profile in one step. You rank #1 on Bing organically but are absent from its map pack |
| 2 | **[D&B D-U-N-S](https://www.dnb.com/en-us/smb/duns/get-a-duns.html)** | free | 20 min | **Slowest (up to 30 business days) — start today.** A root record other directories inherit, and the fix for the name collision |
| 3 | [Made in Oman Gate](https://madeinomangate.com) | free | 15 min | Competitor is listed, you are not |
| 4 | [Metoree](https://us.metoree.com) | free | 15 min | Bing counts 9 links from it to your competitor |
| 5 | [OmanYP](https://www.omanyp.com/create-business-listing) | **$20** | 20 min | Carries 3 listings for the *other* Global Chemicals and zero for you |
| 6 | Yellow Pages Oman | paid | — | Last, optional |

**Total: about $20 and one afternoon.**

⚠️ **On D&B:** look up existing records first. Do **not** request a second number if one exists — duplicate D&B records are painful to unpick.

---

### B4. A Wikidata entry ⭐ cheapest AI-visibility win

**Verified 2026-10-05: no Wikidata or Wikipedia entity exists for Global Chemicals LLC.** Meanwhile Al Barami's similarly-named "Global Chemicals & Maintenance Systems" owns the third-party record layer.

This matters more than it looks. **Brand mentions correlate roughly 3× more strongly with AI citation than backlinks do** — and AI is where your site already outperforms: the nitric acid pages draw 277 AI impressions against 43 classic. A Wikidata entry is free, takes about 30 minutes, and simultaneously disambiguates you from the other company.

Create at [wikidata.org](https://www.wikidata.org) with: official name, country (Oman), HQ (Muscat), industry (chemical distribution), inception, official website, and the ISO 9001 / JSRS / ICV credentials as qualifiers.

---

## PART C — The name collision (worth understanding once)

There is a different Oman company, **Global Chemicals & Maintenance Systems LLC** (Al Barami Group, an O&M contractor since 1976). It is not a nuisance — it is measurable:

- **~150 clicks per quarter** go to searches for *their* name
- **India is your #2 traffic source at 20% of clicks**, and of 46 India queries exactly two have buying intent — the rest are brand lookups, largely for them
- They hold the D&B, OmanYP and LinkedIn records

**This is why D&B is ranked second above, not fifth.** It is identity defence, not link building.

Already mitigated on-site: a homepage FAQ states plainly that the two are separate companies, and ChatGPT now describes the correct company when asked.

---

## PART D — How to tell if it is working

Check monthly. Do not check weekly — these take 2–6 weeks to register.

| Metric | Where | Today | Target (90 days) |
|---|---|---|---|
| **Bing referring domains** | Bing WMT → Backlinks | **1** | **6+** |
| Google reviews | Google Business Profile | 2 | 20 |
| Nitric acid impressions | GSC, query contains "nitric" | 43 / 90d | 400+ |
| Chlor-alkali impressions | GSC, queries: caustic / hydrochloric / hypochlorite | 76 / 90d | 400+ |
| Chlor-alkali clicks | same | **0** | first non-zero |
| Page-1 for "nitric acid supplier oman" | Google, `gl=om` | absent | top 10 |
| Leads/month | `/admin/contacts` | Sep = 27 | hold ≥ 27 |

**The single number that tells you whether any of this is working is Bing referring domains.** If it moves from 1 to 6, rankings follow. If it stays at 1, nothing else will matter.

---

## PART E — Converting inquiries into orders

Ranking brings inquiries; these decide whether they become orders. All observed in your own data.

1. **Answer within 24 hours.** The hub pages promise this explicitly. B2B chemical buyers are usually comparing three suppliers the same morning.
2. **Quote the pack format they asked for.** Every hub lists carboy / drum / IBC / bulk tanker precisely so the inquiry arrives qualified. Quote that unit, not a generic price list.
3. **Attach the CoA and SDS with the quotation, unprompted.** Your JSRS/ISO/ICV documentation set is a genuine differentiator against the traders you compete with — most cannot produce it on request.
4. **Lead with local manufacture and held stock.** Against importers, "in stock in Muscat, dispatched same day" wins more often than a slightly lower price.
5. **Watch the CRM sync.** ⚠️ The admin dashboard's "Check CRM sync / Push to Zoho" button **does not work** — the `resync-zoho-leads` function was never deployed and returns 404 in production. Until it is fixed, verify in Zoho that each lead arrived. See Part F.

---

## PART F — Three open items that are not SEO

| Item | Impact | Fix |
|---|---|---|
| **`resync-zoho-leads` returns 404** | The CRM-backfill button cannot work — the recovery path for leads whose Zoho push failed is itself broken | Needs a Supabase CLI deploy. Edge functions do **not** ship on a Lovable Publish |
| **Leaked-password protection off** | Admin accounts can use known-breached passwords | One toggle: Supabase → Authentication → Policies |
| **Lovable deep security scan never completed** | Unseen findings may exist | Lovable → More → Security → "Run again" (12–15 min, free) |

---

## In one line

**The website is finished. Rankings now cost about $20, one afternoon of form-filling, and asking your customers for reviews.** Tell me the price bands and I will add them the same day — that is the only remaining item where I can help directly.

---

## PART G — Update 2026-10-13: what the location sweep changed

A 60-search sweep (Google, Bing, Maps, ChatGPT, Google AI Mode, Perplexity; Oman and every GCC country; head terms and nitric acid) is in `visibility-ledger.md`. Headline: **#1 in Oman on Google, Maps and all three AI engines; #4 on Bing; nowhere in the other GCC countries; nitric acid #12 on Google.** Parts B1–B4 stand unchanged — nothing below replaces them. These are the additions.

| # | What the sweep found | What we do about it | Owner | Judge it on |
|---|---|---|---|---|
| G1 | **Google lists the nitric hub, the HCl hub AND `/chemical-suppliers-oman` as "Soft 404"** (URL Inspection 2026-10-13: crawled Oct 9 / Oct 9 / Oct 13; `/products/glycols/teg-triethylene-glycol` too). "Test live URL" passes for all of them; the server HTML is complete. Cause: the app mounts with `createRoot`, which wipes the prerendered page to a spinner until the route chunk loads, so a chunk failure in Google's renderer leaves an empty page (the 2026-08-31 pattern). Bing indexed both hubs and ranks the nitric hub #1 for "nitric acid supplier gcc". This, not the content, is why nitric acid is absent on Google | **You (or Claude on a go-ahead — the owner account is now signed in on the Mac Chrome):** Search Console → inspect each of the 4 URLs → *Request indexing*. **Claude (done, Develop):** lab-grade nitric and HCl product pages link to the hubs. **Claude (done on Develop, G8):** the prerendered page now stays in the DOM as the initial Suspense fallback instead of being wiped to a spinner (`src/lib/prerenderSnapshot.ts`) — removes the cause for the 19 Soft-404 and 63 "crawled, not indexed" pages once Published. Request indexing submitted for all four URLs on 2026-10-13 | user + Claude | 2026-10-20: all 4 URLs "on Google"; nitric acid supplier oman in the top 10 |
| G2 | ChatGPT names us #2 for nitric acid but as **"lab-grade only"** — it found the lab product page, not the hub | Follows from G1. Nothing extra to build | — | re-ask ChatGPT 2026-10-27 |
| G3 | Maps: #1 for "chemical suppliers oman", **absent from the top 50 for bare "chemical supplier"**. The listings above us carry the keyword in their *business name* ("Green Port Chemical Suppliers In Muscat"). Our category is "Chemical wholesaler"; no secondary categories | Do **not** rename the business (Google suspends keyword-stuffed names). Add secondary categories from the picker where they exist — look for *Industrial chemicals wholesaler, Chemical exporter, Water treatment supplier, Laboratory equipment supplier, Lubricant supplier* — and add Services entries named after the products (caustic soda, nitric acid, HCl, PAC, hypochlorite). Reviews (B2) remain the bigger Maps lever | user (or Claude with the owner account signed in) | done + 4 weeks |
| G4 | **Bing slipped #2 → #4** for "chemical suppliers oman" behind omanchem, muscatchemical and the EasyOman directory | No new work: this is B3 (referring domains = 1). Bing Places is still "pending publish" | — | 2026-11-08 Bing Places check (already scheduled) |
| G5 | **UAE, Saudi, Qatar, Kuwait, Bahrain: not in the top 10 anywhere.** The page-1 slots are local companies and directories — on Bing, `ensun.io` is #1 for Saudi, Qatar *and* Kuwait; `yellowpages-uae.com` is #1 for the UAE | Not winnable with pages (we already have country hubs). The cheap wedge is being *on* the pages that rank: free listings on **ensun.io** and **EasyOman**, plus Yellow Pages UAE. Added to the registration queue | user signs up, Claude fills | done + 4 weeks |
| G6 | Maps in Sohar, Salalah, Nizwa, Duqm: absent | Structural — one Muscat address. Don't chase | — | — |
| G7 | Google #1 for Muscat, Salalah and Duqm; #5 Nizwa; absent in Sohar (soharchemical.com, MAK Sohar are local) | Accept. The Duqm win comes from `/chemicals/duqm`; the Sohar page exists and is simply outranked by in-city firms | — | — |

**Reading it in one line:** the only new finding that changes the order of work is G1 — two Request-indexing clicks. Everything else was already in Parts B2–B4.

**Addendum 2026-10-13 (nitric deep-dive):** full country-by-country SERPs, Search Console per-country tables and the Soft-404 diagnosis are in [`nitric-acid-gcc-position-2026-10-13.md`](./nitric-acid-gcc-position-2026-10-13.md). Order of work after it: G1 (four Request-indexing clicks) → G8 (approval) → B1 → B3 (the yellow-pages directories hold a page-1 slot in all six GCC countries) → B2/G3.
