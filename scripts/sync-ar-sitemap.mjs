#!/usr/bin/env node
// Single gate between "a page is indexable" and "the page is in the sitemap".
//
// A sitemap is a request to index. Submitting a URL that renders `noindex`
// earns a "Submitted URL marked 'noindex'" error in Search Console, burns
// crawl budget on a page that can never rank, and lowers the trust Google
// places in the file as a whole. Submitting a URL that canonicalises
// elsewhere earns "Alternate page with proper canonical tag" and wastes a
// crawl to reach a page that then points somewhere else.
//
// So this script owns three passes over public/sitemap.xml, and it is the
// only thing that should ever add or remove an /ar URL:
//
//   PRUNE     drop every URL that renders noindex or canonicalises elsewhere
//   ANNOTATE  give each indexable EN page its en/ar/x-default alternates
//   TWIN      append the matching /ar block so the prerender plugin
//             (vite.config.ts routesFromSitemap) generates its HTML
//
// Indexability is derived from the same source of truth the components use,
// never hardcoded, so the sitemap cannot drift from what <SEO> actually
// renders:
//
//   /ar/products/:cat/:slug   products-ar.json has title + description
//                             (the rule in ProductDetail.tsx)
//   /ar/chemicals/:slug       location-pages-ar.json has metaTitle +
//                             metaDescription (the rule in LocationLanding.tsx)
//   everything else under /ar  noindex — body prose is still English
//                             (see CLAUDE.md, "Arabic SEO model")
//
// Rerun after adding any Arabic translation. Idempotent: running it twice
// produces a byte-identical file.
//
// Usage:  node scripts/sync-ar-sitemap.mjs [--check]
//         --check exits 1 without writing if the file is out of sync,
//         which is what CI runs.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (rel) => resolve(repoRoot, rel);
const checkOnly = process.argv.includes('--check');

const BASE = 'https://gcoman.com';

// English URLs that deliberately render noindex. They are real pages we want
// users to reach, but we are not asking Google to index them, so they must
// not appear in the sitemap. Keep in sync with the noIndex prop on each page.
const EN_NOINDEX = new Set(['/privacy', '/terms', '/thank-you', '/sitemap']);

// ── source-of-truth lookups ────────────────────────────────────────────────
const readJson = (rel) => JSON.parse(readFileSync(p(rel), 'utf8'));

const hasAll = (v, ...keys) =>
  v && typeof v === 'object' && keys.every((k) => typeof v[k] === 'string' && v[k].trim());

const translatedProducts = new Set(
  Object.entries(readJson('src/i18n/locales/products-ar.json').products ?? {})
    .filter(([, v]) => hasAll(v, 'title', 'description'))
    .map(([id]) => id)
);

const translatedLocations = new Set(
  Object.entries(readJson('src/i18n/locales/location-pages-ar.json').locationPages ?? {})
    .filter(([, v]) => hasAll(v, 'metaTitle', 'metaDescription'))
    .map(([id]) => id)
);

// Products whose details.canonicalOverride points at a different URL. Both the
// EN page and its /ar twin canonicalise away, so neither belongs in the sitemap.
const canonicalisedProducts = new Set();
for (const file of readdirSync(p('src/data/products')).filter((f) => f.endsWith('.json'))) {
  for (const prod of readJson(`src/data/products/${file}`)) {
    if (prod?.details?.canonicalOverride) canonicalisedProducts.add(prod.id);
  }
}

// ── indexability rules ─────────────────────────────────────────────────────
/** Path (no origin) → is this URL allowed in the sitemap at all? */
function isIndexable(path) {
  const productMatch = path.match(/^(?:\/ar)?\/products\/[^/]+\/([^/]+)$/);
  if (productMatch && canonicalisedProducts.has(productMatch[1])) return false;

  if (path === '/ar' || path === '/ar/' || path.startsWith('/ar/')) {
    const arProduct = path.match(/^\/ar\/products\/[^/]+\/([^/]+)$/);
    if (arProduct) return translatedProducts.has(arProduct[1]);
    const arLocation = path.match(/^\/ar\/chemicals\/([^/]+)$/);
    if (arLocation) return translatedLocations.has(arLocation[1]);
    return false; // every other /ar page still renders English prose → noindex
  }
  return !EN_NOINDEX.has(path);
}

/** English path → the /ar twin that should exist, or null. */
function arTwinOf(path) {
  const prod = path.match(/^\/products\/[^/]+\/([^/]+)$/);
  if (prod) return translatedProducts.has(prod[1]) ? `/ar${path}` : null;
  const loc = path.match(/^\/chemicals\/([^/]+)$/);
  if (loc) return translatedLocations.has(loc[1]) ? `/ar${path}` : null;
  return null;
}

