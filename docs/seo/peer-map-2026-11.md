# Peer map: who holds #1 where we are absent, and why. 2026-11

P10.1 of `MASTER-PLAN.md`. Sources: `location-ledger.md` (latest reading per Google/Bing cell, 10-24..11-08) for who holds #1; a read-only web profile of each non-network peer on 2026-11-08 (homepage + product page fetch, third-party mention searches; ~45 calls). Schema/JSON-LD could not be read for any peer (rendered text only): unverified. ensun.io (HTTP 429), madeinomangate (500) and omanagrifertilizer.com (expired TLS) could not be read.

## Who holds Google #1 (latest reading, ~70 cells)

| Group | Google #1 cells | Members |
|---|---|---|
| RXSOL network | 23 | omanchem.com 15, muscatchemical.com 5, soharchemical.com, salalahchemical.com, dubichem.com |
| gcoman.com | 4 | Oman generic, Rustaq, "chemical supplier in oman" from UAE |
| Local distributors | ~20 | deluxechemical (QA) 4, chemadd (KSA) 3, uvwater (OM) 3, nassguard (KSA) 2, kemipex (UAE) 2, alsanea (KW) 2, takweenchem, chemstock, dutcotennant, emveestech, fujairahchemical, innovacorporate, ooiss, omanagrifertilizer, safic-alcan |
| Directories | ~6 | yellowpages-uae 3, uaeyellowpagesonline, gulfyp, yellowpages.com.eg |
| Navigational / government | 2 | saudichemical.com, customs.gov.om |

Bing #1: omanchem 12, gcoman 8, yellowpages-uae 5, muscatchemical 5, ensun.io 3, chimisrl 3, alchemoraltd 3.

## Why each wins

**RXSOL network:** authority from its own sister sites (omanchem 41 referring domains, muscatchemical 16, gcoman ~1), exact-match city domains. See `nitric-acid-competitors-2026-10-19.md`. Lever: our referring domains (P8.A, P10.2).

**Local GCC distributors win on exact query wording, not authority.** Most have a thin third-party footprint:

| Peer | What wins it | Third-party listings found |
|---|---|---|
| chemadd.com.sa (KSA) | 15 city pages (`/chemical-supplier-riyadh/`, `-jeddah`, `-dammam`, `-jubail`…), ~650 words each, local framing and 5 FAQs; category pages "…supplier-saudi-arabia"; Lanxess distributor | none found |
| deluxechemical.com (QA) | H2 "Order Sodium Hypochlorite in Qatar"; ~500-word product pages | ensun.io |
| nassguard.sa (KSA) | city name in product slugs; "quote within 3 hours" | none found |
| kemipex.com (UAE) | title "Chemicals Suppliers in Dubai"; BASF/ISO principal proof | ensun.io, GulfTalent, ELID, data brokers |
| chemstock.ae (UAE) | exact-match domain; title "Chemical Companies in UAE / Dubai"; office pages incl. Muscat | Hanna Instruments partner page, yellowpages-uae |
| altaherchemicals.com (UAE) | old brand, Atotech distributor | yellowpages-uae, reachuae.com |
| alsanea.com (KW) | manufacturer since 1978 | ensun.io, Zawya, GulfTalent, Alibaba |
| uvwater.biz (OM) | **visible OMR prices**, "oman-muscat" in slugs | omanyp.com |
| innovacorporate.com (OM) | templated `/oman/<product>.html` keyword stuffing | sister domains |

What we already have that matches: `/chemicals/riyadh|jeddah|dammam|jubail|doha|kuwait…` location pages and the hubs. GSC shows them at position 8–10 for "near me" in KSA but absent for "chemical supplier riyadh". **Checked 11-08: it is not wording either.** `/chemicals/riyadh` already has the exact H1 "Chemical Supplier in Riyadh", 1,384 words, 30 Riyadh mentions and FAQs; chemadd's page is 1,035 words with a generic title ("Riyadh - Chemadd"). The difference is that chemadd has a **Riyadh head office** (Al Sali) and we are "From Oman". For in-country GCC queries Google prefers businesses located in that country, so on-page work will not close these cells. Where we can win outside Oman: cross-border phrasing ("supplier in oman" searched from UAE: already #1; "suppliers gcc": Bing #1), Bing (Doha 2, Jeddah 2, Kuwait City 4), and **through listings that hold #1** (ensun.io, yellowpages-uae).

## Listing targets (ranked: seen for ≥2 peers or holding page 1 itself)

1. **ensun.io**: Bing #1 for "chemical suppliers in" Saudi Arabia / Qatar / Kuwait; lists Kemipex, Deluxe, Al Sanea. Profiles look crawl-generated; claim/free/link status unverified (429). Check in Chrome.
2. **yellowpages-uae.com**: page 1 for Abu Dhabi, Sharjah, RAK, "caustic soda suppliers uae"; free business listing; website button only for verified listings.
3. **reachuae.com**: free "Standard Listing" (unverified). UAE.
4. **Yello network** (omanyp.com, saudiayp.com…): city category pages; uvwater listed. Usually free (unverified). OM + KSA.
5. **madeinomangate.com**: government-backed; factories; trader eligibility unverified.
6. **go4worldbusiness.com**: Oman nitric/hypochlorite traders listed; free basic tier.
7. **qataroilandgasdirectory.com**: Qatar chemicals category pages.
8. **Zawya / GulfTalent / Naukrigulf** employer pages: entity signal across the GCC.
9. **D-U-N-S** (feeds D&B, InfobelPRO): free number request.
10. **Supplier / principal partner pages**: ask our own manufacturers for a distributor-page link (chemstock gets one from Hanna Instruments). Cheapest real link.

## Patterns worth copying (within HANDOFF rules)

- **Indicative price** on a few hubs with `Offer` (`priceCurrency` OMR): only uvwater shows prices among Oman/GCC peers. Blocked on the user's numbers (P8.C2, P9.7).
- **Country wording in existing hub H2s** ("Order … in Qatar") rather than new pages.
- **Deeper city pages** on the existing location model (local industry, port, delivery route, 5 real FAQs), not mass product × city pages.
- **Quote-response promise** in the hero ("reply within 24 h"): needs the user to commit to the time.
- Not to copy: city names in every product slug (nassguard) or `/oman/<product>` templates (innovacorporate). Both are the mass pattern HANDOFF forbids.
