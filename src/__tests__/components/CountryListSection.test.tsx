import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountryListSection } from "@/components/home/CountryListSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill ? "true" : undefined} />;
  },
}));

const mockCountries = [
  { id: "th", name: "Thailand", count: 3, flag: "th" },
  { id: "la", name: "Laos", count: 2, flag: "la" },
  { id: "vn", name: "Vietnam", count: 1, flag: "vn" },
];

function renderSection(countries = mockCountries) {
  return render(
    <LanguageProvider>
      <CountryListSection countries={countries} />
    </LanguageProvider>
  );
}

describe("CountryListSection", () => {
  it("renders section title in English", () => {
    renderSection();
    expect(screen.getByText(/lottery by country/i)).toBeDefined();
  });

  it("renders all country chips", () => {
    renderSection();
    expect(screen.getByText("Thailand")).toBeDefined();
    expect(screen.getByText("Laos")).toBeDefined();
    expect(screen.getByText("Vietnam")).toBeDefined();
  });

  it("renders correct lottery counts", () => {
    renderSection();
    expect(screen.getByText(/3 lotteries/i)).toBeDefined();
    expect(screen.getByText(/2 lotteries/i)).toBeDefined();
  });

  it("renders flag images for each country", () => {
    const { container } = renderSection();
    const flags = container.querySelectorAll("img");
    expect(flags.length).toBe(mockCountries.length);
  });

  it("creates correct links for each country", () => {
    const { container } = renderSection();
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(mockCountries.length);
    expect(links[0].getAttribute("href")).toBe("/th");
    expect(links[1].getAttribute("href")).toBe("/la");
  });

  it("uses grid layout", () => {
    const { container } = renderSection();
    const grid = container.querySelector("[class*='grid']");
    expect(grid).toBeDefined();
    expect(grid?.className).toContain("grid-cols-2");
  });

  it("renders with empty countries array", () => {
    renderSection([]);
    expect(screen.getByText(/lottery by country/i)).toBeDefined();
  });

  it("has correct light/dark theme classes on chips", () => {
    const { container } = renderSection();
    const chip = container.querySelector("a");
    expect(chip?.className).toContain("dark:bg-navy-900/60");
    expect(chip?.className).toContain("bg-white/60");
    expect(chip?.className).toContain("dark:border-white/10");
    expect(chip?.className).toContain("border-gray-200");
  });

  it("has correct light/dark theme classes on title", () => {
    const { container } = renderSection();
    const title = container.querySelector("h2");
    expect(title?.className).toContain("dark:text-white");
    expect(title?.className).toContain("text-gray-900");
  });

  it("has correct light/dark theme classes on country names", () => {
    const { container } = renderSection();
    const names = container.querySelectorAll("span.font-bold");
    expect(names[0]?.className).toContain("dark:text-white");
    expect(names[0]?.className).toContain("text-gray-900");
  });
});
