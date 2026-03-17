import { describe, expect, it } from "vitest";
import { getDictionary } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

describe("i18n", () => {
  it("returns English dictionary by default", async () => {
    const dict = await getDictionary("en");
    expect(dict).toBeDefined();
    expect(dict.hero.title).toBeDefined();
    expect(dict.hero.title.toLowerCase()).toContain("worldwide");
  });

  it("returns Thai dictionary for 'th'", async () => {
    const dict = await getDictionary("th");
    expect(dict).toBeDefined();
    expect(dict.hero.title).toBeDefined();
    // Thai title contains Thai characters
    expect(dict.hero.title).toMatch(/[ก-๙]/);
  });

  it("falls back to English for unknown language", async () => {
    const dict = await getDictionary("xx" as Language);
    expect(dict).toBeDefined();
    expect(dict.hero.title.toLowerCase()).toContain("worldwide");
  });

  it("dictionary has required keys", async () => {
    const dict = await getDictionary("en");

    // Hero section
    expect(dict.hero).toBeDefined();
    expect(dict.hero.title).toBeDefined();
    expect(dict.hero.subtitle).toBeDefined();

    // Common section
    expect(dict.common).toBeDefined();
    expect(dict.common.latestUpdate).toBeDefined();

    // Country list
    expect(dict.countryList).toBeDefined();
    expect(dict.countryList.title).toBeDefined();

    // Find by number (nested under common)
    expect(dict.common.findByNumber).toBeDefined();
  });

  it("both dictionaries have matching keys", async () => {
    const en = await getDictionary("en");
    const th = await getDictionary("th");

    // Top-level keys should match
    const enKeys = Object.keys(en);
    const thKeys = Object.keys(th);
    expect(enKeys.sort()).toEqual(thKeys.sort());
  });
});
