#!/usr/bin/env node
// Playwright A-to-Z site audit. Crawls every URL in public/sitemap.xml against
// a configurable base, captures per-page SEO + a11y + lead-capture signals,
// emits JSON + a markdown summary into audits/<run>/.
//
// Usage:
//   node scripts/audit-playwright.mjs --base https://gcoman.com --label prod
//   node scripts/audit-playwright.mjs --base http://127.0.0.1:8080 --label local

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);
const BASE = (args.base || 'https://gcoman.com').replace(/\/$/, '');
const LABEL = args.label || new URL(BASE).hostname;
const CONCURRENCY = parseInt(args.concurrency || '6', 10);
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity;
const OUT_DIR = resolve(repoRoot, 'audits', `${new Date().toISOString().slice(0, 10)}-${LABEL}`);
mkdirSync(OUT_DIR, { recursive: true });

// ---------------- sitemap ----------------
const sitemapXml = readFileSync(resolve(repoRoot, 'public/sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const paths = sitemapUrls
  .map((u) => {
    try {
      return new URL(u).pathname || '/';
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const targets = [...new Set(paths)].slice(0, LIMIT).map((p) => BASE + (p === '/' ? '/' : p));

console.log(`[audit] base=${BASE} label=${LABEL} urls=${targets.length} concurrency=${CONCURRENCY}`);
console.log(`[audit] out=${OUT_DIR}`);

// ---------------- per-page worker ----------------
async function auditPage(context, url) {
  const consoleErrors = [];
  const consoleWarnings = [];
  const failedRequests = [];
  const redirects = [];

  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300));
    else if (msg.type() === 'warning') consoleWarnings.push(msg.text().slice(0, 300));
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`.slice(0, 300)));
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url().slice(0, 200), reason: req.failure()?.errorText || 'unknown' });
  });
  page.on('response', (res) => {
    const s = res.status();
    if (s >= 300 && s < 400) {
      redirects.push({ from: res.url().slice(0, 200), status: s, location: res.headers().location });
    }
  });

  let response = null;
  let navError = null;
  const t0 = Date.now();
  try {
    response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    navError = e.message;
  }
  const navMs = Date.now() - t0;

  // Wait briefly for client-side React/Helmet to flush
  await page.waitForTimeout(1500);

  let data = {};
  try {
    data = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const qa = (s) => [...document.querySelectorAll(s)];
      const attr = (el, a) => (el ? el.getAttribute(a) : null);

      const metas = qa('meta').map((m) => ({
        name: m.getAttribute('name'),
        property: m.getAttribute('property'),
        content: m.getAttribute('content'),
        rh: m.getAttribute('data-rh') === 'true',
      }));
      const linkRels = qa('link').map((l) => ({
        rel: l.getAttribute('rel'),
        href: l.getAttribute('href'),
        hreflang: l.getAttribute('hreflang'),
        rh: l.getAttribute('data-rh') === 'true',
      }));
      const jsonLdBlocks = qa('script[type="application/ld+json"]').map((s) => {
        try {
          return JSON.parse(s.textContent || '{}');
        } catch {
          return { __parseError: true, raw: (s.textContent || '').slice(0, 200) };
        }
      });
      const h1s = qa('h1').map((h) => h.textContent?.trim().slice(0, 200) || '');
      const imgs = qa('img');
      // Only flag truly missing alt as accessibility issue. alt="" is correct for decorative.
      const imgsMissingAlt = imgs.filter((i) => !i.hasAttribute('alt')).length;
      const imgsEmptyAlt = imgs.filter((i) => i.hasAttribute('alt') && i.getAttribute('alt') === '').length;
      const imgsLazy = imgs.filter((i) => i.getAttribute('loading') === 'lazy').length;

      const forms = qa('form').map((f) => ({
        action: f.getAttribute('action'),
        method: f.getAttribute('method'),
        inputs: [...f.querySelectorAll('input,textarea,select')].map((i) => i.getAttribute('name') || i.getAttribute('id') || i.tagName.toLowerCase()),
      }));
      const telLinks = qa('a[href^="tel:"]').length;
      const mailLinks = qa('a[href^="mailto:"]').length;
      const waLinks = qa('a[href*="wa.me"], a[href*="whatsapp"]').length;
      const ctaButtons = qa('button, a').filter((el) => /quote|enquir|inquir|contact|call|whatsapp|catalog|brochure|sample/i.test(el.textContent || '')).length;

      const helmetTags = qa('[data-rh="true"]').length;
      const hreflangLinks = linkRels.filter((l) => l.rel === 'alternate' && l.hreflang).length;

      const og = {};
      const tw = {};
      metas.forEach((m) => {
        if (m.property?.startsWith('og:')) og[m.property] = m.content;
        if (m.name?.startsWith('twitter:')) tw[m.name] = m.content;
      });

      return {
        title: document.title || null,
        description: attr(q('meta[name="description"]'), 'content'),
        robots: attr(q('meta[name="robots"]'), 'content'),
        canonical: attr(q('link[rel="canonical"]'), 'href'),
        canonicalRh: q('link[rel="canonical"]')?.getAttribute('data-rh') === 'true',
        og,
        twitter: tw,
        hreflangCount: hreflangLinks,
        helmetTagsCount: helmetTags,
        jsonLdCount: jsonLdBlocks.length,
        jsonLdTypes: jsonLdBlocks
          .map((b) => (Array.isArray(b['@graph']) ? b['@graph'].map((g) => g['@type']) : b['@type']))
          .flat()
          .filter(Boolean),
        jsonLdParseErrors: jsonLdBlocks.filter((b) => b.__parseError).length,
        h1Count: h1s.length,
        h1: h1s,
        imgCount: imgs.length,
        imgsMissingAlt,
        imgsEmptyAlt,
        imgsLazy,
        forms,
        telLinks,
        mailLinks,
        waLinks,
        ctaButtons,
        textLen: (document.body?.innerText || '').length,
      };
    });
  } catch (e) {
    data = { evalError: e.message };
  }

  const headers = response ? response.headers() : {};
  const result = {
    url,
    finalUrl: page.url(),
    status: response?.status() ?? null,
    navMs,
    navError,
    headers: {
      'content-type': headers['content-type'],
      'cache-control': headers['cache-control'],
      'content-security-policy': headers['content-security-policy'] ? 'present' : null,
      'x-frame-options': headers['x-frame-options'],
      'permissions-policy': headers['permissions-policy'] ? 'present' : null,
      'strict-transport-security': headers['strict-transport-security'] ? 'present' : null,
      'x-content-type-options': headers['x-content-type-options'],
      'referrer-policy': headers['referrer-policy'],
      server: headers.server,
      'x-deployment-id': headers['x-deployment-id'] ? 'present' : null,
    },
    redirects,
    consoleErrors,
    consoleWarnings: consoleWarnings.slice(0, 5),
    failedRequests: failedRequests.slice(0, 10),
    ...data,
  };

  await page.close();
  return result;
}

// ---------------- driver ----------------
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: 'GcomanAuditBot/1.0 (+https://gcoman.com; playwright)',
  viewport: { width: 1366, height: 900 },
  ignoreHTTPSErrors: true,
});

const queue = [...targets];
const results = [];
let done = 0;

async function worker(id) {
  while (queue.length) {
    const url = queue.shift();
    if (!url) break;
    try {
      const r = await auditPage(context, url);
      results.push(r);
    } catch (e) {
      results.push({ url, fatal: e.message });
    }
    done++;
    if (done % 10 === 0 || done === targets.length) {
      console.log(`[audit] ${done}/${targets.length}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
await context.close();
await browser.close();

// ---------------- site-level probes ----------------
const probeBrowser = await chromium.launch({ headless: true });
const probeCtx = await probeBrowser.newContext({ ignoreHTTPSErrors: true });
async function probe(name, url, expect) {
  const page = await probeCtx.newPage();
  let res, err;
  try {
    res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    err = e.message;
  }
  const out = { name, url, status: res?.status() ?? null, finalUrl: page.url(), expect, err };
  await page.close();
  return out;
}
const probes = await Promise.all([
  probe('404 should be 404', `${BASE}/this-route-does-not-exist-zzz999`, '404'),
  probe('legacy redirect /service/calcium-carbonate/', `${BASE}/service/calcium-carbonate/`, '301 → /products/water-treatment/calcium-carbonate-water'),
  probe('legacy redirect /chemicals/', `${BASE}/chemicals/`, '301 → /products'),
  probe('www → apex', BASE.replace('//', '//www.'), '301 to apex'),
  probe('robots.txt', `${BASE}/robots.txt`, '200'),
  probe('sitemap.xml', `${BASE}/sitemap.xml`, '200'),
]);
await probeCtx.close();
await probeBrowser.close();

// ---------------- save raw results ----------------
const rawPath = join(OUT_DIR, 'raw.json');
writeFileSync(rawPath, JSON.stringify({ base: BASE, label: LABEL, generatedAt: new Date().toISOString(), probes, results }, null, 2));
console.log(`[audit] wrote ${rawPath} (${results.length} pages)`);

// ---------------- analysis + markdown ----------------
const HOMEPAGE_TITLE = 'Chemical Suppliers in Oman & GCC | Global Chemicals LLC';
const HOMEPAGE_TITLE_ALT = 'Chemical Supplier Muscat Oman | Caustic Soda, PAC, JSRS | Global Chemicals LLC';
const homePath = `${BASE}/`;

const summary = {
  total: results.length,
  ok: results.filter((r) => r.status === 200).length,
  non200: results.filter((r) => r.status && r.status !== 200).length,
  navErrors: results.filter((r) => r.navError).length,
  homepageTitleDuplicates: results.filter(
    (r) => r.url !== homePath && (r.title === HOMEPAGE_TITLE || r.title === HOMEPAGE_TITLE_ALT || r.title?.replace('&amp;', '&') === HOMEPAGE_TITLE)
  ),
  canonicalSelf: results.filter((r) => r.canonical && r.url.replace(/\/$/, '') === r.canonical.replace(/\/$/, '')).length,
  canonicalToHome: results.filter((r) => r.url !== homePath && r.canonical && r.canonical.replace(/\/$/, '') === BASE).length,
  missingCanonical: results.filter((r) => !r.canonical).map((r) => r.url),
  missingDescription: results.filter((r) => !r.description).map((r) => r.url),
  emptyTitle: results.filter((r) => !r.title || r.title.trim().length === 0).map((r) => r.url),
  shortTitle: results.filter((r) => r.title && r.title.length < 30).map((r) => ({ url: r.url, title: r.title, len: r.title.length })),
  longTitle: results.filter((r) => r.title && r.title.length > 70).map((r) => ({ url: r.url, title: r.title, len: r.title.length })),
  longDescription: results.filter((r) => r.description && r.description.length > 170).map((r) => ({ url: r.url, len: r.description.length })),
  shortDescription: results.filter((r) => r.description && r.description.length < 60).map((r) => ({ url: r.url, len: r.description.length })),
  multipleH1: results.filter((r) => r.h1Count > 1).map((r) => ({ url: r.url, count: r.h1Count, h1: r.h1 })),
  noH1: results.filter((r) => r.h1Count === 0).map((r) => r.url),
  imgsMissingAltTotal: results.reduce((s, r) => s + (r.imgsMissingAlt || 0), 0),
  pagesWithImgsMissingAlt: results.filter((r) => r.imgsMissingAlt > 0).map((r) => ({ url: r.url, missing: r.imgsMissingAlt, total: r.imgCount })),
  consoleErrorsByUrl: results.filter((r) => r.consoleErrors?.length).map((r) => ({ url: r.url, count: r.consoleErrors.length, samples: r.consoleErrors.slice(0, 3) })),
  failedRequestsByUrl: results.filter((r) => r.failedRequests?.length).map((r) => ({ url: r.url, samples: r.failedRequests.slice(0, 3) })),
  jsonLdParseErrors: results.filter((r) => r.jsonLdParseErrors > 0).map((r) => ({ url: r.url, errs: r.jsonLdParseErrors })),
  hreflangMissing: results.filter((r) => (r.hreflangCount || 0) < 13).map((r) => ({ url: r.url, count: r.hreflangCount })),
  helmetMissing: results.filter((r) => (r.helmetTagsCount || 0) === 0).map((r) => r.url),
  pagesWithForms: results.filter((r) => (r.forms?.length || 0) > 0).map((r) => ({ url: r.url, forms: r.forms.length })),
  pagesWithLeadCapture: results
    .filter((r) => (r.forms?.length || 0) > 0 || r.telLinks > 0 || r.mailLinks > 0 || r.waLinks > 0)
    .map((r) => ({ url: r.url, forms: r.forms?.length || 0, tel: r.telLinks, mail: r.mailLinks, wa: r.waLinks, ctas: r.ctaButtons })),
  slowest: [...results].sort((a, b) => (b.navMs || 0) - (a.navMs || 0)).slice(0, 10).map((r) => ({ url: r.url, ms: r.navMs })),
  thinContent: results.filter((r) => (r.textLen || 0) < 500).map((r) => ({ url: r.url, textLen: r.textLen })),
};

const cspPresent = results.length && results[0].headers['content-security-policy'] === 'present';
const xfoPresent = results.length && results[0].headers['x-frame-options'];
const apacheLike = results.length && /apache/i.test(results[0].headers.server || '');
const platformIsEdge = results.length && results[0].headers['x-deployment-id'] === 'present';

const md = [];
md.push(`# Playwright Site Audit — ${LABEL}`);
md.push('');
md.push(`- **Base URL:** ${BASE}`);
md.push(`- **Generated:** ${new Date().toISOString()}`);
md.push(`- **Pages crawled:** ${summary.total} (from public/sitemap.xml)`);
md.push(`- **Concurrency:** ${CONCURRENCY}`);
md.push(`- **Tool:** Playwright + headless Chromium`);
md.push('');
md.push('## Verdict at a glance');
md.push('');
md.push(`| Check | Result |`);
md.push(`|---|---|`);
md.push(`| Pages returning 200 | ${summary.ok} / ${summary.total} |`);
md.push(`| Pages returning non-200 | ${summary.non200} |`);
md.push(`| Navigation errors | ${summary.navErrors} |`);
md.push(`| Pages with homepage default title (should be 0) | **${summary.homepageTitleDuplicates.length}** |`);
md.push(`| Pages whose canonical points to homepage | **${summary.canonicalToHome}** |`);
md.push(`| Pages missing canonical | ${summary.missingCanonical.length} |`);
md.push(`| Pages missing meta description | ${summary.missingDescription.length} |`);
md.push(`| Pages with no H1 | ${summary.noH1.length} |`);
md.push(`| Pages with multiple H1s | ${summary.multipleH1.length} |`);
md.push(`| Total <img> missing alt | ${summary.imgsMissingAltTotal} (${summary.pagesWithImgsMissingAlt.length} pages) |`);
md.push(`| Pages with console errors | ${summary.consoleErrorsByUrl.length} |`);
md.push(`| Pages with failed network requests | ${summary.failedRequestsByUrl.length} |`);
md.push(`| Pages with JSON-LD parse errors | ${summary.jsonLdParseErrors.length} |`);
md.push(`| Pages with <13 hreflang links | ${summary.hreflangMissing.length} |`);
md.push(`| Pages where Helmet did not flush (data-rh count = 0) | ${summary.helmetMissing.length} |`);
md.push(`| CSP header present in response | ${cspPresent ? 'yes' : 'NO'} |`);
md.push(`| X-Frame-Options header present | ${xfoPresent ? xfoPresent : 'NO'} |`);
md.push(`| Server is Apache | ${apacheLike ? 'yes' : 'NO'} |`);
md.push(`| Edge-platform deployment-id cookie present | ${platformIsEdge ? 'yes (Vercel-style)' : 'no'} |`);
md.push('');
md.push('## Site-level probes');
md.push('');
md.push('| Probe | Status | Final URL | Expected |');
md.push('|---|---|---|---|');
probes.forEach((p) => md.push(`| ${p.name} | ${p.status ?? p.err} | ${p.finalUrl} | ${p.expect} |`));
md.push('');

function section(title, list, fmt) {
  if (!list || list.length === 0) return;
  md.push(`## ${title} (${list.length})`);
  md.push('');
  const sample = list.slice(0, 25);
  sample.forEach((x) => md.push(`- ${fmt(x)}`));
  if (list.length > sample.length) md.push(`- … and ${list.length - sample.length} more (see raw.json)`);
  md.push('');
}

section(
  'Pages serving the homepage default title (CRITICAL if >0)',
  summary.homepageTitleDuplicates,
  (r) => `${r.url} — title: "${r.title}"`
);
section('Pages whose canonical points to homepage', results.filter((r) => r.url !== homePath && r.canonical?.replace(/\/$/, '') === BASE), (r) => `${r.url} → canonical=${r.canonical}`);
section('Pages missing canonical', summary.missingCanonical, (u) => u);
section('Pages missing meta description', summary.missingDescription, (u) => u);
section('Pages with empty <title>', summary.emptyTitle, (u) => u);
section('Pages with title <30 chars', summary.shortTitle, (x) => `${x.url} — len=${x.len} "${x.title}"`);
section('Pages with title >70 chars', summary.longTitle, (x) => `${x.url} — len=${x.len} "${x.title}"`);
section('Pages with description >170 chars', summary.longDescription, (x) => `${x.url} — len=${x.len}`);
section('Pages with description <60 chars', summary.shortDescription, (x) => `${x.url} — len=${x.len}`);
section('Pages with no H1', summary.noH1, (u) => u);
section('Pages with multiple H1s', summary.multipleH1, (x) => `${x.url} — ${x.count} H1s: ${x.h1.join(' | ').slice(0, 200)}`);
section('Pages with <img> missing alt', summary.pagesWithImgsMissingAlt, (x) => `${x.url} — ${x.missing}/${x.total} imgs missing alt`);
section('Pages with JS console errors', summary.consoleErrorsByUrl, (x) => `${x.url} — ${x.count} errors. e.g. ${x.samples[0] || ''}`);
section('Pages with failed network requests', summary.failedRequestsByUrl, (x) => `${x.url} — ${x.samples.map((s) => s.url).join(', ').slice(0, 200)}`);
section('Pages with JSON-LD parse errors', summary.jsonLdParseErrors, (x) => `${x.url} — ${x.errs} blocks`);
section('Pages with <13 hreflang alternates', summary.hreflangMissing, (x) => `${x.url} — ${x.count} hreflang links`);
section('Pages where Helmet did not flush', summary.helmetMissing, (u) => u);
section('Slowest pages (DOMContentLoaded)', summary.slowest, (x) => `${x.url} — ${x.ms} ms`);
section('Thin content pages (<500 chars body text)', summary.thinContent, (x) => `${x.url} — ${x.textLen} chars`);
section('Pages with lead-capture surface (forms / tel / mail / wa)', summary.pagesWithLeadCapture, (x) => `${x.url} — forms:${x.forms} tel:${x.tel} mail:${x.mail} wa:${x.wa} ctas:${x.ctas}`);

const mdPath = join(OUT_DIR, 'report.md');
writeFileSync(mdPath, md.join('\n'));
console.log(`[audit] wrote ${mdPath}`);

// also dump a flat CSV of the worst per-page numbers for quick eyeballing
const csv = ['url,status,navMs,title_len,desc_len,h1,imgs_missing_alt,console_errors,hreflang,helmet_tags,json_ld'];
results.forEach((r) =>
  csv.push(
    [
      r.url,
      r.status,
      r.navMs,
      r.title?.length || 0,
      r.description?.length || 0,
      r.h1Count,
      r.imgsMissingAlt,
      r.consoleErrors?.length || 0,
      r.hreflangCount || 0,
      r.helmetTagsCount || 0,
      r.jsonLdCount || 0,
    ].join(',')
  )
);
writeFileSync(join(OUT_DIR, 'pages.csv'), csv.join('\n'));
console.log(`[audit] wrote ${join(OUT_DIR, 'pages.csv')}`);
console.log('[audit] done.');
