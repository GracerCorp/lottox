import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock prisma at the top so it is in scope before any imports resolve
vi.mock("@/lib/prisma", () => ({
  prisma: {
    lotteries: {
      findMany: vi.fn(),
    },
  },
}));

// Import after mock setup
import { getLotteryCardData } from "@/lib/services/lotteryService";
import { prisma } from "@/lib/prisma";

const mockPrismaLotteries = vi.mocked(prisma.lotteries.findMany);

const makeLottery = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  name: "Government Lottery",
  currency: "THB",
  is_active: true,
  logo: null,
  country_id: 1,
  showing_prizes: [],
  prize_amount_mode: "fixed",
  default_prize_amounts: {},
  created_at: new Date(),
  updated_at: new Date(),
  countries: { code: "th", name: "Thailand", flag: "https://cdn/th.png", bg_image: null },
  lottery_jobs: [{ cron_schedule: "0 15 1,16 * *" }],
  lottery_results: [
    {
      draw_date: "2025-01-01",
      full_data: {
        prizes: [
          { prizeName: "1st Prize", prizeAmount: "6,000,000" },
          { prizeName: "2nd Prize", prizeAmount: "200,000" },
        ],
      },
      result_verifications_result_verifications_lottery_result_idTolottery_results:
        [],
    },
  ],
  ...overrides,
});

describe("getLotteryCardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when no lotteries found", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([]);
    const result = await getLotteryCardData("xx");
    expect(result).toEqual([]);
  });

  it("returns lottery card data with prizes from full_data", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([makeLottery()]);
    const result = await getLotteryCardData("th");
    expect(result).toHaveLength(1);
    const card = result[0];
    expect(card.name).toBe("Government Lottery");
    expect(card.currency).toBe("THB");
    expect(card.isActive).toBe(true);
    expect(card.countryCode).toBe("th");
    expect(card.countryName).toBe("Thailand");
    expect(card.flag).toBe("https://cdn/th.png");
    expect(card.prizes).toEqual([
      { label: "1st Prize", amount: "฿6,000,000" },
      { label: "2nd Prize", amount: "฿200,000" },
    ]);
  });

  it("returns null nextDrawDate when no matching job", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([
      makeLottery({ lottery_jobs: [] }),
    ]);
    const result = await getLotteryCardData("th");
    expect(result[0].nextDrawDate).toBeNull();
  });

  it("falls back gracefully when full_data has no prizes array", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([
      makeLottery({
        lottery_results: [
          {
            draw_date: "2025-01-01",
            full_data: { numbers: [1, 2, 3] },
            result_verifications_result_verifications_lottery_result_idTolottery_results:
              [],
          },
        ],
      }),
    ]);
    const result = await getLotteryCardData("th");
    expect(result[0].prizes).toEqual([]);
  });

  it("prefers verified chosen_data over raw full_data", async () => {
    const verifiedData = {
      prizes: [{ prizeName: "Jackpot", prizeAmount: "100,000,000" }],
    };
    mockPrismaLotteries.mockResolvedValueOnce([
      makeLottery({
        lottery_results: [
          {
            draw_date: "2025-01-01",
            full_data: {
              prizes: [{ prizeName: "Raw", prizeAmount: "1" }],
            },
            result_verifications_result_verifications_lottery_result_idTolottery_results:
              [{ chosen_data: verifiedData }],
          },
        ],
      }),
    ]);
    const result = await getLotteryCardData("th");
    expect(result[0].prizes[0].label).toBe("Jackpot");
    expect(result[0].prizes[0].amount).toBe("฿100,000,000");
  });

  it("builds correct href from countryCode and lottery name", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([
      makeLottery({ name: "Lao Lotto" }),
    ]);
    const result = await getLotteryCardData("la");
    expect(result[0].href).toBe("/la/lao-lotto");
  });

  // ── New tests for the zero-amount filter (AU Powerball fix) ──────────────

  it("skips prizes with prizeAmount of 0", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([
      makeLottery({
        currency: "AUD",
        countries: { code: "au", name: "Australia", flag: "https://cdn/au.png", bg_image: null },
        lottery_results: [
          {
            draw_date: "2025-01-01",
            full_data: {
              prizes: [
                { prizeName: "WINNING NUMBERS", prizeAmount: 0 },
                { prizeName: "POWERBALL",        prizeAmount: 0 },
              ],
            },
            result_verifications_result_verifications_lottery_result_idTolottery_results: [],
          },
        ],
      }),
    ]);
    const result = await getLotteryCardData("au");
    // All prizes were zero — should be filtered out, returning empty array
    expect(result[0].prizes).toEqual([]);
  });

  it("skips prizes with prizeAmount of '0' (string zero)", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([
      makeLottery({
        lottery_results: [
          {
            draw_date: "2025-01-01",
            full_data: {
              prizes: [
                { prizeName: "Bad Prize", prizeAmount: "0" },
                { prizeName: "Good Prize", prizeAmount: "500,000" },
              ],
            },
            result_verifications_result_verifications_lottery_result_idTolottery_results: [],
          },
        ],
      }),
    ]);
    const result = await getLotteryCardData("th");
    expect(result[0].prizes).toHaveLength(1);
    expect(result[0].prizes[0].label).toBe("Good Prize");
    expect(result[0].prizes[0].amount).toBe("฿500,000");
  });

  it("supports alternative field names: name + value", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([
      makeLottery({
        lottery_results: [
          {
            draw_date: "2025-01-01",
            full_data: {
              prizes: [
                { name: "Grand Prize", value: "1,000,000" },
              ],
            },
            result_verifications_result_verifications_lottery_result_idTolottery_results: [],
          },
        ],
      }),
    ]);
    const result = await getLotteryCardData("th");
    expect(result[0].prizes[0].label).toBe("Grand Prize");
    expect(result[0].prizes[0].amount).toBe("฿1,000,000");
  });

  it("supports alternative field name: jackpot", async () => {
    mockPrismaLotteries.mockResolvedValueOnce([
      makeLottery({
        lottery_results: [
          {
            draw_date: "2025-01-01",
            full_data: {
              prizes: [
                { category: "Jackpot Tier", jackpot: "2,500,000" },
              ],
            },
            result_verifications_result_verifications_lottery_result_idTolottery_results: [],
          },
        ],
      }),
    ]);
    const result = await getLotteryCardData("th");
    expect(result[0].prizes[0].label).toBe("Jackpot Tier");
    expect(result[0].prizes[0].amount).toBe("฿2,500,000");
  });
});
