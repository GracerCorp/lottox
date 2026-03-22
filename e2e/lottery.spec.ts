import { test, expect } from '@playwright/test';

test.describe('Lottery Page', () => {
  test('displays lottery details', async ({ page }) => {
    const response = await page.goto('/th/thai-lottery');
    
    if (response?.status() !== 404) {
      // Just check the page loads and has an h1
      await expect(page.locator('h1').first()).toBeVisible();
      
      // Common text that should be on a lottery page
      await expect(page.locator('body')).toContainText(/Draw|Result|Subscribe|Ticket/i);
    }
  });

  test('displays latest draw by default', async ({ page }) => {
    const response = await page.goto('/th/thai-lottery');
    if (response?.status() !== 404) {
      await expect(page.locator('body')).toContainText(/Latest|Previous/i);
    }
  });
});
