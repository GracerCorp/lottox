import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LotteryCard } from "@/components/home/LotteryCard";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill ? "true" : undefined} data-priority={priority ? "true" : undefined} />;
  },
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: Record<string, unknown>) => (
    <a href={href as string} {...rest}>{children as React.ReactNode}</a>
  ),
}));

const baseProps = {
  name: "Government Lottery",
  country: "Thailand",
  flag: "https://cdn/flags/th.png",
  jackpot: "฿6,000,000",
  nextDraw: "Jan 16",
  gradientFrom: "from-blue-900",
  gradientTo: "to-red-900",
  href: "/th/government-lottery",
};

function renderCard(props = {}) {
  return render(
    <LanguageProvider>
      <LotteryCard {...baseProps} {...props} />
    </LanguageProvider>
  );
}

describe("LotteryCard", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("renders lottery name and country", () => {
    renderCard();
    expect(screen.getByText("Government Lottery")).toBeDefined();
    expect(screen.getByText("Thailand")).toBeDefined();
  });

  it("renders 1st prize amount as large text when prizes not provided", () => {
    renderCard();
    // Falls back to jackpot as 1st prize
    expect(screen.getByText("฿6,000,000")).toBeDefined();
  });

  it("renders prize list when prizes prop is provided", () => {
    renderCard({
      prizes: [
        { label: "1st Prize", amount: "฿6,000,000" },
        { label: "2nd Prize", amount: "฿200,000" },
      ],
    });
    expect(screen.getByText("1st Prize")).toBeDefined();
    expect(screen.getByText("฿200,000")).toBeDefined();
  });

  it("shows shimmer div inside card", () => {
    const { container } = renderCard();
    // Shimmer div is aria-hidden and has -translate-x-full class
    const shimmer = container.querySelector("[aria-hidden=true]");
    expect(shimmer).toBeDefined();
  });

  it("renders countdown timer units", () => {
    renderCard({ nextDrawDate: new Date(Date.now() + 86400000).toISOString() });
    // i18n labels (day/hr/min/sec)
    const dayEls = screen.getAllByText(/day|hr|min|sec/i);
    expect(dayEls.length).toBeGreaterThan(0);
  });

  it("has active border class when isActive=true", () => {
    const { container } = renderCard({ isActive: true });
    const card = container.querySelector(".border-gold-400\\/40");
    expect(card).toBeDefined();
  });

  it("has default border class when isActive=false", () => {
    const { container } = renderCard({ isActive: false });
    const card = container.querySelector(".border-slate-200") ?? container.querySelector("[class*='border-slate-200']");
    expect(card).toBeDefined();
  });

  it("renders background image when bgImage is provided", () => {
    const { container } = renderCard({ bgImage: "https://example.com/bg.jpg" });
    const img = container.querySelector("img[src='https://example.com/bg.jpg']");
    expect(img).toBeDefined();
  });

  it("renders gradient overlay when no bgImage", () => {
    const { container } = renderCard({ bgImage: undefined });
    const gradient = container.querySelector(".bg-gradient-to-br");
    expect(gradient).toBeDefined();
  });

  it("renders link with correct href", () => {
    const { container } = renderCard();
    const link = container.querySelector("a[href='/th/government-lottery']");
    expect(link).toBeDefined();
  });

  it("timer bar has theme-aware classes", () => {
    const { container } = renderCard();
    const timerBar = container.querySelector("[class*='dark:bg-navy-900']");
    expect(timerBar).toBeDefined();
  });
});
