export const meta = {
  name: 'full-repo-analysis',
  description: 'Exhaustive multi-agent analysis of the gcoman.com repo: 12 subsystem deep-reads, adversarial verification of every finding, completeness critic',
  phases: [
    { title: 'Analyze', detail: '12 parallel subsystem deep-reads' },
    { title: 'Verify', detail: 'adversarially re-check each finding against the cited code' },
    { title: 'Critic', detail: 'find missed areas across all subsystems' },
  ],
}

const REPO = '/Users/ayansh/Development/GCOMAN/gcoman-insight-design'

const FINDINGS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['subsystem', 'summary', 'healthScore', 'strengths', 'findings'],
  properties: {
    subsystem: { type: 'string' },
    summary: { type: 'string', description: '2-4 sentence overview of this subsystem and its overall health' },
    healthScore: { type: 'integer', minimum: 0, maximum: 100, description: 'subjective health 0-100 for this subsystem' },
    strengths: { type: 'array', items: { type: 'string' }, description: 'things genuinely done well, with file refs where relevant' },
    findings: {
      type: 'array',
      description: 'top issues found, most important first; evidence-backed only, no speculative nitpicks',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'severity', 'category', 'file', 'description', 'recommendation'],
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'info'] },
          category: { type: 'string', enum: ['bug', 'security', 'seo', 'performance', 'maintainability', 'accessibility', 'data-quality', 'correctness', 'deploy'] },
          file: { type: 'string', description: 'file:line where the issue lives (must be a real path you read)' },
          description: { type: 'string', description: 'what is wrong and why it matters; cite concrete code' },
          recommendation: { type: 'string', description: 'concrete fix' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['isReal', 'confidence', 'correctedSeverity', 'reasoning'],
  properties: {
    isReal: { type: 'boolean', description: 'true only if you re-read the cited code and the claim genuinely holds' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    correctedSeverity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'info'], description: 'your independent severity after checking; may differ from the claim' },
    reasoning: { type: 'string', description: 'what you checked in the actual code and why you confirm or refute' },
  },
}

const GAPS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['missedAreas', 'additionalFindings'],
  properties: {
    missedAreas: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['area', 'why'], properties: { area: { type: 'string' }, why: { type: 'string' } } } },
    additionalFindings: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'severity', 'description'], properties: { title: { type: 'string' }, severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'info'] }, description: { type: 'string' } } } },
  },
}

const base = `You are analyzing the repository at ${REPO} — gcoman.com, a Vite+React+TS marketing SPA for a chemical supplier whose SEO depends on a prerender pipeline (sitemap.xml drives @prerenderer puppeteer; every <Helmet> needs defer={false}; a Cloudflare Worker rewrites clean URLs to /index.html in prod). Read the ACTUAL code with Read/Grep/Bash — do not assume. Cite real file:line for every finding. Calibrate severity honestly: critical = breaks prod/SEO/security now; high = real bug or significant risk; medium = should fix; low/info = minor. Do NOT invent issues to fill the list; an empty findings list is acceptable if the subsystem is clean. Prefer fewer, high-confidence findings.`

