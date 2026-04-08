import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/services/lotteryResultService', () => ({
  apiClient: {
    getGlobalResults: vi.fn(),
    getResultsByType: vi.fn(),
  },
}));
vi.mock('@/lib/utils/countryResolver', () => ({
  resolveCountryCode: vi.fn(),
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response(JSON.stringify({ error: 'error' }), { status: 500 })),
}));

import { GET } from '@/app/api/results/[type]/[date]/route';
import { apiClient } from '@/lib/services/lotteryResultService';
import { resolveCountryCode } from '@/lib/utils/countryResolver';

function mockRequest(url: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { nextUrl: new URL(url, 'http://localhost:3001') } as any;
}

describe('GET /api/results/[type]/[date]', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns result for valid type and date', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resolveCountryCode as any).mockResolvedValue('th');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getGlobalResults as any).mockResolvedValue({
      draws: [{
        drawDate: '2026-03-01',
        drawNo: '1',
        data: { prizes: [] },
      }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getResultsByType as any).mockResolvedValue({
      history: [{ id: 1 }],
    });

    const response = await GET(
      mockRequest('http://localhost:3001/api/results/th/2026-03-01'),
      { params: Promise.resolve({ type: 'th', date: '2026-03-01' }) }
    );
    const body = await response.json();

    expect(body.latest.dateDisplay).toBe('2026-03-01');
    expect(body.history).toHaveLength(1);
  });

  it('returns 400 for unsupported country code', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resolveCountryCode as any).mockResolvedValue(null);

    const response = await GET(
      mockRequest('http://localhost:3001/api/results/xyz/2026-03-01'),
      { params: Promise.resolve({ type: 'xyz', date: '2026-03-01' }) }
    );
    expect(response.status).toBe(400);
  });

  it('returns 404 when no result found for date', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resolveCountryCode as any).mockResolvedValue('th');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getGlobalResults as any).mockResolvedValue({ draws: [] });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getResultsByType as any).mockResolvedValue({ history: [] });

    const response = await GET(
      mockRequest('http://localhost:3001/api/results/th/2099-01-01'),
      { params: Promise.resolve({ type: 'th', date: '2099-01-01' }) }
    );
    expect(response.status).toBe(404);
  });

  it('handles history fetch failure gracefully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resolveCountryCode as any).mockResolvedValue('th');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getGlobalResults as any).mockResolvedValue({
      draws: [{ drawDate: '2026-03-01', drawNo: '1', data: {} }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getResultsByType as any).mockRejectedValue(new Error('fail'));

    const response = await GET(
      mockRequest('http://localhost:3001/api/results/th/2026-03-01'),
      { params: Promise.resolve({ type: 'th', date: '2026-03-01' }) }
    );
    const body = await response.json();

    // Should still return successfully with empty history
    expect(body.latest).toBeDefined();
    expect(body.history).toEqual([]);
  });

  it('handles service errors', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resolveCountryCode as any).mockResolvedValue('th');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getGlobalResults as any).mockRejectedValue(new Error('DB Error'));
    await GET(
      mockRequest('http://localhost:3001/api/results/th/2026-03-01'),
      { params: Promise.resolve({ type: 'th', date: '2026-03-01' }) }
    );
    const { handleApiError } = await import('@/lib/utils/apiErrorHandler');
    expect(handleApiError).toHaveBeenCalled();
  });
});
