# GEO Entity Kit — Wikidata + YouTube — 2026-09-27

**Why these two, specifically:** the GEO framework's own research (Ahrefs, Dec 2025, 75,000 brands) ranks third-party entity signals far above backlinks for AI-citation correlation — YouTube mentions (~0.737) and Wikipedia/Wikidata presence ("High") beat Domain Rating (~0.266) by a wide margin. The 09-21 audit flagged this footprint as zero. Checking it live today:

- **YouTube**: the channel `@GlobalChemicalsLLC` is real and already linked in the site's `sameAs` schema — but it has **3 subscribers and exactly 1 video** (a 19-second clip, 35 views, posted ~2 years ago). Structurally present, practically invisible.
- **Wikidata**: no entity exists at all (checked live).

I can't film video or create Wikidata accounts myself — this doc is the ready-to-use material so both take minutes, not hours, once someone sits down to do them.

---

## 1. Wikidata entity — ready to paste

Go to [wikidata.org/wiki/Special:NewItem](https://www.wikidata.org/wiki/Special:NewItem) (requires a free Wikidata account) and create a new item with:

**Label (en):** `Global Chemicals LLC`
**Description (en):** `chemical distribution company in Oman`
**Also known as:** `GC Oman`, `GCOMAN`

**Statements to add** (property → value, using only facts already published and verifiable on gcoman.com/llms.txt):

| Property | Value |
|---|---|
| instance of (P31) | business (Q4830453) |
| country (P17) | Oman (Q842) |
| headquarters location (P159) | Muscat (Q3654) — add as qualifier: "Ghala, Muscat" |
| industry (P452) | chemical industry (Q220949) |
| official website (P856) | `https://gcoman.com` |
| inception (P571) | *(leave blank unless you know the actual founding year — don't guess)* |

**References for each statement:** cite `https://gcoman.com` and, where relevant, `https://gcoman.com/certifications` (ISO 9001:2015 / JSRS / ICV) and `https://gcoman.com/about`.

**Important — do NOT link or merge with any existing Wikidata item for a similarly-named company.** A web search today surfaced a separate, unrelated Oman company, "Global Chemicals & Maintenance Systems LLC" (a different business — utility operations/maintenance since 1976, not a chemical supplier). This is a real, already-observed brand-confusion problem (GSC data shows people searching that other company's name and landing in gcoman.com's impression data). If a Wikidata item for that other company already exists, do not attach any of the statements above to it — creating a clean, separate, correctly-labeled item is exactly what resolves this confusion for AI platforms going forward, since Wikidata is a common disambiguation source both Google and LLMs draw from.

**What NOT to add:** revenue figures, employee counts, or a founding date unless you can point to a real, verifiable source for each — Wikidata reviewers (and, more importantly, any AI system reading the entry later) will treat unsourced claims as suspect, which defeats the purpose.

---

## 2. YouTube — 5 low-effort video concepts

The channel has the branding already (banner, logo, category icons) — it just needs content. None of these require a production crew; a phone camera and the existing product/dosing-calculator pages are enough.

1. **"How to use the dosing calculator" (60–90 sec)** — screen-record a walkthrough of one calculator at gcoman.com/tools/dosing-calculator (chlorination is the simplest to demo). Real, already-published tool; genuinely useful; link the tool in the description.
2. **Warehouse/facility walkthrough (60–90 sec)** — a phone-shot walk through the Ghala warehouse showing drums/IBCs/packaging in stock. Real, low-effort, and it's exactly the kind of "trust signal" content (facility → credibility) the audit flagged as missing.
3. **"What is JSRS certification?" (90 sec–2 min)** — explain what JSRS registration means for PDO/OQ vendor qualification, reusing the exact facts already published in the JSRS blog post. This is your strongest existing content asset (already ranks #1 organically) — a video version gives it a second citable format.
4. **Product unboxing/packaging tour (60 sec)** — show the actual pack formats (25kg bags, 200L drums, IBCs) for a commonly-asked-about product like caustic soda. Directly answers a real buyer question ("what packaging is available") with visual proof.
5. **Caustic soda grades explained (90 sec–2 min)** — flakes vs. liquid vs. prills, side by side, reusing the blog's existing grade comparison content.

**Minimum viable version:** even just #1 and #3, uploaded with a real title/description linking back to gcoman.com, moves the channel from "1 abandoned clip" to "an active channel with real content" — which is the threshold that matters for the citation signal, not view count.

---

## What this doesn't change

Both of these are slow-burn signals — a new Wikidata item and a couple of YouTube videos won't move AI answers in days. They're the same category of work as the authority-building kit (reviews, citations, backlinks): necessary, not sufficient on their own, and the payoff compounds over months as AI platforms' training/retrieval data refreshes. The technical GEO work (llms.txt, robots.txt, FAQ schema, this session's B-band/Z-band content expansion) is already strong and already producing results — brand-level AI queries are winning. This kit is specifically targeted at the *product-specific* query gap the 09-26 AI-visibility check found, where AI answers lean more heavily on independent, third-party corroboration.
