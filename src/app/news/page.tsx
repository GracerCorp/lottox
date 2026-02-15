"use client";

import { newsArticles } from "@/lib/newsData";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

export default function NewsPage() {
  const { t, language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-white">{t.news.title}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {newsArticles.map((news) => (
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
    </div>
  );
}
