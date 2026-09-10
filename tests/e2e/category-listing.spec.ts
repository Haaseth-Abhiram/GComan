import { test, expect } from '@playwright/test';

// Category pages are the main crawl path from /products down to the 275 product
// pages. An audit of the BUILT output on 2026-09-10 found 16 of 22 shipped with
// zero links to their own products — 169 of 275 products had no route in from
// their category. The cause was that the grid loaded only through a dynamic
// import inside useEffect, so nothing was in the DOM on first paint and the
// prerenderer's 2500 ms wait became a race that most categories lost. oilfield
// (50 products) and lab-chemicals (34) — the two largest, and the two with the
// most "Discovered – currently not indexed" pages in Search Console — were both
// empty.
//
// Fixed by per-category route entries that statically import their own JSON
// (src/pages/productCategory/), mirroring what src/pages/productDetail/ already
// did for product pages.
//
// NOTE: these run against the dev server, so they cannot see the prerender race
// itself. They guard the render path and the canonical/param regression that the
// literal routes introduced. `node scripts/audit-internal-links.mjs` after a full
// `npm run build` is what checks the prerendered output.

const CATEGORIES = [
  { slug: 'oilfield', min: 40 },
  { slug: 'lab-chemicals', min: 25 },
  { slug: 'glycols', min: 3 },
  { slug: 'lab-equipment', min: 1 },
];

test.describe('Category listing pages', () => {
  for (const { slug, min } of CATEGORIES) {
    test(`/products/${slug} renders its product links`, async ({ page }) => {
      await page.goto(`/products/${slug}`);
      await page.waitForLoadState('networkidle');
      const links = page.locator(`a[href^="/products/${slug}/"]`);
      expect(await links.count()).toBeGreaterThanOrEqual(min);
    });
  }

  test('literal category routes still expose the category to <SEO>', async ({ page }) => {
    // The per-category entries route on a literal path, so useParams() no longer
    // supplies :category. Everything downstream — canonical, og:url, the active
    // filter — reads that value, so a regression here silently points every
    // category page's canonical at /products.
    await page.goto('/products/oilfield');
    const canonical = await page
      .locator('head link[rel="canonical"]')
      .first()
      .getAttribute('href');
    expect(canonical).toBe('https://gcoman.com/products/oilfield');
  });

  test('canonicalised SKUs are not listed in their category', async ({ page }) => {
    // caustic-soda-{flakes,liquid,prills}-soap all canonicalise into
    // water-treatment. Listing them sent shoppers and link equity to a page that
    // tells Google the real one is elsewhere.
    await page.goto('/products/soap-detergent');
    await page.waitForLoadState('networkidle');
    for (const slug of [
      'caustic-soda-flakes-soap',
      'caustic-soda-liquid-soap',
      'caustic-soda-prills-soap',
    ]) {
      await expect(
        page.locator(`a[href="/products/soap-detergent/${slug}"]`),
        `${slug} canonicalises elsewhere and must not be linked`,
      ).toHaveCount(0);
    }
    // The category must still render its other products.
    expect(await page.locator('a[href^="/products/soap-detergent/"]').count()).toBeGreaterThan(10);
  });

  test('an unknown category still resolves through the wildcard route', async ({ page }) => {
    await page.goto('/products/not-a-real-category');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('Loading products');
  });
});
