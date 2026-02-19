"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { NewsListResponse } from "@/lib/api-types";
import { newsArticles as fallbackNewsArticles } from "@/lib/newsData";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronLeft } from "lucide-react";

interface ArticleProps {
  slug: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  image: string;
  date: string;
  category: string;
  categoryEn?: string;
  author: string;
  source?: string;
  isLocal?: boolean;
}

export default function NewsArticleContent({
  article,
}: {
  article: ArticleProps;
}) {
  const { t, language } = useLanguage();

  // Fetch related articles from API
  const { data: newsData } = useApi<NewsListResponse>(
    `/api/news?lang=${language}&limit=4`,
  );

  const title =
    language === "th" ? article.title : article.titleEn || article.title;
  const content =
    language === "th" ? article.content : article.contentEn || article.content;
  const category =
    language === "th"
      ? article.category
      : article.categoryEn || article.category;

  // Related articles: from API or fallback
  let relatedArticles: {
    slug: string;
    title: string;
    image: string;
    date: string;
  }[] = [];

  if (newsData?.articles && newsData.articles.length > 0) {
    relatedArticles = newsData.articles
      .filter((a) => a.slug !== article.slug)
      .slice(0, 3)
      .map((a) => ({
        slug: a.slug,
        title: a.title,
        image: a.image,
        date: a.date,
      }));
  } else {
    relatedArticles = fallbackNewsArticles
      .filter((a) => a.slug !== article.slug)
      .slice(0, 3)
      .map((a) => ({
        slug: a.slug,
        title: language === "th" ? a.title : a.titleEn,
        image: a.image,
        date: a.date,
      }));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to news */}
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-gold-400"
      >
        <ChevronLeft className="h-4 w-4" />
        {t.news.backToNews}
      </Link>

      <article className="mx-auto max-w-3xl">
        {/* Hero Image */}
        {article.image && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80 md:h-96">
            <Image
              src={article.image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="mb-2 inline-block rounded bg-gold-500/90 px-2.5 py-1 text-xs font-bold text-black">
                {category}
              </span>
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-white/10 pb-6 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>
              {t.news.publishedAt} {article.date}
            </span>
          </div>
          {article.source && (
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600">|</span>
              <span>
                {t.news.source}: {article.source}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose-custom mb-12">
          {content.split("\n").map((paragraph, i) => {
            if (paragraph.trim() === "") return null;
            // Lines starting with - as list items
            if (paragraph.trim().startsWith("- ")) {
              return (
                <div
                  key={i}
                  className="ml-4 flex items-start gap-2 py-1 text-base leading-relaxed text-gray-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                  <span>{paragraph.trim().slice(2)}</span>
                </div>
              );
            }
            // Lines with number prefix as list items
            if (/^\d+\.\s/.test(paragraph.trim())) {
              return (
                <div
                  key={i}
                  className="ml-4 flex items-start gap-2 py-1 text-base leading-relaxed text-gray-300"
                >
                  <span className="mt-0.5 shrink-0 text-gold-400 font-bold text-sm">
                    {paragraph.trim().split(".")[0]}.
                  </span>
                  <span>{paragraph.trim().replace(/^\d+\.\s/, "")}</span>
                </div>
              );
            }
            // Regular paragraphs
            return (
              <p
                key={i}
                className="mb-4 text-base leading-relaxed text-gray-300 sm:text-lg"
              >
                {paragraph.trim()}
              </p>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mb-12 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-sm leading-relaxed text-gray-300">
            {language === "th"
              ? "ข้อมูลในบทความนี้เป็นเพียงข้อมูลอ้างอิง ไม่ได้รับประกันผลรางวัล กรุณาตรวจสอบจากแหล่งข้อมูลทางการเสมอ"
              : "The information in this article is for reference only and does not guarantee results. Please always verify from official sources."}
          </p>
        </div>
      </article>

      {/* Related News */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-xl font-bold text-white">
          {t.news.relatedNews}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((news) => (
            <Link
              key={news.slug}
              href={`/news/${news.slug}`}
              className="group overflow-hidden rounded-xl border border-white/5 bg-navy-800 transition-all hover:border-gold-500/20"
            >
              {news.image && (
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-transparent to-transparent" />
                </div>
              )}
              <div className="p-4">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{news.date}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-300 line-clamp-2 group-hover:text-gold-400 transition-colors">
                  {news.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
