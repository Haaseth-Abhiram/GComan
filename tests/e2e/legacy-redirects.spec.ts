import { test, expect } from '@playwright/test';

// The live site is served by Lovable's CDN (no server-side redirects), so
// legacy WordPress-era URLs are redirected client-side by
// <LegacyRedirectHandler> (src/App.tsx + src/lib/legacyRedirects.ts).
// These tests pin the layer that actually fires in production.

test.describe('Legacy URL redirects — client-side', () => {
  test('old service URL redirects to new product page', async ({ page }) => {
    await page.goto('/service/calcium-carbonate/');
    await page.waitForURL('**/products/water-treatment/calcium-carbonate-water');
    expect(new URL(page.url()).pathname).toBe('/products/water-treatment/calcium-carbonate-water');
  });

  test('old service URL redirects to glycols category page', async ({ page }) => {
    await page.goto('/service/glycols/');
    await page.waitForURL('**/products/glycols');
    expect(new URL(page.url()).pathname).toBe('/products/glycols');
  });

  test('old product category URL redirects (would otherwise match live route pattern)', async ({ page }) => {
    await page.goto('/products/alkalis/caustic-soda');
    await page.waitForURL('**/products/water-treatment/caustic-soda-flakes');
    expect(new URL(page.url()).pathname).toBe('/products/water-treatment/caustic-soda-flakes');
  });

  test('date-archive prefix catch-all redirects to blog', async ({ page }) => {
    await page.goto('/2021/06/some-unknown-post');
    await page.waitForURL('**/blog');
    expect(new URL(page.url()).pathname).toBe('/blog');
  });

  test('legacy company page redirects to about', async ({ page }) => {
    await page.goto('/company');
    await page.waitForURL('**/about');
    expect(new URL(page.url()).pathname).toBe('/about');
  });

  test('trailing slash normalizes to canonical no-slash URL', async ({ page }) => {
    await page.goto('/career/');
    await page.waitForURL(url => new URL(url).pathname === '/career');
    expect(new URL(page.url()).pathname).toBe('/career');
  });

  test('normal routes are not affected', async ({ page }) => {
    await page.goto('/products/water-treatment/caustic-soda-flakes');
    // Give the redirect handler a tick; the URL must remain unchanged.
    await page.waitForLoadState('networkidle');
    expect(new URL(page.url()).pathname).toBe('/products/water-treatment/caustic-soda-flakes');
  });
});

test.describe('/chemicals hub', () => {
  test('bare /chemical-supplier redirects to the delivery-locations hub', async ({ page }) => {
    await page.goto('/chemical-supplier');
    await page.waitForURL('**/chemicals');
    expect(new URL(page.url()).pathname).toBe('/chemicals');
  });

  test('retired /chemicals/khasab redirects to the Oman hub (was a GSC soft 404)', async ({ page }) => {
    await page.goto('/chemicals/khasab');
    await page.waitForURL('**/chemical-suppliers-oman');
    expect(new URL(page.url()).pathname).toBe('/chemical-suppliers-oman');
  });

  test('/chemicals renders the hub with all city + country links', async ({ page }) => {
    await page.goto('/chemicals');
    await expect(page.locator('h1')).toContainText('Chemical Supply Across Oman');
    // 22 city cards + 4 country-hub heading links (UAE, Saudi Arabia, Qatar, Kuwait)
    const links = page.locator('main a[href^="/chemicals/"]');
    expect(await links.count()).toBe(26);
    await expect(page.locator('main a[href="/chemicals/saudi-arabia"]')).toHaveCount(1);
    await expect(page.locator('main a[href="/chemicals/uae"]')).toHaveCount(1);
    await expect(page.locator('main a[href="/chemicals/qatar"]')).toHaveCount(1);
    await expect(page.locator('main a[href="/chemicals/kuwait"]')).toHaveCount(1);
  });

  test('the Qatar and Kuwait country hubs render (not the 404 page)', async ({ page }) => {
    await page.goto('/chemicals/qatar');
    await expect(page.locator('h1').first()).toContainText(/Qatar/);
    await page.goto('/chemicals/kuwait');
    await expect(page.locator('h1').first()).toContainText(/Kuwait/);
  });

  test('/chemical-supplier/caustic-soda-oman still resolves (must not be caught by the bare redirect)', async ({ page }) => {
    await page.goto('/chemical-supplier/caustic-soda-oman');
    await expect(page.locator('h1').first()).not.toHaveText(/404/);
    expect(new URL(page.url()).pathname).toBe('/chemical-supplier/caustic-soda-oman');
  });
});
