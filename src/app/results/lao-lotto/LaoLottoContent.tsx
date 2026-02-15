"use client";

import { LotteryBall } from "@/components/ui/LotteryBall";
import { getFlagUrl } from "@/lib/flags";
import {
  ShieldCheck,
  Zap,
  Clock,
  AlertTriangle,
  Award,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsArticles } from "@/lib/newsData";

/* ── SVG Search Icon ── */
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

/* ── SVG Newspaper Icon ── */
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

const latestDraw = {
  date: "13 กุมภาพันธ์ 2569",
  drawNo: "#18/2569",
  daysAgo: "วันนี้",
  digit4: "4045",
  digit3: "045",
  digit2: "45",
  digit1: "5",
  digit4Multiplier: "x6,000",
  digit3Multiplier: "x500",
  digit2Multiplier: "x60",
};

const recentResults = [
  {
    date: "13 ก.พ. 69",
    digit4: "4045",
    digit3: "045",
    digit2: "45",
  },
  {
    date: "10 ก.พ. 69",
    digit4: "8520",
    digit3: "520",
    digit2: "20",
  },
  {
    date: "8 ก.พ. 69",
    digit4: "1209",
    digit3: "209",
    digit2: "09",
  },
  {
    date: "6 ก.พ. 69",
    digit4: "9945",
    digit3: "945",
    digit2: "45",
  },
];

