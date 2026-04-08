import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/services/lotteryResultService', () => ({
  apiClient: { checkNumber: vi.fn() },
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response('Error', { status: 500 })),
}));
vi.mock('@/lib/utils/lotteryValidation', () => ({
  validateNumber: vi.fn(() => ({ valid: true })),
}));

import { GET } from '@/app/api/check/route';
import { apiClient } from '@/lib/services/lotteryResultService';
import { validateNumber } from '@/lib/utils/lotteryValidation';

describe('GET /api/check', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns check result for valid number', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiClient.checkNumber as any).mockResolvedValue({ win: true, prizes: [{ label: 'First', amount: '6M' }] });
    const req = new NextRequest('http://localhost/api/check?number=123456&type=th');
    const res = await GET(req);
    const data = await res.json();
    expect(data.win).toBe(true);
  });

  it('returns 400 for missing params', async () => {
    const req = new NextRequest('http://localhost/api/check?number=&type=');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid number format', async () => {
    const req = new NextRequest('http://localhost/api/check?number=abc&type=th');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when validation fails', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (validateNumber as any).mockReturnValue({ valid: false, error: 'Invalid number' });
    const req = new NextRequest('http://localhost/api/check?number=123456&type=th');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });
});
