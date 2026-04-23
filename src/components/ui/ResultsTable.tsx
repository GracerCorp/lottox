"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";
import { useApi } from "@/lib/hooks/useApi";
import { slugify, formatDateShort } from "@/lib/utils/lotteryUtils";
import type { LatestResultsResponse, LatestResult } from "@/lib/api-types";
import type { GenericPrizeData, GenericPrizeItem } from "@/lib/utils/lotteryUtils";

interface PrizeItem {
  label: string;
  value: string[];
  prize: string;
  isMain?: boolean;
}

export interface ResultRow {
  date: string;
  time: string;
  flag: string;
  logo?: string | null;
  country: string;
  countryId: string;
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
  const drawDate = result.drawDate || result.date;
  const dateStr = formatDateShort(drawDate, language);

  // Extract time from drawDate if available
  let timeStr = "";
  try {
    const dt = new Date(drawDate);
    if (!isNaN(dt.getTime())) {
      const hours = dt.getUTCHours().toString().padStart(2, "0");
      const mins = dt.getUTCMinutes().toString().padStart(2, "0");
      timeStr = `${hours}:${mins}`;
    }
  } catch { /* ignore */ }

  const d = result.data as unknown as GenericPrizeData;
  const prizes = (d?.prizes || []) as GenericPrizeItem[];

  // Derive country metadata from countryCode (from API) or fallback from type
  const cc =
    result.countryCode ||
    (type.includes("LAO") ? "la" : type.includes("VIETNAM") ? "vn" : "th");
  const lotterySlug = result.lotteryName ? slugify(result.lotteryName) : "";

