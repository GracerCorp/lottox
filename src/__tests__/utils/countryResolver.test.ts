import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    countries: { findFirst: vi.fn() },
  },
}));

import { resolveCountryCode, getDisplayType, _legacyAliases } from '../../lib/utils/countryResolver';
import { prisma } from '@/lib/prisma';

describe('countryResolver', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('resolveCountryCode', () => {
    it('resolves legacy alias "thai" to "th"', async () => {
      expect(await resolveCountryCode('thai')).toBe('th');
    });

    it('resolves legacy alias "lao" to "la"', async () => {
      expect(await resolveCountryCode('lao')).toBe('la');
    });

    it('resolves legacy alias "laos" to "la"', async () => {
      expect(await resolveCountryCode('laos')).toBe('la');
    });

    it('resolves legacy alias "vietnam" to "vn"', async () => {
      expect(await resolveCountryCode('vietnam')).toBe('vn');
    });

    it('resolves "government-lottery-office-glo" to "th"', async () => {
      expect(await resolveCountryCode('government-lottery-office-glo')).toBe('th');
    });

    it('resolves case-insensitively', async () => {
      expect(await resolveCountryCode('THAI')).toBe('th');
    });

    it('resolves from DB when not a legacy alias', async () => {
      (prisma.countries.findFirst as any).mockResolvedValue({ code: 'au' });
      expect(await resolveCountryCode('au')).toBe('au');
    });

    it('returns null when not found', async () => {
      (prisma.countries.findFirst as any).mockResolvedValue(null);
      expect(await resolveCountryCode('zzz')).toBeNull();
    });
  });

  describe('getDisplayType', () => {
    it('uppercases country code', () => {
      expect(getDisplayType('th')).toBe('TH');
      expect(getDisplayType('la')).toBe('LA');
      expect(getDisplayType('vn')).toBe('VN');
    });
  });

  describe('_legacyAliases', () => {
    it('contains expected aliases', () => {
      expect(_legacyAliases.thai).toBe('th');
      expect(_legacyAliases.vietnam).toBe('vn');
    });
  });
});
