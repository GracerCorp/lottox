import { GlobalBoard } from "@/components/global-results/GlobalBoard";
import { GlobalResultsSection } from "@/components/global-results/GlobalResultsSection";

export default function GlobalDrawsPage() {
  return (
    <main className="container mx-auto px-4 py-12 flex flex-col gap-16 relative">
      {/* Dark mode background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #262626 0%, #171717 60%, #0a0a0a 100%)",
        }}
      />
      {/* Light mode background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 block dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #fef3c7 0%, #f5f5f5 40%, #ffffff 100%)",
        }}
      />
      {/* Gold glow layer — adapts per theme */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 15%, rgba(212,175,55,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 block dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 15%, rgba(223,177,41,0.15) 0%, transparent 70%)",
        }}
      />

      <GlobalResultsSection />
      <GlobalBoard />
    </main>
  );
}
