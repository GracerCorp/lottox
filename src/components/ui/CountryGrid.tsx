import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getFlagUrl } from "@/lib/flags";

export function CountryGrid() {
  const countries = [
    {
      name: "Thailand",
      nameLocal: "ไทย",
      flag: getFlagUrl("th"),
      count: "สลากกินแบ่งรัฐบาล",
      href: "/results/thai-lotto",
    },
    {
      name: "Laos",
      nameLocal: "ลาว",
      flag: getFlagUrl("la"),
      count: "หวยลาวพัฒนา",
      href: "/results/lao-lotto",
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">เลือกประเทศ</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {countries.map((country, i) => (
          <Link
            key={i}
            href={country.href}
            className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/50 bg-gradient-to-b from-white via-gray-100 to-gray-300 p-4 shadow-md transition-all hover:-translate-y-1 hover:border-white hover:shadow-xl active:scale-95"
          >
            {/* Gloss Effect */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent opacity-60" />

            <div className="relative z-10 flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded shadow-sm">
              <Image
                src={country.flag}
                alt={`${country.name} flag`}
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 text-left flex-1">
              <div className="text-base font-bold text-navy-900 group-hover:text-blue-700 transition-colors">
                {country.nameLocal}
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({country.name})
                </span>
              </div>
              <div className="text-xs font-medium text-gray-500 group-hover:text-gray-600">
                {country.count}
              </div>
            </div>

            <ArrowRight className="relative z-10 h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
