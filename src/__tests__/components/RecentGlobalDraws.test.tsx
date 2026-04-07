import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RecentGlobalDraws } from '../../components/lottery/RecentGlobalDraws';
import { useLanguage } from '../../contexts/LanguageContext';

vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));
vi.mock('next/link', () => ({ default: ({ children, href }: any) => <a href={href}>{children}</a> }));
vi.mock('../../lib/flags', () => ({ getFlagUrl: (c: string) => `/flags/${c}.svg` }));
vi.mock('../../lib/utils/lotteryUtils', () => ({
  formatDateDisplay: (d: string) => d,
  slugify: (s: string) => s.toLowerCase().replace(/\s+/g, '-'),
}));

describe('RecentGlobalDraws', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      t: { staticParams: { drawDetail: { recentGlobalDraws: 'Recent Global Draws' } } },
      language: 'en',
    });
  });

  it('shows loading state initially', () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {})); // never resolves
    render(<RecentGlobalDraws />);
    expect(screen.getByTestId('recent-global-results')).toBeInTheDocument();
  });

  it('renders draws after fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        draws: [
          { id: 1, lotteryName: 'Thai Lottery', country: 'Thailand', countryCode: 'TH', date: '2026-03-01', dateDisplay: '1 Mar 2026', firstPrize: '123456' },
        ],
      }),
    });

    render(<RecentGlobalDraws />);
    await waitFor(() => {
      expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
    });
    expect(screen.getByText('123456')).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    render(<RecentGlobalDraws />);
    // Should not crash and should show nothing after error
    await waitFor(() => {
      expect(screen.queryByText('Recent Global Draws')).not.toBeInTheDocument();
    });
  });

  it('excludes specified country', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        draws: [
          { id: 1, lotteryName: 'Thai Lottery', country: 'Thailand', countryCode: 'TH', date: '2026-03-01', dateDisplay: '1 Mar 2026' },
          { id: 2, lotteryName: 'Lao Lottery', country: 'Laos', countryCode: 'LA', date: '2026-03-01', dateDisplay: '1 Mar 2026' },
        ],
      }),
    });

    render(<RecentGlobalDraws excludeCountry="th" />);
    await waitFor(() => {
      expect(screen.getByText('Lao Lottery')).toBeInTheDocument();
    });
    expect(screen.queryByText('Thai Lottery')).not.toBeInTheDocument();
  });

  it('extracts first prize from data.prizes fallback', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        draws: [
          { id: 1, lotteryName: 'Test', country: 'T', countryCode: 'tt', date: '2026-01-01', dateDisplay: '1 Jan', data: { prizes: [{ winningNumbers: ['999'] }] } },
        ],
      }),
    });

    render(<RecentGlobalDraws />);
    await waitFor(() => {
      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });
});
