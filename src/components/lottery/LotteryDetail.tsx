"use client";

import { DrawResult } from "./DrawResult";
import { DrawPageHeader } from "./DrawPageHeader";
import { PrizeTierSection } from "./PrizeTierSection";
import { PreviousDrawsSidebar } from "./PreviousDrawsSidebar";
import { FindByNumber } from "./FindByNumber";
import { RecentGlobalDraws } from "./RecentGlobalDraws";
import { NewsSidebar } from "@/components/ui/NewsSidebar";
import { InteractiveTicketVerifier } from "./InteractiveTicketVerifier";
import { NewspaperIcon, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { useApi } from "@/lib/hooks/useApi";
import { ResultsByTypeResponse, ThaiResultData } from "@/lib/api-types";
import { getFlagUrl } from "@/lib/flags";
import Image from "next/image";
import {
  getPrizeNumber,
  getPrizeAmount,
  getPrizeName,
  formatDateDisplay,
  GenericPrizeData,
} from "@/lib/utils/lotteryUtils";

export interface LotteryDetailProps {
  country: string;
  countryCode: string;
  lotteryName: string;
  lotterySlug: string;
  apiEndpoint: string;
  logo?: string | null;
  currency?: string | null;
  initialData?: ResultsByTypeResponse;
  genericPrizeData?: GenericPrizeData;
}

export default function LotteryDetail({
  country,
  countryCode,
  lotteryName,
  lotterySlug,
  apiEndpoint,
  logo,
  currency,
  initialData,
}: LotteryDetailProps) {
  const { t, language } = useLanguage();
  const dd = t.staticParams.drawDetail;
  const {
    data: apiData,
    loading,
    error,
  } = useApi<ResultsByTypeResponse>(
    initialData ? null : `${apiEndpoint}?limit=10`,
  );

  const activeData = initialData || apiData;
  const isLoading = !initialData && loading;

  /* ---------- Loading State ---------- */
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="mb-8 h-20 rounded-lg bg-slate-100 dark:bg-navy-800/50" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-96 rounded-2xl bg-slate-100 dark:bg-navy-800/50" />
            <div className="h-48 rounded-xl bg-slate-100 dark:bg-navy-800/50" />
            <div className="h-48 rounded-xl bg-slate-100 dark:bg-navy-800/50" />
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-xl bg-slate-100 dark:bg-navy-800/50" />
            <div className="h-48 rounded-xl bg-slate-100 dark:bg-navy-800/50" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Error State ---------- */
  if (error && !initialData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-8 text-center text-red-500 dark:text-red-400">
          Error loading {lotteryName} results.
        </div>
      </div>
    );
  }

  /* ---------- Data Extraction ---------- */
  const latest = activeData?.latest;
  const historyItems = activeData?.history ?? [];
  const latestData = latest?.data as ThaiResultData | undefined;
  const rawData = latestData as unknown as GenericPrizeData;

  // 1st Prize
  const p1Names = ["Prize 1", "รางวัลที่ 1", "Special Prize", "First Prize", "First Prize (4 Digits)"];
  const p1Cats = ["prize_1", "prizeFirst", "prizeSpecial", "prize_4_digits"];
  const p1Num = getPrizeNumber(rawData, p1Names, p1Cats, 1) || [rawData?.first || rawData?.firstPrize];
  const firstPrize = p1Num && p1Num.length > 0 && p1Num[0] !== undefined ? p1Num[0] : "-";
  const firstPrizeAmount = getPrizeAmount(rawData, p1Names, p1Cats, 1) || rawData?.firstPrizeAmount || "6,000,000";

  // 3-digit front
  const pFront3Names = ["3 Front", "เลขหน้า 3 ตัว", "รางวัลเลขหน้า 3 ตัว"];
  const pFront3Cats = ["running_number_front_3", "prizeLast3Front", "prize_3_front"];
  const front3 = getPrizeNumber(rawData, pFront3Names, pFront3Cats) || rawData?.first3?.number || rawData?.last3f || rawData?.front3 || [];

  // 3-digit back
  const pBack3Names = ["3 Back", "เลขท้าย 3 ตัว", "รางวัลเลขท้าย 3 ตัว", "3 Last Digits"];
  const pBack3Cats = ["running_number_back_3", "prizeLast3Back", "prize_3_back", "prize_3_digits"];
  const back3 = getPrizeNumber(rawData, pBack3Names, pBack3Cats, 2) || rawData?.last3?.number || rawData?.last3b || rawData?.back3 || [];

  // 2-digit last
  const p2Names = ["2 Bottom", "เลขท้าย 2 ตัว", "รางวัลเลขท้าย 2 ตัว", "2 Last Digits"];
  const p2Cats = ["running_number_back_2", "prizeLast2", "prize_2_digits"];
  const l2Num = getPrizeNumber(rawData, p2Names, p2Cats, 3) || rawData?.last2?.number || [rawData?.last2];
  const last2 = Array.isArray(l2Num) ? l2Num[0] : l2Num;

  // Adjacent
  const pAdjNames = ["Adjacent Prizes", "รางวัลข้างเคียงรางวัลที่ 1", "รางวัลข้างเคียง"];
  const pAdjCats = ["nearby_prize_1"];

  // Date
  const rawDateStr = latest?.dateDisplay || latest?.date || "-";
  const formattedDate = formatDateDisplay(rawDateStr, language);

  // Dynamic prizes for non-Thai
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPrizes = (rawData?.prizes || []) as any[];
  const isNonThai = countryCode !== "th";

  /* ---------- DrawResult Props ---------- */
  const drawResultProps = {
    country,
    lotteryName,
    date: formattedDate,
    currency: currency || undefined,
    firstPrize: String(firstPrize || "-"),
    firstPrizeAmount: String(firstPrizeAmount),
    dynamicPrizes: isNonThai && rawPrizes.length > 0 ? rawPrizes : [],
    front3: (Array.isArray(front3) ? front3 : [front3]).map(String).filter((s) => s !== "undefined"),
    front3Amount: String(getPrizeAmount(rawData, pFront3Names, pFront3Cats) || rawData?.first3?.amount || rawData?.front3Amount || "4,000"),
    back3: (Array.isArray(back3) ? back3 : [back3]).map(String).filter((s) => s !== "undefined"),
    back3Amount: String(getPrizeAmount(rawData, pBack3Names, pBack3Cats) || rawData?.last3?.amount || rawData?.back3Amount || "4,000"),
    last2: String(last2 || "-"),
    last2Amount: String(getPrizeAmount(rawData, p2Names, p2Cats) || rawData?.last2?.amount || rawData?.last2Amount || "2,000"),
    adjacent: (getPrizeNumber(rawData, pAdjNames, pAdjCats) || rawData?.adjacent || [])?.map(String),
    adjacentAmount: String(getPrizeAmount(rawData, pAdjNames, pAdjCats) || rawData?.adjacentAmount || "100,000"),
  };

  /* ---------- Prize Tier Data (Thai) ---------- */
  const prizeTiers = [
    { title: t.results.prize2rank, names: ["Prize 2", "รางวัลที่ 2"], cats: ["prize_2"], fallback: rawData?.prize2, amountFallback: rawData?.prize2Amount || "200,000" },
    { title: t.results.prize3rank, names: ["Prize 3", "รางวัลที่ 3"], cats: ["prize_3"], fallback: rawData?.prize3, amountFallback: rawData?.prize3Amount || "80,000" },
    { title: t.results.prize4rank, names: ["Prize 4", "รางวัลที่ 4"], cats: ["prize_4"], fallback: rawData?.prize4, amountFallback: rawData?.prize4Amount || "40,000" },
    { title: t.results.prize5rank, names: ["Prize 5", "รางวัลที่ 5"], cats: ["prize_5"], fallback: rawData?.prize5, amountFallback: rawData?.prize5Amount || "20,000" },
  ].map((tier) => {
    const numbers = getPrizeNumber(rawData, tier.names, tier.cats) || tier.fallback || [];
    return {
      title: tier.title,
      count: numbers?.length || 0,
      amount: getPrizeAmount(rawData, tier.names, tier.cats) || tier.amountFallback,
      numbers: numbers || [],
    };
  });

  /* ---------- All Prizes (for ticket verifier + find-by-number) ---------- */
  const allPrizes: { name: string; amount: string; numbers: string[] }[] = [];
  if (isNonThai && rawPrizes.length > 0) {
    rawPrizes.forEach(
      (p: {
        prizeName?: string; category?: string;
        winningNumbers?: string[]; number?: string | string[];
        amount?: number | string; prizeAmount?: number | string; reward?: number | string;
      }) => {
        const pNumbers = p.winningNumbers || p.number || [];
        const nums = (Array.isArray(pNumbers) ? pNumbers : [pNumbers]).map(String).filter((s: string) => s !== "undefined" && s !== "null");
        allPrizes.push({
          name: getPrizeName(p.prizeName || p.category || "Prize", p.category, t),
          amount: String(p.amount || p.prizeAmount || p.reward || "0"),
          numbers: nums,
        });
      },
    );
  } else {
    if (firstPrize && firstPrize !== "-") allPrizes.push({ name: t.results.prize1, amount: drawResultProps.firstPrizeAmount, numbers: [String(firstPrize)] });
    if (front3.length > 0) allPrizes.push({ name: t.results.prize3Front, amount: drawResultProps.front3Amount, numbers: front3.map(String) });
    if (back3.length > 0) allPrizes.push({ name: t.results.prize3Back, amount: drawResultProps.back3Amount, numbers: back3.map(String) });
    if (last2 && last2 !== "-") allPrizes.push({ name: t.results.prize2, amount: drawResultProps.last2Amount, numbers: [String(last2)] });
    if (drawResultProps.adjacent?.length > 0) allPrizes.push({ name: "รางวัลข้างเคียงรางวัลที่ 1", amount: drawResultProps.adjacentAmount, numbers: drawResultProps.adjacent });
    prizeTiers.forEach((p) => {
      if (p.numbers && p.numbers.length > 0) {
        allPrizes.push({ name: p.title, amount: p.amount, numbers: p.numbers.map(String) });
      }
    });
  }

  /* ---------- History data for table ---------- */
  const recentResults = historyItems.map((item) => {
    const d = item.data as unknown as GenericPrizeData;
    const rp1Num = getPrizeNumber(d, p1Names, p1Cats, 1) || [d?.first || d?.firstPrize];
    const rFirstPrize = rp1Num && rp1Num.length > 0 && rp1Num[0] !== undefined ? rp1Num[0] : "-";
    const rFront3 = getPrizeNumber(d, pFront3Names, pFront3Cats) || d?.first3?.number || d?.last3f || d?.front3 || [];
    const rBack3 = getPrizeNumber(d, pBack3Names, pBack3Cats, 2) || d?.last3?.number || d?.last3b || d?.back3 || [];
    const rl2Num = getPrizeNumber(d, p2Names, p2Cats, 3) || d?.last2?.number || [d?.last2];
    const rLast2 = Array.isArray(rl2Num) ? rl2Num[0] : rl2Num;
    return {
      date: formatDateDisplay(item.dateDisplay || item.date, language),
      firstPrize: String(rFirstPrize || "-"),
      last3f: String((Array.isArray(rFront3) ? rFront3 : [rFront3])[0] || "-"),
      last3b: String((Array.isArray(rBack3) ? rBack3 : [rBack3])[0] || "-"),
      last2: String(rLast2 || "-"),
    };
  });

  /* ==================== RENDER ==================== */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 1. Header */}
      <DrawPageHeader
        country={country}
        countryCode={countryCode}
        lotteryName={lotteryName}
        logo={logo}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* -------- Main Content (2/3) -------- */}
        <div className="space-y-6 lg:col-span-2">
          {/* 2. Hero — Draw Result */}
          <DrawResult {...drawResultProps} />

          {/* 3. Prize Grids (2nd–5th) */}
          {prizeTiers
            .filter((tier) => tier.numbers.length > 0)
            .map((tier, i) => (
              <PrizeTierSection
                key={i}
                title={tier.title}
                count={tier.count}
                amount={tier.amount}
                currency={currency || t.common.currency}
                numbers={tier.numbers}
                columns={5}
              />
            ))}

          {/* 4. Inline Ticket Verifier */}
          <InteractiveTicketVerifier
            countryCode={countryCode}
            lotterySlug={lotterySlug}
            latestDateDisplay={latest?.dateDisplay || latest?.date || t.common.current}
            historyItems={historyItems}
            prizes={allPrizes}
          />

          {/* 5. Find By Number */}
          <FindByNumber countryCode={countryCode} prizes={allPrizes} />

          {/* 6. Recent Global Draws */}
          <RecentGlobalDraws excludeCountry={countryCode} />

          {/* 7. History Table */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900/80 shadow-sm dark:shadow-none">
            <div className="border-b border-slate-200 dark:border-white/10 px-6 py-4">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {t.results.history}
              </h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-white/5 text-[10px] uppercase text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t.common.date}</th>
                    <th className="px-4 py-3 font-medium">{t.results.prize1}</th>
                    <th className="px-4 py-3 font-medium">{t.results.prize3Front}</th>
                    <th className="px-4 py-3 font-medium">{t.results.prize3Back}</th>
                    <th className="px-4 py-3 font-medium">{t.results.prize2}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {recentResults.map((row, i) => (
                    <tr
                      key={i}
                      className={`group hover:bg-slate-50 dark:hover:bg-white/5 ${i % 2 === 1 ? "bg-slate-50/50 dark:bg-white/[0.02]" : ""}`}
                    >
                      <td className="px-4 py-4 font-mono text-sm tabular-nums text-gray-600 dark:text-gray-400">{row.date}</td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-xl font-bold tracking-[0.3em] text-gray-900 dark:text-white">{row.firstPrize}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-blue-500/20 bg-blue-500/10 dark:bg-blue-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-blue-600 dark:text-blue-300">{row.last3f}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-blue-500/20 bg-blue-500/10 dark:bg-blue-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-blue-600 dark:text-blue-300">{row.last3b}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-gold-500/20 bg-gold-500/10 dark:bg-gold-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-amber-600 dark:text-gold-400">{row.last2}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="divide-y divide-slate-100 dark:divide-white/5 lg:hidden">
              {recentResults.map((row, i) => (
                <div key={i} className={`space-y-3 px-5 py-4 ${i % 2 === 1 ? "bg-slate-50/50 dark:bg-white/[0.02]" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src={getFlagUrl(countryCode)} alt={countryCode} width={24} height={16} className="h-4 w-6 rounded-sm shadow-sm" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{lotteryName}</span>
                    </div>
                    <span className="font-mono text-xs text-gray-500">{row.date}</span>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">{t.results.prize1}</div>
                    <div className="font-mono text-2xl font-bold tracking-[0.3em] text-gray-900 dark:text-white">{row.firstPrize}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">{t.results.prize3Front}</div>
                      <span className="block w-full rounded border border-blue-500/20 bg-blue-500/10 dark:bg-blue-500/20 px-2 py-1 font-mono text-lg font-bold text-blue-600 dark:text-blue-300 text-center">{row.last3f}</span>
                    </div>
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">{t.results.prize3Back}</div>
                      <span className="block w-full rounded border border-blue-500/20 bg-blue-500/10 dark:bg-blue-500/20 px-2 py-1 font-mono text-lg font-bold text-blue-600 dark:text-blue-300 text-center">{row.last3b}</span>
                    </div>
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">{t.results.prize2}</div>
                      <span className="block w-full rounded border border-gold-500/20 bg-gold-500/10 dark:bg-gold-500/20 px-2 py-1 font-mono text-lg font-bold text-amber-600 dark:text-gold-400 text-center">{row.last2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Disclaimer */}
          <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500 dark:text-amber-400" />
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {dd.disclaimer}
              </p>
            </div>
          </section>
        </div>

        {/* -------- Sidebar (1/3) -------- */}
        <aside className="space-y-6">
          {/* Sidebar Ticket Verifier */}
          <InteractiveTicketVerifier
            variant="sidebar"
            countryCode={countryCode}
            lotterySlug={lotterySlug}
            latestDateDisplay={latest?.dateDisplay || latest?.date || t.common.current}
            historyItems={historyItems}
            prizes={allPrizes}
          />

          {/* Previous Draws */}
          <PreviousDrawsSidebar
            countryCode={countryCode}
            lotterySlug={lotterySlug}
            historyItems={historyItems}
          />

          {/* News Sidebar */}
          <NewsSidebar
            accentColor="gold"
            icon={<NewspaperIcon className="h-4 w-4 text-amber-600 dark:text-gold-400" />}
            category={countryCode}
          />
        </aside>
      </div>
    </div>
  );
}
