import { describe, it, expect } from "vitest";
import {
  createMockCountry,
  createMockLottery,
  createMockLotteryResult,
  createMockArticle,
  createMockBanner,
} from "./fixtures";

describe("Prisma Fixture Factories", () => {
  it("should create a default country with correct shape", () => {
    const country = createMockCountry();
    expect(country.id).toBe(1);
    expect(country.code).toBe("th");
    expect(country.is_active).toBe(true);
  });

  it("should allow partial overrides", () => {
    const country = createMockCountry({ name: "Laos", code: "la" });
    expect(country.name).toBe("Laos");
    expect(country.code).toBe("la");
  });

  it("should create a valid lottery result", () => {
    const result = createMockLotteryResult({ draw_date: "2024-02-16", draw_period: "2/2567" });
    expect(result.draw_date).toBe("2024-02-16");
    expect(result.draw_period).toBe("2/2567");
    expect(result.id).toBeTypeOf("number");
  });

  it("should create valid article and banner factories", () => {
    const article = createMockArticle();
    expect(article.slug).toBe("test-article");
    
    const banner = createMockBanner();
    expect(banner.image_url).toBe("https://example.com/banner.png");
  });
});
