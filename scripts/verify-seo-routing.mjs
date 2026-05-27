#!/usr/bin/env node
/**
 * Verifies that the Cloudflare Worker is correctly serving prerendered HTML.
 * Run after every Worker deploy or DNS change:
 *   npm run verify:seo-routing
 *
 * Exits 0 if all checks pass, 1 if any fail.
 */

const BASE = process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://gcoman.com';
const HOMEPAGE_TITLE = 'Chemical Suppliers in Oman & GCC | Global Chemicals LLC';

const CHECKS = [
  {
    label: 'product page — prerendered HTML served (not SPA shell)',
    url: `${BASE}/products/water-treatment/caustic-soda-flakes`,
    expect: {
      status: 200,
      titleNot: HOMEPAGE_TITLE,
      titleContains: 'Caustic Soda',
      canonicalSelf: true,
    },
  },
  {
    label: 'product page 2 — second category',
    url: `${BASE}/products/oilfield/acetic-acid`,
    expect: {
      status: 200,
      titleNot: HOMEPAGE_TITLE,
      titleContains: 'Acetic Acid',
      canonicalSelf: true,
    },
  },
  {
    label: 'legacy redirect — old /products/alkalis/* → new URL',
    url: `${BASE}/products/alkalis/caustic-soda`,
    expect: {
      status: 301,
      locationContains: 'caustic-soda-flakes',
    },
  },
  {
    label: 'legacy redirect — old /service/* → new URL',
    url: `${BASE}/service/calcium-carbonate/`,
    expect: {
      status: 301,
      locationContains: 'calcium-carbonate',
    },
  },
  {
    label: 'homepage — title and canonical OK',
    url: `${BASE}/`,
    expect: {
      status: 200,
      titleContains: 'Chemical Suppliers',
      canonicalSelf: true,
    },
  },
];

// ---------------------------------------------------------------------------

function normalise(s) {
  return (s ?? '').replace(/&amp;/g, '&').trim();
}

let failed = 0;

for (const check of CHECKS) {
  let res;
  try {
    res = await fetch(check.url, { redirect: 'manual' });
  } catch (err) {
    console.error(`❌  ${check.label}`);
    console.error(`    fetch error: ${err.message}`);
    failed++;
    continue;
  }

  const { status } = res;
  const body = status === 200 ? await res.text() : '';
  const location = normalise(res.headers.get('location') ?? '');
  const worker  = res.headers.get('x-gcoman-worker') ?? '(no header)';

  const errs = [];

  if (check.expect.status !== undefined && status !== check.expect.status) {
    errs.push(`status: expected ${check.expect.status}, got ${status}`);
  }

  if (check.expect.locationContains) {
    if (!location.includes(check.expect.locationContains)) {
      errs.push(`location: expected to include "${check.expect.locationContains}", got "${location}"`);
    }
  }

  const titleRaw = (body.match(/<title[^>]*>([^<]+)<\/title>/) ?? [])[1] ?? '';
  const title = normalise(titleRaw);

  if (check.expect.titleContains) {
    if (!title.includes(check.expect.titleContains)) {
      errs.push(`title: expected to include "${check.expect.titleContains}", got "${title}"`);
    }
  }

  if (check.expect.titleNot) {
    if (title === normalise(check.expect.titleNot)) {
      errs.push(`title: must NOT be the homepage default — got "${title}"`);
    }
  }

  if (check.expect.canonicalSelf) {
    const canonical = normalise(
      (body.match(/<link rel="canonical" href="([^"]+)"/) ?? [])[1] ?? ''
    );
    const expectedPath = new URL(check.url).pathname;
    if (!canonical.includes(expectedPath)) {
      errs.push(`canonical: expected self-referencing "${check.url}", got "${canonical}"`);
    }
  }

  if (errs.length === 0) {
    console.log(`✅  ${check.label}  [worker: ${worker}]`);
  } else {
    console.error(`❌  ${check.label}  [worker: ${worker}]`);
    errs.forEach(e => console.error(`    ${e}`));
    failed++;
  }
}

console.log('');
if (failed === 0) {
  console.log(`All ${CHECKS.length} checks passed.`);
} else {
  console.error(`${failed} of ${CHECKS.length} checks FAILED.`);
}

process.exit(failed > 0 ? 1 : 0);
