import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/services/statisticsService', () => ({
  statisticsService: {
    getStatsOverview: vi.fn(),
    getStatsFrequency: vi.fn(),
  },
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response(JSON.stringify({ error: 'error' }), { status: 500 })),
}));

import { GET } from '@/app/api/statistics/route';
import { statisticsService } from '@/lib/services/statisticsService';

function mockRequest(url: string) {
  return { nextUrl: new URL(url, 'http://localhost:3001') } as any;
}

describe('GET /api/statistics', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns overview stats by default', async () => {
    const mockData = { totalLotteries: 5 };
    (statisticsService.getStatsOverview as any).mockResolvedValue(mockData);

    const response = await GET(mockRequest('http://localhost:3001/api/statistics'));
    const body = await response.json();

    expect(body).toEqual(mockData);
    expect(statisticsService.getStatsOverview).toHaveBeenCalled();
  });

  it('returns frequency stats when type=frequency', async () => {
    const mockData = { frequencies: [] };
    (statisticsService.getStatsFrequency as any).mockResolvedValue(mockData);

    const response = await GET(mockRequest('http://localhost:3001/api/statistics?type=frequency&draws=50'));
    const body = await response.json();

    expect(body).toEqual(mockData);
    expect(statisticsService.getStatsFrequency).toHaveBeenCalledWith('frequency', 50);
  });

  it('returns frequency for country types', async () => {
    const mockData = { frequencies: [] };
    (statisticsService.getStatsFrequency as any).mockResolvedValue(mockData);

    await GET(mockRequest('http://localhost:3001/api/statistics?type=thai'));
    expect(statisticsService.getStatsFrequency).toHaveBeenCalledWith('thai', 30);
  });

  it('returns 400 for invalid type', async () => {
    const response = await GET(mockRequest('http://localhost:3001/api/statistics?type=invalid'));
    expect(response.status).toBe(400);
  });

  it('handles service errors', async () => {
    (statisticsService.getStatsOverview as any).mockRejectedValue(new Error('fail'));
    await GET(mockRequest('http://localhost:3001/api/statistics'));
    const { handleApiError } = await import('@/lib/utils/apiErrorHandler');
    expect(handleApiError).toHaveBeenCalled();
  });
});
