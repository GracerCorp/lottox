import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/services/lotteryResultService', () => ({
  apiClient: { getResultsByType: vi.fn() },
}));
vi.mock('@/lib/utils/countryResolver', () => ({
  resolveCountryCode: vi.fn(),
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response(JSON.stringify({ error: 'error' }), { status: 500 })),
}));

import { GET } from '@/app/api/results/[type]/route';
import { apiClient } from '@/lib/services/lotteryResultService';
import { resolveCountryCode } from '@/lib/utils/countryResolver';

function mockRequest(url: string) {
  return { nextUrl: new URL(url, 'http://localhost:3001') } as any;
}

describe('GET /api/results/[type]', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns results by type successfully', async () => {
    (resolveCountryCode as any).mockResolvedValue('th');
    const mockData = { results: [{ id: 1 }], total: 1 };
    (apiClient.getResultsByType as any).mockResolvedValue(mockData);

    const response = await GET(
      mockRequest('http://localhost:3001/api/results/th'),
      { params: Promise.resolve({ type: 'th' }) }
    );
    const body = await response.json();

    expect(body).toEqual(mockData);
    expect(apiClient.getResultsByType).toHaveBeenCalledWith('th', 10, 0);
  });

  it('returns 400 for unsupported type', async () => {
    (resolveCountryCode as any).mockResolvedValue(null);

    const response = await GET(
      mockRequest('http://localhost:3001/api/results/xyz'),
      { params: Promise.resolve({ type: 'xyz' }) }
    );
    expect(response.status).toBe(400);
  });

  it('passes pagination params', async () => {
    (resolveCountryCode as any).mockResolvedValue('th');
    (apiClient.getResultsByType as any).mockResolvedValue({ results: [] });

    await GET(
      mockRequest('http://localhost:3001/api/results/th?limit=5&page=3'),
      { params: Promise.resolve({ type: 'th' }) }
    );
    expect(apiClient.getResultsByType).toHaveBeenCalledWith('th', 5, 10); // offset = (3-1)*5
  });

  it('handles service errors', async () => {
    (resolveCountryCode as any).mockResolvedValue('th');
    (apiClient.getResultsByType as any).mockRejectedValue(new Error('fail'));
    await GET(
      mockRequest('http://localhost:3001/api/results/th'),
      { params: Promise.resolve({ type: 'th' }) }
    );
    const { handleApiError } = await import('@/lib/utils/apiErrorHandler');
    expect(handleApiError).toHaveBeenCalled();
  });
});
