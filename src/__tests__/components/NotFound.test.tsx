import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  );
});

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
  Home: (props: any) => <span data-testid="home-icon" {...props} />,
  Search: (props: any) => <span data-testid="search-icon" {...props} />,
  ArrowRight: (props: any) => <span data-testid="arrow-icon" {...props} />,
}));

// Mock LanguageContext
jest.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      common: {
        pageNotFound: "Page Not Found",
        pageNotFoundDesc: "The page you're looking for doesn't exist or has been moved.",
        goHome: "Go Home",
      },
    },
    language: "en",
    toggleLanguage: jest.fn(),
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
