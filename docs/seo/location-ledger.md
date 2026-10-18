# Location ledger — every city, country and product hub × engine

Append-only. One row per check per run, written by the `running-search-operations` skill (agent: `search-sweeper`). The panel comes from `npm run panel:locations`, which derives it from `src/data/locationIndex.ts` + `public/sitemap.xml`, so it never drifts from the site.

**Reading rules:**
- **our rank** is the first `gcoman.com` organic result, or `—` if absent from the top 20 (Google) / top 10 (Bing).
- **our URL** is filled in only when a different gcoman page ranks than the target.
- Google is fetched unpersonalised (`pws=0 gl=XX`). Bing is read rendered (`cc=XX`). Maps uses the Oman city viewport.
- `n/m` = not measured. `captcha` = Google stopped serving results.
- Compare a cell only with the previous reading of the same cell. Act on a move only once it has shown up in two consecutive readings (skill Step 5).

| date | engine | query | target page | our rank | our URL (if not target) | #1 domain | state |
|---|---|---|---|---|---|---|---|
| 2026-10-18 | google | chemical supplier muscat | /chemicals/muscat | 3 | / | muscatchemical.com | pws=0 gl=om (top ~9 returned) |
| 2026-10-18 | google | chemical supplier rusayl | /chemicals/rusayl | — |  | gulfyp.com | pws=0 gl=om (top ~9 returned) |
| 2026-10-18 | google | chemical supplier sohar | /chemicals/sohar | — |  | soharchemical.com | pws=0 gl=om (top ~9 returned) |
| 2026-10-18 | google | chemical supplier rustaq | /chemicals/rustaq | 2 |  | muscatchemical.com | pws=0 gl=om (top ~9 returned) |
| 2026-10-18 | google | chemical supplier salalah | /chemicals/salalah | 4 | / | salalahchemical.com | pws=0 gl=om (top ~9 returned) |
| 2026-10-18 | google | chemical supplier duqm | /chemicals/duqm | 3 | / | omanchem.com | pws=0 gl=om (top ~9 returned) |
| 2026-10-18 | google | chemical supplier dubai | /chemicals/dubai | — |  | kemipex.com | pws=0 gl=ae (top ~9 returned) |
| 2026-10-18 | google | chemical supplier abu dhabi | /chemicals/abu-dhabi | — |  | yellowpages-uae.com | pws=0 gl=ae (top ~9 returned) |
| 2026-10-18 | google | chemical supplier sharjah | /chemicals/sharjah | — |  | oxymedz.com | pws=0 gl=ae (top ~9 returned) |
| 2026-10-18 | google | chemical supplier fujairah | /chemicals/fujairah | — |  | fujairahchemical.com | pws=0 gl=ae (top ~9 returned) |
| 2026-10-18 | google | chemical supplier ras al khaimah | /chemicals/ras-al-khaimah | — |  | yellowpages-uae.com | pws=0 gl=ae (top ~9 returned) |
| 2026-10-18 | google | chemical supplier riyadh | /chemicals/riyadh | — |  | fouz.com.sa | pws=0 gl=sa (top ~9 returned) |
| 2026-10-18 | google | chemical supplier jeddah | /chemicals/jeddah | — |  | fouz.com.sa | pws=0 gl=sa (top ~9 returned) |
| 2026-10-18 | google | chemical supplier dammam | /chemicals/dammam | — |  | nassguard.sa | pws=0 gl=sa (top ~9 returned) |
| 2026-10-18 | google | chemical supplier jubail | /chemicals/jubail | — |  | schem.com | pws=0 gl=sa (top ~9 returned) |
| 2026-10-18 | google | chemical supplier yanbu | /chemicals/yanbu | 7 |  | echemi.com | pws=0 gl=sa (top ~9 returned) |
| 2026-10-18 | google | chemical supplier doha | /chemicals/doha | — |  | deluxechemical.com | pws=0 gl=qa (top ~9 returned) |
| 2026-10-18 | google | chemical supplier kuwait city | /chemicals/kuwait-city | — |  | lookchem.com | pws=0 gl=kw (top ~9 returned) |
| 2026-10-18 | google | chemical supplier bahrain | /chemicals/bahrain | — |  | safic-alcan.com | pws=0 gl=bh (top ~9 returned) |
| 2026-10-18 | google | chemical supplier baghdad | /chemicals/baghdad | — |  | lookchem.com | pws=0 gl=iq (top ~9 returned) |
| 2026-10-18 | google | chemical supplier amman | /chemicals/amman | 1 |  | gcoman.com | pws=0 gl=jo (top ~9 returned) |
| 2026-10-18 | google | chemical supplier cairo | /chemicals/cairo | 5 |  | secaforchem.com | pws=0 gl=eg (top ~9 returned) |
| 2026-10-18 | google | chemical suppliers in kuwait | /chemicals/kuwait | — |  | albarrakchem.com | pws=0 gl=kw (top ~9 returned) |
| 2026-10-18 | google | chemical suppliers in qatar | /chemicals/qatar | — |  | deluxechemical.com | pws=0 gl=qa (top ~9 returned) |
| 2026-10-18 | google | chemical suppliers in saudi arabia | /chemicals/saudi-arabia | — |  | afi.com.sa | pws=0 gl=sa (top ~9 returned) |
| 2026-10-18 | bing | chemical supplier muscat | /chemicals/muscat | 5 | / | muscatchemical.com | cc=om rendered |
| 2026-10-18 | bing | chemical supplier rusayl | /chemicals/rusayl | 1 |  | gcoman.com | cc=om rendered |
| 2026-10-18 | bing | chemical supplier sohar | /chemicals/sohar | 2 |  | soharchemical.com | cc=om rendered |
| 2026-10-18 | bing | chemical supplier rustaq | /chemicals/rustaq | 1 |  | gcoman.com | cc=om rendered |
| 2026-10-18 | bing | chemical supplier salalah | /chemicals/salalah | 4 |  | salalahchemical.com | cc=om rendered |
| 2026-10-18 | bing | chemical supplier duqm | /chemicals/duqm | 2 |  | stabilityline.com | cc=om rendered |
| 2026-10-18 | bing | chemical supplier dubai | /chemicals/dubai | — |  | yellowpages-uae.com | cc=ae rendered |
| 2026-10-18 | bing | chemical supplier abu dhabi | /chemicals/abu-dhabi | — |  | yellowpages-uae.com | cc=ae rendered |
| 2026-10-18 | bing | chemical supplier sharjah | /chemicals/sharjah | — |  | sharjahchemical.com | cc=ae rendered |
| 2026-10-18 | bing | chemical supplier fujairah | /chemicals/fujairah | — |  | fujairahchemical.com | cc=ae rendered |
| 2026-10-18 | bing | chemical supplier ras al khaimah | /chemicals/ras-al-khaimah | — |  | yellowpages-uae.com | cc=ae rendered |
| 2026-10-18 | bing | chemical supplier riyadh | /chemicals/riyadh | — |  | chimisrl.com | cc=sa rendered |
| 2026-10-18 | bing | chemical supplier jeddah | /chemicals/jeddah | 6 |  | alchemoraltd.com | cc=sa rendered |
| 2026-10-18 | bing | chemical supplier dammam | /chemicals/dammam | — |  | nassguard.sa | cc=sa rendered |
| 2026-10-18 | bing | chemical supplier jubail | /chemicals/jubail | 3 |  | nawahchem.com | cc=sa rendered |
| 2026-10-18 | bing | chemical supplier yanbu | /chemicals/yanbu | 5 |  | alchemoraltd.com | cc=sa rendered |
| 2026-10-18 | bing | chemical supplier doha | /chemicals/doha | — |  | chemspirechemical.com | cc=qa rendered |
| 2026-10-18 | bing | chemical supplier kuwait city | /chemicals/kuwait-city | 5 |  | skchemicaltraders.com | cc=kw rendered |
| 2026-10-18 | bing | chemical supplier bahrain | /chemicals/bahrain | — |  | alkhalidiagroup.com | cc=bh rendered |
| 2026-10-18 | bing | chemical supplier baghdad | /chemicals/baghdad | 2 |  | skchemicaltraders.com | cc=iq rendered |
| 2026-10-18 | bing | chemical supplier amman | /chemicals/amman | 6 |  | chemicalbusinessdirectory.com | cc=jo rendered |
| 2026-10-18 | bing | chemical supplier cairo | /chemicals/cairo | 4 |  | madeinegypt.com | cc=eg rendered |
| 2026-10-18 | bing | chemical suppliers in kuwait | /chemicals/kuwait | — |  | ensun.io | cc=kw rendered |
| 2026-10-18 | bing | chemical suppliers in qatar | /chemicals/qatar | — |  | ensun.io | cc=qa rendered |
| 2026-10-18 | bing | chemical suppliers in saudi arabia | /chemicals/saudi-arabia | — |  | ensun.io | cc=sa rendered |
| 2026-10-18 | bing | chemical suppliers in uae | /chemicals/uae | — |  | yellowpages-uae.com | cc=ae rendered |
| 2026-10-18 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | cc=om rendered |
| 2026-10-18 | bing | chemical suppliers gcc | /chemical-suppliers-middle-east | 1 |  | gcoman.com | cc=om rendered |
| 2026-10-18 | bing | caustic soda supplier oman | /chemical-supplier/caustic-soda-oman | 3 |  | muscatchemical.com | cc=om rendered |
| 2026-10-18 | bing | fertilizer supplier oman | /chemical-supplier/fertilizers-oman | 3 |  | muscatfertilizer.net | cc=om rendered |
| 2026-10-18 | bing | hydrochloric acid supplier oman | /chemical-supplier/hydrochloric-acid-oman | 1 |  | gcoman.com | cc=om rendered |
| 2026-10-18 | bing | laboratory chemicals supplier oman | /chemical-supplier/laboratory-chemicals-oman | 1 | /products/lab-chemicals | gcoman.com | cc=om rendered |
| 2026-10-18 | bing | nitric acid supplier bahrain | /chemical-supplier/nitric-acid-bahrain | 1 |  | gcoman.com | cc=bh rendered |
| 2026-10-18 | bing | nitric acid supplier kuwait | /chemical-supplier/nitric-acid-kuwait | — |  | chimisrl.com | cc=kw rendered |
| 2026-10-18 | bing | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | 1 |  | gcoman.com | cc=om rendered |
| 2026-10-18 | bing | nitric acid supplier qatar | /chemical-supplier/nitric-acid-qatar | 6 |  | deluxechemical.com | cc=qa rendered |
| 2026-10-18 | bing | nitric acid supplier saudi arabia | /chemical-supplier/nitric-acid-saudi-arabia | — |  | chimisrl.com | cc=sa rendered |
| 2026-10-18 | bing | nitric acid supplier uae | /chemical-supplier/nitric-acid-uae | 7 |  | chemstock.ae | cc=ae rendered |
| 2026-10-18 | bing | oilfield chemicals supplier oman | /chemical-supplier/oilfield-chemicals-oman | 3 |  | shaktichemicals.com | cc=om rendered |
| 2026-10-18 | bing | poly aluminium chloride supplier oman | /chemical-supplier/poly-aluminium-chloride-oman | 4 | /products/inorganic/poly-aluminum-chloride | omanchem.com | cc=om rendered |
| 2026-10-18 | bing | sodium hypochlorite supplier oman | /chemical-supplier/sodium-hypochlorite-oman | 2 |  | omanchem.com | cc=om rendered |
| 2026-10-18 | maps | chemical supplier | /chemicals/muscat | 7 | | REDALAB (Muscat) | muscat viewport, signed in |
| 2026-10-18 | maps | chemical supplier | /chemicals/rusayl | — | | REDALAB (Muscat) | rusayl viewport, signed in |
| 2026-10-18 | maps | chemical supplier | /chemicals/sohar | — | | MAK Sohar Chemical Industries LLC | sohar viewport, signed in |
| 2026-10-18 | maps | chemical supplier | /chemicals/rustaq | — | | X PERT INDUSTRIAL MATERIALS TRDG LLC | rustaq viewport, signed in |
| 2026-10-18 | maps | chemical supplier | /chemicals/salalah | — | | AL FARZAH TRAD. CO. (L.L.C.) | salalah viewport, signed in |
| 2026-10-18 | maps | chemical supplier | /chemicals/duqm | — | | Sebacic Oman | duqm viewport, signed in |
