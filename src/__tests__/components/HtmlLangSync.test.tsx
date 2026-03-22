import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { HtmlLangSync } from '@/components/ui/HtmlLangSync';
import { useLanguage } from '@/contexts/LanguageContext';

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

describe('HtmlLangSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.lang = 'en';
  });

  it('syncs HTML lang attribute when language changes', () => {
    (useLanguage as any).mockReturnValue({ language: 'th' });
    render(<HtmlLangSync />);
    expect(document.documentElement.lang).toBe('th');
  });

  it('does nothing if lang is already the same', () => {
    (useLanguage as any).mockReturnValue({ language: 'en' });
    render(<HtmlLangSync />);
    expect(document.documentElement.lang).toBe('en');
  });
});
