"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import { getFlagUrl } from "@/lib/flags";
import { DrawHistoryRow } from "./DrawHistoryRow";
import { BoardPagination } from "./BoardPagination";
import type { LatestResultsResponse } from "@/lib/api-types";

/** Shape of our formatLotteryResult responses. Extended from the LatestResult contract. */
type FormattedDraw = LatestResultsResponse["results"][0] & { drawDate: string };

interface GlobalDrawsApiResponse {
  draws: FormattedDraw[];
  total: number;
  page: number;
  totalPages: number;
}

interface ResultBoardCardProps {
  lotteryName: string;
  countryCode: string;
  onRemove?: () => void;
  pinned?: boolean;
  onTogglePin?: () => void;
}

const PAGE_SIZE = 5;

function extractNumbers(data: unknown): {
  digits6: string;
  digits3First: string;
  digits3Last: string;
  digits2Last: string;
} {
  const empty = { digits6: "", digits3First: "", digits3Last: "", digits2Last: "" };
  if (!data || typeof data !== "object") return empty;
  const d = data as unknown as Record<string, unknown>;
  const prizes = Array.isArray(d.prizes) ? (d.prizes as Record<string, unknown>[]) : [];
  let digits6 = "";
  let digits3First = "";
  let digits3Last = "";
  let digits2Last = "";

  for (const p of prizes) {
    if (!p.winningNumbers) continue;
    const cat = String(p.category ?? "").toLowerCase();
    const nums = Array.isArray(p.winningNumbers) ? (p.winningNumbers as unknown[]).map(String) : [];

    // TH & LA main prizes
    if (["prize_1", "prize_4_digits", "firstprize", "prize_1_thai"].includes(cat)) {
      digits6 = nums[0] ?? "";
    }
    // TH front-3, back-3, back-2
    if (["running_number_front_3", "prize3front"].includes(cat)) digits3First = nums.slice(0, 2).join(", ");
    if (["running_number_back_3", "prize3back", "prize_3_digits"].includes(cat)) digits3Last = nums.slice(0, 2).join(", ");
    if (["running_number_back_2", "prize2", "prize_2_digits"].includes(cat)) digits2Last = nums[0] ?? "";

    // AU — Main Numbers → show as primary, Powerball → digits2Last, Supplementary → digits3Last
    if (cat === "main numbers" || cat === "main_numbers") {
      digits6 = nums.join(" ");
    }
    if (cat === "powerball") {
      digits2Last = nums[0] ?? "";
    }
    if (cat === "supplementary" || cat === "supplementary numbers") {
      digits3Last = nums.join(", ");
    }

    // JP — number_selection_1 through 6 or similar
    if (cat.startsWith("number_selection") || cat === "honban" || cat === "selected_numbers") {
      digits6 = nums.join(" ");
    }
    if (cat === "bonus" || cat === "bonus_number") {
      digits2Last = nums[0] ?? "";
    }
  }

  // Fallback: if nothing matched, use the first prize's numbers as the main display
  if (!digits6 && prizes.length > 0) {
    for (const p of prizes) {
      const nums = Array.isArray(p.winningNumbers) ? (p.winningNumbers as unknown[]).map(String) : [];
      if (nums.length > 0) {
        digits6 = nums.join(" ");
        break;
      }
    }
  }

  return { digits6, digits3First, digits3Last, digits2Last };
}


