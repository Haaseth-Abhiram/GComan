#!/usr/bin/env node
/**
 * verify-live-pages — every location and hub page, checked as an AI crawler
 * sees it (raw HTML, no JavaScript), against the rules the site depends on.
 *
 * Why: the location + hub pages are the ones that win "chemical supplier
 * <city>" and "<product> supplier <country>" — 26 /chemicals/* pages, 13
 * /chemical-supplier/* hubs, the Oman and Middle East pages, and their /ar
 * twins. A mistake on one of them (homepage <title> leaking through, a wrong
 * canonical, a missing hreflang, FAQ schema with no visible answers) is
 * invisible in the browser and only shows up weeks later in Search Console.
 * This reads every one of them in about 20 seconds.
 *
 * Page set is derived from public/sitemap.xml (so it grows with the site);
 * city names from src/data/locationIndex.ts.
 *
 * Checks, per page:
 *   status       HTTP 200
 *   title        present, not the homepage default, unique within the set
 *   canonical    self-referencing
 *   robots       not noindex (everything here is in the sitemap)
 *   h1           present; on /chemicals/<city> it names the city
 *   hreflang     en + ar + x-default when the sitemap annotates the URL
 *   faq          every FAQPage question visible in the body
 *   nap          the company phone number is on the page
 *   modified     dateModified / article:modified_time (WARN only — the stamp
 *                ships with the 2026-10-18 build; becomes a FAIL after it)
 *
 * Usage:
 *   node scripts/verify-live-pages.mjs                     # production
 *   node scripts/verify-live-pages.mjs --base=http://localhost:4173
 *   node scripts/verify-live-pages.mjs --strict-modified   # modified = FAIL
 *   node scripts/verify-live-pages.mjs --json              # machine output
 */
import { readFileSync } from 'node:fs';

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const BASE = (arg('base') ?? 'https://gcoman.com').replace(/\/$/, '');
const STRICT_MODIFIED = process.argv.includes('--strict-modified');
const JSON_OUT = process.argv.includes('--json');
const UA = 'Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)';
const PHONE = /93754388/;
const HOME_TITLE = 'Chemical Suppliers in Oman & GCC | Global Chemicals LLC';

const sitemap = readFileSync('public/sitemap.xml', 'utf8');
const blocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const IN_SCOPE = /^\/(ar\/)?(chemicals\/|chemical-supplier\/|chemical-suppliers-(oman|middle-east)$)/;
const pages = blocks
  .map((b) => ({
    path: b.match(/<loc>https:\/\/gcoman\.com([^<]*)<\/loc>/)?.[1] ?? '',
    hreflang: /hreflang="ar"/.test(b),
  }))
  .filter((p) => IN_SCOPE.test(p.path));

const cities = new Map(
  [...readFileSync('src/data/locationIndex.ts', 'utf8').matchAll(/slug: '([^']+)', city: '([^']+)', cityArabic: '([^']+)'/g)].map(
    (m) => [m[1], { en: m[2], ar: m[3] }],
  ),
);

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => decode(h.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

async function check({ path, hreflang }) {
  const url = BASE + path;
  const r = { path, fail: [], warn: [] };
  let res, html;
  try {
    res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'manual' });
    html = await res.text();
  } catch (e) {
    r.fail.push(`fetch error: ${e.message}`);
    return r;
  }
  if (res.status !== 200) r.fail.push(`status ${res.status}`);
  const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? '').trim();
  r.title = title;
  if (!title) r.fail.push('no <title>');
  else if (title === HOME_TITLE && path !== '/') r.fail.push('homepage <title> (prerender/Helmet failure)');
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  if (canonical?.replace(/\/$/, '') !== `https://gcoman.com${path}`.replace(/\/$/, '')) r.fail.push(`canonical → ${canonical ?? 'none'}`);
  const robots = [...html.matchAll(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/g)].map((m) => m[1]);
  if (robots.some((c) => /noindex/.test(c))) r.fail.push(`robots: ${robots.join(' | ')}`);
  const h1 = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').trim();
  if (!h1) r.fail.push('no <h1>');
  const slug = path.match(/\/chemicals\/([^/]+)$/)?.[1];
  const city = slug && cities.get(slug);
  if (city && !(h1 + ' ' + title).includes(path.startsWith('/ar/') ? city.ar : city.en)) {
    r.fail.push(`h1/title does not name ${city.en}`);
  }
  if (hreflang) {
    for (const lang of ['en', 'ar', 'x-default']) {
      if (!new RegExp(`hreflang="${lang}"`).test(html)) r.fail.push(`missing hreflang="${lang}"`);
    }
  }
  const body = text(html.slice(html.indexOf('<body')));
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    let d;
    try {
      d = JSON.parse(m[1]);
    } catch {
      r.fail.push('unparseable JSON-LD');
      continue;
    }
    if (d?.['@type'] !== 'FAQPage') continue;
    const missing = (d.mainEntity ?? []).filter((q) => !body.includes(decode(q.name).replace(/\s+/g, ' ').slice(0, 40)));
    if (missing.length) r.fail.push(`${missing.length} FAQ question(s) in schema but not visible`);
  }
  if (!PHONE.test(html)) r.fail.push('company phone number not on page');
  if (!/"dateModified"|article:modified_time/.test(html)) (STRICT_MODIFIED ? r.fail : r.warn).push('no dateModified');
  return r;
}

const results = [];
const queue = [...pages];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) results.push(await check(queue.shift()));
  }),
);
results.sort((a, b) => a.path.localeCompare(b.path));

const byTitle = new Map();
for (const r of results) if (r.title) byTitle.set(r.title, [...(byTitle.get(r.title) ?? []), r.path]);
for (const [t, ps] of byTitle) if (ps.length > 1) for (const p of ps) results.find((r) => r.path === p).fail.push(`duplicate title "${t}"`);

const failed = results.filter((r) => r.fail.length);
const warned = results.filter((r) => r.warn.length);
if (JSON_OUT) {
  console.log(JSON.stringify({ base: BASE, checked: results.length, failed: failed.length, results }, null, 1));
} else {
  for (const r of failed) console.log(`FAIL ${r.path}\n     ${r.fail.join('\n     ')}`);
  if (warned.length) console.log(`warn ${warned.length} page(s): ${[...new Set(warned.flatMap((r) => r.warn))].join(', ')}`);
  console.log(`[live-pages] ${BASE}: ${results.length} pages checked, ${failed.length} failed, ${warned.length} warned`);
}
process.exit(failed.length ? 1 : 0);
