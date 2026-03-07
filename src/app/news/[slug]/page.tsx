import type { Metadata } from "next";
import { apiClient } from "@/lib/services/lotteryResultService";
import { notFound } from "next/navigation";
import NewsArticleContent from "./NewsArticleContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Try API
  let title = "";
  let excerpt = "";
  let image = "";
  try {
    const article = await apiClient.getNewsDetail(slug, "th");
    title = article.title;
    excerpt = article.excerpt || article.content?.slice(0, 160) || "";
    image = article.image || "";
  } catch {
    return {};
  }

  if (!title) return {};

  return {
    title: `${title} | LOTTOX`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      locale: "th_TH",
      images: image ? [{ url: image, width: 800, height: 400 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: image ? [image] : [],
    },
  };
}

function ArticleJsonLd({
  article,
}: {
  article: {
    title: string;
    image: string;
    author: string;
    slug: string;
    date: string;
  };
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: article.author || "LOTTOX",
    },
    publisher: {
      "@type": "Organization",
      name: "LOTTOX",
      logo: {
        "@type": "ImageObject",
        url: "https://lottox.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lottox.com/news/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Try API
  let articleData: unknown = null;
  try {
    articleData = await apiClient.getNewsDetail(slug, "th");
  } catch {
    // Return 404 if API fails
    notFound();
  }

  if (!articleData) {
    notFound();
  }

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ArticleJsonLd article={articleData as any} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <NewsArticleContent article={articleData as any} />
    </>
  );
}
