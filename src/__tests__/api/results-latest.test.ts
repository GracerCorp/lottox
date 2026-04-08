import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock modules before imports
vi.mock('@/lib/services/lotteryResultService', () => ({
  apiClient: { getLatestResults: vi.fn() },
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })),
}));

import { GET } from '@/app/api/results/latest/route';
import { apiClient } from '@/lib/services/lotteryResultService';

function mockRequest(url: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { nextUrl: new URL(url, 'http://localhost:3001') } as any;
}

describe('GET /api/results/latest', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns latest results successfully', async () => {
    const mockData = { results: [{ id: 1 }] };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getLatestResults as any).mockResolvedValue(mockData);

    const response = await GET(mockRequest('http://localhost:3001/api/results/latest'));
    const body = await response.json();

    expect(body).toEqual(mockData);
    expect(apiClient.getLatestResults).toHaveBeenCalledWith(undefined);
  });

  it('passes type param when provided', async () => {
    const mockData = { results: [] };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getLatestResults as any).mockResolvedValue(mockData);

    await GET(mockRequest('http://localhost:3001/api/results/latest?type=THAI'));
    expect(apiClient.getLatestResults).toHaveBeenCalledWith('THAI');
  });

  it('returns 400 for invalid type', async () => {
    const response = await GET(mockRequest('http://localhost:3001/api/results/latest?type=INVALID'));
    expect(response.status).toBe(400);
  });

  it('handles service errors', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.getLatestResults as any).mockRejectedValue(new Error('DB Error'));
    await GET(mockRequest('http://localhost:3001/api/results/latest'));
    const { handleApiError } = await import('@/lib/utils/apiErrorHandler');
    expect(handleApiError).toHaveBeenCalled();
  });
});
