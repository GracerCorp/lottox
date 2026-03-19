import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PinnedLotteryTabs } from "@/components/global-draws/PinnedLotteryTabs";
import { LanguageProvider } from "@/contexts/LanguageContext";

function wrap(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

const pinned = [
  { countryCode: "th", lotteryName: "Thailand" },
  { countryCode: "la", lotteryName: "Laos" },
];

describe("PinnedLotteryTabs", () => {
  it("shows no-pinned message when pinned is empty", () => {
    wrap(<PinnedLotteryTabs pinned={[]} activeIndex={0} onSelect={vi.fn()} />);
    expect(screen.getByTestId("no-pinned-text")).toBeDefined();
  });

  it("renders a tab for each pinned lottery", () => {
    wrap(<PinnedLotteryTabs pinned={pinned} activeIndex={0} onSelect={vi.fn()} />);
    expect(screen.getByTestId("tab-th")).toBeDefined();
    expect(screen.getByTestId("tab-la")).toBeDefined();
  });

  it("applies active styles to the selected tab", () => {
    const { container } = wrap(
      <PinnedLotteryTabs pinned={pinned} activeIndex={0} onSelect={vi.fn()} />,
    );
    const activeTab = container.querySelector("[aria-selected='true']");
    expect(activeTab).toBeDefined();
    expect(activeTab?.className).toContain("bg-amber-400");
  });

  it("calls onSelect with index when a tab is clicked", async () => {
    const onSelect = vi.fn();
    wrap(<PinnedLotteryTabs pinned={pinned} activeIndex={0} onSelect={onSelect} />);
    await userEvent.click(screen.getByTestId("tab-la"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("has tablist role", () => {
    wrap(<PinnedLotteryTabs pinned={pinned} activeIndex={0} onSelect={vi.fn()} />);
    expect(screen.getByTestId("pinned-tabs").getAttribute("role")).toBe("tablist");
  });
});
