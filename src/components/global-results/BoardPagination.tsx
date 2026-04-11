"use client";

interface BoardPaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function BoardPagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: BoardPaginationProps) {
  return (
    <div
      className="flex items-center justify-center gap-4 mt-4"
      data-testid="board-pagination"
    >
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
        data-testid="pagination-prev"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div className="flex items-center gap-1.5 px-2" data-testid="pagination-dots">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const isActive = p === page;
          return (
            <div
              key={p}
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-gray-400 w-4 h-1.5 dark:bg-white"
                  : "bg-gray-200 w-1.5 h-1.5 dark:bg-white/20"
              }`}
            />
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
        data-testid="pagination-next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
