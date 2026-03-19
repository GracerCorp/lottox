"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Loader2, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFlagUrl } from "@/lib/flags";
import { type Language } from "@/lib/i18n";
import { JackpotResult, StandardWinResult, NoWinResult } from "./ResultStates";

/* ---------- Types ---------- */
export interface LotteryOption {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  logo?: string | null;
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
  const [searchedNumber, setSearchedNumber] = useState(""); // frozen at search time
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<LotteryOption | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    setSearchQuery("");
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter groups by search query
  const filteredGroups = searchQuery.trim()
    ? lotteryGroups
        .map((group) => ({
          ...group,
          lotteries: group.lotteries.filter(
            (l) =>
              l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              l.countryName.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((g) => g.lotteries.length > 0)
    : lotteryGroups;

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || number.length < 2 || !selected) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSearchedNumber(number); // freeze the number at search time

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

  // Determine if it's a jackpot win
  // 1. Result must be a win
  // 2. We check if any prize label contains '1st', 'jackpot', 'grande', 'first', 'prize_1'
  const isWinner = result?.isWinner || result?.win;
  const isJackpot = isWinner && result?.prizes?.some(p => {
    const name = (p.prizeName || p.label || p.category || "").toLowerCase();
    return (
      name.includes("1st") ||
      name.includes("first") ||
      name.includes("jackpot") ||
      name.includes("grande") ||
      name.includes("รางวัลที่ 1") ||
      name === "prize_1"
    );
  });

  const handleReset = () => {
    setResult(null);
    setNumber("");
    setSearchedNumber("");
    setError(null);
  };

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
                <div className="relative h-6 w-6 overflow-hidden rounded shadow-sm flex-shrink-0">
                  <Image
                    src={selected.logo ?? getFlagUrl(selected.countryCode)}
                    alt={selected.name}
                    fill
                    className="object-contain"
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
          <div ref={panelRef} className="absolute left-0 right-0 mt-2 max-h-[360px] overflow-hidden rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-white/10 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.common.searchLotteryPlaceholder}
                  className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-gold-400/50"
                />
              </div>
            </div>

            {/* Scrollable lottery list */}
            <div className="overflow-y-auto max-h-[280px]">
            {filteredGroups.map((group, gIdx) => (
              <div key={group.countryCode}>
                {/* Country Group Header */}
                {gIdx > 0 && (
                  <div className="h-px bg-gray-100 dark:bg-white/5 mx-3" />
                )}
                <div className="px-4 pt-3 pb-1">
                  <span className="text-fs-badge font-semibold text-gray-500 uppercase tracking-wider">
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
                      <div className="relative h-6 w-6 overflow-hidden rounded shadow-sm flex-shrink-0">
                        <Image
                          src={lottery.logo ?? getFlagUrl(lottery.countryCode)}
                          alt={lottery.name}
                          fill
                          className="object-contain"
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

            {filteredGroups.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                {searchQuery ? t.common.noResults : t.common.loading}
              </div>
            )}
            </div>
          </div>
        )}
      </div>

      {/* Results feedback — aria-live for screen reader announcements */}
      {(result || error) && (
        <div className="w-full" aria-live="polite" aria-atomic="true" role="status">
          {error ? (
            <div className="max-w-2xl mx-auto mt-6">
              <div className="p-5 rounded-xl border text-center animate-in fade-in slide-in-from-bottom-4 duration-500 bg-red-500/10 border-red-500/20 text-red-400">
                <div className="flex flex-col items-center gap-2">
                  <XCircle className="w-8 h-8 opacity-80" />
                  <p className="font-bold">{t.common.somethingWrong}</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            </div>
          ) : isJackpot ? (
            <JackpotResult result={result!} number={searchedNumber} onReset={handleReset} />
          ) : isWinner ? (
            <StandardWinResult result={result!} number={searchedNumber} onReset={handleReset} />
          ) : (
            <NoWinResult number={searchedNumber} onReset={handleReset} />
          )}
        </div>
      )}
    </section>
  );
}
