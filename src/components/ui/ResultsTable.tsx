"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";

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
  id: "th" | "la";
  href: string;
}

interface ResultsTableProps {
  filter?: "all" | "th" | "la";
}

export function ResultsTable({ filter = "all" }: ResultsTableProps) {
  const { t, language } = useLanguage();

  const rawResults: ResultRow[] = [
    {
      id: "th",
      date: language === "th" ? "16 ก.พ. 2569" : "16 Feb 2026",
      flag: getFlagUrl("th"),
      country: t.lottery.thai.country,
      name: t.lottery.thai.subName,
      href: "/results/thai-lotto",
      numbers: [
        {
          label: t.results.prize1,
          value: ["987654"],
          prize: "6,000,000 ฿",
          isMain: true,
        },
        {
          label: t.results.prize3Front,
          value: ["123", "456"],
          prize: "4,000 ฿",
        },
        {
          label: t.results.prize3Back,
          value: ["789", "012"],
          prize: "4,000 ฿",
        },
        { label: t.results.prize2, value: ["99"], prize: "2,000 ฿" },
      ],
    },
    {
      id: "la",
      date: language === "th" ? "13 ก.พ. 2569" : "13 Feb 2026",
      country: t.lottery.lao.country,
      name: t.lottery.lao.subName,
      flag: getFlagUrl("la"),
      href: "/results/lao-lotto",
      numbers: [
        {
          label: t.results.digit4,
          value: ["4045"],
          prize: "x6,000",
          isMain: true,
        },
        { label: t.results.digit3, value: ["045"], prize: "x500" },
        { label: t.results.digit2, value: ["45"], prize: "x60" },
      ],
    },
  ];

  const results =
    filter === "all" ? rawResults : rawResults.filter((r) => r.id === filter);

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
            <span className="text-sm font-semibold leading-tight text-white">
              {item.name}
            </span>
            <span className="ml-2 hidden text-[11px] text-gray-500 sm:inline">
              {item.date}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px shrink-0 bg-white/10" />

        {/* Main prize */}
        {mainPrize && (
          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:inline">
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
            <span className="text-[10px] font-semibold text-emerald-400 sm:text-xs">
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
                <span className="text-[10px] text-gray-500">{prize.label}</span>
                {prize.value.map((val, vi) => (
                  <span
                    key={vi}
                    className="text-sm font-bold tracking-wide text-white/80"
                  >
                    {val}
                  </span>
                ))}
                <span className="text-[10px] text-emerald-400/70">
                  {prize.prize}
                </span>
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
