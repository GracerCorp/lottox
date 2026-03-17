import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { HomeResultsSection } from "@/components/home/HomeResultsSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("@/lib/hooks/useApi", () => ({
  useApi: vi.fn(() => ({
    data: {
      all: [
        {
          id: "1",
          name: "Thai Gov",
          countryCode: "th",
          latestResult: {
            firstPrize: "123456",
            drawDate: "2023-12-01",
            url: "/th/thai-gov/2023-12-01",
          },
        },
        {
          id: "2",
          name: "Lao Lotto",
          countryCode: "la",
          latestResult: {
            firstPrize: "9876",
            drawDate: "2023-12-02",
            url: "/la/lao-lotto/2023-12-02",
          },
        },
      ],
      th: [
        {
          id: "1",
          name: "Thai Gov",
          countryCode: "th",
          latestResult: {
            firstPrize: "123456",
            drawDate: "2023-12-01",
            url: "/th/thai-gov/2023-12-01",
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

const mockTabs = [
  { id: "all", label: "all", flag: null },
  { id: "th", label: "th", flag: "/flags/th.svg" },
  { id: "la", label: "la", flag: "/flags/la.svg" },
];

function renderSection(tabs = mockTabs) {
  return render(
    <LanguageProvider>
      <HomeResultsSection tabs={tabs} />
    </LanguageProvider>
  );
}

describe("HomeResultsSection", () => {
  it("renders section title in English", async () => {
    await act(async () => {
      renderSection();
    });
    expect(screen.getByText(/latest update/i)).toBeDefined();
  });

  it("renders all tab buttons", async () => {
    await act(async () => {
      renderSection();
    });
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(mockTabs.length);
  });

  it("has first tab (All) active by default", async () => {
    await act(async () => {
      renderSection();
    });
    const allTab = screen.getAllByRole("button")[0];
    expect(allTab.className).toContain("bg-gold-500");
  });

  it("switches active tab when clicked", async () => {
    await act(async () => {
      renderSection();
    });
    const tabs = screen.getAllByRole("button");
    fireEvent.click(tabs[1]); // click "th" tab

    expect(tabs[1].className).toContain("bg-gold-500");
    expect(tabs[0].className).not.toContain("bg-gold-500");
  });

  it("renders flag images for tabs that have them", async () => {
    const { container } = await act(async () => {
      return renderSection();
    });
    const flags = container.querySelectorAll("img");
    // "th" and "la" tabs have flag
    expect(flags.length).toBeGreaterThanOrEqual(2);
  });

  it("renders with single tab", async () => {
    await act(async () => {
      renderSection([{ id: "all", label: "All", flag: null }]);
    });
    expect(screen.getByText(/latest update/i)).toBeDefined();
  });

  it("has correct light/dark theme classes on section title", () => {
    const { container } = renderSection();
    const title = container.querySelector("h2");
    expect(title?.className).toContain("dark:text-white");
    expect(title?.className).toContain("text-gray-900");
  });

  it("has correct light/dark theme classes on inactive tabs", () => {
    renderSection();
    const tabs = screen.getAllByRole("button");
    // Second tab is inactive
    const inactiveTab = tabs[1];
    expect(inactiveTab.className).toContain("dark:text-gray-400");
    expect(inactiveTab.className).toContain("dark:bg-navy-900/40");
    expect(inactiveTab.className).toContain("bg-white/60");
  });
});
