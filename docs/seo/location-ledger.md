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
| 2026-10-18 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om (investigation) |
| 2026-10-18 | google | chemical suppliers in oman | /chemical-suppliers-oman | 1 | / | gcoman.com | pws=0 gl=om (investigation) |
| 2026-10-18 | google | chemical company oman | / | 15 | / | omanchem.com | pws=0 gl=om, page 2 (investigation) |
| 2026-10-18 | google | oman chemical | / | — | | omanchem.com | pws=0 gl=om (investigation) |
| 2026-10-18 | google | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — | | omanchem.com | pws=0 gl=om (investigation) |
| 2026-10-18 | google | nitric acid sohar | /chemical-supplier/nitric-acid-oman | — (page 2 n/m) | | omanchem.com | pws=0 gl=om (investigation) |
| 2026-10-18 | google | nitric acid muscat | /chemical-supplier/nitric-acid-oman | 9 | | uvwater.biz | pws=0 gl=om (investigation) |
| 2026-10-19 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om |
| 2026-10-19 | google | chemical suppliers in oman | / | 1 | | gcoman.com | pws=0 gl=om (blog top-chemical-suppliers-oman-2026 at 8) |
| 2026-10-19 | google | chemical supplier muscat | /chemicals/muscat | 3 | / | muscatchemical.com | pws=0 gl=om |
| 2026-10-19 | google | chemical company oman | / | — | | omanchem.com | pws=0 gl=om (top 7) |
| 2026-10-19 | google | chemical suppliers in uae | /chemicals/uae | — | | yellowpages-uae.com | pws=0 gl=ae (top 8) |
| 2026-10-19 | google | chemical suppliers gcc | /chemical-suppliers-middle-east | 1 | / | gcoman.com | pws=0 gl=om |
| 2026-10-19 | google | caustic soda supplier oman | /chemical-supplier/caustic-soda-oman | — | | omanchem.com | pws=0 gl=om (read earlier today) |
| 2026-10-19 | google | fertilizer supplier oman | /chemical-supplier/fertilizers-oman | — | | omanagrifertilizer.com | pws=0 gl=om (top 9) |
| 2026-10-19 | google | hydrochloric acid supplier oman | /chemical-supplier/hydrochloric-acid-oman | — | | omanchem.com | pws=0 gl=om (read earlier today) |
| 2026-10-19 | google | laboratory chemicals supplier oman | /chemical-supplier/laboratory-chemicals-oman | 2 | / | omanchem.com | pws=0 gl=om (homepage ranks, hub absent) |
| 2026-10-19 | google | nitric acid supplier bahrain | /chemical-supplier/nitric-acid-bahrain | — | | n/m | pws=0 gl=bh (read earlier today) |
| 2026-10-19 | google | nitric acid supplier kuwait | /chemical-supplier/nitric-acid-kuwait | — | | n/m | pws=0 gl=kw (read earlier today) |
| 2026-10-19 | google | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | 18 | / | omanchem.com | pws=0 gl=om, paginated (read earlier today) |
| 2026-10-19 | google | nitric acid supplier qatar | /chemical-supplier/nitric-acid-qatar | — | | n/m | pws=0 gl=qa (read earlier today; page not indexed, requested today) |
| 2026-10-19 | google | nitric acid supplier saudi arabia | /chemical-supplier/nitric-acid-saudi-arabia | — | | n/m | pws=0 gl=sa (read earlier today) |
| 2026-10-19 | google | nitric acid supplier uae | /chemical-supplier/nitric-acid-uae | — | | n/m | pws=0 gl=ae (read earlier today) |
| 2026-10-19 | google | oilfield chemicals supplier oman | /chemical-supplier/oilfield-chemicals-oman | — | | muscatchemical.com | pws=0 gl=om (top 9) |
| 2026-10-19 | google | poly aluminium chloride supplier oman | /chemical-supplier/poly-aluminium-chloride-oman | — | | omanchem.com | pws=0 gl=om (top 9) |
| 2026-10-19 | google | sodium hypochlorite supplier oman | /chemical-supplier/sodium-hypochlorite-oman | — | | omanchem.com | pws=0 gl=om (top 9) |
| 2026-10-19 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / (target at 3) | omanchem.com | cc=om |
| 2026-10-19 | bing | chemical suppliers in oman | / | 2 | | omanchem.com | cc=om (target page at 3) |
| 2026-10-19 | bing | chemical supplier muscat | /chemicals/muscat | 3 | | muscatchemical.com | cc=om (also 5 /chemical-suppliers-oman, 6 /) |
| 2026-10-19 | bing | chemical company oman | / | 7 | | omanchem.com | cc=om |
| 2026-10-20 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om |
| 2026-10-20 | google | chemical suppliers in oman | / | 1 | | gcoman.com | pws=0 gl=om |
| 2026-10-20 | google | chemical company oman | / | — | | omanchem.com | pws=0 gl=om (top 8) |
| 2026-10-20 | google | chemical supplier muscat | /chemicals/muscat | 3 | / | muscatchemical.com | pws=0 gl=om |
| 2026-10-20 | google | chemical supplier rusayl | /chemicals/rusayl | — | | gulfyp.com | pws=0 gl=om (top 8) |
| 2026-10-20 | google | chemical supplier sohar | /chemicals/sohar | — | | soharchemical.com | pws=0 gl=om (top 9) |
| 2026-10-20 | google | chemical supplier rustaq | /chemicals/rustaq | 2 | | muscatchemical.com | pws=0 gl=om |
| 2026-10-20 | google | chemical supplier salalah | /chemicals/salalah | 4 | / | salalahchemical.com | pws=0 gl=om |
| 2026-10-20 | google | chemical supplier duqm | /chemicals/duqm | 3 | / | omanchem.com | pws=0 gl=om |
| 2026-10-20 | google | chemical supplier dubai | /chemicals/dubai | — | | kemipex.com | pws=0 gl=ae (top 9) |
| 2026-10-20 | google | chemical supplier abu dhabi | /chemicals/abu-dhabi | — | | ocetgulf.com | pws=0 gl=ae (top 8) |
| 2026-10-20 | google | chemical supplier sharjah | /chemicals/sharjah | — | | yellowpages-uae.com | pws=0 gl=ae (top 8) |
| 2026-10-20 | google | chemical supplier fujairah | /chemicals/fujairah | — | | fujairahchemical.com | pws=0 gl=ae (top 8) |
| 2026-10-20 | google | chemical supplier ras al khaimah | /chemicals/ras-al-khaimah | — | | yellowpages-uae.com | pws=0 gl=ae (top 8) |
| 2026-10-20 | google | chemical supplier riyadh | /chemicals/riyadh | — | | fouz.com.sa | pws=0 gl=sa (top 9) |
| 2026-10-20 | google | chemical supplier jeddah | /chemicals/jeddah | — | | fouz.com.sa | pws=0 gl=sa (top 9) |
| 2026-10-20 | google | chemical supplier dammam | /chemicals/dammam | — | | fouz.com.sa | pws=0 gl=sa (top 8) |
| 2026-10-20 | google | chemical supplier jubail | /chemicals/jubail | — | | schem.com | pws=0 gl=sa (top 9) |
| 2026-10-20 | google | chemical supplier yanbu | /chemicals/yanbu | 7 | | echemi.com | pws=0 gl=sa |
| 2026-10-20 | google | chemical supplier doha | /chemicals/doha | — | | deluxechemical.com | pws=0 gl=qa (top 8) |
| 2026-10-20 | google | chemical supplier kuwait city | /chemicals/kuwait-city | — | | lookchem.com | pws=0 gl=kw (top 9) |
| 2026-10-20 | google | chemical supplier bahrain | /chemicals/bahrain | — | | safic-alcan.com | pws=0 gl=bh (top 9) |
| 2026-10-20 | google | chemical supplier baghdad | /chemicals/baghdad | n/m | | n/m | skipped (export-only lane; 25-fetch cap) |
| 2026-10-20 | google | chemical supplier amman | /chemicals/amman | n/m | | n/m | skipped (export-only lane; 25-fetch cap) |
| 2026-10-20 | google | chemical supplier cairo | /chemicals/cairo | n/m | | n/m | skipped (export-only lane; 25-fetch cap) |
| 2026-10-20 | google | chemical suppliers in kuwait | /chemicals/kuwait | — | | albarrakchem.com | pws=0 gl=kw (top 8) |
| 2026-10-20 | google | chemical suppliers in qatar | /chemicals/qatar | — | | deluxechemical.com | pws=0 gl=qa (top 8) |
| 2026-10-20 | google | chemical suppliers in saudi arabia | /chemicals/saudi-arabia | — | | afi.com.sa | pws=0 gl=sa (top 8) |
| 2026-10-20 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / (target at 3) | omanchem.com | cc=om |
| 2026-10-20 | bing | chemical suppliers in oman | / | 2 | | omanchem.com | cc=om (target page at 3) |
| 2026-10-20 | bing | chemical supplier muscat | /chemicals/muscat | 3 | | muscatchemical.com | cc=om (also 5, 6) |
| 2026-10-20 | bing | chemical company oman | / | 7 | | omanchem.com | cc=om |
| 2026-10-22 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om |
| 2026-10-22 | google | chemical suppliers in oman | / | 1 |  | gcoman.com | pws=0 gl=om |
| 2026-10-22 | google | chemical company oman | / | — |  | omanchem.com | pws=0 gl=om (top 7) |
| 2026-10-22 | google | chemical supplier muscat | /chemicals/muscat | 3 | / | muscatchemical.com | pws=0 gl=om |
| 2026-10-22 | google | chemical supplier rusayl | /chemicals/rusayl | — |  | gulfyp.com | pws=0 gl=om (top 9) |
| 2026-10-22 | google | chemical supplier sohar | /chemicals/sohar | — |  | soharchemical.com | pws=0 gl=om (top 9) |
| 2026-10-22 | google | chemical supplier rustaq | /chemicals/rustaq | 2 | / (was target page on 10-20) | muscatchemical.com | pws=0 gl=om |
| 2026-10-22 | google | chemical supplier salalah | /chemicals/salalah | 2 | / | salalahchemical.com | pws=0 gl=om (was 4) |
| 2026-10-22 | google | chemical supplier duqm | /chemicals/duqm | 3 | / | omanchem.com | pws=0 gl=om |
| 2026-10-22 | google | chemical supplier dubai | /chemicals/dubai | — |  | kemipex.com | pws=0 gl=ae (top 9) |
| 2026-10-22 | google | chemical supplier abu dhabi | /chemicals/abu-dhabi | — |  | ocetgulf.com | pws=0 gl=ae (top 8) |
| 2026-10-22 | google | chemical supplier sharjah | /chemicals/sharjah | — |  | oxymedz.com | pws=0 gl=ae (top 8) |
| 2026-10-22 | google | chemical supplier fujairah | /chemicals/fujairah | — |  | fujairahchemical.com | pws=0 gl=ae (top 7) |
| 2026-10-22 | google | chemical supplier ras al khaimah | /chemicals/ras-al-khaimah | — |  | yellowpages-uae.com | pws=0 gl=ae (top 8) |
| 2026-10-22 | google | chemical supplier riyadh | /chemicals/riyadh | — |  | fouz.com.sa | pws=0 gl=sa (top 9) |
| 2026-10-22 | google | chemical supplier jeddah | /chemicals/jeddah | — |  | fouz.com.sa | pws=0 gl=sa (top 8) |
| 2026-10-22 | google | chemical supplier dammam | /chemicals/dammam | — |  | fouz.com.sa | pws=0 gl=sa (top 8) |
| 2026-10-22 | google | chemical supplier jubail | /chemicals/jubail | — |  | schem.com | pws=0 gl=sa (top 8) |
| 2026-10-22 | google | chemical supplier yanbu | /chemicals/yanbu | — |  | echemi.com | pws=0 gl=sa (top 8; was 7) |
| 2026-10-22 | google | chemical supplier doha | /chemicals/doha | — |  | deluxechemical.com | pws=0 gl=qa (top 8) |
| 2026-10-22 | google | chemical supplier kuwait city | /chemicals/kuwait-city | — |  | lookchem.com | pws=0 gl=kw (top 9) |
| 2026-10-22 | google | chemical supplier bahrain | /chemicals/bahrain | — |  | safic-alcan.com | pws=0 gl=bh (top 9) |
| 2026-10-22 | google | chemical supplier baghdad | /chemicals/baghdad | n/m |  | n/m | skipped (export-only lane) |
| 2026-10-22 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / (target at 3) | omanchem.com | cc=om |
| 2026-10-22 | bing | chemical suppliers in oman | / | 2 | /chemical-suppliers-oman (homepage at 3) | omanchem.com | cc=om |
| 2026-10-22 | bing | chemical supplier muscat | /chemicals/muscat | 3 |  | muscatchemical.com | cc=om (blog at 4) |
| 2026-10-22 | bing | chemical company oman | / | 6 |  | omanchem.com | cc=om (was 7) |
| 2026-10-22 | google | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om (top 9; 10-20 homepage at 18) |
| 2026-10-22 | google | nitric acid oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om (top 9) |
| 2026-10-22 | google | nitric acid supplier in muscat | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om (top 9) |
| 2026-10-22 | bing | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | 2 |  | omanchem.com | cc=om (was 1 on 10-20) |
| 2026-10-22 | bing | nitric acid oman | /chemical-supplier/nitric-acid-oman | 1 | + lab page at 2 | gcoman.com | cc=om (=) |
| 2026-10-22 | bing | nitric acid price oman | /chemical-supplier/nitric-acid-oman | 1 |  | gcoman.com | cc=om (=) |
| 2026-10-22 | bing | nitric acid supplier muscat | /chemical-supplier/nitric-acid-oman | 2 |  | muscatchemical.com | cc=om (was —) |
| 2026-10-22 | bing | nitric acid supplier sohar | /chemical-supplier/nitric-acid-oman | 5 |  | soharchemical.com | cc=om (was 9) |
| 2026-10-22 | bing | nitric acid supplier salalah | /chemical-supplier/nitric-acid-oman | 3 | /chemicals/salalah | salalahchemical.com | cc=om (was —) |
| 2026-10-22 | bing | nitric acid supplier uae | /chemical-supplier/nitric-acid-uae | 9 |  | yellowpages-uae.com | cc=ae (was 7) |
| 2026-10-22 | bing | nitric acid supplier dubai | /chemical-supplier/nitric-acid-uae | — |  | yellowpages-uae.com | cc=ae (was 6) |
| 2026-10-22 | bing | nitric acid supplier saudi arabia | /chemical-supplier/nitric-acid-saudi-arabia | — |  | chimisrl.com | cc=sa (=) |
| 2026-10-22 | bing | nitric acid supplier qatar | /chemical-supplier/nitric-acid-qatar | 7 |  | deluxechemical.com | cc=qa (was —) |
| 2026-10-22 | bing | nitric acid supplier kuwait | /chemical-supplier/nitric-acid-kuwait | — |  | chimisrl.com | cc=kw (=) |
| 2026-10-22 | bing | nitric acid supplier bahrain | /chemical-supplier/nitric-acid-bahrain | 1 | + /chemicals/bahrain at 6 | gcoman.com | cc=bh (=) |
| 2026-10-22 | maps | nitric acid supplier | Global Chemicals LLC | 1 organic |  | REDALAB (sponsored) | Muscat 23.588,58.383 11z (=) |
| 2026-10-22 | maps | nitric acid supplier | Global Chemicals LLC | — |  | Fujairah Chemical | Sohar 24.347,56.709 11z (=) |
| 2026-10-22 | perplexity | best nitric acid supplier in Oman | — | 1st | "strongest option"; still quotes old phone | gcoman.com | signed in (=) |
| 2026-10-22 | chatgpt | best nitric acid supplier in Oman | — | 1st | new phone quoted | gcoman.com | logged out (was not named 10-20) |
| 2026-10-24 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om (=) |
| 2026-10-24 | google | chemical suppliers in oman | / | 1 |  | gcoman.com | pws=0 gl=om (=) |
| 2026-10-24 | google | chemical company oman | / | — |  | omanchem.com | pws=0 gl=om (=) |
| 2026-10-24 | google | chemical supplier muscat | /chemicals/muscat | 3 | / | muscatchemical.com | pws=0 gl=om (=) |
| 2026-10-24 | google | chemical supplier rusayl | /chemicals/rusayl | — |  | gulfyp.com | pws=0 gl=om (=) |
| 2026-10-24 | google | chemical supplier sohar | /chemicals/sohar | — |  | soharchemical.com | pws=0 gl=om (=) |
| 2026-10-24 | google | chemical supplier rustaq | /chemicals/rustaq | 2 | / | n/m | pws=0 gl=om (=) |
| 2026-10-24 | google | chemical supplier salalah | /chemicals/salalah | 4 | / | n/m | pws=0 gl=om (was 2) |
| 2026-10-24 | google | chemical supplier duqm | /chemicals/duqm | 3 | / | omanchem.com | pws=0 gl=om (=) |
| 2026-10-24 | google | chemical supplier dubai | /chemicals/dubai | — |  | kemipex.com | pws=0 gl=ae (=) |
| 2026-10-24 | google | chemical supplier abu dhabi | /chemicals/abu-dhabi | — |  | ocetgulf.com | pws=0 gl=ae (=) |
| 2026-10-24 | google | chemical supplier sharjah | /chemicals/sharjah | — |  | oxymedz.com | pws=0 gl=ae (=) |
| 2026-10-24 | google | chemical supplier fujairah | /chemicals/fujairah | — |  | fujairahchemical.com | pws=0 gl=ae (=) |
| 2026-10-24 | google | chemical supplier ras al khaimah | /chemicals/ras-al-khaimah | — |  | yellowpages-uae.com | pws=0 gl=ae (=) |
| 2026-10-24 | google | chemical supplier riyadh | /chemicals/riyadh | — |  | somatco.com | pws=0 gl=sa (=; #1 was fouz) |
| 2026-10-24 | google | chemical supplier jeddah | /chemicals/jeddah | — |  | fouz.com.sa | pws=0 gl=sa (=) |
| 2026-10-24 | google | chemical supplier dammam | /chemicals/dammam | 5 |  | n/m | pws=0 gl=sa (was —) |
| 2026-10-24 | google | chemical supplier jubail | /chemicals/jubail | — |  | indme.com | pws=0 gl=sa (=) |
| 2026-10-24 | google | chemical supplier yanbu | /chemicals/yanbu | — |  | chemtrade.com | pws=0 gl=sa (=) |
| 2026-10-24 | google | chemical supplier doha | /chemicals/doha | — |  | deluxechemical.com | pws=0 gl=qa (=) |
| 2026-10-24 | google | chemical supplier kuwait city | /chemicals/kuwait-city | — |  | lookchem.com | pws=0 gl=kw (=) |
| 2026-10-24 | google | chemical supplier bahrain | /chemicals/bahrain | n/m |  | n/m | pws=0 gl=bh (fetch error) |
| 2026-10-24 | google | chemical supplier kuwait | /chemicals/kuwait | — |  | albarrakchem.com | pws=0 gl=kw |
| 2026-10-24 | google | chemical supplier qatar | /chemicals/qatar | — |  | deluxechemical.com | pws=0 gl=qa |
| 2026-10-24 | google | chemical supplier saudi arabia | /chemicals/saudi-arabia | — |  | afi.com.sa | pws=0 gl=sa |
| 2026-10-24 | google | chemical supplier baghdad / amman / cairo | /chemicals/* | n/m |  | n/m | skipped (export-only lanes, fetch cap) |
| 2026-10-24 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / (target at 3) | omanchem.com | cc=om (=) |
| 2026-10-24 | bing | chemical supplier in oman | / | 3 | target at 4 | omanchem.com | cc=om (variant wording of "chemical suppliers in oman"; not same-cell) |
| 2026-10-24 | bing | chemical company oman | / | 7 |  | omanchem.com | cc=om (was 6) |
| 2026-10-24 | bing | chemical suppliers muscat | /chemicals/muscat | 4 | /chemical-suppliers-oman; /products/lab-chemicals at 7 | muscatchemical.com | cc=om (variant wording of "chemical supplier muscat"; not same-cell) |
| 2026-10-25 | google | chemical suppliers in uae | /chemicals/uae | — |  | yellowpages-uae.com | pws=0 gl=ae fetch |
| 2026-10-25 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om fetch (=) |
| 2026-10-25 | google | chemical suppliers gcc | /chemical-suppliers-middle-east | 1 | / | gcoman.com | pws=0 gl=om fetch (=10-19) |
| 2026-10-25 | google | caustic soda supplier oman | /chemical-supplier/caustic-soda-oman | — |  | omanchem.com | pws=0 gl=om fetch (=) |
| 2026-10-25 | google | fertilizer supplier oman | /chemical-supplier/fertilizers-oman | — |  | omanagrifertilizer.com | pws=0 gl=om fetch (=) |
| 2026-10-25 | google | hydrochloric acid supplier oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | laboratory chemicals supplier oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | nitric acid supplier oman/bahrain/kuwait/qatar/saudi arabia/uae | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | oilfield chemicals supplier oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | poly aluminium chloride supplier oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | sodium hypochlorite supplier oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | chemical suppliers in oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | chemical supplier muscat | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | chemical company oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | bulk nitric acid oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | google | nitric acid price oman | — | captcha |  | captcha | fetch soft-blocked (enablejs page) after 5 queries; navigated read hit /sorry → Google stopped for the day |
| 2026-10-25 | bing | chemical supplier muscat | /chemicals/muscat | 5 | / (target absent; /chemical-suppliers-oman at 6) | muscatchemical.com | cc=om (was 3 on 10-22) |
| 2026-10-25 | bing | chemical supplier rusayl | /chemicals/rusayl | 1 |  | gcoman.com | cc=om (=) |
| 2026-10-25 | bing | chemical supplier sohar | /chemicals/sohar | 3 |  | soharchemical.com | cc=om (was 2) |
| 2026-10-25 | bing | chemical supplier rustaq | /chemicals/rustaq | 1 |  | gcoman.com | cc=om (=) |
| 2026-10-25 | bing | chemical supplier salalah | /chemicals/salalah | 3 |  | salalahchemical.com | cc=om (was 4) |
| 2026-10-25 | bing | chemical supplier duqm | /chemicals/duqm | 1 |  | gcoman.com | cc=om (was 2) |
| 2026-10-25 | bing | chemical supplier dubai | /chemicals/dubai | — |  | yellowpages-uae.com | cc=ae (=) |
| 2026-10-25 | bing | chemical supplier abu dhabi | /chemicals/abu-dhabi | — |  | yellowpages-uae.com | cc=ae (=) |
| 2026-10-25 | bing | chemical supplier sharjah | /chemicals/sharjah | — |  | yellowpages-uae.com | cc=ae (=) |
| 2026-10-25 | bing | chemical supplier fujairah | /chemicals/fujairah | — |  | fujairahchemical.com | cc=ae (=) |
| 2026-10-25 | bing | chemical supplier ras al khaimah | /chemicals/ras-al-khaimah | — |  | alchemoraltd.com | cc=ae (=) |
| 2026-10-25 | bing | chemical supplier riyadh | /chemicals/riyadh | — |  | gobalchemicalsplus.com | cc=sa (=) |
| 2026-10-25 | bing | chemical supplier jeddah | /chemicals/jeddah | 2 |  | alchemoraltd.com | cc=sa (was 6) |
| 2026-10-25 | bing | chemical supplier dammam | /chemicals/dammam | — |  | nassguard.sa | cc=sa (=) |
| 2026-10-25 | bing | chemical supplier jubail | /chemicals/jubail | 3 |  | nawahchem.com | cc=sa (=) |
| 2026-10-25 | bing | chemical supplier yanbu | /chemicals/yanbu | 2 |  | alchemoraltd.com | cc=sa (was 5) |
| 2026-10-25 | bing | chemical supplier doha | /chemicals/doha | 2 |  | chemspirechemical.com | cc=qa (was —) |
| 2026-10-25 | bing | chemical supplier kuwait city | /chemicals/kuwait-city | 4 |  | skchemicaltraders.com | cc=kw (was 5) |
| 2026-10-25 | bing | chemical supplier bahrain | /chemicals/bahrain | 8 |  | alkhalidiagroup.com | cc=bh (was —) |
| 2026-10-25 | bing | chemical supplier baghdad | /chemicals/baghdad | 1 |  | gcoman.com | cc=iq (was 2) |
| 2026-10-25 | bing | chemical supplier amman | /chemicals/amman | 1 |  | gcoman.com | cc=jo (was 6) |
| 2026-10-25 | bing | chemical supplier cairo | /chemicals/cairo | 4 |  | madeinegypt.com | cc=eg (=) |
| 2026-10-25 | bing | chemical suppliers in kuwait | /chemicals/kuwait | — |  | ensun.io | cc=kw (=) |
| 2026-10-25 | bing | chemical suppliers in qatar | /chemicals/qatar | — |  | ensun.io | cc=qa (=) |
| 2026-10-25 | bing | chemical suppliers in saudi arabia | /chemicals/saudi-arabia | — |  | ensun.io | cc=sa (=) |
| 2026-10-25 | bing | chemical suppliers in uae | /chemicals/uae | — |  | yellowpages-uae.com | cc=ae (=) |
| 2026-10-25 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / (target at 3) | omanchem.com | cc=om (=) |
| 2026-10-25 | bing | chemical suppliers gcc | /chemical-suppliers-middle-east | 1 | / (target at 2) | gcoman.com | cc=om (=) |
| 2026-10-25 | bing | caustic soda supplier oman | /chemical-supplier/caustic-soda-oman | 2 |  | muscatchemical.com | cc=om (was 3) |
| 2026-10-25 | bing | fertilizer supplier oman | /chemical-supplier/fertilizers-oman | 3 |  | muscatfertilizer.net | cc=om (=) |
| 2026-10-25 | bing | hydrochloric acid supplier oman | /chemical-supplier/hydrochloric-acid-oman | 2 |  | omanchem.com | cc=om (was 1) |
| 2026-10-25 | bing | laboratory chemicals supplier oman | /chemical-supplier/laboratory-chemicals-oman | 1 | /products/lab-chemicals (hub at 8) | gcoman.com | cc=om (=) |
| 2026-10-25 | bing | nitric acid supplier bahrain | /chemical-supplier/nitric-acid-bahrain | 1 |  | gcoman.com | cc=bh (=) |
| 2026-10-25 | bing | nitric acid supplier kuwait | /chemical-supplier/nitric-acid-kuwait | 9 | /chemicals/kuwait-city (hub at 10) | chimisrl.com | cc=kw (was —) |
| 2026-10-25 | bing | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — | absent from the top 11 (page 1 shows 5 organic + "Some results have been removed") | omanchem.com | cc=om (was 2; hub still indexed: branded query ranks it 1) |
| 2026-10-25 | bing | nitric acid supplier qatar | /chemical-supplier/nitric-acid-qatar | 6 |  | deluxechemical.com | cc=qa (was 7) |
| 2026-10-25 | bing | nitric acid supplier saudi arabia | /chemical-supplier/nitric-acid-saudi-arabia | — |  | chimisrl.com | cc=sa (=) |
| 2026-10-25 | bing | nitric acid supplier uae | /chemical-supplier/nitric-acid-uae | 6 |  | chemstock.ae | cc=ae (was 9) |
| 2026-10-25 | bing | oilfield chemicals supplier oman | /chemical-supplier/oilfield-chemicals-oman | 3 | /products/oilfield (hub absent) | shaktichemicals.com | cc=om (=) |
| 2026-10-25 | bing | poly aluminium chloride supplier oman | /chemical-supplier/poly-aluminium-chloride-oman | 4 | /products/inorganic/poly-aluminum-chloride (hub absent) | omanchem.com | cc=om (=) |
| 2026-10-25 | bing | sodium hypochlorite supplier oman | /chemical-supplier/sodium-hypochlorite-oman | 2 | product page (hub at 5) | omanchem.com | cc=om (=) |
| 2026-10-25 | bing | chemical suppliers in oman | / | 2 | /chemical-suppliers-oman at 3 | omanchem.com | cc=om (=) |
| 2026-10-25 | bing | chemical company oman | / | 7 |  | omanchem.com | cc=om (=) |
| 2026-10-25 | bing | nitric acid oman | /chemical-supplier/nitric-acid-oman | 1 | + lab nitric at 2 | gcoman.com | cc=om (=) |
| 2026-10-25 | bing | nitric acid price oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | cc=om (was 1) |
| 2026-10-25 | bing | bulk nitric acid oman | /chemical-supplier/nitric-acid-oman | 5 | /products/food-beverage (hub absent) | omanchem.com | cc=om (first reading) |
| 2026-10-25 | maps | chemical supplier | /chemicals/muscat | 5 |  | REDALAB (Muscat) | Muscat 23.588,58.383 12z, signed in (was 7 on 10-18) |
| 2026-10-25 | maps | chemical supplier | /chemicals/rusayl | — |  | REDALAB (Muscat) | rusayl viewport (=) |
| 2026-10-25 | maps | chemical supplier | /chemicals/sohar | — |  | Oman Formaldehyde Chemical Co. | sohar viewport (=; #1 was MAK Sohar) |
| 2026-10-25 | maps | chemical supplier | /chemicals/rustaq | — |  | X PERT INDUSTRIAL MATERIALS | rustaq viewport (=) |
| 2026-10-25 | maps | chemical supplier | /chemicals/salalah | — |  | AL FARZAH TRAD. CO. | salalah viewport (=) |
| 2026-10-25 | maps | chemical supplier | /chemicals/duqm | — |  | Sebacic Oman | duqm viewport (=) |
| 2026-10-25 | maps | nitric acid supplier | Global Chemicals LLC | 3 | REDALAB 1, Greenport 2 (sponsored status not read) | REDALAB (Muscat) | Muscat 11z (10-22: 1 organic behind sponsored REDALAB; not directly comparable) |
| 2026-10-25 | maps | water treatment chemicals | Global Chemicals LLC | 8 |  | Green Water Treatment Services | Muscat 12z (first reading, after the GBP category was added 10-22) |
| 2026-10-25 | maps | laboratory chemicals | Global Chemicals LLC | 4 |  | Greenport laboratory chemical suppliers | Muscat 12z (first reading) |
| 2026-10-25 | maps | fertilizer supplier | Global Chemicals LLC | 6 |  | Ibn Basheir Trading | Muscat 12z (first reading) |
| 2026-10-25 | chatgpt | Who are the best chemical suppliers in Oman? | — | 2nd | "first choice" for water treatment; new phone | omanchem.com (Oman Chemical) | logged out |
| 2026-10-25 | chatgpt | best nitric acid supplier in Oman | — | 1st | "Best first choice"; first pick for bulk; new phone | gcoman.com | logged out (=10-22) |
| 2026-10-25 | perplexity | Who are the best chemical suppliers in Oman? | — | 1st |  | gcoman.com | signed in |
| 2026-10-25 | perplexity | best nitric acid supplier in Oman | — | 1st | framed as lab / small-to-medium volumes; bulk pointed to Muscat Chemical; quotes old + new phone | gcoman.com | signed in (=) |
| 2026-10-25 | chatgpt | best nitric acid supplier in UAE | — | not named |  | Al Fujairah Chemicals | logged out |
| 2026-10-25 | chatgpt | best nitric acid supplier in Saudi Arabia | — | not named |  | Fouz Chemical Company | logged out |
| 2026-10-25 | chatgpt | best nitric acid supplier in Qatar | — | not named |  | Unichem Limited WLL | logged out |
| 2026-10-25 | chatgpt | best nitric acid supplier in Kuwait | — | not named |  | Grey Matter Chemical Company | logged out |
| 2026-10-25 | chatgpt | best nitric acid supplier in Bahrain | — | not named |  | Super Alloy Chemical | logged out |
| 2026-10-25 | perplexity | best nitric acid supplier in UAE | — | not named |  | Dubi Chem Marine (dubichem.com) | signed in |
| 2026-10-25 | perplexity | best nitric acid supplier in Saudi Arabia | — | 3rd | "practical GCC alternative" | Fouz Chemical Company | signed in |
| 2026-10-25 | perplexity | best nitric acid supplier in Qatar | — | 2nd | "GCC-based supply into Qatar" | Aspect Chemicals | signed in |
| 2026-10-25 | perplexity | best nitric acid supplier in Kuwait | — | named, below the top 3 | "GCC exporter … from Muscat" | Al Sanea Chemical Products | signed in |
| 2026-10-25 | perplexity | best nitric acid supplier in Bahrain | — | 3rd | "fast GCC cross-border supply" | CPT Bahrain | signed in |
| 2026-10-25 | perplexity | bulk nitric acid supplier in Oman | — | 1st | "strongest local option", bulk + IBC; old phone quoted | gcoman.com | signed in, after Publish #6 |
| 2026-10-25 | copilot (bing.com/copilotsearch AI Mode) | Who is the best bulk nitric acid supplier in Oman | — | 1st | "Global Chemicals LLC is the strongest supplier", quotes the bulk section | gcoman.com | cc=om, not signed in |
| 2026-10-25 | chatgpt | Who is the best bulk nitric acid supplier in Oman? | — | 1st | then Sohar Chemicals, Oman Chemical | gcoman.com | logged out, after Publish #6 |
| 2026-10-25 | gemini | Who is the best bulk nitric acid supplier in Oman? | — | not named |  | Oman Chemical (MBBT); then DubiChem/RXSOL, Salalah Chemical | signed in (owner's personal account) |
| 2026-10-25 | brave (Claude's search index) | bulk nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | top 12; site:gcoman.com nitric returns no nitric page (not in Brave's index) |
| 2026-10-25 | brave | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | top 9 |
| 2026-10-25 | brave | chemical suppliers oman | /chemical-suppliers-oman | 3 | / | omanchem.com | top 10 |
| 2026-10-25 | google ai mode | bulk nitric acid supplier in oman | — | n/m |  | n/m | captcha (/sorry) |
| 2026-10-25 | google ai mode | bulk nitric acid supplier in oman | — | **1st listed** | "Verified Bulk Nitric Acid Suppliers in Oman: Global Chemicals LLC …", then Muscat Chemical | gcoman.com | udm=50 gl=om, signed-in browser; read after the user cleared the CAPTCHA (was not named 10-19) |
| 2026-10-25 | gemini | Which company should I contact for bulk nitric acid (IBC or tanker) in Oman? | — | not named |  | Oman Chemical (MBBT); Salalah Chemical | signed in (owner's personal account), second wording |
| 2026-10-25 | google | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om, navigated (=; top 9 incl. go4worldbusiness 7, omanyellowpagesonline 9) |
| 2026-10-25 | google | bulk nitric acid oman | /chemical-supplier/nitric-acid-oman | — |  | uvwater.biz | pws=0 gl=om, navigated (top 9) |
| 2026-10-26 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-26 | google | chemical suppliers in oman | / | 1 |  | gcoman.com | pws=0 gl=om navigated (=) |
| 2026-10-26 | google | chemical supplier muscat | /chemicals/muscat | 3 | / | muscatchemical.com | pws=0 gl=om navigated (=) |
| 2026-10-26 | google | chemical company oman | / | — |  | omanchem.com | pws=0 gl=om navigated (top 6) (=) |
| 2026-10-26 | google | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-26 | google | nitric acid supplier uae | /chemical-supplier/nitric-acid-uae | — |  | tricechemicals.com | pws=0 gl=ae navigated (=) |
| 2026-10-26 | google | nitric acid supplier saudi arabia | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated (=) |
| 2026-10-26 | google | nitric acid supplier qatar | /chemical-supplier/nitric-acid-qatar | — |  | deluxechemical.com | pws=0 gl=qa navigated (=) |
| 2026-10-26 | google | nitric acid supplier kuwait | /chemical-supplier/nitric-acid-kuwait | — |  | enviroblend-group.com | pws=0 gl=kw navigated (=) |
| 2026-10-26 | google | nitric acid supplier bahrain | /chemical-supplier/nitric-acid-bahrain | — |  | bahrainyellowpagesonline.com | pws=0 gl=bh navigated (=) |
| 2026-10-26 | google | nitric acid supplier gcc | /chemical-supplier/nitric-acid-oman | — |  | iigtchem.com | pws=0 gl=om navigated (first reading) |
| 2026-10-26 | google | chemical supplier rusayl | /chemicals/rusayl | 9 | / | gulfyp.com | pws=0 gl=om navigated (was —) |
| 2026-10-26 | google | chemical supplier sohar | /chemicals/sohar | — |  | soharchemical.com | pws=0 gl=om navigated (=) |
| 2026-10-26 | google | chemical supplier rustaq | /chemicals/rustaq | 2 | / | muscatchemical.com | pws=0 gl=om navigated (=) |
| 2026-10-26 | google | chemical supplier salalah | /chemicals/salalah | 4 | / | salalahchemical.com | pws=0 gl=om navigated (=) |
| 2026-10-26 | google | chemical supplier duqm | /chemicals/duqm | 4 | / | omanchem.com | pws=0 gl=om navigated (was 3) |
| 2026-10-26 | google | chemical supplier dubai | /chemicals/dubai | — |  | kemipex.com | pws=0 gl=ae navigated (=) |
| 2026-10-26 | google | chemical supplier abu dhabi | /chemicals/abu-dhabi | — |  | ocetgulf.com | pws=0 gl=ae navigated (=) |
| 2026-10-26 | google | chemical supplier sharjah | /chemicals/sharjah | — |  | oxymedz.com | pws=0 gl=ae navigated (=) |
| 2026-10-26 | google | chemical supplier riyadh | /chemicals/riyadh | — |  | fouz.com.sa | pws=0 gl=sa navigated (=) |
| 2026-10-26 | google | chemical supplier jeddah | /chemicals/jeddah | — |  | fouz.com.sa | pws=0 gl=sa navigated (=) |
| 2026-10-26 | google | chemical supplier dammam | /chemicals/dammam | 4 |  | nassguard.sa | pws=0 gl=sa navigated (was 5; 2nd reading in top 10) |
| 2026-10-26 | google | chemical supplier doha | /chemicals/doha | — |  | deluxechemical.com | pws=0 gl=qa navigated (=) |
| 2026-10-26 | google | chemical supplier kuwait city | /chemicals/kuwait-city | — |  | lookchem.com | pws=0 gl=kw navigated (=) |
| 2026-10-26 | google | fujairah, ras al khaimah, jubail, yanbu, bahrain city, baghdad, amman, cairo, country queries | /chemicals/* | n/m |  | n/m | skipped: 25/day cap spent on head terms + nitric |
| 2026-10-26 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / (target 3) | omanchem.com | cc=om (=) |
| 2026-10-26 | bing | chemical suppliers in oman | / | 3 | /chemical-suppliers-oman (homepage absent) | omanchem.com | cc=om (was 2) |
| 2026-10-26 | bing | chemical supplier muscat | /chemicals/muscat | 5 | /chemical-suppliers-oman at 7 | muscatchemical.com | cc=om (5 on 10-25; 2nd reading outside top 3) |
| 2026-10-26 | bing | chemical company oman | / | 8 |  | omanchem.com | cc=om (was 7) |
| 2026-10-26 | bing | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | cc=om (2nd reading absent; recrawl requested 10-25) |
| 2026-10-27 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | chemical suppliers in oman | / | 1 |  | gcoman.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | chemical supplier muscat | /chemicals/muscat | 3 | / | muscatchemical.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | chemical company oman | / | — |  | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | chemical suppliers gcc | /chemical-suppliers-middle-east | 1 | / | gcoman.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | chemical suppliers in uae | /chemicals/uae | — |  | yellowpages-uae.com | pws=0 gl=ae navigated (=) |
| 2026-10-27 | google | caustic soda supplier oman | /chemical-supplier/caustic-soda-oman | — |  | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | fertilizer supplier oman | /chemical-supplier/fertilizers-oman | — |  | omanagrifertilizer.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | hydrochloric acid supplier oman | /chemical-supplier/hydrochloric-acid-oman | — |  | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | laboratory chemicals supplier oman | /chemical-supplier/laboratory-chemicals-oman | 2 | / | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | oilfield chemicals supplier oman | /chemical-supplier/oilfield-chemicals-oman | — |  | muscatchemical.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | poly aluminium chloride supplier oman | /chemical-supplier/poly-aluminium-chloride-oman | — |  | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | sodium hypochlorite supplier oman | /chemical-supplier/sodium-hypochlorite-oman | — |  | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om navigated (=) |
| 2026-10-27 | google | chemical shop near me | /chemicals/muscat | 7 | /chemicals/abu-dhabi (wrong city) | dubichem.com | pws=0 gl=om navigated (first reading) |
| 2026-10-27 | google maps pack | chemical supplier in oman | Global Chemicals LLC | 2 | 5.0 (2 reviews); organic #1 = gcoman.com below the pack | Oman Formaldehyde Chemical Co. (4.0, 11 reviews) | gl=om SERP Places block |
| 2026-10-27 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / (target 3) | omanchem.com | cc=om (=) |
| 2026-10-27 | bing | chemical suppliers in oman | / | 2 | target page at 2, homepage at 3 | omanchem.com | cc=om (was 3) |
| 2026-10-27 | bing | chemical supplier muscat | /chemicals/muscat | 4 | / ; city page at 6 | muscatchemical.com | cc=om (was 5) |
| 2026-10-27 | bing | chemical company oman | / | 10 |  | omanchem.com | cc=om (was 8) |
| 2026-10-27 | google | water treatment chemicals suppliers in uae | /products/water-treatment | — |  | emveestech.com | pws=0 gl=ae fetch, top 9 only (P9.4 baseline) |
| 2026-10-27 | google | water treatment chemicals supplier oman | /products/water-treatment | 2 | / (homepage), category page not in top 9 | innovacorporate.com | pws=0 gl=om fetch, top 9 (P9.4 baseline) |
| 2026-10-27 | google | calcium hypochlorite supplier uae | /products/water-treatment/calcium-hypochlorite-water | — |  | dutcotennant.com | pws=0 gl=ae fetch, top 9 (P9.9 baseline) |
| 2026-10-27 | google | urea supplier oman | /chemical-supplier/fertilizers-oman | — |  | omanchem.com | pws=0 gl=om fetch, top 9 (P9.6 baseline) |
| 2026-10-27 | google | bentonite supplier oman | /products/oilfield/bentonite-powder | — |  | muscatchemical.com | pws=0 gl=om fetch, top 9 (P9.5 baseline) |
| 2026-10-27 | google | caustic soda suppliers in uae | /chemical-supplier/caustic-soda-oman | — |  | yellowpages-uae.com | pws=0 gl=ae fetch, top 9 (P9.3 baseline) |
| 2026-10-27 | google | hydrochloric acid supplier uae | /chemical-supplier/hydrochloric-acid-oman | — |  | chemstock.ae | pws=0 gl=ae fetch, top 9 (P9.3 baseline) |
| 2026-10-27 | google | chemical import permit oman | /blog/buying-industrial-chemicals-oman-gcc-guide | — | guide not yet live | customs.gov.om | pws=0 gl=om fetch, top 9 (P9.2 baseline; SERP is all .gov) |
| 2026-10-27 | bing | water treatment chemicals supplier oman | /products/water-treatment | 6 | / at 4; category page 6 | omanchem.com | cc=om navigated (P9.4 baseline) |
| 2026-10-27 | bing | urea supplier oman | /chemical-supplier/fertilizers-oman | — |  | muscatchemical.com | cc=om navigated, only 5 results shown (P9.6 baseline) |
| 2026-10-27 | bing | bentonite supplier oman | /products/oilfield/bentonite-powder | 3 |  | omanchem.com | cc=om navigated (P9.5 baseline) |
| 2026-10-27 | bing | chemical import permit oman | /blog/buying-industrial-chemicals-oman-gcc-guide | — | guide not yet live | ea.gov.om | cc=om navigated; top 10 all government (P9.2 baseline) |
| 2026-11-05 | google | chemical supplier muscat | /chemicals/muscat | 3 | / (homepage) | muscatchemical.com | pws=0 gl=om fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier rusayl | /chemicals/rusayl | 7 | / (homepage) | gulfyp.com | pws=0 gl=om fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier sohar | /chemicals/sohar | — |  | soharchemical.com | pws=0 gl=om fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier rustaq | /chemicals/rustaq | 1 |  | gcoman.com | pws=0 gl=om fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier salalah | /chemicals/salalah | 5 | / (homepage) | salalahchemical.com | pws=0 gl=om fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier duqm | /chemicals/duqm | 7 | / (homepage) | omanchem.com | pws=0 gl=om fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier dubai | /chemicals/dubai | — |  | kemipex.com | pws=0 gl=ae fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier abu dhabi | /chemicals/abu-dhabi | — |  | yellowpages-uae.com | pws=0 gl=ae fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier sharjah | /chemicals/sharjah | — |  | alkhowahirchemicals.com | pws=0 gl=ae fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier fujairah | /chemicals/fujairah | — |  | fujairahchemical.com | pws=0 gl=ae fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier ras al khaimah | /chemicals/ras-al-khaimah | 4 |  | yellowpages-uae.com | pws=0 gl=ae fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier riyadh | /chemicals/riyadh | — |  | chemadd.com.sa | pws=0 gl=sa fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier jeddah | /chemicals/jeddah | — |  | chemadd.com.sa | pws=0 gl=sa fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier dammam | /chemicals/dammam | — |  | nassguard.sa | pws=0 gl=sa fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier jubail | /chemicals/jubail | — |  | takweenchem.com | pws=0 gl=sa fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier yanbu | /chemicals/yanbu | — |  | yascp.net | pws=0 gl=sa fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier doha | /chemicals/doha | — |  | deluxechemical.com | pws=0 gl=qa fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier kuwait city | /chemicals/kuwait-city | — |  | alsanea.com | pws=0 gl=kw fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier bahrain | /chemicals/bahrain | — |  | safic-alcan.com | pws=0 gl=bh fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier baghdad | /chemicals/baghdad | — |  | primchem-wtc.com | pws=0 gl=iq fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier amman | /chemicals/amman | — |  | abchemjo.com | pws=0 gl=jo fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical supplier cairo | /chemicals/cairo | — |  | yellowpages.com.eg | pws=0 gl=eg fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical suppliers in kuwait | /chemicals/kuwait | — |  | alsanea.com | pws=0 gl=kw fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical suppliers in qatar | /chemicals/qatar | — |  | deluxechemical.com | pws=0 gl=qa fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-05 | google | chemical suppliers in saudi arabia | /chemicals/saudi-arabia | — |  | chemadd.com.sa | pws=0 gl=sa fetch, top 9 (batch=today, 25/25, no captcha) |
| 2026-11-08 | google | chemical suppliers in uae | /chemicals/uae | — |  | kemipex.com | pws=0 gl=ae fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | chemical suppliers oman | /chemical-suppliers-oman | 2 | / | omanchem.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | chemical suppliers gcc | /chemical-suppliers-middle-east | 1 | / | gcoman.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | caustic soda supplier oman | /chemical-supplier/caustic-soda-oman | — |  | omanchem.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | fertilizer supplier oman | /chemical-supplier/fertilizers-oman | — |  | omanagrifertilizer.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | hydrochloric acid supplier oman | /chemical-supplier/hydrochloric-acid-oman | — |  | omanchem.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | laboratory chemicals supplier oman | /chemical-supplier/laboratory-chemicals-oman | 2 | / | omanchem.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | nitric acid supplier bahrain | /chemical-supplier/nitric-acid-bahrain | — |  | bahrainyellowpagesonline.com | pws=0 gl=bh fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | nitric acid supplier kuwait | /chemical-supplier/nitric-acid-kuwait | — |  | enviroblend-group.com | pws=0 gl=kw fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | nitric acid supplier qatar | /chemical-supplier/nitric-acid-qatar | — |  | deluxechemical.com | pws=0 gl=qa fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | nitric acid supplier saudi arabia | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | nitric acid supplier uae | /chemical-supplier/nitric-acid-uae | — |  | uaeyellowpagesonline.com | pws=0 gl=ae fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | oilfield chemicals supplier oman | /chemical-supplier/oilfield-chemicals-oman | — |  | muscatchemical.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | poly aluminium chloride supplier oman | /chemical-supplier/poly-aluminium-chloride-oman | — |  | omanchem.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | pool chlorine gcc supplier oman | /chemical-supplier/pool-chlorine-gcc | 4 | / (hub unpublished) | uvwater.biz | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | sodium hypochlorite supplier oman | /chemical-supplier/sodium-hypochlorite-oman | — |  | muscatchemical.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | google | water treatment chemicals gcc supplier oman | /chemical-supplier/water-treatment-chemicals-gcc | 4 | / (hub unpublished) | ooiss.com | pws=0 gl=om fetch, top 9 (batch=today, 18/18, no captcha) |
| 2026-11-08 | bing | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | typed in bing.com (cc=om URL returned no results), top 10 |
| 2026-11-08 | bing | nitric acid supplier uae | /chemical-supplier/nitric-acid-uae | — |  | tricechemicals.com | session fetch, no cc — directional |
| 2026-11-08 | bing | nitric acid supplier saudi arabia | /chemical-supplier/nitric-acid-saudi-arabia | — |  | chimisrl.com | session fetch, no cc — directional |
| 2026-11-08 | bing | nitric acid supplier qatar | /chemical-supplier/nitric-acid-qatar | 2 |  | deluxechemical.com | session fetch, no cc — directional |
| 2026-11-08 | bing | nitric acid supplier bahrain | /chemical-supplier/nitric-acid-bahrain | — |  | chimisrl.com | session fetch, no cc — directional |
| 2026-11-08 | bing | nitric acid supplier kuwait | /chemical-supplier/nitric-acid-kuwait | — |  | chimisrl.com | session fetch, no cc — directional |
| 2026-11-08 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | +3 | omanchem.com | session fetch, no cc — directional |
| 2026-11-08 | bing | chemical supplier muscat | /chemicals/muscat | 4 | +5 | muscatchemical.com | session fetch, no cc — directional |
| 2026-11-08 | maps | nitric acid supplier | GBP | 1 |  | Global Chemicals LLC | Muscat viewport 23.588,58.383 z12, signed in |
| 2026-11-08 | maps | chemical suppliers in oman | GBP | 1 |  | Global Chemicals LLC | Muscat viewport 23.588,58.383 z12, signed in |
| 2026-11-08 | google | chemical company in uae | /chemicals/dubai | — | | basf.com | pws=0 gl=ae fetch, top 9 (keyword investigation, first reading) |
| 2026-11-08 | google | chemical company in saudi arabia | /chemicals/riyadh | — | | saudichemical.com | pws=0 gl=sa fetch, top 9 (first reading; navigational SERP: Dow, Sadara) |
| 2026-11-08 | google | chemical supplier in oman (searched from UAE) | / | 1 | | gcoman.com | pws=0 gl=ae fetch, top 9 (first reading) |
| 2026-11-08 | google | hydrogen peroxide supplier oman | /products/… hydrogen-peroxide-50 | — | | omanchem.com | pws=0 gl=om fetch, top 9 (first reading) |
| 2026-11-08 | google | sulphuric acid supplier oman | /products/lab-chemicals/sulfuric-acid-lab | — | | omanchem.com | pws=0 gl=om fetch, top 9 (first reading) |
| 2026-11-08 | google | swimming pool chemicals oman | /chemical-supplier/pool-chlorine-gcc | — | | omanchem.com | pws=0 gl=om fetch, top 9 (first reading; hub live since 16:05 today) |
| 2026-11-08 | google | glycerin supplier oman | /products/… glycerin | — | | muscatchemical.com | pws=0 gl=om fetch, top 9 (first reading; 25/25 today, no captcha) |
| 2026-11-09 | google | chemical suppliers in oman | — | 1 (/) | | gcoman.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | chemical company in oman | — | 3 (/) | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | chemical suppliers muscat | — | 3 (/) | | muscatchemical.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | chemical suppliers sohar | — | — | | soharchemical.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | chemical suppliers in uae | — | — | | kemipex.com | pws=0 gl=ae fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | chemical suppliers in saudi arabia | — | — | | fouz.com.sa | pws=0 gl=sa fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | nitric acid supplier saudi arabia | — | — | | nassguard.sa | pws=0 gl=sa fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | nitric acid supplier riyadh | — | — | | nassguard.sa | pws=0 gl=sa fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | nitric acid supplier dammam | — | — | | nassguard.sa | pws=0 gl=sa fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | calcium hypochlorite supplier uae | — | — | | dutcotennant.com | pws=0 gl=ae fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | calcium hypochlorite supplier dubai | — | — | | dubichem.com | pws=0 gl=ae fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | calcium hypochlorite supplier bahrain | — | — | | bahrainyellowpagesonline.com | pws=0 gl=bh fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | nitric acid supplier oman | — | — | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | sodium hypochlorite supplier oman | — | — | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | hydrochloric acid supplier oman | — | — | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | caustic soda supplier oman | — | — | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | calcium hypochlorite supplier oman | — | — | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | urea supplier oman | — | — | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | swimming pool chemicals oman | — | — | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | water treatment chemicals oman | — | — | | innovacorporate.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | lubricants supplier oman | — | — | | mobil.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | oilfield chemicals oman | — | — | | ooiss.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | laboratory chemicals oman | — | 8 (/) | | omanchem.com | pws=0 gl=om fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | chemical suppliers bahrain | — | — | | safetychemical.com | pws=0 gl=bh fetch, top 9; 25/25, no captcha |
| 2026-11-09 | google | chemical suppliers qatar | — | — | | deluxechemical.com | pws=0 gl=qa fetch, top 9; 25/25, no captcha |
| 2026-11-09 | bing | chemical suppliers in oman | — | 4 (/chemical-suppliers-oman), 7 (/) | | omanchem.com | cc=om rendered, top 8 |
| 2026-11-09 | bing | nitric acid supplier saudi arabia | — | — | | chimisrl.com | cc=sa rendered, top 8 |
| 2026-11-09 | bing | calcium hypochlorite supplier uae | — | — | | hazchem.ae | cc=ae rendered, top 8 |
| 2026-11-09 | bing | calcium hypochlorite supplier bahrain | — | — | | gobalchemicalsplus.com | cc=bh rendered, top 8 |
| 2026-11-09 | bing | nitric acid supplier oman | — | — | | omanchem.com | cc=om rendered, top 8 |
| 2026-11-09 | bing | caustic soda supplier oman | — | 4 (caustic hub) | | omanchem.com | cc=om rendered, top 8 |
| 2026-11-09 | bing | hydrochloric acid supplier oman | — | 1 (HCl hub), 3 | | gcoman.com | cc=om rendered, top 8 |
| 2026-11-09 | bing | calcium hypochlorite supplier oman | — | — | | omanchem.com | cc=om rendered, top 8 |
| 2026-11-09 | maps | chemical suppliers (Muscat 12z) | GBP | 6 | | Green Port Chemical Suppliers In Muscat | signed-in Chrome, Muscat viewport |
| 2026-11-10 | google | nitric acid supplier saudi arabia (R1) | /chemical-supplier/nitric-acid-saudi-arabia | — | | nassguard.sa | pws=0 gl=sa product panel |
| 2026-11-10 | google | nitric acid supplier riyadh (R2) | /chemical-supplier/nitric-acid-saudi-arabia | — | | nassguard.sa | pws=0 gl=sa product panel |
| 2026-11-10 | google | nitric acid supplier dammam (R3) | /chemical-supplier/nitric-acid-saudi-arabia | — | | nassguard.sa | pws=0 gl=sa product panel |
| 2026-11-10 | google | calcium hypochlorite supplier uae (R4) | /chemical-supplier/calcium-hypochlorite-uae | — | | chemstock.ae | pws=0 gl=ae product panel |
| 2026-11-10 | google | calcium hypochlorite supplier dubai (R5) | /chemical-supplier/calcium-hypochlorite-uae | — | | hazchem.ae | pws=0 gl=ae product panel |
| 2026-11-10 | google | calcium hypochlorite 70% uae (R6) | /chemical-supplier/calcium-hypochlorite-uae | — | | chemstock.ae | pws=0 gl=ae product panel |
| 2026-11-10 | google | calcium hypochlorite supplier bahrain (R7) | /chemical-supplier/calcium-hypochlorite-bahrain | — | | bahrainyellowpagesonline.com | pws=0 gl=bh product panel |
| 2026-11-10 | google | nitric acid supplier oman (R8) | /chemical-supplier/nitric-acid-oman | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | sodium hypochlorite supplier oman (R9) | /chemical-supplier/sodium-hypochlorite-oman | — | | muscatchemical.com | pws=0 gl=om product panel |
| 2026-11-10 | google | hydrochloric acid supplier oman (R10) | /chemical-supplier/hydrochloric-acid-oman | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | hydrochloric acid supplier sohar (R11) | /chemical-supplier/hydrochloric-acid-oman | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | caustic soda supplier oman (R12) | /chemical-supplier/caustic-soda-oman | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | urea supplier oman (2) | /chemical-supplier/fertilizers-oman | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | hydrogen peroxide supplier oman (6) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | sulphuric acid supplier oman (7) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | glycerine supplier oman (8) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | isopropyl alcohol supplier oman (9) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | methanol supplier oman (10) | product | — | | omanmethanol.com | pws=0 gl=om product panel |
| 2026-11-10 | google | acetic acid supplier oman (11) | product | — | | muscatchemical.com | pws=0 gl=om product panel |
| 2026-11-10 | google | calcium chloride supplier oman (12) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | calcium hypochlorite supplier oman (13) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | poly aluminium chloride supplier oman (14) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | bentonite supplier oman (15) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | soda ash supplier oman (16) | product | — | | omanchem.com | pws=0 gl=om product panel |
| 2026-11-10 | google | citric acid supplier oman (17) | product | — | | uvwater.biz | pws=0 gl=om product panel |
| 2026-11-10 | google | chemical suppliers in oman (ctl) | / | 1 | | gcoman.com | pws=0 gl=om product panel (parser control) |
| 2026-11-12 | google | nitric acid supplier saudi arabia (R1) | panel target | — | | nassguard.sa | pws=0 gl=sa product panel, 9 results parsed |
| 2026-11-12 | google | nitric acid supplier riyadh (R2) | panel target | — | | nassguard.sa | pws=0 gl=sa product panel, 9 results parsed |
| 2026-11-12 | google | nitric acid supplier dammam (R3) | panel target | — | | nassguard.sa | pws=0 gl=sa product panel, 9 results parsed |
| 2026-11-12 | google | calcium hypochlorite supplier uae (R4) | panel target | — | | chemstock.ae | pws=0 gl=ae product panel, 9 results parsed |
| 2026-11-12 | google | calcium hypochlorite supplier dubai (R5) | panel target | — | | hazchem.ae | pws=0 gl=ae product panel, 9 results parsed |
| 2026-11-12 | google | calcium hypochlorite 70% uae (R6) | panel target | — | | chemstock.ae | pws=0 gl=ae product panel, 9 results parsed |
| 2026-11-12 | google | calcium hypochlorite supplier bahrain (R7) | panel target | — | | bahrainyellowpagesonline.com | pws=0 gl=bh product panel, 9 results parsed |
| 2026-11-12 | google | nitric acid supplier oman (R8) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | sodium hypochlorite supplier oman (R9) | panel target | — | | omanchlorine.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | hydrochloric acid supplier oman (R10) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | hydrochloric acid supplier sohar (R11) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | caustic soda supplier oman (R12) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | ethylene glycol supplier oman (18) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | corrosion inhibitor supplier oman (19) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | lubricants supplier oman (20) | panel target | — | | mobil.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | potassium chloride supplier oman (21) | panel target | — | | muscatchemical.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy nitric acid in oman (22) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy urea in oman (23) | panel target | — | | muscatfertilizer.net | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy caustic soda in oman (24) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy hydrochloric acid in oman (25) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy sodium hypochlorite in oman (26) | panel target | — | | omanchlorine.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy hydrogen peroxide in oman (27) | panel target | — | | gcc.luluhypermarket.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy sulphuric acid in oman (28) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy glycerine in oman (29) | panel target | — | | muscatchemical.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-12 | google | buy isopropyl alcohol in oman (30) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | nitric acid supplier saudi arabia (R1) | panel target | — | | nassguard.sa | pws=0 gl=sa product panel, 9 results parsed |
| 2026-11-13 | google | nitric acid supplier riyadh (R2) | panel target | — | | nassguard.sa | pws=0 gl=sa product panel, 9 results parsed |
| 2026-11-13 | google | nitric acid supplier dammam (R3) | panel target | — | | nassguard.sa | pws=0 gl=sa product panel, 9 results parsed |
| 2026-11-13 | google | calcium hypochlorite supplier uae (R4) | panel target | — | | chemstock.ae | pws=0 gl=ae product panel, 9 results parsed |
| 2026-11-13 | google | calcium hypochlorite supplier dubai (R5) | panel target | — | | hazchem.ae | pws=0 gl=ae product panel, 9 results parsed |
| 2026-11-13 | google | calcium hypochlorite 70% uae (R6) | panel target | — | | chemstock.ae | pws=0 gl=ae product panel, 9 results parsed |
| 2026-11-13 | google | calcium hypochlorite supplier bahrain (R7) | panel target | — | | bahrainyellowpagesonline.com | pws=0 gl=bh product panel, 9 results parsed |
| 2026-11-13 | google | nitric acid supplier oman (R8) | panel target | — | | uvwater.biz | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | sodium hypochlorite supplier oman (R9) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | hydrochloric acid supplier oman (R10) | panel target | — | | innovacorporate.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | hydrochloric acid supplier sohar (R11) | panel target | — | | soharchemical.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | caustic soda supplier oman (R12) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy methanol in oman (31) | panel target | — | | omanmethanol.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy acetic acid in oman (32) | panel target | — | | muscatchemical.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy calcium chloride in oman (33) | panel target | — | | uvwater.biz | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy calcium hypochlorite in oman (34) | panel target | — | | chemstock.om | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy poly aluminium chloride in oman (35) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy bentonite in oman (36) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy soda ash in oman (37) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy citric acid in oman (38) | panel target | — | | talabat.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy ethylene glycol in oman (39) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy corrosion inhibitor in oman (40) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy lubricants in oman (41) | panel target | — | | avicenonline.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | buy potassium chloride in oman (42) | panel target | — | | omanchem.com | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | google | nitric acid price oman (43) | panel target | — | | uvwater.biz | pws=0 gl=om product panel, 9 results parsed |
| 2026-11-13 | bing | nitric acid supplier saudi arabia (R1) | panel target | 3 | /chemical-supplier/nitric-acid-saudi-arabia? | chimisrl.com | cc=SA navigated, signed-in Chrome |
| 2026-11-13 | bing | nitric acid supplier riyadh (R2) | panel target | — |  | sigmaaldrich.com | cc=SA navigated, signed-in Chrome |
| 2026-11-13 | bing | calcium hypochlorite supplier uae (R4) | panel target | — |  | hazchem.ae | cc=AE navigated, signed-in Chrome |
| 2026-11-13 | bing | calcium hypochlorite supplier dubai (R5) | panel target | — |  | hazchem.ae | cc=AE navigated, signed-in Chrome |
| 2026-11-13 | bing | calcium hypochlorite supplier bahrain (R7) | panel target | 2 | /chemical-supplier/calcium-hypochlorite-bahrain | gobalchemicalsplus.com | cc=BH navigated, signed-in Chrome |
| 2026-11-13 | bing | nitric acid supplier oman (R8) | panel target | 1 |  | gcoman.com | cc=OM navigated, signed-in Chrome |
| 2026-11-13 | bing | sodium hypochlorite supplier oman (R9) | panel target | 1 | /products/water-treatment/sodium-hypochlorite… (product page, not hub) | gcoman.com | cc=OM navigated, signed-in Chrome |
| 2026-11-13 | bing | hydrochloric acid supplier oman (R10) | panel target | 1 |  | gcoman.com | cc=OM navigated, signed-in Chrome |
| 2026-11-13 | bing | caustic soda supplier oman (R12) | panel target | 4 |  | omanchem.com | cc=OM navigated, signed-in Chrome |
| 2026-11-13 | bing | chemical suppliers in oman | panel target | 2 |  | omanchem.com | cc=OM navigated, signed-in Chrome |
| 2026-11-13 | bing | chemical supplier uae | panel target | — |  | yellowpages-uae.com | cc=AE navigated, signed-in Chrome |
| 2026-11-13 | bing | chemical supplier saudi arabia | panel target | — |  | ensun.io | cc=SA navigated, signed-in Chrome |
| 2026-11-13 | bing | caustic soda supplier uae | panel target | — |  | causticsodaco.com | cc=AE navigated, signed-in Chrome |
| 2026-11-13 | bing | hydrochloric acid supplier saudi arabia | panel target | — |  | sachlo.com | cc=SA navigated, signed-in Chrome |
| 2026-11-13 | bing | chemical supplier qatar | panel target | — |  | unichemqatar.com | cc=QA navigated, signed-in Chrome |
| 2026-11-13 | bing | chemical supplier kuwait | panel target | — |  | lookchem.com | cc=KW navigated, signed-in Chrome |
| 2026-11-13 | bing | chemical supplier bahrain | panel target | 2 | /chemicals/bahrain | gobalchemicalsplus.com | cc=BH navigated, signed-in Chrome |
| 2026-11-13 | bing | urea supplier oman | product deep dive | 6 | /chemical-supplier/fertilizers-oman | chimisrl.com | cc=OM navigated |
| 2026-11-13 | bing | urea fertilizer supplier uae | product deep dive | — |  | chemstock.ae | cc=AE navigated |
| 2026-11-13 | bing | water treatment chemicals supplier oman | product deep dive | 3 | /products/water-treatment | recordsmarine.com | cc=OM navigated |
| 2026-11-13 | bing | water treatment chemicals supplier uae | product deep dive | — |  | saffronchemicals.com | cc=AE navigated |
| 2026-11-13 | bing | water treatment chemicals saudi arabia | product deep dive | — |  | wemsarabia.com | cc=SA navigated |
| 2026-11-13 | bing | lubricants supplier oman | product deep dive | 1 | /products/lubricants | gcoman.com | cc=OM navigated |
| 2026-11-13 | bing | swimming pool chemicals oman | product deep dive | 1 | /products/swimming-pool | gcoman.com | cc=OM navigated |
| 2026-11-13 | bing | epoxy resin supplier oman | product deep dive | 3 | /products/construction/epoxy-coating | omanchem.com | cc=OM navigated |
| 2026-11-14 | google | nitric acid supplier saudi arabia (R1) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-14 | google | nitric acid supplier riyadh (R2) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-14 | google | nitric acid supplier dammam (R3) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-14 | google | calcium hypochlorite supplier uae (R4) | /chemical-supplier/calcium-hypochlorite-uae | — |  | chemstock.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-14 | google | calcium hypochlorite supplier dubai (R5) | /chemical-supplier/calcium-hypochlorite-uae | — |  | hazchem.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-14 | google | calcium hypochlorite 70% uae (R6) | /chemical-supplier/calcium-hypochlorite-uae | — |  | chemstock.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-14 | google | calcium hypochlorite supplier bahrain (R7) | /chemical-supplier/calcium-hypochlorite-bahrain | — |  | aleradahchemicals.com | pws=0 gl=bh navigated, top 9 (core update) |
| 2026-11-14 | google | nitric acid supplier oman (R8) | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | sodium hypochlorite supplier oman (R9) | /chemical-supplier/sodium-hypochlorite-oman | — |  | omanchlorine.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | hydrochloric acid supplier oman (R10) | /chemical-supplier/hydrochloric-acid-oman | — |  | omanchlorine.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | hydrochloric acid supplier sohar (R11) | /chemical-supplier/hydrochloric-acid-oman | — |  | soharchemical.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | caustic soda supplier oman (R12) | /chemical-supplier/caustic-soda-oman | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | urea price oman (44) | product panel | — |  | urea-prices.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | caustic soda price oman (45) | product panel | — |  | uvwater.biz | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | hydrochloric acid price oman (46) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | sodium hypochlorite price oman (47) | product panel | — |  | uvwater.biz | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | hydrogen peroxide price oman (48) | product panel | — |  | gcc.luluhypermarket.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | sulphuric acid price oman (49) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | glycerine price oman (50) | product panel | — |  | gcc.luluhypermarket.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | isopropyl alcohol price oman (51) | product panel | — |  | noon.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | methanol price oman (52) | product panel | — |  | shipandbunker.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | acetic acid price oman (53) | product panel | — |  | noon.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | calcium chloride price oman (54) | product panel | — |  | uvwater.biz | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | calcium hypochlorite price oman (55) | product panel | — |  | noon.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-14 | google | poly aluminium chloride price oman (56) | product panel | — |  | uvwater.biz | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | maps | chemical supplier | /chemicals/muscat | 4 |  | REDALAB (Muscat) | Muscat 23.588,58.383 12z, signed in (was 5 on 10-25); Green Port 2, StabilityLine 3 (core update) |
| 2026-11-15 | maps | chemical supplier | /chemicals/rusayl | — |  | Star Modern Industries LLC | rusayl viewport (=) |
| 2026-11-15 | maps | chemical supplier | /chemicals/sohar | — |  | MAK Sohar Chemical Industries | sohar viewport (=) |
| 2026-11-15 | maps | chemical supplier | /chemicals/rustaq | — |  | X PERT INDUSTRIAL MATERIALS | rustaq viewport (=) |
| 2026-11-15 | maps | chemical supplier | /chemicals/salalah | — |  | AL FARZAH TRAD. CO. | salalah viewport (=) |
| 2026-11-15 | maps | chemical supplier | /chemicals/duqm | — |  | Sebacic Oman | duqm viewport (=) |
| 2026-11-15 | bing | chemical supplier muscat | /chemicals/muscat | 3 | / (city page not in top 5) | muscatchemical.com | cc=om, 5 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier rusayl | /chemicals/rusayl | 1 |  | gcoman.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier sohar | /chemicals/sohar | 5 |  | soharchemical.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier rustaq | /chemicals/rustaq | 2 |  | omanchem.com | cc=om, 4 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier salalah | /chemicals/salalah | 3 |  | salalahchemical.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier duqm | /chemicals/duqm | 1 |  | gcoman.com | cc=om, 6 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier dubai | /chemicals/dubai | — |  | dubaichemical.com | cc=ae, 6 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier abu dhabi | /chemicals/abu-dhabi | 2 |  | yellowpages-uae.com | cc=ae, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier sharjah | /chemicals/sharjah | — |  | alkhowahirchemicals.ae | cc=ae, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier fujairah | /chemicals/fujairah | 9 |  | fujairahchemical.com | cc=ae, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier ras al khaimah | /chemicals/ras-al-khaimah | 1 |  | gcoman.com | cc=ae, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier riyadh | /chemicals/riyadh | 9 |  | gobalchemicalsplus.com | cc=sa, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier jeddah | /chemicals/jeddah | 1 |  | gcoman.com | cc=sa, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier dammam | /chemicals/dammam | 5 |  | fouz.com.sa | cc=sa, 9 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier jubail | /chemicals/jubail | 1 |  | gcoman.com | cc=sa, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier yanbu | /chemicals/yanbu | 1 |  | gcoman.com | cc=sa, 9 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier doha | /chemicals/doha | 2 |  | chemspirechemical.com | cc=qa, 6 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier kuwait city | /chemicals/kuwait-city | 2 |  | lookchem.com | cc=kw, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier bahrain | /chemicals/bahrain | 1 |  | gcoman.com | cc=bh, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier baghdad | /chemicals/baghdad | 1 |  | gcoman.com | cc=iq, 2 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier amman | /chemicals/amman | 1 |  | gcoman.com | cc=jo, 9 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical supplier cairo | /chemicals/cairo | 1 |  | gcoman.com | cc=eg, navigated, setlang=en |
| 2026-11-15 | bing | chemical suppliers in kuwait | /chemicals/kuwait | — |  | lookchem.com | cc=kw, navigated, setlang=en |
| 2026-11-15 | bing | chemical suppliers in qatar | /chemicals/qatar | — |  | ensun.io | cc=qa, 7 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical suppliers in saudi arabia | /chemicals/saudi-arabia | — |  | ensun.io | cc=sa, 6 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical suppliers in uae | /chemicals/uae | — |  | yellowpages-uae.com | cc=ae, 8 results, navigated, setlang=en |
| 2026-11-15 | bing | chemical suppliers oman | /chemical-suppliers-oman | 2 | / (target at 5) | omanchem.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | chemical suppliers gcc | /chemical-suppliers-middle-east | 1 | / (target at 3) | gcoman.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | calcium hypochlorite bahrain supplier oman | /chemical-supplier/calcium-hypochlorite-bahrain | 1 | product page (hub likely 2, cite cut) | gcoman.com | cc=om, 6 results, navigated, setlang=en |
| 2026-11-15 | bing | calcium hypochlorite uae supplier oman | /chemical-supplier/calcium-hypochlorite-uae | 2 | product page | chemstock.om | cc=om, 6 results, navigated, setlang=en |
| 2026-11-15 | bing | caustic soda supplier oman | /chemical-supplier/caustic-soda-oman | 2 |  | omanchem.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | caustic soda saudi arabia supplier oman | /chemical-supplier/caustic-soda-saudi-arabia | 1 |  | gcoman.com | cc=om, 7 results, navigated, setlang=en |
| 2026-11-15 | bing | caustic soda uae supplier oman | /chemical-supplier/caustic-soda-uae | 1 |  | gcoman.com | cc=om, 9 results, navigated, setlang=en |
| 2026-11-15 | bing | fertilizer supplier oman | /chemical-supplier/fertilizers-oman | 2 |  | muscatfertilizer.net | cc=om, 8 results, navigated, setlang=en |
| 2026-11-15 | bing | hydrochloric acid supplier oman | /chemical-supplier/hydrochloric-acid-oman | 1 |  | gcoman.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | hydrochloric acid saudi arabia supplier oman | /chemical-supplier/hydrochloric-acid-saudi-arabia | 1 | Oman hub (target likely 2) | gcoman.com | cc=om, 9 results, navigated, setlang=en |
| 2026-11-15 | bing | hydrochloric acid uae supplier oman | /chemical-supplier/hydrochloric-acid-uae | 1 |  | gcoman.com | cc=om, 7 results, navigated, setlang=en |
| 2026-11-15 | bing | laboratory chemicals supplier oman | /chemical-supplier/laboratory-chemicals-oman | 1 |  | gcoman.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | nitric acid supplier bahrain | /chemical-supplier/nitric-acid-bahrain | — |  | chimisrl.com | cc=bh, navigated, setlang=en |
| 2026-11-15 | bing | nitric acid supplier kuwait | /chemical-supplier/nitric-acid-kuwait | — |  | chimisrl.com | cc=kw, 6 results, navigated, setlang=en |
| 2026-11-15 | bing | nitric acid supplier oman | /chemical-supplier/nitric-acid-oman | — |  | chimisrl.com | cc=om, 7 results, read twice (11-13: 1), navigated, setlang=en |
| 2026-11-15 | bing | nitric acid supplier qatar | /chemical-supplier/nitric-acid-qatar | 1 |  | gcoman.com | cc=qa, 9 results, navigated, setlang=en |
| 2026-11-15 | bing | nitric acid supplier saudi arabia | /chemical-supplier/nitric-acid-saudi-arabia | — |  | chimisrl.com | cc=sa (11-13: 3), navigated, setlang=en |
| 2026-11-15 | bing | nitric acid supplier uae | /chemical-supplier/nitric-acid-uae | — |  | tricechemicals.com | cc=ae, navigated, setlang=en |
| 2026-11-15 | bing | oilfield chemicals supplier oman | /chemical-supplier/oilfield-chemicals-oman | 1 |  | gcoman.com | cc=om, navigated, setlang=en |
| 2026-11-15 | bing | poly aluminium chloride supplier oman | /chemical-supplier/poly-aluminium-chloride-oman | 4 |  | omanchem.com | cc=om, 8 results, navigated, setlang=en |
| 2026-11-15 | bing | pool chlorine gcc supplier oman | /chemical-supplier/pool-chlorine-gcc | 1 | /products/swimming-pool | gcoman.com | cc=om, 7 results, navigated, setlang=en |
| 2026-11-15 | bing | sodium hypochlorite supplier oman | /chemical-supplier/sodium-hypochlorite-oman | — |  | innovacorporate.com | cc=om (11-13: 1 via product page), navigated, setlang=en |
| 2026-11-15 | bing | water treatment chemicals gcc supplier oman | /chemical-supplier/water-treatment-chemicals-gcc | 1 | / (hub not in 5) | gcoman.com | cc=om, 5 results, navigated, setlang=en |
| 2026-11-15 | google | nitric acid supplier saudi arabia (R1) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-15 | google | nitric acid supplier riyadh (R2) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-15 | google | nitric acid supplier dammam (R3) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-15 | google | calcium hypochlorite supplier uae (R4) | /chemical-supplier/calcium-hypochlorite-uae | — |  | chemstock.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-15 | google | calcium hypochlorite supplier dubai (R5) | /chemical-supplier/calcium-hypochlorite-uae | — |  | hazchem.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-15 | google | calcium hypochlorite 70% uae (R6) | /chemical-supplier/calcium-hypochlorite-uae | — |  | chemstock.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-15 | google | calcium hypochlorite supplier bahrain (R7) | /chemical-supplier/calcium-hypochlorite-bahrain | — |  | aleradahchemicals.com | pws=0 gl=bh navigated, top 9 (core update) |
| 2026-11-15 | google | nitric acid supplier oman (R8 = 1) | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | sodium hypochlorite supplier oman (R9 = 5) | /chemical-supplier/sodium-hypochlorite-oman | — |  | omanchlorine.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | hydrochloric acid supplier oman (R10 = 4) | /chemical-supplier/hydrochloric-acid-oman | — |  | omanchlorine.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | hydrochloric acid supplier sohar (R11) | /chemical-supplier/hydrochloric-acid-oman | — |  | soharchemical.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | caustic soda supplier oman (R12 = 3) | /chemical-supplier/caustic-soda-oman | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | bentonite price oman (57) | product panel | — |  | solarenergyoman.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | soda ash price oman (58) | product panel | — |  | noon.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | citric acid price oman (59) | product panel | — |  | talabat.com | pws=0 gl=om navigated, top 8 (core update) |
| 2026-11-15 | google | ethylene glycol price oman (60) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | corrosion inhibitor price oman (61) | product panel | 8 | /products/corrosion-inhibitor | noon.com | pws=0 gl=om navigated, top 8 (core update) |
| 2026-11-15 | google | lubricants price oman (62) | product panel | — |  | noon.com | pws=0 gl=om navigated, top 8 (core update) |
| 2026-11-15 | google | potassium chloride price oman (63) | product panel | — |  | noon.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | urea supplier oman (2) | product panel | — |  | muscatfertilizer.net | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-15 | google | hydrogen peroxide supplier oman (6) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | nitric acid supplier saudi arabia (R1) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-16 | google | nitric acid supplier riyadh (R2) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-16 | google | nitric acid supplier dammam (R3) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-16 | google | calcium hypochlorite supplier uae (R4) | /chemical-supplier/calcium-hypochlorite-uae | — |  | chemstock.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-16 | google | calcium hypochlorite supplier dubai (R5) | /chemical-supplier/calcium-hypochlorite-uae | — |  | hazchem.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-16 | google | calcium hypochlorite 70% uae (R6) | /chemical-supplier/calcium-hypochlorite-uae | — |  | chemstock.ae | pws=0 gl=ae navigated, top 9 (core update) |
| 2026-11-16 | google | calcium hypochlorite supplier bahrain (R7) | /chemical-supplier/calcium-hypochlorite-bahrain | — |  | aleradahchemicals.com | pws=0 gl=bh navigated, top 9 (core update) |
| 2026-11-16 | google | nitric acid supplier oman (R8) | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | sodium hypochlorite supplier oman (R9) | /chemical-supplier/sodium-hypochlorite-oman | — |  | omanchlorine.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | hydrochloric acid supplier oman (R10) | /chemical-supplier/hydrochloric-acid-oman | — |  | omanchlorine.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | hydrochloric acid supplier sohar (R11) | /chemical-supplier/hydrochloric-acid-oman | — |  | soharchemical.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | caustic soda supplier oman (R12) | /chemical-supplier/caustic-soda-oman | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | sulphuric acid supplier oman (7) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | glycerine supplier oman (8) | product panel | — |  | sebacic.co | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | isopropyl alcohol supplier oman (9) | product panel | — |  | chemstock.om | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | methanol supplier oman (10) | product panel | — |  | omanmethanol.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | acetic acid supplier oman (11) | product panel | — |  | muscatchemical.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | calcium chloride supplier oman (12) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | calcium hypochlorite supplier oman (13) | product panel | — |  | chemstock.om | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | poly aluminium chloride supplier oman (14) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | bentonite supplier oman (15) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | soda ash supplier oman (16) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | citric acid supplier oman (17) | product panel | — |  | uvwater.biz | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | ethylene glycol supplier oman (18) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-16 | google | corrosion inhibitor supplier oman (19) | product panel | — |  | omanchem.com | pws=0 gl=om navigated, top 9 (core update) |
| 2026-11-17 | google | nitric acid supplier saudi arabia (R1) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa navigated, top 9 (core update) |
| 2026-11-17 | google | nitric acid supplier riyadh (R2) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa fetched, top 9 (core update) |
| 2026-11-17 | google | nitric acid supplier dammam (R3) | /chemical-supplier/nitric-acid-saudi-arabia | — |  | nassguard.sa | pws=0 gl=sa fetched, top 9 (core update) |
| 2026-11-17 | google | calcium hypochlorite supplier uae (R4) | /chemical-supplier/calcium-hypochlorite-uae | — |  | chemstock.ae | pws=0 gl=ae fetched, top 9 (core update) |
| 2026-11-17 | google | calcium hypochlorite supplier dubai (R5) | /chemical-supplier/calcium-hypochlorite-uae | — |  | hazchem.ae | pws=0 gl=ae fetched, top 9 (core update) |
| 2026-11-17 | google | calcium hypochlorite 70% uae (R6) | /chemical-supplier/calcium-hypochlorite-uae | — |  | chemstock.ae | pws=0 gl=ae fetched, top 9 (core update) |
| 2026-11-17 | google | calcium hypochlorite supplier bahrain (R7) | /chemical-supplier/calcium-hypochlorite-bahrain | — |  | aleradahchemicals.com | pws=0 gl=bh fetched, top 9 (core update) |
| 2026-11-17 | google | nitric acid supplier oman (R8) | /chemical-supplier/nitric-acid-oman | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | sodium hypochlorite supplier oman (R9) | /chemical-supplier/sodium-hypochlorite-oman | — |  | omanchlorine.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | hydrochloric acid supplier oman (R10) | /chemical-supplier/hydrochloric-acid-oman | — |  | omanchlorine.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | hydrochloric acid supplier sohar (R11) | /chemical-supplier/hydrochloric-acid-oman | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | caustic soda supplier oman (R12) | /chemical-supplier/caustic-soda-oman | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | lubricants supplier oman (20) | product panel | — |  | mobil.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | potassium chloride supplier oman (21) | product panel | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy nitric acid in oman (22) | product panel | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy urea in oman (23) | product panel | — |  | muscatfertilizer.net | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy caustic soda in oman (24) | product panel | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy hydrochloric acid in oman (25) | product panel | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy sodium hypochlorite in oman (26) | product panel | — |  | omanchlorine.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy hydrogen peroxide in oman (27) | product panel | — |  | gcc.luluhypermarket.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy sulphuric acid in oman (28) | product panel | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy glycerine in oman (29) | product panel | — |  | gcc.luluhypermarket.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy isopropyl alcohol in oman (30) | product panel | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy methanol in oman (31) | product panel | — |  | omanmethanol.com | pws=0 gl=om fetched, top 9 (core update) |
| 2026-11-17 | google | buy acetic acid in oman (32) | product panel | — |  | omanchem.com | pws=0 gl=om fetched, top 9 (core update) |
