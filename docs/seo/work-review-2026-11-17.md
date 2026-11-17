# Review of the SEO / AEO / GEO / AIO / SXO work to date, 2026-11-17

The user asked for an independent check of everything done so far: what is sound, what was missed, where we stand and what to do next. Sources: the repo (Develop `b7280a7` + this session's fixes), a full production build of Develop, the live site, and the ledgers. Every number is labelled with its source and date.

## 1. Verdict

The technical and content-accuracy work is sound and safe to publish. A full production build of Develop passes, with:
- 0 pages carrying the homepage title
- 0 links to canonicalised pages
- 0 dead product links
- 0 orphan pages

**The main weakness is where the effort went, not its quality.** The last three sessions spent most of their time translating and correcting pages that get under 25 Google impressions a quarter. The items that decide ranking and leads are almost all owner actions and have not moved: reviews, listings, outreach, prices, lead follow-up, the homepage decision.

## 2. Position by layer

| Layer | Position | Source |
|---|---|---|
| SEO, Oman head terms | "chemical supplier(s) in oman" position 1.7–2.0, "in muscat" 1.9–3.2; 164 clicks / 7 days (+9%) | GSC 11-14, 11-17 |
| SEO, product terms | 0 of 25 tracked searches in the top 9; omanchem.com holds most | Ledger 11-17 (core update running) |
| SEO, GCC countries | Absent on Google; local distributors and directories hold page 1 | Ledger 11-17 |
| Bing | Nitric / hypochlorite / HCl 1st, caustic 4th, Oman generic 2nd | Ledger 11-13 |
| Maps | "chemical suppliers in oman" 4th–5th, 2 reviews (leaders have 10–19) | Maps 11-14, 11-15 |
| AEO | FAQs and schema on products, hubs and locations; 6,880 AI Overview / AI Mode impressions in 3 months | GSC-AI 11-14 |
| GEO | ChatGPT 1st (Oman), AI Mode 1st, Copilot 1st, Gemini does not name us; Perplexity 5th (11-13), now needs sign-in | AI tests 11-13, 11-15 |
| AIO (entity) | Single-source organisation data, llms.txt, CAS numbers; no Wikidata item; name collision with another Oman company | Repo, 11-14 review |
| SXO | 1.4% click rate at position 2 on the main term; homepage LCP 4.4 s; 2 reviews; 39 of 40 leads still "New" | GSC 11-14, CRM 11-14 |

## 3. What was done well

- **Independent fact-check on every batch.** It found real safety errors on about 60 pages: missing hazard classes, wrong doses, wrong applications.
- **Duplicate pages canonicalised** (31 in total), with redirects and hub links kept consistent.
- **Arabic:** full translations for about 115 products, with numbers and units verified by script.
- **Claims discipline:** NSF, potable, food and USP certifications are no longer asserted.

## 4. What was missed or weak, and what this review fixed

| # | Finding | Status |
|---|---|---|
| 1 | Rewritten pages said a potable / food / USP "certificate for each grade is available on request". That promises a document we have not confirmed exists (6 pages + the water hub NSF text) | **Fixed** (EN + AR): now "ask us whether a certified grade is available" |
| 2 | Barium chloride: the short description, keywords, an alternative name and the oilfield hub group still sold it as a drilling brine, which the corrected page says it is not | **Fixed** (EN + AR, hub group moved to water chemistry) |
| 3 | Two FAQ answers contradicted the corrected pages: plain activated carbon removing mercury and "oil spill response"; ammonium bisulphite "lower cost, lower pH effect" | **Fixed** |
| 4 | Marketing words left in two short descriptions used as search snippets (PAC liquid "superior", mineral spirits "high-quality") | **Fixed** (EN + AR) |
| 5 | The rewrite template adds four business statements to every page: "from stock in Muscat", "every delivery carries a certificate of analysis", "certificate of origin", "2–3 days to Salalah and Duqm". The reviewers flagged that several old pages did not say these. Now on about 110 pages | **Owner must confirm once** (question A1) |
| 6 | Develop had not been built with prerendering since Publish #17 (43 commits) | **Done now:** build passes, audits clean |
| 7 | Owner questions scattered over about 20 log lines; nobody could answer them in that form | **Fixed:** one sheet, `owner-questions-2026-11-17.md` |
| 8 | Blog work from the 11-15 scorecard never started: 0 of 24 posts has a comparison table, none opens with a 40–60-word answer, and `dateModified` is fixed to the publish date | **Open, next for Claude** (section 5) |
| 9 | 102 of 248 live product pages still use the old one-paragraph template; 56 have short Arabic. 34 are formulated blends that need data sheets | Open; blends blocked on the owner |
| 10 | Arabic spelling of "glycol" is split (59 × جلايكول, 60 × جليكول), sometimes on one page | Open, low priority |
| 11 | Remaining FAQ claims that are business facts: acetic acid grades and ≥99.85%; KOH pellets; TEG "99.5%+" | Owner questions |
| 12 | GitHub CI status cannot be read from this machine (GitHub CLI not signed in) | Open: `gh auth login` or check the Actions tab |
| 13 | Cloud daily routine has failed every day since 10-28 (network block on gcoman.com) | Owner: allow gcoman.com in the routine's environment |

## 5. Improvement plan, ranked by expected effect on leads

**Owner (decides ranking; none can be done by Claude alone):**
1. Publish Develop (say "publish").
2. Reviews: ask 15 customers; 2 → 15 moves Maps and the AI answers that read Maps.
3. Listings: sign up at ensun.io, yellowpages-uae, go4worldbusiness, Brownbook, Cybo; Claude fills each profile.
4. Work the 39 open leads and deploy the `submit-contact` function from Lovable.
5. Answer the owner-question sheet, starting with section A.
6. Homepage decision: title/snippet for cross-border buyers and the 4.4 s LCP.
7. Price bands and lead times (the only first-party data competitors cannot copy).
8. Wikidata item (yes/no), D-U-N-S request, Bing Webmaster access.

**Claude (Develop, each fact-checked):**
1. Blog: the three posts with real demand (lubricants guide, top suppliers guide, MEG vs DEG). Add a 40–60-word answer first, question headings, one comparison table each, and a real "updated" date.
2. Finish Arabic for the 8 remaining water/oil pages, then the old-template commodity pages in other categories by demand.
3. Rewrite the 34 blends once data sheets arrive.
4. Re-read rankings about 12-01, after the core update, and compare with the 11-09 baseline.
