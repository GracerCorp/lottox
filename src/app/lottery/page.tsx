import { Metadata } from "next";
import GlobalDrawsPage from "../global-results/page";

export const metadata: Metadata = {
  title: "Lottery Results & Jackpots - Lottox",
  description: "Check the latest lottery results, winning numbers, and upcoming jackpots from around the world on Lottox.",
};

export default function LotteryPage() {
  return <GlobalDrawsPage />;
}
