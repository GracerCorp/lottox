import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getFlagUrl } from "@/lib/flags";

export function CountryGrid() {
  const countries = [
    {
      name: "Thailand",
      flag: getFlagUrl("th"),
      count: "1 Lottery",
      gradient: "from-blue-900/40 to-red-900/40",
      href: "/results/thai-lotto",
    },
    {
      name: "UK",
      flag: getFlagUrl("gb"),
      count: "5 Lotteries",
      gradient: "from-blue-900/40 to-red-900/40",
      href: "/results/uk",
    },
    {
      name: "USA",
      flag: getFlagUrl("us"),
      count: "7 Lotteries",
      gradient: "from-blue-900/40 to-red-900/40",
      href: "/results/usa",
    },
    {
      name: "Japan",
      flag: getFlagUrl("jp"),
      count: "2 Lotteries",
      gradient: "from-red-900/40 to-white/10",
      href: "/results/japan",
    },
    {
      name: "Australia",
      flag: getFlagUrl("au"),
      count: "3 Lotteries",
      gradient: "from-blue-900/40 to-red-900/40",
      href: "/results/australia",
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Choose Your Country</h2>
        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-navy-800 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-navy-700 hover:text-white transition-colors">
          See All Countries
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {countries.map((country, i) => (
          <Link
            key={i}
            href={country.href}
            className="group relative flex items-center gap-3 opacity-60 hover:opacity-100 overflow-hidden rounded-xl border border-white/50 bg-gradient-to-b from-white via-gray-100 to-gray-300 p-3 shadow-md transition-all hover:-translate-y-1 hover:border-white hover:shadow-xl active:scale-95"
          >
            {/* Gloss Effect */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent opacity-60" />

            <div className="relative z-10 flex h-8 w-10 shrink-0 items-center justify-center overflow-hidden rounded shadow-sm">
              <Image
                src={country.flag}
                alt={`${country.name} flag`}
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 text-left">
              <div className="text-sm font-bold text-navy-900 group-hover:text-blue-700 transition-colors">
                {country.name}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-gray-500 group-hover:text-gray-600">
                {country.count}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
