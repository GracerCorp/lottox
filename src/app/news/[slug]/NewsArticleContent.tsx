"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { NewsListResponse } from "@/lib/api-types";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronLeft } from "lucide-react";
import { useMemo } from "react";

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

  const parsedContent = useMemo(() => {
    try {
      if (typeof content === "string") {
        const parsed = JSON.parse(content);
        if (parsed && parsed.type === "doc") {
          return parsed;
        }
      }
    } catch {
      // Not valid JSON
    }
    return null;
  }, [content]);

  // Related articles: from API
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
      .map((a) => {
        return {
          slug: a.slug,
          title: language === "th" ? a.title : a.titleEn || a.title,
          image: a.image || "",
          date: a.date,
        };
      });
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
        <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
          {title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6 text-sm text-gray-600 dark:text-gray-400">
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
          {parsedContent ? (
            <TipTapRenderer node={parsedContent} />
          ) : (
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap break-words"
              
            >{ content.replace(/<p><\/p>/g, '') }</div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mb-12 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {language === "th"
              ? "ข้อมูลในบทความนี้เป็นเพียงข้อมูลอ้างอิง ไม่ได้รับประกันผลรางวัล กรุณาตรวจสอบจากแหล่งข้อมูลทางการเสมอ"
              : "The information in this article is for reference only and does not guarantee results. Please always verify from official sources."}
          </p>
        </div>
      </article>

      {/* Related News */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          {t.news.relatedNews}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((news) => (
            <Link
              key={news.slug}
              href={`/news/${news.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-navy-800 transition-all hover:border-gold-500/50 dark:hover:border-gold-500/20 shadow-sm"
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
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-300 line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TipTapRenderer({ node }: { node: any }) {
  if (!node) return null;

  if (node.type === "text") {
    let el = <>{node.text}</>;
    if (node.marks) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node.marks.forEach((mark: any) => {
        if (mark.type === "bold") el = <strong key="bold">{el}</strong>;
        if (mark.type === "italic") el = <em key="italic">{el}</em>;
        if (mark.type === "underline") el = <u key="underline">{el}</u>;
        if (mark.type === "strike") el = <s key="strike">{el}</s>;
        if (mark.type === "link")
          el = (
            <a
              key="link"
              href={mark.attrs.href}
              target={mark.attrs.target}
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 underline"
            >
              {el}
            </a>
          );
      });
    }
    return el;
  }

  const renderChildren = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (node.content || []).map((child: any, idx: number) => (
      <TipTapRenderer key={idx} node={child} />
    ));
  };

  switch (node.type) {
    case "doc":
      return <>{renderChildren()}</>;
    case "paragraph":
      return (
        <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
          {renderChildren()}
        </p>
      );
    case "heading":
      const level = node.attrs?.level || 2;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Tag = `h${level}` as any;
      const sizeClasses: Record<number, string> = {
        1: "text-3xl sm:text-4xl",
        2: "text-2xl sm:text-3xl",
        3: "text-xl sm:text-2xl",
        4: "text-lg sm:text-xl",
        5: "text-base sm:text-lg",
        6: "text-base",
      };
      return (
        <Tag
          className={`mb-4 mt-8 font-bold text-gray-900 dark:text-white ${sizeClasses[level] || sizeClasses[2]}`}
        >
          {renderChildren()}
        </Tag>
      );
    case "bulletList":
      return (
        <ul className="mb-6 ml-6 list-disc text-gray-700 dark:text-gray-300 space-y-2">
          {renderChildren()}
        </ul>
      );
    case "orderedList":
      return (
        <ol className="mb-6 ml-6 list-decimal text-gray-700 dark:text-gray-300 space-y-2">
          {renderChildren()}
        </ol>
      );
    case "listItem":
      return <li>{renderChildren()}</li>;
    case "image":
      return (
        <div className="my-6 relative w-full h-auto overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={node.attrs?.src}
            alt={node.attrs?.alt || ""}
            className="w-full h-auto object-cover"
          />
          {node.attrs?.title && (
            <p className="mt-2 text-center text-sm text-gray-400">
              {node.attrs.title}
            </p>
          )}
        </div>
      );
    case "blockquote":
      return (
        <blockquote className="border-l-4 border-gold-500 bg-gray-50 dark:bg-navy-800/50 p-4 my-6 italic text-gray-700 dark:text-gray-300 rounded-r-lg">
          {renderChildren()}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre className="my-6 rounded-lg bg-navy-900 p-4 text-sm text-gray-100 overflow-x-auto whitespace-pre-wrap font-mono">
          <code>{renderChildren()}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr className="my-8 border-gray-200 dark:border-white/10" />;
    case "hardBreak":
      return <br />;
    default:
      return <>{renderChildren()}</>;
  }
}
