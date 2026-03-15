import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots()", () => {
  it("should return valid robots.txt rules", () => {
    const result = robots();
    expect(result).toBeDefined();
    expect(result.rules).toBeDefined();
    if (result.rules && !Array.isArray(result.rules)) {
      expect(result.rules.userAgent).toBe("*");
      expect(result.rules.allow).toBe("/");
    }
    expect(result.sitemap).toBe("https://lottox.today/sitemap.xml");
  });
});
