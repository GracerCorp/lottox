import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/services/countryService', () => ({
  countryService: { getCountries: vi.fn() },
}));
vi.mock('@/lib/utils/apiErrorHandler', () => ({
  handleApiError: vi.fn(() => new Response('Error', { status: 500 })),
}));

import { GET } from '@/app/api/countries/route';
import { countryService } from '@/lib/services/countryService';

describe('GET /api/countries', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns countries list', async () => {
    (countryService.getCountries as any).mockResolvedValue({
      countries: [
        { code: 'th', name: 'Thailand' },
        { code: 'la', name: 'Laos' },
      ],
    });
    const res = await GET();
    const data = await res.json();
    expect(data.countries).toHaveLength(2);
  });

  it('handles errors', async () => {
    (countryService.getCountries as any).mockRejectedValue(new Error('DB error'));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
