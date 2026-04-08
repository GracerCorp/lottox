import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/services/newsService', () => ({
  newsService: { trackAnalytics: vi.fn() },
}));

import { POST } from '@/app/api/articles/[slug]/track/route';
import { newsService } from '@/lib/services/newsService';

describe('POST /api/articles/[slug]/track', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('tracks an article successfully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newsService.trackAnalytics as any).mockResolvedValue(true);

    const req = new Request('http://localhost/api/articles/test-article/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ views: 1, activeSeconds: 10, bounceRate: 0.5 }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await POST(req as any, { params: Promise.resolve({ slug: 'test-article' }) });
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(newsService.trackAnalytics).toHaveBeenCalledWith('test-article', { views: 1, activeSeconds: 10, bounceRate: 0.5 });
  });

  it('handles invalid payload', async () => {
    const req = new Request('http://localhost/api/articles/test-article/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ views: "not a number" }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await POST(req as any, { params: Promise.resolve({ slug: 'test-article' }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid tracking payload');
  });

  it('handles server error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newsService.trackAnalytics as any).mockRejectedValue(new Error('DB Error'));

    const req = new Request('http://localhost/api/articles/test-article/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ views: 1 }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await POST(req as any, { params: Promise.resolve({ slug: 'test-article' }) });
    expect(res.status).toBe(500);
  });
});
