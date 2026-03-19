"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  targetDate: string | undefined;
  className?: string;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function useCountdown(targetDate?: string): TimeRemaining {
  const calc = useCallback((): TimeRemaining => {
    if (!targetDate) return { hours: 0, minutes: 0, seconds: 0 };
    const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
    return {
      hours: Math.floor(diff / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  }, [targetDate]);

  // Initialize with zeros to avoid hydration mismatch (Date.now() differs on server vs client)
  const [remaining, setRemaining] = useState<TimeRemaining>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setRemaining(calc());
    const id = setInterval(() => setRemaining(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  return remaining;
}

/**
 * Displays a live HH : MM : SS countdown to `targetDate`.
 */
export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const { hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <span
      className={className}
      aria-label={`${pad(hours)} hours ${pad(minutes)} minutes ${pad(seconds)} seconds`}
      data-testid="countdown-timer"
    >
      {pad(hours)} : {pad(minutes)} : {pad(seconds)}
    </span>
  );
}
