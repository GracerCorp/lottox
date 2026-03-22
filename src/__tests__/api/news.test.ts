import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/services/newsService', () => ({
  newsService: { getNews: vi.fn(), getNewsDetail: vi.fn() },
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response(JSON.stringify({ error: 'error' }), { status: 500 })),
}));

import { GET } from '@/app/api/news/route';
import { newsService } from '@/lib/services/newsService';

function mockRequest(url: string) {
  return { nextUrl: new URL(url, 'http://localhost:3001') } as any;
}

describe('GET /api/news', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns news list successfully', async () => {
    const mockData = { articles: [{ title: 'Test' }], total: 1 };
    (newsService.getNews as any).mockResolvedValue(mockData);

    const response = await GET(mockRequest('http://localhost:3001/api/news'));
    const body = await response.json();

    expect(body).toEqual(mockData);
    expect(newsService.getNews).toHaveBeenCalledWith({
      page: 1, limit: 10, category: undefined, search: undefined,
    });
  });

  it('passes query params correctly', async () => {
    (newsService.getNews as any).mockResolvedValue({ articles: [] });

    await GET(mockRequest('http://localhost:3001/api/news?page=2&limit=5&category=tech&search=test'));
    expect(newsService.getNews).toHaveBeenCalledWith({
      page: 2, limit: 5, category: 'tech', search: 'test',
    });
  });

  it('returns 400 for invalid params', async () => {
    const response = await GET(mockRequest('http://localhost:3001/api/news?page=-1'));
    expect(response.status).toBe(400);
  });

  it('handles service errors', async () => {
    (newsService.getNews as any).mockRejectedValue(new Error('DB down'));
    await GET(mockRequest('http://localhost:3001/api/news'));
    const { handleApiError } = await import('@/lib/utils/apiErrorHandler');
    expect(handleApiError).toHaveBeenCalled();
  });
});
