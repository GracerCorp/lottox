"use client";

interface DrawHistoryRowProps {
  drawTime: string;
  drawDate: string;
  digits6: string;
  digits3First: string;
  digits3Last: string;
  digits2Last: string;
  labels: {
    digits6: string;
    digits3First: string;
    digits3Last: string;
    digits2Last: string;
  };
}

export function DrawHistoryRow({
  drawTime,
  drawDate,
  digits6,
  digits3First,
  digits3Last,
  digits2Last,
  labels,
}: DrawHistoryRowProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 px-4 border-b border-slate-100 dark:border-white/5 last:border-0"
      data-testid="draw-history-row"
    >
      {/* Date + time */}
      <span className="text-sm text-gray-400 shrink-0 font-medium">
        {drawTime && <>{drawTime} | </>}
        {drawDate}
      </span>

      {/* Prize columns */}
      {[
        { label: labels.digits6, value: digits6, main: true },
        { label: labels.digits3First, value: digits3First, main: false },
        { label: labels.digits3Last, value: digits3Last, main: false },
        { label: labels.digits2Last, value: digits2Last, main: false },
      ].map((col) => (
        <div key={col.label} className="shrink-0">
          <span className="block text-xs text-gray-500 uppercase tracking-wide leading-none mb-1">
            {col.label}
          </span>
          <span
            className={
              col.main
                ? "text-lg font-black text-amber-400 tracking-wider tabular-nums"
                : "text-base font-bold text-red-400 tracking-wide tabular-nums"
            }
          >
            {col.value || "–"}
          </span>
        </div>
      ))}
    </div>
  );
}
