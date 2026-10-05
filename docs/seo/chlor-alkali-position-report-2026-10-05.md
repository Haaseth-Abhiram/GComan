# Chlor-alkali range — position report, 2026-10-05

**Scope:** the product range manufactured by **Al Ghaith Chemical Industries LLC** (Sur Industrial City, Oman; est. 2022; 190 tpd chlor-alkali, +120 tpd expansion): caustic soda lye 50%, caustic soda flakes 99%, hydrochloric acid 32%, sodium hypochlorite 12–15%, calcium chloride brine.

**A note on provenance:** there was no record of earlier "Al Gayati" work in this repository, its memory, its git history, or the Zoho project — the only near-match found there was a contact person's surname. This report is a fresh investigation, and the company identity was confirmed with you before starting.

---

## 1. The headline

**Zero clicks across the entire range in 90 days.**

| Product | Classic impressions | Clicks | Avg position | Google AI impressions | AI vs classic |
|---|---|---|---|---|---|
| Caustic soda | 35 *(21 are "caustic potash", a different product)* | **0** | **57.3** | 62 | 1.8× |
| **Hydrochloric acid** | **0** | **0** | — | 3 | — |
| Sodium hypochlorite | 28 | **0** | 5.3 | 86 | 3.1× |
| Calcium chloride | 13 | **0** | 23.8 | 66 | 5.1× |
| **Total** | **76** | **0** | | **217** | **2.9×** |

Two things stand out immediately.

**Hydrochloric acid registers absolute zero** — not a single impression in 90 days, despite two live pages. We are not ranked badly for HCl; we are not in the index's consideration set at all.

**Caustic soda sits at position 57.3 — page six — despite having a dedicated hub page** at `/chemical-supplier/caustic-soda-oman`, the very pattern we just replicated for nitric acid. Strip out the 21 "caustic potash" impressions (a different chemical, KOH) and real caustic soda demand reaching us is roughly **14 impressions in 90 days**.

**AI is again the stronger channel** — 217 impressions against 76, a 2.9× ratio. Same finding as nitric acid, now confirmed across a second product family.

---

## 2. What we actually have

| Product | Pages | Notes |
|---|---|---|
| Caustic soda | 3 canonical (`water-treatment/caustic-soda-flakes` / `-liquid` / `-prills`) + 3 `canonicalOverride` duplicates in `soap-detergent` + food-grade liquid + `tank-cleaners/lye-sodium-hydroxide-liquid` + lab pellets | plus a dedicated hub page |
| Hydrochloric acid | 2 — `water-treatment/hydrochloric-acid-industrial` (30–33%), `lab-chemicals/hydrochloric-acid-lab` | **no industrial hub** |
| Sodium hypochlorite | 6 incl. municipal, food, pool, soap 12–15% — **and `water-treatment/sodium-hypochlorite-2`, an apparent duplicate of `sodium-hypochlorite`** | |
| Calcium chloride | 3 — oilfield brine, de-icing, lab | |

Coverage is not the problem. **We have pages for every product Al Ghaith makes.** They do not rank.

---

## 3. Who wins, and why — live SERPs (`gl=om`)

### `caustic soda supplier oman` — **gcoman.com absent from page 1**

| # | Winner | Snippet signal |
|---|---|---|
| 1 | **Oman Chlorine S.A.O.G** | "Caustic Soda Lye (NaOH) **50.0%**" — owns a chlor-alkali plant at Sohar Industrial Estate |
| 2 | omanchem.com | "Caustic Soda **(99%)** Supplier in Sohar Muscat Barka Ruwi" |
| 3 | **uvwater.biz** | "99% NaOH in **25kg bags, COA & MSDS**" — **OMR 25.000 · In stock** |
| 4 | muscatchemical.com | "Caustic Soda Lye **48%** manufacturer and supplier" |
| 5 | omanyellowpagesonline.com | directory — "3 Caustic Soda Flakes Suppliers" |
| 6 | **hakimwater.com** | "manufacturer… based in **Sohar with local warehousing**, 98–99%" — **5.0★** shown in SERP |
| 9 | innovacorporate.com (India) | **4.9★ (168 reviews)** shown in SERP |

