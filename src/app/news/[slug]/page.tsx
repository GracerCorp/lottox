import type { Metadata } from "next";
import { newsArticles, getArticleBySlug } from "@/lib/newsData";
import { notFound } from "next/navigation";
import NewsArticleContent from "./NewsArticleContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);
  if (!article) return {};

  return {
    title: `${article.title} | LOTTOX`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      locale: "th_TH",
      images: [{ url: article.image, width: 800, height: 400 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

function ArticleJsonLd({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug);
  if (!article) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: "2026-02-13",
    dateModified: "2026-02-13",
    author: {
      "@type": "Organization",
      name: article.author,
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
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd slug={resolvedParams.slug} />
      <NewsArticleContent article={article} />
    </>
  );
}
