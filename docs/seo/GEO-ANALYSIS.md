# GEO (Generative Engine Optimization) Analysis — gcoman.com
**Global Chemicals LLC | B2B Chemical Supplier, Oman & GCC**
Audit date: 2026-05-24

---

## GEO Readiness Score: 41/100

| Dimension | Weight | Raw Score | Weighted |
|---|---|---|---|
| Citability | 25% | 30/100 | 7.5 |
| Structural Readability | 20% | 48/100 | 9.6 |
| Multi-Modal Content | 15% | 25/100 | 3.75 |
| Authority & Brand Signals | 20% | 42/100 | 8.4 |
| Technical Accessibility | 20% | 60/100 | 12.0 |
| **TOTAL** | | | **41.25/100** |

---

## Platform-Specific Scores

| Platform | Score | Reasoning |
|---|---|---|
| Google AI Overviews | 38/100 | Prerendered HTML helps crawlability; schema present but no Product `offers`, no FAQ schema, no cited statistics, team-based not named authors |
| ChatGPT / GPT-4o Search | 32/100 | No llms.txt, GPTBot not explicitly allowed (catch-all covers it but not declared), no Wikipedia entity, no passage-length-optimised answer blocks |
| Perplexity | 44/100 | Blog has question-style H2s and some 134-167 word passages; SSR works in favour; zero external citations hurts trust scoring |
| Bing Copilot | 40/100 | Bingbot explicitly allowed; LocalBusiness + Organization schema present; missing FAQ schema and named author bylines weakens confidence |

---

## AI Crawler Access Status

### robots.txt as-found (https://gcoman.com/robots.txt)

```
User-agent: Googlebot        Allow: /
User-agent: Bingbot          Allow: /
User-agent: Twitterbot       Allow: /
User-agent: facebookexternalhit  Allow: /
User-agent: AhrefsBot        Disallow: /
User-agent: SemrushBot       Disallow: /
User-agent: MJ12bot          Disallow: /
User-agent: DotBot           Disallow: /
User-agent: BLEXBot          Disallow: /
User-agent: *                Allow: /
Sitemap: https://gcoman.com/sitemap.xml
```

### AI Crawler Evaluation

| Crawler | Purpose | Current Status | Required Action |
|---|---|---|---|
| GPTBot | ChatGPT live search & training | IMPLICITLY allowed via `* Allow: /` — NOT explicitly declared | Add explicit `Allow: /` |
| OAI-SearchBot | ChatGPT real-time browsing | IMPLICITLY allowed | Add explicit `Allow: /` |
| ClaudeBot | Anthropic search (this tool) | IMPLICITLY allowed | Add explicit `Allow: /` |
| PerplexityBot | Perplexity AI search | IMPLICITLY allowed | Add explicit `Allow: /` |
| CCBot | Common Crawl (training data) | IMPLICITLY allowed — you may want to block | Optional: `Disallow: /` |
| anthropic-ai | Anthropic training corpus | IMPLICITLY allowed | Decide: allow or block |
| cohere-ai | Cohere training corpus | IMPLICITLY allowed | Decide: allow or block |
| Bingbot | Bing / Copilot | Explicitly allowed | Good — keep |
| Googlebot | Google AIO | Explicitly allowed | Good — keep |

**Critical gap:** None of the four primary AI search crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot) are explicitly declared. They currently inherit `* Allow: /`, which works at runtime, but the absence of explicit declarations signals to AI platforms that crawler access has not been intentionally considered. Explicit declarations improve trust scoring on some platforms.

### Recommended robots.txt addition (insert above the `*` rule)

```
# AI Search Crawlers — explicitly permitted for search/answer visibility
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Training-only crawlers — block to preserve content for search, not corpus mining
User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: cohere-ai
Disallow: /
```

---

## llms.txt Status

**Status: MISSING** — `https://gcoman.com/llms.txt` returns no file (404).

llms.txt is the emerging standard (analogous to robots.txt) for signalling to LLMs how your content should be understood and used. Without it, AI models must infer your entity identity, scope, and content structure from HTML alone, which produces lower-confidence citations.

### Ready-to-use llms.txt template for gcoman.com

Save this content as `public/llms.txt`. It will be served at `https://gcoman.com/llms.txt` after the next build and deploy.

