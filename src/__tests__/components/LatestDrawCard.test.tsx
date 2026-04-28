/* eslint-disable @next/next/no-img-element */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LatestDrawCard } from '../../components/global-results/LatestDrawCard';
import { useApi } from '../../lib/hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';

vi.mock('../../lib/hooks/useApi', () => ({
  useApi: vi.fn(),
}));

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('../../lib/flags', () => ({
  getFlagUrl: vi.fn((code) => `/flags/${code}.svg`),
}));

vi.mock('../../lib/utils/lotteryUtils', () => ({
  slugify: vi.fn((name) => name.toLowerCase().replace(/\s+/g, '-')),
}));

// Mock Next.js Image and Link
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill ? "true" : undefined} alt="" />;
  }
}));

vi.mock('next/link', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}));

describe('LatestDrawCard', () => {
  const mockT = {
    staticParams: {
      globalDraws: {
        errorLoading: "ERROR LOADING",
        latestDraw: "LATEST DRAW",
        digits6: "6 DIGITS",
        firstPrize: "FIRST PRIZE",
        digits3First: "3 FRONT",
        digits3Last: "3 BACK",
        digits2Last: "2 BACK"
      }
    },
    common: {
      winningNumbers: "Winning Numbers",
    },
    countryList: {
      countries: { th: "Thailand", la: "Laos" }
    },
    regions: {
      trending: "Trending"
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({ t: mockT });
  });

  it('renders loading state correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ loading: true, error: null, data: null });
    render(<LatestDrawCard />);
    expect(screen.getByTestId('latest-draw-card-loading')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ loading: false, error: 'API Error', data: null });
    render(<LatestDrawCard />);
    expect(screen.getByTestId('latest-draw-card-error')).toHaveTextContent('ERROR LOADING');
  });

  it('renders data correctly for a Thai lottery', () => {
    const mockData = {
      results: [
        {
          countryCode: 'th',
          lotteryName: 'Thai Govt',
          date: '2026-03-01',
          drawDate: '2026-03-01',
          logo: null,
          data: {
            prizes: [
              { category: 'prize_1', winningNumbers: ['123456'], prizeAmount: '6000000' },
              { category: 'running_number_front_3', winningNumbers: ['111', '222'], prizeAmount: '4000' },
              { category: 'running_number_back_3', winningNumbers: ['333', '444'], prizeAmount: '4000' },
              { category: 'running_number_back_2', winningNumbers: ['99'], prizeAmount: '2000' },
            ]
          }
        }
      ]
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ loading: false, error: null, data: mockData });
    render(<LatestDrawCard />);
    
    expect(screen.getByTestId('latest-draw-card')).toBeInTheDocument();
    expect(screen.getByText('Thai Govt')).toBeInTheDocument();
    expect(screen.getByText('LATEST DRAW')).toBeInTheDocument();

    // The component splits "123456" into individual digits and renders each in its own div
    const digitsContainer = screen.getByTestId('main-numbers');
    expect(digitsContainer).toHaveTextContent('123456');

    // Check sub prizes by their labels
    expect(screen.getByText('3 FRONT')).toBeInTheDocument();
    expect(screen.getByText('3 BACK')).toBeInTheDocument();
    expect(screen.getByText('2 BACK')).toBeInTheDocument();
    
    // Check values
    expect(screen.getByText('111')).toBeInTheDocument();
    expect(screen.getByText('222')).toBeInTheDocument();
    expect(screen.getByText('333')).toBeInTheDocument();
    expect(screen.getByText('444')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('renders fallback formatting properly for other lotteries', () => {
    const mockData = {
      results: [
        {
          countryCode: 'la',
          lotteryName: 'Lao',
          date: '2026-01-15',
          drawDate: '2026-01-15',
          logo: null,
          data: {
            prizes: [
              { category: 'prize_4_digits', winningNumbers: ['4567'], prizeAmount: null },
            ]
          }
        }
      ]
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ loading: false, error: null, data: mockData });
    render(<LatestDrawCard />);
    
    expect(screen.getByText('Lao')).toBeInTheDocument();
    
    // The component splits "4567" into individual digits ["4","5","6","7"]
    const digitsContainer = screen.getByTestId('main-numbers');
    expect(digitsContainer).toHaveTextContent('4567');
  });
});
