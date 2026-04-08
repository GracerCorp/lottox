import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

/** Shape of the JSON stored in articles.content */
interface ArticleContentData {
  titleEn?: string;
  excerptEn?: string;
  categoryEn?: string;
  contentEn?: string;
  source?: string;
  [key: string]: unknown;
}

export const newsService = {
  async getNews(
    params: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
    } = {},
  ) {
    const { page = 1, limit = 10, category, search } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.articlesWhereInput = {
      published: true,
    };

    if (category) {
      where.tags = {
        has: category,
      };
    }

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [total, rawArticles] = await prisma.$transaction([
      prisma.articles.count({ where }),
      prisma.articles.findMany({
        where,
        orderBy: { published_at: "desc" },
        take: limit,
        skip: offset,
      }),
    ]);

    const mappedArticles = rawArticles.map((article) => {
      let contentData: ArticleContentData = {};
      if (typeof article.content === "string") {
        try {
          contentData = JSON.parse(article.content);
        } catch (_e) {
          console.warn(`[getNews] Failed to parse content for article ${article.slug}`);
          contentData = {};
        }
      } else if (article.content) {
        contentData = article.content as ArticleContentData;
      }

      return {
        slug: article.slug,
        title: article.title,
        titleEn: contentData.titleEn || article.title,
        excerpt: article.excerpt || "",
        excerptEn: contentData.excerptEn || article.excerpt || "",
        image:
          article.cover_image ||
          (article.images && article.images.length > 0
            ? article.images[0]
            : ""),
        date:
          article.published_at?.toISOString() ||
          article.created_at?.toISOString() ||
          "",
        category:
          article.tags && article.tags.length > 0 ? article.tags[0] : "",
        categoryEn:
          contentData.categoryEn ||
          (article.tags && article.tags.length > 0 ? article.tags[0] : ""),
        author: "Admin",
      };
    });

    return {
      articles: mappedArticles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getNewsDetail(
    slug: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lang?: string,
  ) {
    const article = await prisma.articles.findUnique({
      where: { slug },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    if (!article) {
      throw new Error("Article not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contentData: Record<string, any> = {};
    if (typeof article.content === "string") {
      try {
        contentData = JSON.parse(article.content);
      } catch (_e) {
        console.warn(`[getNewsDetail] Failed to parse content for article ${article.slug}`);
        contentData = {};
      }
    } else if (article.content) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contentData = article.content as Record<string, any>;
    }

    return {
      slug: article.slug,
      title: article.title,
      titleEn: contentData.titleEn || article.title,
      content: article.raw_html || article.full_content || "",
      contentEn:
        contentData.contentEn || article.raw_html || article.full_content || "",
      excerpt: article.excerpt || "",
      excerptEn: contentData.excerptEn || article.excerpt || "",
      image:
        article.cover_image ||
        (article.images.length > 0 ? article.images[0] : ""),
      date:
        article.published_at?.toISOString() ||
        article.created_at?.toISOString() ||
        "",
      category: article.tags.length > 0 ? article.tags[0] : "",
      categoryEn:
        contentData.categoryEn ||
        (article.tags.length > 0 ? article.tags[0] : ""),
      author: article.user?.name || "Admin",
      source: contentData.source || "LottoX",
      related: [],
    };
  },

  async trackAnalytics(
    slug: string,
    data: {
      views?: number;
      activeSeconds?: number;
      scrollCompletes?: number;
      bounceRate?: number;
      shareClick?: boolean;
    }
  ) {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Look up the article first because we need the ID
    const article = await prisma.articles.findUnique({
      where: { slug },
      select: { id: true, view_count: true, shares_count: true },
    });

    if (!article) {
      throw new Error("Article not found");
    }

    const updates: Prisma.articlesUpdateInput = {};

    if (data.views) {
      updates.view_count = { increment: data.views };
    }

    if (data.shareClick) {
      updates.shares_count = { increment: 1 };
    }

    if (Object.keys(updates).length > 0) {
      await prisma.articles.update({
        where: { id: article.id },
        data: updates,
      });
    }

    // Upsert into daily analytics
    await prisma.article_analytics_daily.upsert({
      where: {
        article_id_date: {
          article_id: article.id,
          date: today,
        },
      },
      create: {
        article_id: article.id,
        date: today,
        views: data.views || 0,
        avg_active_seconds: data.activeSeconds || 0,
        scroll_completes: data.scrollCompletes || 0,
        bounce_count: data.bounceRate ? 1 : 0,
      },
      update: {
        views: { increment: data.views || 0 },
        avg_active_seconds: { increment: data.activeSeconds || 0 },
        scroll_completes: { increment: data.scrollCompletes || 0 },
        bounce_count: { increment: data.bounceRate ? 1 : 0 },
        updated_at: new Date(),
      },
    });
  },
};
