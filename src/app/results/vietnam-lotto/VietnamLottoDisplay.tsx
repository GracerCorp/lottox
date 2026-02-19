"use client";

import { LotteryBall } from "@/components/ui/LotteryBall";
import { getFlagUrl } from "@/lib/flags";
import {
  ShieldCheck,
  Clock,
  Award,
  Search,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsSidebar } from "@/components/ui/NewsSidebar";
import { SubscribeButton } from "@/components/ui/SubscribeButton";
import { VietnamLottoDraw } from "@/data/vietnamData";

interface VietnamLottoDisplayProps {
  lotteryType: "specific" | "special" | "normal" | "vip";
  data: {
    latest: VietnamLottoDraw;
    history: VietnamLottoDraw[];
    time: string;
  };
}

export default function VietnamLottoDisplay({
  lotteryType,
  data,
}: VietnamLottoDisplayProps) {
  const { t, language } = useLanguage();

  const lottoInfo = t.lottery.vietnam[lotteryType];
  const mainInfo = t.lottery.vietnam;

  // Custom multipliers matching the static params or passed in
  const multipliers = {
    digit4: "x850",
    digit3: "x120",
    digit2: "x92",
  };

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
                src={getFlagUrl("vn")}
                alt="Vietnam flag"
                className="mr-1.5 inline-block h-4 w-6 rounded-sm"
              />
              {mainInfo.country}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">{lottoInfo.time}</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded bg-red-800 shadow-sm">
              <img
                src={getFlagUrl("vn")}
                alt="Vietnam flag"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {lottoInfo.name}
              </h1>
              <p className="text-xs text-gray-500">{lottoInfo.subName}</p>
            </div>
          </div>
        </div>

        <SubscribeButton type={`VIETNAM_${lotteryType.toUpperCase()}`} />
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* SECTION 1: Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 shadow-2xl">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="mb-2 text-center text-sm uppercase tracking-widest text-red-400">
                {lottoInfo.subName}
              </div>
              <div className="mb-4 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-4">
                  <img
                    src={getFlagUrl("vn")}
                    alt="Vietnam flag"
                    className="inline-block h-10 w-10"
                  />
                  <h2 className="bg-gradient-to-r from-red-300 to-red-600 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-6xl text-center leading-tight">
                    {lottoInfo.name}
                  </h2>
                </div>
              </div>
              <div className="mb-8 text-center text-sm text-gray-400">
                {t.common.date} {data.latest.date} | {data.latest.drawNo}
              </div>

              {/* 4 Digits Prize */}
              <div className="mb-8">
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/15 px-5 py-2 text-sm font-bold uppercase tracking-wider text-red-400">
                    <Award className="h-4 w-4" />
                    {t.results.digit4}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4 sm:gap-5">
                  {data.latest.digit4.split("").map((n, i) => (
                    <LotteryBall
                      key={i}
                      number={n}
                      size="lg"
                      color="red"
                      className="h-20 w-20 text-5xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] sm:h-24 sm:w-24 sm:text-6xl"
                    />
                  ))}
                </div>
              </div>

              {/* Lower Prizes Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 3 Digits Top */}
                <div className="rounded-xl border border-white/10 bg-navy-800/60 p-4 text-center transition-transform hover:scale-105">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-red-400">
                    {t.results.digit3Top}
                  </div>
                  <div className="font-mono text-4xl font-bold tracking-widest text-white">
                    {data.latest.digit3}
                  </div>
                  <div className="mt-1 text-xs text-red-400">
                    {multipliers.digit3}
                  </div>
                </div>

                {/* 2 Digits Top */}
                <div className="rounded-xl border border-white/10 bg-navy-800/60 p-4 text-center transition-transform hover:scale-105">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-red-400">
                    {t.results.digit2Top}
                  </div>
                  <div className="font-mono text-4xl font-bold tracking-widest text-white">
                    {data.latest.digit2}
                  </div>
                  <div className="mt-1 text-xs text-red-400">
                    {multipliers.digit2}
                  </div>
                </div>

                {/* 2 Digits Bottom */}
                <div className="rounded-xl border border-white/10 bg-navy-800/60 p-4 text-center transition-transform hover:scale-105">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-red-400">
                    {t.results.digit2Bottom}
                  </div>
                  <div className="font-mono text-4xl font-bold tracking-widest text-white">
                    {data.latest.digit2Bottom}
                  </div>
                  <div className="mt-1 text-xs text-red-400">
                    {multipliers.digit2}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pay Rate Table - Update Labels */}
          <section className="rounded-xl border border-white/10 bg-navy-900/50">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {t.common.payRate}
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {[
                {
                  label: t.results.digit3Top,
                  multiplier: "850 : 1",
                  example: "บาทละ 850",
                },
                {
                  label: "3 ตัวโต๊ด",
                  multiplier: "120 : 1",
                  example: "บาทละ 120",
                },
                {
                  label: t.results.digit2Top,
                  multiplier: "92 : 1",
                  example: "บาทละ 92",
                },
                {
                  label: t.results.digit2Bottom,
                  multiplier: "92 : 1",
                  example: "บาทละ 92",
                },
              ].map((rate, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start justify-between gap-2 px-6 py-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="text-lg font-bold text-red-400">
                      {rate.label}
                    </div>
                    <div className="text-sm text-gray-400">{rate.example}</div>
                  </div>
                  <div className="rounded-full bg-red-500/10 px-4 py-1 font-mono text-xl font-bold text-red-300">
                    {rate.multiplier}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Checker */}
          <section className="rounded-xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-bold text-white">
              {t.common.checkResult}
            </h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.common.searchPlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-lg text-white outline-none focus:border-red-500"
                />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-red-600 hover:scale-105">
                <Search className="h-5 w-5" />
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
                      {t.results.digit3Top}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {t.results.digit2Top}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {t.results.digit2Bottom}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.history.map((row, i) => (
                    <tr
                      key={i}
                      className={`group hover:bg-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                    >
                      <td className="px-6 py-5 font-mono text-base tabular-nums text-gray-300">
                        {row.date}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-red-400">
                          {row.digit4}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-red-300">
                          {row.digit3}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-white">
                          {row.digit2}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-mono text-2xl font-bold tracking-widest text-white">
                          {row.digit2Bottom}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card */}
            <div className="divide-y divide-white/5 lg:hidden">
              {data.history.map((row, i) => (
                <div
                  key={i}
                  className={`space-y-3 px-6 py-5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-500">
                      {row.date}
                    </span>
                    <span className="text-sm font-bold text-red-500">
                      {lottoInfo.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="col-span-2">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit4}
                      </div>
                      <div className="font-mono text-xl font-bold text-red-400">
                        {row.digit4}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit3Top}
                      </div>
                      <div className="font-mono text-xl font-bold text-red-300">
                        {row.digit3}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit2Top}
                      </div>
                      <div className="font-mono text-xl font-bold text-white">
                        {row.digit2}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.digit2Bottom}
                      </div>
                      <div className="font-mono text-xl font-bold text-white">
                        {row.digit2Bottom}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed Info */}
          <section className="rounded-xl border border-white/10 bg-navy-900/50 p-6 md:p-8">
            <h3 className="mb-4 text-xl font-bold text-red-400">
              {t.staticParams.vietnamDetails.title}
            </h3>
            <p className="mb-6 text-gray-300 leading-relaxed">
              {t.staticParams.vietnamDetails.desc}
            </p>

            <h4 className="mb-4 text-lg font-bold text-white border-l-4 border-red-500 pl-3">
              {t.staticParams.vietnamDetails.prizesTitle}
            </h4>
            <ul className="space-y-4">
              {t.staticParams.vietnamDetails.prizes.map(
                (prize: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-3 text-gray-300 bg-navy-800/30 p-4 rounded-lg border border-white/5"
                  >
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
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
          <div className="rounded-xl border border-red-500/20 bg-navy-800/30 p-6">
            <h3 className="mb-4 text-center text-lg font-bold text-red-400">
              {t.common.checkTicket}
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.common.inputPlaceholder4}
                  className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-center text-lg text-white outline-none focus:border-red-500"
                />
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-3 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-red-600">
                <Search className="h-5 w-5" />
                {t.common.checkBtn}
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="rounded-xl border border-red-500/20 bg-navy-800/30 p-6">
            <h3 className="mb-4 text-lg font-bold text-red-400">
              {t.common.info}
            </h3>
            <div className="space-y-4 text-base">
              <div className="flex justify-between">
                <span className="text-gray-400">{t.common.drawSchedule}</span>
                <span className="text-right text-white">
                  ทุกวัน <br /> เวลา {lottoInfo.time} น.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t.common.type}</span>
                <span className="text-white">{lottoInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t.common.currency}</span>
                <span className="text-white">VND (ดง)</span>
              </div>
            </div>
          </div>

          {/* News Sidebar with Images */}
          <NewsSidebar
            accentColor="red"
            icon={<Newspaper className="h-4 w-4 text-red-400" />}
          />

          {/* Links to Other Lotteries */}
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

              <Link
                href="/results/lao-lotto"
                className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-navy-900 p-3 transition-colors hover:border-white/20"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={getFlagUrl("la")}
                    alt="Lao flag"
                    width={28}
                    height={20}
                    className="rounded shadow-sm"
                  />
                  <div className="text-left font-semibold text-white">
                    {t.lottery.lao.name}
                    <div className="text-xs font-normal text-gray-500">
                      {t.lottery.lao.subName}
                    </div>
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
