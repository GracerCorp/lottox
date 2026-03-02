"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckResult {
  isWinner: boolean;
  prizes: Array<{
    prizeName?: string;
    category: string;
    number?: string;
    winningNumber?: string;
    amount?: number | string;
  }>;
}

export function CheckLotteryWidget() {
  const { t } = useLanguage();
  const [number, setNumber] = useState("");
  const [type, setType] = useState("thai");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || number.length < 2) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Assuming mapping thai -> HT, lao -> LAO, vn -> VIETNAM for check API
      const apiType =
        type === "thai" ? "HT" : type === "lao" ? "LAO" : "VIETNAM";
      const res = await fetch(`/api/check?number=${number}&type=${apiType}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to check lottery");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8 mb-8">
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg p-6 md:p-10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t.common?.checkResult || "Check Lottery Results"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your ticket number to instantly check if you&apos;ve won
            </p>
          </div>

          <form
            onSubmit={handleCheck}
            className="flex flex-col md:flex-row gap-4 items-center justify-center bg-gray-50 dark:bg-navy-950/50 p-2 md:p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner"
          >
            <div className="w-full md:w-auto min-w-[150px]">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white dark:bg-navy-800 border-none outline-none text-gray-700 dark:text-gray-200 py-3 md:py-4 px-4 rounded-xl cursor-pointer shadow-sm ring-1 ring-gray-200 dark:ring-white/10 focus:ring-primary/50 transition-all font-medium"
              >
                <option value="thai">
                  {t.selector?.thai || "Thai Lottery"}
                </option>
                <option value="lao">{t.selector?.lao || "Lao Lottery"}</option>
                <option value="vn">
                  {t.selector?.vietnam || "Vietnam Lottery"}
                </option>
              </select>
            </div>

            <div className="relative w-full flex-1">
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter numbers (e.g. 123456)"
                maxLength={6}
                className="w-full bg-white dark:bg-navy-800 border-none outline-none text-gray-800 dark:text-white text-lg py-3 md:py-4 pl-6 pr-12 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-white/10 focus:ring-2 focus:ring-primary transition-all text-center tracking-widest font-bold placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || number.length < 2}
              className="w-full md:w-auto min-w-[140px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 md:py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{t.common?.checkBtn || "Check"}</span>
                </>
              )}
            </button>
          </form>

          {/* Feedback Section */}
          {(result || error) && (
            <div
              className={cn(
                "mt-8 p-6 rounded-2xl border animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm text-center",
                error || (result && !result.isWinner)
                  ? "bg-red-50/80 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
                  : "bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
              )}
            >
              {error ? (
                <div className="flex flex-col items-center gap-2">
                  <XCircle className="w-10 h-10 mb-2 opacity-80" />
                  <h3 className="text-xl font-bold">
                    Oops! Something went wrong
                  </h3>
                  <p className="opacity-80">{error}</p>
                </div>
              ) : result && result.isWinner ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mb-2 drop-shadow-sm" />
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                    Congratulations!
                  </h3>
                  <p className="text-lg font-medium opacity-90">
                    Your number{" "}
                    <span className="font-bold tracking-widest text-emerald-700 dark:text-emerald-300">
                      {number}
                    </span>{" "}
                    won a prize.
                  </p>

                  {/* Winning Prizes List */}
                  <div className="w-full max-w-lg mt-4 flex flex-col gap-2">
                    {result.prizes &&
                      Array.isArray(result.prizes) &&
                      result.prizes.map((p, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white dark:bg-navy-800/60 p-3 md:px-5 rounded-lg border border-emerald-100 dark:border-emerald-500/10 shadow-sm"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {(t.results as Record<string, string>)?.[
                              p.category
                            ] ||
                              p.prizeName ||
                              p.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-navy-900 px-2 py-1 rounded text-sm tracking-wider">
                              {p.number || p.winningNumber || number}
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/20 px-3 py-1 rounded-full text-sm">
                              {p.amount
                                ? `${Number(p.amount).toLocaleString()} ฿`
                                : "Prize"}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <XCircle className="w-10 h-10 mb-2 opacity-80" />
                  <h3 className="text-xl font-bold">
                    Sorry, no prize this time.
                  </h3>
                  <p className="opacity-80">
                    Your number{" "}
                    <span className="font-bold tracking-widest">{number}</span>{" "}
                    did not match any winning numbers for this draw.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
