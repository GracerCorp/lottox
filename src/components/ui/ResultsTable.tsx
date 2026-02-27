"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";
import { useApi } from "@/lib/hooks/useApi";
import type { LatestResultsResponse, LatestResult } from "@/lib/api-types";

interface PrizeItem {
  label: string;
  value: string[];
  prize: string;
  isMain?: boolean;
}

export interface ResultRow {
  date: string;
  flag: string;
  country: string;
  name: string;
  numbers: PrizeItem[];
  id: string;
  href: string;
}

interface ResultsTableProps {
  filter?: string;
}

export function mapApiResultToRow(
  result: LatestResult,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any,
  language: string,
): ResultRow | null {
  const type = result.type?.toUpperCase() || "";
  const drawDate = new Date(result.drawDate || result.date);
  const dateStr = drawDate.toLocaleDateString(
    language === "th" ? "th-TH" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: language === "th" ? undefined : "numeric",
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = result.data as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prizes = (d?.prizes || []) as any[];

  const getPrizeNum = (categoryOrId: string, names: string[]) => {
    const p = prizes.find(
      (x) =>
        x.category === categoryOrId ||
        x.id === categoryOrId ||
        names.includes(x.prizeName),
    );
    if (p) {
      const v = p.winningNumbers || p.number;
      return Array.isArray(v) ? v : [v];
    }
    return null;
  };

  const getPrizeReward = (categoryOrId: string, names: string[]) => {
    const p = prizes.find(
      (x) =>
        x.category === categoryOrId ||
        x.id === categoryOrId ||
        names.includes(x.prizeName),
    );
    return p?.amount || p?.prizeAmount || p?.reward || "";
  };

  let countryId = "th";
  let countryName = t.lottery?.thai?.country || "Thailand";
  let lottoName = t.lottery?.thai?.subName || "Thai Lottery";
  let lottoHref = "/th/thai-lotto";
  let flagCode = "th";
  let currency = "B";
  let defaultP1 = "6,000,000";
  let defaultP2 = "2,000";
  let defaultP3 = "4,000";

  if (type === "LAO" || type.includes("LAO")) {
    countryId = "la";
    countryName = t.lottery?.lao?.country || "Laos";
    lottoName = t.lottery?.lao?.subName || "Lao Lottery";
    lottoHref = "/la/lao-lotto";
    flagCode = "la";
    currency = "Kip";
    defaultP1 = "1,200,000";
    defaultP2 = "4,000"; // fallback example
  } else if (type === "VIETNAM" || type.includes("VIETNAM")) {
    countryId = "vn";
    countryName = t.lottery?.vietnam?.country || "Vietnam";
    lottoName = t.lottery?.vietnam?.subName || "Vietnam Lottery";
    lottoHref = "/vn/vietnam-lotto";
    flagCode = "vn";
    currency = "VND";
    defaultP1 = "500,000";
  }

  const p1Names = ["Prize 1", "รางวัลที่ 1", "Special Prize"];
  const p1 = getPrizeNum("prize_1", p1Names) ||
    getPrizeNum("prizeFirst", p1Names) || [d?.first || d?.firstPrize || "-"];

  // Sometimes prize_1 winningNumbers includes all prizes in a single array format from some scrapers.
  // If p1 has more than 1 item, we just take the first one since it's the 1st prize.
  const actualP1 = Array.isArray(p1) && p1.length > 0 ? [p1[0]] : ["-"];

  const p3fNames = [
    "Prize 3 Front",
    "3 Front",
    "เลขหน้า 3 ตัว",
    "รางวัลเลขหน้า 3 ตัว",
  ];
  const p3f = getPrizeNum("running_number_front_3", p3fNames) ||
    getPrizeNum("prizeLast3Front", p3fNames) ||
    d?.first3?.number ||
    d?.last3f ||
    d?.front3 || ["-"];

  const p3bNames = [
    "Prize 3 Back",
    "3 Back",
    "เลขท้าย 3 ตัว",
    "รางวัลเลขท้าย 3 ตัว",
  ];
  const p3b = getPrizeNum("running_number_back_3", p3bNames) ||
    getPrizeNum("prizeLast3Back", p3bNames) ||
    d?.last3?.number ||
    d?.last3b ||
    d?.back3 || ["-"];

  const p2Names = [
    "Prize 2 Down",
    "Prize 2",
    "2 Bottom",
    "เลขท้าย 2 ตัว",
    "รางวัลเลขท้าย 2 ตัว",
  ];
  const p2 = getPrizeNum("running_number_back_2", p2Names) ||
    getPrizeNum("prizeLast2", p2Names) ||
    d?.last2?.number || [d?.last2 || "-"];

  return {
    id: countryId,
    date: dateStr,
    flag: getFlagUrl(flagCode),
    country: countryName,
    name: lottoName,
    href: lottoHref,
    numbers: [
      {
        label: t.results?.prize1 || "Prize 1",
        value: actualP1.map(String),
        prize: `${getPrizeReward("prize_1", p1Names) || getPrizeReward("prizeFirst", p1Names) || defaultP1} ${currency}`,
        isMain: true,
      },
      {
        label: t.results?.prize3Front || "3 Front",
        value: (Array.isArray(p3f) ? p3f : [p3f]).map(String),
        prize: `${getPrizeReward("running_number_front_3", p3fNames) || getPrizeReward("prizeLast3Front", p3fNames) || defaultP3} ${currency}`,
      },
      {
        label: t.results?.prize3Back || "3 Back",
        value: (Array.isArray(p3b) ? p3b : [p3b]).map(String),
        prize: `${getPrizeReward("running_number_back_3", p3bNames) || getPrizeReward("prizeLast3Back", p3bNames) || defaultP3} ${currency}`,
      },
      {
        label: t.results?.prize2 || "2 Bottom",
        value: (Array.isArray(p2) ? p2 : [p2]).map(String),
        prize: `${getPrizeReward("running_number_back_2", p2Names) || getPrizeReward("prizeLast2", p2Names) || defaultP2} ${currency}`,
      },
    ],
  };
}

export function ResultsTable({ filter = "all" }: ResultsTableProps) {
  const { t, language } = useLanguage();
  const { data, loading, error } = useApi<LatestResultsResponse>(
    "/api/results/latest",
  );

  // Map API data to ResultRow format
  const rawResults: ResultRow[] = [];
  if (data?.results) {
    for (const result of data.results) {
      const row = mapApiResultToRow(result, t, language);
      if (row) {
        rawResults.push(row);
      }
    }
  }

  const results =
    filter === "all" ? rawResults : rawResults.filter((r) => r.id === filter);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-gray-200 dark:bg-navy-900/50 h-16"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-500/5 p-6 text-center text-sm text-red-600 dark:text-red-400">
        {t.common.error}: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {results.map((item) => (
        <SingleLineRow key={item.id} item={item} />
      ))}

      {results.length === 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900/50 p-6 text-center text-sm text-gray-500 dark:text-gray-400 shadow-sm">
          {t.common.error}
        </div>
      )}
    </div>
  );
}

