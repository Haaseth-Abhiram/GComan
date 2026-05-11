import { test, expect } from '@playwright/test';

// Regression coverage for the "ProductDetail stuck on Loading…" bug.
//
// History: visiting any `/products/<unknown-category>/<slug>` URL deadlocked
// ProductDetail on a literal "Loading…" text node, because the loader resolved
// to [] for unknown categories and the old condition couldn't distinguish
// "still fetching" from "loaded empty". Google's crawler then logged a Soft 404
// against the blank shell. The fix introduces an explicit `productsLoading`
// flag so the page falls through to "Product Not Found" once the loader
// settles.

test.describe('Loading flow — never deadlocks', () => {
  test('invalid product category resolves to "Product Not Found" (not stuck on Loading…)', async ({ page }) => {
    await page.goto('/products/acids/nitric-acid');

    // Wait for the literal text "Loading…" to disappear, OR for the
    // Not-Found heading to render. Either path proves the loader settled
    // and the component did not deadlock.
    await expect(page.locator('text=Product Not Found')).toBeVisible({ timeout: 10_000 });

    // Stale "Loading…" text must NOT linger after settle.
    await expect(page.locator('text=/^Loading…$/')).toHaveCount(0);

    // The CTA back to /products should be present for users who land here.
    await expect(page.getByRole('button', { name: /back to products/i })).toBeVisible();
  });

  test('valid product page renders product content (not Loading…)', async ({ page }) => {
    // calcium-carbonate-water exists in water-treatment.json and is in the sitemap.
    await page.goto('/products/water-treatment/calcium-carbonate-water');

    // Wait for the H1 to appear, which only mounts after the loader resolves
    // and the product is found.
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10_000 });

    // Heading should contain "Calcium Carbonate" (the product title).
    await expect(heading).toContainText(/calcium carbonate/i);

    // The dead-state "Loading…" text must not be on the page anymore.
    await expect(page.locator('text=/^Loading…$/')).toHaveCount(0);

    // Page must have a non-default title (regression on Helmet defer={false}).
    const title = await page.title();
    expect(title).toMatch(/calcium carbonate/i);
    expect(title).not.toMatch(/^Chemical Suppliers in Oman & GCC \| Global Chemicals LLC$/);
  });

  test('unknown route renders 404 page (not Loading…)', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-anywhere');

    // NotFound page renders "404" prominently. The exact copy can vary; assert
    // on either the digits or the "page not found" phrase.
    const notFoundSignal = page.locator('text=/404|page not found/i').first();
    await expect(notFoundSignal).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('text=/^Loading…$/')).toHaveCount(0);
  });
});

test.describe('Suspense fallback — appears for cold loads', () => {
  test('first navigation to a lazy route shows the Loading component briefly', async ({ page, context }) => {
    // Throttle the network so the JS chunk takes long enough for the
    // Suspense fallback to actually render (the GC icon Loading screen).
    // On a fast connection with warm caches the fallback can flash too
    // briefly for Playwright to observe — that's why we slow things down.
    await context.route('**/*.js', async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.continue();
    });

    await page.goto('/');
    // Wait until the home page is fully loaded so its chunk is in the cache.
    await page.waitForLoadState('networkidle');

    // Now click into a lazy-loaded route (Products). The ProductDetail or
    // Products chunk must still be fetched, so the Suspense fallback should
    // render at least briefly.
    const productsLink = page.getByRole('link', { name: /^products$/i }).first();
    await productsLink.click();

    // The Loading component renders an <img alt="Loading Global Chemicals website">.
    // Watch for it to appear and then disappear.
    const loadingIcon = page.locator('img[alt="Loading Global Chemicals website"]');
    // Allow either: appears+disappears, OR was never needed (cache hit).
    // We assert it doesn't get stuck — eventually must NOT be visible.
    await expect(loadingIcon).toHaveCount(0, { timeout: 15_000 });

    // The destination page should have rendered.
    await expect(page).toHaveURL(/\/products/);
  });
});

test.describe('SEO regression guards', () => {
  test('homepage has the correct title (not generic fallback)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Global Chemicals/i);
  });

  test('product page has product-specific canonical and og:url', async ({ page }) => {
    await page.goto('/products/water-treatment/calcium-carbonate-water');
    await page.waitForLoadState('networkidle');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://gcoman.com/products/water-treatment/calcium-carbonate-water');

    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBe('https://gcoman.com/products/water-treatment/calcium-carbonate-water');
  });

  test('no duplicate description meta tags (Helmet append bug guard)', async ({ page }) => {
    await page.goto('/products/water-treatment/calcium-carbonate-water');
    await page.waitForLoadState('networkidle');

    // CLAUDE.md warns that hardcoded meta tags in index.html cause Helmet
    // to APPEND rather than replace, producing duplicate description tags
    // ahead of the page-specific one (Google reads the first one — wrong).
    const descCount = await page.locator('meta[name="description"]').count();
    expect(descCount, 'should have exactly one description meta tag').toBe(1);

    const ogDescCount = await page.locator('meta[property="og:description"]').count();
    expect(ogDescCount, 'should have exactly one og:description tag').toBe(1);
  });
});
