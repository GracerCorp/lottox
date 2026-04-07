"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import { getFlagUrl } from "@/lib/flags";
import { slugify } from "@/lib/utils/lotteryUtils";
import type { LatestResultsResponse } from "@/lib/api-types";

/* ─── Local types ────────────────────────────────────────────────────── */
interface PrizeNumbers {
  label: string;
  values: string[];
  amount?: string;
}

interface LatestDrawData {
  name: string;
  countryCode: string;
  drawTime: string;
  drawDate: string;
  mainNumbers: string[];
  firstPrizeAmount: string;
  prizes: PrizeNumbers[];
}

function extractLatestDrawData(result: LatestResultsResponse["results"][0]): LatestDrawData | null {
  if (!result) return null;

  const cc = result.countryCode ?? "th";
  const name = result.lotteryName ?? "Government Lottery (GLO)";

  let drawTime = "";
  let drawDate = "";
  try {
    const dt = new Date(result.drawDate || result.date);
    if (!isNaN(dt.getTime())) {
      drawDate = dt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
      // Only show time if it's not midnight UTC (i.e., date-only draws)
      const h = dt.getUTCHours();
      const m = dt.getUTCMinutes();
      if (h !== 0 || m !== 0) {
        drawTime = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      }
    }
  } catch { /* ignore */ }

  const data = result.data as unknown as Record<string, unknown>;
  const prizes = (Array.isArray(data?.prizes) ? data.prizes : []) as Record<string, unknown>[];

  let mainNumbers: string[] = [];
  let firstPrizeAmount = "0";
  const prizeRows: PrizeNumbers[] = [];

  for (const p of prizes) {
    if (!p.winningNumbers) continue;
    const nums = Array.isArray(p.winningNumbers) ? (p.winningNumbers as unknown[]).map(String) : [];
    const cat = String(p.category ?? "");
    const amount = p.prizeAmount != null ? String(p.prizeAmount) : "";

    // ── Main prize (first prize, any format) ─────────────────────────────
    // Thai GLO: prize_1 (6-digit), Lao: prize_4_digits (4-digit)
    if (
      cat === "prize_1" ||
      cat === "prize_4_digits" ||
      cat === "firstPrize" ||
      cat === "prize_1_thai"
    ) {
      // Take first number, split into individual digits for the balls
      const mainNum = nums[0] ?? "";
      mainNumbers = mainNum.split("");
      firstPrizeAmount = amount ? Number(amount).toLocaleString() : firstPrizeAmount;
    }
    // ── Sub-prize rows ────────────────────────────────────────────────────
    else if (cat === "running_number_front_3" || cat === "prize3Front") {
      prizeRows.push({ label: "digits3First", values: nums.slice(0, 2), amount });
    } else if (cat === "running_number_back_3" || cat === "prize3Back" || cat === "prize_3_digits") {
      prizeRows.push({ label: "digits3Last", values: nums.slice(0, 2), amount });
    } else if (cat === "running_number_back_2" || cat === "prize2" || cat === "prize_2_digits") {
      prizeRows.push({ label: "digits2Last", values: nums.slice(0, 1), amount });
    }
  }

  // Pad to 6 balls minimum (fill with "–" if less than 6 digits)
  while (mainNumbers.length < 6) mainNumbers.unshift("–");

  return { name, countryCode: cc, drawTime, drawDate, mainNumbers, firstPrizeAmount, prizes: prizeRows };
}

export function LatestDrawCard() {
  const { t } = useLanguage();
  const gd = t.staticParams.globalDraws;
  const { data, loading, error } = useApi<LatestResultsResponse>("/api/results/latest");

  // Prefer TH result (6-digit lottery), fall back to first result
  const latestResult =
    data?.results?.find((r) => r.countryCode === "th") ??
    data?.results?.[0] ??
    null;
  const draw = latestResult ? extractLatestDrawData(latestResult) : null;

  // Build detail page URL
  const detailHref = draw && latestResult
    ? `/${draw.countryCode.toLowerCase()}/${slugify(draw.name)}/${latestResult.date || latestResult.drawDate}`
    : "#";

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-6 animate-pulse min-h-[300px] shadow-sm dark:shadow-none" data-testid="latest-draw-card-loading" />
    );
  }

  if (error || !draw) {
    return (
      <div className="bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-red-500 text-sm shadow-sm dark:shadow-none" data-testid="latest-draw-card-error">
        {gd.errorLoading}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-sm dark:shadow-none" data-testid="latest-draw-card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-fs-badge text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-widest">
          {gd.latestDraw}
        </span>
        <Link
          href={detailHref}
          className="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-gold-400 transition-colors"
          aria-label="View draw details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Lottery Name Row */}
      <div className="flex items-center gap-2">
        <div className="relative h-5 w-7 overflow-hidden rounded shadow shrink-0">
          <Image
            src={getFlagUrl(draw.countryCode)}
            alt={draw.countryCode}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-gray-900 dark:text-white font-bold text-fs-base">{draw.name}</span>
      </div>

      {/* Time Badge */}
      {draw.drawTime && (
        <div className="inline-flex self-center items-center gap-1 px-3 py-1 rounded-full border border-slate-200 dark:border-white/20 text-gray-500 dark:text-gray-300 text-fs-xs font-medium">
          {draw.drawTime} | {draw.drawDate}
        </div>
      )}

      {/* 6-Digit prize row */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1 text-fs-xs text-amber-500 dark:text-amber-400 font-semibold">
          🏆 {gd.digits6}
          <span className="ml-4 text-gray-500 dark:text-white/60">{gd.firstPrize}</span>
          <span className="ml-1 text-amber-600 dark:text-amber-400 font-bold">{draw.firstPrizeAmount}</span>
        </div>
        <div className="flex gap-2" data-testid="main-numbers">
          {draw.mainNumbers.slice(0, 6).map((digit, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center text-white dark:text-neutral-950 text-fs-2xl font-black shadow-md"
            >
              {digit}
            </div>
          ))}
        </div>
      </div>

      {/* Prize sub-rows */}
      {draw.prizes.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {draw.prizes.map((p, i) => {
            const key = p.label as keyof typeof gd;
            const label = (gd as Record<string, string>)[key] ?? p.label;
            return (
              <div key={i} className="bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-center">
                <div className="text-fs-badge text-gray-500 uppercase tracking-wide mb-1">{label}</div>
                <div className="flex justify-center gap-1">
                  {p.values.map((v, vi) => (
                    <span key={vi} className="text-fs-sm font-bold text-gray-900 dark:text-white">{v}</span>
                  ))}
                </div>
                {p.amount && (
                  <div className="text-fs-badge text-amber-600 dark:text-amber-400 mt-0.5">
                    ฿{Number(p.amount).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
