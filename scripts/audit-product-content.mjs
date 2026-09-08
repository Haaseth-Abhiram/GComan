#!/usr/bin/env node
/**
 * Product content-debt auditor.
 *
 * Why this exists
 * ---------------
 * The 2026-09-08 Search Console review found that 82% of product pages ARE
 * indexed — indexing was never the bottleneck. The bottleneck is that the
 * median product page carries ~214 unique body words, which is not enough to
 * outrank a distributor who wrote 800. That shows up as: 143 pages ranked
 * 11+, 12 indexed pages with zero impressions, and 38 pages Google discovered
 * but never spent crawl budget on.
 *
 * Word count is a proxy, not a goal — a padded page ranks no better than a
 * thin one. What this script measures is the presence of the *substance* a
 * B2B buyer and a search engine both look for: an identity (CAS/formula),
 * enough prose to establish topical coverage, concrete applications, real
 * specs, and answered questions. Pages missing those are the ones losing.
 *
 * Ranking model
 * -------------
 * Priority = demand x debt. A thin page nobody searches for is not urgent; a
 * thin page already collecting impressions is money on the floor. Pass a GSC
 * Pages export to weight by real demand; without one, every page is weighted
 * equally and the output is a pure content-debt ranking.
 *
 * Usage
 * -----
 *   node scripts/audit-product-content.mjs
 *   node scripts/audit-product-content.mjs --gsc path/to/gsc-pages-export.csv
 *   node scripts/audit-product-content.mjs --top 40
 *   node scripts/audit-product-content.mjs --category oilfield
 *   node scripts/audit-product-content.mjs --json out.json
 *
 * The --gsc file is the CSV you get from Search Console -> Performance ->
 * Pages -> Export. Columns are matched case-insensitively on a URL-ish column
 * plus "impressions" / "clicks" / "position".
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRODUCT_DIR = path.join(ROOT, 'src/data/products');
const SITEMAP = path.join(ROOT, 'public/sitemap.xml');

// Thresholds. TARGET_WORDS is the depth at which a page reads as a genuine
// technical datasheet rather than a catalogue stub; it is deliberately a floor
// to clear, not a number to pad toward.
const TARGET_WORDS = 450;
const THIN_WORDS = 200;
const MIN_APPLICATIONS = 5;
const MIN_SPECS = 6;
const MIN_FAQS = 3;

function parseArgs(argv) {
  const out = { top: 25, gsc: null, category: null, json: null };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--top') out.top = Number(argv[++i]) || out.top;
    else if (a === '--gsc') out.gsc = argv[++i];
    else if (a === '--category') out.category = argv[++i];
    else if (a === '--json') out.json = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

const words = (s) => (String(s ?? '').match(/[A-Za-z0-9']+/g) || []).length;

function loadProducts() {
  const files = fs.readdirSync(PRODUCT_DIR).filter((f) => f.endsWith('.json')).sort();
  const rows = [];
  for (const file of files) {
    const category = file.replace(/\.json$/, '');
    const items = JSON.parse(fs.readFileSync(path.join(PRODUCT_DIR, file), 'utf8'));
    for (const p of items) {
      const d = p.details || {};
      const specs = d.technicalSpecs || {};
      const specCount = Array.isArray(specs) ? specs.length : Object.keys(specs).length;
      const apps = d.applications || [];
      const faqs = d.faqs || [];

      let body = words(d.longDescription) + words(p.description);
      for (const a of apps) body += words(a);
      if (!Array.isArray(specs)) {
        for (const [k, v] of Object.entries(specs)) body += words(k) + words(v);
      }
      for (const f of faqs) body += words(f.question) + words(f.answer);

      rows.push({
        slug: `${category}/${p.id}`,
        url: `https://gcoman.com/products/${category}/${p.id}`,
        category,
        title: p.title,
        bodyWords: body,
        longDescWords: words(d.longDescription),
        applications: apps.length,
        specs: specCount,
        faqs: faqs.length,
        hasCas: Boolean(d.casNumber),
        hasFormula: Boolean(d.formula),
        hasSeoTitle: Boolean(d.seoTitle),
        hasSeoDescription: Boolean(d.seoDescription),
        canonicalOverride: d.canonicalOverride || null,
      });
    }
  }
  return rows;
}

function sitemapSlugs() {
  if (!fs.existsSync(SITEMAP)) return null;
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  const found = xml.match(/https:\/\/gcoman\.com\/products\/[a-z0-9-]+\/[a-z0-9-]+/g) || [];
  return new Set(found.map((u) => u.replace('https://gcoman.com/products/', '')));
}

/** Minimal CSV reader — handles quoted fields and embedded commas. */
function readCsv(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const rows = [];
  let field = '';
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

function loadGsc(file) {
  const rows = readCsv(file);
  if (!rows.length) return new Map();
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const findCol = (...names) => header.findIndex((h) => names.some((n) => h.includes(n)));
  const iUrl = findCol('page', 'url', 'address');
  const iImp = findCol('impression');
  const iClk = findCol('click');
  const iPos = findCol('position');
  if (iUrl === -1) {
    console.error(`  ! ${path.basename(file)}: no page/URL column found — ignoring GSC data`);
    return new Map();
  }
  const num = (v) => Number(String(v ?? '').replace(/[^0-9.\-]/g, '')) || 0;
  const map = new Map();
  for (const r of rows.slice(1)) {
    const url = (r[iUrl] || '').trim();
    const m = url.match(/\/products\/([a-z0-9-]+\/[a-z0-9-]+)\/?$/);
    if (!m) continue;
    map.set(m[1], {
      impressions: iImp === -1 ? 0 : num(r[iImp]),
      clicks: iClk === -1 ? 0 : num(r[iClk]),
      position: iPos === -1 ? 0 : num(r[iPos]),
    });
  }
  return map;
}

function gaps(r) {
  const g = [];
  if (r.bodyWords < THIN_WORDS) g.push(`thin (${r.bodyWords}w)`);
  else if (r.bodyWords < TARGET_WORDS) g.push(`short (${r.bodyWords}w)`);
  if (!r.hasCas) g.push('no CAS');
  if (r.applications < MIN_APPLICATIONS) g.push(`${r.applications} applications`);
  if (r.specs < MIN_SPECS) g.push(`${r.specs} specs`);
  if (r.faqs < MIN_FAQS) g.push(r.faqs === 0 ? 'no FAQs' : `${r.faqs} FAQs`);
  return g;
}

/** 0 = complete, 1 = maximally thin. Weighted toward prose depth and FAQs,
 *  which are what actually differentiate a datasheet from a stub. */
function debtScore(r) {
  const depth = Math.max(0, (TARGET_WORDS - r.bodyWords) / TARGET_WORDS);
  const faq = Math.max(0, (MIN_FAQS - r.faqs) / MIN_FAQS);
  const app = Math.max(0, (MIN_APPLICATIONS - r.applications) / MIN_APPLICATIONS);
  const spec = Math.max(0, (MIN_SPECS - r.specs) / MIN_SPECS);
  const ident = r.hasCas ? 0 : 1;
  return depth * 0.4 + faq * 0.25 + app * 0.15 + spec * 0.12 + ident * 0.08;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]);
    return;
  }

  let rows = loadProducts();
  const inSitemap = sitemapSlugs();
  const gsc = args.gsc ? loadGsc(args.gsc) : new Map();
  if (args.category) rows = rows.filter((r) => r.category === args.category);

  for (const r of rows) {
    r.inSitemap = inSitemap ? inSitemap.has(r.slug) : null;
    const g = gsc.get(r.slug);
    r.impressions = g ? g.impressions : null;
    r.clicks = g ? g.clicks : null;
    r.position = g ? g.position : null;
    r.debt = debtScore(r);
    // Demand weight: log-scaled so one huge page cannot dominate the queue.
    const demand = gsc.size ? Math.log10(1 + (g ? g.impressions : 0)) : 1;
    r.priority = r.debt * (gsc.size ? demand : 1);
    r.gaps = gaps(r);
  }

  const total = rows.length;
  const thin = rows.filter((r) => r.bodyWords < THIN_WORDS).length;
  const short = rows.filter((r) => r.bodyWords >= THIN_WORDS && r.bodyWords < TARGET_WORDS).length;
  const ok = total - thin - short;
  const median = (xs) => {
    const s = [...xs].sort((a, b) => a - b);
    return s.length ? s[Math.floor(s.length / 2)] : 0;
  };

  console.log('\nProduct content debt\n');
  console.log(`  products analysed        ${total}`);
  console.log(`  median body words        ${median(rows.map((r) => r.bodyWords))}   (target ${TARGET_WORDS}+)`);
  console.log(`  thin   (<${THIN_WORDS}w)           ${thin}`);
  console.log(`  short  (${THIN_WORDS}-${TARGET_WORDS - 1}w)        ${short}`);
  console.log(`  at target (>=${TARGET_WORDS}w)      ${ok}`);
  console.log(`  missing FAQs             ${rows.filter((r) => r.faqs === 0).length}`);
  console.log(`  missing CAS number       ${rows.filter((r) => !r.hasCas).length}`);
  console.log(`  hand-written SERP snippet ${rows.filter((r) => r.hasSeoDescription).length}`);
  if (inSitemap) {
    const missing = rows.filter((r) => !r.inSitemap && !r.canonicalOverride);
    console.log(`  not in sitemap.xml       ${missing.length}${missing.length ? '  -> ' + missing.map((r) => r.slug).join(', ') : ''}`);
  }
  if (gsc.size) console.log(`  GSC rows matched         ${rows.filter((r) => r.impressions !== null).length} of ${total}`);
  else console.log('\n  (no --gsc export supplied: ranking by content debt only,');
  if (!gsc.size) console.log('   pass --gsc <export.csv> to weight the queue by real demand)');

  const queue = [...rows].sort((a, b) => b.priority - a.priority).slice(0, args.top);
  console.log(`\nWork queue — top ${queue.length} by ${gsc.size ? 'demand x debt' : 'content debt'}\n`);
  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  const lpad = (s, n) => String(s).padStart(n);
  console.log(`  ${pad('PRODUCT', 46)} ${lpad('IMPR', 6)} ${lpad('POS', 6)} ${lpad('WORDS', 6)}  GAPS`);
  console.log(`  ${'-'.repeat(46)} ${'-'.repeat(6)} ${'-'.repeat(6)} ${'-'.repeat(6)}  ${'-'.repeat(40)}`);
  for (const r of queue) {
    console.log(
      `  ${pad(r.slug, 46)} ${lpad(r.impressions ?? '-', 6)} ${lpad(r.position ? r.position.toFixed(1) : '-', 6)} ${lpad(r.bodyWords, 6)}  ${r.gaps.join(', ')}`,
    );
  }

  if (args.json) {
    fs.writeFileSync(args.json, JSON.stringify(rows.sort((a, b) => b.priority - a.priority), null, 2));
    console.log(`\n  wrote ${args.json}`);
  }
  console.log('');
}

main();
