import { TicketVerifier } from "@/components/country/TicketVerifier";
import Image from "next/image";
import { getFlagUrl } from "@/lib/flags";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

// Mock Data Source - In real app, this would be fetched from API based on country
interface LotteryConfig {
  name: string;
  slug: string;
  nextDraw: string;
  jackpot: string;
  type: "Lotto" | "Raffle" | "Scratch";
}

interface CountryInfo {
  name: string;
  flag: string;
  lotteries: LotteryConfig[];
}

const COUNTRY_DATA: Record<string, CountryInfo> = {
  thailand: {
    name: "Thailand",
    flag: getFlagUrl("th"),
    lotteries: [
      {
        name: "Thai Lotto",
        slug: "thai-lotto",
        nextDraw: "16 Feb",
        jackpot: "6 Million ฿",
        type: "Lotto",
      },
    ],
  },
  usa: {
    name: "United States",
    flag: getFlagUrl("us"),
    lotteries: [
      {
        name: "Powerball",
        slug: "powerball",
        nextDraw: "Wed & Sat",
        jackpot: "$463 Million",
        type: "Lotto",
      },
      {
        name: "Mega Millions",
        slug: "mega-millions",
        nextDraw: "Tue & Fri",
        jackpot: "$200 Million",
        type: "Lotto",
      },
    ],
  },
  vietnam: {
    name: "Vietnam",
    flag: getFlagUrl("vn"),
    lotteries: [
      {
        name: "Vietnam Hanoi",
        slug: "vietnam-hanoi",
        nextDraw: "Daily",
        jackpot: "Variable",
        type: "Lotto",
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ country: string }>;
}

export default async function CountryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const countryKey = resolvedParams.country.toLowerCase();
  const data = COUNTRY_DATA[countryKey];

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Results for {resolvedParams.country}
        </h1>
        <p className="text-gray-400">Detailed data coming soon.</p>
        <Link
          href="/"
          className="text-gold-400 hover:underline mt-4 inline-block"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Country Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-gray-200 dark:border-white/10 pb-8">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-24 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={data.flag}
              alt={`${data.name} flag`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, 128px"
            />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
              {data.name} Lottery
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Official Results & Statistics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: List of Lotteries */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Trophy className="text-gold-500 dark:text-gold-400 h-6 w-6" />
              Available Lotteries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.lotteries.map((lotto) => (
                <Link
                  key={lotto.slug}
                  href={`/${countryKey}/${lotto.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-navy-800 dark:to-navy-900 p-6 transition-all hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/10 shadow-sm"
                >
                  <div className="absolute inset-0 bg-gold-400/0 transition-colors group-hover:bg-gold-500/5 dark:group-hover:bg-gold-400/5" />
                  <div className="relative z-10">
                    <span className="inline-block rounded-full bg-gray-100 dark:bg-white/5 px-3 py-1 text-xs font-medium text-gold-600 dark:text-gold-400 mb-3 border border-gray-200 dark:border-white/10">
                      {lotto.type}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors">
                      {lotto.name}
                    </h3>
                    <div className="space-y-2 mb-6">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Next Draw:{" "}
                        <span className="text-gray-900 dark:text-white font-medium">
                          {lotto.nextDraw}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Jackpot:{" "}
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          {lotto.jackpot}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gold-600 dark:text-gold-400">
                      View Results{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Ticket Verifier */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Check Your Tickets
            </h2>
            <TicketVerifier country={data.name} />
          </div>
        </div>

        {/* Sidebar Stats */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Country Stats
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Lotteries:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {data.lotteries.length}
                </span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-navy-900/50 rounded-lg border border-gray-200 dark:border-white/5 mt-4">
                <p className="text-center text-gray-500 dark:text-gray-400 italic text-xs">
                  "Lottery is a tax on people who are bad at math, but a dream
                  for those who need hope."
                </p>
              </div>
            </div>
          </div>

          {/* Promo Card */}
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 p-6 rounded-2xl border border-purple-200 dark:border-white/10 relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <h3 className="font-bold text-purple-900 dark:text-white mb-2">
                Get Data API
              </h3>
              <p className="text-sm text-purple-700 dark:text-gray-300 mb-4">
                Integrate these results into your own application with our
                robust API.
              </p>
              <button className="text-sm bg-white text-purple-900 dark:text-navy-900 px-4 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors shadow-sm">
                Get Access
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