  const countryId = cc;
  let countryName = t.lottery?.thai?.country || "Thailand";
  let lottoName = result.lotteryName || t.lottery?.thai?.subName || "Thai Lottery";
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
    lottoName = result.lotteryName || t.lottery?.vietnam?.subName || "Vietnam Lottery";
    currency = "VND";
    defaultP1 = "500,000";
  } else if (cc !== "th") {
    const lotData = t.lottery?.[cc];
    if (lotData) {
      countryName = lotData.country || t.countryList?.countries?.[cc] || cc.toUpperCase();
    } else {
      countryName = t.countryList?.countries?.[cc] || cc.toUpperCase();
    }
    lottoName = result.lotteryName || lotData?.name || `${cc.toUpperCase()} Lottery`;
    currency = ""; // Depending on country
    defaultP1 = "-";
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
      (p) => {
        const vals = p.winningNumbers || p.number || [];
        const finalVals = Array.isArray(vals) ? vals : [vals];
        const validVals = finalVals.filter(v => v !== undefined && v !== null && v !== "" && String(v).trim() !== "" && v !== "-");
        return validVals.length > 0;
      }
    );

    if (result.showingPrizes && result.showingPrizes.length > 0) {
      displayPrizes = displayPrizes.filter(
        (p) =>
          result.showingPrizes!.includes(p.prizeName || "") ||
          result.showingPrizes!.includes(p.category || ""),
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

      if (cc === "la") {
        formattedPrize = p.prizeAmount
          ? (idx === 0 ? `${Number(p.prizeAmount).toLocaleString()}x Payout` : `${Number(p.prizeAmount).toLocaleString()}x`)
          : formattedPrize;
      }

      const getCategoryLabel = (
        cat: string | undefined,
        defaultName: string | undefined,
      ): string => {
        if (!cat) return defaultName || t.results?.prize1 || `Prize ${idx + 1}`;
        // Map category properly if translation exists
        const key = cat as keyof typeof t.results;
        if (t.results?.[key]) return t.results[key];
        if (defaultName) return defaultName;
        
        // Formats raw categories (e.g. "main_numbers" -> "Main Numbers", "powerball" -> "Powerball")
        return cat.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      };

      return {
        label: getCategoryLabel(p.category, p.prizeName),
        value: finalVals.map(String),
        prize: formattedPrize,
        isMain: idx === 0,
      };
    });
  }

  // Fallback if numbers is empty (Handle flat mapping for Thai, Lao, VN)
  if (numbers.length === 0 && d) {
      // Determine if flat format exists
    if (d?.firstPrize || d?.first || d?.first3 || d?.last2 || d?.digit4 || d?.firstPrizeAmount || d?.mainNumbers || d?.main_numbers) {
      const mainNumsRaw = d?.mainNumbers || d?.main_numbers;
      const rp1Num = [d?.first || d?.firstPrize || d?.digit4 || d?.digit3 || mainNumsRaw].flat().filter(Boolean);
      const rFirstPrize = rp1Num.length > 0 ? rp1Num : ["-"];
      const rFirstPrizeAmount = d?.firstPrizeAmount || d?.firstAmount || d?.digit4Multiplier || d?.digit3Multiplier || defaultP1;
      
      let formattedFirstPrize = `${rFirstPrizeAmount} ${currency}`;
      let firstPrizeLabel = t.results?.prize1 || "Prize 1";

      if (cc === "la") {
        formattedFirstPrize = `${rFirstPrizeAmount}x Payout`;
        firstPrizeLabel = `Match 4 (${rFirstPrizeAmount}x Bet)`;
      } else if (mainNumsRaw) {
        firstPrizeLabel = t.common?.winningNumbers || "Winning Numbers";
      }

      numbers.push({
        label: firstPrizeLabel,
        value: rFirstPrize,
        prize: formattedFirstPrize,
        isMain: true,
      });

      if (d?.powerball) {
        numbers.push({
          label: "Powerball",
          value: [d.powerball].flat().filter(Boolean).map(String),
          prize: "-",
          isMain: false,
        });
      } else if (d?.supplementary) {
        numbers.push({
          label: "Supplementary",
          value: [d.supplementary].flat().filter(Boolean).map(String),
          prize: "-",
          isMain: false,
        });
      }

      // Front 3
      const rf3 = d?.first3?.number || d?.last3f || d?.front3 || [];
      const rFront3 = (Array.isArray(rf3) ? rf3 : [rf3]).filter(Boolean);
      if (rFront3.length > 0) {
        numbers.push({
          label: t.results?.prize3Front || "3 Front",
          value: rFront3.map(String),
          prize: `${d?.front3Amount || d?.first3?.amount || "4,000"} ${currency}`,
          isMain: false,
        });
      }

      // Back 3
      const rb3 = d?.last3?.number || d?.last3b || d?.back3 || [];
      const rBack3 = (Array.isArray(rb3) ? rb3 : [rb3]).filter(Boolean);
      if (rBack3.length > 0) {
        numbers.push({
          label: t.results?.prize3Back || "3 Back",
          value: rBack3.map(String),
          prize: `${d?.back3Amount || d?.last3?.amount || "4,000"} ${currency}`,
          isMain: false,
        });
      }

      // Last 2
      const rl2Num = d?.last2?.number || d?.last2;
      const rLast2 = (Array.isArray(rl2Num) ? rl2Num : [rl2Num]).filter(Boolean);
      if (rLast2.length > 0 && rLast2[0] !== undefined) {
        numbers.push({
          label: t.results?.prize2 || "2 Bottom",
          value: rLast2.map(String),
          prize: `${d?.last2Amount || d?.last2?.amount || "2,000"} ${currency}`,
          isMain: false,
        });
      }

      // Fill remaining to up to 4 items from other properties if available, e.g. digit3 for Lao
      if (numbers.length < 4 && d?.digit3 && !d?.digit4) { 
        // if digit4 wasn't matched above, we don't duplicate it. Here handled naturally. 
      }
      if (numbers.length < 4 && cc === "la" && d?.digit3) {
        const mult = d?.digit3Multiplier || "500";
        numbers.push({
          label: `Match 3 (${mult}x Bet)`,
          value: [String(d.digit3)],
          prize: `${mult}x`,
          isMain: false,
        });
      }
      if (numbers.length < 4 && cc === "la" && d?.digit2) {
        const mult = d?.digit2Multiplier || "60";
        numbers.push({
          label: `Match 2 (${mult}x Bet)`,
          value: [String(d.digit2)],
          prize: `${mult}x`,
          isMain: false,
        });
      }
    }
    
    // Absolute fallback
    if (numbers.length === 0) {
      let formattedDefaultP1 = `${defaultP1} ${currency}`;
      let defaultLabel = t.results?.prize1 || "Prize 1";
      if (cc === "la") {
        formattedDefaultP1 = `${defaultP1}x Payout`;
        defaultLabel = `Match 4 (${defaultP1}x Bet)`;
      }
      numbers = [
        {
          label: defaultLabel,
          value: ["-"],
          prize: formattedDefaultP1,
          isMain: true,
        },
      ];
    }
  }

  // Use the draw date directly for the href path
  const parsedDrawDate = new Date(result.drawDate || result.date);
  const pathDate = parsedDrawDate.toISOString().split("T")[0];
  const finalHref = `${lottoHref}/${pathDate}`;

  // Check if there are any actual values. If all are "-" or empty, filter this result out.
  const hasValues = numbers.some((n) =>
    n.value.some((v) => v !== "-" && v.trim() !== "")
  );

  if (!hasValues) {
    return null;
  }

  return {
    id: `${countryId}-${result.id}`,
    countryId: countryId,
    date: dateStr,
    time: timeStr,
    flag: getFlagUrl(flagCode),
    logo: result.logo || null,
    country: countryName,
    name: lottoName,
    href: finalHref,
    numbers,
  };
}

