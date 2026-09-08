import { test, expect } from '@playwright/test';

// Regression guards for the two product-page SEO defects found in the
// 2026-09-08 Search Console review. Both shipped to production and both were
// silent — the pages rendered fine, they just could not earn a click.
//
//   1. META DESCRIPTION was longDescription truncated at 154 chars, i.e. an
//      article opening cut mid-thought, on 259 of 275 products. GSC showed the
//      matching damage: page-1 rankings with ~zero CTR (tris-base-lab 342
//      impressions @ pos 12.4 → 1 click; acetic-acid-lab 306 → 0 clicks).
//   2. RELATED PRODUCTS was `.slice(0, 3)` over the category array, so all 50
//      oilfield pages linked to the same 3 products and 201 of 275 products
//      received zero inbound links from any sibling page.

// A product with a CAS number and NO details.seoDescription, so it exercises the
// composer. Also one of the worst CTR offenders in the 2026-09-08 data:
// 306 impressions at position 39.6 for "acetic acid supplier", zero clicks.
const COMPOSED_PRODUCT = '/products/lab-chemicals/acetic-acid-lab';
// A product that DOES carry a hand-written details.seoDescription; the override
// must keep beating the composer.
const HAND_WRITTEN_PRODUCT = '/products/lab-chemicals/tris-base-lab';

test.describe('Product page SEO surface', () => {
  test('hand-written details.seoDescription still overrides the composer', async ({ page }) => {
    await page.goto(HAND_WRITTEN_PRODUCT);
    const desc = await page
      .locator('head meta[name="description"]')
      .first()
      .getAttribute('content');
    expect(desc).toContain('Tris-HCl');
    expect(desc).not.toContain('Request a quote');
  });

  test('meta description is a complete composed sentence, not a truncation', async ({ page }) => {
    await page.goto(COMPOSED_PRODUCT);
    const desc = await page
      .locator('head meta[name="description"]')
      .first()
      .getAttribute('content');

    expect(desc, 'product page must emit a meta description').toBeTruthy();
    const value = desc as string;

    // Google truncates past ~155; the composer is capped there.
    expect(value.length).toBeGreaterThan(60);
    expect(value.length).toBeLessThanOrEqual(155);

    // The old bug's fingerprint: an ellipsis where the truncation cut the text.
    expect(value).not.toContain('…');
    expect(value.trimEnd()).toMatch(/\.$/);

    // Composed snippet must carry the commercial signals a buyer scans for.
    expect(value).toContain('supplier in Oman & GCC');
    expect(value).toContain('Request a quote');
  });

  test('meta description stays within the cap across a sample of categories', async ({ page }) => {
    const urls = [
      '/products/water-treatment/caustic-soda-liquid',
      '/products/oilfield/bentonite-powder',
      '/products/food-beverage/nitric-acid-68',
      '/products/lubricants/shell-lubricants',
      '/products/agro/urea-fertilizer',
    ];
    for (const url of urls) {
      await page.goto(url);
      const desc = await page
        .locator('head meta[name="description"]')
        .first()
        .getAttribute('content');
      expect(desc, `${url} must emit a meta description`).toBeTruthy();
      const value = desc as string;
      expect(value.length, `${url} description length`).toBeLessThanOrEqual(155);
      expect(value, `${url} must not be a mid-word truncation`).not.toContain('…');
    }
  });

  test('related products rotate, so sibling pages do not all link to the same 3', async ({ page }) => {
    // Two products in the same large category must surface different related
    // sets. Under the old `.slice(0, 3)` these were byte-identical.
    const hrefsFor = async (url: string) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      const heading = page.getByRole('heading', { name: /related products/i });
      await expect(heading).toBeVisible();
      const section = page.locator('div').filter({ has: heading }).last();
      return section.locator('a[href*="/products/oilfield/"]').evaluateAll(
        (nodes) => nodes.map((n) => (n as HTMLAnchorElement).getAttribute('href') || ''),
      );
    };

    const first = await hrefsFor('/products/oilfield/bentonite-powder');
    const second = await hrefsFor('/products/oilfield/mdea');

    expect(first.length, 'related products should render a rotating window').toBeGreaterThan(3);
    expect(second.length).toBeGreaterThan(3);
    expect(
      new Set(first).size === new Set([...first, ...second]).size,
      'two products in the same category must not expose identical related sets',
    ).toBeFalsy();
  });
});
