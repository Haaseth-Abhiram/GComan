import { test, expect } from '@playwright/test';

// Calcium hypochlorite country pages (CalciumHypochloriteCountry.tsx). Pins,
// for the two markets with repeat invoices: a country-named title and H1, a
// self canonical, its own FAQ, and the links in from the pool-chlorine hub and
// the country location page — a country page nothing links to ships orphaned.
const PAGES = [
  { slug: 'uae', h1: 'Calcium Hypochlorite Supplier in the UAE', faq: 'Do you supply calcium hypochlorite in 45 kg drums to UAE distributors?', location: '/chemicals/uae' },
  { slug: 'bahrain', h1: 'Calcium Hypochlorite Supplier in Bahrain', faq: 'Which chlorine do Bahrain hotel pools use: calcium hypochlorite or TCCA tablets?', location: '/chemicals/bahrain' },
];

test.describe('Calcium hypochlorite country pages', () => {
  for (const p of PAGES) {
    test(`${p.slug}: title, H1, canonical and FAQ`, async ({ page }) => {
      const path = `/chemical-supplier/calcium-hypochlorite-${p.slug}`;
      await page.goto(path);
      await expect(page.locator('h1')).toHaveText(p.h1);
      await expect(page).toHaveTitle(/^Calcium Hypochlorite Supplier /);
      const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
      expect(canonical).toBe(`https://gcoman.com${path}`);
      await expect(page.getByText(p.faq).first()).toBeVisible();
    });

    test(`${p.slug}: linked from its location page and the pool-chlorine hub`, async ({ page }) => {
      for (const from of [p.location, '/chemical-supplier/pool-chlorine-gcc']) {
        await page.goto(from);
        await expect(page.locator(`a[href="/chemical-supplier/calcium-hypochlorite-${p.slug}"]`).first()).toHaveCount(1);
      }
    });
  }
});
