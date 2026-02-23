import { HeroSection } from "@/components/home/HeroSection";
import { BackgroundFlare } from "@/components/ui/BackgroundFlare";
import { CountryListSection } from "@/components/home/CountryListSection";
import { HomeResultsSection } from "@/components/home/HomeResultsSection";
import { getActiveCountries } from "@/lib/services/lotteryService";
import { getFlagUrl } from "@/lib/flags";

export default async function Home() {
  const countries = await getActiveCountries();

  // Deduplicate by country code to prevent React duplicate key errors
  const seen = new Set<string>();
  const tabs = [
    { id: "all", label: "all", flag: null },
    ...countries
      .filter((c) => {
        const key = c.code.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((c) => ({
        id: c.code.toLowerCase(),
        label: c.code.toLowerCase(),
        flag: c.flag || getFlagUrl(c.code.toLowerCase()) || null,
      })),
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Background with Flare */}
      <div className="absolute inset-x-0 -top-40 z-0 h-[800px] w-full bg-nebula opacity-80 blur-3xl pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent blur-[100px] z-0 pointer-events-none" />
      <BackgroundFlare />

      {/* Hero Section */}
      <HeroSection />

      {/* Results Section with Country Tabs */}
      <HomeResultsSection tabs={tabs} />

      {/* Country List Section */}
      <CountryListSection />
    </div>
  );
}
