import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultBoardCard } from '../../components/global-draws/ResultBoardCard';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApi } from '../../lib/hooks/useApi';

vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
vi.mock('../../lib/hooks/useApi', () => ({ useApi: vi.fn() }));
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));
vi.mock('../../lib/flags', () => ({ getFlagUrl: (c: string) => `/flags/${c}.svg` }));
vi.mock('../../components/global-draws/DrawHistoryRow', () => ({
  DrawHistoryRow: (props: any) => <div data-testid="draw-history-row">{props.digits6}</div>,
}));
vi.mock('../../components/global-draws/BoardPagination', () => ({
  BoardPagination: (props: any) => <div data-testid="board-pagination" />,
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
    (useLanguage as any).mockReturnValue({
      t: { staticParams: { globalDraws: mockGd } },
    });
  });

  it('shows loading state', () => {
    (useApi as any).mockReturnValue({ data: null, loading: true, error: null });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" />);
    expect(screen.getByTestId('board-card-loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useApi as any).mockReturnValue({ data: null, loading: false, error: 'fail' });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" />);
    expect(screen.getByTestId('board-card-error')).toHaveTextContent('Error loading');
  });

  it('shows empty state', () => {
    (useApi as any).mockReturnValue({
      data: { draws: [], total: 0, page: 1, totalPages: 1 },
      loading: false,
      error: null,
    });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" />);
    expect(screen.getByTestId('board-card-empty')).toHaveTextContent('No results');
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
    (useApi as any).mockReturnValue({
      data: { draws, total: 1, page: 1, totalPages: 1 },
      loading: false,
      error: null,
    });
    render(<ResultBoardCard lotteryName="Thai Lottery" countryCode="th" />);
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
    expect(screen.getByTestId('draw-history-row')).toHaveTextContent('123456');
  });

  it('renders remove button and calls onRemove', () => {
    const onRemove = vi.fn();
    (useApi as any).mockReturnValue({
      data: { draws: [], total: 0, page: 1, totalPages: 1 },
      loading: false,
      error: null,
    });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('remove-button'));
    expect(onRemove).toHaveBeenCalled();
  });

  it('shows pagination when more than 5 draws', () => {
    const draws = Array.from({ length: 7 }, (_, i) => ({
      drawDate: `2026-03-0${i + 1}T00:00:00Z`,
      data: { prizes: [{ category: 'prize_1', winningNumbers: ['000000'] }] },
    }));
    (useApi as any).mockReturnValue({
      data: { draws, total: 7, page: 1, totalPages: 2 },
      loading: false,
      error: null,
    });
    render(<ResultBoardCard lotteryName="Thai" countryCode="th" />);
    expect(screen.getByTestId('board-pagination')).toBeInTheDocument();
  });
});
