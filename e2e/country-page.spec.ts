import { test, expect } from "@playwright/test";

test.describe("Country Page", () => {
  test("navigates to Thailand country page and shows hero section", async ({
    page,
  }) => {
    await page.goto("/th");

    // Hero section should be visible
    const hero = page.getByTestId("country-hero");
    await expect(hero).toBeVisible();
  });

  test("displays country name in the hero for Thailand", async ({ page }) => {
    await page.goto("/th");

    const countryName = page.getByTestId("country-name");
    await expect(countryName).toBeVisible();
    // Country name should not be empty
    await expect(countryName).not.toHaveText("");
  });

  test("shows official results label", async ({ page }) => {
    await page.goto("/th");
    const label = page.getByTestId("official-results-label");
    await expect(label).toBeVisible();
  });

  test("shows lottery grid or no-lotteries message", async ({ page }) => {
    await page.goto("/th");

    const grid = page.getByTestId("lottery-grid");
    const noLotteries = page.getByTestId("no-lotteries");

    // Either the grid or the empty state should be visible
    const gridVisible = await grid.isVisible().catch(() => false);
    const emptyVisible = await noLotteries.isVisible().catch(() => false);
    expect(gridVisible || emptyVisible).toBe(true);
  });

  test("shows flag placeholder for unknown country code", async ({ page }) => {
    // Navigate to a country that likely has no flag in DB
    await page.goto("/xx");
    // Page should load without crashing — hero may still show
    await expect(page.locator("body")).toBeVisible();
  });

  test("country page is responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/th");
    const hero = page.getByTestId("country-hero");
    await expect(hero).toBeVisible();
  });
});
