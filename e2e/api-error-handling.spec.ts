import { test, expect } from "@playwright/test";

test.describe("API Error Handling", () => {
  test("should not leak internal errors on /api/countries", async ({ request }) => {
    // We can't easily force a DB error from E2E, but we can test the response shape is safe
    const res = await request.get("/api/countries");
    const json = await res.json();
    
    // It should either succeed or fail safely, never leaking Prisma
    if (!res.ok()) {
      expect(json.error).toBe("Internal Server Error");
      expect(JSON.stringify(json)).not.toContain("prisma");
    }
  });

  test("should not leak internal errors on /api/statistics", async ({ request }) => {
    const res = await request.get("/api/statistics?type=overview");
    const json = await res.json();
    
    if (!res.ok()) {
      expect(json.error).toBe("Internal Server Error");
      expect(JSON.stringify(json)).not.toContain("prisma");
    }
  });

  test("should not leak internal errors on /api/results/global", async ({ request }) => {
    const res = await request.get("/api/results/global");
    const json = await res.json();
    
    if (!res.ok()) {
      expect(json.error).toBe("Internal Server Error");
      expect(JSON.stringify(json)).not.toContain("prisma");
    }
  });
});
