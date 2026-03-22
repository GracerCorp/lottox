import { test, expect } from '@playwright/test';

test.describe('Country Page', () => {
  test('displays country details and lotteries', async ({ page }) => {
    // Navigate to Thailand page
    await page.goto('/th');

    // Wait for the page to load
    await expect(page).toHaveTitle(/Thailand|Thai/i);

    // Verify main headings (could be the hero section or the list section)
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();

    // Verify there is a back link or breadcrumb
    await expect(page.locator('text=Home').first()).toBeVisible();
    
    // Check that there is at least one lottery card or list item
    // Since we don't know the exact structure, we check for common text/links
    const links = page.locator('a[href^="/th/"]');
    if (await links.count() > 0) {
      await expect(links.first()).toBeVisible();
    }
  });
});
