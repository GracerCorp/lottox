"use client";

import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Trophy, CheckCircle2, Ticket, AlertCircle, Facebook, Twitter, Link as LinkIcon, RefreshCcw } from "lucide-react";
import { CheckResult } from "./CheckLotteryWidget";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Shared Share Button Component
 */
export const ShareRow = ({ number }: { number: string }) => {
  const { t } = useLanguage();

  const shareText = encodeURIComponent(`I checked lottery number ${number} on LOTTOX! 🎉`);
  const shareUrl = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "https://lottox.today");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // fallback silently
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        {t.common.shareYourWin}
      </span>
      <div className="flex items-center gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-5 h-5" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </a>
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          aria-label="Copy link"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

/**
 * 1. Jackpot Result State (1st Prize)
 */
export const JackpotResult = ({
  result,
  number,
  onReset,
}: {
  result: CheckResult;
  number: string;
  onReset: () => void;
}) => {
  const { width, height } = useWindowSize();
  const { t } = useLanguage();

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 animate-in zoom-in-95 duration-500">
      {/* Full screen confetti */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
          colors={["#FFD700", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"]}
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold-500/20 via-navy-900 to-navy-950 border-2 border-gold-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)] p-6 md:p-8 text-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold-500/20 blur-[100px] -z-10 rounded-full" />

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-gold-500/30 animate-bounce">
            <Trophy className="w-10 h-10 text-navy-950" />
          </div>

          <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-gold-500 uppercase tracking-tight drop-shadow-sm">
            {t.common.jackpotTitle}
          </h3>

          <p className="text-gray-300 text-sm md:text-base mt-2">
            {t.common.numberLabel}{" "}
            <span className="font-bold text-white text-lg px-2 py-1 bg-white/10 rounded mx-1">
              {number}
            </span>{" "}
            {t.common.jackpotMatchedPrize}
          </p>

          {/* Prizes list */}
          {result?.prizes && (
            <div className="w-full max-w-md mt-4 space-y-3">
              {result.prizes.map((p, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-navy-950/80 p-4 rounded-xl border border-gold-500/30 shadow-inner"
                >
                  <span className="text-sm font-medium text-gold-200">
                    {p.prizeName || p.label || t.results.prize1}
                  </span>
                  <span className="font-black text-xl text-gold-400">
                    {p.amount
                      ? `${Number(p.amount).toLocaleString()} ฿`
                      : t.common.jackpotHugePrize}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
            <button className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-gold-400 to-yellow-400 text-navy-950 font-bold shadow-lg hover:scale-105 transition-transform">
              {t.common.jackpotHowToClaim}
            </button>
            <button
              onClick={onReset}
              className="flex-1 py-3 px-6 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
            >
              {t.common.checkAnothers}
            </button>
          </div>

          <ShareRow number={number} />
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Standard Win Result State (Other Prizes)
 */
export const StandardWinResult = ({
  result,
  number,
  onReset,
}: {
  result: CheckResult;
  number: string;
  onReset: () => void;
}) => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="rounded-2xl bg-white dark:bg-navy-900 border border-emerald-500/30 shadow-xl overflow-hidden">
        {/* Top green accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-green-500" />

        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t.common.congratulations}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            {t.common.numberLabel}{" "}
            <span className="font-bold text-gray-900 dark:text-white">{number}</span>{" "}
            {t.common.winnerLabel}
          </p>

          {/* Prizes list */}
          {result?.prizes && (
            <div className="w-full max-w-md mt-6 space-y-2">
              {result.prizes.map((p, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 dark:bg-navy-800 p-3 rounded-lg border border-gray-100 dark:border-emerald-500/10"
                >
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {p.prizeName || p.label || t.results.prize1}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {p.amount ? `${Number(p.amount).toLocaleString()} ฿` : "-"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-8 max-w-md">
            <button
              onClick={onReset}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-900 dark:text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              {t.common.checkAnotherNumber}
            </button>
            <Link
              href="/global-draws"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              {t.common.playNextDraw}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. No Win Result State (Cheer Up & Retention)
 */
export const NoWinResult = ({
  number,
  onReset,
}: {
  number: string;
  onReset: () => void;
}) => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 animate-in fade-in duration-300">
      <div className="rounded-2xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-white/10 shadow-lg p-6 md:p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-navy-800 flex items-center justify-center mb-4">
          <Ticket className="w-8 h-8 text-gray-400" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t.common.notThisTime}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-md">
          {t.common.numberLabel}{" "}
          <span className="font-bold text-gray-700 dark:text-gray-200">{number}</span>{" "}
          {t.common.noMatchDesc}
        </p>

        {/* Cross-sell / Retention Hook */}
        <div className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4 mt-8 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-400 text-sm">
                {t.common.upcomingOpp}
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 mb-3">
                {t.common.upcomingDesc}
              </p>
              <Link
                href="/global-draws"
                className="inline-flex items-center text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
              >
                {t.common.viewUpcoming}
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="mt-6 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center gap-2 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          {t.common.checkAnotherNumber}
        </button>
      </div>
    </div>
  );
};
