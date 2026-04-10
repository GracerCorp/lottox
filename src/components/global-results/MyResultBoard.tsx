"use client";

import { useState, useCallback, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PinnedLotteryTabs } from "./PinnedLotteryTabs";
import { ResultBoardCard } from "./ResultBoardCard";
import { AddLotteryModal } from "./AddLotteryModal";
import type { PinnedLottery } from "@/lib/api-types";
import { getPinnedLotteries, setPinnedLotteries } from "@/lib/utils/cookies";

const MAX_PINNED = 6;

export function MyResultBoard() {
  const { t } = useLanguage();
  const mb = t.staticParams.myBoard;

  // Use lazy initializer to load from localStorage immediately on client.
  // The `hydrated` flag prevents flash of empty state during SSR/hydration.
  const [hydrated, setHydrated] = useState(false);
  const [pinned, setPinned] = useState<PinnedLottery[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Load pinned lotteries from cookies after hydration
  useEffect(() => {
    setTimeout(() => {
      setPinned(getPinnedLotteries());
      setHydrated(true);
    }, 0);
  }, []);

  /** Handle batch confirm from AddLotteryModal */
  const handleConfirm = useCallback(
    (selected: PinnedLottery[]) => {
      const next = selected.slice(0, MAX_PINNED);
      setPinned(next);
      setPinnedLotteries(next);
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
      setPinnedLotteries(next);
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
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-sm transition-colors"
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
      ) : hydrated ? (
        <div
          className="text-center py-16 text-gray-500"
          data-testid="empty-board-state"
        >
          <div className="text-4xl mb-2">📋</div>
          <p className="text-sm">{mb.noLotteryPinned}</p>
        </div>
      ) : null}

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
