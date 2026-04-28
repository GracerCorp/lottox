/* eslint-disable @next/next/no-img-element */
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LatestUpdateSection } from "@/components/home/LatestUpdate/LatestUpdateSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Mock UserLocationContext to return no location so auto-tab-select doesn't interfere
vi.mock("@/contexts/UserLocationContext", () => ({
  useUserLocation: vi.fn(() => ({
    countryCode: "",
    countryName: "",
    city: "",
    region: "",
    isLoading: false,
  })),
}));

vi.mock("@/lib/hooks/useApi", () => ({
  useApi: vi.fn(() => ({
    data: {
      results: [
        {
          id: "1",
          lotteryName: "Thai Gov",
          countryCode: "th",
          type: "THAI",
          date: "2023-12-01",
          drawDate: "2023-12-01",
          data: {
            prizes: [
              { order: 1, winningNumbers: ["123456"], prizeName: "first_prize" }
            ],
          },
        },
      ],
    },
    loading: false,
    error: null,
  })),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill ? "true" : undefined} alt="" />;
  },
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

function renderSection() {
  return render(
    <LanguageProvider>
      <LatestUpdateSection />
    </LanguageProvider>
  );
}

describe("LatestUpdateSection", () => {
  it("renders section title", async () => {
    await act(async () => {
      renderSection();
    });
    expect(screen.getByText(/latest update/i)).toBeDefined();
  });

  it("renders standard continent tabs and Explore Global Results button", async () => {
    await act(async () => {
      renderSection();
    });
    const buttons = screen.getAllByRole("button"); // The tabs are buttons
    const link = screen.getByRole("link", { name: /explore global results/i });
    // Trending + region tabs from MSW mock (southeast-asia, east-asia)
    expect(buttons.length).toBeGreaterThanOrEqual(3);
    expect(link).toBeDefined();
  });

  it("has first tab (Trending) active by default", async () => {
    await act(async () => {
      renderSection();
    });
    const trendingTab = screen.getByRole("button", { name: /trending/i });
    expect(trendingTab.className).toContain("text-[#D4AF37]");
  });

  it("switches active tab when clicked", async () => {
    await act(async () => {
      renderSection();
    });
    
    const trendingTab = screen.getByRole("button", { name: /trending/i });
    const seaTab = screen.getByRole("button", { name: /southeast asia/i });
    
    // Switch to Southeast Asia
    fireEvent.click(seaTab);

    // Now Southeast Asia should be active and have golden text
    expect(seaTab.className).toContain("text-[#D4AF37]");
    expect(trendingTab.className).not.toContain("text-[#D4AF37]");
  });
});

