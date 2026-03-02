"use client";

import { useState, FormEvent } from "react";
import {
  SearchIcon,
  Ticket,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import confetti from "canvas-confetti";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export interface PrizeTier {
  name: string;
  amount: string;
  numbers: string[];
}

interface InteractiveTicketVerifierProps {
  countryCode: string;
  lotterySlug: string;
  latestDateDisplay: string;
  historyItems: { date: string; dateDisplay?: string }[];
  prizes: PrizeTier[];
  variant?: "main" | "sidebar";
}

export function InteractiveTicketVerifier({
  countryCode,
  lotterySlug,
  latestDateDisplay,
  historyItems,
  prizes,
  variant = "main",
}: InteractiveTicketVerifierProps) {
  const [ticketInput, setTicketInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    checkedToken: string;
    wonPrizes: PrizeTier[];
  } | null>(null);

  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams<{
    country: string;
    lottery: string;
    date?: string;
  }>();
  const currentSelectedDate = params?.date || "";

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      router.push(`/${countryCode}/${lotterySlug}`);
    } else {
      router.push(`/${countryCode}/${lotterySlug}/${selectedDate}`);
    }
  };

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#b45309"], // Gold shades
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#b45309"], // Gold shades
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleCheck = (e: FormEvent) => {
    e.preventDefault();
    const token = ticketInput.trim();
    if (!token) return;

    setIsChecking(true);
    setCheckResult(null);

    // Simulate slight network delay for effect
    setTimeout(() => {
      const wonPrizes = prizes.filter((prize) => prize.numbers.includes(token));

      setCheckResult({
        checkedToken: token,
        wonPrizes,
      });

      if (wonPrizes.length > 0) {
        fireConfetti();
      }

      setIsChecking(false);
    }, 600);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/80 p-6 backdrop-blur-md shadow-lg">
      {/* Background design elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/5 blur-[80px]"></div>
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]"></div>

      <div
        className={`relative z-10 mb-6 flex flex-col gap-4 ${variant === "main" ? "sm:flex-row sm:items-center sm:justify-between" : ""}`}
      >
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <div
              className={`flex items-center justify-center bg-gold-500/20 text-gold-500 ${variant === "main" ? "h-8 w-8 rounded-lg" : "h-10 w-10 rounded-xl"}`}
            >
              {variant === "main" ? (
                <SearchIcon className="h-4 w-4" />
              ) : (
                <Ticket className="h-5 w-5" />
              )}
            </div>
            {variant === "main"
              ? t.common.checkResult
              : t.common.verifyTicketTitle}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {variant === "main"
              ? t.common.checkResultDesc
              : t.common.verifyTicketDesc}
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="relative z-10 space-y-5">
        <div
          className={`flex flex-col gap-4 ${variant === "main" ? "md:flex-row" : ""}`}
        >
          {/* Draw Date Selection */}
          <div className={variant === "main" ? "flex-1" : ""}>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.common.drawDate}
            </label>
            <div className="relative">
              <select
                value={currentSelectedDate || ""}
                onChange={handleDateChange}
                className="w-full appearance-none rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-navy-900/50 py-3.5 pl-11 pr-10 text-gray-900 dark:text-white outline-none transition-all focus:border-gold-500 focus:bg-white dark:focus:bg-navy-900 focus:ring-2 focus:ring-gold-500/20"
              >
                <option value="">
                  {t.common.latestDraw} ({latestDateDisplay})
                </option>
                {historyItems.slice(0, 5).map((item, idx) => (
                  <option key={idx} value={item.date}>
                    {item.dateDisplay || item.date}
                  </option>
                ))}
              </select>
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Ticket Input */}
          <div className="flex-[2]">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.common.yourTicketNumber}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) =>
                  setTicketInput(e.target.value.replace(/\D/g, ""))
                }
                placeholder={`${t.common.inputPlaceholder} ${t.common.ticketExample}`}
                disabled={isChecking}
                className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-navy-900/50 py-3.5 pl-11 pr-4 font-mono text-lg tracking-widest text-gray-900 dark:text-white outline-none transition-all placeholder:font-sans placeholder:text-sm placeholder:tracking-normal focus:border-gold-500 focus:bg-white dark:focus:bg-navy-900 focus:ring-2 focus:ring-gold-500/20 disabled:opacity-50"
              />
              <Ticket className="absolute left-4 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-100 dark:border-white/5 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={() => setTicketInput("")}
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400"
          >
            {t.common.addMoreTickets || "Clear input"}
          </button>
          <button
            type="submit"
            disabled={!ticketInput || isChecking}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-gold-500/25 transition-all hover:scale-[1.02] hover:shadow-gold-500/40 active:scale-95 disabled:opacity-50 sm:w-auto"
          >
            {isChecking ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <SearchIcon className="h-5 w-5" />
                {t.common.checkBtn}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result Display */}
      <AnimatePresence>
        {checkResult && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-6 overflow-hidden rounded-xl"
          >
            {checkResult.wonPrizes.length > 0 ? (
              <div className="bg-green-500/10 border border-green-500/20 p-5 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-500/20 p-2 text-green-500 mt-0.5">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                      ยินดีด้วย! คุณถูกรางวัล
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      หมายเลข{" "}
                      <strong className="font-mono text-lg tracking-widest text-green-700 dark:text-green-300">
                        {checkResult.checkedToken}
                      </strong>{" "}
                      ตรงกับรางวัลต่อไปนี้:
                    </p>
                    <div className="space-y-3">
                      {checkResult.wonPrizes.map((prize, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white/50 dark:bg-black/20 rounded-lg px-4 py-3"
                        >
                          <span className="font-medium text-gray-800 dark:text-white">
                            {prize.name}
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                            {prize.amount} บาท
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-red-500/10 p-2 text-red-500 mt-0.5">
                    <XCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-red-500 dark:text-red-400 mb-1">
                      เสียใจด้วยนะ
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      หมายเลข{" "}
                      <strong className="font-mono tracking-widest">
                        {checkResult.checkedToken}
                      </strong>{" "}
                      ไม่ตรงกับรางวัลใดๆ ในงวดนี้
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
