import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    countries: { findMany: vi.fn(), findFirst: vi.fn() },
    lottery_results: { findMany: vi.fn() },
  },
}));

import { countryService } from '../../lib/services/countryService';
import { prisma } from '../../lib/prisma';

describe('countryService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getCountries', () => {
    it('returns list of active countries', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.countries.findMany as any).mockResolvedValue([
        { code: 'th', name: 'Thailand', _count: { lotteries: 2 } },
        { code: 'la', name: 'Laos', _count: { lotteries: 1 } },
      ]);

      const result = await countryService.getCountries();
      expect(result.countries).toHaveLength(2);
      expect(result.countries[0].code).toBe('th');
    });

    it('returns empty array when none active', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.countries.findMany as any).mockResolvedValue([]);
      const result = await countryService.getCountries();
      expect(result.countries).toHaveLength(0);
    });
  });

  describe('getCountryDraws', () => {
    it('returns country info and draws', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.countries.findFirst as any).mockResolvedValue({
        code: 'th',
        name: 'Thailand',
        lotteries: [
          {
            id: 1,
            name: 'Thai Lottery',
            lottery_results: [
              {
                id: 10,
                full_data: { prizes: [] },
                result_verifications_result_verifications_lottery_result_idTolottery_results: [
                  { chosen_data: { prizes: [{ prizeName: 'First', winningNumbers: ['123456'] }] } },
                ],
              },
            ],
          },
        ],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.lottery_results.findMany as any).mockResolvedValue([
        {
          id: 10,
          draw_date: '2026-03-01',
          full_data: { prizes: [] },
          lottery: { name: 'Thai Lottery' },
          result_verifications_result_verifications_lottery_result_idTolottery_results: [
            { chosen_data: { prizes: [{ prizeName: 'First', winningNumbers: ['123456'] }] } },
          ],
        },
      ]);

      const result = await countryService.getCountryDraws('th');
      expect(result.country.code).toBe('th');
      expect(result.draws).toHaveLength(1);
      // Verify chosen_data maps to full_data
      expect(result.draws[0].full_data).toEqual({ prizes: [{ prizeName: 'First', winningNumbers: ['123456'] }] });
    });

    it('throws when country not found', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.countries.findFirst as any).mockResolvedValue(null);
      await expect(countryService.getCountryDraws('zz')).rejects.toThrow('Country not found');
    });

    it('falls back to full_data when no verification', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.countries.findFirst as any).mockResolvedValue({
        code: 'la',
        name: 'Laos',
        lotteries: [
          {
            id: 2,
            name: 'Lao Lottery',
            lottery_results: [
              {
                id: 20,
                full_data: { prizeResult: { last4Prize: '1234' } },
                result_verifications_result_verifications_lottery_result_idTolottery_results: [],
              },
            ],
          },
        ],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.lottery_results.findMany as any).mockResolvedValue([
        {
          id: 20,
          draw_date: '2026-03-01',
          full_data: { prizeResult: { last4Prize: '1234' } },
          lottery: { name: 'Lao Lottery' },
          result_verifications_result_verifications_lottery_result_idTolottery_results: [],
        },
      ]);

      const result = await countryService.getCountryDraws('la');
      expect(result.draws[0].full_data).toEqual({ prizeResult: { last4Prize: '1234' } });
    });
  });
});
