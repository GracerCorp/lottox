import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('has title and main sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Lotto X|Lotto|Lottery/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('can navigate to country page', async ({ page }) => {
    await page.goto('/');
    
    const countryLink = page.locator('a[href^="/th"]').first();
    if (await countryLink.count() > 0) {
      await countryLink.click();
      // Thailand country page uses "Government Lottery (GLO)" or "Thailand"
      await expect(page.locator('h1').first()).toBeVisible();
      // Ensure the page loads without 404
      expect(page.url()).toContain('/th');
    }
  });
});
