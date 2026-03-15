import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import LotteryDetail from "@/components/lottery/LotteryDetail";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("@/lib/hooks/useApi", () => ({
  useApi: vi.fn(() => ({
    data: {
      latest: {
        date: "2023-12-01",
        dateDisplay: "01 Dec 2023",
        data: {
          firstPrize: "123456"
        }
      },
      history: []
    },
    loading: false,
    error: null,
  }))
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useParams: vi.fn(() => ({ country: "th", lottery: "thai-gov" }))
}));

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn()
}));

describe("LotteryDetail", () => {
  it("should render successfully without crashing", async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <LotteryDetail
            country="Thailand"
            countryCode="th"
            lotteryName="Thai Gov"
            lotterySlug="thai-gov"
            apiEndpoint="/api/results/thai"
          />
        </LanguageProvider>
      );
    });

    expect(screen.getAllByText(/Thai Gov/i).length).toBeGreaterThan(0);
    // Use getAllByText for 'thailand' since it might appear in alt tags, header, etc.
    expect(screen.getAllByText(/Thailand/i).length).toBeGreaterThan(0);
  });
});