export default function LaoLottoContent() {
  const { t, language } = useLanguage();
  const sidebarNews = newsArticles.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header + Logo */}
      <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-green-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> {t.header.verified}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">
              <img
                src={getFlagUrl("la")}
                alt="Laos flag"
                className="mr-1.5 inline-block h-4 w-6 rounded-sm"
              />
              {t.lottery.lao.country}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded bg-red-800 shadow-sm">
              <img
                src={getFlagUrl("la")}
                alt="Laos flag"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {t.lottery.lao.name}
              </h1>
              <p className="text-xs text-gray-500">{t.lottery.lao.subName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* SECTION 1: Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 shadow-2xl">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="mb-2 text-center text-sm uppercase tracking-widest text-emerald-400">
                {t.lottery.lao.subName}
              </div>
              <div className="mb-4 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-4">
                  <img
                    src={getFlagUrl("la")}
                    alt="Laos flag"
                    className="inline-block h-10 w-10"
                  />
                  <h2 className="bg-gradient-to-r from-emerald-300 to-emerald-600 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-6xl text-center leading-tight">
                    {t.lottery.lao.name}
                  </h2>
                </div>
              </div>
              <div className="mb-8 text-center text-sm text-gray-400">
                {t.common.date} {latestDraw.date} | {latestDraw.drawNo} |{" "}
                {latestDraw.daysAgo}
              </div>

              {/* 4 Digit Prize */}
              <div className="mb-8">
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-5 py-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
                    <Award className="h-4 w-4" />
                    {t.results.digit4}
                    <span className="ml-2 text-white opacity-70">
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
                <div className="rounded-xl border border-white/10 bg-navy-800/60 p-6 text-center transition-transform hover:scale-105">
                  <div className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-400">
                    {t.results.digit3}
                  </div>
                  <div className="font-mono text-5xl font-bold tracking-widest text-white">
                    {latestDraw.digit3}
                  </div>
                  <div className="mt-2 text-sm text-emerald-400">
                    {t.common.pay} {latestDraw.digit3Multiplier}
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-navy-800/60 p-6 text-center transition-transform hover:scale-105">
                  <div className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-400">
                    {t.results.digit2}
                  </div>
                  <div className="font-mono text-5xl font-bold tracking-widest text-white">
                    {latestDraw.digit2}
                  </div>
                  <div className="mt-2 text-sm text-emerald-400">
                    {t.common.pay} {latestDraw.digit2Multiplier}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pay Rate Table */}
          <section className="rounded-xl border border-white/10 bg-navy-900/50">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {t.common.payRate}
              </h3>
            </div>
            <div className="divide-y divide-white/5">
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
                    <div className="text-lg font-bold text-emerald-400">
                      {rate.label}
                    </div>
                    <div className="text-sm text-gray-400">{rate.example}</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-4 py-1 font-mono text-xl font-bold text-emerald-300">
                    {rate.multiplier}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Checker (UPDATED) */}
          <section className="rounded-xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-bold text-white">
              {t.common.checkLaoResult}
            </h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.common.searchPlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-lg text-white outline-none focus:border-emerald-500"
                />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-emerald-600 hover:scale-105">
                <SearchIcon className="h-5 w-5" />
                {t.common.checkBtn}
              </button>
            </div>
          </section>

          {/* History */}
          <section className="overflow-hidden rounded-xl border border-white/10 bg-navy-900/50">
            <div className="border-b border-white/10 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                {t.results.history}
              </h3>
            </div>

            {/* Desktop Table - Bigger Fonts */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs uppercase text-gray-400">
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
                <tbody className="divide-y divide-white/5">
                  {recentResults.map((row, i) => (
                    <tr
                      key={i}
                      className={`group hover:bg-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                    >
                      <td className="px-6 py-5 font-mono text-base tabular-nums text-gray-300">
                        {row.date}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-emerald-400">
                          {row.digit4}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-emerald-300">
                          {row.digit3}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-white">
                          {row.digit2}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card */}
            <div className="divide-y divide-white/5 lg:hidden">
              {recentResults.map((row, i) => (
                <div
                  key={i}
                  className={`space-y-3 px-6 py-5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-500">
                      {row.date}
                    </span>
                    <span className="text-sm font-bold text-emerald-500">
                      Laos
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit4}
                      </div>
                      <div className="font-mono text-xl font-bold text-emerald-400">
                        {row.digit4}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit3}
                      </div>
                      <div className="font-mono text-xl font-bold text-emerald-300">
                        {row.digit3}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit2}
                      </div>
                      <div className="font-mono text-xl font-bold text-white">
                        {row.digit2}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Info Card */}
          <div className="rounded-xl border border-emerald-500/20 bg-navy-800/30 p-6">
            <h3 className="mb-4 text-lg font-bold text-emerald-400">
              {t.common.info}
            </h3>
            <div className="space-y-4 text-base">
              <div className="flex justify-between">
                <span className="text-gray-400">{t.common.drawSchedule}</span>
                <span className="text-right text-white">
                  จันทร์, พุธ, ศุกร์
                  <br />
                  เวลา 20:30 น.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t.common.type}</span>
                <span className="text-white">หวยดิจิทัล</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t.common.currency}</span>
                <span className="text-white">{t.common.kip}</span>
              </div>
            </div>
          </div>

          {/* News Sidebar with Images */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-800/30">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <NewspaperIcon className="h-4 w-4 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                {t.common.newsTitle}
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {sidebarNews.map((news, i) => (
                <Link
                  key={i}
                  href={`/news/${news.slug}`}
                  className={`flex gap-3 px-4 py-4 transition-colors hover:bg-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={news.image}
                      alt={language === "th" ? news.title : news.titleEn}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <span className="mb-1 inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-400 w-fit">
                      {language === "th" ? news.category : news.categoryEn}
                    </span>
                    <h4 className="text-sm font-bold text-gray-200 line-clamp-2 leading-snug">
                      {language === "th" ? news.title : news.titleEn}
                    </h4>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                      <Clock className="h-3 w-3" />
                      {news.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-navy-800/30 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">
              {t.common.otherLottery}
            </h3>
            <div className="space-y-3">
              <Link
                href="/results/thai-lotto"
                className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-navy-900 p-3 transition-colors hover:border-white/20"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={getFlagUrl("TH")}
                    alt="Thai flag"
                    width={28}
                    height={20}
                    className="rounded shadow-sm"
                  />
                  <div className="text-left font-semibold text-white">
                    {t.lottery.thai.name}
                    <div className="text-xs font-normal text-gray-500">GLO</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
