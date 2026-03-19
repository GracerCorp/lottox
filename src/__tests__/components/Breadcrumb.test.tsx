import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ChevronRight: (props: any) => <span data-testid="chevron" {...props} />,
}));

import { Breadcrumb, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";

describe("Breadcrumb", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Thailand", href: "/th" },
    { label: "Government Lottery", href: "/th/government-lottery-glo" },
    { label: "2025-03-16" },
  ];

  it("renders all breadcrumb items", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Thailand")).toBeInTheDocument();
    expect(screen.getByText("Government Lottery")).toBeInTheDocument();
    expect(screen.getByText("2025-03-16")).toBeInTheDocument();
  });

  it("renders nav with aria-label='Breadcrumb'", () => {
    render(<Breadcrumb items={items} />);
    const nav = screen.getByTestId("breadcrumb");
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("marks last item with aria-current='page'", () => {
    render(<Breadcrumb items={items} />);
    const lastItem = screen.getByText("2025-03-16");
    expect(lastItem).toHaveAttribute("aria-current", "page");
  });

  it("renders links for items with href", () => {
    render(<Breadcrumb items={items} />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("does not render link for last item", () => {
    render(<Breadcrumb items={items} />);
    const lastItem = screen.getByText("2025-03-16");
    expect(lastItem.tagName).toBe("SPAN");
  });

  it("renders separator chevrons between items", () => {
    render(<Breadcrumb items={items} />);
    const chevrons = screen.getAllByTestId("chevron");
    expect(chevrons).toHaveLength(items.length - 1); // no chevron before first item
  });

  it("returns null for empty items", () => {
    const { container } = render(<Breadcrumb items={[]} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("BreadcrumbJsonLd", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Thailand", href: "/th" },
    { label: "Draw Date" },
  ];

  it("renders script with application/ld+json type", () => {
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it("generates valid BreadcrumbList schema", () => {
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toHaveLength(3);
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[0].name).toBe("Home");
    expect(data.itemListElement[0].item).toBe("https://lottox.today/");
  });

  it("omits item URL for items without href", () => {
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    const lastItem = data.itemListElement[2];

    expect(lastItem.name).toBe("Draw Date");
    expect(lastItem.item).toBeUndefined();
  });
});
