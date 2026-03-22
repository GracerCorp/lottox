import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    countries: { findMany: vi.fn(), findFirst: vi.fn() },
    lotteries: { findMany: vi.fn() },
  },
}));
vi.mock('@/lib/utils/lotteryUtils', () => ({
  slugify: (s: string) => s.toLowerCase().replace(/\s+/g, '-'),
}));

import { getActiveCountries, getLotteriesByCountry, getLotteryBySlug, getLotteryCardData } from '../../lib/services/lotteryService';
import { prisma } from '@/lib/prisma';

describe('lotteryService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getActiveCountries', () => {
    it('returns active countries with lotteries', async () => {
      (prisma.countries.findMany as any).mockResolvedValue([
        { code: 'th', name: 'Thailand', lotteries: [{ id: 1, name: 'Thai Lottery' }] },
      ]);
      const result = await getActiveCountries();
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('th');
    });
  });

  describe('getLotteriesByCountry', () => {
    it('returns country with lotteries', async () => {
      (prisma.countries.findFirst as any).mockResolvedValue({
        code: 'th', name: 'Thailand', lotteries: [{ id: 1, name: 'Thai Lottery' }],
      });
      const result = await getLotteriesByCountry('th');
      expect(result?.code).toBe('th');
    });

    it('returns null when country not found', async () => {
      (prisma.countries.findFirst as any).mockResolvedValue(null);
      const result = await getLotteriesByCountry('zz');
      expect(result).toBeNull();
    });
  });

  describe('getLotteryBySlug', () => {
    it('finds lottery by slug', async () => {
      (prisma.countries.findFirst as any).mockResolvedValue({
        code: 'th', lotteries: [{ id: 1, name: 'Thai Lottery', is_active: true }],
      });
      const result = await getLotteryBySlug('th', 'thai-lottery');
      expect(result?.lottery.name).toBe('Thai Lottery');
      expect(result?.apiType).toBe('th');
    });

    it('returns null when country not found', async () => {
      (prisma.countries.findFirst as any).mockResolvedValue(null);
      const result = await getLotteryBySlug('zz', 'test');
      expect(result).toBeNull();
    });

    it('returns null when slug not found', async () => {
      (prisma.countries.findFirst as any).mockResolvedValue({
        code: 'th', lotteries: [{ id: 1, name: 'Thai Lottery' }],
      });
      const result = await getLotteryBySlug('th', 'nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getLotteryCardData', () => {
    it('returns lottery card data with prizes', async () => {
      (prisma.lotteries.findMany as any).mockResolvedValue([
        {
          id: 1,
          name: 'Thai Lottery',
          currency: 'THB',
          is_active: true,
          logo: '/logo.png',
          countries: { code: 'th', name: 'Thailand', flag: '/th.svg', bg_image: null },
          lottery_jobs: [],
          lottery_results: [{
            full_data: {
              prizes: [
                { prizeName: 'First Prize', prizeAmount: '6000000' },
                { prizeName: 'Second Prize', prizeAmount: '200000' },
              ],
            },
            result_verifications_result_verifications_lottery_result_idTolottery_results: [],
          }],
        },
      ]);

      const result = await getLotteryCardData('th');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Thai Lottery');
      expect(result[0].prizes).toHaveLength(2);
      expect(result[0].prizes[0].amount).toContain('6000000');
      expect(result[0].href).toBe('/th/thai-lottery');
    });

    it('uses verified chosen_data over full_data', async () => {
      (prisma.lotteries.findMany as any).mockResolvedValue([
        {
          id: 1,
          name: 'Test Lottery',
          currency: null,
          is_active: true,
          logo: null,
          countries: { code: 'th', name: 'Thailand', flag: null, bg_image: null },
          lottery_jobs: [],
          lottery_results: [{
            full_data: { prizes: [{ prizeName: 'Old', prizeAmount: '100' }] },
            result_verifications_result_verifications_lottery_result_idTolottery_results: [
              { chosen_data: { prizes: [{ prizeName: 'Verified', prizeAmount: '999' }] } },
            ],
          }],
        },
      ]);

      const result = await getLotteryCardData('th');
      expect(result[0].prizes[0].label).toBe('Verified');
    });

    it('returns empty prizes when no results', async () => {
      (prisma.lotteries.findMany as any).mockResolvedValue([
        {
          id: 1,
          name: 'Empty Lottery',
          currency: null,
          is_active: true,
          logo: null,
          countries: { code: 'th', name: 'Thailand', flag: null, bg_image: null },
          lottery_jobs: [],
          lottery_results: [],
        },
      ]);

      const result = await getLotteryCardData('th');
      expect(result[0].prizes).toHaveLength(0);
    });
  });
});
