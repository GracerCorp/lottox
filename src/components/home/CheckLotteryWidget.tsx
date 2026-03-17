"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Loader2, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFlagUrl } from "@/lib/flags";

/* ---------- Types ---------- */
export interface LotteryOption {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
}

export interface LotteryGroup {
  countryCode: string;
  countryName: string;
  lotteries: LotteryOption[];
}

export interface CheckResult {
  isWinner?: boolean;
  win?: boolean;
  prizes?: Array<{
    prizeName?: string;
    category?: string;
    label?: string;
    number?: string;
    winningNumber?: string;
    amount?: number | string;
  }>;
}

/* ---------- Component ---------- */
export function CheckLotteryWidget({
  lotteryGroups = [],
}: {
  lotteryGroups?: LotteryGroup[];
}) {
  const { t } = useLanguage();
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dropdown state
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<LotteryOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Default selection: first lottery in the list
  useEffect(() => {
    if (!selected && lotteryGroups.length > 0 && lotteryGroups[0].lotteries.length > 0) {
      setSelected(lotteryGroups[0].lotteries[0]);
    }
  }, [lotteryGroups, selected]);

  // Click-outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        panelRef.current && !panelRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (lottery: LotteryOption) => {
    setSelected(lottery);
    setIsOpen(false);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || number.length < 2 || !selected) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiType = selected.countryCode.toUpperCase();
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

  // Truncate name for trigger display
  const triggerLabel = selected
    ? selected.name.length > 8
      ? selected.name.slice(0, 8) + "..."
      : selected.name
    : "Select...";

  const isWinner = result?.isWinner || result?.win;

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.common.findByNumber}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          {t.common.findByNumberDesc}
        </p>
      </div>

      {/* Compact search form */}
      <div className="max-w-2xl mx-auto relative">
        <form
          onSubmit={handleCheck}
          className="flex flex-wrap md:flex-nowrap items-center gap-2 bg-white/80 dark:bg-navy-900/60 border border-gray-200 dark:border-white/10 rounded-2xl md:rounded-full p-2 md:p-1.5 md:pl-4 backdrop-blur-md shadow-lg"
        >
          {/* Custom Dropdown Trigger */}
          <div ref={dropdownRef} className="flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-2 border-r border-gray-200 dark:border-white/10 pr-3 py-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {selected && (
                <div className="relative h-4 w-6 overflow-hidden rounded shadow-sm flex-shrink-0">
                  <Image
                    src={getFlagUrl(selected.countryCode)}
                    alt={selected.countryName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {triggerLabel}
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
          </div>

          {/* Input */}
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            placeholder={t.common.fillNumberPlaceholder}
            maxLength={6}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-gray-900 dark:text-white text-sm py-2.5 px-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 tracking-widest tabular-nums"
          />

          {/* Search button */}
          <button
            type="submit"
            disabled={loading || number.length < 2}
            className="flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-sm py-2.5 px-3 md:px-5 rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:pointer-events-none flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">{t.common.searchBtn}</span>
              </>
            )}
          </button>
        </form>

        {/* Dropdown Panel — full width of form, anchored to outer container */}
        {isOpen && (
          <div ref={panelRef} className="absolute left-0 right-0 mt-2 max-h-[360px] overflow-y-auto rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-white/10 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {lotteryGroups.map((group, gIdx) => (
              <div key={group.countryCode}>
                {/* Country Group Header */}
                {gIdx > 0 && (
                  <div className="h-px bg-gray-100 dark:bg-white/5 mx-3" />
                )}
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    {group.countryName}
                  </span>
                </div>

                {/* Lottery Items */}
                {group.lotteries.map((lottery) => {
                  const isSelected = selected?.id === lottery.id;
                  return (
                    <button
                      key={lottery.id}
                      type="button"
                      onClick={() => handleSelect(lottery)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150",
                        isSelected
                          ? "bg-gold-500/90 text-navy-950"
                          : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10",
                      )}
                    >
                      <div className="relative h-5 w-7 overflow-hidden rounded shadow-sm flex-shrink-0">
                        <Image
                          src={getFlagUrl(lottery.countryCode)}
                          alt={lottery.countryName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium truncate",
                          isSelected ? "font-bold" : "",
                        )}
                      >
                        {lottery.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}

            {lotteryGroups.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                {t.common.loading}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results feedback */}
      {(result || error) && (
        <div className="max-w-2xl mx-auto mt-6">
          <div
            className={cn(
              "p-5 rounded-xl border text-center animate-in fade-in slide-in-from-bottom-4 duration-500",
              error || !isWinner
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            )}
          >
            {error ? (
              <div className="flex flex-col items-center gap-2">
                <XCircle className="w-8 h-8 opacity-80" />
                <p className="font-bold">{t.common.somethingWrong}</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            ) : isWinner ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="text-xl font-black text-emerald-400">
                  {t.common.congratulations}
                </p>
                <p className="text-sm">
                  {t.common.verifySuccessDesc1}{" "}
                  <span className="font-bold tracking-widest">{number}</span>{" "}
                  {t.common.verifySuccessDesc2}
                </p>
                {result?.prizes && (
                  <div className="w-full max-w-md mt-3 space-y-2">
                    {result.prizes.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-navy-800/60 p-3 rounded-lg border border-emerald-500/10"
                      >
                        <span className="text-sm text-gray-300">
                          {p.prizeName || p.label || p.category || "Prize"}
                        </span>
                        <span className="font-bold text-emerald-400 text-sm">
                          {p.amount
                            ? `${Number(p.amount).toLocaleString()} ฿`
                            : "Prize"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <XCircle className="w-8 h-8 opacity-80" />
                <p className="font-bold">{t.common.noPrize}</p>
                <p className="text-sm opacity-80">
                  {t.common.verifyFailDesc1}{" "}
                  <span className="font-bold tracking-widest">{number}</span>{" "}
                  {t.common.verifyFailDesc2}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
