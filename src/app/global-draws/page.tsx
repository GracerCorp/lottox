import { DashboardTable } from "@/components/dashboard/DashboardTable";

export default function GlobalDrawsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Global Lottery Results
        </h1>
      </div>

      <DashboardTable />

      <div className="mt-12 text-center">
        <button className="text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
          Load more results...
        </button>
      </div>
    </div>
  );
}
