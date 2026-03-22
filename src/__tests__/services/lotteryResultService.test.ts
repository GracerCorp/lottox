import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock prisma before importing the service
vi.mock('@/lib/prisma', () => ({
  prisma: {
    lottery_results: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    lotteries: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    countries: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
    },
    articles: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('@/lib/utils/countryResolver', () => ({
  resolveCountryCode: vi.fn(),
  getDisplayType: vi.fn((code: string) => code.toUpperCase()),
}));

import { apiClient, apiResponse, apiError } from '../../lib/services/lotteryResultService';
import { prisma } from '@/lib/prisma';
import { resolveCountryCode } from '@/lib/utils/countryResolver';

describe('lotteryResultService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  const mockResult = {
    id: 1,
    draw_date: '2026-03-01',
    draw_period: 'D001',
    full_data: { prizes: [{ prizeName: 'First', winningNumbers: ['123456'], prizeAmount: 6000000 }] },
    lottery: { name: 'Thai Lottery', showing_prizes: ['prize_1'], countries: { code: 'TH' } },
    result_verifications_result_verifications_lottery_result_idTolottery_results: [
      { chosen_data: { prizes: [{ prizeName: 'First', winningNumbers: ['123456'], prizeAmount: 6000000 }] } },
    ],
  };

  describe('getLatestResults', () => {
    it('returns latest results without type filter', async () => {
      (prisma.lottery_results.findMany as any).mockResolvedValue([mockResult]);

      const result = await apiClient.getLatestResults();
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
      expect(result.results[0].lotteryName).toBe('Thai Lottery');
    });

    it('filters by type when provided', async () => {
      (resolveCountryCode as any).mockResolvedValue('th');
      (prisma.lottery_results.findMany as any).mockResolvedValue([mockResult]);

      const result = await apiClient.getLatestResults('THAI');
      expect(resolveCountryCode).toHaveBeenCalledWith('THAI');
      expect(result.results).toHaveLength(1);
    });
  });

  describe('getResultsByType', () => {
    it('returns results by type with pagination', async () => {
      (resolveCountryCode as any).mockResolvedValue('th');
      (prisma.$transaction as any).mockResolvedValue([5, [mockResult]]);

      const result = await apiClient.getResultsByType('th', 10, 0);
      expect(result.latest).toBeTruthy();
      expect(result.history).toHaveLength(1);
      expect(result.total).toBe(5);
    });

    it('returns null latest when no results', async () => {
      (resolveCountryCode as any).mockResolvedValue('th');
      (prisma.$transaction as any).mockResolvedValue([0, []]);

      const result = await apiClient.getResultsByType('th');
      expect(result.latest).toBeNull();
      expect(result.history).toHaveLength(0);
    });
  });

  describe('getGlobalResults', () => {
    it('returns global results with pagination', async () => {
      (prisma.$transaction as any).mockResolvedValue([20, [mockResult]]);

      const result = await apiClient.getGlobalResults({ page: 1, limit: 10 });
      expect(result.draws).toHaveLength(1);
      expect(result.total).toBe(20);
      expect(result.totalPages).toBe(2);
    });

    it('filters by country', async () => {
      (prisma.$transaction as any).mockResolvedValue([1, [mockResult]]);

      const result = await apiClient.getGlobalResults({ country: 'th' });
      expect(result.draws).toHaveLength(1);
    });

    it('filters by date and period', async () => {
      (prisma.$transaction as any).mockResolvedValue([1, [mockResult]]);

      const result = await apiClient.getGlobalResults({ date: '2026-03-01', period: 'D001' });
      expect(result.draws).toHaveLength(1);
    });
  });

  describe('checkNumber', () => {
    it('returns win=true when number matches prizes array', async () => {
      (resolveCountryCode as any).mockResolvedValue('th');
      (prisma.lotteries.findMany as any).mockResolvedValue([{ id: 1 }]);
      (prisma.lottery_results.findMany as any).mockResolvedValue([{
        id: 1,
        draw_date: '2026-03-01',
        draw_period: 'D001',
        lottery_id: 1,
        full_data: { prizes: [{ prizeName: 'First', winningNumbers: ['123456'], prizeAmount: 6000000 }] },
      }]);

      const result = await apiClient.checkNumber('123456', 'th');
      expect(result.win).toBe(true);
      expect(result.prizes).toHaveLength(1);
    });

    it('returns win=false when number does not match', async () => {
      (resolveCountryCode as any).mockResolvedValue('th');
      (prisma.lotteries.findMany as any).mockResolvedValue([{ id: 1 }]);
      (prisma.lottery_results.findMany as any).mockResolvedValue([{
        id: 1,
        draw_date: '2026-03-01',
        draw_period: 'D001',
        lottery_id: 1,
        full_data: { prizes: [{ prizeName: 'First', winningNumbers: ['123456'] }] },
      }]);

      const result = await apiClient.checkNumber('999999', 'th');
      expect(result.win).toBe(false);
    });

    it('returns win=false when no lotteries found', async () => {
      (resolveCountryCode as any).mockResolvedValue('th');
      (prisma.lotteries.findMany as any).mockResolvedValue([]);

      const result = await apiClient.checkNumber('123', 'th');
      expect(result.win).toBe(false);
    });

    it('handles prizeResult format (Lao)', async () => {
      (resolveCountryCode as any).mockResolvedValue('la');
      (prisma.lotteries.findMany as any).mockResolvedValue([{ id: 1 }]);
      (prisma.lottery_results.findMany as any).mockResolvedValue([{
        id: 1,
        draw_date: '2026-03-01',
        draw_period: '',
        lottery_id: 1,
        full_data: {
          prizeResult: {
            last4Prize: '1234',
            last3Prize1: '123',
            last3Prize2: '456',
            last2Prize: '12',
            devNumberSet: { json: ['111', '222'] },
          },
        },
      }]);

      const result = await apiClient.checkNumber('1234', 'la');
      expect(result.win).toBe(true);
    });

    it('handles generic traversal for unknown schemas', async () => {
      (resolveCountryCode as any).mockResolvedValue('vn');
      (prisma.lotteries.findMany as any).mockResolvedValue([{ id: 1 }]);
      (prisma.lottery_results.findMany as any).mockResolvedValue([{
        id: 1,
        draw_date: '2026-03-01',
        draw_period: '',
        lottery_id: 1,
        full_data: {
          customField: { nested: [{ number: '555' }] },
        },
      }]);

      const result = await apiClient.checkNumber('555', 'vn');
      expect(result.win).toBe(true);
    });
  });

  describe('getCountries', () => {
    it('returns active countries', async () => {
      (prisma.countries.findMany as any).mockResolvedValue([
        { code: 'th', name: 'Thailand', _count: { lotteries: 1 } },
      ]);
      const result = await apiClient.getCountries();
      expect(result.countries).toHaveLength(1);
    });
  });

  describe('getNews', () => {
    it('returns paginated articles', async () => {
      (prisma.$transaction as any).mockResolvedValue([1, [{
        slug: 'test',
        title: 'Test',
        excerpt: 'Excerpt',
        content: '{}',
        cover_image: '/img.jpg',
        images: [],
        tags: ['news'],
        published_at: new Date('2026-03-01'),
        created_at: new Date('2026-03-01'),
      }]]);

      const result = await apiClient.getNews({ page: 1, limit: 10 });
      expect(result.articles).toHaveLength(1);
      expect(result.articles[0].slug).toBe('test');
    });

    it('filters by category and search', async () => {
      (prisma.$transaction as any).mockResolvedValue([0, []]);
      await apiClient.getNews({ category: 'tips', search: 'lottery' });
      // Should not crash
    });
  });

  describe('getStatsOverview', () => {
    it('returns stats overview', async () => {
      (prisma.$transaction as any).mockResolvedValue([100, 5, 3]);
      const result = await apiClient.getStatsOverview();
      expect(result.totalJackpotsTracked).toBe('100');
      expect(result.activeLotteries).toBe(5);
      expect(result.totalCountries).toBe(3);
    });
  });

  describe('getStatsFrequency', () => {
    it('returns frequency placeholder', async () => {
      const result = await apiClient.getStatsFrequency('thai', 30);
      expect(result.type).toBe('thai');
      expect(result.draws).toBe(30);
    });
  });

  describe('apiResponse / apiError helpers', () => {
    it('creates success response', () => {
      const res = apiResponse({ ok: true });
      expect(res.status).toBe(200);
    });

    it('creates error response', () => {
      const res = apiError('Bad Request', 400);
      expect(res.status).toBe(400);
    });
  });
});
