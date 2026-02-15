"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";

interface ResultRow {
  date: string;
  flag: string;
  country: string;
  name: string;
  numbers: {
    label: string;
    value: string[];
    prize: string;
  }[];
  id: "th" | "la";
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
      numbers: [
        { label: t.results.prize1, value: ["987654"], prize: "6,000,000 ฿" },
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
      numbers: [
        { label: t.results.digit4, value: ["4045"], prize: "x6,000" },
        { label: t.results.digit3, value: ["045"], prize: "x500" },
        { label: t.results.digit2, value: ["45"], prize: "x60" },
      ],
    },
  ];

  const results =
    filter === "all" ? rawResults : rawResults.filter((r) => r.id === filter);

  return (
    <div className="rounded-xl border border-white/10 bg-navy-900/50 backdrop-blur-md overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/5">
        <h2 className="text-xl font-bold text-white">{t.results.latest}</h2>
        <span className="text-sm text-gray-400">
          {t.common.updated}:{" "}
          {language === "th" ? "10 นาทีที่แล้ว" : "10 min ago"}
        </span>
      </div>

      <div className="flex flex-col">
        {results.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col md:flex-row items-start md:items-center border-b border-white/5 last:border-0 p-6 gap-6 transition-colors hover:bg-white/5"
          >
            {/* Column 1: Date & Identity */}
            <div className="flex items-center gap-4 w-full md:w-1/4 min-w-[200px]">
              <div className="relative h-10 w-14 overflow-hidden rounded shadow-sm shrink-0">
                <Image
                  src={item.flag}
                  alt={`${item.country} flag`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-white text-lg">{item.name}</div>
                <div className="text-sm text-gray-400">{item.date}</div>
              </div>
            </div>

            {/* Column 2: Numbers & Prizes */}
            <div className="flex-grow w-full">
              <div
                className={`grid gap-4 ${item.id === "th" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"}`}
              >
                {item.numbers.map((prize, pIndex) => (
                  <div
                    key={pIndex}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-navy-800/50 border border-white/5"
                  >
                    <span className="text-xs text-gray-400 mb-1">
                      {prize.label}
                    </span>
                    <div className="flex gap-2 mb-1">
                      {prize.value.map((val, vIndex) => (
                        <span
                          key={vIndex}
                          className="text-xl md:text-2xl font-bold text-gold-400 tracking-wider"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-medium text-emerald-400">
                      {prize.prize}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="p-8 text-center text-gray-500">{t.common.error}</div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4 text-center bg-white/5">
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
          {t.common.readMore}
        </button>
      </div>
    </div>
  );
}
