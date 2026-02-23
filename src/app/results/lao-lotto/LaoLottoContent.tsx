"use client";

import { LotteryBall } from "@/components/ui/LotteryBall";
import { getFlagUrl } from "@/lib/flags";
import { ShieldCheck, Award, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsSidebar } from "@/components/ui/NewsSidebar";
import { SubscribeButton } from "@/components/ui/SubscribeButton";
import { useApi } from "@/lib/hooks/useApi";
import type { ResultsByTypeResponse, LaoResultData } from "@/lib/api-types";

/* -- SVG Search Icon -- */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/* -- SVG Newspaper Icon -- */
function NewspaperIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

/* -- Loading Skeleton -- */
function LaoLottoSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="mb-8 h-20 rounded-lg bg-gray-200 dark:bg-navy-800/50" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-96 rounded-2xl bg-gray-200 dark:bg-navy-800/50" />
          <div className="h-48 rounded-xl bg-gray-200 dark:bg-navy-800/50" />
        </div>
        <div className="space-y-6">
          <div className="h-48 rounded-xl bg-gray-200 dark:bg-navy-800/50" />
          <div className="h-48 rounded-xl bg-gray-200 dark:bg-navy-800/50" />
        </div>
      </div>
    </div>
  );
}

export default function LaoLottoContent() {
  const { t, language } = useLanguage();

  const { data, loading, error } = useApi<ResultsByTypeResponse>(
    "/api/results/lao?limit=10",
  );

  if (loading) return <LaoLottoSkeleton />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400">
          Error loading Lao Lotto results: {error}
        </div>
      </div>
    );
  }

  const latest = data?.latest;
  const latestData = latest?.data as LaoResultData | undefined;
  const historyItems = data?.history ?? [];

  const latestDraw = {
    date: latest?.dateDisplay || latest?.date || "-",
    drawNo: latest?.drawNo || "-",
    daysAgo: latest?.daysAgo || "-",
    digit4: latestData?.digit4 || "-",
    digit3: latestData?.digit3 || "-",
    digit2: latestData?.digit2 || "-",
    digit1: latestData?.digit1 || "-",
    digit4Multiplier: latestData?.digit4Multiplier || "x6,000",
    digit3Multiplier: latestData?.digit3Multiplier || "x500",
    digit2Multiplier: latestData?.digit2Multiplier || "x60",
  };

  const recentResults = historyItems.map((item) => {
    const d = item.data as LaoResultData;
    return {
      date: item.dateDisplay || item.date,
      digit4: d?.digit4 || "-",
      digit3: d?.digit3 || "-",
      digit2: d?.digit2 || "-",
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header + Logo */}
      <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 dark:border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-500/10 px-2.5 py-1 text-green-700 dark:text-green-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> {t.header.verified}
            </span>
            <span className="text-gray-300 dark:text-gray-500">|</span>
            <span className="text-gray-600 dark:text-gray-400">
              <Image
                src={getFlagUrl("la")}
                alt="Laos flag"
                width={24}
                height={16}
                className="mr-1.5 inline-block h-4 w-6 rounded-sm"
              />
              {t.lottery.lao.country}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded bg-red-800 shadow-sm">
              <Image
                src={getFlagUrl("la")}
                alt="Laos flag"
                width={64}
                height={40}
                className="h-full w-full object-cover opacity-80"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                {t.lottery.lao.name}
              </h1>
              <p className="text-xs text-gray-500">{t.lottery.lao.subName}</p>
            </div>
          </div>
        </div>

        <SubscribeButton type="LAO" />
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* SECTION 1: Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 shadow-sm dark:shadow-2xl">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="mb-2 text-center text-sm uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {t.lottery.lao.subName}
              </div>
              <div className="mb-4 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-4">
                  <Image
                    src={getFlagUrl("la")}
                    alt="Laos flag"
                    width={40}
                    height={40}
                    className="inline-block h-10 w-10"
                  />
                  <h2 className="bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-300 dark:to-emerald-600 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-6xl text-center leading-tight">
                    {t.lottery.lao.name}
                  </h2>
                </div>
              </div>
              <div className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
                {t.common.date} {latestDraw.date} | {latestDraw.drawNo} |{" "}
                {latestDraw.daysAgo}
              </div>

              {/* 4 Digit Prize */}
              <div className="mb-8">
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/15 px-5 py-2 text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <Award className="h-4 w-4" />
                    {t.results.digit4}
                    <span className="ml-2 text-emerald-800 dark:text-white opacity-70">
                      {t.common.pay} {latestDraw.digit4Multiplier}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4 sm:gap-5">
                  {latestDraw.digit4.split("").map((n, i) => (
                    <LotteryBall
                      key={i}
                      number={n}
                      size="lg"
                      color="emerald"
                      className="h-20 w-20 text-5xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] sm:h-24 sm:w-24 sm:text-6xl"
                    />
                  ))}
                </div>
              </div>

              {/* Lower Prizes */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-navy-800/60 p-6 text-center transition-transform hover:scale-105 shadow-sm">
                  <div className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {t.results.digit3}
                  </div>
                  <div className="font-mono text-5xl font-bold tracking-widest text-gray-900 dark:text-white">
                    {latestDraw.digit3}
                  </div>
                  <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                    {t.common.pay} {latestDraw.digit3Multiplier}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-emerald-500/20 bg-white/60 dark:bg-navy-800/60 p-6 text-center transition-transform hover:scale-105 shadow-sm">
                  <div className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {t.results.digit2}
                  </div>
                  <div className="font-mono text-5xl font-bold tracking-widest text-gray-900 dark:text-white">
                    {latestDraw.digit2}
                  </div>
                  <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                    {t.common.pay} {latestDraw.digit2Multiplier}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pay Rate Table */}
          <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 shadow-sm">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.common.payRate}
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {[
                {
                  label: t.results.digit4,
                  multiplier: latestDraw.digit4Multiplier,
                  example:
                    language === "th"
                      ? "ซื้อ 1,000 กีบ ได้ 6,000,000 กีบ"
                      : "Buy 1,000 KIP, win 6,000,000 KIP",
                },
                {
                  label: t.results.digit3,
                  multiplier: latestDraw.digit3Multiplier,
                  example:
                    language === "th"
                      ? "ซื้อ 1,000 กีบ ได้ 500,000 กีบ"
                      : "Buy 1,000 KIP, win 500,000 KIP",
                },
                {
                  label: t.results.digit2,
                  multiplier: latestDraw.digit2Multiplier,
                  example:
                    language === "th"
                      ? "ซื้อ 1,000 กีบ ได้ 60,000 กีบ"
                      : "Buy 1,000 KIP, win 60,000 KIP",
                },
              ].map((rate, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start justify-between gap-2 px-6 py-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {rate.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {rate.example}
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-4 py-1 font-mono text-xl font-bold text-emerald-700 dark:text-emerald-300">
                    {rate.multiplier}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Checker */}
          <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/50 p-6 backdrop-blur-md shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {t.common.checkLaoResult}
            </h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.common.searchPlaceholder}
                  className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-navy-900 px-4 py-3 text-lg text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-emerald-600 hover:scale-105">
                <SearchIcon className="h-5 w-5" />
                {t.common.checkBtn}
              </button>
            </div>
          </section>

          {/* History */}
          <section className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 shadow-sm">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.results.history}
              </h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t.common.date}</th>
                    <th className="px-6 py-4 font-medium">
                      {t.results.digit4}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {t.results.digit3}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {t.results.digit2}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {recentResults.map((row, i) => (
                    <tr
                      key={i}
                      className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${i % 2 === 1 ? "bg-gray-50/50 dark:bg-white/[0.02]" : ""}`}
                    >
                      <td className="px-6 py-5 font-mono text-base tabular-nums text-gray-600 dark:text-gray-300">
                        {row.date}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                          {row.digit4}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-emerald-500 dark:text-emerald-300">
                          {row.digit3}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-emerald-700 dark:text-white">
                          {row.digit2}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card */}
            <div className="divide-y divide-gray-100 dark:divide-white/5 lg:hidden">
              {recentResults.map((row, i) => (
                <div
                  key={i}
                  className={`space-y-3 px-6 py-5 ${i % 2 === 1 ? "bg-gray-50/50 dark:bg-white/[0.02]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-500">
                      {row.date}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                      Laos
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit4}
                      </div>
                      <div className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {row.digit4}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit3}
                      </div>
                      <div className="font-mono text-xl font-bold text-emerald-500 dark:text-emerald-300">
                        {row.digit3}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit2}
                      </div>
                      <div className="font-mono text-xl font-bold text-emerald-700 dark:text-white">
                        {row.digit2}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed Info */}
          <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 p-6 md:p-8 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {t.staticParams.laoDetails.title}
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              {t.staticParams.laoDetails.desc}
            </p>

            <h4 className="mb-4 text-lg font-bold text-gray-900 dark:text-white border-l-4 border-emerald-500 pl-3">
              {t.staticParams.laoDetails.prizesTitle}
            </h4>
            <ul className="space-y-4">
              {t.staticParams.laoDetails.prizes.map(
                (prize: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-navy-800/30 p-4 rounded-lg border border-gray-100 dark:border-white/5"
                  >
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    <span className="leading-relaxed">{prize}</span>
                  </li>
                ),
              )}
            </ul>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Sidebar: Lottery Checker */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-navy-800/30 p-6 shadow-sm">
            <h3 className="mb-4 text-center text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {t.common.checkTicket}
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.common.inputPlaceholder4}
                  className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900 px-4 py-3 text-center text-lg text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-emerald-600 shadow-sm">
                <SearchIcon className="h-5 w-5" />
                {t.common.checkBtn}
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-navy-800/30 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {t.common.info}
            </h3>
            <div className="space-y-4 text-base">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {t.common.drawSchedule}
                </span>
                <span className="text-right text-gray-900 dark:text-white font-medium">
                  จันทร์, พุธ, ศุกร์
                  <br />
                  เวลา 20:30 น.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {t.common.type}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  หวยดิจิทัล
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {t.common.currency}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {t.common.kip}
                </span>
              </div>
            </div>
          </div>

          {/* News Sidebar with Images */}
          <NewsSidebar
            accentColor="emerald"
            icon={
              <NewspaperIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            }
          />

          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/30 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {t.common.otherLottery}
            </h3>
            <div className="space-y-3">
              <Link
                href="/results/thai-lotto"
                className="flex w-full items-center justify-between rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-navy-900 p-3 transition-colors hover:border-emerald-500/30 dark:hover:border-white/20 hover:bg-emerald-50/50 dark:hover:bg-navy-800"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={getFlagUrl("TH")}
                    alt="Thai flag"
                    width={28}
                    height={20}
                    className="rounded shadow-sm"
                  />
                  <div className="text-left font-semibold text-gray-900 dark:text-white">
                    {t.lottery.thai.name}
                    <div className="text-xs font-normal text-gray-500">GLO</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
