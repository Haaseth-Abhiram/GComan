import { test, expect } from '@playwright/test';

// Core Web Vitals guard for the 3D chemistry hero (2026-09-22).
//
// The hero costs ~2.7 MB on first view — a 1.6 MB HDRI environment map plus a
// ~1.1 MB three.js/react-three-fiber chunk — and once it mounts it becomes the
// largest painted element, so LCP ends up measuring that whole fetch+init
// chain rather than the fast static fallback. Search Console field data had
// every product page rated "Poor" on mobile.
//
// ChemistryHero now only mounts for clients that can afford it (canAfford3D in
// src/components/products/ChemistryHero.tsx): not the prerenderer, not
// prefers-reduced-motion, not narrow viewports, not Save-Data / 2G-3G, not
// low core-count or low-memory devices. Everyone else keeps the static
// fallback that the prerendered HTML already ships.
//
// These tests pin the two conditions a regression is most likely to break.

const PRODUCT_WITH_3D = '/products/water-treatment/caustic-soda-flakes';
const HDRI = '/hdri/empty_warehouse_01_1k.hdr';

/** Collect every request path the page makes, so we can assert on the heavy ones. */
const trackRequests = (page: import('@playwright/test').Page) => {
  const urls: string[] = [];
  page.on('request', (req) => urls.push(req.url()));
  return urls;
};

test.describe('Chemistry hero performance budget', () => {
  test('mobile viewport never downloads the 1.6 MB HDRI', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const urls = trackRequests(page);

    await page.goto(PRODUCT_WITH_3D);
    // The static fallback is what a phone should keep showing.
    await expect(page.getByText('Loading interactive molecule')).toBeVisible();
    // Generous settle window: the old code preloaded the HDRI on hydration and
    // prefetched the 3D chunk on a 300 ms idle callback, so anything eager
    // would have fired well inside this.
    await page.waitForTimeout(4000);

    expect(urls.filter((u) => u.includes(HDRI)), 'HDRI must not load on mobile').toHaveLength(0);
    await context.close();
  });

  test('prefers-reduced-motion never downloads the 1.6 MB HDRI', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const urls = trackRequests(page);

    await page.goto(PRODUCT_WITH_3D);
    await expect(page.getByText('Loading interactive molecule')).toBeVisible();
    await page.waitForTimeout(4000);

    expect(
      urls.filter((u) => u.includes(HDRI)),
      'HDRI must not load when the visitor asked for reduced motion',
    ).toHaveLength(0);
    await context.close();
  });

  test('product page still prerenders the static hero fallback', async ({ page }) => {
    await page.goto(PRODUCT_WITH_3D);
    // Present regardless of viewport: it is the server-rendered content, and
    // the 3D canvas only ever replaces it client-side on capable devices.
    await expect(page.getByText('Loading interactive molecule')).toBeVisible();
  });
});
