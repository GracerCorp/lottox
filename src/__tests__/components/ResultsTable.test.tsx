import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ResultsTable } from "@/components/ui/ResultsTable";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("@/lib/hooks/useApi", () => ({
  useApi: vi.fn(() => ({
    data: {
      results: [
        {
          id: "1",
          type: "THAI",
          drawDate: "2023-12-01",
          countryCode: "th",
          lotteryName: "Thai Gov",
          data: {
            prizes: [
              {
                prizeName: "First Prize",
                category: "firstPrize",
                winningNumbers: ["111111"],
                order: 1
              }
            ]
          }
        }
      ]
    },
    loading: false,
    error: null,
  }))
}));

describe("ResultsTable", () => {
  it("should render generic table with mocked api data", async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <ResultsTable filter="all" />
        </LanguageProvider>
      );
    });
    
    // Wait for the render to complete and check if the mocked '111111' prize is displayed
    expect(screen.getAllByText(/111111/i).length).toBeGreaterThan(0);
  });
});
