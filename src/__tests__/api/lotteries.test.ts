import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

const { mockGetActiveCountries } = vi.hoisted(() => ({
  mockGetActiveCountries: vi.fn(),
}));

vi.mock("@/lib/services/lotteryService", () => ({
  getActiveCountries: mockGetActiveCountries,
}));

vi.mock("@/lib/utils/apiErrorHandler", () => ({
  handleApiError: vi.fn(() =>
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  ),
}));

import { GET } from "@/app/api/lotteries/route";

describe("GET /api/lotteries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns lotteries grouped by country", async () => {
    mockGetActiveCountries.mockResolvedValue([
      {
        code: "TH",
        name: "Thailand",
        flag: "/flags/th.svg",
        lotteries: [
          { id: 1, name: "Government Lottery", logo: "/glo.png" },
        ],
      },
      {
        code: "JP",
        name: "Japan",
        flag: null,
        lotteries: [
          { id: 3, name: "Loto 6", logo: "/loto6.png" },
          { id: 4, name: "Loto 7", logo: null },
        ],
      },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.countries).toHaveLength(2);
    expect(body.countries[0].code).toBe("TH");
    expect(body.countries[0].lotteries).toHaveLength(1);
    expect(body.countries[0].lotteries[0].id).toBe(1);
    expect(body.countries[0].lotteries[0].name).toBe("Government Lottery");
    expect(body.countries[1].lotteries).toHaveLength(2);
    expect(body.countries[1].lotteries[1].logo).toBeNull();
  });

  it("returns empty array when no countries", async () => {
    mockGetActiveCountries.mockResolvedValue([]);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.countries).toHaveLength(0);
  });

  it("returns 500 when service throws", async () => {
    mockGetActiveCountries.mockRejectedValue(new Error("DB error"));

    const res = await GET();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});
