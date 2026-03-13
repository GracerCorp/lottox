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

// 2. Mock prisma
const mockFindMany = vi.fn();
const mockCount = vi.fn();
const mockTransaction = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    lottery_results: {
      findMany: (...args: any) => mockFindMany(...args),
      count: (...args: any) => mockCount(...args),
    },
    lotteries: { count: vi.fn() },
    countries: { count: vi.fn() },
    $transaction: (...args: any) => mockTransaction(...args),
  },
}));

// 3. Import service
import { statisticsService } from "@/lib/services/statisticsService";

describe("statisticsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStatsOverview", () => {
    it("returns correct overview stats", async () => {
      mockTransaction.mockResolvedValue([100, 10, 3]);
      const result = await statisticsService.getStatsOverview();
      expect(result).toEqual({
        totalJackpotsTracked: "100",
        activeLotteries: 10,
        upcomingDraws24h: 0,
        totalCountries: 3,
      });
    });
  });

  describe("getStatsFrequency", () => {
    it("resolves dynamic country code", async () => {
      mockFindMany.mockResolvedValue([]);
      await statisticsService.getStatsFrequency("thai");
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            lottery: { countries: { code: "th" } },
          }),
        }),
      );
    });

    it("handles new dynamic country code", async () => {
      mockFindMany.mockResolvedValue([]);
      await statisticsService.getStatsFrequency("au");
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            lottery: { countries: { code: "au" } },
          }),
        }),
      );
    });

    it("extracts data and builds frequencies correctly", async () => {
      mockFindMany.mockResolvedValue([
        {
          full_data: null,
          draw_date: "2024-01-01",
          result_verifications_result_verifications_lottery_result_idTolottery_results: [
            { chosen_data: { number: "12345" } },
          ],
        },
        {
          full_data: { numbers: ["67890", "11111"] },
          draw_date: "2024-01-02",
          result_verifications_result_verifications_lottery_result_idTolottery_results: [],
        },
      ]);
      const result = await statisticsService.getStatsFrequency("thai", 10);
      expect(result.frequency["45"]).toBe(1);
      expect(result.frequency["90"]).toBe(1);
      expect(result.frequency["11"]).toBe(1);
    });
  });
});
