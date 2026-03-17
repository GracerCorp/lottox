import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Use vi.hoisted so the variable is available inside vi.mock factory
const { mockCheckNumber } = vi.hoisted(() => ({
  mockCheckNumber: vi.fn(),
}));

vi.mock("@/lib/services/lotteryResultService", () => ({
  apiClient: { checkNumber: mockCheckNumber },
}));

vi.mock("@/lib/utils/apiErrorHandler", () => ({
  handleApiError: vi.fn((_err: unknown) =>
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  ),
}));

import { GET } from "@/app/api/check/route";

function makeRequest(params: Record<string, string | undefined>) {
  const url = new URL("http://localhost/api/check");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, v);
  }
  return new NextRequest(url);
}

describe("GET /api/check", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Validation failures ───────────────────────────────────────────────────

  it("returns 400 when number param is missing", async () => {
    const res = await GET(makeRequest({ type: "glo" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("returns 400 when type param is missing", async () => {
    const res = await GET(makeRequest({ number: "123456" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when number contains non-numeric characters", async () => {
    const res = await GET(makeRequest({ number: "12AB56", type: "glo" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/numeric/i);
  });

  it("returns 400 when number is longer than 6 digits", async () => {
    const res = await GET(makeRequest({ number: "1234567", type: "glo" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when number is empty string", async () => {
    const res = await GET(makeRequest({ number: "", type: "glo" }));
    expect(res.status).toBe(400);
  });

  // ─── Happy paths ───────────────────────────────────────────────────────────

  it("calls checkNumber with correct args and returns data on win", async () => {
    const mockResponse = {
      isWinner: true,
      prizes: [{ prizeName: "1st Prize", amount: "6000000" }],
    };
    mockCheckNumber.mockResolvedValue(mockResponse);

    const res = await GET(makeRequest({ number: "833009", type: "glo" }));
    expect(res.status).toBe(200);

    expect(mockCheckNumber).toHaveBeenCalledWith("833009", "glo", undefined);

    const body = await res.json();
    expect(body.isWinner).toBe(true);
    expect(body.prizes).toHaveLength(1);
  });

  it("returns no-win response without drawDate", async () => {
    mockCheckNumber.mockResolvedValue({ isWinner: false, prizes: [] });

    const res = await GET(makeRequest({ number: "000000", type: "lao" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isWinner).toBe(false);
  });

  it("passes drawDate to checkNumber when provided", async () => {
    mockCheckNumber.mockResolvedValue({ isWinner: false, prizes: [] });

    await GET(makeRequest({ number: "123456", type: "glo", drawDate: "2025-01-16" }));

    expect(mockCheckNumber).toHaveBeenCalledWith("123456", "glo", "2025-01-16");
  });

  it("accepts 2-digit number (minimum valid length)", async () => {
    mockCheckNumber.mockResolvedValue({ isWinner: false, prizes: [] });
    const res = await GET(makeRequest({ number: "51", type: "lao" }));
    expect(res.status).toBe(200);
    expect(mockCheckNumber).toHaveBeenCalledWith("51", "lao", undefined);
  });

  // ─── Error handling ────────────────────────────────────────────────────────

  it("returns 500 when checkNumber throws", async () => {
    mockCheckNumber.mockRejectedValue(new Error("DB connection failed"));

    const res = await GET(makeRequest({ number: "123456", type: "glo" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});
