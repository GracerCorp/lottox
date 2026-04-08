import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    banners: { findMany: vi.fn() },
  },
}));

import { getActiveBanners } from '../../lib/services/bannerService';
import { prisma } from '@/lib/prisma';

describe('bannerService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns active banners', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma.banners.findMany as any).mockResolvedValue([
      {
        id: 1,
        image_url: '/banner.jpg',
        lottery_results: {
          lottery: {
            name: 'Thai Lottery',
            countries: { name: 'Thailand', code: 'th', draw_schedule: 'Every 1st & 16th' },
          },
        },
      },
    ]);

    const result = await getActiveBanners();
    expect(result).toHaveLength(1);
    expect(result[0].image_url).toBe('/banner.jpg');
  });

  it('returns empty when no banners', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma.banners.findMany as any).mockResolvedValue([]);
    const result = await getActiveBanners();
    expect(result).toHaveLength(0);
  });
});
