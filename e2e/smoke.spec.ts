import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("should load the homepage and contain LOTTOX in the title", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/LOTTOX/i);
  });

  test("should display the hero section", async ({ page }) => {
    await page.goto("/");
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
  });
});
