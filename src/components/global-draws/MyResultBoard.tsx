"use client";

import { useState, useCallback, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PinnedLotteryTabs } from "./PinnedLotteryTabs";
import { ResultBoardCard } from "./ResultBoardCard";
import { AddLotteryModal } from "./AddLotteryModal";
import type { PinnedLottery } from "./AddLotteryModal";

const STORAGE_KEY = "lottox_pinned_lotteries";
const MAX_PINNED = 6;

/** Read pinned lotteries from localStorage, auto-migrating old format */
function readPinned(): PinnedLottery[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    // Migration: old format had { countryCode, lotteryName } without lotteryId
    if (parsed.length > 0 && !("lotteryId" in parsed[0])) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed as unknown as PinnedLottery[];
  } catch {
    return [];
  }
}

function writePinned(pinned: PinnedLottery[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pinned));
  } catch { /* ignore */ }
}

export function MyResultBoard() {
  const { t } = useLanguage();
  const mb = t.staticParams.myBoard;

  // Initialize empty to avoid hydration mismatch (localStorage not available on server)
  const [pinned, setPinned] = useState<PinnedLottery[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Sync from localStorage after mount
  useEffect(() => {
    setPinned(readPinned());
  }, []);

  /** Handle batch confirm from AddLotteryModal */
  const handleConfirm = useCallback(
    (selected: PinnedLottery[]) => {
      const next = selected.slice(0, MAX_PINNED);
      setPinned(next);
      writePinned(next);
      // Keep active index in bounds
      setActiveIndex((prev) =>
        next.length === 0 ? 0 : Math.min(prev, next.length - 1)
      );
      setModalOpen(false);
    },
    [],
  );

  const handleRemove = useCallback(
    (lotteryId: number) => {
      const next = pinned.filter((p) => p.lotteryId !== lotteryId);
      setPinned(next);
      writePinned(next);
      setActiveIndex((prev) => Math.min(prev, Math.max(0, next.length - 1)));
    },
    [pinned],
  );

  const canAdd = pinned.length < MAX_PINNED;
  const activePinned = pinned[activeIndex] ?? null;

  return (
    <section data-testid="my-result-board">
      {/* Section Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mb.title}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{mb.subtitle}</p>
        </div>

        {canAdd && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold rounded-xl text-sm transition-colors"
            data-testid="add-lottery-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-4 h-4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {mb.addLottery}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-5">
        <PinnedLotteryTabs
          pinned={pinned}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>

      {/* Active Board Card */}
      {activePinned ? (
        <ResultBoardCard
          key={activePinned.lotteryId}
          lotteryName={activePinned.lotteryName}
          countryCode={activePinned.countryCode}
          onRemove={() => handleRemove(activePinned.lotteryId)}
        />
      ) : (
        <div
          className="text-center py-16 text-gray-500"
          data-testid="empty-board-state"
        >
          <div className="text-4xl mb-2">📋</div>
          <p className="text-sm">{mb.noLotteryPinned}</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <AddLotteryModal
          pinned={pinned}
          onConfirm={handleConfirm}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
