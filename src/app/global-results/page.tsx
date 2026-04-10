import { GlobalBoard } from "@/components/global-results/GlobalBoard";
import { GlobalResultsSection } from "@/components/global-results/GlobalResultsSection";

export default function GlobalDrawsPage() {
  return (
    <main className="container mx-auto px-4 py-12 flex flex-col gap-16">
      <GlobalResultsSection />
      <GlobalBoard />
    </main>
  );
}
