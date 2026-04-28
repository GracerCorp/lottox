import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/results/upcoming/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    lotteries: {
      findMany: vi.fn(),
    },
  },
}));

const mockLotteries = [
  {
    id: 1,
    name: "Government Lottery (GLO)",
    is_active: true,
    countries: { code: "TH", name: "Thailand" },
  },
  {
    id: 2,
    name: "Lao Lotto",
    is_active: true,
    countries: { code: "LA", name: "Laos" },
  },
];

function makeRequest(params = "") {
  return new NextRequest(`http://localhost/api/results/upcoming${params}`);
}

describe("GET /api/results/upcoming", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns upcoming draws with nextDrawAt as ISO string", async () => {
    vi.mocked(prisma.lotteries.findMany).mockResolvedValue(mockLotteries as never);
    const response = await GET(makeRequest());
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("upcoming");
    expect(data.upcoming).toHaveLength(2);
    expect(data.upcoming[0].name).toBe("Government Lottery (GLO)");
    expect(data.upcoming[0].countryCode).toBe("th");
    expect(new Date(data.upcoming[0].nextDrawAt).getTime()).toBeGreaterThan(Date.now() - 1000);
  });

  it("respects limit query parameter", async () => {
    vi.mocked(prisma.lotteries.findMany).mockResolvedValue([mockLotteries[0]] as never);
    const response = await GET(makeRequest("?limit=1"));
    await response.json();
    expect(response.status).toBe(200);
    expect(prisma.lotteries.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 1 }),
    );
  });

  it("returns 400 for invalid limit", async () => {
    const response = await GET(makeRequest("?limit=abc"));
    expect(response.status).toBe(400);
  });

  it("returns 500 on prisma error", async () => {
    vi.mocked(prisma.lotteries.findMany).mockRejectedValue(new Error("DB failure"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await GET(makeRequest());
    expect(response.status).toBe(500);
    consoleSpy.mockRestore();
  });

  it("each upcoming draw has nextDrawAt in the future or same day", async () => {
    vi.mocked(prisma.lotteries.findMany).mockResolvedValue(mockLotteries as never);
    const response = await GET(makeRequest());
    const data = await response.json();
    for (const d of data.upcoming) {
      const t = new Date(d.nextDrawAt).getTime();
      // nextDrawAt must be >= now (within a few ms tolerance)
      expect(t).toBeGreaterThanOrEqual(Date.now() - 2000);
    }
  });

  it("handles empty active lottery list gracefully", async () => {
    vi.mocked(prisma.lotteries.findMany).mockResolvedValue([] as never);
    const response = await GET(makeRequest());
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.upcoming).toHaveLength(0);
  });
});