```
# Global Chemicals LLC — LLMs.txt
# https://gcoman.com/llms.txt
# Last updated: 2026-05-24
# License: RSL 1.0 (https://rsl.rcn.org/)

> Global Chemicals LLC (gcoman.com) is a B2B specialty and industrial chemical
> supplier headquartered in Ghala, Muscat, Oman. The company supplies and exports
> chemicals across the GCC region (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain).
> ISO 9001:2015 certified, JSRS registered, and ICV compliant. Founded in Muscat;
> operating Sunday–Thursday 08:00–18:00 GST. Contact: info@gcoman.com,
> +968 93754388.

## Core Identity

- Legal name: Global Chemicals LLC
- Alternate names: GC Oman, GCOMAN, Global Chemicals Middle East
- Domain: https://gcoman.com
- LinkedIn: https://www.linkedin.com/company/global-chemicals-llc
- Headquarters: Office-3, Building 1737, Near Oman LNG, Ghala, Muscat, Oman
- Service area: Oman (Muscat, Sohar, Salalah, Duqm, Rusayl), UAE, Saudi Arabia,
  Qatar, Kuwait, Bahrain
- Certifications: ISO 9001:2015, JSRS (Joint Supplier Registration System),
  ICV (In-Country Value) Compliant
- Business type: B2B wholesale chemical distribution and supply
- Languages: English, Arabic

## Product Categories (21+ categories, 263+ SKUs)

- Water Treatment Chemicals: PAC (Poly Aluminium Chloride), Sodium Hypochlorite,
  Calcium Hypochlorite, Antiscalants, Coagulants, Flocculants
- Oilfield & Refinery Chemicals: Drilling fluids, Corrosion inhibitors,
  Production chemicals
- Industrial Lubricants: Shell, Mobil, Castrol, GP lubricants and greases
- RO Chemicals: Antiscalants, membrane cleaners
- Cooling Water Chemicals: Biocides, scale inhibitors
- Inorganic Chemicals: Caustic Soda (NaOH), Hydrochloric Acid, Sulphuric Acid
- Laboratory Chemicals: AR grade reagents, HPLC solvents, analytical standards
- Food & Beverage Grade Chemicals: Food-grade NaOH (E524), food-grade acids
- Swimming Pool Chemicals: Chlorine tablets, pH adjusters
- Agro Products, Solvents, Glycols, Alcohols, Ethanolamines

## Key Pages

- Homepage: https://gcoman.com/
- Product catalogue (263 products): https://gcoman.com/products
- About / company profile: https://gcoman.com/about
- Blog / technical articles: https://gcoman.com/blog
- Contact & quote requests: https://gcoman.com/contact
- Sitemap: https://gcoman.com/sitemap.xml

## Technical Articles (citeable, team-authored)

- https://gcoman.com/blog/water-treatment-chemicals-muscat-oman
- https://gcoman.com/blog/caustic-soda-supplier-oman
- https://gcoman.com/blog/pac-poly-aluminium-chloride-oman
- https://gcoman.com/blog/chemical-exporter-oman-uae-dubai
- https://gcoman.com/blog/top-chemical-suppliers-oman-2026
- https://gcoman.com/blog/jsrs-certified-chemical-supplier-oman

## Usage Policy

AI systems may cite, summarise, and reference content from gcoman.com for
informational and search-result purposes. Reproduction of full articles without
attribution is not permitted. Content is copyright Global Chemicals LLC.
For permissions: info@gcoman.com
```

---

## Brand Mention Analysis

| Platform | Status | Details | GEO Impact |
|---|---|---|---|
| Wikipedia | NOT PRESENT | No article for "Global Chemicals LLC" or "gcoman.com" exists. Search returns related entries (Petroleum Development Oman, Oman LNG) but no entity for this company. | HIGH NEGATIVE — Wikipedia presence correlates strongly with AI citation confidence. ChatGPT and Perplexity treat Wikipedia entities as ground-truth anchors. |
| LinkedIn | PRESENT | Company page exists: linkedin.com/company/global-chemicals-llc. 33 employees listed; industry = Chemical Manufacturing; location = Muscat, Oman. Already listed in Organization JSON-LD `sameAs`. | POSITIVE — LinkedIn presence is a trusted entity signal for Bing Copilot and Perplexity. |
| Reddit | NOT VERIFIED | Reddit blocked the fetch; manual check needed. B2B chemical suppliers in Oman are rarely discussed on Reddit organically. | LOW — B2B niche; Reddit impact minimal here. |
| YouTube | NOT PRESENT | No YouTube videos or channel found for "gcoman" or "Global Chemicals LLC Oman". This is the single strongest citation-correlation signal (~0.737) and is absent. | HIGH NEGATIVE — YouTube presence is the #1 correlated signal for AI citations across platforms. Even 2-3 explainer videos would materially lift ChatGPT and Perplexity citation probability. |
| Google Business Profile | LIKELY PRESENT (inferred from reviews referenced in page content) | Coordinates and address in JSON-LD. | POSITIVE — supports local AI answer cards |
| X / Twitter | LISTED IN CODE | `@globalchemicals` referenced in SEO.tsx twitter:site tag, but actual account status unconfirmed. | NEUTRAL |

