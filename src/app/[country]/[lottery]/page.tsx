import LotteryDetail from "@/components/lottery/LotteryDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// This would ideally come from a database or config
const LOTTERY_CONFIG: Record<string, any> = {
  "thai-lotto": {
    name: "Thai Lotto",
    apiEndpoint: "/api/results/thai",
    countryCode: "th",
  },
  "vietnam-hanoi": {
    name: "Vietnam Hanoi",
    apiEndpoint: "/api/results/vietnam-hanoi", // Example endpoint
    countryCode: "vn",
  },
  // Add others...
};

interface PageProps {
  params: Promise<{ country: string; lottery: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country, lottery } = await params;
  const config = LOTTERY_CONFIG[lottery] || {
    name: lottery.replace(/-/g, " ").toUpperCase(),
  };

  return {
    title: `${config.name} Results - ${country.charAt(0).toUpperCase() + country.slice(1)} Lottery | LOTTOX`,
    description: `Latest ${config.name} results from ${country}. Check winning numbers, prize breakdowns, and history.`,
  };
}

export default async function LotteryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { country, lottery } = resolvedParams;

  // Basic validation or mapping could happen here
  // For now, we pass the params to the client component
  // In a real app, verify if 'lottery' exists for 'country'

  // Specific override for Thai Lotto for testing since we know it exists
  let lottoConfig = LOTTERY_CONFIG[lottery];

  if (!lottoConfig) {
    // Fallback or 404
    // For demonstration, if it's thai-lotto, use it, else default
    if (lottery === "thai-lotto") {
      lottoConfig = LOTTERY_CONFIG["thai-lotto"];
    } else {
      // If we want to support dynamic lotteries without config, we construct basic props
      lottoConfig = {
        name: lottery.replace(/-/g, " ").toUpperCase(),
        apiEndpoint: `/api/results/${lottery}`, // Assumption
        countryCode: country === "thailand" ? "th" : "us", // Fallback
      };
    }
  }

  return (
    <LotteryDetail
      country={country.charAt(0).toUpperCase() + country.slice(1)}
      countryCode={lottoConfig.countryCode}
      lotteryName={lottoConfig.name}
      lotterySlug={lottery}
      apiEndpoint={lottoConfig.apiEndpoint}
    />
  );
}
