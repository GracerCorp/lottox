import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/hooks/useApi', () => ({ useApi: vi.fn() }));
vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));
vi.mock('../../lib/flags', () => ({ getFlagUrl: (c: string) => `/flags/${c}.svg` }));
vi.mock('../../components/ui/CountdownTimer', () => ({
  CountdownTimer: ({ targetDate }: any) => <span data-testid="countdown">{targetDate}</span>,
}));

import { UpcomingLotterySidebar } from '../../components/global-draws/UpcomingLotterySidebar';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApi } from '../../lib/hooks/useApi';

describe('UpcomingLotterySidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      t: {
        staticParams: {
          globalDraws: {
            upcomingLottery: 'Upcoming Draws',
            noUpcoming: 'No upcoming draws',
            errorLoading: 'Error loading',
          },
        },
      },
    });
  });

  it('shows loading state', () => {
    (useApi as any).mockReturnValue({ data: null, loading: true, error: null });
    render(<UpcomingLotterySidebar />);
    expect(screen.getByTestId('upcoming-loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useApi as any).mockReturnValue({ data: null, loading: false, error: 'Error' });
    render(<UpcomingLotterySidebar />);
    expect(screen.getByTestId('upcoming-error')).toHaveTextContent('Error loading');
  });

  it('shows empty state', () => {
    (useApi as any).mockReturnValue({ data: { upcoming: [] }, loading: false, error: null });
    render(<UpcomingLotterySidebar />);
    expect(screen.getByText('No upcoming draws')).toBeInTheDocument();
  });

  it('renders upcoming draws', () => {
    (useApi as any).mockReturnValue({
      data: {
        upcoming: [
          { name: 'Thai Lottery', countryCode: 'th', nextDrawAt: '2026-04-01T15:00:00Z' },
        ],
      },
      loading: false,
      error: null,
    });
    render(<UpcomingLotterySidebar />);
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
    expect(screen.getByTestId('countdown')).toBeInTheDocument();
  });
});
