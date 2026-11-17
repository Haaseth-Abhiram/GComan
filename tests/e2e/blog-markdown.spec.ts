import { test, expect } from '@playwright/test';

// Blog bodies are plain text, but seven posts use markdown bullets and **bold**.
// Until 2026-11-17 those shipped verbatim: the MEG-vs-DEG guide published
// "- Purity (GC): ≥99.8%" and 14 more spec bullets as <h2>s (and TOC entries),
// with literal asterisks in the text. Pins the renderer: bullets are real
// lists, **bold** is <strong> / an <h3> sub-heading, tables stay tables, and an
// edited post shows its real "Updated" date in the page and in JSON-LD.

const MEG_DEG = '/blog/meg-vs-deg-gas-dehydration-oman-gcc';
const SUPPLIERS = '/blog/top-chemical-suppliers-oman-2026';

test.describe('Blog markdown rendering', () => {
  test('bullets and bold render as lists and strong, never as headings or literal markup', async ({ page }) => {
    await page.goto(MEG_DEG);
    const article = page.locator('.prose').first();
    await expect(article.locator('h2').first()).toBeVisible();

    const h2s = await article.locator('h2').allInnerTexts();
    expect(h2s.length).toBeGreaterThan(5);
    for (const h of h2s) {
      expect(h, `heading "${h}" is a bullet or carries markdown`).not.toMatch(/^[-•]\s|\*\*/);
    }
    expect(await article.locator('ul > li').count()).toBeGreaterThan(15);
    expect(await article.locator('strong').count()).toBeGreaterThan(5);
    expect(await article.locator('h3').count()).toBeGreaterThanOrEqual(2);
    expect(await article.locator('table').count()).toBeGreaterThanOrEqual(2);
    expect(await article.innerText()).not.toContain('**');
  });

  test('an edited post opens with its answer, has question headings, tables and a real modified date', async ({ page }) => {
    await page.goto(SUPPLIERS);
    const article = page.locator('.prose').first();
    await expect(article.locator('p').first()).toContainText('registered on JSRS');
    const h2s = await article.locator('h2').allInnerTexts();
    expect(h2s.filter((h) => h.trim().endsWith('?')).length).toBeGreaterThanOrEqual(5);
    expect(await article.locator('table').count()).toBe(2);
    await expect(page.getByText(/Updated November 17, 2026/)).toBeVisible();

    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const posting = ld.find((t) => t.includes('"BlogPosting"')) ?? '';
    expect(posting).toContain('"datePublished":"2026-02-15');
    expect(posting).toContain('"dateModified":"2026-11-17');
  });
});
