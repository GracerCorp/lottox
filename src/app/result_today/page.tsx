import { Metadata } from "next";
import GlobalDrawsPage from "../global-results/page";

export const metadata: Metadata = {
  title: "Today's Lottery Results - Lottox",
  description: "Get today's latest lottery results, winning numbers, and prize breakdowns instantly on Lottox.",
};

export default function ResultTodayPage() {
  return <GlobalDrawsPage />;
}
