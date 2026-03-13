import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/statistics/route";
import { statisticsService } from "@/lib/services/statisticsService";
import { NextRequest } from "next/server";

vi.mock("@/lib/services/statisticsService", () => {
  return {
    statisticsService: {
      getStatsOverview: vi.fn(),
      getStatsFrequency: vi.fn(),
    },
  };
});

describe("Statistics API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return formatted statistics on success", async () => {
    (statisticsService.getStatsOverview as any).mockResolvedValue({
      totalJackpotsTracked: "1000",
      activeLotteries: 5,
      upcomingDraws24h: 2,
      totalCountries: 3,
    });

    const req = new NextRequest("http://localhost:3000/api/statistics?type=overview");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.totalJackpotsTracked).toBe("1000");
    expect(data.activeLotteries).toBe(5);
    expect(statisticsService.getStatsOverview).toHaveBeenCalledTimes(1);
  });

  it("should validate query parameters and reject invalid types", async () => {
    const req = new NextRequest("http://localhost:3000/api/statistics?type=invalid");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid query parameters");
    expect(statisticsService.getStatsOverview).not.toHaveBeenCalled();
    expect(statisticsService.getStatsFrequency).not.toHaveBeenCalled();
  });

  it("should default to overview type when none provided", async () => {
    (statisticsService.getStatsOverview as any).mockResolvedValue({ default: true });
    
    const req = new NextRequest("http://localhost:3000/api/statistics");
    await GET(req);
    
    expect(statisticsService.getStatsOverview).toHaveBeenCalledTimes(1);
  });

  it("should route to getStatsFrequency when type is valid and not overview", async () => {
    (statisticsService.getStatsFrequency as any).mockResolvedValue({ type: "thai", draws: 30 });
    
    const req = new NextRequest("http://localhost:3000/api/statistics?type=thai&draws=30");
    await GET(req);
    
    expect(statisticsService.getStatsFrequency).toHaveBeenCalledWith("thai", 30);
  });

  it("should catch and sanitize internal errors", async () => {
    const dbError = new Error("Database connection failed completely");
    (statisticsService.getStatsOverview as any).mockRejectedValue(dbError);

    // Suppress console.error in tests for this specific test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = new NextRequest("http://localhost:3000/api/statistics?type=overview");
    const response = await GET(req);
    const data = await response.json();

    expect(consoleSpy).toHaveBeenCalledWith("[API/Statistics] Error:", dbError);
    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");

    consoleSpy.mockRestore();
  });
});
