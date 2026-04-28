/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LotteryDetail from '../../components/lottery/LotteryDetail';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApi } from '@/lib/hooks/useApi';

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

// Mock all child components that do their own API calls or complex rendering
vi.mock('@/components/lottery/DrawResult', () => ({
  DrawResult: () => <div data-testid="draw-result" />
}));

vi.mock('@/components/lottery/DrawPageHeader', () => ({
  DrawPageHeader: ({ lotteryName }: { lotteryName: string }) => <div data-testid="draw-page-header">{lotteryName}</div>
}));

vi.mock('@/components/lottery/PrizeTierSection', () => ({
  PrizeTierSection: () => <div data-testid="prize-tier-section" />
}));

vi.mock('@/components/lottery/PreviousDrawsSidebar', () => ({
  PreviousDrawsSidebar: () => <div data-testid="previous-draws-sidebar" />
}));

vi.mock('@/components/lottery/FindByNumber', () => ({
  FindByNumber: () => <div data-testid="find-by-number" />
}));

vi.mock('@/components/lottery/RecentGlobalDraws', () => ({
  RecentGlobalDraws: () => <div data-testid="recent-global-draws" />
}));

vi.mock('@/components/lottery/InteractiveTicketVerifier', () => ({
  InteractiveTicketVerifier: () => <div data-testid="interactive-ticket-verifier" />
}));

vi.mock('@/components/lottery/LaoAnimalList', () => ({
  LaoAnimalList: () => <div data-testid="lao-animal-list" />
}));

vi.mock('@/components/ui/NewsSidebar', () => ({
  NewsSidebar: () => <div data-testid="news-sidebar" />
}));

vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div>{children}</div>
}));

vi.mock('@/lib/hooks/useApi', () => ({
  useApi: vi.fn(),
}));

vi.mock('@/lib/utils/lotteryUtils', () => ({
  formatDateDisplay: vi.fn(() => 'March 1, 2026'),
  getLocalizedLottery: vi.fn((l: Record<string, unknown>, lang: string) => ({
    name: lang === 'th' ? l.name : l.name_en,
    description: lang === 'th' ? l.description : l.description_en,
    howToPlay: lang === 'th' ? l.how_to_play : l.how_to_play_en,
    prizeStructure: lang === 'th' ? l.prize_structure : l.prize_structure_en,
    logoUrl: l.logo_url,
    bgColor: l.bg_color,
  })),
  getPrizeAmount: vi.fn(() => 1000000),
  getPrizeName: vi.fn(() => '1st Prize'),
  getPrizeNumber: vi.fn(() => ['123456']),
  slugify: vi.fn((name: string) => name.toLowerCase().replace(/\s+/g, '-')),
  GenericPrizeData: {},
}));

vi.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
  Trophy: () => <span data-testid="trophy-icon" />,
  Clock: () => <span data-testid="clock-icon" />,
  Bell: () => <span data-testid="bell-icon" />,
  Star: () => <span data-testid="star-icon" />,
  Info: () => <span data-testid="info-icon" />,
  AlertTriangle: () => <span data-testid="alert-triangle-icon" />,
  NewspaperIcon: () => <span data-testid="newspaper-icon" />,
  ShieldCheck: () => <span data-testid="shield-check-icon" />,
  SearchIcon: () => <span data-testid="search-icon" />,
  Ticket: () => <span data-testid="ticket-icon" />,
  ChevronRight: () => <span data-testid="chevron-right-icon" />,
  ChevronLeft: () => <span data-testid="chevron-left-icon" />,
  ChevronDown: () => <span data-testid="chevron-down-icon" />,
  ExternalLink: () => <span data-testid="external-link-icon" />,
  Share2: () => <span data-testid="share2-icon" />,
  CalendarDays: () => <span data-testid="calendar-days-icon" />,
  CheckCircle: () => <span data-testid="check-circle-icon" />,
  XCircle: () => <span data-testid="x-circle-icon" />,
  ArrowRight: () => <span data-testid="arrow-right-icon" />,
  Award: () => <span data-testid="award-icon" />,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ country: 'th', lottery: 'thai-lottery' }),
  usePathname: () => '/th/thai-lottery'
}));

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

vi.mock('@/lib/flags', () => ({
  getFlagUrl: (c: string) => `/flags/${c}.svg`,
}));

function makeMockT(language: string) {
  return {
    language,
    t: {
      common: {
        loading: 'Loading...',
        currency: 'THB',
        date: 'Date',
        winningNumbers: 'Winning Numbers',
        current: 'Current',
      },
      header: {
        verified: 'Verified',
      },
      ticketVerifier: {
        title: 'Verify',
        description: 'Verify your ticket',
        placeholder: 'Enter numbers',
        button: 'Check',
        verifyAnother: 'Verify Another',
        win: 'You won!',
        noWin: 'Better luck next time',
        verificationDescription: 'Desc',
      },
      lottery: {
        latestResult: 'Latest Result',
        checkResult: 'Check Result',
        previousDraws: 'Previous Draws',
        about: 'About',
        howToPlay: 'How to Play',
        prizeStructure: 'Prize Structure',
        nextDraw: 'Next Draw',
      },
      staticParams: {
        drawDetail: {
          disclaimer: 'Disclaimer text',
          verified: 'Verified',
          officialResults: 'Official Results',
          recentGlobalDraws: 'Recent',
        },
      },
      results: {
        prize1: '1st Prize',
        prize2: '2nd Prize',
        prize2rank: 'Prize 2',
        prize3rank: 'Prize 3',
        prize4rank: 'Prize 4',
        prize5rank: 'Prize 5',
        prize2adj: 'Adjacent 2',
        prize3adj: 'Adjacent 3',
        prize3Front: '3 Front',
        prize3Back: '3 Back',
        firstPrize: '1st Prize',
        history: 'History',
      },
      countryList: {
        countries: { th: 'Thailand' },
      },
    },
  };
}

// Mock API response matching ResultsByTypeResponse shape
const mockApiData = {
  latest: {
    date: '2026-03-01',
    dateDisplay: 'March 1, 2026',
    data: {
      prizes: [
        { category: 'prize_1', winningNumbers: ['123456'], prizeAmount: '6000000' },
      ],
    },
    fullData: null,
  },
  history: [],
};

describe('LotteryDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue(makeMockT('en'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: mockApiData,
      loading: false,
      error: null,
    });
  });

  it('renders lottery details correctly in English', () => {
    render(
      <LotteryDetail
        lotteryId={1}
        countryCode="th"
        country="Thailand"
        lotteryName="Thai Lottery En"
        lotterySlug="thai-lottery"
        apiEndpoint="/api/test"
      />
    );

    // Header renders the lottery name
    expect(screen.getByTestId('draw-page-header')).toHaveTextContent('Thai Lottery En');
    // Main sub-components rendered
    expect(screen.getByTestId('draw-result')).toBeInTheDocument();
  });

  it('renders lottery details correctly in Thai', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue(makeMockT('th'));

    render(
      <LotteryDetail
        lotteryId={1}
        countryCode="th"
        country="Thailand"
        lotteryName="Thai Lottery"
        lotterySlug="thai-lottery"
        apiEndpoint="/api/test"
      />
    );

    expect(screen.getByTestId('draw-page-header')).toHaveTextContent('Thai Lottery');
  });
});
