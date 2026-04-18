import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { CountdownTimer, useCountdown } from "@/components/ui/CountdownTimer";
import { renderHook } from "@testing-library/react";

describe("useCountdown", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns 0 when no targetDate provided", () => {
    const { result } = renderHook(() => useCountdown(undefined));
    // Initial state is always zeros (to prevent hydration mismatch)
    expect(result.current).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("returns correct remaining time after initial tick", () => {
    const future = new Date(Date.now() + 90_061_000).toISOString(); // 1d 1h 1m 1s
    const { result } = renderHook(() => useCountdown(future));
    // The hook uses setTimeout(…, 0) for initial value, so advance timers
    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current.days).toBe(1);
    expect(result.current.hours).toBe(1);
    expect(result.current.minutes).toBe(1);
    expect(result.current.seconds).toBe(1);
  });

  it("decrements every second", () => {
    const future = new Date(Date.now() + 5000).toISOString(); // 5 seconds
    const { result } = renderHook(() => useCountdown(future));
    act(() => { vi.advanceTimersByTime(1); }); // trigger initial setTimeout
    expect(result.current.seconds).toBe(5);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.seconds).toBe(4);
  });

  it("clamps to 0 when target is past", () => {
    const past = new Date(Date.now() - 10_000).toISOString();
    const { result } = renderHook(() => useCountdown(past));
    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("CountdownTimer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("renders DD : HH : MM : SS format", () => {
    const future = new Date(Date.now() + 90_061_000).toISOString(); // 1d 1h 1m 1s
    render(<CountdownTimer targetDate={future} />);
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByTestId("countdown-timer").textContent).toMatch(/01 : 01 : 01 : 01/);
  });

  it("renders 00 : 00 : 00 : 00 for past target", () => {
    const past = new Date(Date.now() - 10_000).toISOString();
    render(<CountdownTimer targetDate={past} />);
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByTestId("countdown-timer").textContent).toMatch(/00 : 00 : 00 : 00/);
  });

  it("applies className prop", () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    render(<CountdownTimer targetDate={future} className="test-class" />);
    expect(screen.getByTestId("countdown-timer").className).toContain("test-class");
  });

  it("has accessible aria-label", () => {
    const future = new Date(Date.now() + 3_600_000).toISOString();
    render(<CountdownTimer targetDate={future} />);
    expect(screen.getByTestId("countdown-timer").getAttribute("aria-label")).toContain("hours");
  });
});
