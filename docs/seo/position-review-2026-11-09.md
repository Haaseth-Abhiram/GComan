# Position review and strategy, 2026-11-09

The user asked: where do we stand on SEO / AEO / GEO everywhere, are enquiries coming in, is anything missing, how do we compare with peers, and what is the strategy. Every number below was read today (readings in `location-ledger.md` and `visibility-ledger.md`, 2026-11-09). Production is still Publish #9 (`psr2.4b884bd9`). Develop is 20 commits ahead: the revenue country pages and 975 product corrections are not live yet.

## 1. Scoreboard

| Surface | Where we stand | Who is #1 |
|---|---|---|
| Google, "chemical suppliers in oman" | **#1** | us |
| Google, "chemical company in oman" / "chemical suppliers muscat" | #3 / #3 | omanchem / muscatchemical |
| Google, product × Oman (nitric, hypochlorite, HCl, caustic, cal-hypo, urea, pool, water treatment, lubricants, oilfield) | absent from top 9; lab chemicals #8 | omanchem on 8 of 11 |
| Google, UAE / Saudi / Bahrain / Qatar (generic + revenue products) | absent from top 9 | local stockists: nassguard.sa (Saudi nitric), dutcotennant / dubichem (UAE cal-hypo), bahrainyellowpagesonline (Bahrain cal-hypo) |
| Bing, Oman | chemical suppliers 4 (was 1–2 in Oct), **HCl 1**, caustic 4, nitric — (was 1) | omanchem |
| Bing, GCC revenue cells | absent | chimisrl, hazchem.ae, gobalchemicalsplus |
| Google AI Mode, "best chemical suppliers in Oman" | **named first** | us |
| Perplexity | **first** for Oman; third ("bulk GCC") for Saudi nitric; mentioned for cal-hypo Bahrain | Nassguard (Saudi nitric) |
| ChatGPT (logged out) | **2nd** | Oman Chemical |
| Google Maps, Muscat "chemical suppliers" | 6th | Green Port Chemical Suppliers (keyword in the business name) |
| GSC, 28 days | 648 clicks (+31%), 9.75K impressions (+8%), CTR 6.6%; Oman clicks 311 (+61%) | — |

## 2. Enquiries: the biggest gap is response, not traffic

Zoho CRM, 90 days: 82 leads (Aug 18, Sep 33, Oct 23, Nov 1–9 8), 71 from the website form. The website is producing buyer RFQs from product pages (urea ×4, nitric 68% food grade, LABSA 1 FCL, SLES, xylene + butyl acetate 30 MT, calcium carbonate 25 MT, isopropanol, acetone, solvent naphtha, butyl glycol, Castrol, Shell grease, a BOQ). **Of the 31 leads since 1 October, 30 are still "New – Website Enquiry" — about 20 genuine RFQs have no recorded contact.** August–September leads were worked (contacted, proposals sent). The country field is blank on 76 of 82 leads.

## 3. Why we are not #1 for products and other countries

- **Authority, not content:** omanchem / muscatchemical / soharchemical (one operator) run 8–16K-page catalogues on sister domains that link to each other; omanchem had 41 referring domains vs our ~1 (Bing WMT, 10-19). Our product pages answer better (AI engines pick us) but Google ranks link authority for short product queries.
- **Other countries reward local presence:** every UAE/Saudi/Bahrain #1 is an in-country stockist or a local directory page. Directories (yellowpages-uae, bahrainyellowpagesonline, go4worldbusiness) rank directly for our revenue products.
- **Bing slipped in Oman** (nitric 1 → absent, generic 1–2 → 4) since late October; the Bing Places categories were wiped once by the phone-number sync (10-21) and Bing WMT has not been checked since.
- **Maps:** competitors ahead have keyword business names and more reviews; we have few reviews.

## 4. Strategy, in order of return

1. **Answer every enquiry within 24 hours** (owner: user/sales). Work the ~20 open RFQs now. Optional (needs the user's go-ahead): a Zoho CRM auto-acknowledgement + assignment rule, and a country field on the form.
2. **Publish** (user says "publish"): calcium-hypochlorite UAE/Bahrain, caustic + HCl UAE/Saudi, Arabic hypochlorite + caustic hubs, 975 product corrections. Then GSC + Bing submit, IndexNow.
3. **Citations where the revenue is** (user signs up, Claude fills from `product-citation-pack.md`): yellowpages-uae (cal-hypo, caustic, HCl), bahrainyellowpagesonline (cal-hypo, TCCA), go4worldbusiness (nitric to Saudi, cal-hypo), ensun.io. These pages rank on their own and lift ours.
4. **Reviews + GBP**: ask each repeat customer (Bahrain/UAE cal-hypo buyers, Saudi nitric buyers, Sohar plant) for a Google review naming the product; add GBP Products for nitric, cal-hypo, caustic, HCl, urea.
5. **Bing recovery**: user signs in to Bing Webmaster (Google OAuth) → Claude checks crawl/index, re-submits, verifies Bing Places categories.
6. **Keep the AI lead**: AI Mode and Perplexity already name us first; publish the country pages so Saudi/UAE AI answers have a GCC page to cite.
7. **Urea**: the most-requested product on the form (4 RFQs in 8 weeks) and high Trends demand — candidate for the next revenue page if it converts.

## 5. What is not missing

Technical SEO/GEO is complete and healthy: all 67 published location/hub pages pass the GPTBot check (title, canonical, hreflang, visible FAQ, NAP); llms.txt, sitemap, Arabic indexing and structured data are in sync. More code will not move Google product rankings; the levers above are commercial and off-site.