/* -- Single-line row -- */
function SingleLineRow({ item }: { item: ResultRow }) {
  const mainPrize = item.numbers.find((n) => n.isMain);
  const subPrizes = item.numbers.filter((n) => !n.isMain);

  return (
    <Link
      href={item.href}
      className="group relative block overflow-hidden rounded-lg transition-all duration-200 hover:scale-[1.003]"
    >
      {/* Subtle border */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-blue-500/20 opacity-40 transition-opacity duration-200 group-hover:opacity-70" />

      {/* Row content */}
      <div className="relative flex items-center gap-4 rounded-lg border border-gray-100 dark:border-transparent bg-white dark:bg-navy-900/85 px-4 py-3 backdrop-blur-sm sm:gap-6 sm:px-5 shadow-sm">
        {/* Flag + name */}
        <div className="flex items-center gap-2.5 sm:min-w-[180px]">
          <div className="relative h-5 w-7 shrink-0 overflow-hidden rounded shadow">
            <Image
              src={item.flag}
              alt={`${item.country} flag`}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="text-md font-semibold leading-tight text-gray-900 dark:text-white">
              {item.name}
            </span>
            <span className="ml-2 hidden text-[14px] text-gray-500 sm:inline">
              {item.date}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px shrink-0 bg-gray-200 dark:bg-white/10" />

        {/* Main prize */}
        {mainPrize && (
          <div className="flex items-center gap-2">
            <span className="hidden text-[14px] font-medium uppercase tracking-wide text-gray-500 sm:inline">
              {mainPrize.label}
            </span>
            {mainPrize.value.map((v, i) => (
              <span
                key={i}
                className="bg-gradient-to-b from-amber-500 to-amber-700 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-xl font-black tracking-[0.1em] text-transparent sm:text-2xl"
              >
                {v}
              </span>
            ))}
            <span className="text-[14px] font-semibold text-emerald-600 dark:text-emerald-400 sm:text-xs">
              {mainPrize.prize}
            </span>
          </div>
        )}

        {/* Divider */}
        {subPrizes.length > 0 && (
          <div className="hidden h-6 w-px shrink-0 bg-gray-200 dark:bg-white/10 md:block" />
        )}

        {/* Sub prizes inline */}
        {subPrizes.length > 0 && (
          <div className="hidden items-center gap-4 md:flex">
            {subPrizes.map((prize, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-[14px] text-gray-500">{prize.label}</span>
                {prize.value.map((val, vi) => (
                  <span
                    key={vi}
                    className="text-md font-bold tracking-wide text-gray-700 dark:text-white/80"
                  >
                    {val}
                  </span>
                ))}
                <span className="text-[14px] text-emerald-600 dark:text-emerald-400/70">
                  {prize.prize}
                </span>
                <div className="hidden h-6 w-px shrink-0 bg-gray-200 dark:bg-white/10 md:block" />
              </div>
            ))}
          </div>
        )}

        {/* Arrow indicator */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-auto h-4 w-4 shrink-0 text-gray-600 transition-colors group-hover:text-blue-400"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}
