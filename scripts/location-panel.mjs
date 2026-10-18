#!/usr/bin/env node
/**
 * location-panel — the fixed query panel for the per-location visibility
 * sweep (skill: running-search-operations). Prints every check to run, with
 * the exact URL to open, so every run asks the same questions the same way
 * and trends in docs/seo/location-ledger.md stay comparable.
 *
 * Derived from the site, so a new city or hub joins the panel automatically:
 *   - cities + countries   src/data/locationIndex.ts
 *   - country hubs         /chemicals/<country> in public/sitemap.xml
 *   - product hubs         /chemical-supplier/* in public/sitemap.xml
 *
 * Google serves a CAPTCHA after ~30 searches from one browser (ledger
 * 2026-10-13, 10-16), so Google checks are split into fixed batches that
 * rotate by day. Bing and Maps run in full each sweep.
 *
 * Usage:
 *   node scripts/location-panel.mjs                       # summary
 *   node scripts/location-panel.mjs --engine=google --batch=today
 *   node scripts/location-panel.mjs --engine=bing
 *   node scripts/location-panel.mjs --engine=maps
 *   node scripts/location-panel.mjs --engine=google --batch=2 --json
 */
import { readFileSync } from 'node:fs';

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const ENGINE = arg('engine');
const JSON_OUT = process.argv.includes('--json');
const GOOGLE_BATCH_SIZE = 25;

const ISO2 = {
  Oman: 'om', 'United Arab Emirates': 'ae', 'Saudi Arabia': 'sa', Qatar: 'qa', Kuwait: 'kw', Bahrain: 'bh',
  Iraq: 'iq', Jordan: 'jo', Egypt: 'eg',
};
// Maps viewports for the Oman cities (Maps rank depends on distance, so each
// city is read from its own centre). GCC cities are not read on Maps: we have
// no premises there and the map pack is not winnable.
const MAPS_CENTRE = {
  muscat: '23.588,58.383,12z', rusayl: '23.553,58.199,13z', sohar: '24.347,56.709,12z',
  rustaq: '23.391,57.424,13z', salalah: '17.019,54.089,12z', duqm: '19.662,57.704,12z',
};

const idx = readFileSync('src/data/locationIndex.ts', 'utf8');
const sitemap = readFileSync('public/sitemap.xml', 'utf8');
const english = [...sitemap.matchAll(/<loc>https:\/\/gcoman\.com(\/[^<]*)<\/loc>/g)].map((m) => m[1]).filter((p) => !p.startsWith('/ar'));

const cities = [];
for (const block of idx.split(/\n  \{\n    country: /).slice(1)) {
  const country = block.match(/^'([^']+)'/)[1];
  for (const m of block.matchAll(/slug: '([^']+)', city: '([^']+)'/g)) cities.push({ slug: m[1], city: m[2], country });
}

const checks = [];
const add = (c) => checks.push({ id: checks.length + 1, ...c });

for (const { slug, city, country } of cities) {
  const name = city.replace(' Industrial Estate', '');
  add({ kind: 'city', location: city, country, page: `/chemicals/${slug}`, query: `chemical supplier ${name.toLowerCase()}`, gl: ISO2[country] });
}
const countryHubs = english.filter((p) => /^\/chemicals\/(uae|saudi-arabia|qatar|kuwait)$/.test(p));
const COUNTRY_NAME = { uae: 'uae', 'saudi-arabia': 'saudi arabia', qatar: 'qatar', kuwait: 'kuwait' };
const COUNTRY_GL = { uae: 'ae', 'saudi-arabia': 'sa', qatar: 'qa', kuwait: 'kw' };
for (const p of countryHubs) {
  const c = p.split('/').pop();
  add({ kind: 'country', location: COUNTRY_NAME[c], country: COUNTRY_NAME[c], page: p, query: `chemical suppliers in ${COUNTRY_NAME[c]}`, gl: COUNTRY_GL[c] });
}
add({ kind: 'country', location: 'Oman', country: 'Oman', page: '/chemical-suppliers-oman', query: 'chemical suppliers oman', gl: 'om' });
add({ kind: 'country', location: 'GCC', country: 'GCC', page: '/chemical-suppliers-middle-east', query: 'chemical suppliers gcc', gl: 'om' });

