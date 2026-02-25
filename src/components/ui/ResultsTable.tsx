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
  filter?: string;
}

function isThaiData(
  data: unknown,
): data is ThaiResultData & { first?: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    ("firstPrize" in data || "first" in data)
  );
}

function isLaoData(data: unknown): data is LaoResultData {
  return (
    typeof data === "object" &&
    data !== null &&
    "digit4" in data &&
    "digit3" in data &&
    !("digit2Bottom" in data)
  );
}

function isVietnamData(data: unknown): data is VietnamResultData {
  return (
    typeof data === "object" &&
    data !== null &&
    "digit4" in data &&
    "digit2Bottom" in data
  );
}

// New DB schemas:
function isNewThaiData(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "prizes" in data &&
    Array.isArray((data as Record<string, unknown>).prizes)
  );
}

function isNewLaoData(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "prizeResult" in data &&
    typeof (data as Record<string, unknown>).prizeResult === "object"
  );
}

function isNewVietnamData(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "provinces" in data &&
    Array.isArray((data as Record<string, unknown>).provinces)
  );
}

function mapApiResultToRow(
  result: LatestResult,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  if ((type === "THAI" || !type) && isNewThaiData(result.data)) {
    const d = result.data as unknown as Record<string, unknown>;
    const prizes = d.prizes as Array<Record<string, unknown>>;

    const getPrize = (id: string) => prizes.find((p) => p.id === id);
    const p1 = getPrize("prizeFirst");
    const p3f = getPrize("prizeLast3Front");
    const p3b = getPrize("prizeLast3Back");
    const p2 = getPrize("prizeLast2");

    return {
      id: "th",
      date: dateStr,
      flag: getFlagUrl("th"),
      country: t.lottery.thai.country,
      name: t.lottery.thai.subName,
      href: "/th/thai-lotto",
      numbers: [
        {
          label: t.results.prize1,
          value: Array.isArray(p1?.number) ? (p1.number as string[]) : ["-"],
          prize: `${p1?.reward || "6,000,000"} B`,
          isMain: true,
        },
        {
          label: t.results.prize3Front,
          value: Array.isArray(p3f?.number) ? (p3f.number as string[]) : ["-"],
          prize: `${p3f?.reward || "4,000"} B`,
        },
        {
          label: t.results.prize3Back,
          value: Array.isArray(p3b?.number) ? (p3b.number as string[]) : ["-"],
          prize: `${p3b?.reward || "4,000"} B`,
        },
        {
          label: t.results.prize2,
          value: Array.isArray(p2?.number) ? (p2.number as string[]) : ["-"],
          prize: `${p2?.reward || "2,000"} B`,
        },
      ],
    };
  }

  if ((type === "THAI" || !type) && isThaiData(result.data)) {
    const d = result.data as unknown as Record<string, unknown>;
    return {
      id: "th",
      date: dateStr,
      flag: getFlagUrl("th"),
      country: t.lottery.thai.country,
      name: t.lottery.thai.subName,
      href: "/th/thai-lotto",
      numbers: [
        {
          label: t.results.prize1,
          value: [(d.first as string) || (d.firstPrize as string) || "-"],
          prize: `${(d.firstPrizeAmount as string) || "6,000,000"} B`,
          isMain: true,
        },
        {
          label: t.results.prize3Front,
          value: ((d.last3f as string[]) || (d.front3 as string[]) || []).map(
            String,
          ),
          prize: `${(d.front3Amount as string) || "4,000"} B`,
        },
        {
          label: t.results.prize3Back,
          value: ((d.last3b as string[]) || (d.back3 as string[]) || []).map(
            String,
          ),
          prize: `${(d.back3Amount as string) || "4,000"} B`,
        },
        {
          label: t.results.prize2,
          value: [(d.last2 as string) || "-"],
          prize: `${(d.last2Amount as string) || "2,000"} B`,
        },
      ],
    };
  }

  if (
    (type === "LAO" || type === "LAOS" || !type) &&
    isNewLaoData(result.data)
  ) {
    const d = result.data as unknown as Record<string, unknown>;
    const pr = d.prizeResult as Record<string, unknown>;
    // Sometimes it's early and no results yet
    const val4 = (pr.last4Prize as string) || "-";
    const val3 = (pr.last3Prize1 as string) || "-";
    const val2 = (pr.last3Prize2 as string) || "-";

    return {
      id: "la",
      date: dateStr,
      flag: getFlagUrl("la"),
      country: t.lottery.lao.country,
      name: t.lottery.lao.subName,
      href: "/la/lao-lotto",
      numbers: [
        {
          label: t.results.digit4,
          value: [val4],
          prize: "x6,000",
          isMain: true,
        },
        {
          label: t.results.digit3,
          value: [val3],
          prize: "x500",
        },
        {
          label: t.results.digit2,
          value: [val2],
          prize: "x60",
        },
      ],
    };
  }

  if ((type === "LAO" || type === "LAOS" || !type) && isLaoData(result.data)) {
    const d = result.data;
    return {
      id: "la",
      date: dateStr,
      flag: getFlagUrl("la"),
      country: t.lottery.lao.country,
      name: t.lottery.lao.subName,
      href: "/la/lao-lotto",
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
      href: `/vn/${subtypePath[type] ? `hanoi-${subtypePath[type]}` : "hanoi-specific"}`,
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

  if ((!type || type === "VIETNAM") && isNewVietnamData(result.data)) {
    const d = result.data as unknown as Record<string, unknown>;
    const provinces = d.provinces as Array<Record<string, unknown>>;
    const firstProv = provinces[0];
    const prizes = (firstProv?.prizes as Array<Record<string, unknown>>) || [];

    const getPrize = (tierStr: string) => {
      const pr = prizes.find(
        (p) => p.tier === tierStr || p.tierLabel === tierStr,
      );
      if (pr && Array.isArray(pr.numbers)) return pr.numbers as string[];
      return ["-"];
    };

    return {
      id: "vn",
      date: dateStr,
      flag: getFlagUrl("vn"),
      country: t.lottery?.vietnam?.country || "Vietnam",
      name: t.lottery?.vietnam?.country || "Vietnam Lottery",
      href: "/vn/hanoi-specific",
      numbers: [
        {
          label: "Đặc Biệt",
          value: getPrize("special"),
          prize: "x850",
          isMain: true,
        },
        {
          label: "Giải 1",
          value: getPrize("prize_1"),
          prize: "x120",
        },
        {
          label: "Giải 2",
          value: getPrize("prize_2"),
          prize: "x92",
        },
      ],
    };
  }

  // Also handle type "VIETNAM" without subtype
  if (
    (type === "VIETNAM" || !type) &&
    (isVietnamData(result.data) || isLaoData(result.data))
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = result.data as any;
    return {
      id: "vn",
      date: dateStr,
      flag: getFlagUrl("vn"),
      country: t.lottery?.vietnam?.country || "Vietnam",
      name: t.lottery?.vietnam?.specific?.name || "Vietnam Lottery",
      href: "/vn/hanoi-specific",
      numbers: [
        {
          label: t.results?.digit4 || "4 Digits",
          value: [d.digit4 || "-"],
          prize: d.digit4Multiplier || "x850",
          isMain: true,
        },
        {
          label: t.results?.digit3 || "3 Digits",
          value: [d.digit3 || "-"],
          prize: d.digit3Multiplier || "x120",
        },
        {
          label: t.results?.digit2 || "2 Digits",
          value: [d.digit2 || "-"],
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
