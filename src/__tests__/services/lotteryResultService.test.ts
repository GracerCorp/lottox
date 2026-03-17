import { describe, it, expect, vi, beforeEach } from "vitest";

// 1. Mock countryResolver first
vi.mock("@/lib/utils/countryResolver", () => {
  return {
    resolveCountryCode: vi.fn(async (input: string) => {
      const mockMap: Record<string, string | null> = {
        thai: "th",
        th: "th",
        glo: "th",
        lao: "la",
        la: "la",
        au: "au",
        all: null,
        nonsense: null,
      };
      return mockMap[input.toLowerCase()] ?? null;
    }),
    getDisplayType: vi.fn((code: string) => code.toUpperCase()),
  };
});

// 2. Mock prisma
const mockFindMany = vi.fn();
const mockFindFirst = vi.fn();
const mockTransaction = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    lotteries: {
      findMany: (...args: any) => mockFindMany(...args),
    },
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeLotteryRow = (overrides = {}) => ({
  id: 1,
  draw_date: "2025-01-16",
  draw_period: "1",
  lottery_id: 1,
  full_data: {},
  lottery: { countries: { code: "th" }, name: "Thai Lottery" },
  ...overrides,
});

describe("lotteryResultService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── getLatestResults ──────────────────────────────────────────────────────

  describe("getLatestResults", () => {
    it("fetches results for a known legacy type (thai → th)", async () => {
      mockFindMany.mockResolvedValue([makeLotteryRow()]);

      const result = await apiClient.getLatestResults("thai");

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            lottery: {
              countries: { code: { equals: "th", mode: "insensitive" } },
            },
          }),
        })
      );

      expect(result.results).toHaveLength(1);
      expect(result.results[0].type).toBe("TH");
    });

    it("fetches results for a new country code directly (au)", async () => {
      mockFindMany.mockResolvedValue([makeLotteryRow({ lottery: { countries: { code: "au" }, name: "Aus Lottery" } })]);

      const result = await apiClient.getLatestResults("au");
      expect(result.results[0].type).toBe("AU");
    });

    it("returns empty results array when no DB rows", async () => {
      mockFindMany.mockResolvedValue([]);
      const result = await apiClient.getLatestResults("la");
      expect(result.results).toHaveLength(0);
    });
  });

  // ─── getResultsByType ──────────────────────────────────────────────────────

  describe("getResultsByType", () => {
    it("handles legacy type via resolveCountryCode", async () => {
      mockTransaction.mockResolvedValue([
        1,
        [makeLotteryRow()],
      ]);

      const result = await apiClient.getResultsByType("thai");

      expect(mockTransaction).toHaveBeenCalled();
      expect(result.total).toBe(1);
      expect(result.latest?.type).toBe("TH");
    });

    it("returns total 0 and no latest when empty", async () => {
      mockTransaction.mockResolvedValue([0, []]);
      const result = await apiClient.getResultsByType("la");
      expect(result.total).toBe(0);
      expect(result.latest).toBeNull();
    });
  });

  // ─── checkNumber ───────────────────────────────────────────────────────────

  describe("checkNumber", () => {
    // Simulate lotteries.findMany (first call) then lottery_results.findMany (second call)
    function mockCheckSequence(lotteries: any[], results: any[]) {
      mockFindMany
        .mockResolvedValueOnce(lotteries) // lotteries.findMany
        .mockResolvedValueOnce(results);  // lottery_results.findMany
    }

    it("returns win=false when no active lotteries found", async () => {
      mockFindMany.mockResolvedValue([]);  // empty lotteries
      const result = await apiClient.checkNumber("123456", "nonsense");
      expect(result).toMatchObject({ win: false });
    });

    it("detects match in GLO prizes array format", async () => {
      const gloData = {
        prizes: [
          {
            prizeName: "1st Prize",
            category: "prize_1",
            prizeAmount: "6000000",
            winningNumbers: ["833009"],
          },
        ],
      };

      mockCheckSequence(
        [{ id: 1 }],                                     // one active lottery
        [{ id: 10, draw_date: "2025-01-16", draw_period: "1", lottery_id: 1, full_data: gloData }]
      );

      const result = await apiClient.checkNumber("833009", "glo");
      expect(result.win).toBe(true);
      expect(result.prizes).toHaveLength(1);
      expect(result.prizes![0].label).toMatch(/1st prize/i);
    });

    it("returns win=false for a non-matching number in prizes array", async () => {
      const gloData = {
        prizes: [
          {
            prizeName: "1st Prize",
            prizeAmount: "6000000",
            winningNumbers: ["833009"],
          },
        ],
      };

      mockCheckSequence([{ id: 1 }], [
        { id: 10, draw_date: "2025-01-16", draw_period: "1", lottery_id: 1, full_data: gloData },
      ]);

      const result = await apiClient.checkNumber("000000", "glo");
      expect(result.win).toBe(false);
    });

    it("detects match in flat prizeResult format (Lao Lotto style)", async () => {
      const laoData = {
        prizeResult: {
          last4Prize: "6315",
          last3Prize1: "315",
          last3Prize2: "215",
          last2Prize: "15",
        },
      };

      mockCheckSequence([{ id: 2 }], [
        { id: 20, draw_date: "2025-01-16", draw_period: "13", lottery_id: 2, full_data: laoData },
      ]);

      const result = await apiClient.checkNumber("6315", "lao");
      expect(result.win).toBe(true);
      expect(result.prizes!.length).toBeGreaterThan(0);
    });

    it("matches 2-digit and 3-digit prizes in flat format", async () => {
      const laoData = {
        prizeResult: {
          last4Prize: "6315",
          last3Prize1: "315",
          last2Prize: "15",
        },
      };

      mockCheckSequence([{ id: 2 }], [
        { id: 20, draw_date: "2025-01-16", draw_period: "13", lottery_id: 2, full_data: laoData },
      ]);

      const twoDigitResult = await apiClient.checkNumber("15", "lao");
      expect(twoDigitResult.win).toBe(true);
    });

    it("deduplicates — only returns the latest result per lottery", async () => {
      const gloData = {
        prizes: [
          { prizeName: "Consolation", prizeAmount: "50000", winningNumbers: ["111111"] },
        ],
      };

      // Two rows for the same lottery_id=1, different dates — should only keep the latest
      mockCheckSequence([{ id: 1 }], [
        { id: 10, draw_date: "2025-01-16", draw_period: "1", lottery_id: 1, full_data: gloData },
        { id: 9, draw_date: "2025-01-01", draw_period: "1", lottery_id: 1, full_data: gloData },
      ]);

      const result = await apiClient.checkNumber("111111", "glo");
      // Should still win (from latest row)
      expect(result.win).toBe(true);
    });

    it("returns win=false when lottery has results but full_data is null", async () => {
      mockCheckSequence([{ id: 3 }], [
        { id: 30, draw_date: "2025-01-16", draw_period: "1", lottery_id: 3, full_data: null },
      ]);

      const result = await apiClient.checkNumber("123456", "glo");
      expect(result.win).toBe(false);
    });

    it("filters by drawDate when provided", async () => {
      const gloData = {
        prizes: [{ prizeName: "2nd Prize", prizeAmount: "200000", winningNumbers: ["555555"] }],
      };

      mockCheckSequence([{ id: 1 }], [
        { id: 11, draw_date: "2025-06-01", draw_period: "1", lottery_id: 1, full_data: gloData },
      ]);

      const result = await apiClient.checkNumber("555555", "glo", "2025-06-01");

      // Verify second findMany was called with draw_date constraint
      expect(mockFindMany).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          where: expect.objectContaining({ draw_date: "2025-06-01" }),
        })
      );
      expect(result.win).toBe(true);
    });
  });
});
