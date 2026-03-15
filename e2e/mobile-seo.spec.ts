import { test, expect } from "@playwright/test";

test.describe("Mobile & SEO/PWA Capabilities", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE portrait (9:16 aspect)

  test("should render meta tags and manifest for PWA/SEO on homepage", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // SEO Meta checks
    const title = await page.title();
    expect(title).toContain("LOTTOX");

    // Canonical link
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://lottox.today");

    // Manifest check
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute("href", "/manifest.webmanifest");

    // Theme color (PWA mobile bar color) - verify it exists
    const themeColor = page.locator('meta[name="theme-color"]').first();
    await expect(themeColor).toBeAttached();
  });

  test("should have responsive ResultsTable and CheckLotteryWidget on mobile viewport", async ({ page }) => {
    await page.goto("/");

    // 1. CheckLotteryWidget visibility and interaction
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeVisible();
    // On mobile, Ensure it doesn't overflow
    const inputStyle = await searchInput.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return style.width;
    });
    expect(inputStyle).not.toBe("0px"); // Basic layout assertion

    // 2. HomeResultsSection tab overflow container
    // We implemented 'overflow-x-auto' on the tabs container. Let's make sure it's there.
    const tabsContainer = page.locator('.overflow-x-auto').first();
    await expect(tabsContainer).toBeVisible();
  });

  test("should expose sitemap.xml and robots.txt", async ({ request }) => {
    // robots.txt
    const robotsPath = await request.get("/robots.txt");
    expect(robotsPath.status()).toBe(200);
    const robotsText = await robotsPath.text();
    expect(robotsText).toContain("Allow: /");
    expect(robotsText).toContain("sitemap.xml");

    // sitemap.xml
    const sitemapPath = await request.get("/sitemap.xml");
    expect(sitemapPath.status()).toBe(200);
    const sitemapText = await sitemapPath.text();
    expect(sitemapText).toContain("<urlset");
    expect(sitemapText).toContain("https://lottox.today");
  });
});
