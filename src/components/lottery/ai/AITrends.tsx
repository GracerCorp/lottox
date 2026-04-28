import React from 'react';

export interface AITrendsProps {
  trends: string;
}

export default function AITrends({ trends }: AITrendsProps) {
  if (!trends) return null;

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 mb-8 border border-orange-100 dark:border-orange-800/30">
      <div className="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100">Draw Trends & Analysis</h3>
      </div>
      <p className="text-orange-800 dark:text-orange-200 leading-relaxed">
        {trends}
      </p>
    </div>
  );
}
