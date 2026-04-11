"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import { getFlagUrl } from "@/lib/flags";
import { DrawHistoryRow } from "./DrawHistoryRow";
import { BoardPagination } from "./BoardPagination";
import { slugify } from "@/lib/utils/lotteryUtils";
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
  logo?: string | null;
  onRemove?: () => void;
  pinned?: boolean;
  onTogglePin?: () => void;
  onMoveToTop?: () => void;
}

const PAGE_SIZE = 2;

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


export function ResultBoardCard({ lotteryName, countryCode, logo, onRemove, pinned, onTogglePin, onMoveToTop }: ResultBoardCardProps) {
  const { t } = useLanguage();
  const gd = t.staticParams.globalDraws;

  const apiUrl = `/api/results/global?country=${encodeURIComponent(countryCode)}&limit=20`;
  const { data, loading, error } = useApi<GlobalDrawsApiResponse>(apiUrl);

  const [page, setPage] = useState(1);

  const draws = data?.draws ?? [];
  const maxContentPages = Math.min(3, Math.ceil(draws.length / PAGE_SIZE));
  const totalPages = draws.length > 0 ? maxContentPages + 1 : 0;
  
  const paginated = draws.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const first = draws[0];
  const { digits6 } = first ? extractNumbers(first.data) : { digits6: "" };

  const handlePrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const handleNext = useCallback(() => setPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

  if (!loading && !error && draws.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-sm dark:shadow-none"
      data-testid={`result-board-card-${countryCode}`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-neutral-800/60 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`relative shrink-0 overflow-hidden rounded ${logo ? 'h-6 w-6' : 'h-4 w-6 shadow'}`}>
            <Image src={logo || getFlagUrl(countryCode)} alt={lotteryName} fill className={logo ? "object-contain" : "object-cover"} />
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
        <div className="flex items-center ml-2">
          {pinned && onMoveToTop && (
            <button
              onClick={onMoveToTop}
              title="Move to top"
              className="p-1 rounded text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}
          {onTogglePin && (
            <button
              onClick={onTogglePin}
              aria-label={pinned ? "Unpin" : "Pin"}
              className={`p-1 rounded transition-colors ${
                pinned 
                  ? "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                  : "text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500"
              }`}
              data-testid="pin-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 rotate-45"
                fill={pinned ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
            </button>
          )}
        </div>
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

        {!loading && !error && page === totalPages && (
          <div className="flex-1 flex items-center justify-center p-6 min-h-[140px]">
            <Link 
              href={`/${countryCode.toLowerCase()}/${slugify(lotteryName)}`}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold rounded-xl transition-colors shadow-sm"
            >
              View Lottery
            </Link>
          </div>
        )}

        {!loading && !error && page < totalPages && paginated.map((draw, idx) => {
          const row = extractNumbers(draw.data);
          let drawTime = "";
          let drawDate = "";
          let rawDateSlug = "";
          try {
            const dt = new Date(draw.drawDate);
            if (!isNaN(dt.getTime())) {
              const h = dt.getUTCHours().toString().padStart(2, "0");
              const mn = dt.getUTCMinutes().toString().padStart(2, "0");
              drawTime = `${h}:${mn}`;
              drawDate = dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit", timeZone: "UTC" });
              
              const yyyy = dt.getUTCFullYear();
              const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
              const dd = String(dt.getUTCDate()).padStart(2, '0');
              rawDateSlug = `${yyyy}-${mm}-${dd}`;
            }
          } catch { /* ignore */ }
          
          const href = rawDateSlug ? `/${countryCode.toLowerCase()}/${slugify(lotteryName)}/${rawDateSlug}` : undefined;
          
          return (
            <DrawHistoryRow
              key={idx}
              href={href}
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
