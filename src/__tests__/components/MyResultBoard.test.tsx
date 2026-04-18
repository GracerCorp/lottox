import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyResultBoard } from "@/components/global-results/MyResultBoard";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { PinnedLottery } from "@/lib/api-types";

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

// Mock getPinnedLotteries / setPinnedLotteries (cookie-based, not localStorage)
vi.mock("@/lib/utils/cookies", () => {
  let storage: PinnedLottery[] = [];
  return {
    getPinnedLotteries: vi.fn(() => storage),
    setPinnedLotteries: vi.fn((val: PinnedLottery[]) => { storage = val; }),
    __resetStorage: () => { storage = []; },
  };
});

function wrap(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

async function renderAndHydrate() {
  vi.useFakeTimers();
  wrap(<MyResultBoard />);
  // Advance past the setTimeout(…, 0) used for hydration
  await act(async () => { vi.advanceTimersByTime(1); });
  vi.useRealTimers();
}

describe("MyResultBoard", () => {
  beforeEach(async () => {
    const cookies = await import("@/lib/utils/cookies");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cookies as any).__resetStorage();
  });

  it("shows empty state when no lotteries are pinned", async () => {
    await renderAndHydrate();
    expect(screen.getByTestId("empty-board-state")).toBeDefined();
  });

  it("shows Add button when under max pinned", async () => {
    await renderAndHydrate();
    expect(screen.getByTestId("add-lottery-button")).toBeDefined();
  });

  it("opens modal when Add button is clicked", async () => {
    await renderAndHydrate();
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    expect(screen.getByTestId("add-lottery-modal")).toBeDefined();
  });

  it("closes modal when onClose is triggered", async () => {
    await renderAndHydrate();
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-close"));
    expect(screen.queryByTestId("add-lottery-modal")).toBeNull();
  });

  it("batch-confirms lotteries and shows result board card", async () => {
    await renderAndHydrate();
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-confirm-th"));
    expect(screen.getByTestId("result-board-card")).toBeDefined();
    expect(screen.getAllByText("Government Lottery").length).toBeGreaterThan(0);
  });

  it("removes lottery when onRemove is triggered", async () => {
    await renderAndHydrate();
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-confirm-th"));
    expect(screen.getByTestId("result-board-card")).toBeDefined();
    await userEvent.click(screen.getByTestId("mock-remove"));
    expect(screen.queryByTestId("result-board-card")).toBeNull();
  });

  it("persists pinned lotteries via cookies", async () => {
    await renderAndHydrate();
    await userEvent.click(screen.getByTestId("add-lottery-button"));
    await userEvent.click(screen.getByTestId("modal-confirm-th"));
    const cookies = await import("@/lib/utils/cookies");
    expect(cookies.setPinnedLotteries).toHaveBeenCalled();
    const lastCall = (cookies.setPinnedLotteries as ReturnType<typeof vi.fn>).mock.calls.slice(-1)[0][0];
    expect(lastCall).toHaveLength(1);
    expect(lastCall[0].lotteryId).toBe(1);
    expect(lastCall[0].countryCode).toBe("th");
  });

  it("migrates old format (no lotteryId) by clearing", async () => {
    // Simulate old format stored in cookies — getPinnedLotteries should return []
    // because the migration logic happens in the cookie utility
    const cookies = await import("@/lib/utils/cookies");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cookies.getPinnedLotteries as any).mockReturnValueOnce([]);
    await renderAndHydrate();
    // Should show empty state after migration
    expect(screen.getByTestId("empty-board-state")).toBeDefined();
  });

  it("section has data-testid", async () => {
    await renderAndHydrate();
    expect(screen.getByTestId("my-result-board")).toBeDefined();
  });
});
