import { test, expect } from '@playwright/test';

// GCC water-treatment hub (WaterTreatmentChemicalsGcc.tsx, MASTER-PLAN P9.4).
// Pins: title and H1 carry the UAE phrasing the demand study found, a self
// canonical, visible FAQ, links only to canonical SKUs (never the
// canonicalOverride twins), and the inbound links that keep it from shipping
// orphaned (category intro guide link, the Oman hub list, the footer).

const HUB = '/chemical-supplier/water-treatment-chemicals-gcc';

const CANONICAL_PRODUCTS = [
  '/products/water-treatment/pac-liquid',
  '/products/water-treatment/sodium-hypochlorite',
  '/products/water-treatment/ferric-chloride-liquid',
  '/products/ro-chemicals/antiscalant-ro',
];

// These carry details.canonicalOverride — linking them from a hub sends link
// equity to a page that tells Google the real page is elsewhere.
const CANONICALISED_TWINS = [
  '/products/water-treatment/aluminium-sulphate-powder',
  '/products/water-treatment/chlorine-tablets',
  '/products/water-treatment/sodium-hypochlorite-2',
];

test.describe('Water treatment chemicals GCC hub', () => {
  test('title, H1, canonical and visible FAQ', async ({ page }) => {
    await page.goto(HUB);
    await expect(page.locator('h1')).toHaveText('Water Treatment Chemicals Supplier for the UAE, Saudi Arabia and the GCC');
    await expect(page).toHaveTitle(/^Water Treatment Chemicals Supplier UAE/);
    const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com${HUB}`);
    await expect(page.getByText('Do you supply water treatment chemicals to the UAE?').first()).toBeVisible();
    await expect(page.getByText('+968 9277 2305').first()).toBeVisible();
  });

  test('links canonical SKUs and every GCC market page, never the twins', async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState('networkidle');
    for (const href of CANONICAL_PRODUCTS) {
      await expect(page.locator(`a[href="${href}"]`).first(), `hub must link ${href}`).toHaveCount(1);
    }
    for (const href of CANONICALISED_TWINS) {
      await expect(page.locator(`a[href="${href}"]`), `hub must NOT link twin ${href}`).toHaveCount(0);
    }
    for (const href of ['/chemicals/uae', '/chemicals/saudi-arabia', '/chemicals/doha', '/chemicals/kuwait-city', '/chemicals/bahrain']) {
      await expect(page.locator(`a[href="${href}"]`).first(), `hub must link ${href}`).toHaveCount(1);
    }
  });

  test('the water-treatment category page and the Oman hub list link to it', async ({ page }) => {
    await page.goto('/products/water-treatment');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`a[href="${HUB}"]`).first()).toHaveCount(1);

    await page.goto('/chemical-suppliers-oman');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`a[href="${HUB}"]`).first()).toHaveCount(1);
  });
});
