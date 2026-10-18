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
