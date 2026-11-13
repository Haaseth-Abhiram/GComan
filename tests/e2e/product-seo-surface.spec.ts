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

  test('Arabic meta description carries the stock / GCC / quote tail (2026-11-13)', async ({ page }) => {
    // The /ar snippet used to be the bare one-line Arabic label
    // ("صودا الخبز درجة غذائية…"), with no stock, export or call to action.
    await page.goto('/ar/products/food-beverage/sodium-bicarbonate-food');
    const desc = page.locator('head meta[name="description"]').first();
    await expect(desc).toHaveAttribute('content', /اطلب عرض سعر\.$/, { timeout: 10_000 });
    const value = (await desc.getAttribute('content')) as string;
    expect(value).toContain('صودا الخبز');
    expect(value).toContain('التصدير لدول الخليج');
    expect(value.length).toBeLessThanOrEqual(155);
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

// Title word order. SEO.tsx clamps <title> to 60 chars, so whatever trails gets
// cut. The old template put "Oman" last and 86 of 272 product pages lost it
// entirely — the exact geo signal the 2026-09-10 SERP checks showed deciding
// "<product> supplier oman" queries.
//
// These read the title via a poll: on the dev server the page is client-rendered,
// so page.goto() resolves while <title> is still the index.html fallback
// ("Chemical Suppliers in Oman & GCC | Global Chemicals LLC") and Helmet has not
// committed yet. Reading it straight after goto() is a flake.
const FALLBACK = 'Chemical Suppliers in Oman & GCC | Global Chemicals LLC';

async function settledTitle(page: import('@playwright/test').Page, url: string) {
  await page.goto(url);
  await expect
    .poll(async () => await page.title(), { timeout: 10_000 })
    .not.toBe(FALLBACK);
  return (await page.title()).trim();
}

test.describe('Product SERP title', () => {
  test('leads with product + Supplier in Oman, and stays inside the clamp', async ({ page }) => {
    for (const url of [
      '/products/agro/agricultural-gypsum',
      '/products/agro/dap-fertilizer',
      '/products/water-treatment/caustic-soda-flakes',
      // Regression cases (2026-09-27): retitling for cross-category
      // disambiguation pushed these composed titles past the 60-char clamp,
      // and fitForSerp truncated them past the word "Oman". This sampled test
      // passed anyway because none of the 3 URLs above were affected — hence
      // `npm run verify:serp-titles`, which checks the whole catalogue. These
      // four keep the *rendered* form of that regression covered here too.
      '/products/oilfield/deg',
      '/products/water-treatment/meg-water',
      '/products/corrosion-inhibitor/corrosion-inhibitor-general',
      '/products/cooling-water/hardness-control-boiler',
    ]) {
      const title = await settledTitle(page, url);
      expect(title.length, `${url} title length`).toBeLessThanOrEqual(60);
      expect(title, `${url} must keep the geo signal`).toContain('Oman');
      expect(title, `${url} must state the commercial intent`).toContain('Supplier');
      // The clamp must never leave a dangling separator or half a phrase.
      expect(title).not.toMatch(/[|\-–—:,]\s*$/);
    }
  });

  test('cross-category SKUs keep distinct titles', async ({ page }) => {
    const titles: string[] = [];
    for (const url of [
      '/products/oilfield/edta-powder',
      '/products/soap-detergent/edta-powder-soap',
      '/products/water-treatment/edta-powder-water',
    ]) {
      titles.push(await settledTitle(page, url));
    }
    expect(new Set(titles).size, `EDTA titles must be unique: ${titles.join(' // ')}`).toBe(3);
  });
});