export function ResultsTable({ filter = "all" }: ResultsTableProps) {
  const { t, language } = useLanguage();
  const continentMappings: Record<string, string[]> = {
    'southeast-asia': ['th', 'la', 'vn', 'sg', 'my', 'id', 'ph', 'kh', 'mm', 'bn', 'tl'],
    'asia': ['jp', 'tw', 'hk', 'kr', 'th', 'la', 'vn', 'sg', 'my', 'id', 'ph', 'in', 'cn', 'kh', 'mm', 'bn', 'tl'],
    'europe': ['gb', 'fr', 'de', 'it', 'es', 'pt', 'ru', 'nl', 'se', 'pl', 'uk', 'ie', 'ch', 'no', 'dk', 'fi'],
    'america': ['us', 'ca', 'br', 'ar', 'mx', 'cl', 'co', 'pe'],
    'oceania': ['au', 'nz', 'fj'],
  };

  let url = "/api/results/latest";
  if (filter !== "all") {
    if (continentMappings[filter]) {
      url = `/api/results/latest?countries=${continentMappings[filter].join(",")}`;
    } else {
      url = `/api/results/latest?countries=${filter}`;
    }
  }

  const { data, loading, error } = useApi<LatestResultsResponse>(url);

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

  const results = rawResults;

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-900/60 border border-gray-200 dark:border-white/5 h-16"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-400">
        {t.common.error}: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {results.map((item) => (
        <SingleLineRow key={item.href} item={item} />
      ))}

      {results.length === 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-neutral-900/50 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {t.common.error}
        </div>
      )}
    </div>
  );
}

/* -- Single-line row -- */
export function SingleLineRow({ item }: { item: ResultRow }) {
  return (
    <Link
      href={item.href}
      className="group block rounded-xl transition-all duration-200"
    >
      <div className="flex items-center gap-3 md:gap-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white/60 dark:bg-neutral-900/60 px-4 md:px-5 py-3 transition-all duration-200 hover:border-gold-400/60 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
        {/* Colored dot indicator */}
        <div className="shrink-0 hidden md:block">
          <div className="w-2 h-2 rounded-full bg-gold-400" />
        </div>

        {/* Left — Flag + Name + Time/Date */}
        <div className="flex items-center gap-2.5 min-w-[120px] md:min-w-[180px] shrink-0">
          <div className="relative h-5 w-7 shrink-0 overflow-hidden rounded shadow">
            <Image
              src={item.flag}
              alt={`${item.country} flag`}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate">
              {item.name}
            </span>
            <span className="block text-fs-badge text-gray-500 leading-tight">
              {item.time && <>{item.time} | </>}{item.date}
            </span>
          </div>
        </div>

        {/* Middle — Prize categories (label above, value below, inline) */}
        <div className="flex-1 flex items-center gap-4 md:gap-6 overflow-x-auto hide-scrollbar">
          {item.numbers.map((prize, idx) => (
            <div key={idx} className="shrink-0">
              <span className="block text-fs-badge font-medium text-gray-500 uppercase tracking-wide leading-tight whitespace-nowrap">
                {prize.label}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                {prize.value.map((v, vi) => (
                  <span
                    key={vi}
                    className={
                      prize.isMain
                        ? "text-sm md:text-base font-black tracking-wider text-gold-600 dark:text-gold-400"
                        : "text-sm md:text-base font-bold tracking-wide text-red-500 dark:text-red-400"
                    }
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right — Chevron */}
        <div className="shrink-0 ml-auto pl-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-gray-600 transition-colors group-hover:text-gold-400"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
