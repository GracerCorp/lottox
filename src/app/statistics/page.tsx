"use client";

import { BarChart3, TrendingUp, PieChart } from "lucide-react";
import { useApi } from "@/lib/hooks/useApi";
import type { StatsOverviewResponse } from "@/lib/api-types";

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function StatisticsPage() {
  const { data, loading } = useApi<StatsOverviewResponse>("/api/statistics");

  const stats = [
    {
      label: "Total Jackpots Tracked",
      value: data?.totalJackpotsTracked || "-",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Active Lotteries",
      value: data?.activeLotteries?.toString() || "-",
      icon: BarChart3,
      color: "text-blue-500",
    },
    {
      label: "Upcoming Draws (24h)",
      value: data?.upcomingDraws24h?.toString() || "-",
      icon: ClockIcon,
      color: "text-gold-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">
        Lottery Statistics & Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-navy-800 p-6 rounded-2xl border border-white/5 flex items-center gap-4 ${loading ? "animate-pulse" : ""}`}
          >
            <div
              className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-navy-800 rounded-3xl p-8 border border-white/5 text-center py-20">
        <PieChart className="w-20 h-20 text-navy-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Advanced Analytics Coming Soon
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          We are building AI-powered prediction models and hot/cold number
          tracking for over 50 lotteries. Stay tuned!
        </p>
      </div>
    </div>
  );
}
