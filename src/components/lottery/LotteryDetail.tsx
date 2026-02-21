"use client";

import { useState } from "react";
import { DrawResult } from "./DrawResult";
import { TicketVerifier } from "@/components/country/TicketVerifier";
import { NewsSidebar } from "@/components/ui/NewsSidebar";
import {
  NewspaperIcon,
  SearchIcon,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { useApi } from "@/lib/hooks/useApi";
import { ResultsByTypeResponse, ThaiResultData } from "@/lib/api-types";
import { getFlagUrl } from "@/lib/flags";

interface LotteryDetailProps {
  country: string;
  countryCode: string;
  lotteryName: string;
  lotterySlug: string;
  apiEndpoint: string;
}

/* -- Components -- */
function PrizeGrid({
  numbers,
  columns = 5,
}: {
  numbers: string[];
  columns?: number;
}) {
  return (
    <div
      className="grid gap-px"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {numbers.map((num, i) => {
        const rowIndex = Math.floor(i / columns);
        const isZebraRow = rowIndex % 2 === 1;
        return (
          <div
            key={i}
            className={`px-2 py-3 text-center font-mono text-xl tabular-nums tracking-widest text-gray-800 dark:text-gray-200 transition-colors hover:bg-gold-500/10 hover:text-gold-600 dark:hover:text-gold-300 ${isZebraRow ? "bg-gray-50 dark:bg-white/[0.03]" : ""}`}
            style={{ fontWeight: 600 }}
          >
            {num}
          </div>
        );
      })}
    </div>
  );
}

function PrizeSectionHeader({
  title,
  count,
  amount,
}: {
  title: string;
  count: number;
  amount: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-2 border-b border-gold-500/20 bg-gradient-to-r from-gold-500/10 to-transparent px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="text-xl font-bold text-gold-400">{title}</h3>
      <div className="text-sm text-gray-400">
        {count} {t.common.perPrize}{" "}
        <span className="font-bold text-gold-300">
          {amount} {t.common.baht}
        </span>
      </div>
    </div>
  );
}

export default function LotteryDetail({
  country,
  countryCode,
  lotteryName,
  lotterySlug,
  apiEndpoint,
}: LotteryDetailProps) {
  const { t, language } = useLanguage();
  const { data, loading, error } = useApi<ResultsByTypeResponse>(
    `${apiEndpoint}?limit=10`,
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="mb-8 h-20 rounded-lg bg-navy-800/50" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-96 rounded-2xl bg-navy-800/50" />
            <div className="h-48 rounded-xl bg-navy-800/50" />
            <div className="h-48 rounded-xl bg-navy-800/50" />
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-xl bg-navy-800/50" />
            <div className="h-48 rounded-xl bg-navy-800/50" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400">
          Error loading {lotteryName} results.
        </div>
      </div>
    );
  }

  const latest = data?.latest;
  const historyItems = data?.history ?? [];
  const latestData = latest?.data as ThaiResultData | undefined;

  // Map data to DrawResult props
  const drawResultProps = {
    country: country,
    lotteryName: lotteryName,
    date: latest?.dateDisplay || latest?.date || "-",
    drawId: latest?.drawNo || "-",
    firstPrize: latestData?.firstPrize || "-",
    firstPrizeAmount: latestData?.firstPrizeAmount || "Prize",
    front3: latestData?.front3,
    front3Amount: latestData?.front3Amount,
    back3: latestData?.back3,
    back3Amount: latestData?.back3Amount,
    last2: latestData?.last2,
    last2Amount: latestData?.last2Amount,
    adjacent: latestData?.adjacent,
    adjacentAmount: latestData?.adjacentAmount,
  };

  const recentResults = historyItems.map((item) => {
    const d = item.data as ThaiResultData;
    return {
      date: item.dateDisplay || item.date,
      firstPrize: d?.firstPrize || "-",
      last3f: d?.front3?.[0] || "-",
      last3b: d?.back3?.[0] || "-",
      last2: d?.last2 || "-",
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 dark:border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-green-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> {t.header.verified}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400 flex items-center">
              <img
                src={getFlagUrl(countryCode)}
                alt={`${country} flag`}
                className="mr-1.5 inline-block h-4 w-6 rounded-sm shadow-sm"
              />
              {country}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            {/* Logo placeholder - replace with dynamic logic if needed */}
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30">
              {lotteryName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                {lotteryName}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official Results
              </p>
            </div>
          </div>
        </div>

        {/* Subscribe Button - could be parameterized */}
        <button className="bg-navy-900/10 dark:bg-white/10 hover:bg-navy-900/20 dark:hover:bg-white/20 text-navy-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Subscribe needed
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Hero Section */}
          <DrawResult {...drawResultProps} />

          {/* Prize Grids - specific to Thai struct but generic enough if data present */}
          {[
            {
              title: t.results.prize2rank,
              count: latestData?.prize2?.length || 0,
              amount: latestData?.prize2Amount || "200,000",
              numbers: latestData?.prize2 || [],
            },
            {
              title: t.results.prize3rank,
              count: latestData?.prize3?.length || 0,
              amount: latestData?.prize3Amount || "80,000",
              numbers: latestData?.prize3 || [],
            },
            {
              title: t.results.prize4rank,
              count: latestData?.prize4?.length || 0,
              amount: latestData?.prize4Amount || "40,000",
              numbers: latestData?.prize4 || [],
            },
            {
              title: t.results.prize5rank,
              count: latestData?.prize5?.length || 0,
              amount: latestData?.prize5Amount || "20,000",
              numbers: latestData?.prize5 || [],
            },
          ]
            .filter((prize) => prize.numbers.length > 0)
            .map((prize, i) => (
              <section
                key={i}
                className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 shadow-sm"
              >
                <PrizeSectionHeader
                  title={prize.title}
                  count={prize.count}
                  amount={prize.amount}
                />
                <PrizeGrid numbers={prize.numbers} columns={5} />
              </section>
            ))}

          {/* Inline Lottery Checker */}
          <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/50 p-6 backdrop-blur-md shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {t.common.checkResult}
            </h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <select className="flex-1 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-navy-900 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500">
                <option>{t.common.selectType}</option>
              </select>
              <div className="relative flex-[2]">
                <input
                  type="text"
                  placeholder={t.common.inputPlaceholder}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-navy-900 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500"
                />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-8 py-3 font-bold text-white dark:text-black transition-all hover:bg-gold-400 hover:scale-105 shadow-md hover:shadow-lg">
                <SearchIcon className="h-5 w-5" />
                {t.common.checkBtn}
              </button>
            </div>
          </section>

          {/* History Table */}
          <section className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 shadow-sm">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {t.results.history}
              </h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t.common.date}</th>
                    <th className="px-4 py-3 font-medium">
                      {t.results.prize1}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t.results.prize3Front}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t.results.prize3Back}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t.results.prize2}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {recentResults.map((row, i) => (
                    <tr
                      key={i}
                      className={`group hover:bg-gray-50 dark:hover:bg-white/5 ${i % 2 === 1 ? "bg-gray-50/50 dark:bg-white/[0.02]" : ""}`}
                    >
                      <td className="px-4 py-4 font-mono text-sm tabular-nums text-gray-600 dark:text-gray-400">
                        {row.date}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-xl font-bold tracking-[0.3em] text-gray-900 dark:text-white">
                          {row.firstPrize}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-blue-500/20 bg-blue-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-blue-300">
                          {row.last3f}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-blue-500/20 bg-blue-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-blue-300">
                          {row.last3b}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-gold-500/20 bg-gold-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-gold-400">
                          {row.last2}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="divide-y divide-gray-200 dark:divide-white/5 lg:hidden">
              {recentResults.map((row, i) => (
                <div
                  key={i}
                  className={`space-y-3 px-5 py-4 ${i % 2 === 1 ? "bg-gray-50/50 dark:bg-white/[0.02]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={getFlagUrl(countryCode)}
                        alt={countryCode}
                        className="h-4 w-6 rounded-sm shadow-sm"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {lotteryName}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-gray-500">
                      {row.date}
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                      {t.results.prize1}
                    </div>
                    <div className="font-mono text-2xl font-bold tracking-[0.3em] text-gray-900 dark:text-white">
                      {row.firstPrize}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.prize3Front}
                      </div>
                      <span className="block w-full rounded border border-blue-500/20 bg-blue-500/20 px-2 py-1 font-mono text-lg font-bold text-blue-300 text-center">
                        {row.last3f}
                      </span>
                    </div>
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.prize3Back}
                      </div>
                      <span className="block w-full rounded border border-blue-500/20 bg-blue-500/20 px-2 py-1 font-mono text-lg font-bold text-blue-300 text-center">
                        {row.last3b}
                      </span>
                    </div>
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.prize2}
                      </div>
                      <span className="block w-full rounded border border-gold-500/20 bg-gold-500/20 px-2 py-1 font-mono text-lg font-bold text-gold-400 text-center">
                        {row.last2}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500 dark:text-amber-400" />
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Data presented for convenience. Please verify with official
                sources.
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-gold-500/20 bg-white dark:bg-navy-800/30 p-6 shadow-sm">
            <h3 className="mb-4 text-center text-lg font-bold text-gold-400">
              {t.common.checkTicket}
            </h3>
            <TicketVerifier country={country} />
          </div>

          <NewsSidebar
            accentColor="gold"
            icon={
              <NewspaperIcon className="h-4 w-4 text-gold-600 dark:text-gold-400" />
            }
          />

          {/* Sidebar: Past draw links */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/30 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {t.common.historyTitle}
            </h3>
            <div className="space-y-2">
              {historyItems.slice(0, 5).map((item, i) => (
                <Link
                  key={i}
                  href={`/${countryCode === "th" ? "thailand/thai-lotto" : country.toLowerCase().replace(" ", "-")}/${lotterySlug}/${item.date}`}
                  className="block rounded bg-gray-100 dark:bg-white/5 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gold-600 dark:hover:text-gold-400"
                >
                  {language === "th" ? "งวด " : "Draw "}
                  {item.dateDisplay || item.date}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
