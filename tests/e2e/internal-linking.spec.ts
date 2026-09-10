import { test, expect } from '@playwright/test';

// Regression guards for internal-linking and entity-consistency defects found in
// the Aug 2026 audit. Each of these shipped to production once:
//   - /certifications was indexable with zero internal links anywhere on the site
//   - /chemicals/{sharjah,fujairah,ras-al-khaimah} were indexable but unlinked,
//     so their /ar twins were orphaned too
//   - twitter:site named an account the company does not link to
test.describe('Internal linking & entity consistency', () => {
  test('certifications is linked from the footer (was orphaned)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const links = page.locator('footer a[href="/certifications"]');
    const n = await links.count();
    console.log('  /certifications footer links:', n);
    expect(n).toBeGreaterThanOrEqual(4); // 3 trust badges + 1 quick link
  });

  test('the three orphaned GCC cities are linked (EN)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    for (const slug of ['sharjah', 'fujairah', 'ras-al-khaimah']) {
      await expect(page.locator(`footer a[href="/chemicals/${slug}"]`).first()).toHaveCount(1);
    }
  });

  test('the three orphaned GCC cities are linked (AR, locale-prefixed)', async ({ page }) => {
    await page.goto('/ar/');
    await page.waitForLoadState('networkidle');
    for (const slug of ['sharjah', 'fujairah', 'ras-al-khaimah']) {
      await expect(page.locator(`footer a[href="/ar/chemicals/${slug}"]`).first()).toHaveCount(1);
    }
  });

  test('nav.certifications resolves in both locales (no raw i18n key)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // .first() = the Quick Links entry; the later matches are the trust badges.
    await expect(page.locator('footer a[href="/certifications"]').first()).toHaveText('Certifications');
    await page.goto('/ar/');
    await page.waitForLoadState('networkidle');
    const arText = await page.locator('footer a[href="/ar/certifications"]').first().textContent();
    console.log('  AR label:', arText);
    expect(arText).not.toContain('nav.certifications');
    expect(arText?.trim()).toBe('الشهادات');
  });

  test('twitter:site uses the handle the footer links to', async ({ page }) => {
    await page.goto('/');
    const handle = await page.locator('meta[name="twitter:site"]').getAttribute('content');
    const href = await page.locator('footer a[href*="x.com/"]').first().getAttribute('href');
    console.log('  twitter:site =', handle, '| footer =', href);
    expect(href).toContain(String(handle).replace('@', ''));
  });
});

// The 21 products translated in Aug 2026 (agro / lubricants / tank-cleaners
// batch) must render as fully-localized Arabic pages: indexable robots +
// Arabic title. If the products-ar.json entry is malformed the page silently
// falls back to English meta + noindex — this pins one product per batch.
test.describe('Arabic product translations (Aug 2026 batch)', () => {
  for (const slug of ['products/agro/urea-fertilizer', 'products/lubricants/shell-lubricants']) {
    test(`/ar/${slug} is indexable with Arabic meta`, async ({ page }) => {
      await page.goto(`/ar/${slug}`);
      await page.waitForLoadState('networkidle');
      const robots = await page.locator('meta[name="robots"]').first().getAttribute('content');
      expect(robots).toContain('index, follow');
      expect(robots).not.toContain('noindex');
      const title = await page.title();
      expect(title).toMatch(/[؀-ۿ]/); // contains Arabic script
    });
  }
});

// Oman city pages are where the site can actually rank — a 2026-09-10 SERP
// sweep put gcoman #1 for Duqm, Rusayl and Muscat queries and nowhere for
// Riyadh or Dubai. Yet the content investment had gone the other way: the six
// Oman pages carried ~300 words and 3 FAQs against 650–717 words and 5 FAQs on
// the GCC pages, which is why the homepage was outranking /chemicals/duqm and
// /chemicals/salalah for their own city terms.
test.describe('Oman location pages carry their weight', () => {
  const OMAN = ['muscat', 'sohar', 'salalah', 'duqm', 'rusayl', 'rustaq'];

  for (const city of OMAN) {
    test(`/chemicals/${city} renders the deepened FAQ set and a related guide`, async ({ page }) => {
      await page.goto(`/chemicals/${city}`);
      await page.waitForLoadState('networkidle');

      // FAQPage schema is built from the same array the accordion renders, so
      // counting the JSON-LD entries checks both at once.
      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      const faqBlock = ld.find((t) => t.includes('FAQPage'));
      expect(faqBlock, `${city} must emit FAQPage schema`).toBeTruthy();
      const questions = (faqBlock!.match(/"@type"\s*:\s*"Question"/g) || []).length;
      expect(questions, `${city} FAQ count`).toBeGreaterThanOrEqual(5);

      // Each Oman city funnels to a topically matched guide.
      await expect(
        page.locator('a[href^="/blog/"]').first(),
        `${city} must link to its related guide`,
      ).toHaveCount(1);
    });
  }
});

// Location <title>s are clamped to 60 chars by SEO.tsx. 16 of 26 were running
// over and losing their differentiator — Riyadh, the best-performing GCC page,
// showed only 38 of the 60 available characters because the brand suffix was
// stripped wholesale. Rewritten to fit, leading with the city and then the
// Oman-origin angle a 2026-09-10 SERP test showed us winning on ("chemical
// exporter from oman to saudi arabia" -> #1 and #2).
test.describe('Location page titles fit the SERP', () => {
  const SAMPLE = [
    { slug: 'riyadh', mustContain: 'Riyadh' },
    { slug: 'dubai', mustContain: 'Dubai' },
    { slug: 'dammam', mustContain: 'Dammam' },
    { slug: 'duqm', mustContain: 'Duqm' },
    { slug: 'rusayl', mustContain: 'Rusayl' },
  ];

  for (const { slug, mustContain } of SAMPLE) {
    test(`/chemicals/${slug} title is inside the clamp and keeps the city`, async ({ page }) => {
      await page.goto(`/chemicals/${slug}`);
      await expect
        .poll(async () => await page.title(), { timeout: 10_000 })
        .not.toBe('Chemical Suppliers Oman & GCC | Global Chemicals LLC');
      const title = (await page.title()).trim();
      expect(title.length, `${slug} title length`).toBeLessThanOrEqual(60);
      expect(title, `${slug} must keep its city name`).toContain(mustContain);
      // No half-phrase left behind by the clamp.
      expect(title).not.toMatch(/[|\-–—:,]\s*$/);
    });
  }
});
