import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma before importing the module under test
vi.mock("@/lib/prisma", () => ({
  prisma: {
    countries: {
      findFirst: vi.fn(),
    },
  },
}));

import {
  resolveCountryCode,
  getDisplayType,
  _legacyAliases,
} from "@/lib/utils/countryResolver";
import { prisma } from "@/lib/prisma";

const mockFindFirst = vi.mocked(prisma.countries.findFirst);

describe("countryResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("resolveCountryCode", () => {
    it("resolves legacy alias 'thai' to 'th'", async () => {
      const result = await resolveCountryCode("thai");
      expect(result).toBe("th");
      // Should NOT hit DB for a legacy alias
      expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it("resolves legacy alias 'lao' to 'la'", async () => {
      const result = await resolveCountryCode("lao");
      expect(result).toBe("la");
      expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it("resolves legacy alias 'laos' to 'la'", async () => {
      const result = await resolveCountryCode("laos");
      expect(result).toBe("la");
    });

    it("resolves legacy alias 'vietnam' to 'vn'", async () => {
      const result = await resolveCountryCode("vietnam");
      expect(result).toBe("vn");
    });

    it("resolves legacy alias 'government-lottery-office-glo' to 'th'", async () => {
      const result = await resolveCountryCode("government-lottery-office-glo");
      expect(result).toBe("th");
    });

    it("resolves legacy alias 'lao-development' to 'la'", async () => {
      const result = await resolveCountryCode("lao-development");
      expect(result).toBe("la");
    });

    it("resolves direct country code 'th' via legacy map", async () => {
      // 'th' is not in LEGACY_ALIASES, so it falls through to DB lookup
      mockFindFirst.mockResolvedValue({ code: "th" } as any);
      const result = await resolveCountryCode("th");
      expect(result).toBe("th");
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          code: { equals: "th", mode: "insensitive" },
          is_active: true,
        },
        select: { code: true },
      });
    });

    it("resolves a new country code 'au' from DB", async () => {
      mockFindFirst.mockResolvedValue({ code: "au" } as any);
      const result = await resolveCountryCode("au");
      expect(result).toBe("au");
      expect(mockFindFirst).toHaveBeenCalled();
    });

    it("returns null for unknown type not in DB", async () => {
      mockFindFirst.mockResolvedValue(null);
      const result = await resolveCountryCode("nonsense");
      expect(result).toBeNull();
    });

    it("handles case-insensitive input", async () => {
      const result = await resolveCountryCode("THAI");
      expect(result).toBe("th");
    });

    it("handles whitespace in input", async () => {
      const result = await resolveCountryCode("  thai  ");
      expect(result).toBe("th");
    });

    it("handles empty string", async () => {
      mockFindFirst.mockResolvedValue(null);
      const result = await resolveCountryCode("");
      expect(result).toBeNull();
    });
  });

  describe("getDisplayType", () => {
    it("returns uppercase country code", () => {
      expect(getDisplayType("th")).toBe("TH");
      expect(getDisplayType("la")).toBe("LA");
      expect(getDisplayType("vn")).toBe("VN");
      expect(getDisplayType("au")).toBe("AU");
    });
  });

  describe("_legacyAliases", () => {
    it("contains all expected legacy aliases", () => {
      expect(_legacyAliases).toHaveProperty("thai", "th");
      expect(_legacyAliases).toHaveProperty("lao", "la");
      expect(_legacyAliases).toHaveProperty("laos", "la");
      expect(_legacyAliases).toHaveProperty("vietnam", "vn");
    });
  });
});
