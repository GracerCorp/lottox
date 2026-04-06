"use client";

import { useState, FormEvent } from "react";
import { SearchIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";
import Image from "next/image";

interface FindByNumberProps {
  countryCode: string;
  prizes: { name: string; amount: string; numbers: string[] }[];
}

export function FindByNumber({ countryCode, prizes }: FindByNumberProps) {
  const { t } = useLanguage();
  const dd = t.staticParams.drawDetail;

  const [query, setQuery] = useState("");
  const [digitFilter, setDigitFilter] = useState("all");
  const [results, setResults] = useState<
    { name: string; amount: string; number: string }[] | null
  >(null);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const q = query.trim();
    const matched: { name: string; amount: string; number: string }[] = [];

    for (const prize of prizes) {
      for (const num of prize.numbers) {
        const numStr = String(num);
        if (digitFilter !== "all" && numStr.length !== Number(digitFilter))
          continue;
        if (numStr.includes(q) || q.includes(numStr)) {
          matched.push({ name: prize.name, amount: prize.amount, number: numStr });
        }
      }
    }
    setResults(matched);
  }

  return (
    <section
      className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-6 shadow-sm dark:shadow-none"
      data-testid="find-by-number"
    >
      <div className="mb-4 flex items-center gap-2">
        <Image
          src={getFlagUrl(countryCode)}
          alt={countryCode}
          width={24}
          height={16}
          className="h-4 w-6 rounded-sm shadow-sm"
        />
        <h3 className="text-fs-xl font-bold text-gray-900 dark:text-white">
          {dd.findByNumber}
        </h3>
      </div>
      <p className="mb-4 text-fs-sm text-gray-500 dark:text-gray-400">
        {dd.findByNumberDesc}
      </p>

      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
        <select
          value={digitFilter}
          onChange={(e) => setDigitFilter(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-neutral-800/60 px-3 py-2.5 text-fs-sm text-gray-700 dark:text-gray-200 outline-none focus:border-amber-400"
          data-testid="digit-filter-select"
        >
          <option value="all">{dd.selectDigits}</option>
          <option value="6">6</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dd.enterNumber}
            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-neutral-800/60 px-4 py-2.5 pr-10 text-fs-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-amber-400"
            data-testid="find-number-input"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-5 py-2.5 text-fs-sm font-bold text-neutral-950 transition-colors"
          data-testid="find-number-search-btn"
        >
          <SearchIcon className="h-4 w-4" />
          {dd.search}
        </button>
      </form>

      {/* Results */}
      {results !== null && (
        <div className="mt-4" data-testid="find-number-results">
          {results.length === 0 ? (
            <p className="text-fs-sm text-gray-500 dark:text-gray-400 py-3 text-center">
              —
            </p>
          ) : (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-white/5 px-4 py-3"
                >
                  <div>
                    <span className="text-fs-sm font-medium text-gray-900 dark:text-white">
                      {r.name}
                    </span>
                    <span className="ml-2 text-fs-xs text-gray-500 dark:text-gray-400">
                      {r.amount}
                    </span>
                  </div>
                  <span className="font-mono text-fs-lg font-bold tracking-widest text-amber-600 dark:text-gold-400">
                    {r.number}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
