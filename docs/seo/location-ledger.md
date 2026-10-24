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