const SUBSYSTEMS = [
  { key: 'routing-app', prompt: `${base}\n\nSCOPE: Routing & app shell. Read src/App.tsx fully, src/components/LangLayout (if present), src/lib/langRouting.ts, the Suspense/lazy setup, ErrorBoundary, RouteChangeLoader. Check: EN vs /ar route parity (every EN route mirrored?), /en→unprefixed 301 logic, lazy-load consistency, catch-all/404 wiring, any route declared but missing from sitemap or vice versa, duplicate/overlapping routes, key/Suspense bugs. Report subsystem="routing-app".` },
  { key: 'pages-components', prompt: `${base}\n\nSCOPE: Pages and shared components (exclude products/admin/ui which other agents cover). Skim src/pages/*.tsx and src/components/*.tsx. Look for: real React bugs (missing deps, stale closures, key warnings, unguarded null access), each <Helmet>/SEO missing defer={false}, hardcoded values that should be shared, broken internal links, accessibility issues (missing alt, heading order, label-less controls), components doing data fetching without error/loading states. Report subsystem="pages-components".` },
  { key: 'seo-prerender', prompt: `${base}\n\nSCOPE: SEO + prerender pipeline. Read vite.config.ts (routesFromSitemap, prerender opts), src/components/SEO.tsx, src/components/StructuredData.tsx (all schema generators), index.html (verify it only holds allowed global tags — no page-specific description/og/twitter/hreflang that Helmet would duplicate). Check: every <Helmet> has defer={false} (grep all of src), canonical/og/hreflang correctness, JSON-LD validity (@id duplication, required fields, broken schema), title/description length, robots handling. Report subsystem="seo-prerender".` },
  { key: 'routing-edge', prompt: `${base}\n\nSCOPE: Edge routing & crawl directives. Read cloudflare-worker.js (EXACT_REDIRECTS, PREFIX_REDIRECTS, prerender-rewrite), public/.htaccess, public/_redirects, public/_headers, public/sitemap.xml, public/robots.txt, public/llms.txt, wrangler.toml. Check: redirect parity across worker/.htaccess/_redirects (drift?), redirect loops or chains, sitemap entries that 301 elsewhere (should list final URL), robots vs sitemap conflicts, llms.txt freshness vs sitemap, hreflang annotations. Report subsystem="routing-edge".` },
  { key: 'supabase-functions', prompt: `${base}\n\nSCOPE: Supabase edge functions security & correctness. Read every supabase/functions/*/index.ts (submit-contact, submit-job-application, subscribe-newsletter, notify-download, ai-search, refresh-analytics) and supabase/functions/_shared/*. Check: input validation, rate limiting, CORS (wildcard vs allowlist), auth/authorization on each, secret handling, error messages leaking internals, SSRF/injection, unbounded request bodies, Zoho/SMTP/Lovable AI calls. Report subsystem="supabase-functions".` },
  { key: 'supabase-db', prompt: `${base}\n\nSCOPE: Database schema & RLS. Read supabase/SUPABASE_DATABASE_SETUP.sql and skim supabase/migrations/*.sql (newest ones matter most) and src/integrations/supabase/types.ts. Check: RLS enabled on every public table, policies that are overly permissive (USING(true) on sensitive tables), service-role-only tables exposed to anon, missing indexes on filtered columns, PII columns (contact_submissions, job_applications, download_leads) readable by anon, role-escalation risks in user_roles. Report subsystem="supabase-db".` },
  { key: 'product-data', prompt: `${base}\n\nSCOPE: Product data system & data quality. Read src/data/productLoader.ts, productTypes.ts, products.ts, categories.ts, and SAMPLE several src/data/products/*.json (large: oilfield 47, water-treatment 45, lab-chemicals 34, food-beverage 17; small: agro 1). Check: every product has required fields (id, title, description, category matching filename, iconName in ICON_MAP), id slug uniqueness within category, category value matches the JSON filename, duplicate ids, missing iconName, products present in JSON but data-quality gaps (empty applications, missing CAS where expected, missing faqs/longDescription affecting SEO), the sync vs async loader duplication. Report subsystem="product-data".` },
  { key: 'i18n', prompt: `${base}\n\nSCOPE: Internationalization. Read src/i18n/index.ts, src/i18n/locales/en.json, ar.json, products-ar.json, src/lib/langRouting.ts. Check: en/ar key parity (keys in en missing from ar = English leaking into Arabic UI), RTL handling, products-ar coverage vs 263 products (how many translated?), interpolation/escape settings, language detection + SSR guard correctness, hardcoded English strings in components that bypass t(). Report subsystem="i18n".` },
  { key: 'build-tooling', prompt: `${base}\n\nSCOPE: Build, deps, tooling, tests. Read package.json (deps + scripts), tsconfig*.json, eslint.config.js, playwright.config.ts, tests/e2e/*, tailwind.config.ts, postcss.config.js, vercel.json. Check: vestigial/unused deps (@tanstack/*, the .tgz, bun.lock, vercel.json), known-vulnerable or wildly outdated deps, npm engine pinning, loose TS settings impact, eslint disabled rules, test coverage reality (what is actually tested), build chunk-size issues, dev-only deps in prod dependencies. Report subsystem="build-tooling".` },
  { key: 'security', prompt: `${base}\n\nSCOPE: Frontend security & auth. Read src/integrations/supabase/client.ts, client.server.ts, auth-middleware.ts, src/contexts/AuthContext.tsx, src/components/AdminRoute.tsx, ProtectedRoute.tsx, src/hooks/useUserRole.ts, src/pages/Admin.tsx, src/pages/Login.tsx. Grep src for hardcoded secrets/tokens, dangerouslySetInnerHTML, localStorage of sensitive data. Check: admin route really gated server-side (RLS) not just UI, anon key exposure (expected) vs any service-role key in client bundle, XSS surface, auth session handling, open redirects. Report subsystem="security".` },
  { key: 'forms-integrations', prompt: `${base}\n\nSCOPE: Forms & third-party integrations. Read src/components/Turnstile.tsx, the contact form (src/pages/Contact.tsx), src/components/GoogleAnalytics.tsx, ZohoSalesIQ.tsx, AISearchDialog.tsx, DownloadGateDialog.tsx, CookieConsent.tsx, and how they call supabase functions. Check: form validation (client+server), error/success UX, the captcha-disabled-degradation path, PII handling/consent, analytics consent gating (GDPR), script injection of third-parties, missing rel=noopener, env-var guards. Report subsystem="forms-integrations".` },
  { key: 'code-health', prompt: `${base}\n\nSCOPE: Cross-cutting code health. Grep across src for: TODO/FIXME/HACK, console.log left in prod paths, duplicated logic (e.g. category metadata maps duplicated across Products.tsx/ProductDetail.tsx, dead files like categories.ts if unimported), 'any' usage hotspots, copy-paste interfaces, large components that should split, unused exports/imports, inconsistent patterns. Focus on issues that cause real maintenance pain or bugs, not pure style. Report subsystem="code-health".` },
]

