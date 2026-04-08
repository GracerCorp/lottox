import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    lotteries: { findMany: vi.fn() },
  },
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response('Error', { status: 500 })),
}));

import { GET } from '@/app/api/results/upcoming/route';
import { prisma } from '@/lib/prisma';

describe('GET /api/results/upcoming', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns upcoming draws', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma.lotteries.findMany as any).mockResolvedValue([
      { name: 'Thai Lottery', countries: { code: 'TH', name: 'Thailand' } },
    ]);
    const req = new NextRequest('http://localhost/api/results/upcoming');
    const res = await GET(req);
    const data = await res.json();
    expect(data.upcoming).toHaveLength(1);
    expect(data.upcoming[0].name).toBe('Thai Lottery');
    expect(data.upcoming[0].countryCode).toBe('th');
    expect(data.upcoming[0].nextDrawAt).toBeTruthy();
  });

  it('respects limit param', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma.lotteries.findMany as any).mockResolvedValue([]);
    const req = new NextRequest('http://localhost/api/results/upcoming?limit=5');
    await GET(req);
    expect(prisma.lotteries.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    );
  });

  it('returns 400 for invalid limit', async () => {
    const req = new NextRequest('http://localhost/api/results/upcoming?limit=999');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });
});
