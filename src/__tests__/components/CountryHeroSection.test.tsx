import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountryHeroSection } from "@/components/country/CountryHeroSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, alt, src, ...rest } = props;
    return (
      <img
        {...rest}
        src={src as string}
        alt={alt as string}
        data-fill={fill ? "true" : undefined}
        data-priority={priority ? "true" : undefined}
      />
    );
  },
}));

function renderWithProvider(ui: React.ReactNode) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe("CountryHeroSection", () => {
  it("renders country name", () => {
    renderWithProvider(
      <CountryHeroSection countryName="Thailand" countryCode="th" flag={null} />,
    );
    expect(screen.getByTestId("country-name")).toHaveTextContent("Thailand");
  });

  it("renders official-results label", () => {
    renderWithProvider(
      <CountryHeroSection countryName="Japan" countryCode="jp" flag={null} />,
    );
    const label = screen.getByTestId("official-results-label");
    expect(label).toBeInTheDocument();
    // Should contain some text (either translated or fallback)
    expect(label.textContent).toBeTruthy();
  });

  it("renders flag image when flag URL is provided", () => {
    const flagUrl = "https://example.com/th.png";
    renderWithProvider(
      <CountryHeroSection
        countryName="Thailand"
        countryCode="th"
        flag={flagUrl}
      />,
    );
    const flagEl = screen.getByTestId("country-flag");
    expect(flagEl).toBeInTheDocument();
    const img = flagEl.querySelector("img");
    expect(img).toHaveAttribute("src", flagUrl);
    expect(img).toHaveAttribute("alt", "Thailand flag");
  });

  it("renders placeholder when no flag provided", () => {
    renderWithProvider(
      <CountryHeroSection countryName="Japan" countryCode="jp" flag={null} />,
    );
    const placeholder = screen.getByTestId("country-flag-placeholder");
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent("JP");
  });

  it("renders the section wrapper with correct test-id", () => {
    renderWithProvider(
      <CountryHeroSection
        countryName="Australia"
        countryCode="au"
        flag={null}
      />,
    );
    expect(screen.getByTestId("country-hero")).toBeInTheDocument();
  });
});
