import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardTable } from '../../components/dashboard/DashboardTable';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApi } from '../../lib/hooks/useApi';

vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
vi.mock('../../lib/hooks/useApi', () => ({ useApi: vi.fn() }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/link', () => ({ default: ({ children, href }: any) => <a href={href}>{children}</a> }));
vi.mock('@/components/home/CheckLotteryWidget', () => ({
  default: () => <div data-testid="check-lottery-widget">Check Lottery Widget</div>
}));
vi.mock('../../lib/flags', () => ({ getFlagUrl: (c: string) => `/flags/${c}.svg` }));
vi.mock('../../components/ui/ResultsTable', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapApiResultToRow: (draw: any) => {
    if (!draw) return null;
    return {
      country: draw.countryCode || 'th',
      flag: '/flags/th.svg',
      name: draw.lotteryName || 'Test Lottery',
      date: draw.date || '2026-03-01',
      numbers: '123456',
      href: `/th/test-lottery/${draw.date}`,
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SingleLineRow: ({ item }: any) => (
    <div data-testid="single-line-row">{item.name} - {item.date}</div>
  ),
}));

describe('DashboardTable', () => {
  const mockT = { results: {}, common: {} };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({ t: mockT, language: 'en' });
  });

  it('shows loading state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ data: null, loading: true, error: null });
    render(<DashboardTable />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ data: null, loading: false, error: 'Server Error' });
    render(<DashboardTable />);
    expect(screen.getByText(/Error loading results/)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: { draws: [], total: 0, page: 1, totalPages: 1 },
      loading: false,
      error: null,
    });
    render(<DashboardTable />);
    expect(screen.getByText('No results found for this period.')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: {
        draws: [
          { countryCode: 'th', lotteryName: 'Thai Lottery', date: '2026-03-01', data: {} },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      },
      loading: false,
      error: null,
    });
    render(<DashboardTable />);
    expect(screen.getByTestId('single-line-row')).toHaveTextContent('Thai Lottery');
  });

  it('handles filter clicks', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: { draws: [], total: 0, page: 1, totalPages: 1 },
      loading: false,
      error: null,
    });
    render(<DashboardTable />);
    fireEvent.click(screen.getByText('7 Days'));
    // Should not crash and re-render with 7d filter
    expect(screen.getByText('7 Days')).toBeInTheDocument();
  });

  it('shows pagination when multiple pages', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: {
        draws: [
          { countryCode: 'th', lotteryName: 'Thai', date: '2026-03-01', data: {} },
        ],
        total: 40,
        page: 1,
        totalPages: 2,
      },
      loading: false,
      error: null,
    });
    render(<DashboardTable />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
});
