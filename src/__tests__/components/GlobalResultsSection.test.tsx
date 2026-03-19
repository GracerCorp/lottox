import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlobalResultsSection } from "@/components/global-draws/GlobalResultsSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("@/components/global-draws/LatestDrawCard", () => ({
  LatestDrawCard: () => <div data-testid="latest-draw-card" />,
}));
vi.mock("@/components/global-draws/UpcomingLotterySidebar", () => ({
  UpcomingLotterySidebar: () => <div data-testid="upcoming-lottery-sidebar" />,
}));

function wrap(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe("GlobalResultsSection", () => {
  it("renders section container", () => {
    wrap(<GlobalResultsSection />);
    expect(screen.getByTestId("global-results-section")).toBeDefined();
  });

  it("renders LatestDrawCard", () => {
    wrap(<GlobalResultsSection />);
    expect(screen.getByTestId("latest-draw-card")).toBeDefined();
  });

  it("renders UpcomingLotterySidebar", () => {
    wrap(<GlobalResultsSection />);
    expect(screen.getByTestId("upcoming-lottery-sidebar")).toBeDefined();
  });

  it("renders translated title and subtitle", () => {
    wrap(<GlobalResultsSection />);
    // English translations from en.ts
    expect(screen.getByText(/global/i)).toBeDefined();
  });
});
