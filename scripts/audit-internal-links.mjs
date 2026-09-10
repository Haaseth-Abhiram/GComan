#!/usr/bin/env node
/**
 * Internal-link and duplicate-SKU audit.
 *
 * Why this exists
 * ---------------
 * Fixing /chemical-supplier/caustic-soda-oman on 2026-09-10 turned up three
 * defects that were invisible from the source and only showed up when the live
 * SERP was compared against the rendered site:
 *
 *   1. Links pointing at a product that carries a `canonicalOverride` — the page
 *      renders, so nothing 404s, but it tells Google the real page is elsewhere.
 *      Users land on a duplicate and link equity drains into a dead end.
 *   2. Two SKUs for the same substance, both in the sitemap, with no canonical
 *      relationship — the site competing against itself.
 *   3. A landing page built to win a commercial query with almost nothing
 *      linking to it. A hub nothing points at cannot rank.
 *
 * All three are catalogue-wide risks, so this sweeps for them.
 *
 * It reads the PRERENDERED output in dist/, not the source, because that is the
 * link graph Googlebot actually sees — nav, footer, cards and conditionals all
 * resolved. Run `npm run build` first.
 *
 * Usage
 * -----
 *   node scripts/audit-internal-links.mjs
 *   node scripts/audit-internal-links.mjs --json report.json
 *   node scripts/audit-internal-links.mjs --min-inbound 3
 *
 * Exit code is 1 if any CANONICALISED-TARGET, DEAD-LINK or DUPLICATE finding
 * exists, so it can be wired into CI later. Orphan warnings do not fail.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PRODUCT_DIR = path.join(ROOT, 'src/data/products');
const SITEMAP = path.join(ROOT, 'public/sitemap.xml');

const args = process.argv.slice(2);
const opt = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i === -1 ? dflt : args[i + 1];
};
const MIN_INBOUND = Number(opt('--min-inbound', 2));
const JSON_OUT = opt('--json', null);

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first (the audit reads prerendered HTML).');
  process.exit(2);
}

// ---------- product data ----------
const products = [];
for (const file of fs.readdirSync(PRODUCT_DIR).filter((f) => f.endsWith('.json')).sort()) {
  const category = file.replace(/\.json$/, '');
  for (const p of JSON.parse(fs.readFileSync(path.join(PRODUCT_DIR, file), 'utf8'))) {
    products.push({
      category,
      id: p.id,
      title: p.title,
      path: `/products/${category}/${p.id}`,
      cas: (p.details || {}).casNumber || null,
      canonicalOverride: (p.details || {}).canonicalOverride || null,
      guideUrl: (p.details || {}).guideUrl || null,
    });
  }
}
const byPath = new Map(products.map((p) => [p.path, p]));
const canonicalised = new Map(
  products.filter((p) => p.canonicalOverride)
    .map((p) => [p.path, p.canonicalOverride.replace('https://gcoman.com', '')]),
);

// ---------- sitemap ----------
const sitemapPaths = new Set(
  (fs.readFileSync(SITEMAP, 'utf8').match(/<loc>https:\/\/gcoman\.com([^<]*)<\/loc>/g) || [])
    .map((m) => m.replace(/<\/?loc>/g, '').replace('https://gcoman.com', '') || '/'),
);

// ---------- walk prerendered pages, build the link graph ----------
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp);
    else if (e.name === 'index.html') pages.push(fp);
  }
})(DIST);

const inbound = new Map();   // path -> Set(source page paths)
const outbound = new Map();  // source page path -> [link paths]
const distPaths = new Set();

const toSitePath = (file) => {
  const rel = path.relative(DIST, file).replace(/\/?index\.html$/, '');
  return '/' + rel;
};

for (const file of pages) {
  const from = toSitePath(file).replace(/\/$/, '') || '/';
  distPaths.add(from);
  const html = fs.readFileSync(file, 'utf8');
  // Only same-origin, non-asset links.
  const hrefs = [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)].map((m) => m[1]);
  const links = new Set();
  for (let h of hrefs) {
    if (/^(https?:)?\/\//i.test(h) && !/^https:\/\/gcoman\.com/i.test(h)) continue;
    h = h.replace(/^https:\/\/gcoman\.com/i, '');
    if (!h.startsWith('/')) continue;
    h = h.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    if (/\.(png|jpe?g|webp|svg|pdf|xml|txt|ico|css|js)$/i.test(h)) continue;
    links.add(h);
  }
  outbound.set(from, [...links]);
  for (const l of links) {
    if (l === from) continue;
    if (!inbound.has(l)) inbound.set(l, new Set());
    inbound.get(l).add(from);
  }
}

const strip = (p) => p.replace(/^\/ar(?=\/|$)/, '') || '/';

// ---------- findings ----------
const findings = { canonicalisedTargets: [], deadProductLinks: [], duplicateSkus: [], orphans: [], thinInbound: [] };

// A. links pointing at a canonicalised product
for (const [from, links] of outbound) {
  for (const l of links) {
    const target = canonicalised.get(strip(l));
    if (target) {
      findings.canonicalisedTargets.push({ from, link: l, shouldPointTo: target });
    }
  }
}

// B. product links whose slug does not exist
for (const [from, links] of outbound) {
  for (const l of links) {
    const s = strip(l);
    if (/^\/products\/[a-z0-9-]+\/[a-z0-9-]+$/.test(s) && !byPath.has(s)) {
      findings.deadProductLinks.push({ from, link: l });
    }
  }
}

// C. TRUE duplicates: same CAS *and* the same product once category flavouring
// is removed. Same CAS alone is not a duplicate — a chemical distributor
// legitimately sells one substance in several grades, forms and strengths
// (hydrogen peroxide 3/6/35/50%, silica gel blue/orange/white, caustic soda
// flakes/prills/liquid). Those must not be flagged. What IS a duplicate is the
// same form filed twice under different categories, e.g.
// soap-detergent/caustic-soda-prills-soap vs water-treatment/caustic-soda-prills.
const CATEGORY_SUFFIX = /-(soap|water|lab|oil|pool|ro|industrial|food)$/;
const normSlug = (id) => {
  let s = id;
  // Strip one category flavour suffix, then a bare "-2"-style dedupe counter.
  // Concentration digits (…-35, …-12-15) are deliberately preserved.
  for (let i = 0; i < 2; i += 1) s = s.replace(CATEGORY_SUFFIX, '');
  return s.replace(/-2$/, '');
};
const normTitle = (t) =>
  t.toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(food|laboratory|lab|technical|tech|industrial|agricultural|grade|pure|liquid form)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const byCas = new Map();
for (const p of products) {
  if (!p.cas) continue;
  if (!byCas.has(p.cas)) byCas.set(p.cas, []);
  byCas.get(p.cas).push(p);
}
for (const [cas, group] of byCas) {
  const indexable = group.filter((p) => !p.canonicalOverride && sitemapPaths.has(p.path));
  if (indexable.length < 2) continue;
  // Cluster within the CAS group by normalised identity.
  const clusters = new Map();
  for (const p of indexable) {
    const key = `${normSlug(p.id)}|${normTitle(p.title)}`;
    const hit = [...clusters.keys()].find((k) => {
      const [ks, kt] = k.split('|');
      return ks === normSlug(p.id) || kt === normTitle(p.title);
    });
    const use = hit ?? key;
    if (!clusters.has(use)) clusters.set(use, []);
    clusters.get(use).push(p);
  }
  for (const [, dupes] of clusters) {
    if (dupes.length > 1) {
      findings.duplicateSkus.push({
        cas,
        count: dupes.length,
        pages: dupes.map((p) => ({ path: p.path, title: p.title })),
      });
    }
  }
}

// D. inbound-link poverty on indexable EN pages
for (const p of [...sitemapPaths].filter((x) => !x.startsWith('/ar')).sort()) {
  const n = inbound.has(p) ? inbound.get(p).size : 0;
  if (n === 0) findings.orphans.push({ path: p, inbound: 0 });
  else if (n < MIN_INBOUND) findings.thinInbound.push({ path: p, inbound: n });
}

// ---------- report ----------
const H = (s) => `\n${s}\n${'='.repeat(s.length)}`;
console.log(H('Internal-link audit'));
console.log(`  prerendered pages scanned : ${pages.length}`);
console.log(`  products                  : ${products.length}  (${canonicalised.size} canonicalised)`);
console.log(`  indexable URLs in sitemap : ${sitemapPaths.size}`);

const section = (title, rows, render) => {
  console.log(H(`${title} — ${rows.length}`));
  if (!rows.length) { console.log('  none'); return; }
  rows.slice(0, 40).forEach((r) => console.log('  ' + render(r)));
  if (rows.length > 40) console.log(`  … ${rows.length - 40} more`);
};

section('1. Links pointing at a CANONICALISED page (equity dead end)',
  findings.canonicalisedTargets, (r) => `${r.from}\n      links to  ${r.link}\n      should be ${r.shouldPointTo}`);
section('2. DEAD product links (slug does not exist)',
  findings.deadProductLinks, (r) => `${r.from}  ->  ${r.link}`);
section('3. DUPLICATE SKUs — same CAS, both indexable, no canonical',
  findings.duplicateSkus, (r) => `CAS ${r.cas}\n      ${r.pages.map((p) => p.path).join('\n      ')}`);
section('4. ORPHANS — indexable but nothing links to them',
  findings.orphans, (r) => r.path);
section(`5. THIN inbound (< ${MIN_INBOUND} internal links)`,
  findings.thinInbound, (r) => `${String(r.inbound).padStart(2)} link(s)  ${r.path}`);

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(findings, null, 2));
  console.log(`\n  wrote ${JSON_OUT}`);
}

const blocking = findings.canonicalisedTargets.length + findings.deadProductLinks.length + findings.duplicateSkus.length;
console.log(`\n  blocking findings: ${blocking}   (orphan/thin warnings: ${findings.orphans.length + findings.thinInbound.length})\n`);
process.exit(blocking ? 1 : 0);
