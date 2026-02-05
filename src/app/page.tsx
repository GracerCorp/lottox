import { HeroSection } from "@/components/home/HeroSection";
import { LiveTicker } from "@/components/home/LiveTicker";
import { ResultsTable } from "@/components/home/ResultsTable";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <HeroSection />
      <LiveTicker />
      <ResultsTable />

      {/* Country Selector Placeholder Section */}
      <section className="py-12 md:py-20 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-8">
          Choose Your Country
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "USA",
            "UK",
            "Germany",
            "Spain",
            "Italy",
            "France",
            "Japan",
            "Australia",
            "Brazil",
            "Thailand",
          ].map((country) => (
            <div
              key={country}
              className="bg-navy-800 p-4 rounded-xl border border-white/5 hover:border-gold-500/50 hover:bg-navy-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gray-700 rounded overflow-hidden relative">
                  {/* Placeholder for flag image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-600 to-gray-500 group-hover:from-gold-600 group-hover:to-gold-400 transition-colors"></div>
                </div>
                <span className="font-semibold text-gray-300 group-hover:text-white">
                  {country}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why LottoX Section */}
      <section className="py-20 bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Why LOTTOX?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Results",
                desc: "Direct data feeds from official lottery operators worldwide.",
              },
              {
                title: "Real-Time Updates",
                desc: "Instant notifications when numbers are drawn.",
              },
              {
                title: "Global Coverage",
                desc: "Access to over 50+ international lotteries in one place.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-navy-800/50 p-8 rounded-2xl border border-white/5 hover:bg-navy-800 transition-colors"
              >
                <h3 className="text-xl font-bold text-gold-400 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