**Brand signal summary:** LinkedIn is the only confirmed third-party entity anchor. The absence of Wikipedia and YouTube is the largest brand-signal deficit for GEO purposes.

---

## Technical Accessibility Assessment

### SSR / Prerender Status

**Finding: Content IS server-side prerendered — with one important caveat.**

The site uses Puppeteer-based static prerendering at build time via `@prerenderer/rollup-plugin`. Each route gets a `dist/<route>/index.html` with fully rendered HTML. This means AI crawlers receive real text content on first HTTP fetch without executing JavaScript.

Confirmed prerendered content observed in page fetches:
- Homepage body contains live H1, H2, H3 headings and product category text
- `/products` page contains "263 products available" and full category list in HTML
- `/blog` page headings and article metadata present in HTML

**Caveat — the `index.html` shell:** The source `index.html` has `<body><div id="root"></div>` (empty shell). The prerendered HTML files in `dist/` are what crawlers actually see. This works correctly when `public/.htaccess` is in place on Hostinger. Per `CLAUDE.md`, the Cloudflare Worker is the actual routing layer in production — confirm the Worker is correctly rewriting clean URLs to `path/index.html` for all product pages, as CSR detection was reported on some deeper product pages during this audit.

**Inconsistency found:** The about page and some product detail pages showed signals of possible CSR (dynamic asset hash in image URLs like `-DhCKJoH9.svg`). This may indicate the prerender is not running for all routes, or the WebFetch tool fetched through a CDN edge that bypassed the Worker rewrite. Verify with:

```bash
curl -s https://gcoman.com/about | grep -o '<title>[^<]*'
curl -s https://gcoman.com/products/water-treatment/sodium-hypochlorite | grep -o '<title>[^<]*'
```

### Structured Data Present (JSON-LD in index.html)

| Schema Type | Present | Notes |
|---|---|---|
| Organization | YES | Complete — address, contactPoint, areaServed, certifications, sameAs (LinkedIn) |
| LocalBusiness | YES | Complete — geo, openingHours, paymentAccepted, currenciesAccepted, hasCredential |
| WebSite + SearchAction | YES | Sitelinks search box eligible |
| ItemList (Services) | YES | 4 service categories with delivery lead times |
| Product | YES (per-product pages) | Via StructuredData.tsx — name, description, CAS number as productID, brand, manufacturer |
| Article / BlogPosting | NOT CONFIRMED | Blog articles use `ogType: 'article'` in SEO.tsx but JSON-LD BlogPosting schema not seen |
| FAQPage | MISSING | No FAQ schema anywhere on the site |
| HowTo | MISSING | Technical guides (water treatment dosing) could use HowTo schema |
| BreadcrumbList | REFERENCED IN CLAUDE.md | Present in index.html per docs but not confirmed in current HTML |

**Schema gap — duplicate `@id`:** Both Organization and LocalBusiness use `"@id": "https://gcoman.com/#organization"`. This is a known collision risk. The LocalBusiness should use `"@id": "https://gcoman.com/#local-business"` or the two types should be merged into a single node using `@type: ["Organization", "LocalBusiness"]`.

**Schema gap — Product has no `offers` block:** The `StructuredData.tsx` comment explains pricing is on-application. This is correct to avoid GSC validator errors. However, the Product schema also lacks `aggregateRating` and `review`, which are the other paths to Product rich results. Consider adding a `Offer` with `priceSpecification` type "quote-based" or a manual aggregate rating if customer reviews are collected.

---

## Passage-Level Citability Analysis

The optimal passage length for AI citation extraction is **134–167 words** — long enough to be self-contained, short enough to fit cleanly into an AI response without truncation.

### Homepage (`/`)

