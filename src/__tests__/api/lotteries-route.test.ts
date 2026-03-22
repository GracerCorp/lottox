import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/services/lotteryService', () => ({
  getActiveCountries: vi.fn(),
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response('Error', { status: 500 })),
}));

import { GET } from '@/app/api/lotteries/route';
import { getActiveCountries } from '@/lib/services/lotteryService';

describe('GET /api/lotteries', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns lotteries grouped by country', async () => {
    (getActiveCountries as any).mockResolvedValue([
      {
        code: 'th',
        name: 'Thailand',
        flag: '/th.svg',
        lotteries: [{ id: 1, name: 'Thai Lottery', logo: '/logo.png' }],
      },
    ]);

    const res = await GET();
    const data = await res.json();
    expect(data.countries).toHaveLength(1);
    expect(data.countries[0].lotteries[0].name).toBe('Thai Lottery');
  });

  it('handles errors', async () => {
    (getActiveCountries as any).mockRejectedValue(new Error('DB error'));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
