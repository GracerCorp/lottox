import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("manifest()", () => {
  it("should return a valid web app manifest object", () => {
    const result = manifest();
    expect(result).toBeDefined();
    expect(result.name).toBe("LOTTOX - Worldwide Lottery Results");
    expect(result.short_name).toBe("LOTTOX");
    expect(result.display).toBe("standalone");
    expect(result.theme_color).toBe("#f59e0b");
    expect(Array.isArray(result.icons)).toBe(true);
    expect(result.icons?.[0]?.src).toBe("/logo.png");
  });
});
