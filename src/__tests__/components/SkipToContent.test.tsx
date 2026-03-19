import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock LanguageContext
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: { common: { skipToContent: "Skip to content" } },
    language: "en",
    toggleLanguage: vi.fn(),
  }),
}));

import { SkipToContent } from "@/components/ui/SkipToContent";

describe("SkipToContent", () => {
  it("renders with correct href to #main", () => {
    render(<SkipToContent />);
    const link = screen.getByTestId("skip-to-content");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#main");
  });

  it("has sr-only class for screen readers", () => {
    render(<SkipToContent />);
    const link = screen.getByTestId("skip-to-content");
    expect(link.className).toContain("sr-only");
  });

  it("displays translated text", () => {
    render(<SkipToContent />);
    expect(screen.getByText("Skip to content")).toBeInTheDocument();
  });
});
