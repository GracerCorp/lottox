import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ShareRow,
  JackpotResult,
  StandardWinResult,
  NoWinResult,
} from "@/components/home/ResultStates";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("react-use", () => ({
  useWindowSize: vi.fn(() => ({ width: 1024, height: 768 })),
}));

vi.mock("react-confetti", () => ({
  default: () => <div data-testid="confetti" />,
}));

// JackpotResult calls window.matchMedia for prefers-reduced-motion
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      div: ({ children, className, onClick }: any) => (
        <div className={className} onClick={onClick}>
          {children}
        </div>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      button: ({ children, className, onClick }: any) => (
        <button className={className} onClick={onClick}>
          {children}
        </button>
      ),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// clipboard mock
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  writable: true,
});

describe("ResultStates", () => {
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── ShareRow ────────────────────────────────────────────────────────────────

  describe("ShareRow", () => {
    it("renders share label with localized text", () => {
      render(
        <LanguageProvider>
          <ShareRow number="123456" />
        </LanguageProvider>
      );
      // label exists (EN: "Share Your Win")
      expect(screen.getByText(/share/i)).toBeDefined();
    });

    it("renders Facebook and Twitter links with correct hrefs", () => {
      render(
        <LanguageProvider>
          <ShareRow number="123456" />
        </LanguageProvider>
      );
      const links = screen.getAllByRole("link");
      // At least 2 links (Facebook + Twitter)
      expect(links.length).toBeGreaterThanOrEqual(2);
      const hrefs = links.map((l) => l.getAttribute("href") ?? "");
      expect(hrefs.some((h) => h.includes("facebook.com"))).toBe(true);
      expect(hrefs.some((h) => h.includes("twitter.com"))).toBe(true);
    });

    it("renders copy-link button and calls clipboard.writeText on click", async () => {
      render(
        <LanguageProvider>
          <ShareRow number="123456" />
        </LanguageProvider>
      );
      const copyBtn = screen.getByRole("button", { name: /copy link/i });
      expect(copyBtn).toBeDefined();
      fireEvent.click(copyBtn);
      // clipboard.writeText is async; just assert it was called
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  // ─── JackpotResult ───────────────────────────────────────────────────────────

  describe("JackpotResult", () => {
    const jackpotResult = {
      isWinner: true,
      prizes: [{ prizeName: "1st Prize", amount: "6000000" }],
    };

    it("renders confetti, jackpot title, number, and prize amount", () => {
      render(
        <LanguageProvider>
          <JackpotResult result={jackpotResult} number="833009" onReset={mockOnReset} />
        </LanguageProvider>
      );

      expect(screen.getByTestId("confetti")).toBeDefined();
      expect(screen.getByText(/jackpot!/i)).toBeDefined();
      expect(screen.getByText("833009")).toBeDefined();
      expect(screen.getByText(/6,000,000/)).toBeDefined();
      // "1st prize" appears in both the prize row label and the "matched the 1st prize!" sentence
      expect(screen.getAllByText(/1st prize/i).length).toBeGreaterThanOrEqual(1);
    });

    it("shows fallback prize label when prizeName is missing", () => {
      const resultNoPrizeName = {
        isWinner: true,
        prizes: [{ label: "รางวัลที่ 1", amount: "6000000" }],
      };
      render(
        <LanguageProvider>
          <JackpotResult result={resultNoPrizeName} number="123456" onReset={mockOnReset} />
        </LanguageProvider>
      );
      expect(screen.getByText("รางวัลที่ 1")).toBeDefined();
    });

    it("shows prize fallback text when no amount provided", () => {
      const resultNoAmount = {
        isWinner: true,
        prizes: [{ prizeName: "1st Prize" }],
      };
      render(
        <LanguageProvider>
          <JackpotResult result={resultNoAmount} number="123456" onReset={mockOnReset} />
        </LanguageProvider>
      );
      // EN: "Huge Prize!"
      expect(screen.getByText(/huge prize/i)).toBeDefined();
    });

    it("calls onReset when Check Another is clicked", () => {
      render(
        <LanguageProvider>
          <JackpotResult result={jackpotResult} number="123456" onReset={mockOnReset} />
        </LanguageProvider>
      );
      fireEvent.click(screen.getByText(/check another/i));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it("skips prize list when prizes is undefined", () => {
      const resultNoPrizes = { isWinner: true };
      const { container } = render(
        <LanguageProvider>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <JackpotResult result={resultNoPrizes as any} number="999999" onReset={mockOnReset} />
        </LanguageProvider>
      );
      // No prize rows rendered
      expect(container.querySelector(".space-y-3")).toBeNull();
    });
  });

  // ─── StandardWinResult ───────────────────────────────────────────────────────

  describe("StandardWinResult", () => {
    const standardResult = {
      isWinner: true,
      prizes: [
        { prizeName: "2-Digit Suffix", amount: "2000" },
        { prizeName: "3-Digit Front", amount: "4000" },
      ],
    };

    it("renders no confetti for standard win", () => {
      render(
        <LanguageProvider>
          <StandardWinResult result={standardResult} number="510" onReset={mockOnReset} />
        </LanguageProvider>
      );
      expect(screen.queryByTestId("confetti")).toBeNull();
    });

    it("renders congratulations title, number, and all prizes", () => {
      render(
        <LanguageProvider>
          <StandardWinResult result={standardResult} number="510" onReset={mockOnReset} />
        </LanguageProvider>
      );
      expect(screen.getByText(/congratulations/i)).toBeDefined();
      expect(screen.getByText("510")).toBeDefined();
      expect(screen.getByText(/2-digit suffix/i)).toBeDefined();
      expect(screen.getByText(/2,000/)).toBeDefined();
      expect(screen.getByText(/3-digit front/i)).toBeDefined();
      expect(screen.getByText(/4,000/)).toBeDefined();
    });

    it("falls back to dash when prize amount is missing", () => {
      const resultNoAmount = {
        isWinner: true,
        prizes: [{ prizeName: "Special" }],
      };
      render(
        <LanguageProvider>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <StandardWinResult result={resultNoAmount as any} number="123" onReset={mockOnReset} />
        </LanguageProvider>
      );
      expect(screen.getByText("-")).toBeDefined();
    });

    it("calls onReset when Check Another is clicked", () => {
      render(
        <LanguageProvider>
          <StandardWinResult result={standardResult} number="510" onReset={mockOnReset} />
        </LanguageProvider>
      );
      fireEvent.click(screen.getByText(/check another/i));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it("renders Play Next Draw link pointing to /global_results", () => {
      render(
        <LanguageProvider>
          <StandardWinResult result={standardResult} number="510" onReset={mockOnReset} />
        </LanguageProvider>
      );
      const playLink = screen.getByRole("link", { name: /play next draw/i });
      expect(playLink.getAttribute("href")).toBe("/global_results");
    });
  });

  // ─── NoWinResult ─────────────────────────────────────────────────────────────

  describe("NoWinResult", () => {
    it("renders not-this-time title and number with no-match description", () => {
      render(
        <LanguageProvider>
          <NoWinResult number="000000" onReset={mockOnReset} />
        </LanguageProvider>
      );
      expect(screen.getByText(/not this time/i)).toBeDefined();
      expect(screen.getByText("000000")).toBeDefined();
      expect(screen.getByText(/didn't match any prizes/i)).toBeDefined();
    });

    it("renders upcoming opportunity retention card with view link", () => {
      render(
        <LanguageProvider>
          <NoWinResult number="000000" onReset={mockOnReset} />
        </LanguageProvider>
      );
      expect(screen.getByText(/upcoming opportunity/i)).toBeDefined();
      const viewLink = screen.getByRole("link", { name: /view upcoming draws/i });
      expect(viewLink.getAttribute("href")).toBe("/global_results");
    });

    it("calls onReset when Check Another Number is clicked", () => {
      render(
        <LanguageProvider>
          <NoWinResult number="000000" onReset={mockOnReset} />
        </LanguageProvider>
      );
      fireEvent.click(screen.getByText(/check another number/i));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });
});