### `hydrochloric acid supplier oman` — **gcoman.com absent from page 1**

Muscat Chemical · omanchem (×3) · **Oman Chlorine S.A.O.G** ("HCl **31-33%**") · Oman Yellow Pages Online · **Innova 4.8★ (156)** · Sohar Chemicals.

### The three patterns, now confirmed across three products

1. **Price + stock status wins.** `uvwater.biz` appears on page 1 for caustic soda (**OMR 25.000 · In stock**) and for nitric acid (**OMR 70.000**). It is the only competitor publishing either, and it earns a rich result both times. We publish neither.
2. **Star ratings are rendering in these SERPs.** `hakimwater.com` shows 5.0★, `innovacorporate.com` shows 4.8–4.9★ on 156–168 reviews. **Global Chemicals has 2 reviews.** This is visible, competitive real estate we are forfeiting on the result page itself.
3. **Directories rank on page 1 of both.** Oman Yellow Pages Online appears for caustic soda *and* HCl. The citation work is not abstract authority-building — those directories are literally occupying the positions we want.

**Oman Chlorine S.A.O.G is the structural incumbent.** It ranks for both caustic soda and HCl because it genuinely operates the chlor-alkali plant — and it is also Al Ghaith's direct competitor. Beating it on generic head terms is a long campaign, not a page edit.

---

## 4. The diagnosis

This range fails for a *different* reason than nitric acid did.

With nitric acid the problem was **absence** — we had no industrial page, so we never entered the auction. Building one was the fix.

Here we **have the pages**, including a hub built on the proven pattern, and they still do not rank. Caustic soda at position 57 with a dedicated hub is the clearest evidence yet that **on-page work has hit its ceiling**. The hub is well built; it cannot overcome one referring domain against incumbents with real plants and years of accumulated links.

That is the same conclusion reached for the site overall, now demonstrated a third time on a product family where we did everything right.

---

## 5. What would actually move this

**Ordered by effect, and most of it is not code.**

1. **Publish price and stock status.** `uvwater.biz` is on page 1 for two of our target products on the strength of "OMR 25.000 · In stock". It is not a bigger or more authoritative site than ours — it answers the question buyers actually ask. This is the single cheapest competitive move available, and it needs a commercial decision rather than a technical one.
2. **Google reviews.** Competitors are rendering 4.8–5.0★ directly in these SERPs. At 2 reviews we show nothing. Reviews also feed the local pack, which is a documented weakness.
3. **The six citations.** Oman Yellow Pages Online ranks on page 1 for both products examined. Being absent from the directories means losing the position *and* the link.
4. **Fix the catalogue dilution** — low effort, do it with the next deploy: `water-treatment/sodium-hypochlorite-2` looks like a straight duplicate of `water-treatment/sodium-hypochlorite`, and three `soap-detergent` caustic pages already carry `canonicalOverride`. Consolidating stops us competing with ourselves.
5. **An HCl industrial hub**, mirroring the nitric acid build — justified by the zero, and additive. But note the honest expectation: the caustic hub proves a hub alone does not rank without authority behind it.

**What I would not do:** build four more hubs on the assumption they will rank. The caustic soda hub is the counter-example sitting in the data.

---

## 6. Recommended sequence

| When | Action | Owner |
|---|---|---|
| Now | Decide whether to publish indicative prices + stock status | business |
| Now | Push for Google reviews | business |
| Now | The six citations (D&B first) | business |
| Next deploy | Consolidate the duplicate hypochlorite page | code |
| After 27 Oct | HCl industrial hub, if the citation work has started moving referring domains | code |

The measurable target to beat: **0 clicks / 76 impressions / 217 AI impressions per 90 days** across the four products.