const NITRIC_GL = { uae: ['uae', 'ae'], 'saudi-arabia': ['saudi arabia', 'sa'], qatar: ['qatar', 'qa'], kuwait: ['kuwait', 'kw'], bahrain: ['bahrain', 'bh'], oman: ['oman', 'om'] };
const PRODUCT_QUERY = {
  'caustic-soda-oman': 'caustic soda supplier oman',
  'hydrochloric-acid-oman': 'hydrochloric acid supplier oman',
  'poly-aluminium-chloride-oman': 'poly aluminium chloride supplier oman',
  'sodium-hypochlorite-oman': 'sodium hypochlorite supplier oman',
  'laboratory-chemicals-oman': 'laboratory chemicals supplier oman',
  'fertilizers-oman': 'fertilizer supplier oman',
  'oilfield-chemicals-oman': 'oilfield chemicals supplier oman',
};
for (const p of english.filter((x) => x.startsWith('/chemical-supplier/'))) {
  const slug = p.split('/').pop();
  const nitric = slug.match(/^nitric-acid-(.+)$/);
  if (nitric) {
    const [name, gl] = NITRIC_GL[nitric[1]] ?? [nitric[1].replace(/-/g, ' '), 'om'];
    add({ kind: 'product', location: name, country: name, page: p, query: `nitric acid supplier ${name}`, gl });
  } else {
    add({ kind: 'product', location: 'Oman', country: 'Oman', page: p, query: PRODUCT_QUERY[slug] ?? `${slug.replace(/-oman$/, '').replace(/-/g, ' ')} supplier oman`, gl: 'om' });
  }
}

const enc = encodeURIComponent;
const googleUrl = (c) => `https://www.google.com/search?q=${enc(c.query)}&gl=${c.gl}&hl=en&pws=0&num=20`;
const bingUrl = (c) => `https://www.bing.com/search?q=${enc(c.query)}&setlang=en&cc=${c.gl}`;
const mapsUrl = (c, centre) => `https://www.google.com/maps/search/${enc(c.query)}/@${centre}?hl=en`;

const batches = Math.ceil(checks.length / GOOGLE_BATCH_SIZE);
let rows;
if (ENGINE === 'google') {
  let b = arg('batch') ?? 'today';
  // Day-of-year rotation, so consecutive days cover the whole panel.
  if (b === 'today') b = String((Math.floor(Date.now() / 86_400_000) % batches) + 1);
  const n = Number(b);
  rows = checks.slice((n - 1) * GOOGLE_BATCH_SIZE, n * GOOGLE_BATCH_SIZE).map((c) => ({ ...c, engine: 'google', batch: `${n}/${batches}`, url: googleUrl(c) }));
} else if (ENGINE === 'bing') {
  rows = checks.map((c) => ({ ...c, engine: 'bing', url: bingUrl(c) }));
} else if (ENGINE === 'maps') {
  rows = checks
    .filter((c) => c.kind === 'city' && MAPS_CENTRE[c.page.split('/').pop()])
    .map((c) => ({ ...c, engine: 'maps', query: 'chemical supplier', url: mapsUrl({ query: 'chemical supplier' }, MAPS_CENTRE[c.page.split('/').pop()]) }));
}

if (!rows) {
  const by = (k) => checks.filter((c) => c.kind === k).length;
  console.log(`panel: ${checks.length} checks (${by('city')} cities, ${by('country')} countries, ${by('product')} product hubs)`);
  console.log(`google: ${batches} batches of ≤${GOOGLE_BATCH_SIZE} (rotate daily) · bing: all ${checks.length} · maps: ${Object.keys(MAPS_CENTRE).length} Oman viewports`);
  console.log('run with --engine=google|bing|maps [--batch=N|today] [--json]');
} else if (JSON_OUT) {
  console.log(JSON.stringify(rows, null, 1));
} else {
  for (const r of rows) console.log(`${String(r.id).padStart(2)} ${r.engine.padEnd(6)} ${r.query.padEnd(42)} → ${r.page}\n   ${r.url}`);
}
