"use client";

import { useState, useEffect } from "react";
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
  detailHref: string;
}

function extractLatestDrawData(result: LatestResultsResponse["results"][0]): LatestDrawData | null {
  if (!result) return null;

  const cc = result.countryCode ?? "th";
  const name = result.lotteryName ?? "Government Lottery (GLO)";
  
  const detailHref = `/${cc.toLowerCase()}/${slugify(name)}/${result.date || result.drawDate}`;

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
    if (
      cat === "prize_1" ||
      cat === "prize_4_digits" ||
      cat === "firstPrize" ||
      cat === "prize_1_thai"
    ) {
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

  return { name, countryCode: cc, drawTime, drawDate, mainNumbers, firstPrizeAmount, prizes: prizeRows, detailHref };
}

export function LatestDrawCard() {
  const { t } = useLanguage();
  const gd = t.staticParams.globalDraws;
  const { data, loading, error } = useApi<LatestResultsResponse>("/api/results/latest");

  const [activeIndex, setActiveIndex] = useState(0);

  // Extract up to 5 latest draws
  const rawDraws = data?.results?.slice(0, 5) || [];
  const extractedDraws = rawDraws.map(extractLatestDrawData).filter(Boolean) as LatestDrawData[];

  useEffect(() => {
    if (extractedDraws.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % extractedDraws.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [extractedDraws.length]);

  const handleNext = () => {
    if (extractedDraws.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % extractedDraws.length);
  };

  const handlePrev = () => {
    if (extractedDraws.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + extractedDraws.length) % extractedDraws.length);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-6 animate-pulse min-h-[300px] shadow-sm dark:shadow-none" data-testid="latest-draw-card-loading" />
    );
  }

  if (error || extractedDraws.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-red-500 text-sm shadow-sm dark:shadow-none" data-testid="latest-draw-card-error">
        {gd.errorLoading}
      </div>
    );
  }

  const draw = extractedDraws[activeIndex];

  return (
    <div className="bg-[#242424] border border-transparent rounded-2xl p-6 flex flex-col shadow-lg w-full relative group" data-testid="latest-draw-card">
      
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-400 font-medium mb-4 z-10 relative">
        <span className="tracking-wide">{gd.latestDraw}</span>
        {extractedDraws.length > 1 && (
          <div className="flex gap-6">
            <button onClick={handlePrev} className="hover:text-white transition-colors" aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button onClick={handleNext} className="hover:text-white transition-colors" aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Lottery Name Row */}
      <div className="flex items-center gap-3 z-10 relative">
        <div className="relative h-10 w-10 overflow-hidden bg-white rounded-full shrink-0 flex items-center justify-center p-1">
          <Image
            src={getFlagUrl(draw.countryCode)}
            alt={draw.countryCode}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <Link href={draw.detailHref} className="flex items-center gap-1.5 hover:underline decoration-white underline-offset-4 cursor-pointer">
            <span className="text-white font-semibold text-lg">{draw.name}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e" stroke="white" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </Link>
          <span className="text-gray-400 text-sm">{draw.countryCode === 'th' ? 'Thailand' : draw.countryCode.toUpperCase()}</span>
        </div>
      </div>

      {/* Time Badge (Centered) */}
      <div className="flex justify-center mt-2 z-10 relative">
        <div className="border border-[#c6a362] text-[#c6a362] rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300">
          {draw.drawTime ? `${draw.drawTime} | ${draw.drawDate}` : draw.drawDate}
        </div>
      </div>

      {/* Main Prize Row */}
      <div className="mt-8 flex flex-col gap-3 z-10 relative transition-opacity duration-300">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 text-lg font-bold text-[#e2c179]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            {gd.digits6}
          </div>
          <div className="text-sm">
            <span className="text-gray-400 mr-1">{gd.firstPrize} -</span>
            <span className="text-[#e2c179] font-bold">฿{draw.firstPrizeAmount}</span>
          </div>
        </div>
        
        <div className="flex gap-2.5 justify-center w-full" data-testid="main-numbers">
          {draw.mainNumbers.slice(0, 6).map((digit, i) => (
            <div
              key={i}
              className="bg-[#e2c179] text-[#1a1a1a] flex-1 max-w-[60px] aspect-[4/5] rounded-xl flex items-center justify-center text-3xl font-bold shadow-sm"
            >
              {digit}
            </div>
          ))}
        </div>
      </div>

      {/* Sub Prizes */}
      <div className="min-h-[140px] mt-8 z-10 relative transition-opacity duration-300">
        {draw.prizes.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {draw.prizes.map((p, i) => {
              const key = p.label as keyof typeof gd;
              const label = (gd as Record<string, string>)[key] ?? p.label;
              return (
                <div key={i} className="bg-[#1f1f1f] rounded-xl border border-[#333] p-4 flex flex-col items-center">
                  <span className="text-sm font-medium text-white mb-4">{label}</span>
                  <div className="flex gap-2">
                    {p.values.map((v, vi) => (
                      <div key={vi} className="bg-[#333] text-gray-300 px-3 py-1.5 rounded-lg font-bold text-lg tracking-wider">
                        {v}
                      </div>
                    ))}
                  </div>
                  {p.amount && (
                    <div className="text-sm text-gray-400 font-medium mt-3">
                      ฿{Number(p.amount).toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Carousel Dots */}
      <div className="flex justify-center items-center gap-2.5 mt-2 mb-2 z-10 relative min-h-[6px]">
        {extractedDraws.length > 1 && extractedDraws.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-gray-300" : "w-1.5 bg-[#444]"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
