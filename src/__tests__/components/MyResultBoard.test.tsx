import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyResultBoard } from "@/components/global-draws/MyResultBoard";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Mock child components that do their own API calls
vi.mock("@/components/global-draws/ResultBoardCard", () => ({
  ResultBoardCard: ({ lotteryName, onRemove }: { lotteryName: string; onRemove?: () => void }) => (
    <div data-testid="result-board-card">
      {lotteryName}
      {onRemove && <button onClick={onRemove} data-testid="mock-remove">Remove</button>}
    </div>
  ),
}));

vi.mock("@/components/global-draws/AddLotteryModal", () => ({
  AddLotteryModal: ({
    onAdd,
    onClose,
  }: {
    onAdd: (code: string, name: string) => void;
    onClose: () => void;
  }) => (
    <div data-testid="add-lottery-modal">
      <button onClick={() => onAdd("th", "Thailand")} data-testid="modal-add-th">Add TH</button>
      <button onClick={onClose} data-testid="modal-close">Close</button>
    </div>
  ),
}));

vi.mock("@/components/global-draws/PinnedLotteryTabs", () => ({
  PinnedLotteryTabs: ({ pinned, onSelect }: { pinned: { countryCode: string; lotteryName: string }[]; onSelect: (i: number) => void }) => (
    <div data-testid="pinned-tabs">
      {pinned.map((p, i) => (
        <button key={p.countryCode} onClick={() => onSelect(i)} data-testid={`tab-${p.countryCode}`}>{p.lotteryName}</button>
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

  it("adds lottery and shows result board card", async () => {
    wrap(<MyResultBoard />);
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-add-th"));
    expect(screen.getByTestId("result-board-card")).toBeDefined();
    // Both the tab and the card show "Thailand" — use getAllByText
    expect(screen.getAllByText("Thailand").length).toBeGreaterThan(0);
  });

  it("removes lottery when onRemove is triggered", async () => {
    wrap(<MyResultBoard />);
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-add-th"));
    expect(screen.getByTestId("result-board-card")).toBeDefined();
    await userEvent.click(screen.getByTestId("mock-remove"));
    expect(screen.queryByTestId("result-board-card")).toBeNull();
  });

  it("persists pinned lotteries to localStorage", async () => {
    wrap(<MyResultBoard />);
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-add-th"));
    const stored = JSON.parse(localStorage.getItem("lottox_pinned_lotteries") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].countryCode).toBe("th");
  });

  it("section has data-testid", () => {
    wrap(<MyResultBoard />);
    expect(screen.getByTestId("my-result-board")).toBeDefined();
  });
});
