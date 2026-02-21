"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { NewsListResponse } from "@/lib/api-types";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Clock, Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { newsArticles as fallbackNewsArticles } from "@/lib/newsData";

export default function NewsPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, loading, error } = useApi<NewsListResponse>(
    `/api/news?lang=${language}&limit=20${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}`,
  );

  // If API returns articles, use them; otherwise fall back to local data
  const hasApiArticles = data?.articles && data.articles.length > 0;

  const showFallback =
    !loading && (error || (!hasApiArticles && !debouncedSearch));
  const showEmptySearch =
    !loading && !error && !hasApiArticles && !!debouncedSearch;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">{t.news.title}</h1>
        <div className="relative w-full sm:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-white/10 bg-navy-800/50 p-2.5 pl-10 text-sm text-white placeholder-gray-400 focus:border-gold-500 focus:ring-gold-500"
            placeholder={
              language === "th" ? "ค้นหาข่าวสาร..." : "Search news..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

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
      {showFallback && (
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

      {/* Empty Search State */}
      {showEmptySearch && (
        <div className="col-span-full py-16 text-center text-gray-400">
          <Search className="mx-auto mb-6 h-16 w-16 opacity-20" />
          <p className="text-xl font-medium text-white mb-2">
            {language === "th"
              ? `ไม่พบข่าวสารที่ตรงกับ "${debouncedSearch}"`
              : `No news found for "${debouncedSearch}"`}
          </p>
          <p className="text-sm">
            {language === "th"
              ? "ลองใช้คำค้นหาอื่น หรือตรวจตัวสะกดอีกครั้ง"
              : "Try using different keywords or checking for typos."}
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-6 rounded-lg bg-navy-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-600 hover:text-gold-400"
          >
            {language === "th" ? "ล้างการค้นหา" : "Clear search"}
          </button>
        </div>
      )}

      {/* API Articles */}
      {!loading && !error && hasApiArticles && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data!.articles.map((article) => {
            const fallbackImage = fallbackNewsArticles.find(
              (a) => a.slug === article.slug,
            )?.image;
            const articleImage = article.image || fallbackImage;

            return (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-navy-800/30 transition-all hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/10"
              >
                {articleImage && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={articleImage}
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
            );
          })}
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
