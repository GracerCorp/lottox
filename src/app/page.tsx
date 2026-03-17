import { HeroSection, HeroItem } from "@/components/home/HeroSection";
import { LiveTicker } from "@/components/home/LiveTicker";
import { CheckLotteryWidget, LotteryGroup } from "@/components/home/CheckLotteryWidget";
import { CountryListSection } from "@/components/home/CountryListSection";
import { HomeResultsSection } from "@/components/home/HomeResultsSection";
import { getActiveCountries } from "@/lib/services/lotteryService";
import { getActiveBanners } from "@/lib/services/bannerService";
import { getFlagUrl } from "@/lib/flags";
import { slugify } from "@/lib/utils/lotteryUtils";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const DEFAULT_JACKPOT = "Play Now";

const JACKPOT_DATA: Record<string, { main: string; prizes: { label: string; amount: string }[] }> = {
  th: {
    main: "฿6,000,000",
    prizes: [
      { label: "1st Prize", amount: "฿6,000,000" },
      { label: "2nd Prize", amount: "฿200,000" },
      { label: "3rd Prize", amount: "฿80,000" },
      { label: "4th Prize", amount: "฿40,000" },
      { label: "5th Prize", amount: "฿20,000" },
    ],
  },
  la: {
    main: "6,000 times",
    prizes: [
      { label: "1st Prize", amount: "6,000 times" },
      { label: "2nd Prize", amount: "500 times" },
      { label: "3rd Prize", amount: "60 times" },
    ],
  },
  jp: {
    main: "¥200,000,000",
    prizes: [
      { label: "1st Prize", amount: "¥200,000,000" },
      { label: "2nd Prize", amount: "¥10,000,000" },
      { label: "3rd Prize", amount: "¥300,000" },
    ],
  },
  "jp-loto7": {
    main: "¥700,000,000",
    prizes: [
      { label: "1st Prize", amount: "¥700,000,000" },
      { label: "2nd Prize (Up to)", amount: "¥6,100,000,000" },
      { label: "3rd Prize", amount: "¥500,000" },
    ],
  },
  "jp-mini": {
    main: "¥10,000,000",
    prizes: [
      { label: "1st Prize (Up to)", amount: "¥10,000,000" },
      { label: "2nd Prize (Up to)", amount: "¥150,000" },
      { label: "3rd Prize", amount: "¥10,000" },
    ],
  },
  au: {
    main: "A$700,000",
    prizes: [
      { label: "1st Prize", amount: "A$700,000" },
    ],
  },
};

const DEFAULT_GRADIENT = {
  from: "from-slate-800",
  to: "to-slate-950",
  bg: "https://images.unsplash.com/photo-1546768292-fb12f6c92568?q=80&w=1287&auto=format&fit=crop",
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
  jp: {
    from: "from-red-800",
    to: "to-rose-950",
    bg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1287&auto=format&fit=crop",
  },
  au: {
    from: "from-blue-700",
    to: "to-green-900",
    bg: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1287&auto=format&fit=crop",
  },
};

export default async function Home() {
  const countries = await getActiveCountries();
  const dbBanners = await getActiveBanners();

  // Deduplicate by country code
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
        flag: getFlagUrl(c.code.toLowerCase()),
      })),
  ];

  const seenCountry = new Set<string>();
  const countryListItems = countries
    .filter((c) => {
      const key = c.code.toLowerCase();
      if (seenCountry.has(key)) return false;
      seenCountry.add(key);
      return true;
    })
    .map((c) => ({
      id: c.code.toLowerCase(),
      name: c.name,
      count: c.lotteries.length,
      flag: c.code.toLowerCase(),
    }));

  // Build lottery groups for CheckLotteryWidget dropdown
  const groupSeen = new Set<string>();
  const lotteryGroups: LotteryGroup[] = countries
    .filter((c) => {
      const key = c.code.toLowerCase();
      if (groupSeen.has(key)) return false;
      groupSeen.add(key);
      return true;
    })
    .map((c) => ({
      countryCode: c.code.toLowerCase(),
      countryName: c.name,
      lotteries: c.lotteries
        .filter((l) => l.is_active)
        .map((l) => ({
          id: `${c.code.toLowerCase()}-${l.id}`,
          name: l.name,
          countryCode: c.code.toLowerCase(),
          countryName: c.name,
        })),
    }))
    .filter((g) => g.lotteries.length > 0);

  const heroItems: HeroItem[] = [];

  // 1. Create banners from DB
  for (const banner of dbBanners) {
    const lotto = banner.lottery_results?.lottery;
    const country = lotto?.countries;
    if (!lotto || !country) continue;

    const code = country.code.toLowerCase();
    const theme = GRADIENTS[code] || DEFAULT_GRADIENT;
    const jackpotInfo = JACKPOT_DATA[code];
    const jackpot = jackpotInfo?.main || DEFAULT_JACKPOT;
    const lottoSlug = slugify(lotto.name);
    const nextDraw = country.draw_schedule || "Next Draw Soon";

    // Compute a fallback nextDrawDate (14 days from now if no schedule)
    const drawDate = new Date();
    drawDate.setDate(drawDate.getDate() + 14);
    const nextDrawDate = drawDate.toISOString();

    heroItems.push({
      id: `banner-${banner.id}`,
      name: lotto.name,
      country: country.name,
      flag: getFlagUrl(code),
      jackpot,
      nextDraw,
      gradientFrom: theme.from,
      gradientTo: theme.to,
      href: `/${code}/${lottoSlug}`,
      bgImage: banner.image_url || theme.bg,
      prizes: jackpotInfo?.prizes,
      nextDrawDate,
    });
  }

  // 2. Fallback — create banners from countries
  if (heroItems.length === 0) {
    for (const country of countries) {
      const code = country.code.toLowerCase();
      for (const lotto of country.lotteries) {
        if (!lotto.is_active) continue;

        const theme = GRADIENTS[code] || DEFAULT_GRADIENT;
        const jackpotInfo = JACKPOT_DATA[code];
        const jackpot = jackpotInfo?.main || DEFAULT_JACKPOT;
        const lottoSlug = slugify(lotto.name);
        const nextDraw = country.draw_schedule || "Next Draw Soon";

        const drawDate = new Date();
        drawDate.setDate(drawDate.getDate() + 14);
        const nextDrawDate = drawDate.toISOString();

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
          prizes: jackpotInfo?.prizes,
          nextDrawDate,
        });

        break;
      }
    }
  }

  return (
    <div className="flex flex-col relative">
      <JsonLd />
      {/* Background for entire homepage */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-navy-950 -z-10" />

      {/* Section 1: Hero Carousel */}
      <HeroSection items={heroItems} />

      {/* Section 2: Live Ticker */}
      <LiveTicker />

      {/* Section 3: Find By Number */}
      <CheckLotteryWidget lotteryGroups={lotteryGroups} />

      {/* Section 4: Lottery By Country */}
      <CountryListSection countries={countryListItems} />

      {/* Section 5: Latest Update with Country Tabs */}
      <HomeResultsSection tabs={tabs} />

      {/* Section 6: All Global Results CTA */}
      <section className="container mx-auto px-4 py-8 flex justify-center">
        <Link
          href="/global-draws"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          All Global Results
        </Link>
      </section>
    </div>
  );
}
