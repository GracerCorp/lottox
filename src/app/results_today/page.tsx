import { Metadata } from "next";
import { GlobalResultsSection } from "@/components/global-results/GlobalResultsSection";

export const metadata: Metadata = {
  title: "Today's Lottery Results - Lottox",
  description: "Get today's latest lottery results, winning numbers, and prize breakdowns instantly on Lottox.",
};

export default function ResultTodayPage() {
  return (
    <main className="container mx-auto px-4 py-12 flex flex-col gap-16 relative">
      <GlobalResultsSection />
    </main>
  );
}
