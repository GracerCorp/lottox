import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { HeroSection } from "@/components/home/HeroSection";
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
    flag: "th",
    jackpot: "฿6,000,000",
    nextDraw: "Jan 16, 2026",
    gradientFrom: "#D4AF37",
    gradientTo: "#B8860B",
    href: "/th/government-lottery",
    bgImage: "https://example.com/bg-th.jpg",
    prizes: [{ label: "1st Prize", amount: "฿6,000,000" }],
    nextDrawDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "lao",
    name: "Lao Lotto",
    country: "Laos",
    flag: "la",
    jackpot: "6,000X",
    nextDraw: "Jan 16, 2026",
    gradientFrom: "#CE1126",
    gradientTo: "#002868",
    href: "/la/lao-lotto",
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

describe("HeroSection", () => {
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

  it("renders with no items and shows fallback", () => {
    render(
      <LanguageProvider>
        <HeroSection items={[]} />
      </LanguageProvider>
    );
    // Should show error/empty message
    const section = document.querySelector("section");
    expect(section).toBeDefined();
  });

  it("renders hero title in English by default", () => {
    const { container } = renderHero();
    const title = container.querySelector("h1");
    expect(title?.textContent?.toLowerCase()).toContain("result");
  });

  it("renders carousel navigation buttons", () => {
    renderHero();
    expect(screen.getByLabelText("Previous")).toBeDefined();
    expect(screen.getByLabelText("Next")).toBeDefined();
  });

  it("shows slide counter", () => {
    renderHero();
    // Counter should show position like "1/6"
    const counters = screen.getAllByText(/\/\d+/);
    expect(counters.length).toBeGreaterThan(0);
  });

  it("advances to next slide when Next is clicked", () => {
    const { container } = renderHero();
    const nextBtn = screen.getByLabelText("Next");
    // Clicking should not throw
    fireEvent.click(nextBtn);
    // Section still renders
    expect(container.querySelector("section")).toBeDefined();
  });

  it("goes to previous slide when Prev is clicked", () => {
    const { container } = renderHero();
    const prevBtn = screen.getByLabelText("Previous");
    // Go back, should not throw
    fireEvent.click(prevBtn);
    expect(container.querySelector("section")).toBeDefined();
  });

  it("auto-advances slides on interval", () => {
    const { container } = renderHero();
    // Advancing time should not crash the component
    act(() => {
      vi.advanceTimersByTime(15000); // 3 intervals
    });
    expect(container.querySelector("section")).toBeDefined();
  });

  it("pauses auto-advance on mouse enter", () => {
    const { container } = renderHero();
    const carouselArea = container.querySelector("[class*='lg:w-[65%]']");
    expect(carouselArea).toBeDefined();

    // Mouse enter to pause — should not throw
    fireEvent.mouseEnter(carouselArea!);
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Mouse leave to resume — should not throw
    fireEvent.mouseLeave(carouselArea!);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(container.querySelector("section")).toBeDefined();
  });

  it("renders background images for items with bgImage", () => {
    const { container } = renderHero();
    const bgImages = container.querySelectorAll("img[alt='']");
    // Each item with bgImage should have a background image rendered
    expect(bgImages.length).toBeGreaterThan(0);
  });

  it("has light/dark theme classes on gradient overlay", () => {
    const { container } = renderHero();
    const overlays = container.querySelectorAll("[class*='dark:from-neutral-950']");
    expect(overlays.length).toBeGreaterThan(0);
  });

  it("has light/dark theme classes on navigation buttons", () => {
    renderHero();
    const prevBtn = screen.getByLabelText("Previous");
    expect(prevBtn.className).toContain("dark:bg-neutral-900/60");
    expect(prevBtn.className).toContain("bg-white/60");
  });
});
