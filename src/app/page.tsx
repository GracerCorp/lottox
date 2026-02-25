import { HeroSection, HeroItem } from "@/components/home/HeroSection";
import { BackgroundFlare } from "@/components/ui/BackgroundFlare";
import { CountryListSection } from "@/components/home/CountryListSection";
import { HomeResultsSection } from "@/components/home/HomeResultsSection";
import { getActiveCountries } from "@/lib/services/lotteryService";
import { getFlagUrl } from "@/lib/flags";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const JACKPOT_DATA: Record<string, string> = {
  th: "6,000,000 ฿",
  la: "x6,000",
  vn: "x850",
};

const GRADIENTS: Record<string, { from: string; to: string; bg: string }> = {
  th: {
    from: "from-blue-900",
    to: "to-red-900",
    bg: "https://images.unsplash.com/photo-1668107710159-10fbbab2a9dd?q=80&w=1287&auto=format&fit=crop",
  },
  la: {
    from: "from-blue-800",
    to: "to-purple-900",
    bg: "https://images.unsplash.com/photo-1725017766702-2a2eff1228cd?q=80&w=1287&auto=format&fit=crop",
  },
  vn: {
    from: "from-red-900",
    to: "to-orange-900",
    bg: "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=1287&auto=format&fit=crop",
  },
};

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
        flag: getFlagUrl(c.code.toLowerCase()), // always use URL, not DB emoji
      })),
  ];

  const countryListItems = countries.map((c) => ({
    id: c.code.toLowerCase(),
    name: c.name,
    count: c.lotteries.length,
    flag: c.code.toLowerCase(),
  }));

  const heroItems: HeroItem[] = [];
  for (const country of countries) {
    const code = country.code.toLowerCase();
    for (const lotto of country.lotteries) {
      if (!lotto.is_active) continue;

      const theme = GRADIENTS[code] || GRADIENTS.th;
      const jackpot = JACKPOT_DATA[code] || "Play Now";
      const lottoSlug = slugify(lotto.name);
      // Construct an approximate Next Draw string or leave it empty if unavailable
      const nextDraw = country.draw_schedule || "Next Draw Soon";

      heroItems.push({
        id: `${code}-${lotto.id}`,
        name: lotto.name,
        country: country.name,
        flag: getFlagUrl(code),
        jackpot,
        nextDraw,
        gradientFrom: theme.from,
        gradientTo: theme.to,
        href: `/${code}/${lottoSlug}`,
        bgImage: theme.bg,
      });

      // We likely only need the primary lottery per country for the hero banners, or we can show up to 1-2 per country
      break;
    }
  }

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Background with Flare */}
      <div className="absolute inset-x-0 -top-40 z-0 h-[800px] w-full bg-nebula opacity-80 blur-3xl pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent blur-[100px] z-0 pointer-events-none" />
      <BackgroundFlare />

      {/* Hero Section */}
      <HeroSection items={heroItems} />

      {/* Results Section with Country Tabs */}
      <HomeResultsSection tabs={tabs} />

      {/* Country List Section */}
      <CountryListSection countries={countryListItems} />
    </div>
  );
}