| Section | Word Count (est.) | Self-Contained? | Issue |
|---|---|---|---|
| Hero tagline + sub-copy | ~30 words | No | Too short; marketing copy, not answerable |
| "Why Industry Leaders Choose Us" | ~80 words | No | Under threshold; bullet points not prose |
| "Solutions for Every Industry" | ~60 words | No | Under threshold |

**Score: 0/5 passages meet the 134-167 word target.**

### Product Page — Sodium Hypochlorite (`/products/water-treatment/sodium-hypochlorite`)

| Section | Word Count | Self-Contained? | Issue |
|---|---|---|---|
| Product Overview | 6 words | No | Single sentence tagline |
| Detailed Description (full block) | ~187 words | Partially | Exceeds 167; could be split into two 90-word blocks |
| Applications list | ~20 words | No | Bullet list without prose context |
| Technical Specifications | N/A (table) | No | Table format not cited by AI without surrounding prose |

**Score: 0/5 passages meet the 134-167 word sweet spot.** The 187-word description block is the closest candidate — trim to 155 words and it would be the ideal extractable citation unit.

### Blog — Water Treatment Chemicals (`/blog/water-treatment-chemicals-muscat-oman`)

| Section | Word Count | Self-Contained? | Issue |
|---|---|---|---|
| Intro paragraph | 194 words | Partially | Slightly over threshold; lacks a direct answer sentence in first 40 words |
| Muscat water chemistry paragraph | 119 words | Yes | Under threshold but nearly ideal — expand by ~20 words |
| PAC paragraph | 156 words | YES | Meets 134-167 target; self-contained; specific technical data |
| Calcium/sodium hypochlorite section | Unknown | Likely yes | Structure is good |

**Score: 1/4 paragraphs definitively meets the target (the PAC paragraph at 156 words).** This is the only passage on the site currently optimised for AI citation.

### Blog — Caustic Soda Supplier (`/blog/caustic-soda-supplier-oman`)

All four paragraphs surveyed are 41–83 words each — well below threshold. The article body is structured as short stubs under question-style H2 headings but without the fleshed-out prose those headings promise. AI engines will extract the heading as a question but find no dense answer block beneath it.

**Score: 0/4 passages meet threshold.**

### Overall Citability Assessment

- Direct answer in first 40-60 words of each section: **FAILING** — most sections begin with context-setting, not direct answers.
- Question-based H2/H3 headings: **PARTIAL** — blog articles use question-style H2s ("What is Caustic Soda and Why is it Called That?", "Why Water Chemistry Differs in Oman"). Product and static pages do not.
- Statistics with source attribution: **FAILING** — statistics exist (e.g., desalination volumes, dosing ranges) but zero external source citations appear anywhere on the site. All figures are unattributed.
- FAQ sections: **MISSING** — no page has an FAQ section or FAQPage schema.
- Author bylines: **PARTIAL** — blog uses team-based bylines ("Global Chemicals Technical Team", "HSE Department"). Named individual authors would increase AI trust scoring.

---

## Top 5 Highest-Impact Changes

### 1. Create and deploy `public/llms.txt`
**GEO impact: HIGH | Effort: 30 minutes | Lifts: ChatGPT, Perplexity, Claude**

Use the template in the llms.txt section above. Save to `public/llms.txt`. It will be served at `https://gcoman.com/llms.txt` after the next Lovable deploy. This is a single file with outsized signal value — AI engines that discover an llms.txt treat the domain as intentionally AI-friendly and will reference entity details (certifications, service area, product categories) from it directly in answers.

### 2. Add AI crawlers explicitly to robots.txt
**GEO impact: HIGH | Effort: 15 minutes | Lifts: all platforms**

Add the explicit declarations shown in the robots.txt section. Also add the training-only blocks for CCBot, anthropic-ai, and cohere-ai to protect the technical content from bulk corpus mining while keeping search crawlers open. Edit `public/robots.txt` (or create it if it does not exist separately — currently it appears to be served dynamically or from a root file not in this repo).

**Check first:**
```bash
ls /Users/ayansh/Development/GCOMAN/gcoman-insight-design/public/robots.txt
```
If it does not exist, the robots.txt is either generated or hosted separately and needs to be added.

### 3. Add FAQPage schema + FAQ sections to the top 10 product pages
**GEO impact: HIGH | Effort: 4-6 hours | Lifts: Google AIO, Bing Copilot**

