#!/usr/bin/env node
/**
 * sync-sitemap-lastmod — derive each English sitemap <lastmod> from git history.
 *
 * Why: `sync-ar-sitemap.mjs` only ever *copies* lastmod (English block -> /ar
 * twin); nothing ever refreshes it. By 2026-09-28, 558 of 657 URLs still
 * claimed `2026-03-24` even though ~200 product pages had changed that week.
 * lastmod is a recrawl hint, so a stale one actively slows re-indexing of new
 * work — and a blanket "everything changed today" is worse, because obviously
 * wrong lastmod values get distrusted and then ignored wholesale.
 *
 * So each date here is the real date that page's own content last changed:
 *
 *   /products/<cat>/<slug>  per-PRODUCT. Replays every commit that touched
 *                           src/data/products/<cat>.json, parses each revision,
 *                           and finds the newest commit where THAT product's
 *                           entry actually differs (key-order-insensitive).
 *                           Editing one product does not bump its 49 siblings.
 *   /products/<cat>, /products
 *                           file-level — a category page's content genuinely is
 *                           the whole product list, so file-level is correct.
 *   /blog/<slug>            per-POST, same replay technique over src/pages/Blog.tsx
 *                           (brace-matched object extraction).
 *   /chemicals/*, statics   newest commit across the files that actually render
 *                           them.
 *
 * Only English blocks are touched. Re-run `node scripts/sync-ar-sitemap.mjs`
 * afterwards to propagate the new dates onto the /ar twins.
 *
 * Usage:
 *   node scripts/sync-sitemap-lastmod.mjs            # rewrite public/sitemap.xml
 *   node scripts/sync-sitemap-lastmod.mjs --check    # exit 1 if it would change
 *   node scripts/sync-sitemap-lastmod.mjs --dry-run  # show the diff, write nothing
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITEMAP = 'public/sitemap.xml';
const CHECK = process.argv.includes('--check');
const DRY = process.argv.includes('--dry-run');

const git = (args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 64 });
const commitsFor = (path) =>
  git(['log', '--format=%H %cI', '--', path])
    .trim().split('\n').filter(Boolean)
    .map((l) => { const [sha, iso] = l.split(' '); return { sha, date: iso.slice(0, 10) }; })
    .reverse(); // oldest -> newest
const blobAt = (sha, path) => {
  try { return git(['show', `${sha}:${path}`]); } catch { return null; }
};
const newestCommitDate = (paths) => {
  let best = null;
  for (const p of paths) {
    if (!existsSync(p)) continue;
    const c = commitsFor(p);
    if (c.length && (!best || c[c.length - 1].date > best)) best = c[c.length - 1].date;
  }
  return best;
};

/** Per-entity change dates for a file whose revisions parse into {key: canonicalString}. */
function perEntityDates(path, extract) {
  const dates = new Map();
  let prev = new Map();
  for (const { sha, date } of commitsFor(path)) {
    const blob = blobAt(sha, path);
    if (blob == null) continue;
    let cur;
    try { cur = extract(blob); } catch { continue; }
    if (!cur) continue;
    for (const [id, body] of cur) {
      if (prev.get(id) !== body) dates.set(id, date); // new or genuinely changed
    }
    prev = cur;
  }
  return dates;
}

const extractProducts = (blob) => {
  const arr = JSON.parse(blob);
  return new Map(arr.filter((p) => p && p.id).map((p) => [p.id, JSON.stringify(sortDeep(p))]));
};
function sortDeep(v) {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === 'object')
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortDeep(v[k])]));
  return v;
}
/** Pull each `{ id: '<slug>', ... }` object out of Blog.tsx by brace matching. */
function extractBlogPosts(blob) {
  const out = new Map();
  const re = /\n\s*id:\s*'([a-z0-9-]+)'/g;
  let m;
  while ((m = re.exec(blob))) {
    const start = blob.lastIndexOf('{', m.index);
    if (start === -1) continue;
    let depth = 0, i = start, inStr = null, esc = false;
    for (; i < blob.length; i++) {
      const ch = blob[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { i++; break; } }
    }
    out.set(m[1], blob.slice(start, i).replace(/\s+/g, ' '));
  }
  return out;
}

// ── resolve a lastmod for every English URL ────────────────────────────────
const productFiles = git(['ls-files', 'src/data/products/*.json']).trim().split('\n').filter(Boolean);
const productDates = new Map();   // slug -> date
const categoryFileDate = new Map(); // category -> date
for (const f of productFiles) {
  const cat = f.split('/').pop().replace(/\.json$/, '');
  for (const [id, d] of perEntityDates(f, extractProducts)) productDates.set(id, d);
  const c = commitsFor(f);
  if (c.length) categoryFileDate.set(cat, c[c.length - 1].date);
}
const blogDates = perEntityDates('src/pages/Blog.tsx', extractBlogPosts);

