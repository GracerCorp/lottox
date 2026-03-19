import { typography, fontSizeScale } from "../typographyUtils";

describe("typographyUtils", () => {
  describe("typography semantic map", () => {
    it("should export a pageTitle class string", () => {
      expect(typography.pageTitle).toBeDefined();
      expect(typography.pageTitle).toContain("text-fs-5xl");
      expect(typography.pageTitle).toContain("font-bold");
    });

    it("should export a sectionTitle class string", () => {
      expect(typography.sectionTitle).toBeDefined();
      expect(typography.sectionTitle).toContain("text-fs-2xl");
      expect(typography.sectionTitle).toContain("font-bold");
    });

    it("should export a cardTitle class string", () => {
      expect(typography.cardTitle).toBeDefined();
      expect(typography.cardTitle).toContain("text-fs-base");
      expect(typography.cardTitle).toContain("font-bold");
    });

    it("should export a body class string", () => {
      expect(typography.body).toBeDefined();
      expect(typography.body).toContain("text-fs-sm");
    });

    it("should export a bodyLarge class string", () => {
      expect(typography.bodyLarge).toBeDefined();
      expect(typography.bodyLarge).toContain("text-fs-base");
    });

    it("should export a muted class string", () => {
      expect(typography.muted).toBeDefined();
      expect(typography.muted).toContain("text-fs-xs");
    });

    it("should export a label class string with uppercase tracking", () => {
      expect(typography.label).toBeDefined();
      expect(typography.label).toContain("text-fs-badge");
      expect(typography.label).toContain("uppercase");
      expect(typography.label).toContain("tracking-wide");
    });

    it("should export prizeMain class string", () => {
      expect(typography.prizeMain).toBeDefined();
      expect(typography.prizeMain).toContain("text-fs-prize");
      expect(typography.prizeMain).toContain("font-black");
    });

    it("should export prizeSub class string", () => {
      expect(typography.prizeSub).toBeDefined();
      expect(typography.prizeSub).toContain("text-fs-lg");
      expect(typography.prizeSub).toContain("font-bold");
    });

    it("should export badge class string", () => {
      expect(typography.badge).toBeDefined();
      expect(typography.badge).toContain("text-fs-badge");
      expect(typography.badge).toContain("font-semibold");
    });

    it("should export subHeading class string", () => {
      expect(typography.subHeading).toBeDefined();
      expect(typography.subHeading).toContain("text-fs-xl");
      expect(typography.subHeading).toContain("font-semibold");
    });

    it("should export heroTitle class string", () => {
      expect(typography.heroTitle).toBeDefined();
      expect(typography.heroTitle).toContain("text-fs-4xl");
      expect(typography.heroTitle).toContain("font-black");
    });

    it("should have all keys be non-empty strings", () => {
      Object.entries(typography).forEach(([key, value]) => {
        expect(typeof value).toBe("string");
        expect(value.length).toBeGreaterThan(0);
        expect(value.trim()).toBe(value); // no leading/trailing whitespace
      });
    });
  });

  describe("fontSizeScale", () => {
    const expectedTokens = [
      "xs",
      "sm",
      "base",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
      "5xl",
      "prize",
      "badge",
    ];

    it("should export all expected font size tokens", () => {
      expectedTokens.forEach((token) => {
        expect(fontSizeScale).toHaveProperty(token);
      });
    });

    it("should map every token to a text-fs-* class", () => {
      Object.entries(fontSizeScale).forEach(([key, className]) => {
        expect(className).toBe(`text-fs-${key}`);
      });
    });

    it("should have exactly 11 entries", () => {
      expect(Object.keys(fontSizeScale)).toHaveLength(11);
    });
  });
});
