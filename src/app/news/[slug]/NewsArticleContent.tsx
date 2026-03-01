"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { NewsListResponse } from "@/lib/api-types";
import { newsArticles as fallbackNewsArticles } from "@/lib/newsData";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

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

/** Detect whether content string contains markdown syntax */
function hasMarkdownSyntax(text: string): boolean {
  const markdownPatterns = [
    /^#{1,6}\s/m, // headings
    /\*\*.+?\*\*/, // bold
    /\*.+?\*/, // italic
    /\[.+?\]\(.+?\)/, // links
    /^>\s/m, // blockquotes
    /^[-*+]\s/m, // unordered list
    /^\d+\.\s/m, // ordered list
    /```/, // code blocks
    /`[^`]+`/, // inline code
    /^---$/m, // horizontal rule
    /!\[.*?\]\(.+?\)/, // images
    /\|.+\|.+\|/, // tables
    /~~.+?~~/, // strikethrough
  ];
  return markdownPatterns.some((pattern) => pattern.test(text));
}

/** Custom components for react-markdown with styled classes */
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-6 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-3 mt-6 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="mb-2 mt-4 text-base font-bold text-gray-900 dark:text-white sm:text-lg">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="mb-2 mt-4 text-base font-semibold text-gray-900 dark:text-white">
      {children}
    </h6>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 ml-6 list-disc text-gray-700 dark:text-gray-300 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 ml-6 list-decimal text-gray-700 dark:text-gray-300 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-base leading-relaxed">{children}</li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold-500 hover:text-gold-400 underline transition-colors"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gold-500 bg-gray-50 dark:bg-navy-800/50 p-4 my-6 italic text-gray-700 dark:text-gray-300 rounded-r-lg">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-gray-100 dark:bg-navy-700 px-1.5 py-0.5 text-sm font-mono text-gold-600 dark:text-gold-400">
          {children}
        </code>
      );
    }
    return (
      <code
        className={`block overflow-x-auto rounded-lg bg-gray-100 dark:bg-navy-800 p-4 text-sm font-mono text-gray-800 dark:text-gray-200 ${className || ""}`}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-100 dark:bg-navy-800 p-4">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-white/10" />,
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900 dark:text-white">
      {children}
    </strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="line-through">{children}</del>,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50 dark:bg-navy-800 text-left font-semibold text-gray-900 dark:text-white">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    <span className="my-6 block relative w-full h-auto overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        className="w-full h-auto object-cover rounded-xl"
      />
    </span>
  ),
};

/** Render markdown content with styled components */
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}

/** Render plain text with basic line-based formatting */
function PlainTextRenderer({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((paragraph, i) => {
        if (paragraph.trim() === "") return null;
        // Lines starting with - as list items
        if (paragraph.trim().startsWith("- ")) {
          return (
            <div
              key={i}
              className="ml-4 flex items-start gap-2 py-1 text-base leading-relaxed text-gray-700 dark:text-gray-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-600 dark:bg-gold-400" />
              <span>{paragraph.trim().slice(2)}</span>
            </div>
          );
        }
        // Lines with number prefix as list items
        if (/^\d+\.\s/.test(paragraph.trim())) {
          return (
            <div
              key={i}
              className="ml-4 flex items-start gap-2 py-1 text-base leading-relaxed text-gray-700 dark:text-gray-300"
            >
              <span className="mt-0.5 shrink-0 text-gold-600 dark:text-gold-400 font-bold text-sm">
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
            className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg"
          >
            {paragraph.trim()}
          </p>
        );
      })}
    </>
  );
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
      .map((a) => {
        const fallback = fallbackNewsArticles.find((fa) => fa.slug === a.slug);
        return {
          slug: a.slug,
          title: a.title,
          image: a.image || fallback?.image || "",
          date: a.date,
        };
      });
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

  /** Determine content type and render accordingly */
  const renderContent = () => {
    // 1) Try TipTap JSON
    try {
      if (content.trim().startsWith("{") || content.trim().startsWith("[")) {
        const parsed = JSON.parse(content);
        if (parsed.type === "doc") {
          return <TipTapRenderer node={parsed} />;
        }
      }
    } catch {
      // Not JSON, continue
    }

    // 2) Markdown content
    if (hasMarkdownSyntax(content)) {
      return <MarkdownRenderer content={content} />;
    }

    // 3) Plain text fallback
    return <PlainTextRenderer content={content} />;
  };

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
        {(article.image ||
          fallbackNewsArticles.find((a) => a.slug === article.slug)?.image) && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80 md:h-96">
            <Image
              src={
                article.image ||
                fallbackNewsArticles.find((a) => a.slug === article.slug)
                  ?.image ||
                ""
              }
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
        <div className="prose-custom mb-12">{renderContent()}</div>

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
    case "heading": {
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
    }
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
    case "horizontalRule":
      return <hr className="my-8 border-gray-200 dark:border-white/10" />;
    case "hardBreak":
      return <br />;
    default:
      return <>{renderChildren()}</>;
  }
}
