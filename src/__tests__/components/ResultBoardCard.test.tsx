/* eslint-disable @next/next/no-img-element */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultBoardCard } from '../../components/global-results/ResultBoardCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApi } from '../../lib/hooks/useApi';

vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
vi.mock('../../lib/hooks/useApi', () => ({ useApi: vi.fn() }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/image', () => ({ default: (props: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fill, priority, ...rest } = props;
  return <img {...rest} data-fill={fill ? "true" : undefined} alt="" />;
}}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/link', () => ({ default: ({ children, href }: any) => <a href={href}>{children}</a> }));
vi.mock('../../lib/flags', () => ({ getFlagUrl: (c: string) => `/flags/${c}.svg` }));
vi.mock('../../lib/utils/lotteryUtils', () => ({
  slugify: vi.fn((name: string) => name.toLowerCase().replace(/\s+/g, '-')),
}));
vi.mock('../../components/global-results/DrawHistoryRow', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DrawHistoryRow: (props: any) => (
    <div data-testid="draw-history-row">
      {props.results?.map((r: { value: string }, i: number) => (
        <span key={i}>{r.value}</span>
      ))}
    </div>
  ),
}));
vi.mock('../../components/global-results/BoardPagination', () => ({
  BoardPagination: () => <div data-testid="board-pagination" />,
}));

describe('ResultBoardCard', () => {
  const mockGd = {
    errorLoading: 'Error loading',
    noResults: 'No results',
    digits6: '6 Digits',
    digits3First: '3 Front',
    digits3Last: '3 Back',
    digits2Last: '2 Back',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({
      t: { staticParams: { globalDraws: mockGd }, common: { winningNumbers: 'Winning Numbers' }, results: {} },
    });
  });

  it('shows loading state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ data: null, loading: true, error: null });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" />);
    expect(screen.getByTestId('board-card-loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ data: null, loading: false, error: 'fail' });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" />);
    expect(screen.getByTestId('board-card-error')).toHaveTextContent('Error loading');
  });

  it('returns null for empty draws (no visible DOM)', () => {
    // When draws are empty and not loading/error, the component returns null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: { draws: [], total: 0, page: 1, totalPages: 1 },
      loading: false,
      error: null,
    });
    const { container } = render(<ResultBoardCard lotteryName="Thai" countryCode="th" />);
    // Component returns null when draws are empty
    expect(container.innerHTML).toBe('');
  });

  it('renders draw history rows with data', () => {
    const draws = [
      {
        drawDate: '2026-03-01T15:00:00Z',
        data: {
          prizes: [
            { category: 'prize_1', winningNumbers: ['123456'], prizeAmount: 6000000 },
            { category: 'running_number_front_3', winningNumbers: ['111', '222'] },
          ],
        },
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: { draws, total: 1, page: 1, totalPages: 1 },
      loading: false,
      error: null,
    });
    render(<ResultBoardCard lotteryName="Thai Lottery" countryCode="th" />);
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
    expect(screen.getByTestId('draw-history-row')).toBeInTheDocument();
  });

  it('renders remove button and calls onRemove', () => {
    const onRemove = vi.fn();
    const draws = [
      {
        drawDate: '2026-03-01T15:00:00Z',
        data: {
          prizes: [
            { category: 'prize_1', winningNumbers: ['111111'], prizeAmount: 1000 },
          ],
        },
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: { draws, total: 1, page: 1, totalPages: 1 },
      loading: false,
      error: null,
    });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('remove-button'));
    expect(onRemove).toHaveBeenCalled();
  });

  it('shows pagination when more than PAGE_SIZE draws', () => {
    const draws = Array.from({ length: 7 }, (_, i) => ({
      drawDate: `2026-03-0${i + 1}T00:00:00Z`,
      data: { prizes: [{ category: 'prize_1', winningNumbers: ['000000'] }] },
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: { draws, total: 7, page: 1, totalPages: 2 },
      loading: false,
      error: null,
    });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" />);
    expect(screen.getByTestId('board-pagination')).toBeInTheDocument();
  });
});
