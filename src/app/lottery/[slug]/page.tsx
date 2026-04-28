import { Metadata } from "next";
import { notFound } from "next/navigation";
import ResultsToday from "./_components/ResultsToday";
import ResultsHistory from "./_components/ResultsHistory";
import ResultsByDate from "./_components/ResultsByDate";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Ensure proper capitalization for metadata
function capitalizeCountry(countrySlug: string) {
  return countrySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (slug.endsWith("_lottery_results_today")) {
    const countryName = capitalizeCountry(slug.replace("_lottery_results_today", ""));
    return {
      title: `Today's ${countryName} Lottery Results | Lottox`,
      description: `Check the latest lottery results and winning numbers for ${countryName} today.`,
    };
  }

  if (slug.endsWith("_lottery_history")) {
    const countryName = capitalizeCountry(slug.replace("_lottery_history", ""));
    return {
      title: `${countryName} Lottery History | Lottox`,
      description: `View historical lottery results and past winning numbers for ${countryName}.`,
    };
  }

  const dateMatch = slug.match(/^(.*)_lottery_results_(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    const countryName = capitalizeCountry(dateMatch[1]);
    const date = dateMatch[2];
    return {
      title: `${countryName} Lottery Results for ${date} | Lottox`,
      description: `Check the lottery results and winning numbers for ${countryName} on ${date}.`,
    };
  }

  return {
    title: "Lottery Results | Lottox",
    description: "Check the latest lottery results.",
  };
}

export default async function LotteryDynamicPage({ params }: Props) {
  const { slug } = await params;

  if (slug.endsWith("_lottery_results_today")) {
    const countryName = slug.replace("_lottery_results_today", "");
    return <ResultsToday countryName={countryName} />;
  }

  if (slug.endsWith("_lottery_history")) {
    const countryName = slug.replace("_lottery_history", "");
    return <ResultsHistory countryName={countryName} />;
  }

  const dateMatch = slug.match(/^(.*)_lottery_results_(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    const countryName = dateMatch[1];
    const date = dateMatch[2];
    return <ResultsByDate countryName={countryName} date={date} />;
  }

  // If no patterns match, trigger a 404
  notFound();
}
