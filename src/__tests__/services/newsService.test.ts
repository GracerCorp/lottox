import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    articles: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    article_analytics_daily: {
      upsert: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { newsService } from '../../lib/services/newsService';
import { prisma } from '../../lib/prisma';

describe('newsService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getNews', () => {
    it('returns paginated articles', async () => {
      (prisma.$transaction as any).mockResolvedValue([1, [{
        slug: 'test-news',
        title: 'Test Article',
        excerpt: 'Summary',
        content: '{"titleEn":"Test EN","excerptEn":"Summary EN","categoryEn":"Tips"}',
        cover_image: '/img.jpg',
        images: [],
        tags: ['lottery'],
        published_at: new Date('2026-03-01'),
        created_at: new Date('2026-03-01'),
      }]]);

      const result = await newsService.getNews({ page: 1, limit: 10 });
      expect(result.articles).toHaveLength(1);
      expect(result.articles[0].titleEn).toBe('Test EN');
      expect(result.articles[0].excerptEn).toBe('Summary EN');
      expect(result.articles[0].categoryEn).toBe('Tips');
    });

    it('handles unparseable content gracefully', async () => {
      (prisma.$transaction as any).mockResolvedValue([1, [{
        slug: 'bad',
        title: 'Bad',
        excerpt: '',
        content: 'not-json',
        cover_image: null,
        images: ['/fallback.jpg'],
        tags: [],
        published_at: null,
        created_at: new Date('2026-01-01'),
      }]]);

      const result = await newsService.getNews();
      expect(result.articles[0].image).toBe('/fallback.jpg');
      expect(result.articles[0].titleEn).toBe('Bad');
    });

    it('filters by category', async () => {
      (prisma.$transaction as any).mockResolvedValue([0, []]);
      await newsService.getNews({ category: 'tips' });
      // Should not crash
    });

    it('filters by search', async () => {
      (prisma.$transaction as any).mockResolvedValue([0, []]);
      await newsService.getNews({ search: 'lottery' });
      // Should not crash
    });

    it('handles content as object (not string)', async () => {
      (prisma.$transaction as any).mockResolvedValue([1, [{
        slug: 'obj',
        title: 'Obj',
        excerpt: 'Exc',
        content: { titleEn: 'Object EN' },
        cover_image: '/img.jpg',
        images: [],
        tags: ['news'],
        published_at: new Date(),
        created_at: new Date(),
      }]]);

      const result = await newsService.getNews();
      expect(result.articles[0].titleEn).toBe('Object EN');
    });
  });

  describe('getNewsDetail', () => {
    it('returns article detail', async () => {
      (prisma.articles.findUnique as any).mockResolvedValue({
        slug: 'test',
        title: 'Test',
        excerpt: 'Exc',
        content: '{"titleEn":"EN Title","contentEn":"EN Content","source":"External"}',
        raw_html: '<p>HTML</p>',
        full_content: 'Full content',
        cover_image: '/img.jpg',
        images: [],
        tags: ['lottery'],
        published_at: new Date('2026-03-01'),
        created_at: new Date('2026-03-01'),
        user: { name: 'John' },
      });

      const result = await newsService.getNewsDetail('test');
      expect(result.title).toBe('Test');
      expect(result.titleEn).toBe('EN Title');
      expect(result.author).toBe('John');
      expect(result.source).toBe('External');
    });

    it('throws when article not found', async () => {
      (prisma.articles.findUnique as any).mockResolvedValue(null);
      await expect(newsService.getNewsDetail('nonexistent')).rejects.toThrow('Article not found');
    });

    it('handles unparseable content in detail', async () => {
      (prisma.articles.findUnique as any).mockResolvedValue({
        slug: 'bad',
        title: 'Bad',
        excerpt: '',
        content: 'not-json',
        raw_html: '<p>HTML</p>',
        full_content: '',
        cover_image: null,
        images: ['/img.jpg'],
        tags: ['news'],
        published_at: null,
        created_at: new Date(),
        user: null,
      });

      const result = await newsService.getNewsDetail('bad');
      expect(result.author).toBe('Admin');
      expect(result.image).toBe('/img.jpg');
    });
  });

  describe('trackAnalytics', () => {
    it('tracks views and share clicks', async () => {
      (prisma.articles.findUnique as any).mockResolvedValue({ id: 1, view_count: 10, shares_count: 5 });
      (prisma.articles.update as any).mockResolvedValue({});
      (prisma.article_analytics_daily.upsert as any).mockResolvedValue({});

      await newsService.trackAnalytics('test', { views: 1, shareClick: true });
      expect(prisma.articles.update).toHaveBeenCalled();
      expect(prisma.article_analytics_daily.upsert).toHaveBeenCalled();
    });

    it('throws when article not found', async () => {
      (prisma.articles.findUnique as any).mockResolvedValue(null);
      await expect(newsService.trackAnalytics('missing', { views: 1 }))
        .rejects.toThrow('Article not found');
    });

    it('skips articles.update when no views or shares', async () => {
      (prisma.articles.findUnique as any).mockResolvedValue({ id: 1, view_count: 0, shares_count: 0 });
      (prisma.article_analytics_daily.upsert as any).mockResolvedValue({});

      await newsService.trackAnalytics('test', { activeSeconds: 30 });
      expect(prisma.articles.update).not.toHaveBeenCalled();
    });
  });
});
