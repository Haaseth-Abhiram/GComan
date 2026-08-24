#!/usr/bin/env node
// Generates src/i18n/locales/ar-meta.json — the small, eagerly-bundled subset
// of the Arabic translations that the SEO layer needs synchronously.
//
// Why this exists: products-ar.json (~700 KB) and location-pages-ar.json
// (~65 KB) were statically imported by src/i18n/index.ts, which put ~80% of
// the main JS bundle's bytes into Arabic body copy that English visitors
// never use. But the SEO layer needs part of that data on EVERY page:
// ProductDetail and LocationLanding decide whether a page's /ar twin is
// indexable (and whether to emit hreflang on the ENGLISH render) by checking
// i18n.exists(...) against the Arabic resources — lazily loading everything
// would silently drop hreflang from English pages.
//
// The split: this file extracts just the fields those synchronous checks and
// <SEO> need — per-product title + description, per-location metaTitle +
// metaDescription — into ar-meta.json (eager, ~60 KB raw). The full body
// layers (longDescription, applications, technicalSpecs…) stay in the big
// files, which src/i18n/index.ts now loads with a dynamic import only when
// the language is Arabic.
//
// Usage:  node scripts/sync-ar-meta.mjs [--check]
//         Rerun after editing products-ar.json or location-pages-ar.json.
//         --check exits 1 without writing if the file is stale (CI runs this).

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (rel) => resolve(repoRoot, rel);
const checkOnly = process.argv.includes('--check');

const products = JSON.parse(readFileSync(p('src/i18n/locales/products-ar.json'), 'utf8')).products ?? {};
const locations = JSON.parse(readFileSync(p('src/i18n/locales/location-pages-ar.json'), 'utf8')).locationPages ?? {};

const meta = { products: {}, locationPages: {} };
for (const [id, v] of Object.entries(products)) {
  if (v && typeof v === 'object' && v.title && v.description) {
    meta.products[id] = { title: v.title, description: v.description };
  }
}
for (const [slug, v] of Object.entries(locations)) {
  if (v && typeof v === 'object' && v.metaTitle && v.metaDescription) {
    meta.locationPages[slug] = { metaTitle: v.metaTitle, metaDescription: v.metaDescription };
  }
}

const out = JSON.stringify(meta, null, 2) + '\n';
const outPath = p('src/i18n/locales/ar-meta.json');

let current = null;
try { current = readFileSync(outPath, 'utf8'); } catch { /* first run */ }

console.log(`[ar-meta] products: ${Object.keys(meta.products).length}, locations: ${Object.keys(meta.locationPages).length}, ${(out.length / 1024).toFixed(0)} KB`);

if (checkOnly) {
  if (current !== out) {
    console.error('[ar-meta] FAIL: src/i18n/locales/ar-meta.json is stale. Run: node scripts/sync-ar-meta.mjs');
    process.exit(1);
  }
  console.log('[ar-meta] OK: in sync.');
} else {
  writeFileSync(outPath, out);
  console.log(current === out ? '[ar-meta] no changes.' : '[ar-meta] wrote src/i18n/locales/ar-meta.json');
}
