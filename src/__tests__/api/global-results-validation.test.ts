import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/results/global/route";
import { NextRequest } from "next/server";
import { apiClient } from "@/lib/services/lotteryResultService";

// Move vi.mock to the top level
vi.mock("@/lib/services/lotteryResultService", () => {
  return {
    apiClient: {
      getGlobalResults: vi.fn(),
    },
  };
});

describe("GET /api/results/global validation", () => {
  const createRequest = (query: string) => ({
    nextUrl: { searchParams: new URLSearchParams(query) }
  } as any);

  it("should parse page correctly from query", async () => {
    (apiClient.getGlobalResults as any).mockResolvedValueOnce({
      total: 10, totalPages: 1, page: 1, results: []
    });

    const response = await GET(createRequest("page=2&limit=5"));
    expect(response.status).toBe(200);
    expect(apiClient.getGlobalResults).toHaveBeenCalledWith({
      page: 2, limit: 5, country: undefined, period: undefined, date: undefined
    });
  });

  it("should return 400 when page is less than 1", async () => {
    const response = await GET(createRequest("page=0&limit=10"));
    expect(response.status).toBe(400); 
  });

  it("should return 400 when limit is strictly greater than 100", async () => {
    const response = await GET(createRequest("page=1&limit=99999"));
    expect(response.status).toBe(400);
  });

  it("should return 400 when page is absurdly high", async () => {
    const response = await GET(createRequest("page=9999999&limit=10"));
    expect(response.status).toBe(400);
  });

  it("should default to page 1 limit 20 when missing", async () => {
    (apiClient.getGlobalResults as any).mockResolvedValueOnce({
      total: 10, totalPages: 1, page: 1, results: []
    });

    const response = await GET(createRequest(""));
    expect(response.status).toBe(200);
    expect(apiClient.getGlobalResults).toHaveBeenCalledWith({
      page: 1, limit: 20, country: undefined, period: undefined, date: undefined
    });
  });
});
