import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PinnedLotteryTabs } from "@/components/global-results/PinnedLotteryTabs";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { PinnedLottery } from "@/components/global-results/AddLotteryModal";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

function wrap(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

const mockPinned: PinnedLottery[] = [
  { lotteryId: 1, lotteryName: "Government Lottery", logo: "/glo.png", countryCode: "th" },
  { lotteryId: 2, lotteryName: "Lao Lotto", logo: "/lao.png", countryCode: "la" },
];

describe("PinnedLotteryTabs", () => {
  it("shows 'no pinned' text when empty", () => {
    wrap(
      <PinnedLotteryTabs pinned={[]} activeIndex={0} onSelect={() => {}} />,
    );
    expect(screen.getByTestId("no-pinned-text")).toBeDefined();
  });

  it("renders tab buttons for each pinned lottery", () => {
    wrap(
      <PinnedLotteryTabs pinned={mockPinned} activeIndex={0} onSelect={() => {}} />,
    );
    expect(screen.getByText("Government Lottery")).toBeDefined();
    expect(screen.getByText("Lao Lotto")).toBeDefined();
  });

  it("highlights active tab as selected", () => {
    wrap(
      <PinnedLotteryTabs pinned={mockPinned} activeIndex={0} onSelect={() => {}} />,
    );
    const tab0 = screen.getByTestId("tab-th");
    expect(tab0.getAttribute("aria-selected")).toBe("true");
    const tab1 = screen.getByTestId("tab-la");
    expect(tab1.getAttribute("aria-selected")).toBe("false");
  });

  it("calls onSelect when tab is clicked", async () => {
    const onSelect = vi.fn();
    wrap(
      <PinnedLotteryTabs pinned={mockPinned} activeIndex={0} onSelect={onSelect} />,
    );
    await userEvent.click(screen.getByTestId("tab-la"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("renders lottery logos in tabs", () => {
    wrap(
      <PinnedLotteryTabs pinned={mockPinned} activeIndex={0} onSelect={() => {}} />,
    );
    const logos = screen.getAllByRole("img");
    expect(logos.length).toBe(2);
    expect(logos[0].getAttribute("alt")).toBe("Government Lottery");
  });

  it("renders tab without logo when logo is null", () => {
    const pinnedNoLogo: PinnedLottery[] = [
      { lotteryId: 5, lotteryName: "Test Lottery", logo: null, countryCode: "xx" },
    ];
    wrap(
      <PinnedLotteryTabs pinned={pinnedNoLogo} activeIndex={0} onSelect={() => {}} />,
    );
    expect(screen.getByText("Test Lottery")).toBeDefined();
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });
});
