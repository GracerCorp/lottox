"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { LotteriesListResponse, PinnedLottery } from "@/lib/api-types";
import Image from "next/image";

interface AddLotteryModalProps {
  pinned: PinnedLottery[];
  onConfirm: (selected: PinnedLottery[]) => void;
  onClose: () => void;
}

const MAX_SELECTED = 6;

export function AddLotteryModal({ pinned, onConfirm, onClose }: AddLotteryModalProps) {
  const { t } = useLanguage();
  const mb = t.staticParams.myBoard;
  const { data, loading } = useApi<LotteriesListResponse>("/api/lotteries");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [selected, setSelected] = useState<PinnedLottery[]>(() => [...pinned]);

  // Auto-focus close button on mount
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Focus trap — cycle Tab within modal
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  const isSelected = (lotteryId: number) =>
    selected.some((s) => s.lotteryId === lotteryId);

  const toggleLottery = (lottery: PinnedLottery) => {
    setSelected((prev) => {
      if (prev.some((s) => s.lotteryId === lottery.lotteryId)) {
        return prev.filter((s) => s.lotteryId !== lottery.lotteryId);
      }
      if (prev.length >= MAX_SELECTED) return prev;
      return [...prev, lottery];
    });
  };

  const removeLottery = (lotteryId: number) => {
    setSelected((prev) => prev.filter((s) => s.lotteryId !== lotteryId));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={mb.pinYourLotteries}
      data-testid="add-lottery-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md mx-4 shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-2">
          <div>
            <h3 className="text-white font-bold text-lg">{mb.pinYourLotteries}</h3>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">
              {mb.pinLotteryHint}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={mb.close}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none ml-3 shrink-0"
            data-testid="modal-close"
          >
            &#x2297;
          </button>
        </div>

        {/* Scrollable Lottery List */}
        <div
          className="overflow-y-auto flex-1 mx-4 my-3 rounded-xl bg-neutral-950/60 border border-white/5"
          data-testid="lottery-list"
        >
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            </div>
          )}

          {!loading &&
            data?.countries.map((country) => (
              <div key={country.code}>
                {/* Country Header */}
                <div className="px-4 py-2 text-gray-400 text-xs font-medium tracking-wide">
                  {country.name}
                </div>

                {/* Lottery Items */}
                {country.lotteries.map((lottery) => {
                  const checked = isSelected(lottery.id);
                  const pinnedItem: PinnedLottery = {
                    lotteryId: lottery.id,
                    lotteryName: lottery.name,
                    logo: lottery.logo,
                    countryCode: country.code.toLowerCase(),
                  };
                  const disabled =
                    !checked && selected.length >= MAX_SELECTED;

                  return (
                    <button
                      key={lottery.id}
                      onClick={() => !disabled && toggleLottery(pinnedItem)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                        disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-white/5 cursor-pointer"
                      }`}
                      disabled={disabled}
                      data-testid={`lottery-option-${lottery.id}`}
                    >
                      {/* Checkbox */}
                      <span
                        className={`w-5 h-5 rounded shrink-0 flex items-center justify-center border transition-colors ${
                          checked
                            ? "bg-amber-400 border-amber-400"
                            : "border-gray-600 bg-transparent"
                        }`}
                        data-testid={`lottery-checkbox-${lottery.id}`}
                      >
                        {checked && (
                          <svg
                            className="w-3 h-3 text-neutral-950"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>

                      {/* Logo */}
                      {lottery.logo && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white/10">
                          <Image
                            src={lottery.logo}
                            alt={lottery.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Name */}
                      <span className="text-white text-sm font-semibold">
                        {lottery.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
        </div>

        {/* Selected Lotteries Strip */}
        {selected.length > 0 && (
          <div className="px-5 pb-2">
            <p className="text-gray-400 text-xs font-medium mb-2">
              {mb.selectedLotteries}
            </p>
            <div
              className="flex gap-2 overflow-x-auto pt-1 pb-1"
              data-testid="selected-strip"
            >
              {selected.map((s) => (
                <div key={s.lotteryId} className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                    {s.logo ? (
                      <Image
                        src={s.logo}
                        alt={s.lotteryName}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-white text-xs font-bold">
                        {s.lotteryName.charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* Remove badge */}
                  <button
                    onClick={() => removeLottery(s.lotteryId)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                    aria-label={`Remove ${s.lotteryName}`}
                    data-testid={`remove-selected-${s.lotteryId}`}
                  >
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <div className="px-5 pb-5 pt-2">
          <button
            onClick={() => onConfirm(selected)}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-sm transition-colors"
            data-testid="confirm-button"
          >
            {mb.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
