/**
 * stamp-modified — write each page's real "last modified" date into its
 * prerendered HTML, at prerender time.
 *
 * Why: hub, product and location pages carried no date at all — no
 * `article:modified_time`, no `dateModified` on their WebPage JSON-LD. Freshness
 * is one of the signals Perplexity / ChatGPT / AI Overviews weigh when choosing
 * which source to cite (GEO audit 2026-10-18). The true per-page date already
 * exists: `<lastmod>` in public/sitemap.xml, derived from git history by
 * `sync-sitemap-lastmod.mjs`. Stamping it here costs zero bundle bytes (no
 * 640-entry date table shipped to the browser) and lands exactly where the
 * non-JS AI crawlers read — the static HTML. (Once JS runs, Helmet replaces
 * its own data-rh JSON-LD, so a JS-rendering crawler sees the meta tag but not
 * the JSON-LD dateModified. AI crawlers do not run JS; that is the audience.)
 *
 * Only adds, never overwrites: a page that already declares any dateModified
 * (blog posts, via BlogPosting from Blog.tsx) is left untouched.
 *
 * Imported by vite.config.ts (prerender postProcess). Self-test:
 *   node scripts/stamp-modified.mjs --self-test
 */
import fs from 'node:fs';

/** Map of route path ("/", "/ar/products/x") → "YYYY-MM-DD" from the sitemap. */
export function lastmodByRoute(sitemapXml) {
  const map = new Map();
  for (const m of sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>https:\/\/gcoman\.com([^<]*)<\/loc>/);
    const lastmod = m[1].match(/<lastmod>(\d{4}-\d{2}-\d{2})/);
    if (loc && lastmod) map.set(loc[1] || '/', lastmod[1]);
  }
  return map;
}

const LD_JSON = /<script([^>]*type="application\/ld\+json"[^>]*)>([\s\S]*?)<\/script>/g;

/** Returns the html with the date stamped in; unchanged if nothing applies. */
export function stampModified(html, date) {
  if (!date) return html;
  // A page that already declares its own date (blog posts: BlogPosting
  // dateModified from Blog.tsx) keeps it — two different dates on one page
  // are a worse signal than none.
  if (/"dateModified"\s*:/.test(html) || /property="article:modified_time"/.test(html)) return html;
  let out = html.replace(LD_JSON, (whole, attrs, body) => {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return whole; // never rewrite what we cannot parse
    }
    if (!data || Array.isArray(data) || data['@type'] !== 'WebPage' || data.dateModified) return whole;
    return `<script${attrs}>${JSON.stringify({ ...data, dateModified: date })}</script>`;
  });
  if (!/property="article:modified_time"/.test(out)) {
    out = out.replace('</head>', `<meta property="article:modified_time" content="${date}"></head>`);
  }
  return out;
}

/**
 * Keep only the last FAQPage JSON-LD block when a page carries several.
 *
 * On /ar routes the page can render once in English before i18next flips to
 * Arabic; occasionally the English FAQPage Helmet block survives next to the
 * Arabic one (seen on /ar/chemicals/abu-dhabi in the 2026-10-18 full build,
 * 1 of 640 pages, not reproducible). Two FAQPage blocks — one describing
 * questions that are not on the page — is the schema/visible mismatch Google
 * treats as spam. The last block is the final committed render, so it wins.
 */
export function dedupeFaqPage(html) {
  const faq = [];
  for (const m of html.matchAll(LD_JSON)) {
    try {
      if (JSON.parse(m[2])?.['@type'] === 'FAQPage') faq.push(m[0]);
    } catch {
      /* not ours to judge */
    }
  }
  let out = html;
  for (const block of faq.slice(0, -1)) out = out.replace(block, '');
  return out;
}

export function loadLastmod(sitemapPath) {
  return lastmodByRoute(fs.readFileSync(sitemapPath, 'utf-8'));
}

if (process.argv.includes('--self-test')) {
  const assert = (await import('node:assert/strict')).default;
  const map = lastmodByRoute(
    '<url><loc>https://gcoman.com/</loc><lastmod>2026-10-05</lastmod></url>' +
      '<url><loc>https://gcoman.com/a</loc><lastmod>2026-10-16</lastmod></url>',
  );
  assert.equal(map.get('/'), '2026-10-05');
  assert.equal(map.get('/a'), '2026-10-16');
  const page =
    '<head><script type="application/ld+json" data-rh="true">{"@type":"WebPage","url":"u"}</script>' +
    '<script type="application/ld+json">{"@type":"FAQPage"}</script></head>';
  const s = stampModified(page, '2026-10-16');
  assert.match(s, /"dateModified":"2026-10-16"/);
  assert.match(s, /data-rh="true"/);
  assert.match(s, /article:modified_time" content="2026-10-16"/);
  assert.equal((s.match(/dateModified/g) || []).length, 1, 'FAQPage must not be stamped');
  const blog = '<head><script type="application/ld+json">{"@type":"BlogPosting","dateModified":"2026-03-15"}</script><script type="application/ld+json">{"@type":"WebPage"}</script></head>';
  assert.equal(stampModified(blog, '2026-10-16'), blog, 'existing dates win');
  assert.equal(stampModified(page, undefined), page);
  const twoFaq = '<head><script type="application/ld+json">{"@type":"FAQPage","n":"en"}</script><script type="application/ld+json">{"@type":"FAQPage","n":"ar"}</script></head>';
  const one = dedupeFaqPage(twoFaq);
  assert.equal((one.match(/FAQPage/g) || []).length, 1);
  assert.match(one, /"n":"ar"/);
  assert.equal(dedupeFaqPage(page), page, 'single FAQPage untouched');
  console.log('stamp-modified self-test: ok');
}
