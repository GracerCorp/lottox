/* eslint-disable @next/next/no-img-element */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
vi.mock('../../lib/hooks/useApi', () => ({ useApi: vi.fn() }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} alt="" /> }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/link', () => ({ default: ({ children, href }: any) => <a href={href}>{children}</a> }));
vi.mock('../../lib/flags', () => ({ getFlagUrl: (c: string) => `/flags/${c}.svg` }));
vi.mock('../../lib/utils/lotteryUtils', () => ({
  slugify: (s: string) => s.toLowerCase().replace(/\s+/g, '-'),
  formatDateShort: (d: string) => d,
}));

import { useLanguage } from '../../contexts/LanguageContext';
import { useApi } from '../../lib/hooks/useApi';
import { ResultsTable } from '../../components/ui/ResultsTable';

describe('ResultsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({
      t: {
        results: {
          latestResults: 'Latest Results',
          prize_1_thai: 'First',
          prize2rank: '2nd',
          prize3rank: '3rd',
          prize3Front: 'Front 3',
          prize3Back: 'Back 3',
          prize2: 'Last 2',
          running_number_front_3: 'Front 3',
          running_number_back_3: 'Back 3',
          running_number_back_2: 'Back 2',
          nearby_prize_1: 'Nearby',
          prize_2_digits: '2 Digits',
          prize_3_digits: '3 Digits',
          prize_4_digits: '4 Digits',
          prize_modern_5: 'Modern 5',
          noResults: 'No results found',
        },
        common: { currency: 'THB' },
      },
      language: 'en',
    });
  });

  it('shows loading state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ data: null, loading: true, error: null });
    render(<ResultsTable />);
    expect(document.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('shows results when data loaded', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            type: 'TH',
            date: '2026-03-01',
            dateDisplay: '1 Mar 2026',
            drawDate: '2026-03-01',
            drawNo: 'D001',
            data: {
              prizes: [
                { prizeName: 'prize_1', category: 'prize_1', winningNumbers: ['123456'], prizeAmount: 6000000 },
              ],
            },
            lotteryName: 'Thai Lottery',
            countryCode: 'th',
            showingPrizes: ['prize_1'],
          },
        ],
      },
      loading: false,
      error: null,
    });
    render(<ResultsTable />);
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
  });

  it('shows no results when data is empty', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ data: { results: [] }, loading: false, error: null });
    render(<ResultsTable />);
    // Should not crash
  });
});
