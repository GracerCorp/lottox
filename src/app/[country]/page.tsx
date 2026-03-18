import { getLotteryCardData } from "@/lib/services/lotteryService";
import { getLotteriesByCountry } from "@/lib/services/lotteryService";
import { CountryHeroSection } from "@/components/country/CountryHeroSection";
import { LotteryCard } from "@/components/home/LotteryCard";
import { CheckLotteryWidget, type LotteryGroup } from "@/components/home/CheckLotteryWidget";
import { getDictionary } from "@/lib/i18n";
import Link from "next/link";
import { Trophy } from "lucide-react";

/** Max prizes shown per card — keeps layout clean */
const MAX_CARD_PRIZES = 5;

interface PageProps {
  params: Promise<{ country: string }>;
}

export default async function CountryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const countryKey = resolvedParams.country.toLowerCase();

  // Fetch country base info + lottery card data in parallel
  const [countryData, cardData, dict] = await Promise.all([
    getLotteriesByCountry(countryKey),
    getLotteryCardData(countryKey),
    getDictionary("en"),
  ]);

  // Localised prize rank labels from results.*
  const r = (dict as unknown as Record<string, Record<string, string>>)?.results ?? {};
  const prizeLabels = [
    r.prize1      ?? "1st Prize",
    r.prize2rank  ?? "2nd Prize",
    r.prize3rank  ?? "3rd Prize",
    r.prize4rank  ?? "4th Prize",
    r.prize5rank  ?? "5th Prize",
  ];

  // Fallback prize data (uses localised labels)
  const JACKPOT_FALLBACK: Record<string, { label: string; amount: string }[]> = {
    th: [
      { label: prizeLabels[0], amount: "฿6,000,000" },
      { label: prizeLabels[1], amount: "฿200,000" },
      { label: prizeLabels[2], amount: "฿80,000" },
    ],
    la: [
      { label: prizeLabels[0], amount: "₭6,000X" },
      { label: prizeLabels[1], amount: "₭500X" },
      { label: prizeLabels[2], amount: "₭60X" },
    ],
    jp: [
      { label: prizeLabels[0], amount: "¥200,000,000" },
      { label: prizeLabels[1], amount: "¥10,000,000" },
      { label: prizeLabels[2], amount: "¥300,000" },
    ],
    au: [
      { label: prizeLabels[0], amount: "A$700,000" },
    ],
  };


  // Country metadata for hero
  const countryName =
    countryData?.name ??
    countryKey.toUpperCase();

  const flag = countryData?.flag ?? null;

  const countryTranslations = (
    dict as unknown as Record<string, Record<string, string>>
  )?.country;

  const availableLotteriesLabel =
    countryTranslations?.availableLotteries ?? "Available Lotteries";
  const noLotteriesLabel =
    (countryTranslations?.noLotteries ?? "No active lotteries found for {{country}}.").replace(
      "{{country}}",
      countryName,
    );

  // Gradient colors per card position (cycles)
  const gradients = [
    { from: "#1e3a5f", to: "#0ea5e9" },
    { from: "#3b1f5e", to: "#8b5cf6" },
    { from: "#1f3d2a", to: "#22c55e" },
    { from: "#3d1e1e", to: "#ef4444" },
    { from: "#3d341e", to: "#f59e0b" },
    { from: "#1e3d3d", to: "#06b6d4" },
  ];

  // Build lottery groups for the CheckLotteryWidget dropdown
  const lotteryGroups: LotteryGroup[] = cardData.length > 0
    ? [
        {
          countryCode: countryKey,
          countryName,
          lotteries: cardData.map((c) => ({
            id: String(c.id),
            name: c.name,
            countryCode: c.countryCode,
            countryName: c.countryName,
            logo: c.logo ?? null,
          })),
        },
      ]
    : [];


  return (
    <div className="relative min-h-screen text-white">
      {/* Background — dark: deep navy radial, light: soft sky-to-white radial */}
      {/* Dark mode */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #1e40af 0%, #0f172a 60%, #020617 100%)",
        }}
      />
      {/* Light mode */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 block dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #bfdbfe 0%, #e0f2fe 40%, #f8fafc 100%)",
        }}
      />
      {/* Soft glow — dark */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 15%, rgba(59,130,246,0.25) 0%, transparent 70%)",
        }}
      />
      {/* Soft glow — light */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 block dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 15%, rgba(99,179,237,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Hero Section */}
      <CountryHeroSection
        countryName={countryName}
        countryCode={countryKey}
        flag={flag}

      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 lg:px-8">
        {/* Separator */}
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />


        {/* Section heading */}
        <div className="mb-8 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-amber-400" aria-hidden />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {availableLotteriesLabel}
          </h2>
        </div>


        {/* Lottery card grid */}
        {cardData.length === 0 ? (
          <div
            data-testid="no-lotteries"
            className="rounded-xl border border-white/10 bg-slate-800/50 py-16 text-center"
          >
            <p className="text-lg text-slate-400">{noLotteriesLabel}</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-blue-400 hover:underline"
            >
              ← Return Home
            </Link>
          </div>
        ) : (
          <div
            data-testid="lottery-grid"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {cardData.map((card, idx) => {
              const gradient = gradients[idx % gradients.length];
              // Resolve prizes: real data takes priority, fallback otherwise.
              // Cap at MAX_CARD_PRIZES to keep card layout clean.
              const rawPrizes =
                card.prizes.length > 0
                  ? card.prizes
                  : (JACKPOT_FALLBACK[countryKey] ?? []);
              const prizes = rawPrizes.slice(0, MAX_CARD_PRIZES);
              return (
                <LotteryCard
                  key={card.id}
                  name={card.name}
                  country={card.countryName}
                  flag={card.logo ?? card.flag ?? ""}
                  jackpot={prizes[0]?.amount ?? "–"}
                  nextDraw={card.nextDrawDate ?? "–"}
                  gradientFrom={gradient.from}
                  gradientTo={gradient.to}
                  href={card.href}
                  isActive={card.isActive}
                  prizes={prizes}
                  nextDrawDate={card.nextDrawDate ?? undefined}
                  bgImage={card.bgImage ?? undefined}
                />
              );
            })}

          </div>
        )}

        {/* Find By Number Section */}
        <div className="mt-14 overflow-visible rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <CheckLotteryWidget lotteryGroups={lotteryGroups} />
        </div>
      </div>
    </div>
  );
}
