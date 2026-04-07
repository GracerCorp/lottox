import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyResultBoard } from "@/components/global-results/MyResultBoard";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { PinnedLottery } from "@/components/global-results/AddLotteryModal";

// Mock child components that do their own API calls
vi.mock("@/components/global-results/ResultBoardCard", () => ({
  ResultBoardCard: ({ lotteryName, onRemove }: { lotteryName: string; onRemove?: () => void }) => (
    <div data-testid="result-board-card">
      {lotteryName}
      {onRemove && <button onClick={onRemove} data-testid="mock-remove">Remove</button>}
    </div>
  ),
}));

vi.mock("@/components/global-results/AddLotteryModal", () => ({
  AddLotteryModal: ({
    onConfirm,
    onClose,
  }: {
    pinned: PinnedLottery[];
    onConfirm: (selected: PinnedLottery[]) => void;
    onClose: () => void;
  }) => (
    <div data-testid="add-lottery-modal">
      <button
        onClick={() =>
          onConfirm([
            { lotteryId: 1, lotteryName: "Government Lottery", logo: "/glo.png", countryCode: "th" },
          ])
        }
        data-testid="modal-confirm-th"
      >
        Confirm TH
      </button>
      <button onClick={onClose} data-testid="modal-close">Close</button>
    </div>
  ),
}));

vi.mock("@/components/global-results/PinnedLotteryTabs", () => ({
  PinnedLotteryTabs: ({
    pinned,
    onSelect,
  }: {
    pinned: PinnedLottery[];
    onSelect: (i: number) => void;
  }) => (
    <div data-testid="pinned-tabs">
      {pinned.map((p, i) => (
        <button
          key={p.lotteryId}
          onClick={() => onSelect(i)}
          data-testid={`tab-${p.countryCode}`}
        >
          {p.lotteryName}
        </button>
      ))}
    </div>
  ),
}));

function wrap(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe("MyResultBoard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows empty state when no lotteries are pinned", () => {
    wrap(<MyResultBoard />);
    expect(screen.getByTestId("empty-board-state")).toBeDefined();
  });

  it("shows Add button when under max pinned", () => {
    wrap(<MyResultBoard />);
    expect(screen.getByTestId("add-lottery-button")).toBeDefined();
  });

  it("opens modal when Add button is clicked", async () => {
    wrap(<MyResultBoard />);
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    expect(screen.getByTestId("add-lottery-modal")).toBeDefined();
  });

  it("closes modal when onClose is triggered", async () => {
    wrap(<MyResultBoard />);
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-close"));
    expect(screen.queryByTestId("add-lottery-modal")).toBeNull();
  });

  it("batch-confirms lotteries and shows result board card", async () => {
    wrap(<MyResultBoard />);
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-confirm-th"));
    expect(screen.getByTestId("result-board-card")).toBeDefined();
    expect(screen.getAllByText("Government Lottery").length).toBeGreaterThan(0);
  });

  it("removes lottery when onRemove is triggered", async () => {
    wrap(<MyResultBoard />);
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-confirm-th"));
    expect(screen.getByTestId("result-board-card")).toBeDefined();
    await userEvent.click(screen.getByTestId("mock-remove"));
    expect(screen.queryByTestId("result-board-card")).toBeNull();
  });

  it("persists pinned lotteries to localStorage", async () => {
    wrap(<MyResultBoard />);
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-confirm-th"));
    const stored = JSON.parse(localStorage.getItem("lottox_pinned_lotteries") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].lotteryId).toBe(1);
    expect(stored[0].countryCode).toBe("th");
  });

  it("migrates old format (no lotteryId) by clearing", () => {
    // Simulate old format
    localStorage.setItem("lottox_pinned_lotteries", JSON.stringify([
      { countryCode: "th", lotteryName: "Thailand" },
    ]));
    wrap(<MyResultBoard />);
    // Should show empty state after migration
    expect(screen.getByTestId("empty-board-state")).toBeDefined();
  });

  it("section has data-testid", () => {
    wrap(<MyResultBoard />);
    expect(screen.getByTestId("my-result-board")).toBeDefined();
  });
});
