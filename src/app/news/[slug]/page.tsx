import type { Metadata } from "next";
import { apiClient } from "@/lib/api-client";
import { getArticleBySlug } from "@/lib/newsData";
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

  // Try API first, fallback to local
  let title = "";
  let excerpt = "";
  let image = "";
  try {
    const article = await apiClient.getNewsDetail(slug, "th");
    title = article.title;
    excerpt = article.content?.slice(0, 160) || "";
    image = article.image;
  } catch {
    const local = getArticleBySlug(slug);
    if (local) {
      title = local.title;
      excerpt = local.excerpt;
      image = local.image;
    }
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

  // Try API first
  let articleData: any = null;
  try {
    articleData = await apiClient.getNewsDetail(slug, "th");
  } catch {
    // Fallback to local
    const local = getArticleBySlug(slug);
    if (local) {
      articleData = {
        slug: local.slug,
        title: local.title,
        titleEn: local.titleEn,
        content: local.content,
        contentEn: local.contentEn,
        image: local.image,
        date: local.date,
        category: local.category,
        categoryEn: local.categoryEn,
        author: local.author,
        source: local.source,
        excerpt: local.excerpt,
        excerptEn: local.excerptEn,
        isLocal: true,
      };
    }
  }

  if (!articleData) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd article={articleData} />
      <NewsArticleContent article={articleData} />
    </>
  );
}
