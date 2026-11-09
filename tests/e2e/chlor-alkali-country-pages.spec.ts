import { test, expect } from '@playwright/test';

// Caustic soda and hydrochloric acid country pages (CausticSodaCountry.tsx,
// HydrochloricAcidCountry.tsx). Pins a country-named title and H1, a self
// canonical, a visible country FAQ, and the links in from the country location
// page and the product's Oman hub — a country page nothing links to ships
// orphaned.
const PAGES = [
  { path: '/chemical-supplier/caustic-soda-uae', h1: 'Caustic Soda Supplier in the UAE', title: /^Caustic Soda Supplier UAE/, faq: 'How fast can you deliver caustic soda to Dubai or Abu Dhabi?', location: '/chemicals/uae', hub: '/chemical-supplier/caustic-soda-oman' },
  { path: '/chemical-supplier/caustic-soda-saudi-arabia', h1: 'Caustic Soda Supplier in Saudi Arabia', title: /^Caustic Soda Supplier Saudi Arabia/, faq: 'Saudi Arabia makes its own caustic soda. Why buy from Oman?', location: '/chemicals/saudi-arabia', hub: '/chemical-supplier/caustic-soda-oman' },
  { path: '/chemical-supplier/hydrochloric-acid-uae', h1: 'Hydrochloric Acid Supplier in the UAE', title: /^Hydrochloric Acid Supplier UAE/, faq: 'How fast can you deliver hydrochloric acid to Dubai or Abu Dhabi?', location: '/chemicals/uae', hub: '/chemical-supplier/hydrochloric-acid-oman' },
  { path: '/chemical-supplier/hydrochloric-acid-saudi-arabia', h1: 'Hydrochloric Acid Supplier in Saudi Arabia', title: /^Hydrochloric Acid Supplier Saudi Arabia/, faq: 'Do you supply 15% or 28% hydrochloric acid for well treatments?', location: '/chemicals/saudi-arabia', hub: '/chemical-supplier/hydrochloric-acid-oman' },
];

test.describe('Caustic soda and hydrochloric acid country pages', () => {
  for (const p of PAGES) {
    test(`${p.path}: title, H1, canonical and FAQ`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page.locator('h1')).toHaveText(p.h1);
      await expect(page).toHaveTitle(p.title);
      const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
      expect(canonical).toBe(`https://gcoman.com${p.path}`);
      await expect(page.getByText(p.faq).first()).toBeVisible();
    });

    test(`${p.path}: linked from its location page and its Oman hub`, async ({ page }) => {
      for (const from of [p.location, p.hub]) {
        await page.goto(from);
        await expect(page.locator(`a[href="${p.path}"]`).first()).toHaveCount(1);
      }
    });
  }
});

// Arabic hypochlorite and caustic hubs (2026-11-09, P10.15): full Arabic
// bodies, so each /ar render is self-canonical and indexable, and the English
// hub advertises it with hreflang.
const AR_HUBS = [
  { slug: 'sodium-hypochlorite-oman', h1: 'مورد هيبوكلوريت الصوديوم (الكلور السائل) في عُمان', faq: 'أين أشتري هيبوكلوريت الصوديوم في عُمان؟', title: /هيبوكلوريت الصوديوم/ },
  { slug: 'caustic-soda-oman', h1: 'مورد الصودا الكاوية في عُمان: قشور وحبيبات وسائلة', faq: 'أين أجد صودا كاوية للبيع في عُمان؟', title: /صودا كاوية/ },
];

test.describe('Arabic chlor-alkali hubs', () => {
  for (const h of AR_HUBS) {
    test(`/ar/${h.slug}: Arabic body, self-canonical, indexable`, async ({ page }) => {
      await page.goto(`/ar/chemical-supplier/${h.slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h.h1);
      await expect(page.getByText(h.faq).first()).toBeVisible();
      await expect
        .poll(async () => page.locator('link[rel="canonical"]').last().getAttribute('href'))
        .toBe(`https://gcoman.com/ar/chemical-supplier/${h.slug}`);
      const robots = await page.locator('meta[name="robots"]').last().getAttribute('content');
      expect(robots ?? '').not.toContain('noindex');
      await expect(page).toHaveTitle(h.title);
    });

    test(`/${h.slug}: English hub points to the Arabic twin`, async ({ page }) => {
      await page.goto(`/chemical-supplier/${h.slug}`);
      await expect
        .poll(async () => page.locator('link[rel="alternate"][hreflang="ar"]').last().getAttribute('href'))
        .toBe(`https://gcoman.com/ar/chemical-supplier/${h.slug}`);
    });
  }
});
