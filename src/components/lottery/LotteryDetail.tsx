"use client";

import { DrawResult } from "./DrawResult";
import { TicketVerifier } from "@/components/country/TicketVerifier";
import { SubscribeButton } from "@/components/ui/SubscribeButton";
import { NewsSidebar } from "@/components/ui/NewsSidebar";
import {
  NewspaperIcon,
  SearchIcon,
  ShieldCheck,
  AlertTriangle,
  Ticket,
  CalendarDays,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { useApi } from "@/lib/hooks/useApi";
import { ResultsByTypeResponse, ThaiResultData } from "@/lib/api-types";
import { getFlagUrl } from "@/lib/flags";
import Image from "next/image";

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
        <div className="mb-8 h-20 rounded-lg bg-gray-200 dark:bg-navy-800/50" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-96 rounded-2xl bg-gray-200 dark:bg-navy-800/50" />
            <div className="h-48 rounded-xl bg-gray-200 dark:bg-navy-800/50" />
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

  // Helper to extract data from the new `chosen_data` prizes array
  const getPrizeNumber = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d: any,
    names: string[],
    categories: string[] = [],
    fallbackOrder?: number,
  ) => {
    if (d?.prizes && Array.isArray(d.prizes)) {
      const p = d.prizes.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) =>
          names.includes(p.prizeName) || categories.includes(p.category),
      );
      if (p) {
        const nums = p.winningNumbers || p.number;
        return Array.isArray(nums) ? nums : [nums];
      }
      // Fallback: match by order field
      if (fallbackOrder !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const byOrder = d.prizes.find((p: any) => p.order === fallbackOrder);
        if (byOrder) {
          const nums = byOrder.winningNumbers || byOrder.number;
          return Array.isArray(nums) ? nums : [nums];
        }
      }
    }
    return undefined;
  };

  const getPrizeAmount = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d: any,
    names: string[],
    categories: string[] = [],
    fallbackOrder?: number,
  ) => {
    if (d?.prizes && Array.isArray(d.prizes)) {
      const p = d.prizes.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) =>
          names.includes(p.prizeName) || categories.includes(p.category),
      );
      if (p) return String(p.amount || p.prizeAmount || p.reward || "");
      // Fallback: match by order field
      if (fallbackOrder !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const byOrder = d.prizes.find((p: any) => p.order === fallbackOrder);
        if (byOrder)
          return String(
            byOrder.amount || byOrder.prizeAmount || byOrder.reward || "",
          );
      }
    }
    return undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawData = latestData as any;

  const p1Names = [
    "Prize 1",
    "รางวัลที่ 1",
    "Special Prize",
    "First Prize",
    "First Prize (4 Digits)",
  ];
  const p1Cats = ["prize_1", "prizeFirst", "prizeSpecial", "prize_4_digits"];
  const p1Num = getPrizeNumber(rawData, p1Names, p1Cats, 1) || [
    rawData?.first || rawData?.firstPrize,
  ];
  const firstPrize =
    p1Num && p1Num.length > 0 && p1Num[0] !== undefined ? p1Num[0] : "-";
  const firstPrizeAmount =
    getPrizeAmount(rawData, p1Names, p1Cats, 1) ||
    rawData?.firstPrizeAmount ||
    "6,000,000";

  const pFront3Names = ["3 Front", "เลขหน้า 3 ตัว", "รางวัลเลขหน้า 3 ตัว"];
  const pFront3Cats = [
    "running_number_front_3",
    "prizeLast3Front",
    "prize_3_front",
  ];
  const front3 =
    getPrizeNumber(rawData, pFront3Names, pFront3Cats) ||
    rawData?.first3?.number ||
    rawData?.last3f ||
    rawData?.front3 ||
    [];

  const pBack3Names = [
    "3 Back",
    "เลขท้าย 3 ตัว",
    "รางวัลเลขท้าย 3 ตัว",
    "3 Last Digits",
  ];
  const pBack3Cats = [
    "running_number_back_3",
    "prizeLast3Back",
    "prize_3_back",
    "prize_3_digits",
  ];
  const back3 =
    getPrizeNumber(rawData, pBack3Names, pBack3Cats, 2) ||
    rawData?.last3?.number ||
    rawData?.last3b ||
    rawData?.back3 ||
    [];

  const p2Names = [
    "2 Bottom",
    "เลขท้าย 2 ตัว",
    "รางวัลเลขท้าย 2 ตัว",
    "2 Last Digits",
  ];
  const p2Cats = ["running_number_back_2", "prizeLast2", "prize_2_digits"];
  const l2Num = getPrizeNumber(rawData, p2Names, p2Cats, 3) ||
    rawData?.last2?.number || [rawData?.last2];
  const last2 = Array.isArray(l2Num) ? l2Num[0] : l2Num;

  const pAdjNames = [
    "Adjacent Prizes",
    "รางวัลข้างเคียงรางวัลที่ 1",
    "รางวัลข้างเคียง",
  ];
  const pAdjCats = ["nearby_prize_1"];
  // Helper to format any date string into human-readable locale format
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr || dateStr === "-") return dateStr;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Format date for display - make it human readable and clear
  const rawDateStr = latest?.dateDisplay || latest?.date || "-";
  let formattedDate = rawDateStr;
  if (rawDateStr && rawDateStr !== "-") {
    try {
      const dateObj = new Date(rawDateStr);
      formattedDate = dateObj.toLocaleDateString(
        language === "th" ? "th-TH" : "en-US",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      );
    } catch {
      formattedDate = rawDateStr;
    }
  }

  // Extract dynamic prizes for non-Thai lotteries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPrizes = (rawData?.prizes || []) as any[];
  const isNonThai = countryCode !== "th";

  const drawResultProps = {
    country: country,
    lotteryName: lotteryName,
    date: formattedDate,
    drawId: latest?.drawNo || "-",
    firstPrize: String(firstPrize || "-"),
    firstPrizeAmount: String(firstPrizeAmount),
    // Pass dynamicPrizes for non-Thai lotteries
    dynamicPrizes: isNonThai && rawPrizes.length > 0 ? rawPrizes : [],
    front3: (Array.isArray(front3) ? front3 : [front3])
      .map(String)
      .filter((s) => s !== "undefined"),
    front3Amount: String(
      getPrizeAmount(rawData, pFront3Names, pFront3Cats) ||
        rawData?.first3?.amount ||
        rawData?.front3Amount ||
        "4,000",
    ),
    back3: (Array.isArray(back3) ? back3 : [back3])
      .map(String)
      .filter((s) => s !== "undefined"),
    back3Amount: String(
      getPrizeAmount(rawData, pBack3Names, pBack3Cats) ||
        rawData?.last3?.amount ||
        rawData?.back3Amount ||
        "4,000",
    ),
    last2: String(last2 || "-"),
    last2Amount: String(
      getPrizeAmount(rawData, p2Names, p2Cats) ||
        rawData?.last2?.amount ||
        rawData?.last2Amount ||
        "2,000",
    ),
    adjacent: (
      getPrizeNumber(rawData, pAdjNames, pAdjCats) ||
      rawData?.adjacent ||
      []
    )?.map(String),
    adjacentAmount: String(
      getPrizeAmount(rawData, pAdjNames, pAdjCats) ||
        rawData?.adjacentAmount ||
        "100,000",
    ),
  };

  const recentResults = historyItems.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = item.data as any;

    const rp1Num = getPrizeNumber(d, p1Names, p1Cats, 1) || [
      d?.first || d?.firstPrize,
    ];
    const rFirstPrize =
      rp1Num && rp1Num.length > 0 && rp1Num[0] !== undefined ? rp1Num[0] : "-";

    const rFront3 =
      getPrizeNumber(d, pFront3Names, pFront3Cats) ||
      d?.first3?.number ||
      d?.last3f ||
      d?.front3 ||
      [];
    const rBack3 =
      getPrizeNumber(d, pBack3Names, pBack3Cats, 2) ||
      d?.last3?.number ||
      d?.last3b ||
      d?.back3 ||
      [];

    const rl2Num = getPrizeNumber(d, p2Names, p2Cats, 3) ||
      d?.last2?.number || [d?.last2];
    const rLast2 = Array.isArray(rl2Num) ? rl2Num[0] : rl2Num;

    return {
      date: formatDateDisplay(item.dateDisplay || item.date),
      firstPrize: String(rFirstPrize || "-"),
      last3f: String((Array.isArray(rFront3) ? rFront3 : [rFront3])[0] || "-"),
      last3b: String((Array.isArray(rBack3) ? rBack3 : [rBack3])[0] || "-"),
      last2: String(rLast2 || "-"),
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
            <span className="dark:text-gray-400 text-gray-600 flex items-center">
              <Image
                src={getFlagUrl(countryCode)}
                alt={`${country} flag`}
                width={24}
                height={16}
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

        {/* Subscribe Button */}
        <div className="relative z-20">
          <SubscribeButton type={countryCode} />
        </div>
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
              count:
                (
                  getPrizeNumber(
                    rawData,
                    ["Prize 2", "รางวัลที่ 2"],
                    ["prize_2"],
                  ) || rawData?.prize2
                )?.length || 0,
              amount:
                getPrizeAmount(
                  rawData,
                  ["Prize 2", "รางวัลที่ 2"],
                  ["prize_2"],
                ) ||
                rawData?.prize2Amount ||
                "200,000",
              numbers:
                getPrizeNumber(
                  rawData,
                  ["Prize 2", "รางวัลที่ 2"],
                  ["prize_2"],
                ) ||
                rawData?.prize2 ||
                [],
            },
            {
              title: t.results.prize3rank,
              count:
                (
                  getPrizeNumber(
                    rawData,
                    ["Prize 3", "รางวัลที่ 3"],
                    ["prize_3"],
                  ) || rawData?.prize3
                )?.length || 0,
              amount:
                getPrizeAmount(
                  rawData,
                  ["Prize 3", "รางวัลที่ 3"],
                  ["prize_3"],
                ) ||
                rawData?.prize3Amount ||
                "80,000",
              numbers:
                getPrizeNumber(
                  rawData,
                  ["Prize 3", "รางวัลที่ 3"],
                  ["prize_3"],
                ) ||
                rawData?.prize3 ||
                [],
            },
            {
              title: t.results.prize4rank,
              count:
                (
                  getPrizeNumber(
                    rawData,
                    ["Prize 4", "รางวัลที่ 4"],
                    ["prize_4"],
                  ) || rawData?.prize4
                )?.length || 0,
              amount:
                getPrizeAmount(
                  rawData,
                  ["Prize 4", "รางวัลที่ 4"],
                  ["prize_4"],
                ) ||
                rawData?.prize4Amount ||
                "40,000",
              numbers:
                getPrizeNumber(
                  rawData,
                  ["Prize 4", "รางวัลที่ 4"],
                  ["prize_4"],
                ) ||
                rawData?.prize4 ||
                [],
            },
            {
              title: t.results.prize5rank,
              count:
                (
                  getPrizeNumber(
                    rawData,
                    ["Prize 5", "รางวัลที่ 5"],
                    ["prize_5"],
                  ) || rawData?.prize5
                )?.length || 0,
              amount:
                getPrizeAmount(
                  rawData,
                  ["Prize 5", "รางวัลที่ 5"],
                  ["prize_5"],
                ) ||
                rawData?.prize5Amount ||
                "20,000",
              numbers:
                getPrizeNumber(
                  rawData,
                  ["Prize 5", "รางวัลที่ 5"],
                  ["prize_5"],
                ) ||
                rawData?.prize5 ||
                [],
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
          <section className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/80 p-6 backdrop-blur-md shadow-lg">
            {/* Background design elements */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/5 blur-[80px]"></div>
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]"></div>

            <div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/20 text-gold-500">
                    <SearchIcon className="h-4 w-4" />
                  </div>
                  {t.common.checkResult}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t.common.checkResultDesc}
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-5">
              <div className="flex flex-col gap-4 md:flex-row">
                {/* Draw Date Selection */}
                <div className="flex-1">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t.common.drawDate}
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-navy-900/50 py-3.5 pl-11 pr-10 text-gray-900 dark:text-white outline-none transition-all focus:border-gold-500 focus:bg-white dark:focus:bg-navy-900 focus:ring-2 focus:ring-gold-500/20">
                      <option value="">
                        {t.common.latestDraw} (
                        {latest?.dateDisplay ||
                          latest?.date ||
                          t.common.current}
                        )
                      </option>
                      {historyItems.slice(0, 5).map((item, idx) => (
                        <option key={idx} value={item.date}>
                          {formatDateDisplay(item.dateDisplay || item.date)}
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
                      placeholder={`${t.common.inputPlaceholder} ${t.common.ticketExample}`}
                      className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-navy-900/50 py-3.5 pl-11 pr-4 font-mono text-lg tracking-widest text-gray-900 dark:text-white outline-none transition-all placeholder:font-sans placeholder:text-sm placeholder:tracking-normal focus:border-gold-500 focus:bg-white dark:focus:bg-navy-900 focus:ring-2 focus:ring-gold-500/20"
                    />
                    <Ticket className="absolute left-4 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-100 dark:border-white/5 pt-5 sm:flex-row">
                <button className="text-sm font-medium text-gray-500 transition-colors hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400">
                  {t.common.addMoreTickets}
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-gold-500/25 transition-all hover:scale-[1.02] hover:shadow-gold-500/40 active:scale-95 sm:w-auto">
                  <SearchIcon className="h-5 w-5" />
                  {t.common.checkBtn}
                </button>
              </div>
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
                      <Image
                        src={getFlagUrl(countryCode)}
                        alt={countryCode}
                        width={24}
                        height={16}
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
            category={countryCode} // Use countryCode or country word as category. For example 'th', 'la', 'vn' or their full names. Let's use `countryCode` assuming articles might be tagged with country codes or we can adjust later, or `country` which is "Thai", "Lao", "Vietnam". I will use `country` since it maps to categories like "Thai", "Lao", etc.
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
                  href={`/${countryCode}/${lotterySlug}/${item.date}`}
                  className="block rounded bg-gray-100 dark:bg-white/5 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gold-600 dark:hover:text-gold-400"
                >
                  {language === "th" ? "งวด " : "Draw "}
                  {formatDateDisplay(item.dateDisplay || item.date)}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
