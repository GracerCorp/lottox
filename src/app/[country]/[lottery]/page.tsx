import LotteryDetail from "@/components/lottery/LotteryDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLotteryBySlug } from "@/lib/services/lotteryService";

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

  return (
    <LotteryDetail
      country={countryInfo.name}
      countryCode={countryInfo.code}
      lotteryName={lotteryInfo.name}
      lotterySlug={lottery}
      apiEndpoint={`/api/results/${apiType}`}
      logo={lotteryInfo.logo}
      currency={lotteryInfo.currency}
    />
  );
}
