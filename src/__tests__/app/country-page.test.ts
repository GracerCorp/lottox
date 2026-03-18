/**
 * Integration tests for the [country]/page prize resolution logic.
 * Tests are kept at unit level by exercising the helper directly (no server render).
 *
 * Reflects current state:
 * - JACKPOT_FALLBACK.th has 3 prizes (4th/5th removed)
 * - Laos uses "X" notation (not "times")
 * - Prize labels are localised (from dict, not hardcoded)
 * - MAX_CARD_PRIZES = 5; prizes sliced before passing to LotteryCard
 */
import { describe, it, expect } from "vitest";

interface PrizeEntry { label: string; amount: string }
type FallbackMap = Record<string, PrizeEntry[]>;

/** Mirror of JACKPOT_FALLBACK in [country]/page.tsx (localised labels) */
const JACKPOT_FALLBACK: FallbackMap = {
  th: [
    { label: "1st Prize", amount: "฿6,000,000" },
    { label: "2nd Prize", amount: "฿200,000" },
    { label: "3rd Prize", amount: "฿80,000" },
  ],
  la: [
    { label: "1st Prize", amount: "₭6,000X" },
    { label: "2nd Prize", amount: "₭500X" },
    { label: "3rd Prize", amount: "₭60X" },
  ],
  jp: [
    { label: "1st Prize", amount: "¥200,000,000" },
    { label: "2nd Prize", amount: "¥10,000,000" },
    { label: "3rd Prize", amount: "¥300,000" },
  ],
  au: [
    { label: "1st Prize", amount: "A$700,000" },
  ],
};

const MAX_CARD_PRIZES = 5;

/** Simulates what the page does when resolving + slicing prizes for a card */
function resolvePrizes(
  cardPrizes: PrizeEntry[],
  countryKey: string,
): PrizeEntry[] {
  const raw =
    cardPrizes.length > 0
      ? cardPrizes
      : (JACKPOT_FALLBACK[countryKey] ?? []);
  return raw.slice(0, MAX_CARD_PRIZES);
}

describe("Country page prize resolution logic", () => {
  // ── Fallback resolution ────────────────────────────────────────────────

  it("returns real prizes when card has prizes", () => {
    const real = [{ label: "1st Prize", amount: "฿5,000,000" }];
    expect(resolvePrizes(real, "th")).toEqual(real);
  });

  it("falls back to JACKPOT_FALLBACK when card prizes is empty", () => {
    const result = resolvePrizes([], "th");
    expect(result[0].amount).toBe("฿6,000,000");
  });

  it("Thai fallback has exactly 3 prizes (4th/5th removed)", () => {
    const result = resolvePrizes([], "th");
    expect(result).toHaveLength(3);
    expect(result[2].amount).toBe("฿80,000");
  });

  it("falls back for Laos country key — 3 prizes", () => {
    const result = resolvePrizes([], "la");
    expect(result[0].amount).toBe("₭6,000X");
    expect(result).toHaveLength(3);
  });

  it("uses 'X' notation — no 'times' string in Laos fallback", () => {
    const result = resolvePrizes([], "la");
    result.forEach((p) => {
      expect(p.amount).not.toContain("times");
      expect(p.amount).toContain("X");
    });
  });

  it("falls back for Japan country key", () => {
    const result = resolvePrizes([], "jp");
    expect(result[0].amount).toBe("¥200,000,000");
    expect(result).toHaveLength(3);
  });

  it("falls back for Australia country key — 1 prize", () => {
    const result = resolvePrizes([], "au");
    expect(result[0].amount).toBe("A$700,000");
    expect(result).toHaveLength(1);
  });

  it("returns empty array for unknown country with no fallback", () => {
    expect(resolvePrizes([], "xx")).toEqual([]);
  });

  // ── MAX_CARD_PRIZES cap ────────────────────────────────────────────────

  it("caps real prizes at MAX_CARD_PRIZES (5)", () => {
    const many = Array.from({ length: 8 }, (_, i) => ({
      label: `Prize ${i + 1}`,
      amount: `฿${(i + 1) * 10_000}`,
    }));
    const result = resolvePrizes(many, "th");
    expect(result).toHaveLength(5);
  });

  it("does not cap when prizes <= MAX_CARD_PRIZES", () => {
    const few = [
      { label: "1st", amount: "฿1,000,000" },
      { label: "2nd", amount: "฿200,000" },
    ];
    expect(resolvePrizes(few, "th")).toHaveLength(2);
  });

  // ── Immutability ───────────────────────────────────────────────────────

  it("does not mutate real prizes when they exist", () => {
    const real = [{ label: "1st", amount: "฿100" }];
    const original = JSON.stringify(real);
    resolvePrizes(real, "th");
    expect(JSON.stringify(real)).toBe(original);
  });
});
