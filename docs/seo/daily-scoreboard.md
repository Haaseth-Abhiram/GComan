# Daily scoreboard: SEO · AEO · GEO · Search Console

One row per day, written by the scheduled daily run (`scripts/ops/run-daily-search-ops.sh` → skill `running-search-operations`). **Append-only. Never edit an earlier row.** Write `n/m` (not measured) for any cell that wasn't read today, with the reason in Notes. A number that wasn't read today is never copied forward.

Per-query, per-city detail lives in `location-ledger.md`. Narrative notes go in `visibility-ledger.md`.

## Columns

| Column | Source | How it's read |
|---|---|---|
| Live | `npm run verify:live-pages -- --strict-modified` | `passed/total` location + hub pages |
| GSC 7d clk / imp / pos | Search Console → Performance, web, last 7 days | The whole site |
| Δ vs prev 7d | Same report, "Compare last 7 days to previous period" | Clicks change, as a % |
| OM / SA / AE clk 7d | Same report, Countries tab | Oman, Saudi Arabia, UAE clicks |
| G: supp oman / in oman / muscat / company oman | Google fetch, `pws=0 gl=om` | Our organic rank, `—` if not in the top 9 |
| G batch | `panel:locations --engine=google --batch=today` | Locations at #1–3 / checked |
| Bing | `panel:locations --engine=bing` (Sunday) or the 4 head terms (other days) | Head terms at #1 / checked |
| Maps Muscat | "chemical supplier", Muscat viewport | Our position |
| AI (ChatGPT / Perplexity) | "best chemical suppliers in Oman" (Sunday) | Position of Global Chemicals LLC |
| Indexing | GSC URL Inspection | URLs requested today |
| Action | — | What changed today, or "none" |

## Targets (what "number one" means here)

| Market | Target | Current lever |
|---|---|---|
| Oman head terms ("chemical suppliers oman", "chemical supplier muscat") | #1 Google, Bing, Maps, ChatGPT, Perplexity | Reviews (Maps), off-site listings (MASTER-PLAN P5) |
| Oman product × hub terms | #1–3 Google and Bing | Hubs are live. Indexing, then internal links |
| GCC city terms | Top 3 in the "export from Oman" frame; head-on "supplier in <city>" is held by local directories | Country directory listings (P5.5) |
| AI answers | Named first | Wikidata, D-U-N-S, Made in Oman Gate (P5) |

## Watch list (alarms)

| Alarm | Trigger | Action |
|---|---|---|
| Live-page FAIL | Any | Fix today (code → Develop → gates) |
| GSC 7d clicks | Down >25% vs previous 7 days, **two days running** | Run the `checking-seo-health` diagnosis; build the same-cell table |
| Saudi clicks (Riyadh/Jeddah/Dammam retitle, 2026-09-10) | 3-week average below 9 a week | Propose the "Saudi Arabia" title test to the user |
| Head term leaves the top 3 | Two readings in a row | Map it to its lever (skill Step 5) |

## Log

| Date | Live | GSC 7d clk / imp / pos | Δ clk | OM / SA / AE | G: supp oman / in oman / muscat / company oman | G batch | Bing | Maps Muscat | AI | Indexing | Action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-18 | 64/64 | n/m (28d: 535 / 8.87K / 8.4) | 28d −3.6% | 28d: 218 / 37 / 35 | 2 / 1 / 3 / 15 | batch 1: Oman 4 of 6 ranked (3, 2, 4, 3); GCC mostly absent | 41 checks: 12 at #1–3 | 7 | ChatGPT 2 / Perplexity 1 | nitric Kuwait, Bahrain | Published `eb2e85b1`; IndexNow 639 |
| 2026-10-18 (cloud) | n/m: 0/64, every fetch denied by the cloud environment's network policy (proxy 403 to gcoman.com), not a page fault; llms-txt OK 95 links / 277 SKUs; lastmod in sync; x-deployment-id n/m (same block) | n/m | n/m | n/m | (WS) — / — / — / — (#1: madeinomangate.com / infobelpro.com / madeinomangate.com / a-leads.co); nitric — (#1 go4worldbusiness.com), HCl — (#1 investing.com) (WS) | n/m | n/m | n/m | n/m | n/m | none. GSC/Maps/AI need the signed-in Chrome run. WS is the global index, not gl=om: not comparable with the Chrome row above |
