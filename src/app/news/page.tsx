"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { NewsListResponse } from "@/lib/api-types";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { newsArticles as fallbackNewsArticles } from "@/lib/newsData";

export default function NewsPage() {
  const { t, language } = useLanguage();
  const { data, loading, error } = useApi<NewsListResponse>(
    `/api/news?lang=${language}&limit=20`,
  );

  // If API returns articles, use them; otherwise fall back to local data
  const hasApiArticles = data?.articles && data.articles.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-white">{t.news.title}</h1>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-white/10 bg-navy-800/30"
            >
              <div className="aspect-video w-full bg-navy-700 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-navy-700 rounded w-1/3" />
                <div className="h-4 bg-navy-700 rounded w-full" />
                <div className="h-4 bg-navy-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error - fallback to local data */}
      {!loading && (error || !hasApiArticles) && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fallbackNewsArticles.map((news) => (
            <Link
              key={news.slug}
              href={`/news/${news.slug}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-navy-800/30 transition-all hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/10"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={news.image}
                  alt={language === "th" ? news.title : news.titleEn}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 rounded bg-gold-500 px-2 py-0.5 text-xs font-bold text-black">
                  {language === "th" ? news.category : news.categoryEn}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {news.date}
                </div>
                <h2 className="mb-2 text-lg font-bold text-white line-clamp-2 transition-colors group-hover:text-gold-400 leading-normal">
                  {language === "th" ? news.title : news.titleEn}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-3">
                  {language === "th" ? news.excerpt : news.excerptEn}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* API Articles */}
      {!loading && !error && hasApiArticles && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data!.articles.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-navy-800/30 transition-all hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/10"
            >
              {article.image && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 rounded bg-gold-500 px-2 py-0.5 text-xs font-bold text-black">
                    {article.category}
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {article.date}
                </div>
                <h2 className="mb-2 text-lg font-bold text-white line-clamp-2 transition-colors group-hover:text-gold-400 leading-normal">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination info */}
      {data && data.totalPages > 1 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Page {data.page} of {data.totalPages} ({data.total} articles)
        </div>
      )}
    </div>
  );
}
