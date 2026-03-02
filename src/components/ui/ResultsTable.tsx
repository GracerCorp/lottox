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

  // Slugify lottery name to produce URL-safe path
  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Derive country metadata from countryCode (from API) or fallback from type
  const cc =
    result.countryCode ||
    (type.includes("LAO") ? "la" : type.includes("VIETNAM") ? "vn" : "th");
  const lotterySlug = result.lotteryName ? slugify(result.lotteryName) : "";

  const countryId = cc;
  let countryName = t.lottery?.thai?.country || "Thailand";
  let lottoName =
    result.lotteryName || t.lottery?.thai?.subName || "Thai Lottery";
  const lottoHref = `/${cc}/${lotterySlug}`;
  const flagCode = cc;
  let currency = "B";
  let defaultP1 = "6,000,000";

  if (cc === "la") {
    countryName = t.lottery?.lao?.country || "Laos";
    lottoName = result.lotteryName || t.lottery?.lao?.subName || "Lao Lottery";
    currency = "Kip";
    defaultP1 = "1,200,000";
  } else if (cc === "vn") {
    countryName = t.lottery?.vietnam?.country || "Vietnam";
    lottoName =
      result.lotteryName || t.lottery?.vietnam?.subName || "Vietnam Lottery";
    currency = "VND";
    defaultP1 = "500,000";
  }

  let numbers: PrizeItem[] = [];

  if (prizes && prizes.length > 0) {
    // Sort by order to ensure we get the main prizes first
    const sortedPrizes = [...prizes].sort((a, b) => {
      // Prioritize First Prize / Special Prize implicitly if order is missing but we know standard order
      const orderA =
        a.order !== undefined && a.order !== null ? Number(a.order) : 99;
      const orderB =
        b.order !== undefined && b.order !== null ? Number(b.order) : 99;
      return orderA - orderB;
    });

    // Filter by showingPrizes if available
    let displayPrizes = sortedPrizes.filter(
      (p) => p.winningNumbers && p.winningNumbers.length > 0,
    );

    if (result.showingPrizes && result.showingPrizes.length > 0) {
      displayPrizes = displayPrizes.filter(
        (p) =>
          result.showingPrizes!.includes(p.prizeName) ||
          result.showingPrizes!.includes(p.category),
      );
    } else {
      // Fallback: show up to 4 significant prizes
      displayPrizes = displayPrizes.slice(0, 4);
    }

    // If somehow empty after filtering, just take the first 4
    const finalDisplayPrizes =
      displayPrizes.length > 0 ? displayPrizes : sortedPrizes.slice(0, 4);

    numbers = finalDisplayPrizes.map((p, idx) => {
      const vals = p.winningNumbers || p.number || [];
      let finalVals = Array.isArray(vals) ? vals : [vals];

      if (idx === 0 && finalVals.length > 0) {
        // Just take the first array item for the main highlighted prize to prevent overflow
        finalVals = [finalVals[0]];
      } else if (finalVals.length === 0) {
        finalVals = ["-"];
      }

      let formattedPrize = p.prizeAmount
        ? `${Number(p.prizeAmount).toLocaleString()} ${currency}`
        : `- ${currency}`;

      if (type.includes("LAO")) {
        formattedPrize = p.prizeAmount
          ? `1 Kip x ${Number(p.prizeAmount).toLocaleString()}`
          : formattedPrize;
      }

      const getCategoryLabel = (
        cat: string | undefined,
        defaultName: string | undefined,
      ): string => {
        if (!cat) return defaultName || t.results?.prize1 || `Prize ${idx + 1}`;
        // Map category properly if translation exists
        const key = cat as keyof typeof t.results;
        return (
          t.results?.[key] ||
          defaultName ||
          t.results?.prize1 ||
          `Prize ${idx + 1}`
        );
      };

      return {
        label: getCategoryLabel(p.category, p.prizeName),
        value: finalVals.map(String),
        prize: formattedPrize,
        isMain: idx === 0,
      };
    });
  }

  // Fallback if numbers is empty
  if (numbers.length === 0) {
    let formattedDefaultP1 = `${defaultP1} ${currency}`;
    if (type.includes("LAO")) {
      formattedDefaultP1 = `1 Kip x ${defaultP1}`;
    }
    numbers = [
      {
        label: t.results?.prize1 || "Prize 1",
        value: ["-"],
        prize: formattedDefaultP1,
        isMain: true,
      },
    ];
  }

  // Use the draw date directly for the href path
  const parsedDrawDate = new Date(result.drawDate || result.date);
  const pathDate = parsedDrawDate.toISOString().split("T")[0];
  const finalHref = `${lottoHref}/${pathDate}`;

  return {
    id: countryId,
    date: dateStr,
    flag: getFlagUrl(flagCode),
    country: countryName,
    name: lottoName,
    href: finalHref,
    numbers,
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
      className="group relative block overflow-hidden rounded-lg transition-all duration-200 hover:scale-[1.003] hover:shadow-md dark:hover:shadow-none"
    >
      {/* Subtle border */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-blue-500/20 opacity-20 dark:opacity-40 transition-opacity duration-200 group-hover:opacity-50 dark:group-hover:opacity-70" />

      {/* Row content */}
      <div className="relative flex items-center gap-4 rounded-lg border border-gray-200/50 dark:border-transparent bg-white/90 dark:bg-navy-900/85 px-4 py-3 backdrop-blur-sm sm:gap-6 sm:px-5 shadow-sm dark:shadow-none">
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
