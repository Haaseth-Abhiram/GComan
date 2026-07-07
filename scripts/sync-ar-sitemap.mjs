#!/usr/bin/env node
// Idempotent sitemap transformer for the Arabic product pages.
//
// For every product URL whose slug has a full Arabic translation in
// src/i18n/locales/products-ar.json (title + description — the same rule
// ProductDetail.tsx uses to mark the /ar twin indexable):
//   1. adds <xhtml:link> hreflang alternates (en / ar / x-default) to the
//      English <url> block, and
//   2. appends a matching /ar/... <url> block with the same alternates so the
//      prerender plugin (vite.config.ts routesFromSitemap) generates its HTML.
//
// URLs without a translation are left untouched: their /ar twins are noindex
// (see src/components/SEO.tsx) and hreflang must never point at a noindexed
// page. Replaces the retired scripts/add-hreflang-to-sitemap.mjs, which
// annotated every URL unconditionally.
//
// Usage:  node scripts/sync-ar-sitemap.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sitemapPath = resolve(repoRoot, 'public/sitemap.xml');
const translationsPath = resolve(repoRoot, 'src/i18n/locales/products-ar.json');

const translations = JSON.parse(readFileSync(translationsPath, 'utf8')).products ?? {};
const translatedIds = new Set(
  Object.entries(translations)
    .filter(([, v]) => v && typeof v === 'object' && v.title && v.description)
    .map(([id]) => id)
);

let xml = readFileSync(sitemapPath, 'utf8');

if (!/xmlns:xhtml=/.test(xml)) {
  xml = xml.replace(
    /<urlset(\s+[^>]*)?>/,
    (_m, attrs = '') => `<urlset${attrs} xmlns:xhtml="http://www.w3.org/1999/xhtml">`
  );
  console.log('[ar-sitemap] added xmlns:xhtml to <urlset>');
}

const alternates = (enUrl, arUrl) =>
  [
    `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`,
    `    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>`,
  ].join('\n');

let annotated = 0;
let twinned = 0;
let skipped = 0;
const newArBlocks = [];

xml = xml.replace(/([ \t]*)(<url>[\s\S]*?<\/url>)/g, (full, indent, block) => {
  const locMatch = block.match(/<loc>https:\/\/gcoman\.com(\/products\/[^/<]+\/([^/<]+))<\/loc>/);
  if (!locMatch) return full;
  const [, path, slug] = locMatch;
  if (!translatedIds.has(slug)) return full;

  const enUrl = `https://gcoman.com${path}`;
  const arUrl = `https://gcoman.com/ar${path}`;

  let updated = block;
  if (!block.includes('xhtml:link')) {
    updated = block.replace(/(\s*)<\/url>/, (_m, ws) => `\n${alternates(enUrl, arUrl)}${ws}</url>`);
    annotated++;
  } else {
    skipped++;
  }

  if (!xml.includes(`<loc>${arUrl}</loc>`)) {
    const twin = updated.replace(`<loc>${enUrl}</loc>`, `<loc>${arUrl}</loc>`);
    newArBlocks.push(indent + twin);
    twinned++;
  }

  return indent + updated;
});

if (newArBlocks.length) {
  xml = xml.replace(/(\s*)<\/urlset>/, `\n${newArBlocks.join('\n')}$1</urlset>`);
}

writeFileSync(sitemapPath, xml);
console.log(`[ar-sitemap] translated products: ${translatedIds.size}`);
console.log(`[ar-sitemap] EN blocks annotated with hreflang: ${annotated} (already annotated: ${skipped})`);
console.log(`[ar-sitemap] /ar twin blocks appended: ${twinned}`);
