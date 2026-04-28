/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSectionV3 as HeroSection } from "@/components/home/HeroSectionV3";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, sizes, ...rest } = props;
    return (
      <img
        {...rest}
        data-fill={fill ? "true" : undefined}
        data-priority={priority ? "true" : undefined}
        data-sizes={sizes as string}
      />
    );
  },
}));

const mockItems = [
  {
    id: "glo",
    name: "Government Lottery",
    country: "Thailand",
    flag: "/th",
    jackpot: "฿6,000,000",
    nextDraw: "Jan 16, 2026",
    gradientFrom: "#D4AF37",
    gradientTo: "#B8860B",
    href: "/country/th/government-lottery",
    bgImage: "https://example.com/bg-th.jpg",
    prizes: [{ label: "1st Prize", amount: "฿6,000,000" }],
    nextDrawDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "lao",
    name: "Lao Lotto",
    country: "Laos",
    flag: "/la",
    jackpot: "6,000X",
    nextDraw: "Jan 16, 2026",
    gradientFrom: "#CE1126",
    gradientTo: "#002868",
    href: "/country/la/lao-lotto",
    bgImage: "https://example.com/bg-la.jpg",
    prizes: [{ label: "1st Prize", amount: "6,000X" }],
    nextDrawDate: new Date(Date.now() + 172800000).toISOString(),
  },
];

function renderHero(props = {}) {
  return render(
    <LanguageProvider>
      <HeroSection items={mockItems} {...props} />
    </LanguageProvider>
  );
}

describe("HeroSection (V3)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without crashing with items", () => {
    const { container } = renderHero();
    const h1 = container.querySelector("h1");
    expect(h1).toBeDefined();
    expect(h1?.textContent?.toLowerCase()).toContain("worldwide");
  });

  it("renders with no items without crashing", () => {
    render(
      <LanguageProvider>
        <HeroSection items={[]} />
      </LanguageProvider>
    );
    const section = document.querySelector("section");
    expect(section).toBeDefined();
  });

  it("renders hero title text", () => {
    const { container } = renderHero();
    const title = container.querySelector("h1");
    expect(title?.textContent?.toLowerCase()).toContain("result");
  });

  it("renders the action chips and Explore Global Results button", async () => {
    // Use real timers for this test — findByText needs real setTimeout for polling
    vi.useRealTimers();
    renderHero();
    expect(screen.getByText("Explore Global Results")).toBeDefined();
    expect(screen.getByText("Trending")).toBeDefined();
    // "Southeast Asia" loads asynchronously from /api/regions
    await screen.findByText("Southeast Asia");
    // Re-enable fake timers for afterEach cleanup
    vi.useFakeTimers();
  });

  it("renders background images for items with bgImage", () => {
    const { container } = renderHero();
    const bgImages = container.querySelectorAll("img[alt='Government Lottery']");
    expect(bgImages.length).toBeGreaterThan(0);
  });
});

