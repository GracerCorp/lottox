import { DashboardTable } from "@/components/dashboard/DashboardTable";

export default function GlobalDrawsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Global Lottery Results
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real-time updates from 50+ countries. Filter by date, country, or
          lottery type.
        </p>
      </div>

      <DashboardTable />

      <div className="mt-12 text-center">
        <button className="text-gray-500 hover:text-white transition-colors text-sm">
          Load more results...
        </button>
      </div>
    </div>
  );
}
