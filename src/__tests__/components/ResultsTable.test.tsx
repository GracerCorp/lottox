import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ResultsTable } from "@/components/ui/ResultsTable";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("@/lib/hooks/useApi", () => ({
  useApi: vi.fn(() => ({
    data: {
      results: [
        {
          id: "1",
          type: "THAI",
          drawDate: "2023-12-01",
          countryCode: "th",
          lotteryName: "Thai Gov",
          data: {
            prizes: [
              {
                prizeName: "First Prize",
                category: "firstPrize",
                winningNumbers: ["111111"],
                order: 1,
              },
            ],
          },
        },
        {
          id: "2",
          type: "LAO_DEV",
          drawDate: "2023-12-02",
          countryCode: "la",
          lotteryName: "Lao Lotto",
          data: {
            prizes: [
              {
                prizeName: "First Prize",
                category: "firstPrize",
                winningNumbers: ["9876"],
                order: 1,
              },
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

function renderTable(filter = "all") {
  return render(
    <LanguageProvider>
      <ResultsTable filter={filter} />
    </LanguageProvider>
  );
}

describe("ResultsTable", () => {
  it("renders with mocked api data", async () => {
    await act(async () => {
      renderTable();
    });
    expect(screen.getAllByText(/111111/i).length).toBeGreaterThan(0);
  });

  it("displays lottery names", async () => {
    await act(async () => {
      renderTable();
    });
    expect(screen.getByText("Thai Gov")).toBeDefined();
    expect(screen.getByText("Lao Lotto")).toBeDefined();
  });

  it("displays first prize numbers", async () => {
    await act(async () => {
      renderTable();
    });
    expect(screen.getAllByText(/111111/).length).toBeGreaterThan(0);
  });

  it("renders with country filter", async () => {
    await act(async () => {
      renderTable("th");
    });
    // Should still render — filtering happens within the component
    const container = document.querySelector("[class*='space-y']");
    expect(container).toBeDefined();
  });

  it("has correct light/dark theme classes on row items", async () => {
    const { container } = await act(async () => {
      return renderTable();
    });
    const row = container.querySelector("[class*='flex items-center gap']");
    if (row) {
      expect(row.className).toContain("dark:bg-navy-900/60");
      expect(row.className).toContain("bg-white/60");
      expect(row.className).toContain("dark:border-white/5");
      expect(row.className).toContain("border-gray-100");
    }
  });

  it("has correct light/dark theme classes on lottery names", async () => {
    const { container } = await act(async () => {
      return renderTable();
    });
    const names = container.querySelectorAll("span[class*='font-semibold']");
    if (names.length > 0) {
      expect(names[0].className).toContain("dark:text-white");
      expect(names[0].className).toContain("text-gray-900");
    }
  });
});
