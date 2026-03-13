import { describe, it, expect, vi, beforeEach } from "vitest";

// 1. Mock countryResolver first
vi.mock("@/lib/utils/countryResolver", () => {
  return {
    resolveCountryCode: vi.fn(async (input: string) => {
      const mockMap: Record<string, string | null> = {
        thai: "th",
        th: "th",
        au: "au",
        nonsense: null,
      };
      return mockMap[input.toLowerCase()] || null;
    }),
    getDisplayType: vi.fn((code: string) => code.toUpperCase()),
  };
});

// 2. Mock prisma simply
const mockFindMany = vi.fn();
const mockFindFirst = vi.fn();
const mockTransaction = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    lottery_results: {
      findMany: (...args: any) => mockFindMany(...args),
      findFirst: (...args: any) => mockFindFirst(...args),
      count: vi.fn(),
    },
    $transaction: (...args: any) => mockTransaction(...args),
  },
}));

// 3. Import service
import { apiClient } from "@/lib/services/lotteryResultService";

describe("lotteryResultService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLatestResults", () => {
    it("fetches results for a known legacy type (thai -> th)", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: 1,
          draw_date: "2024-01-01",
          lottery: { countries: { code: "th" }, name: "Thai Lottery" },
        },
      ]);

      const result = await apiClient.getLatestResults("thai");

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            lottery: {
              countries: { code: { equals: "th", mode: "insensitive" } },
            },
          }),
        }),
      );

      expect(result.results).toHaveLength(1);
      expect(result.results[0].type).toBe("TH");
    });

    it("fetches results for a new country code directly (au)", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: 2,
          draw_date: "2024-01-02",
          lottery: { countries: { code: "au" }, name: "Aussie Lottery" },
        },
      ]);

      const result = await apiClient.getLatestResults("au");
      expect(result.results[0].type).toBe("AU");
    });
  });

  describe("getResultsByType", () => {
    it("handles legacy type via resolveCountryCode", async () => {
      mockTransaction.mockResolvedValue([
        1,
        [
          {
            id: 1,
            draw_date: "2024-01-01",
            lottery: { countries: { code: "th" } },
          },
        ],
      ]);

      const result = await apiClient.getResultsByType("thai");

      expect(mockTransaction).toHaveBeenCalled();
      expect(result.total).toBe(1);
      expect(result.latest?.type).toBe("TH");
    });
  });
});
