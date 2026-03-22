import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/services/lotteryResultService', () => ({
  apiClient: { getGlobalResults: vi.fn() },
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response('Error', { status: 500 })),
}));

import { GET } from '@/app/api/results/global/route';
import { apiClient } from '@/lib/services/lotteryResultService';

describe('GET /api/results/global', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns global results with default params', async () => {
    (apiClient.getGlobalResults as any).mockResolvedValue({
      draws: [{ id: 1, type: 'TH', date: '2026-03-01' }],
      total: 1,
      page: 1,
      totalPages: 1,
    });
    const req = new NextRequest('http://localhost/api/results/global');
    const res = await GET(req);
    const data = await res.json();
    expect(data.draws).toHaveLength(1);
  });

  it('passes query params to service', async () => {
    (apiClient.getGlobalResults as any).mockResolvedValue({ draws: [], total: 0, page: 1, totalPages: 0 });
    const req = new NextRequest('http://localhost/api/results/global?page=2&limit=5&country=th');
    await GET(req);
    expect(apiClient.getGlobalResults).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      country: 'th',
      period: undefined,
      date: undefined,
    });
  });

  it('returns 400 for invalid params', async () => {
    const req = new NextRequest('http://localhost/api/results/global?page=-1');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });
});
