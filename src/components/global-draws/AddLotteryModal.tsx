"use client";

import { useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { CountriesResponse } from "@/lib/api-types";
import Image from "next/image";
import { getFlagUrl } from "@/lib/flags";

interface AddLotteryModalProps {
  pinnedCodes: string[];
  onAdd: (countryCode: string, lotteryName: string) => void;
  onClose: () => void;
}

export function AddLotteryModal({ pinnedCodes, onAdd, onClose }: AddLotteryModalProps) {
  const { t } = useLanguage();
  const mb = t.staticParams.myBoard;
  const { data, loading } = useApi<CountriesResponse>("/api/countries");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const available =
    data?.countries.filter((c) => !pinnedCodes.includes(c.code.toLowerCase())) ?? [];

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={mb.selectLottery}
      data-testid="add-lottery-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-sm mx-4 shadow-2xl flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-white font-bold text-base">{mb.selectLottery}</h3>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={mb.close}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
            data-testid="modal-close"
          >
            &times;
          </button>
        </div>

        {/* Hint */}
        <p className="text-gray-500 text-xs px-5 py-2">{mb.selectHint}</p>

        {/* List */}
        <ul className="overflow-y-auto flex-1 px-5 pb-4" data-testid="country-list">
          {loading && (
            <li className="py-8 text-center">
              <div className="inline-block w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            </li>
          )}
          {!loading && available.length === 0 && (
            <li className="py-8 text-center text-gray-500 text-sm">{mb.maxPinned}</li>
          )}
          {!loading &&
            available.map((c) => (
              <li key={c.code}>
                <button
                  className="w-full flex items-center gap-3 py-3 hover:bg-white/5 rounded-xl px-2 transition-colors text-left"
                  onClick={() => onAdd(c.code.toLowerCase(), c.name)}
                  data-testid={`country-option-${c.code.toLowerCase()}`}
                >
                  <div className="relative h-5 w-7 shrink-0 overflow-hidden rounded shadow">
                    <Image
                      src={getFlagUrl(c.code)}
                      alt={c.code}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-white text-sm">{c.name}</span>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
