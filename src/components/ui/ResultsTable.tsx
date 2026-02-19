"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";
import { useApi } from "@/lib/hooks/useApi";
import type {
  LatestResultsResponse,
  LatestResult,
  ThaiResultData,
  LaoResultData,
  VietnamResultData,
} from "@/lib/api-types";

interface PrizeItem {
  label: string;
  value: string[];
  prize: string;
  isMain?: boolean;
}

interface ResultRow {
  date: string;
  flag: string;
  country: string;
  name: string;
  numbers: PrizeItem[];
  id: "th" | "la" | "vn";
  href: string;
}

interface ResultsTableProps {
  filter?: "all" | "th" | "la" | "vn";
}

function isThaiData(data: any): data is ThaiResultData {
  return data && "firstPrize" in data;
}

function isLaoData(data: any): data is LaoResultData {
  return data && "digit4" in data && "digit4Multiplier" in data;
}

function isVietnamData(data: any): data is VietnamResultData {
  return data && "digit4" in data && "digit2Bottom" in data;
}

function mapApiResultToRow(
  result: LatestResult,
  t: any,
  language: string,
): ResultRow | null {
  const type = result.type?.toUpperCase();
  const drawDate = new Date(result.drawDate || result.date);
  const dateStr = drawDate.toLocaleDateString(
    language === "th" ? "th-TH" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: language === "th" ? undefined : "numeric",
    },
  );

  if (type === "THAI" && isThaiData(result.data)) {
    const d = result.data;
    return {
      id: "th",
      date: dateStr,
      flag: getFlagUrl("th"),
      country: t.lottery.thai.country,
      name: t.lottery.thai.subName,
      href: "/results/thai-lotto",
      numbers: [
        {
          label: t.results.prize1,
          value: [d.firstPrize],
          prize: `${d.firstPrizeAmount || "6,000,000"} B`,
          isMain: true,
        },
        {
          label: t.results.prize3Front,
          value: d.front3 || [],
          prize: `${d.front3Amount || "4,000"} B`,
        },
        {
          label: t.results.prize3Back,
          value: d.back3 || [],
          prize: `${d.back3Amount || "4,000"} B`,
        },
        {
          label: t.results.prize2,
          value: [d.last2 || ""],
          prize: `${d.last2Amount || "2,000"} B`,
        },
      ],
    };
  }

  if ((type === "LAO" || type === "LAOS") && isLaoData(result.data)) {
    const d = result.data;
    return {
      id: "la",
      date: dateStr,
      flag: getFlagUrl("la"),
      country: t.lottery.lao.country,
      name: t.lottery.lao.subName,
      href: "/results/lao-lotto",
      numbers: [
        {
          label: t.results.digit4,
          value: [d.digit4],
          prize: d.digit4Multiplier || "x6,000",
          isMain: true,
        },
        {
          label: t.results.digit3,
          value: [d.digit3],
          prize: d.digit3Multiplier || "x500",
        },
        {
          label: t.results.digit2,
          value: [d.digit2],
          prize: d.digit2Multiplier || "x60",
        },
      ],
    };
  }

  // Vietnam types: VIETNAM_SPECIFIC, VIETNAM_SPECIAL, VIETNAM_NORMAL, VIETNAM_VIP
  if (type?.startsWith("VIETNAM") && isVietnamData(result.data)) {
    const d = result.data;
    // Get the subtype label
    const subtypeMap: Record<string, string> = {
      VIETNAM_SPECIFIC: t.lottery?.vietnam?.specific?.name || "Hanoi Specific",
      VIETNAM_SPECIAL: t.lottery?.vietnam?.special?.name || "Hanoi Special",
      VIETNAM_NORMAL: t.lottery?.vietnam?.normal?.name || "Hanoi Normal",
      VIETNAM_VIP: t.lottery?.vietnam?.vip?.name || "Hanoi VIP",
    };
    const subtypePath: Record<string, string> = {
      VIETNAM_SPECIFIC: "specific",
      VIETNAM_SPECIAL: "special",
      VIETNAM_NORMAL: "normal",
      VIETNAM_VIP: "vip",
    };
    return {
      id: "vn",
      date: dateStr,
      flag: getFlagUrl("vn"),
      country: t.lottery?.vietnam?.country || "Vietnam",
      name: subtypeMap[type] || t.lottery?.vietnam?.country || "Vietnam",
      href: `/results/vietnam-lotto/${subtypePath[type] || "specific"}`,
      numbers: [
        {
          label: t.results?.digit4 || "4 Digits",
          value: [d.digit4],
          prize: "x850",
          isMain: true,
        },
        {
          label: t.results?.digit3 || "3 Digits",
          value: [d.digit3],
          prize: "x120",
        },
        {
          label: t.results?.digit2 || "2 Digits",
          value: [d.digit2],
          prize: "x92",
        },
      ],
    };
  }

  // Also handle type "VIETNAM" without subtype
  if (
    type === "VIETNAM" &&
    (isVietnamData(result.data) || isLaoData(result.data))
  ) {
    const d = result.data as any;
    return {
      id: "vn",
      date: dateStr,
      flag: getFlagUrl("vn"),
      country: t.lottery?.vietnam?.country || "Vietnam",
      name: t.lottery?.vietnam?.specific?.name || "Vietnam Lottery",
      href: "/results/vietnam-lotto/specific",
      numbers: [
        {
          label: t.results?.digit4 || "4 Digits",
          value: [d.digit4],
          prize: d.digit4Multiplier || "x850",
          isMain: true,
        },
        {
          label: t.results?.digit3 || "3 Digits",
          value: [d.digit3],
          prize: d.digit3Multiplier || "x120",
        },
        {
          label: t.results?.digit2 || "2 Digits",
          value: [d.digit2],
          prize: d.digit2Multiplier || "x92",
        },
      ],
    };
  }

  // Unknown type - skip
  return null;
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
            className="animate-pulse rounded-lg bg-navy-900/50 h-16"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-400">
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
        <div className="rounded-lg border border-white/10 bg-navy-900/50 p-6 text-center text-sm text-gray-500">
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
      <div className="relative flex items-center gap-4 rounded-lg bg-navy-900/85 px-4 py-3 backdrop-blur-sm sm:gap-6 sm:px-5">
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
            <span className="text-md font-semibold leading-tight text-white">
              {item.name}
            </span>
            <span className="ml-2 hidden text-[14px] text-gray-500 sm:inline">
              {item.date}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px shrink-0 bg-white/10" />

        {/* Main prize */}
        {mainPrize && (
          <div className="flex items-center gap-2">
            <span className="hidden text-[14px] font-medium uppercase tracking-wide text-gray-500 sm:inline">
              {mainPrize.label}
            </span>
            {mainPrize.value.map((v, i) => (
              <span
                key={i}
                className="bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-xl font-black tracking-[0.1em] text-transparent sm:text-2xl"
              >
                {v}
              </span>
            ))}
            <span className="text-[14px] font-semibold text-emerald-400 sm:text-xs">
              {mainPrize.prize}
            </span>
          </div>
        )}

        {/* Divider */}
        {subPrizes.length > 0 && (
          <div className="hidden h-6 w-px shrink-0 bg-white/10 md:block" />
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
                    className="text-md font-bold tracking-wide text-white/80"
                  >
                    {val}
                  </span>
                ))}
                <span className="text-[14px] text-emerald-400/70">
                  {prize.prize}
                </span>
                <div className="hidden h-6 w-px shrink-0 bg-white/10 md:block" />
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
