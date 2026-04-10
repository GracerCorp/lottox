import LotteryDetail from "@/components/lottery/LotteryDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLotteryBySlug } from "@/lib/services/lotteryService";
import { apiClient } from "@/lib/services/lotteryResultService";
import { getDictionary } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ country: string; lottery: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country, lottery } = await params;
  const data = await getLotteryBySlug(country, lottery);

  const lotteryName =
    data?.lottery.name || lottery.replace(/-/g, " ").toUpperCase();
  const countryName = data?.country.name || country;

  return {
    title: `${lotteryName} Results - ${countryName} Lottery | LOTTOX`,
    description: `Latest ${lotteryName} results from ${countryName}. Check winning numbers, prize breakdowns, and history.`,
  };
}

export default async function LotteryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { country, lottery } = resolvedParams;

  const data = await getLotteryBySlug(country, lottery);

  if (!data) {
    notFound();
  }
  const { country: countryInfo, lottery: lotteryInfo, apiType } = data;
  
  let initialData;
  try {
    initialData = await apiClient.getResultsByType(apiType, 10);
  } catch (error) {
    console.error("Failed to prefetch lottery detail:", error);
  }

  const dict = await getDictionary("en");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = (dict as any)?.results ?? {};
  const prizeLabels = {
    firstPrize: r.prize1 ?? "1st Prize",
    last3f: r.prize3Front ?? "3 Front",
    last3b: r.prize3Back ?? "3 Back",
    last2: r.prize2 ?? "2 Bottom",
  };


  return (
    <LotteryDetail
      country={countryInfo.name}
      countryCode={countryInfo.code}
      lotteryName={lotteryInfo.name}
      lotteryId={lotteryInfo.id}
      lotterySlug={lottery}
      apiEndpoint={`/api/results/${apiType}`}
      logo={lotteryInfo.logo}
      currency={lotteryInfo.currency}
      initialData={initialData as import("@/lib/api-types").ResultsByTypeResponse | undefined}
      howToPlayText={lotteryInfo.how_to_play_text}
      howToPlayImage={lotteryInfo.how_to_play_image}
      prizeLabels={prizeLabels}
      hideVerification={true}
    />
  );
}