phase('Analyze')

const results = await pipeline(
  SUBSYSTEMS,
  (s) => agent(s.prompt, { label: `analyze:${s.key}`, phase: 'Analyze', schema: FINDINGS_SCHEMA }),
  (review, s) => {
    if (!review || !Array.isArray(review.findings) || review.findings.length === 0) return review
    return parallel(
      review.findings.map((f) => () =>
        agent(
          `${base}\n\nADVERSARIALLY VERIFY this finding from the ${s.key} analysis. Re-open the cited file and read the actual code around it. Confirm ONLY if the claim genuinely holds; refute if it's a false positive, already-handled, misread, or the severity is inflated. Default to skepticism.\n\nFINDING:\nTitle: ${f.title}\nSeverity claimed: ${f.severity}\nFile: ${f.file}\nClaim: ${f.description}\nProposed fix: ${f.recommendation}`,
          { label: `verify:${s.key}`, phase: 'Verify', schema: VERDICT_SCHEMA }
        ).then((v) => ({ ...f, verdict: v }))
      )
    ).then((vf) => ({ ...review, findings: vf.filter(Boolean) }))
  }
)

const clean = results.filter(Boolean)

phase('Critic')

const summaries = clean
  .map((r) => `### ${r.subsystem} (health ${r.healthScore})\n${r.summary}\nTop findings: ${(r.findings || []).map((f) => f.title).join('; ') || 'none'}`)
  .join('\n\n')

const gaps = await agent(
  `${base}\n\nYou are the COMPLETENESS CRITIC. Below are the per-subsystem summaries from 12 analyzers. Identify what they likely MISSED — a subsystem, risk class, or file not covered (e.g. performance/Core Web Vitals, image optimization, the 3D ChemistryHero three.js cost, the Admin dashboard, analytics edge function, dist/ artifacts committed, the 37MB dist-hostinger.zip, mobile/RTL rendering, error monitoring). Also surface any additional concrete findings you can confirm by quickly reading the repo at ${REPO}. Be specific.\n\nSUBSYSTEM SUMMARIES:\n${summaries}`,
  { label: 'completeness-critic', phase: 'Critic', schema: GAPS_SCHEMA }
)

return { subsystems: clean, gaps }
