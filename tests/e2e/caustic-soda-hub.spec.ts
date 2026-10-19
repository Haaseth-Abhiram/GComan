import { test, expect } from '@playwright/test';

// The caustic-soda landing page is the controlled test of the product+geo
// template — it targets "caustic soda supplier oman", a query a live SERP check
// on 2026-09-10 showed we did not rank in the top 9 for, despite our page being
// materially better than the two that do (omanchem #1 has ~450 words and no CAS
// number; ours has 811 words, CAS, 6 specs and 5 FAQs).
//
// Three defects were behind it, all guarded here:
//   1. Two of the three product links pointed at soap-detergent twins that carry
//      a canonicalOverride — so users and link equity landed on pages telling
//      Google the real page was elsewhere.
//   2. Both prills SKUs sat in the sitemap with no canonical relationship,
//      competing with each other.
//   3. The hub had exactly ONE inbound internal link in the entire site and none
//      from the caustic-soda product pages it exists to serve.

const HUB = '/chemical-supplier/caustic-soda-oman';

const CANONICAL_PRODUCTS = [
  '/products/water-treatment/caustic-soda-flakes',
  '/products/water-treatment/caustic-soda-liquid',
  '/products/water-treatment/caustic-soda-prills',
];

// These render, but canonicalise to the water-treatment SKUs above. Linking to
// them from the hub is the bug — never re-introduce it.
const CANONICALISED_TWINS = [
  '/products/soap-detergent/caustic-soda-flakes-soap',
  '/products/soap-detergent/caustic-soda-liquid-soap',
  '/products/soap-detergent/caustic-soda-prills-soap',
];

test.describe('Caustic soda hub — product+geo template', () => {
  test('hub links to the canonical product pages, not the canonicalised twins', async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState('networkidle');

    for (const href of CANONICAL_PRODUCTS) {
      await expect(
        page.locator(`a[href="${href}"]`).first(),
        `hub must link to canonical ${href}`,
      ).toHaveCount(1);
    }
    for (const href of CANONICALISED_TWINS) {
      await expect(
        page.locator(`a[href="${href}"]`),
        `hub must NOT link to canonicalised twin ${href}`,
      ).toHaveCount(0);
    }
  });

  test('hub keeps its own self-referencing canonical', async ({ page }) => {
    await page.goto(HUB);
    const canonical = await page
      .locator('head link[rel="canonical"]')
      .first()
      .getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com${HUB}`);
  });

  test('caustic soda product pages link back to the hub', async ({ page }) => {
    // Three full page loads against a cold dev server sit right on the default
    // 30s budget (25s even unparallelised), so this tips over whenever the other
    // workers are busy. The work is genuinely slow, not stuck — give it the room.
    test.slow();
    // Reciprocal linking is the actual fix — a hub nothing points at cannot rank.
    for (const url of CANONICAL_PRODUCTS) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await expect(
        page.locator(`a[href="${HUB}"]`).first(),
        `${url} must link back to the caustic soda guide`,
      ).toHaveCount(1);
    }
  });

  test('the guide link is opt-in — unrelated products do not show it', async ({ page }) => {
    await page.goto('/products/agro/urea-fertilizer');
    await page.waitForLoadState('networkidle');
    // Scoped to <main>: since 2026-10-19 the footer links every hub from every
    // page (site-wide "Supply Guides"), so the page-level count is never 0. The
    // guard is about the product body's guide link, which stays opt-in.
    await expect(page.locator('main').locator(`a[href="${HUB}"]`)).toHaveCount(0);
  });
});
