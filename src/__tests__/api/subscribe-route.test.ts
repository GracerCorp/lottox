import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response('Error', { status: 500 })),
}));

import { POST } from '@/app/api/subscribe/route';

describe('POST /api/subscribe', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 400 for invalid email', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-email', lotteryId: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for missing lotteryId', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative lotteryId', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', lotteryId: -1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
