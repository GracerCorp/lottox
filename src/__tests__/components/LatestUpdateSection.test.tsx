import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LatestUpdateSection } from "@/components/home/LatestUpdate/LatestUpdateSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill ? "true" : undefined} />;
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
    expect(buttons.length).toBeGreaterThanOrEqual(6); // 6 region tabs
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
    const asiaTab = screen.getByRole("button", { name: /^asia$/i });
    
    // Switch to Asia
    fireEvent.click(asiaTab);

    // Now Asia should be active and have golden text
    expect(asiaTab.className).toContain("text-[#D4AF37]");
    expect(trendingTab.className).not.toContain("text-[#D4AF37]");
  });
});
