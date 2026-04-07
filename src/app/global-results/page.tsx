import { GlobalResultsSection } from "@/components/global-results/GlobalResultsSection";
import { MyResultBoard } from "@/components/global-results/MyResultBoard";

export default function GlobalDrawsPage() {
  return (
    <main className="container mx-auto px-4 py-12 flex flex-col gap-16">
      <GlobalResultsSection />
      <MyResultBoard />
    </main>
  );
}
