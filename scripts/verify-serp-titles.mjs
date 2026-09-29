#!/usr/bin/env node
/**
 * verify-serp-titles — catalogue-wide guard on the rendered product <title>.
 *
 * Why this exists: on 2026-09-27 a batch of product retitles (disambiguating
 * duplicate titles across categories) pushed 20 composed titles past the
 * 60-char SERP clamp. fitForSerp then hard-truncated them *past the word
 * "Oman"* — silently undoing a prior deliberate optimization that had got the
 * geo signal into 254 of 272 titles. Everything passed: tsc, lint, build,
 * prerender-titles, and all 77 e2e — because the only title assertion in the
 * suite samples 3 hardcoded URLs, none of which were affected.
 *
 * This checks every product instead of a sample, and works off src/ (no build
 * required) by replicating the exact title composition from ProductDetail.tsx
 * and the fitForSerp clamp from SEO.tsx. Keep those three in sync.
 *
 * Usage: node scripts/verify-serp-titles.mjs     (exit 1 on any error)
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PRODUCTS_DIR = 'src/data/products';
const SERP_TITLE_LIMIT = 60;

// --- mirrored from src/components/SEO.tsx : fitForSerp() -------------------
// (brand-suffix strip omitted: product titles never carry the brand suffix)
function fitForSerp(title) {
  if (title.length <= SERP_TITLE_LIMIT) return title;
  return title
    .slice(0, SERP_TITLE_LIMIT)
    .replace(/\s+\S*$/, '')
    .replace(/[\s:;,.\-—–|&]+$/, '');
}

// --- mirrored from src/pages/ProductDetail.tsx : CATEGORY_LABEL + serpTitle -
function loadCategoryLabels() {
  const src = readFileSync('src/pages/ProductDetail.tsx', 'utf8');
  // Stop at the first `};` on its own (possibly indented) line — the map is
  // declared INSIDE the component, so its closing brace is `  };`, and the
  // original `\n\}` pattern (column-0 brace) lazily over-captured ~24KB of
  // component body and scraped stray quoted pairs out of JSX. Review finding
  // 2026-09-29; the count assertion below turns any future drift into a loud
  // failure instead of a guard that silently checks the wrong titles.
  const block = src.match(/CATEGORY_LABEL[^=]*=\s*\{([\s\S]*?)\n\s*\};/);
  const labels = {};
  if (block) {
    for (const [, k, v] of block[1].matchAll(/'([^']+)':\s*'([^']+)'/g)) labels[k] = v;
  }
  const n = Object.keys(labels).length;
  if (n < 20 || n > 40) {
    console.error(
      `[serp-titles] FATAL: extracted ${n} category labels from ProductDetail.tsx ` +
        `(expected ~22). The CATEGORY_LABEL extraction no longer matches the source — ` +
        `fix loadCategoryLabels() before trusting this guard.`
    );
    process.exit(1);
  }
  return labels;
}

const labels = loadCategoryLabels();
const errors = [];
const warnings = [];
const rendered = new Map();
let count = 0;

for (const file of readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith('.json'))) {
  const category = file.replace(/\.json$/, '');
  const label =
    labels[category] ??
    category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  for (const p of JSON.parse(readFileSync(join(PRODUCTS_DIR, file), 'utf8'))) {
    const id = `${category}/${p.id}`;
    const seoTitle = p.details?.seoTitle;
    const title = seoTitle ?? fitForSerp(`${p.title} Supplier in Oman | ${label}`);
    count++;

    // Hard failures — these are always defects.
    if (title.length > SERP_TITLE_LIMIT) {
      errors.push(`${id}: title is ${title.length} chars (max ${SERP_TITLE_LIMIT}) — "${title}"`);
    }
    if (/[|\-–—:,]\s*$/.test(title)) {
      errors.push(`${id}: title ends on a dangling separator — "${title}"`);
    }
    if (!seoTitle && !title.includes('Oman')) {
      // The regression class this script exists for: the clamp ate the geo signal.
      errors.push(
        `${id}: composed title truncated past "Oman" — "${title}". ` +
          `Add a details.seoTitle <= ${SERP_TITLE_LIMIT} chars that keeps the geo signal.`
      );
    }

    // Soft: a hand-written override may legitimately trade geo for identity
    // (several lab products do this deliberately). Surface, don't fail.
    if (seoTitle && !seoTitle.includes('Oman')) {
      warnings.push(`${id}: hand-written seoTitle omits "Oman" — "${seoTitle}"`);
    }

    if (rendered.has(title)) errors.push(`${id}: duplicate SERP title with ${rendered.get(title)} — "${title}"`);
    else rendered.set(title, id);
  }
}

for (const w of warnings) console.warn(`[serp-titles] warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`[serp-titles] ERROR ${e}`);
  console.error(`\n[serp-titles] ${errors.length} error(s) across ${count} products`);
  process.exit(1);
}
console.log(
  `[serp-titles] OK: ${count} products — all <= ${SERP_TITLE_LIMIT} chars, unique, ` +
    `geo signal intact (${warnings.length} accepted override warning(s))`
);
