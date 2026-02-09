import { TicketVerifier } from "@/components/country/TicketVerifier";
import { RecentDrawsTable } from "@/components/country/RecentDrawsTable";
import Image from "next/image";
import { getFlagUrl } from "@/lib/flags";

// Mock Data Source
interface Draw {
  date: string;
  drawId: string;
  numbers: string[];
  topPrize: string;
}

interface CountryInfo {
  name: string;
  lottoName: string;
  flag: string;
  nextDraw: string;
  jackpot: string;
  draws: Draw[];
}

const COUNTRY_DATA: Record<string, CountryInfo> = {
  thailand: {
    name: "Thailand",
    lottoName: "Thai Lotto",
    flag: getFlagUrl("th"),
    nextDraw: "May 1 - 2:30PM",
    jackpot: "6 Million ฿",
    draws: [
      {
        date: "16.04.24",
        drawId: "#39/2567",
        numbers: ["4", "3", "5", "5", "8"],
        topPrize: "6 Million B",
      },
      {
        date: "01.04.24",
        drawId: "#38/2567",
        numbers: ["6", "3", "3", "7", "9", "238"],
        topPrize: "6 Million B",
      },
      {
        date: "16.03.24",
        drawId: "#37/2567",
        numbers: ["2", "3", "6", "2", "8", "79"],
        topPrize: "6 Million B",
      },
    ],
  },
  usa: {
    name: "United States",
    lottoName: "Powerball",
    flag: getFlagUrl("us"),
    nextDraw: "Tonight - 10:59PM",
    jackpot: "$463 Million",
    draws: [
      {
        date: "Apr 29",
        drawId: "",
        numbers: ["12", "34", "45", "55", "58", "20"],
        topPrize: "$463M",
      },
      {
        date: "Apr 27",
        drawId: "",
        numbers: ["05", "12", "34", "41", "58", "09"],
        topPrize: "$450M",
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ country: string }>;
}

export default async function CountryPage({ params }: PageProps) {
  // Await the params to resolve the Promise
  const resolvedParams = await params;
  const countryKey = resolvedParams.country.toLowerCase();
  const data = COUNTRY_DATA[countryKey];

  if (!data) {
    // Basic fallback for unconfigured countries
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Results for {resolvedParams.country}
        </h1>
        <p className="text-gray-400">Detailed data coming soon.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Country Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
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
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {data.lottoName}
            </h1>
            <p className="text-gray-400 text-lg">
              Official Lottery Results & Statistics
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gold-600 to-gold-400 p-1 rounded-xl shadow-lg shadow-gold-500/20">
          <div className="bg-navy-900 rounded-lg px-8 py-4 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
              Next Jackpot
            </div>
            <div className="text-3xl font-black text-white">{data.jackpot}</div>
            <div className="text-xs text-green-400 mt-1 font-mono">
              Next Draw: {data.nextDraw}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TicketVerifier country={data.name} />
          <RecentDrawsTable country={data.name} draws={data.draws} />
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-navy-800 p-6 rounded-2xl border border-white/5">
            <h3 className="font-bold text-white mb-4">Stats Overview</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Odds of Winning:</span>
                <span className="text-white">1 in 1,000,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Smallest Jackpot:</span>
                <span className="text-white">2 Million</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Most Frequent Number:</span>
                <span className="text-gold-400 font-mono">79</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-navy-700 hover:bg-navy-600 text-gold-400 border border-gold-500/20 rounded-lg transition-colors">
              View Detailed Statistics
            </button>
          </div>

          {/* Promo Card */}
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-white mb-2">Get Data API</h3>
              <p className="text-sm text-gray-300 mb-4">
                Integrate these results into your own application with our
                robust API.
              </p>
              <button className="text-sm bg-white text-navy-900 px-4 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors">
                Get Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