// ── parse ──────────────────────────────────────────────────────────────────
const sitemapPath = p('public/sitemap.xml');
const original = readFileSync(sitemapPath, 'utf8');

const field = (block, tag) => block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1] ?? '';

const entries = [];
for (const block of original.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
  const loc = field(block, 'loc');
  entries.push({
    path: loc.replace(BASE, '') || '/',
    lastmod: field(block, 'lastmod'),
    changefreq: field(block, 'changefreq'),
    priority: field(block, 'priority'),
  });
}

const byPath = new Map(entries.map((e) => [e.path, e]));

// ── PRUNE ──────────────────────────────────────────────────────────────────
const kept = [];
const pruned = [];
for (const e of entries) {
  (isIndexable(e.path) ? kept : pruned).push(e);
}

// ── TWIN: make sure every allowlisted EN page has its /ar counterpart ──────
const keptPaths = new Set(kept.map((e) => e.path));
const added = [];
for (const e of [...kept]) {
  if (e.path.startsWith('/ar')) continue;
  const twin = arTwinOf(e.path);
  if (!twin || keptPaths.has(twin)) continue;
  const seed = byPath.get(twin) ?? e;
  const entry = { path: twin, lastmod: seed.lastmod, changefreq: seed.changefreq, priority: seed.priority };
  kept.push(entry);
  keptPaths.add(twin);
  added.push(entry);
}

// ── ANNOTATE + serialise ───────────────────────────────────────────────────
/** The en/ar pair this path belongs to, or null if it has no Arabic twin. */
function pairFor(path) {
  const en = path.startsWith('/ar/') ? path.slice(3) : path;
  const twin = arTwinOf(en);
  if (!twin || !keptPaths.has(twin) || !keptPaths.has(en)) return null;
  return { en: BASE + en, ar: BASE + twin };
}

const order = (a, b) => {
  const arA = a.path.startsWith('/ar');
  const arB = b.path.startsWith('/ar');
  if (arA !== arB) return arA ? 1 : -1; // English block first, then the /ar mirror
  return a.path.localeCompare(b.path);
};

let annotated = 0;
const blocks = kept.sort(order).map((e) => {
  const lines = [
    '  <url>',
    `    <loc>${BASE}${e.path === '/' ? '/' : e.path}</loc>`,
    `    <lastmod>${e.lastmod}</lastmod>`,
    `    <changefreq>${e.changefreq}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
  ];
  const pair = pairFor(e.path);
  if (pair) {
    annotated++;
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="en" href="${pair.en}"/>`,
      `    <xhtml:link rel="alternate" hreflang="ar" href="${pair.ar}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${pair.en}"/>`
    );
  }
  lines.push('  </url>');
  return lines.join('\n');
});

const out =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  blocks.join('\n') +
  '\n</urlset>\n';

// ── report ─────────────────────────────────────────────────────────────────
const group = (path) => {
  if (!path.startsWith('/ar')) return `EN ${path}`;
  if (/^\/ar\/products\//.test(path)) return '/ar/products/* (no Arabic translation)';
  if (/^\/ar\/chemicals\//.test(path)) return '/ar/chemicals/* (no Arabic translation)';
  if (/^\/ar\/blog/.test(path)) return '/ar/blog* (English prose)';
  return '/ar/* other (English prose)';
};
const counts = new Map();
for (const e of pruned) counts.set(group(e.path), (counts.get(group(e.path)) ?? 0) + 1);

console.log(`[ar-sitemap] translated products : ${translatedProducts.size}`);
console.log(`[ar-sitemap] translated locations: ${translatedLocations.size}`);
console.log(`[ar-sitemap] canonicalised SKUs  : ${canonicalisedProducts.size}`);
console.log(`[ar-sitemap] pruned ${pruned.length} URL(s):`);
for (const [k, v] of [...counts].sort((a, b) => b[1] - a[1])) console.log(`               ${String(v).padStart(3)}  ${k}`);
if (added.length) console.log(`[ar-sitemap] added ${added.length} missing /ar twin(s)`);
console.log(`[ar-sitemap] hreflang-annotated  : ${annotated}`);
console.log(`[ar-sitemap] ${entries.length} URLs in → ${kept.length} URLs out`);

if (checkOnly) {
  if (out !== original) {
    console.error('\n[ar-sitemap] FAIL: public/sitemap.xml is out of sync. Run: node scripts/sync-ar-sitemap.mjs');
    process.exit(1);
  }
  console.log('[ar-sitemap] OK: sitemap is in sync.');
} else {
  writeFileSync(sitemapPath, out);
  console.log(out === original ? '[ar-sitemap] no changes.' : '[ar-sitemap] wrote public/sitemap.xml');
}
