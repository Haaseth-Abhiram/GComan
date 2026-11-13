# Position review and enquiry forecast, 2026-11-13

The user asked: where do we stand across Google, Bing, Search Console, Analytics and the AI engines in every GCC country, and how many enquiries should we expect? Every number below was read on 2026-11-13 from the source named in its row (readings in `visibility-ledger.md` and `location-ledger.md`, same date). Production is Publish #13 (`psr2.025e5998`). The November 2026 Google core update has been rolling out since 11-10 (~2 weeks), so Google movements until ~12-01 are not attributable.

Previous review: `position-review-2026-11-09.md`.

## 1. Scoreboard by surface

| Surface | Source | Reading | Change since 11-09 |
|---|---|---|---|
| Google traffic, 28 days | GSC | 637 clicks (+23%), 9.82K impressions (+10%), CTR 6.5%, avg position 9.1 | up |
| Brand vs non-brand | GSC query filters | brand ≈ 174 clicks (global / جلوبال); non-brand ≈ 463 | — |
| By country, 28 days | GSC | Oman 320 clicks (+57%), India 81, Saudi Arabia 43, UAE 42, Qatar 10, Kuwait 8 | Oman up strongly |
| Google index | GSC Pages | 574 indexed, 224 not (89 deliberate; 77 discovered-not-indexed, 42 crawled-not-indexed, 12 soft 404 under validation) | — |
| Google AI Overviews / AI Mode | GSC generative-AI report (new) | Appear for brand, "chemical suppliers in oman" (pos 1.7), "chemical supplier in muscat" (pos 3.2, 0 clicks), nitric 68% / food grade, urea, hypochlorite food grade; AI users ask follow-ups for phone, WhatsApp, "where to buy in Oman" | first read |
| Google organic, product × country | 25 panel cells (pws=0) | Absent from the top 9 in all 25 (Oman products: omanchem #1 on most; Saudi nitric: nassguard.sa; UAE cal-hypo: chemstock.ae / hazchem.ae; Bahrain: bahrainyellowpagesonline). Generic "chemical suppliers in oman" #1 | unchanged (core update window; GCC pages not yet indexed) |
| Bing, Oman | navigated, cc=OM | nitric **1**, sodium hypochlorite **1**, HCl **1**, caustic 4, "chemical suppliers in oman" 2 | nitric back to 1, generic 4 → 2 |
| Bing, GCC | navigated | Bahrain cal-hypo **2**, "chemical supplier bahrain" **2**, Saudi nitric **3**; UAE, Qatar, Kuwait, Riyadh, Saudi HCl / generic absent (directories and stockists hold #1) | Bahrain and Saudi nitric new |
| Bing totals, 3 months | Bing WMT | 187 clicks, 3.1K impressions; Copilot citations 1.6K | — |
| ChatGPT (logged out) | chatgpt.com | "best chemical suppliers in Oman" → **#1 Global Chemicals LLC** | 2nd → 1st |
| Perplexity | perplexity.ai (signed-out session) | Oman generic: named 5th (after OQ, DRPIC, SIUCI, OMC). Cal-hypo Bahrain + UAE: **named first**. Saudi nitric: **"strongest GCC option"** | GCC answers now cite our country pages |
| Google Analytics | GA4 | 14 users / 7 days, 11 key events, 2 sessions from chatgpt.com. Consent gating hides ~90% of visits: direction only, never totals | — |
| Enquiries | Zoho CRM | 87 leads since 08-15; genuine buyer RFQs Sep 14, Oct 14, Nov 1–13 9 (≈21/month pace); 13 vendor pitches since 10-01 | volume rising |
| Enquiry handling | Zoho CRM | **39 of 40 leads since 10-01 still "New – Website Enquiry"**; 23 buyer RFQs + 2 chats with no recorded contact | unchanged — the largest gap |

## 2. Position in one paragraph

We are #1 where buyers ask an AI engine or Bing about Oman and about our revenue products for Bahrain and Saudi Arabia, and #1 on Google for the generic Oman query. We are not on Google's first page for any product × country query, because Google ranks link authority for short product queries (1 referring domain against 10–41 for the sites ranking #1) and local directories for the other GCC countries. The website is technically complete; what is missing is off-site authority, reviews, and replies to the enquiries that already arrive.

## 3. Enquiry forecast (estimate, not a measurement)

Basis: ~14–21 genuine buyer RFQs per month on ~600–640 GSC clicks per 28 days (≈2.5–3% of clicks become a buyer RFQ; Bing and AI traffic add a share GA4 can't measure). GCC search volume outside Oman is small (`gcc-keyword-position-2026-11-08.md`), so most growth comes from Oman product queries.

| Scenario | What has to happen | Google clicks / 28 days | Buyer RFQs / month |
|---|---|---|---|
| A. Current course | GCC pages indexed, Bing and AI gains hold, no new links | 700–800 | **18–24** |
| B. Authority started | 10–15 directory listings live (dnb, gulfleads, fyndsupplier, findglocal, yellowpages-uae, bahrainyellowpagesonline, go4worldbusiness…), 15+ Google reviews; Oman product pages reach Google top 5 | 1,100–1,400 | **30–40** |
| C. #1 on Google for Oman products, top 3 in GCC revenue cells | ~30+ referring domains (omanchem's level), continuous reviews, 9–12 months | 1,800–2,500 | **45–65** |

Every scenario assumes enquiries are answered. Today 23 buyer RFQs since 1 October have no recorded contact, so the realised value of the current traffic is close to zero regardless of rank.

## 4. What decides the next step (in order)

1. **Reply to every enquiry within 24 hours** (sales). Start with the 23 open buyer RFQs: urea ×3, nitric 68% food grade, SLES and LABSA (1 FCL each), thinner raw materials 30 MT, calcium carbonate, solvent naphtha, isopropanol, acetone, ferrous sulphate, butyl glycol list, Shell/Castrol, lab-chemicals tender, BOQ.
2. **Directory listings** (user signs up, Claude fills from `product-citation-pack.md`, asks before submit). Competitors' backlinks come from exactly these.
3. **Google reviews** naming the product (repeat Bahrain/UAE cal-hypo and Saudi nitric buyers).
4. **Publish** the soda ash FAQ + Arabic description fixes on Develop (`85ea9d7`).
5. Claude, continuous: daily cycle (live checks, indexing quota, 25 Google cells), weekly AI + Bing + both AI reports, first Google read of the GCC pages ~11-17, Phase 9 re-read ~12-01 (after the core update).
