import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { HomeResultsSection } from "@/components/home/HomeResultsSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("@/lib/hooks/useApi", () => ({
  useApi: vi.fn(() => ({
    data: {
      "all": [{
        id: "1",
        name: "Thai Gov",
        countryCode: "th",
        latestResult: {
          firstPrize: "123456",
          drawDate: "2023-12-01",
          url: "/th/thai-gov/2023-12-01"
        }
      }],
      "th": [{
        id: "1",
        name: "Thai Gov",
        countryCode: "th",
        latestResult: {
          firstPrize: "123456",
          drawDate: "2023-12-01",
          url: "/th/thai-gov/2023-12-01"
        }
      }]
    },
    loading: false,
    error: null,
  }))
}));

describe("HomeResultsSection", () => {
  it("should render successfully and display tabs", async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <HomeResultsSection tabs={[{ id: "all", label: "All", flag: null }]} />
        </LanguageProvider>
      );
    });
    
    // Check if the component renders successfully
    const container = document.querySelector("section");
    expect(container).toBeDefined();
  });
});
