#!/usr/bin/env node
/**
 * submit-indexnow — push URLs to the IndexNow API (Bing, Yandex, Seznam, Naver).
 *
 * Why: Google gets recrawl hints from sitemap lastmod + Search Console, but
 * Bing's primary freshness channel is IndexNow — instant URL-level pings that
 * skip the crawl-discovery queue entirely. As of 2026-09-29 the site had never
 * implemented it (CLAUDE.md's technical-SEO audit listed it as missing), while
 * Bing already ranks gcoman.com #1 organically for the category head term and
 * Bing Copilot names us first — so faster Bing indexing directly feeds both.
 *
 * Setup (already done):
 *   - public/<key>.txt contains the key, deployed to https://gcoman.com/<key>.txt
 *     (IndexNow verifies ownership by fetching that file — it must be LIVE in
 *     production before pings will be accepted).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs --all            # every URL in public/sitemap.xml
 *   node scripts/submit-indexnow.mjs --dry-run --all  # show what would be sent
 *   node scripts/submit-indexnow.mjs <url> [<url>...] # specific URLs
 *
 * When to run: AFTER a Lovable Publish, once the new content (and on first use,
 * the key file) is actually live. Pinging before deployment tells engines to
 * fetch pages that still serve old content. One batch call handles up to
 * 10,000 URLs, so --all is a single request for this site's 657.
 */
import { readFileSync } from 'node:fs';

const HOST = 'gcoman.com';
const KEY = '815681d66f5c410fa200c845c9fe371b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const ALL = args.includes('--all');
const explicit = args.filter((a) => !a.startsWith('--'));

let urls;
if (ALL) {
  const xml = readFileSync('public/sitemap.xml', 'utf8');
  urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
} else if (explicit.length) {
  urls = explicit;
} else {
  console.error('usage: submit-indexnow.mjs [--dry-run] --all | <url>...');
  process.exit(1);
}

const bad = urls.filter((u) => !u.startsWith(`https://${HOST}/`) && u !== `https://${HOST}`);
if (bad.length) {
  console.error(`[indexnow] refusing to submit ${bad.length} URL(s) not on https://${HOST}:`);
  bad.slice(0, 5).forEach((u) => console.error('  ' + u));
  process.exit(1);
}
if (urls.length > 10000) {
  console.error(`[indexnow] ${urls.length} URLs exceeds the 10,000-per-request limit — split the submission.`);
  process.exit(1);
}

console.log(`[indexnow] ${urls.length} URL(s) -> ${ENDPOINT}`);
if (DRY) {
  urls.slice(0, 5).forEach((u) => console.log('  ' + u));
  if (urls.length > 5) console.log(`  ... and ${urls.length - 5} more`);
  console.log('[indexnow] dry run — nothing sent.');
  process.exit(0);
}

// Sanity check first: the key file must be live in production, or every ping
// is silently worthless (engines verify ownership by fetching it).
const keyRes = await fetch(KEY_LOCATION);
const keyBody = (await keyRes.text()).trim();
if (!keyRes.ok || keyBody !== KEY) {
  console.error(
    `[indexnow] ABORT: ${KEY_LOCATION} is not serving the key (HTTP ${keyRes.status}, ` +
      `body ${JSON.stringify(keyBody.slice(0, 40))}). Deploy first (the key file ships in public/), then re-run.`
  );
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
});
// Per spec: 200 = submitted, 202 = accepted (key validation pending).
if (res.status === 200 || res.status === 202) {
  console.log(`[indexnow] OK (HTTP ${res.status}) — ${urls.length} URL(s) submitted.`);
} else {
  console.error(`[indexnow] FAILED: HTTP ${res.status} ${await res.text()}`);
  process.exit(1);
}
