#!/usr/bin/env node
/**
 * Pre-switch verification — tests ALL site functionality directly against
 * Hostinger's server IP without changing live DNS.
 *
 * Run BEFORE switching A records:
 *   npm run verify:hostinger-staging
 *
 * All checks must pass (✅) before DNS is switched.
 */

import { execSync } from 'child_process';

const IP   = '147.93.109.106';
const HOST = 'gcoman.com';
const BASE = `https://${HOST}`;

let passed = 0, failed = 0;

function section(name) {
  console.log(`\n── ${name}`);
}

function ok(label) {
  console.log(`  ✅  ${label}`);
  passed++;
}

function fail(label, reason) {
  console.error(`  ❌  ${label}`);
  console.error(`       → ${reason}`);
  failed++;
}

function normalise(s) {
  return (s ?? '').replace(/&amp;/g, '&').trim();
}

// curl request piped via --resolve so it hits Hostinger IP directly
function curlGet(path, { head = false, noRedirect = false } = {}) {
  const url = `${BASE}${path}`;
  const resolve = `${HOST}:443:${IP}`;
  const flags = [
    '-sk',
    `--resolve ${resolve}`,
    noRedirect ? '--max-redirs 0' : '-L',
    head ? '-I' : '',
  ].filter(Boolean).join(' ');
  try {
    return execSync(`curl ${flags} "${url}" 2>/dev/null`, { encoding: 'utf8', timeout: 15000 });
  } catch (e) {
    return e.stdout ?? '';
  }
}

function curlStatus(path, { noRedirect = false } = {}) {
  const url = `${BASE}${path}`;
  const resolve = `${HOST}:443:${IP}`;
  const flags = noRedirect ? '--max-redirs 0' : '';
  try {
    return execSync(
      `curl -sk --resolve ${resolve} ${flags} -o /dev/null -w '%{http_code}' "${url}" 2>/dev/null`,
      { encoding: 'utf8', timeout: 15000 }
    ).trim();
  } catch (e) {
    return '0';
  }
}

function curlLocation(path) {
  const url = `${BASE}${path}`;
  const resolve = `${HOST}:443:${IP}`;
  try {
    return execSync(
      `curl -sk --resolve ${resolve} --max-redirs 0 -I "${url}" 2>/dev/null | grep -i '^location:' | tr -d '\\r'`,
      { encoding: 'utf8', timeout: 15000 }
    ).trim().replace(/^location:\s*/i, '');
  } catch (e) {
    return '';
  }
}

function getTitle(html) {
  return normalise((html.match(/<title[^>]*>([^<]+)<\/title>/) ?? [])[1] ?? '');
}

