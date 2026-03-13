import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/results/global/route";

// Mock the apiClient methods
vi.mock("@/lib/services/lotteryResultService", () => {
  return {
    apiClient: {
      getGlobalResults: vi.fn(),
    },
  };
});

describe("GET /api/results/global", () => {
  it("should return global results on success", async () => {
    const { apiClient } = await import("@/lib/services/lotteryResultService");
    
    (apiClient.getGlobalResults as any).mockResolvedValue({
      total: 10,
      totalPages: 1,
      currentPage: 1,
      results: []
    });

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams("page=1&limit=10")
      }
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(10);
  });

  it("should catch errors and return generic 500 response", async () => {
    const { apiClient } = await import("@/lib/services/lotteryResultService");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    const dbError = new Error("PrismaClientKnownRequestError: Table not found");
    (apiClient.getGlobalResults as any).mockRejectedValue(dbError);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams()
      }
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
    expect(data.error).not.toContain("PrismaClientKnownRequestError");
    
    expect(consoleSpy).toHaveBeenCalledWith("[API/Results/Global] Error:", dbError);
    
    consoleSpy.mockRestore();
  });
});
