#!/usr/bin/env node
/**
 * verify-llms-txt — CI gate: public/llms.txt must not drift from the site.
 *
 * Why: by 2026-10-18 llms.txt (last touched 09-21) listed 1 of 13 product+geo
 * hubs, pointed "Hydrochloric Acid Supplier" at a product page instead of its
 * hub, missed two city pages and said 275 SKUs. It is the one file written for
 * AI crawlers, and it was silently omitting exactly the pages built to win AI
 * answers. Nothing checked it, because nothing reads it except crawlers.
 *
 * Checks:
 *   1. every English /chemical-supplier/* and /chemicals/* URL in the sitemap
 *      is listed (these are the pages AI answers should cite);
 *   2. every gcoman.com link in llms.txt is in the sitemap (no dead or
 *      noindex links handed to crawlers) — llms.txt and license.xml excepted;
 *   3. every "N SKUs" figure equals the product count in src/data/products/.
 *
 * Usage: node scripts/verify-llms-txt.mjs   (exit 1 on any failure)
 */
import { readFileSync, readdirSync } from 'node:fs';

const llms = readFileSync('public/llms.txt', 'utf8');
const sitemap = readFileSync('public/sitemap.xml', 'utf8');

const norm = (u) => u.replace(/\/$/, '') || 'https://gcoman.com';
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>(https:\/\/gcoman\.com[^<]*)<\/loc>/g)].map((m) => norm(m[1])));
const llmsUrls = new Set([...llms.matchAll(/https:\/\/gcoman\.com[^\s)\]]*/g)].map((m) => norm(m[0])));

const failures = [];

for (const u of sitemapUrls) {
  if (/\/ar(\/|$)/.test(u.replace('https://gcoman.com', ''))) continue;
  if (/^https:\/\/gcoman\.com\/(chemical-supplier|chemicals)\//.test(u) && !llmsUrls.has(u)) {
    failures.push(`missing from llms.txt: ${u}`);
  }
}
for (const u of llmsUrls) {
  // llms.txt itself and the RSL licence file are resources, not pages: never in the sitemap
  if (u.endsWith('/llms.txt') || u.endsWith('/license.xml')) continue;
  if (!sitemapUrls.has(u)) failures.push(`llms.txt links to a URL not in the sitemap: ${u}`);
}

let products = 0;
for (const f of readdirSync('src/data/products')) {
  if (f.endsWith('.json')) products += JSON.parse(readFileSync(`src/data/products/${f}`, 'utf8')).length;
}
for (const m of llms.matchAll(/(\d+)\+? SKUs/g)) {
  if (Number(m[1]) !== products) failures.push(`llms.txt says "${m[0]}" but the catalogue has ${products} products`);
}

if (failures.length) {
  console.error(`[llms-txt] ${failures.length} problem(s):\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`[llms-txt] OK: ${llmsUrls.size} links, all hubs + locations listed, ${products} SKUs.`);
