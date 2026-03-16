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
    
      const mockedGetGlobalResults = vi.mocked(apiClient.getGlobalResults);
      mockedGetGlobalResults.mockResolvedValue({
        total: 10,
        totalPages: 1,
        page: 1,
        draws: [],
      });
  
      const request = {
        nextUrl: {
          searchParams: new URLSearchParams("page=1&limit=10"),
        },
      } as never;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(10);
  });

  it("should catch errors and return generic 500 response", async () => {
    const { apiClient } = await import("@/lib/services/lotteryResultService");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    const dbError = new Error("PrismaClientKnownRequestError: Table not found");
    const mockedGetGlobalResults = vi.mocked(apiClient.getGlobalResults);
    mockedGetGlobalResults.mockRejectedValue(dbError);

    const request = {
      nextUrl: {
        searchParams: new URLSearchParams()
      }
    } as never;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
    expect(data.error).not.toContain("PrismaClientKnownRequestError");
    
    expect(consoleSpy).toHaveBeenCalledWith("[API/Results/Global]", expect.objectContaining({
      error: dbError.message,
      stack: dbError.stack,
    }));
    
    consoleSpy.mockRestore();
  });
});
