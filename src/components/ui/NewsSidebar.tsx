"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { NewsListResponse } from "@/lib/api-types";
import { newsArticles as fallbackNewsArticles } from "@/lib/newsData";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

interface NewsSidebarProps {
  /** Accent color class for category badge, e.g. "gold", "emerald", "red" */
  accentColor?: string;
  /** Icon to display next to the title */
  icon?: React.ReactNode;
  /** Max number of articles to show */
  limit?: number;
}

export function NewsSidebar({
  accentColor = "gold",
  icon,
  limit = 5,
}: NewsSidebarProps) {
  const { t, language } = useLanguage();
  const { data, loading } = useApi<NewsListResponse>(
    `/api/news?lang=${language}&limit=${limit}`,
  );

  const accentBg = `bg-${accentColor}-500/10`;
  const accentText = `text-${accentColor}-400`;

  // Use API data if available, otherwise fallback to local
  const hasApiData = data?.articles && data.articles.length > 0;

  // Render news item shared by both API and fallback
  function renderNewsItem(
    news: {
      slug: string;
      title: string;
      image: string;
      category: string;
      date: string;
    },
    i: number,
  ) {
    return (
      <Link
        key={news.slug}
        href={`/news/${news.slug}`}
        className={`flex gap-3 px-4 py-4 transition-colors hover:bg-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <span
            className={`mb-1 inline-block rounded ${accentBg} px-1.5 py-0.5 text-xs font-semibold ${accentText} w-fit`}
          >
            {news.category}
          </span>
          <h4 className="text-sm font-bold text-gray-200 line-clamp-2 leading-snug">
            {news.title}
          </h4>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
            <Clock className="h-3 w-3" />
            {news.date}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-800/30">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        {icon}
        <h3 className="text-lg font-bold text-white">{t.common.newsTitle}</h3>
      </div>

      {loading && (
        <div className="divide-y divide-white/5">
          {Array.from({ length: limit }, (_, i) => (
            <div key={i} className="flex gap-3 px-4 py-4 animate-pulse">
              <div className="h-20 w-20 shrink-0 rounded-lg bg-navy-700" />
              <div className="flex-1 space-y-2 py-2">
                <div className="h-3 w-1/3 rounded bg-navy-700" />
                <div className="h-4 w-full rounded bg-navy-700" />
                <div className="h-3 w-1/2 rounded bg-navy-700" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="divide-y divide-white/5">
          {hasApiData
            ? data!.articles.map((article, i) =>
                renderNewsItem(
                  {
                    slug: article.slug,
                    title: article.title,
                    image: article.image,
                    category: article.category,
                    date: article.date,
                  },
                  i,
                ),
              )
            : fallbackNewsArticles.slice(0, limit).map((news, i) =>
                renderNewsItem(
                  {
                    slug: news.slug,
                    title: language === "th" ? news.title : news.titleEn,
                    image: news.image,
                    category:
                      language === "th" ? news.category : news.categoryEn,
                    date: news.date,
                  },
                  i,
                ),
              )}
        </div>
      )}
    </div>
  );
}