export function ResultBoardCard({ lotteryName, countryCode, onRemove, pinned, onTogglePin }: ResultBoardCardProps) {
  const { t } = useLanguage();
  const gd = t.staticParams.globalDraws;

  const apiUrl = `/api/results/global?country=${encodeURIComponent(countryCode)}&limit=20`;
  const { data, loading, error } = useApi<GlobalDrawsApiResponse>(apiUrl);

  const [page, setPage] = useState(1);

  const draws = data?.draws ?? [];
  const totalPages = Math.max(1, Math.ceil(draws.length / PAGE_SIZE));
  const paginated = draws.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const first = draws[0];
  const { digits6 } = first ? extractNumbers(first.data) : { digits6: "" };

  const handlePrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const handleNext = useCallback(() => setPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

  return (
    <div
      className="bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-sm dark:shadow-none"
      data-testid={`result-board-card-${countryCode}`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-neutral-800/60 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative h-4 w-6 shrink-0 overflow-hidden rounded shadow">
            <Image src={getFlagUrl(countryCode)} alt={countryCode} fill className="object-cover" />
          </div>
          <span className="text-gray-900 dark:text-white text-sm font-bold truncate">{lotteryName}</span>
        </div>
        {/* Latest main number */}
        {digits6 && (
          <span className="text-amber-600 dark:text-amber-400 font-black text-sm tabular-nums ml-2">{digits6}</span>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            aria-label="Remove"
            className="ml-2 p-1 rounded text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            data-testid="remove-button"
          >
            &times;
          </button>
        )}
        {onTogglePin && (
          <button
            onClick={onTogglePin}
            aria-label={pinned ? "Unpin" : "Pin"}
            className={`ml-2 p-1 rounded transition-colors ${
              pinned 
                ? "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                : "text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500"
            }`}
            data-testid="pin-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={pinned ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={pinned ? 1 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5v14"
                transform={pinned ? "rotate(45 12 12)" : ""}
                style={{ display: pinned ? 'none' : 'block' }}
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.155 10.518C16.892 9.043 17 6.444 17 6H7c0 .444.108 3.043.845 4.518a4 4 0 001.077 1.341c.214.168.423.361.616.587l.793.924C11.135 14.185 11.5 15.066 11.5 16v3.5a.5.5 0 001 0V16c0-.934.365-1.815 1.169-2.63l.793-.924a4.015 4.015 0 00.616-.587 4 4 0 001.077-1.341z"
                style={{ display: pinned ? 'block' : 'none' }}
              />
              {!pinned && (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.3c.7-1.4.9-3.9.9-4.3H8.1c0 .4.2 2.9.9 4.3.4.8 1 1.5 1.5 2.1l.6.7c.4.5.6 1.1.6 1.7V18l.6 1v-4.2c0-.6.2-1.2.6-1.7l.6-.7c.5-.6 1.1-1.3 1.5-2.1z" />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        {loading && (
          <div className="p-4 animate-pulse" data-testid="board-card-loading">
            <div className="h-4 bg-slate-100 dark:bg-neutral-700/60 rounded mb-2" />
            <div className="h-4 bg-slate-100 dark:bg-neutral-700/60 rounded mb-2 w-3/4" />
          </div>
        )}
        {error && !loading && (
          <p className="text-red-500 dark:text-red-400 text-xs p-4" data-testid="board-card-error">{gd.errorLoading}</p>
        )}
        {!loading && !error && draws.length === 0 && (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500" data-testid="board-card-empty">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">{gd.noResults}</p>
          </div>
        )}
        {!loading && !error && paginated.map((draw, idx) => {
          const row = extractNumbers(draw.data);
          let drawTime = "";
          let drawDate = "";
          try {
            const dt = new Date(draw.drawDate);
            if (!isNaN(dt.getTime())) {
              const h = dt.getUTCHours().toString().padStart(2, "0");
              const mn = dt.getUTCMinutes().toString().padStart(2, "0");
              drawTime = `${h}:${mn}`;
              drawDate = dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit", timeZone: "UTC" });
            }
          } catch { /* ignore */ }
          return (
            <DrawHistoryRow
              key={idx}
              drawTime={drawTime}
              drawDate={drawDate}
              digits6={row.digits6}
              digits3First={row.digits3First}
              digits3Last={row.digits3Last}
              digits2Last={row.digits2Last}
              labels={{ digits6: gd.digits6, digits3First: gd.digits3First, digits3Last: gd.digits3Last, digits2Last: gd.digits2Last }}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {!loading && !error && draws.length > PAGE_SIZE && (
        <div className="border-t border-slate-200 dark:border-white/5 pb-2">
          <BoardPagination page={page} totalPages={totalPages} onPrev={handlePrev} onNext={handleNext} />
        </div>
      )}
    </div>
  );
}