FAQPage is the single highest-converting schema type for Google AI Overviews. For each major product page (sodium hypochlorite, caustic soda, PAC, calcium hypochlorite, antiscalant), add:

- A visible FAQ section with 4-6 Q&A pairs (each answer 80-120 words)
- Corresponding FAQPage JSON-LD via the `StructuredData.tsx` component

Example FAQ questions for Sodium Hypochlorite that match real AI queries:
- "What concentration of sodium hypochlorite is used for water treatment in Oman?"
- "How is sodium hypochlorite dosed in PAEW water treatment plants?"
- "What is the shelf life of sodium hypochlorite in Oman's climate?"
- "What are the packaging options for bulk sodium hypochlorite supply in Oman?"

Each answer should be 80-120 words, direct, self-contained, and not require reading the rest of the page to make sense.

### 4. Expand all blog article answer blocks to the 134-167 word target
**GEO impact: HIGH | Effort: 8-12 hours across all articles | Lifts: Perplexity, ChatGPT**

The blog has the right structure (question-based H2s) but the wrong density (40-83 word answers). For each H2 section in each blog article, the answer block immediately following the heading needs to be 134-167 words of self-contained prose. The PAC paragraph in the water treatment article is the reference example to replicate site-wide.

Additionally, add at least one externally sourced statistic per article (e.g., cite Oman MONE for desalination volumes, WHO guidelines for chlorine residuals, or Oman Vision 2040 for industrial targets). Unattributed statistics are treated as lower-confidence by AI citation engines.

Priority order: caustic soda guide, top chemical suppliers 2026, JSRS certification article, RO membrane chemicals, industrial lubricants guide.

### 5. Launch a YouTube channel with 3-5 technical explainer videos
**GEO impact: HIGH | Effort: 2-4 weeks | Lifts: ChatGPT, Perplexity (strongest signal)**

YouTube presence has a ~0.737 correlation with AI engine citations — the highest single signal measured. Videos do not need production quality. A 3-5 minute screen-capture or talking-head video titled "How to choose water treatment chemicals for Oman's desalinated water supply" or "Sodium hypochlorite dosing for PAEW municipal plants" would create the YouTube entity anchor that currently does not exist. The video description should include the gcoman.com domain, CAS numbers, and product names. Link from the corresponding product and blog pages.

---

## Schema Recommendations

### Immediate fixes (in `index.html`)

**Fix the duplicate @id collision.** Both Organization and LocalBusiness nodes use `"@id": "https://gcoman.com/#organization"`. Change the LocalBusiness @id to `"https://gcoman.com/#local-business"` to avoid graph conflicts in knowledge panels.

### Add to `StructuredData.tsx`

Add a new export `FAQStructuredData` component:

```tsx
// In src/components/StructuredData.tsx
export const FAQStructuredData = ({ faqs }: { faqs: { question: string; answer: string }[] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  return (
    <Helmet defer={false}>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
```

Add a `BlogPostingStructuredData` component for article pages that currently only emit `ogType: 'article'` in open graph but have no JSON-LD `Article` or `BlogPosting` node:

