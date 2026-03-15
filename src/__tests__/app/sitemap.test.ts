import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    countries: {
      findMany: vi.fn().mockResolvedValue([
        {
          code: "TH",
          name: "Thailand",
          lotteries: [
            { name: "Thai Government Lottery" }
          ]
        }
      ])
    },
    lottery_results: {
      findMany: vi.fn().mockResolvedValue([
        {
          draw_date: new Date("2023-12-01"),
          updated_at: new Date("2023-12-02"),
          lottery: {
            name: "Thai Government Lottery",
            countries: { code: "TH" }
          }
        },
        {
          draw_date: "2023-11-16T00:00:00.000Z",
          lottery: {
            name: "Thai Government Lottery",
            countries: { code: "th" }
          }
        },
        {
          draw_date: "2023-11-01",
          lottery: {
            name: "Thai Government Lottery",
            countries: { code: "TH" }
          }
        }
      ])
    }
  }
}));

describe("sitemap()", () => {
  it("should generate a proper sitemap array", async () => {
    const result = await sitemap();
    
    // Check static routes
    expect(result.some(r => r.url === "https://lottox.today/")).toBe(true);
    expect(result.some(r => r.url === "https://lottox.today/results")).toBe(true);

    // Check dynamic country and lottery routes
    expect(result.some(r => r.url === "https://lottox.today/th")).toBe(true);
    expect(result.some(r => r.url === "https://lottox.today/th/thai-government-lottery")).toBe(true);

    // Check dynamic results routes
    expect(result.some(r => r.url === "https://lottox.today/th/thai-government-lottery/2023-12-01")).toBe(true);
    expect(result.some(r => r.url === "https://lottox.today/th/thai-government-lottery/2023-11-16")).toBe(true);
    expect(result.some(r => r.url === "https://lottox.today/th/thai-government-lottery/2023-11-01")).toBe(true);
    
    // Assert length includes the static items + dynamic items
    // 9 static + 1 country + 1 lottery + 3 dates = 14
    expect(result.length).toBe(14);
  });
});
