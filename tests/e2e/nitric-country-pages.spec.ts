import { test, expect } from '@playwright/test';

// Nitric acid country pages (NitricAcidCountry.tsx). Pins, for each of the five
// GCC markets: a country-named title and H1, a self canonical, its own FAQ, and
// the link back from the main nitric hub — a country page the hub does not
// link to ships orphaned.
const PAGES = [
  { slug: 'uae', h1: 'Nitric Acid Supplier in the UAE', faq: 'How fast can you deliver nitric acid to Dubai?' },
  { slug: 'saudi-arabia', h1: 'Nitric Acid Supplier in Saudi Arabia', faq: 'Do I need a Saudi agent to import nitric acid from Oman?' },
  { slug: 'qatar', h1: 'Nitric Acid Supplier in Qatar', faq: 'How long does nitric acid take from Oman to Doha?' },
  { slug: 'kuwait', h1: 'Nitric Acid Supplier in Kuwait', faq: 'How long does nitric acid take from Oman to Kuwait?' },
  { slug: 'bahrain', h1: 'Nitric Acid Supplier in Bahrain', faq: 'How long does nitric acid take from Oman to Bahrain?' },
];

test.describe('Nitric acid country pages', () => {
  for (const p of PAGES) {
    test(`${p.slug}: title, H1, canonical and FAQ`, async ({ page }) => {
      const path = `/chemical-supplier/nitric-acid-${p.slug}`;
      await page.goto(path);
      await expect(page.locator('h1')).toHaveText(p.h1);
      await expect(page).toHaveTitle(/^Nitric Acid Supplier /);
      const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
      expect(canonical).toBe(`https://gcoman.com${path}`);
      await expect(page.getByText(p.faq).first()).toBeVisible();
    });
  }

  test('the main nitric hub links every country page', async ({ page }) => {
    await page.goto('/chemical-supplier/nitric-acid-oman');
    for (const p of PAGES) {
      await expect(page.locator(`a[href="/chemical-supplier/nitric-acid-${p.slug}"]`).first()).toHaveCount(1);
    }
  });
});