```tsx
export const BlogPostingStructuredData = ({ article }: { article: BlogArticle }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "author": {
      "@type": "Organization",
      "name": article.author,
      "url": "https://gcoman.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Global Chemicals LLC",
      "logo": { "@type": "ImageObject", "url": "https://gcoman.com/logo.png" }
    },
    "datePublished": article.date,
    "dateModified": article.date,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://gcoman.com/blog/${article.id}` }
  };
  return (
    <Helmet defer={false}>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
```

### Add HowTo schema for technical dosing guides

The water treatment article has step-by-step dosing instructions that are a natural fit for HowTo schema. AI engines give elevated citation weight to HowTo-marked content when answering procedural queries like "how to dose PAC for industrial water treatment in Oman."

### Add SpecialAnnouncement or Certification claims to Organization

Add `"hasCertification"` (schema.org/hasCertification) using the Certification type, cross-linking JSRS and ISO 9001 with their issuing bodies. This strengthens the machine-readable trust chain.

---

## Content Reformatting Suggestions

### Homepage (`/`)

**Problem:** The homepage contains zero passage-length answer blocks. Hero sections, feature bullets, and CTA copy are not citable units.

**Fix:** Add a "What is Global Chemicals LLC?" section below the hero with a single 150-word paragraph that directly answers: "Global Chemicals LLC is a B2B chemical supplier based in Ghala, Muscat, Oman, supplying water treatment chemicals, oilfield chemicals, industrial lubricants, and laboratory chemicals across Oman and the GCC. The company holds ISO 9001:2015 certification, JSRS registration for oil and gas procurement, and ICV compliance under Oman's economic diversification program..." This becomes the passage AI engines quote when a user asks "who is the main chemical supplier in Oman?"

### About Page (`/about`)

**Problem:** Statistics present (10+ years, 200+ clients, 98% satisfaction, 1000+ products) but unattributed and vague. Team section has no individual names. Mission/vision statements are too short (35-45 words each) to be cited.

**Fix 1:** Expand each mission/vision statement to 134-167 words.

**Fix 2:** Add at least two named individuals (CEO, Technical Director) with title and brief bio. Named authorship is a key AI trust signal — team-based bylines ("Global Chemicals Technical Team") score lower than named experts.

**Fix 3:** Add a "Company History" timeline section: "Founded in [year] in Muscat, Oman, Global Chemicals LLC began supplying water treatment chemicals to municipal operators in the Muscat Governorate. By [year], the company expanded to oilfield chemicals, receiving JSRS certification to supply PDO, OQ, and Oman LNG contractors..." This 150-word passage would be the most-cited passage from the entire site for queries like "when was Global Chemicals LLC founded" or "history of chemical suppliers in Oman."

### Product Pages (`/products/water-treatment/*`)

**Problem:** Product descriptions are 6-187 words with no consistent structure. No FAQ. Technical specs are in a table (uncitable). No external authority citations.

**Fix — apply this structure to all product pages:**
1. One-sentence definition (the current 6-word tagline is fine as a microformat)
2. Self-contained overview block: 140-160 words covering what it is, why it matters in Oman's industrial context, the key specification range (e.g., 12-15% available chlorine), and typical applications
3. Bulleted Applications list (keep as-is)
4. Technical specs table (keep as-is, but add a note for screen readers)
5. NEW: FAQ section — 4 questions, each 80-120 words, covering: concentration/dosing, packaging/availability in Oman, storage in hot climate, and regulatory/safety info
6. "Request a Quote" CTA (keep as-is)

### Blog Articles

**Problem:** Caustic soda article has question-style H2s with 41-83 word answers — too short to cite. No external citations. Pricing data ("USD 180-280 per dry metric tonne") is unattributed.

**Fix:** For the caustic soda article specifically:
- Under "What is Caustic Soda and Why is it Called That?" — expand the answer from 72 words to 150 words including the chemical equation (NaOH + H2O electrolysis), historical note on soda ash, and a reference to Oman's industrial demand
- Under "Caustic Soda Pricing in Oman" — attribute the price range to a source (ICIS, Chemanalyst, or a declared internal market-rate date: "as of Q1 2026, based on Global Chemicals LLC market data")
- Add a 5-question FAQ section at the end of every blog article

### Language and Directness Across All Pages

**Problem:** Most opening sentences begin with contextual framing rather than direct answers. Example: "Industrial water treatment in Muscat, Oman presents unique challenges..." — AI engines prefer answers that begin with the fact, not the context.

**Fix — apply the "answer first" pattern:**
- Before: "Industrial water treatment in Muscat presents unique challenges..."
- After: "PAC (Poly Aluminium Chloride) is the primary coagulant used in Oman's industrial water treatment systems, dosed at 10-50 mg/L for the high-temperature, desalinated water conditions common in Muscat and the GCC."

This "inverted pyramid" structure — answer in the first sentence, context in sentences 2-4 — is the single most impactful prose change for AI citability.

---

## Audit Method Notes

- Pages fetched: robots.txt, llms.txt, homepage, /products, /about, /products/water-treatment/sodium-hypochlorite, /blog, /blog/water-treatment-chemicals-muscat-oman, /blog/caustic-soda-supplier-oman
- Source code reviewed: index.html, src/components/SEO.tsx, src/components/StructuredData.tsx, src/data/blogArticles.ts, public/sitemap.xml
- Brand platforms checked: Wikipedia (not found), LinkedIn (found), YouTube (not found), Reddit (blocked)
- DataForSEO tools: not available in this environment — live ChatGPT visibility check not performed; scores above are based on structural analysis
- Prerender confirmation: partial — homepage and /products confirmed SSR; /about and product detail pages showed possible CSR signals requiring direct curl verification
