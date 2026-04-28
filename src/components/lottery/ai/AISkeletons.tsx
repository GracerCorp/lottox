import React from 'react';

export function AISummarySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 relative overflow-hidden animate-pulse">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-300 to-purple-400 dark:from-blue-700 dark:to-purple-800"></div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 bg-blue-200 dark:bg-blue-900/50 rounded-full"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
        <div className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded w-20 ml-auto"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-11/12"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function AITrendsSkeleton() {
  return (
    <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-6 mb-8 border border-orange-100 dark:border-orange-800/20 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 bg-orange-200 dark:bg-orange-800/50 rounded-full"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-11/12"></div>
      </div>
    </div>
  );
}

export function AIFaqsSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-56"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
