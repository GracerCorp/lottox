import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CountryMarqueeSection } from "@/components/home/CountryMarqueeSection";

const mockCountries = [
  { id: "us", name: "USA", count: 5, flag: "us" },
  { id: "uk", name: "UK", count: 3, flag: "gb" },
  { id: "au", name: "Australia", count: 2, flag: "au" },
  { id: "ca", name: "Canada", count: 4, flag: "ca" },
];

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      countryList: {
        title: "Lottery By Country",
        subtitle: "Browse available lotteries by country and explore their latest results.",
        lotteries: "lottery",
        countries: {
          us: "USA",
          uk: "UK",
          au: "Australia",
          ca: "Canada",
        },
      },
    },
  }),
}));

describe("CountryMarqueeSection", () => {
  it("does not render when no countries are provided", () => {
    const { container } = render(<CountryMarqueeSection countries={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the title and subtitle correctly", () => {
    render(<CountryMarqueeSection countries={mockCountries} />);
    expect(screen.getByText("Lottery By Country")).toBeInTheDocument();
    expect(screen.getByText("Browse available lotteries by country and explore their latest results.")).toBeInTheDocument();
  });

  it("splits countries into two rows and renders appropriately", () => {
    // 4 countries split into 2 rows of 2.
    // Each row renders the items twice (2 copies of 2 items = 4 DOM nodes per row total).
    render(<CountryMarqueeSection countries={mockCountries} />);
    
    // USA and UK will be in row 1, rendered twice.
    const usaElements = screen.getAllByText("USA");
    expect(usaElements).toHaveLength(2);

    const ukElements = screen.getAllByText("UK");
    expect(ukElements).toHaveLength(2);

    // Australia and Canada will be in row 2, rendered twice.
    const auElements = screen.getAllByText("Australia");
    expect(auElements).toHaveLength(2);

    const caElements = screen.getAllByText("Canada");
    expect(caElements).toHaveLength(2);
  });
});
