/* eslint-disable @next/next/no-img-element */
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/link
vi.mock("next/link", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <img {...props} alt="" />,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Home: (props: any) => <span data-testid="home-icon" {...props} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Search: (props: any) => <span data-testid="search-icon" {...props} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ArrowRight: (props: any) => <span data-testid="arrow-icon" {...props} />,
}));

// Mock LanguageContext
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      common: {
        pageNotFound: "Page Not Found",
        pageNotFoundDesc: "The page you're looking for doesn't exist or has been moved.",
        goHome: "Go Home",
      },
    },
    language: "en",
    toggleLanguage: vi.fn(),
  }),
}));

import NotFound from "@/app/not-found";

describe("NotFound (404 page)", () => {
  it("renders 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders translated title", () => {
    render(<NotFound />);
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("renders translated description", () => {
    render(<NotFound />);
    expect(screen.getByText("The page you're looking for doesn't exist or has been moved.")).toBeInTheDocument();
  });

  it("renders Go Home link pointing to /", () => {
    render(<NotFound />);
    const homeLink = screen.getByText("Go Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders popular lottery links", () => {
    render(<NotFound />);
    expect(screen.getByText("Thai Government Lottery")).toBeInTheDocument();
    expect(screen.getByText("Japan Loto 6")).toBeInTheDocument();
  });
});
