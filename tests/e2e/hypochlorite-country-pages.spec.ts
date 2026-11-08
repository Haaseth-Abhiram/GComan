import { test, expect } from '@playwright/test';

// Sodium hypochlorite country pages (SodiumHypochloriteCountry.tsx). Pins, for
// the two markets with invoiced sales: a country-named title and H1, a self
// canonical, its own FAQ, and the links in from the hypochlorite hub and the
// country location page — a country page nothing links to ships orphaned.
const PAGES = [
  { slug: 'uae', h1: 'Sodium Hypochlorite Supplier in the UAE', faq: 'Does sodium hypochlorite lose strength on the way to the UAE?', location: '/chemicals/uae' },
  { slug: 'bahrain', h1: 'Sodium Hypochlorite Supplier in Bahrain', faq: 'Which sodium hypochlorite grade do Bahrain hotels and pools use?', location: '/chemicals/bahrain' },
];

test.describe('Sodium hypochlorite country pages', () => {
  for (const p of PAGES) {
    test(`${p.slug}: title, H1, canonical and FAQ`, async ({ page }) => {
      const path = `/chemical-supplier/sodium-hypochlorite-${p.slug}`;
      await page.goto(path);
      await expect(page.locator('h1')).toHaveText(p.h1);
      await expect(page).toHaveTitle(/^Sodium Hypochlorite Supplier /);
      const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
      expect(canonical).toBe(`https://gcoman.com${path}`);
      await expect(page.getByText(p.faq).first()).toBeVisible();
    });

    test(`${p.slug}: linked from its location page`, async ({ page }) => {
      await page.goto(p.location);
      await expect(page.locator(`a[href="/chemical-supplier/sodium-hypochlorite-${p.slug}"]`).first()).toHaveCount(1);
    });
  }

  test('the hypochlorite hub links both country pages', async ({ page }) => {
    await page.goto('/chemical-supplier/sodium-hypochlorite-oman');
    for (const p of PAGES) {
      await expect(page.locator(`a[href="/chemical-supplier/sodium-hypochlorite-${p.slug}"]`).first()).toHaveCount(1);
    }
  });
});
