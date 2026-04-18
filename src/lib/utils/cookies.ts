import { PinnedLottery } from "@/lib/api-types";

const PINNED_LOTTERIES_KEY = "lottox_pinned_lotteries";

/**
 * Parses the cookie string and returns the pinned lotteries array.
 * Works both on client and server contexts (when passing the cookie string).
 */
export function getPinnedLotteries(cookieString?: string): PinnedLottery[] {
  let cookies = cookieString;
  
  if (!cookies && typeof document !== "undefined") {
    cookies = document.cookie;
  }

  if (!cookies) return [];

  const match = cookies.match(new RegExp(`(^| )${PINNED_LOTTERIES_KEY}=([^;]+)`));
  if (match && match[2]) {
    try {
      return JSON.parse(decodeURIComponent(match[2])) as PinnedLottery[];
    } catch {
      return [];
    }
  }

  return [];
}

/**
 * Saves the pinned lotteries array to a cookie (Client-side only).
 */
export function setPinnedLotteries(pinned: PinnedLottery[]): void {
  if (typeof document !== "undefined") {
    const value = encodeURIComponent(JSON.stringify(pinned));
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `${PINNED_LOTTERIES_KEY}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
  }
}

/**
 * Toggles a lottery pin state and returns the new array.
 */
export function togglePinnedLottery(lottery: PinnedLottery, maxPinned: number = 9): PinnedLottery[] {
  let pinned = getPinnedLotteries();
  const exists = pinned.some((p) => p.lotteryId === lottery.lotteryId);

  if (exists) {
    pinned = pinned.filter((p) => p.lotteryId !== lottery.lotteryId);
  } else {
    // Push new logic to index 0
    if (pinned.length < maxPinned) {
      pinned.unshift(lottery);
    }
  }

  setPinnedLotteries(pinned);
  return pinned;
}

/**
 * Moves an already pinned lottery to the beginning of the pinned array.
 */
export function movePinnedLotteryToTop(lotteryId: number): PinnedLottery[] {
  const pinned = getPinnedLotteries();
  const index = pinned.findIndex(p => p.lotteryId === lotteryId);
  
  if (index > 0) {
    const item = pinned[index];
    pinned.splice(index, 1);
    pinned.unshift(item);
    setPinnedLotteries(pinned);
  }
  
  return pinned;
}
