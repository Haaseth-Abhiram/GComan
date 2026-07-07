#!/usr/bin/env node
// Scan dist/ for prerendered pages that shipped with the homepage default
// <title> baked in — the symptom of a <Helmet> missing defer={false} or the
// prerender renderAfterTime firing before Helmet committed. Expected output: 0.
//
// Usage: node scripts/verify-prerender-titles.mjs [distDir]

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = process.argv[2] ?? 'dist';
const HOME_TITLE = 'Chemical Suppliers in Oman & GCC | Global Chemicals LLC';

function* indexFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* indexFiles(p);
    else if (entry === 'index.html') yield p;
  }
}

const bad = [];
for (const file of indexFiles(DIST)) {
  const route = relative(DIST, file).replace(/\/?index\.html$/, '') || '(home)';
  if (route === '(home)') continue;
  const html = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/);
  const title = (m?.[1] ?? '').replace(/&amp;/g, '&');
  if (title === HOME_TITLE) bad.push(route);
}

console.log(`${bad.length} routes with homepage default title`);
for (const route of bad.slice(0, 10)) console.log(' -', route);
process.exitCode = bad.length ? 1 : 0;
