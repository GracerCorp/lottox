import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    lottery_results: { findMany: vi.fn(), count: vi.fn() },
    lotteries: { count: vi.fn() },
    countries: { count: vi.fn() },
  },
}));
vi.mock('@/lib/utils/countryResolver', () => ({
  resolveCountryCode: vi.fn((slug) => (slug === 'thai-lottery' ? 'th' : null)),
}));

import { statisticsService } from '../../lib/services/statisticsService';
import { prisma } from '../../lib/prisma';
import { resolveCountryCode } from '@/lib/utils/countryResolver';

describe('statisticsService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getStatsOverview', () => {
    it('returns overview stats from transaction', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.$transaction as any).mockResolvedValue([1000, 50, 20]);
      
      const result = await statisticsService.getStatsOverview();
      expect(result.totalJackpotsTracked).toBe('1000');
      expect(result.activeLotteries).toBe(50);
      expect(result.totalCountries).toBe(20);
    });
  });

  describe('getStatsFrequency', () => {
    it('processes country specific frequency', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.lottery_results.findMany as any).mockResolvedValue([
        {
          full_data: null,
          draw_date: '2026-03-01',
          result_verifications_result_verifications_lottery_result_idTolottery_results: [
            { chosen_data: { prizes: [{ name: 'first', number: '123456' }] } }
          ],
        },
        {
          full_data: { number: '654321' },
          draw_date: '2026-02-15',
          result_verifications_result_verifications_lottery_result_idTolottery_results: [],
        },
      ]);

      const result = await statisticsService.getStatsFrequency('thai-lottery', 2);
      expect(resolveCountryCode).toHaveBeenCalledWith('thai-lottery');
      expect(result.type).toBe('thai-lottery');
      expect(result.draws).toBe(2);
      
      // '123456' ends in '56'
      // '654321' ends in '21'
      expect(result.frequency['56']).toBe(1);
      expect(result.frequency['21']).toBe(1);
      expect(result.trends['56']).toBe(1);
    });

    it('processes raw frequency across all draws', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.lottery_results.findMany as any).mockResolvedValue([
        {
          full_data: ['999999', '111111'],
          draw_date: '2026-03-01',
          result_verifications_result_verifications_lottery_result_idTolottery_results: [],
        },
      ]);

      const result = await statisticsService.getStatsFrequency('frequency', 1);
      
      expect(resolveCountryCode).not.toHaveBeenCalled();
      expect(result.frequency['99']).toBe(1);
      expect(result.frequency['11']).toBe(1);
    });
  });
});
