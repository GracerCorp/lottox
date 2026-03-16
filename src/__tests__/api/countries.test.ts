import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/countries/route";
import { countryService } from "@/lib/services/countryService";

// Mock the nested countryService object correctly
vi.mock("@/lib/services/countryService", () => {
  return {
    countryService: {
      getCountries: vi.fn(),
    },
  };
});

describe("Countries API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return formatted country data on success", async () => {
    const mockedGetCountries = vi.mocked(countryService.getCountries);
    mockedGetCountries.mockResolvedValue({
      countries: [
        { id: 1, code: "th", name: "Thailand", is_active: true, _count: { lotteries: 1 } } as never,
      ],
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.countries).toHaveLength(1);
    expect(data.countries[0].name).toBe("Thailand");
    expect(countryService.getCountries).toHaveBeenCalledTimes(1);
  });

  it("should catch and sanitize internal errors", async () => {
    const dbError = new Error("Database connection failed completely");
    const mockedGetCountries = vi.mocked(countryService.getCountries);
    mockedGetCountries.mockRejectedValue(dbError);

    // Suppress console.error in tests for this specific test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await GET();
    const data = await response.json();

    expect(consoleSpy).toHaveBeenCalledWith("[API/Countries]", expect.objectContaining({
      error: dbError.message,
      stack: dbError.stack,
    }));
    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");

    consoleSpy.mockRestore();
  });
});
