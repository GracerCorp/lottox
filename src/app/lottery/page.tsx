import { Metadata } from "next";
import { GlobalBoard } from "@/components/global-results/GlobalBoard";

export const metadata: Metadata = {
  title: "Lottery Results & Jackpots - Lottox",
  description: "Check the latest lottery results, winning numbers, and upcoming jackpots from around the world on Lottox.",
};

export default function LotteryPage() {
  return (
    <main className="container mx-auto px-4 py-12 flex flex-col gap-16 relative">
      <GlobalBoard />
    </main>
  );
}
