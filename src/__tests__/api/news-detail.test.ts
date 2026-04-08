import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/services/newsService', () => ({
  newsService: { getNewsDetail: vi.fn() },
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response(JSON.stringify({ error: 'error' }), { status: 500 })),
}));

import { GET } from '@/app/api/news/[slug]/route';
import { newsService } from '@/lib/services/newsService';

function mockRequest(url: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { nextUrl: new URL(url, 'http://localhost:3001') } as any;
}

describe('GET /api/news/[slug]', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns news detail for valid slug', async () => {
    const mockData = { title: 'Test Article', body: 'Content' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newsService.getNewsDetail as any).mockResolvedValue(mockData);

    const response = await GET(
      mockRequest('http://localhost:3001/api/news/test-article'),
      { params: Promise.resolve({ slug: 'test-article' }) }
    );
    const body = await response.json();

    expect(body).toEqual(mockData);
    expect(newsService.getNewsDetail).toHaveBeenCalledWith('test-article', 'th');
  });

  it('passes lang query param', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newsService.getNewsDetail as any).mockResolvedValue({});

    await GET(
      mockRequest('http://localhost:3001/api/news/test?lang=en'),
      { params: Promise.resolve({ slug: 'test' }) }
    );
    expect(newsService.getNewsDetail).toHaveBeenCalledWith('test', 'en');
  });

  it('returns 400 for empty slug', async () => {
    const response = await GET(
      mockRequest('http://localhost:3001/api/news/'),
      { params: Promise.resolve({ slug: '' }) }
    );
    expect(response.status).toBe(400);
  });

  it('handles service errors', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newsService.getNewsDetail as any).mockRejectedValue(new Error('fail'));
    await GET(
      mockRequest('http://localhost:3001/api/news/test'),
      { params: Promise.resolve({ slug: 'test' }) }
    );
    const { handleApiError } = await import('@/lib/utils/apiErrorHandler');
    expect(handleApiError).toHaveBeenCalled();
  });
});