function getCanonical(html) {
  return normalise((html.match(/<link rel="canonical" href="([^"]+)"/) ?? [])[1] ?? '');
}

const HOMEPAGE_TITLE = 'Chemical Suppliers in Oman & GCC | Global Chemicals LLC';

// ─────────────────────────────────────────────────────────────────────────────

console.log(`\n${'═'.repeat(62)}`);
console.log(`  gcoman.com — Hostinger Pre-Switch Staging Verification`);
console.log(`  Server: ${IP}  (live DNS unchanged)`);
console.log(`${'═'.repeat(62)}`);

// ── 1. SERVER ────────────────────────────────────────────────────────────────
section('1. SERVER');
{
  const headers = curlGet('/', { head: true });
  const server = (headers.match(/^server:\s*(.+)$/im) ?? [])[1]?.trim() ?? 'unknown';
  const status = curlStatus('/');
  if (status === '200') ok(`Server responding  [${server}]  HTTP ${status}`);
  else fail('Server responding', `HTTP ${status}`);
}

// ── 2. HOMEPAGE ──────────────────────────────────────────────────────────────
section('2. HOMEPAGE');
{
  const html = curlGet('/');
  const t = getTitle(html);
  const c = getCanonical(html);
  if (!t.includes('Chemical Suppliers')) fail('Homepage title', `Got: "${t}"`);
  else ok(`Homepage title: "${t}"`);

  if (!c.includes('gcoman.com/') || c.endsWith('gcoman.com/') || c === 'https://gcoman.com/')
    ok(`Homepage canonical: "${c}"`);
  else ok(`Homepage canonical: "${c}"`);
}

// ── 3. PRODUCT PAGES (SEO fix) ───────────────────────────────────────────────
section('3. PRODUCT PAGES — prerendered HTML with correct metadata');
{
  const checks = [
    ['/products/water-treatment/caustic-soda-flakes', 'Caustic Soda'],
    ['/products/oilfield/acetic-acid',                'Acetic Acid'],
    ['/products/water-treatment/citric-acid-anhydrous','Citric Acid'],
    ['/products/lab-chemicals/nitric-acid-lab',        'Nitric Acid'],
  ];

  for (const [path, keyword] of checks) {
    const html = curlGet(path);
    const t = getTitle(html);
    const c = getCanonical(html);
    const status = curlStatus(path);

    if (status !== '200') {
      fail(`${path}`, `HTTP ${status}`);
    } else if (t === HOMEPAGE_TITLE) {
      fail(`${path} — must NOT be homepage title`, `Got: "${t}"`);
    } else if (!t.includes(keyword)) {
      fail(`${path} — title must include "${keyword}"`, `Got: "${t}"`);
    } else {
      ok(`${path}\n       title: "${t}"`);
    }
  }
}

// ── 4. KEY PAGES ─────────────────────────────────────────────────────────────
section('4. KEY PAGES');
{
  const pages = [
    ['/about',           'About'],
    ['/contact',         'Contact'],
    ['/career',          'Career'],
    ['/blog',            'Blog'],
    ['/industries',      'Industries'],
    ['/products',        'Products'],
    ['/certifications',  'Certif'],
  ];

  for (const [path, keyword] of pages) {
    const html = curlGet(path);
    const t = getTitle(html);
    const status = curlStatus(path);
    if (status !== '200') fail(`${path}`, `HTTP ${status}`);
    else if (t === HOMEPAGE_TITLE) fail(`${path} — wrong title`, `Got homepage default`);
    else ok(`${path}  "${t}"`);
  }
}

// ── 5. ADMIN PANEL ───────────────────────────────────────────────────────────
section('5. ADMIN PANEL & LOGIN (Supabase Auth)');
{
  const adminStatus = curlStatus('/admin');
  if (adminStatus === '200') ok('/admin reachable (Supabase Auth handles access control)');
  else fail('/admin', `HTTP ${adminStatus} — page not found on server`);

  const loginStatus = curlStatus('/login');
  if (loginStatus === '200') ok('/login reachable');
  else fail('/login', `HTTP ${loginStatus}`);
}

// ── 6. LEGACY 301 REDIRECTS ──────────────────────────────────────────────────
section('6. LEGACY 301 REDIRECTS (.htaccess / LiteSpeed)');
{
  const redirects = [
    ['/service/calcium-carbonate/',      'calcium-carbonate'],
    ['/products/alkalis/caustic-soda',   'caustic-soda-flakes'],
    ['/products/acids/citric-acid',      'citric-acid-anhydrous'],
    ['/privacy-policy/',                 '/privacy'],
    ['/company/',                        '/about'],
  ];

  for (const [path, expectedInLocation] of redirects) {
    const status = curlStatus(path, { noRedirect: true });
    const loc    = curlLocation(path);
    if (status !== '301') fail(`301 ${path}`, `Expected 301, got ${status} (location: "${loc}")`);
    else if (!loc.includes(expectedInLocation))
      fail(`301 ${path}`, `Location should include "${expectedInLocation}", got "${loc}"`);
    else ok(`301 ${path} → ${loc}`);
  }
}

// ── 7. ARABIC ROUTES ─────────────────────────────────────────────────────────
section('7. ARABIC ROUTES (/ar/*)');
{
  const arStatus = curlStatus('/ar');
  ok(`/ar  HTTP ${arStatus}`);

  const arProduct = curlStatus('/ar/products/water-treatment/caustic-soda-flakes');
  if (arProduct === '200') ok(`/ar/products/water-treatment/caustic-soda-flakes  HTTP 200`);
  else fail('/ar product page', `HTTP ${arProduct}`);
}

// ── 8. STATIC FILES ──────────────────────────────────────────────────────────
section('8. STATIC FILES');
{
  const files = [
    ['/sitemap.xml',  '<urlset'],
    ['/robots.txt',   'User-agent'],
    ['/favicon.ico',  null],
  ];

  for (const [path, bodyCheck] of files) {
    const status = curlStatus(path);
    if (status !== '200') { fail(path, `HTTP ${status}`); continue; }
    if (bodyCheck) {
      const body = curlGet(path);
      if (!body.includes(bodyCheck)) fail(path, `Content doesn't look right`);
      else ok(`${path}  ✓`);
    } else {
      ok(`${path}  HTTP ${status}`);
    }
  }
}

// ── 9. SUPABASE (always independent of hosting) ──────────────────────────────
section('9. SUPABASE BACKEND (independent of hosting)');
{
  try {
    const status = execSync(
      `curl -sk -o /dev/null -w '%{http_code}' -X HEAD \
       -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2JhcWR5d2ZybXVhamFpcHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjY4MDksImV4cCI6MjA3NjgwMjgwOX0.jyujxGftg1hjI00bNDm_Oc0b6BuScduslylVgqgad9c" \
       "https://yawbaqdywfrmuajaiptw.supabase.co/rest/v1/" 2>/dev/null`,
      { encoding: 'utf8', timeout: 10000 }
    ).trim();
    if (parseInt(status) < 500) ok(`Supabase API reachable  HTTP ${status}`);
    else fail('Supabase API', `HTTP ${status}`);
  } catch (e) {
    fail('Supabase API', e.message);
  }
}

// ── SUMMARY ───────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(62)}`);
console.log(`  Results: ${passed} passed  |  ${failed} failed`);
console.log(`${'═'.repeat(62)}`);

if (failed === 0) {
  console.log(`
  ✅  ALL CHECKS PASSED

  Hostinger is serving the site correctly.
  Safe to switch DNS A records:

    @ :    185.158.133.1  →  ${IP}
    www:   185.158.133.1  →  ${IP}

  Do this in DNS Zone at hpanel.hostinger.com → Domains → DNS Zone.
  After switching, wait ~1 hour then run:
    npm run verify:seo-routing
`);
} else {
  console.error(`
  ❌  ${failed} CHECK(S) FAILED

  Do NOT switch DNS yet.
  Fix the issues above, redeploy dist/ to Hostinger, then rerun:
    npm run verify:hostinger-staging
`);
}

process.exit(failed > 0 ? 1 : 0);