const allProductsDate = [...categoryFileDate.values()].sort().pop();
const locationDate = newestCommitDate(['src/pages/LocationLanding.tsx', 'src/data/locationIndex.ts']);
const blogIndexDate = newestCommitDate(['src/pages/Blog.tsx']);
const STATIC = {
  '': ['src/pages/Index.tsx'],
  'about': ['src/pages/About.tsx'],
  'career': ['src/pages/Career.tsx'],
  'certifications': ['src/pages/Certifications.tsx'],
  'contact': ['src/pages/Contact.tsx'],
  'customers': ['src/pages/Customers.tsx'],
  'industries': ['src/pages/Industries.tsx'],
  'resources': ['src/pages/Resources.tsx'],
  'chemicals': ['src/pages/ChemicalsHub.tsx', 'src/data/locationIndex.ts'],
  'chemical-suppliers-oman': ['src/pages/ChemicalSuppliersOman.tsx'],
  'chemical-suppliers-middle-east': ['src/pages/ChemicalSuppliersMiddleEast.tsx'],
  'chemical-supplier/caustic-soda-oman': ['src/pages/CausticSodaOman.tsx'],
  'chemical-supplier/nitric-acid-oman': ['src/pages/NitricAcidOman.tsx'],
  'chemical-supplier/hydrochloric-acid-oman': ['src/pages/HydrochloricAcidOman.tsx'],
  'chemical-supplier/water-treatment-chemicals-gcc': ['src/pages/WaterTreatmentChemicalsGcc.tsx'],
  'chemical-supplier/pool-chlorine-gcc': ['src/pages/PoolChlorineGcc.tsx'],
  'chemical-supplier/poly-aluminium-chloride-oman': ['src/pages/PolyAluminiumChlorideOman.tsx', 'src/data/products/water-treatment.json', 'src/data/products/inorganic.json'],
  'chemical-supplier/sodium-hypochlorite-oman': ['src/pages/SodiumHypochloriteOman.tsx', 'src/data/products/water-treatment.json', 'src/data/products/food-beverage.json', 'src/data/products/soap-detergent.json', 'src/data/products/swimming-pool.json'],
  'chemical-supplier/calcium-hypochlorite-uae': ['src/pages/CalciumHypochloriteCountry.tsx'],
  'chemical-supplier/calcium-hypochlorite-bahrain': ['src/pages/CalciumHypochloriteCountry.tsx'],
  'chemical-supplier/caustic-soda-uae': ['src/pages/CausticSodaCountry.tsx'],
  'chemical-supplier/caustic-soda-saudi-arabia': ['src/pages/CausticSodaCountry.tsx'],
  'chemical-supplier/hydrochloric-acid-uae': ['src/pages/HydrochloricAcidCountry.tsx'],
  'chemical-supplier/hydrochloric-acid-saudi-arabia': ['src/pages/HydrochloricAcidCountry.tsx'],
  'chemical-supplier/laboratory-chemicals-oman': ['src/pages/LaboratoryChemicalsOman.tsx', 'src/data/products/lab-chemicals.json'],
  'chemical-supplier/fertilizers-oman': ['src/pages/FertilizersOman.tsx', 'src/data/products/agro.json'],
  'chemical-supplier/oilfield-chemicals-oman': ['src/pages/OilfieldChemicalsOman.tsx', 'src/data/products/oilfield.json'],
  'tools/dosing-calculator': ['src/pages/DosingCalculator.tsx'],
  'blog': ['src/pages/Blog.tsx'],
};

function lastmodFor(loc) {
  const p = loc.replace('https://gcoman.com', '').replace(/\/$/, '').replace(/^\//, '');
  const seg = p ? p.split('/') : [];
  if (seg[0] === 'products' && seg.length === 3) return productDates.get(seg[2]) ?? categoryFileDate.get(seg[1]);
  if (seg[0] === 'products' && seg.length === 2) return categoryFileDate.get(seg[1]);
  if (seg[0] === 'products') return allProductsDate;
  if (seg[0] === 'blog' && seg.length === 2) return blogDates.get(seg[1]) ?? blogIndexDate;
  if (seg[0] === 'chemicals' && seg.length === 2) return locationDate;
  // /chemical-supplier/nitric-acid-<country> — all five render from one component
  if (seg[0] === 'chemical-supplier' && /^nitric-acid-(?!oman$)/.test(seg[1] ?? '')) return newestCommitDate(['src/pages/NitricAcidCountry.tsx']);
  return newestCommitDate(STATIC[p] ?? []);
}

// ── rewrite the English blocks ─────────────────────────────────────────────
let xml = readFileSync(SITEMAP, 'utf8');
let changed = 0, skipped = 0;
const unresolved = [];
const samples = [];
xml = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
  const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
  if (!loc || loc.includes('/ar/') || loc.replace(/\/$/, '').endsWith('/ar')) return block;
  const next = lastmodFor(loc);
  if (!next) { skipped++; unresolved.push(loc); return block; }
  const cur = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
  if (cur === next) return block;
  changed++;
  if (samples.length < 12) samples.push(`  ${cur ?? '(none)'} -> ${next}  ${loc.replace('https://gcoman.com', '')}`);
  return cur
    ? block.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${next}</lastmod>`)
    : block.replace(/(<loc>.*?<\/loc>)/, `$1\n    <lastmod>${next}</lastmod>`);
});

console.log(`[lastmod] english urls updated: ${changed}   unresolved (left as-is): ${skipped}`);
// An unresolved page keeps a frozen <lastmod> forever (12 product hubs did,
// found 2026-10-18), so name every one and fail — add it to STATIC.
if (unresolved.length) {
  console.error(`[lastmod] no source files mapped for:\n  ${unresolved.join('\n  ')}\n  → add each to STATIC in scripts/sync-sitemap-lastmod.mjs`);
  process.exitCode = 1;
}
if (samples.length) { console.log('[lastmod] sample changes:'); samples.forEach((s) => console.log(s)); }

if (CHECK) {
  if (changed) { console.error('[lastmod] STALE: run node scripts/sync-sitemap-lastmod.mjs'); process.exit(1); }
  console.log('[lastmod] OK: in sync.'); process.exit(0);
}
if (DRY) { console.log('[lastmod] dry run — nothing written.'); process.exit(0); }
writeFileSync(SITEMAP, xml);
console.log(`[lastmod] wrote ${SITEMAP} — now re-run: node scripts/sync-ar-sitemap.mjs`);
