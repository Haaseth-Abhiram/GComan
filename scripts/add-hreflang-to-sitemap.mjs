#!/usr/bin/env node
// Idempotent sitemap transformer. Adds <xhtml:link rel="alternate" hreflang="..."/>
// alternates inside every <url> block to match what the <SEO> component emits
// per page (en + 6 en-* GCC variants, ar + 6 ar-* GCC variants, x-default).
//
// - Adds xmlns:xhtml to <urlset> if missing.
// - Skips blocks that already contain xhtml:link (re-runs are no-ops).
// - Preserves existing comments, indentation, and formatting.
//
// Usage:  node scripts/add-hreflang-to-sitemap.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const path = resolve(repoRoot, 'public/sitemap.xml');

const HREFLANGS = [
  ['en', 'en'], ['en-OM', 'en'], ['en-AE', 'en'], ['en-SA', 'en'],
  ['en-QA', 'en'], ['en-KW', 'en'], ['en-BH', 'en'],
  ['ar', 'ar'], ['ar-OM', 'ar'], ['ar-AE', 'ar'], ['ar-SA', 'ar'],
  ['ar-QA', 'ar'], ['ar-KW', 'ar'], ['ar-BH', 'ar'],
  ['x-default', 'en'],
];

let xml = readFileSync(path, 'utf8');

// 1. Add xhtml namespace to <urlset> if missing
if (!/xmlns:xhtml=/.test(xml)) {
  xml = xml.replace(
    /<urlset(\s+[^>]*)?>/,
    (_m, attrs = '') => `<urlset${attrs} xmlns:xhtml="http://www.w3.org/1999/xhtml">`
  );
  console.log('[hreflang] added xmlns:xhtml to <urlset>');
}

// 2. For each <url>...</url> block: insert 15 alternates before </url>
let added = 0;
let skipped = 0;
const transformed = xml.replace(/(<url>[\s\S]*?<\/url>)/g, (block) => {
  if (block.includes('xhtml:link')) {
    skipped++;
    return block;
  }
  const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
  if (!locMatch) return block;
  const enUrl = locMatch[1].trim();
  let url;
  try {
    url = new URL(enUrl);
  } catch {
    return block;
  }
  const isHome = url.pathname === '/' || url.pathname === '';
  const arUrl = isHome ? `${url.origin}/ar/` : `${url.origin}/ar${url.pathname}`;

  const links = HREFLANGS.map(([code, lang]) => {
    const href = lang === 'ar' ? arUrl : enUrl;
    return `    <xhtml:link rel="alternate" hreflang="${code}" href="${href}"/>`;
  }).join('\n');

  added++;
  return block.replace(/(\s*)<\/url>/, (_m, ws) => `\n${links}${ws}</url>`);
});

writeFileSync(path, transformed);
console.log(`[hreflang] ${added} <url> blocks updated, ${skipped} already had alternates`);
console.log(`[hreflang] sitemap is now ${transformed.split('\n').length} lines`);
