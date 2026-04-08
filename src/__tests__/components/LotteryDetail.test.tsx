import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LotteryDetail from '../../components/lottery/LotteryDetail';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApi } from '@/lib/hooks/useApi';

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('@/components/lottery/ResultBoardCard', () => ({
  ResultBoardCard: () => <div data-testid="result-board-card" />
}));

vi.mock('@/components/lottery/PreviousDrawsTable', () => ({
  PreviousDrawsTable: () => <div data-testid="previous-draws-table" />
}));

vi.mock('@/components/lottery/CountryResultVerifier', () => ({
  CountryResultVerifier: () => <div data-testid="country-result-verifier" />
}));

vi.mock('@/components/ui/SubscribeButton', () => ({
  SubscribeButton: () => <button data-testid="subscribe-button">Subscribe</button>
}));

vi.mock('@/components/ui/Breadcrumbs', () => ({
  Breadcrumbs: () => <nav data-testid="breadcrumbs" />
}));

vi.mock('@/lib/hooks/useApi', () => ({
  useApi: vi.fn(),
}));

vi.mock('@/lib/utils/lotteryUtils', () => ({
  formatDateDisplay: vi.fn(() => 'March 1, 2026'),
  getLocalizedLottery: vi.fn((l, lang) => ({
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
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ country: 'th', lottery: 'thai-lottery' }),
  usePathname: () => '/th/thai-lottery'
}));

describe('LotteryDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({
      language: 'en',
      t: {
        common: {
          loading: 'Loading...',
          currency: 'THB'
        },
        header: {
          verified: 'Verified'
        },
        ticketVerifier: {
          title: 'Verify',
          description: 'Verify your ticket',
          placeholder: 'Enter numbers',
          button: 'Check',
          verifyAnother: 'Verify Another',
          win: 'You won!',
          noWin: 'Better luck next time',
          verificationDescription: 'Desc'
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
          drawDetail: { disclaimer: 'Disclaimer text', verified: 'Verified', officialResults: 'Official Results', recentGlobalDraws: 'Recent' },
        },
        results: {
          prize2rank: 'Prize 2',
          prize3rank: 'Prize 3',
          prize4rank: 'Prize 4',
          prize5rank: 'Prize 5',
          prize2adj: 'Adjacent 2',
          prize3adj: 'Adjacent 3',
          firstPrize: '1st Prize',
        }
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({
      data: mockResults,
      isLoading: false,
      error: null,
    });
  });

  const mockLottery = {
    id: 1,
    name: 'Thai Lottery',
    name_en: 'Thai Lottery En',
    slug: 'thai-lottery',
    country_id: 1,
    draw_schedule: 'Twice a month',
    logo_url: '/logo.png',
    bg_color: 'bg-blue-500',
    description: 'Description',
    description_en: 'Description En',
    how_to_play: 'How to play',
    how_to_play_en: 'How to play En',
    prize_structure: 'Prizes',
    prize_structure_en: 'Prizes En',
    countries: {
      name: 'Thailand',
      name_en: 'Thailand En',
      code: 'th',
      flag_url: '/flag.png'
    }
  };

  const mockResults = [
    {
      id: 1,
      draw_date: new Date('2026-03-01'),
      full_data: { number: '123456', meta: {}, prizes: [] },
      lottery: mockLottery
    }
  ];

  it('renders lottery details correctly in English', () => {
    render(<LotteryDetail lotteryId={1} countryCode="th" country="Thailand" lotteryName="Thai Lottery En" lotterySlug="thai-lottery" apiEndpoint="/api/test" />);
    
    // Title
    expect(screen.getAllByText('Thai Lottery En')[0]).toBeInTheDocument();
    
    // Content sections
  });

  it('renders lottery details correctly in Thai', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({
      language: 'th',
      t: { 
        common: { currency: 'THB' },
        header: { verified: 'Verified' },
        ticketVerifier: {
          title: 'Verify',
          description: 'Verify your ticket',
          placeholder: 'Enter numbers',
          button: 'Check',
          verifyAnother: 'Verify Another',
          win: 'You won!',
          noWin: 'Better luck next time',
          verificationDescription: 'Desc'
        },
        lottery: { latestResult: 'Latest', about: 'About' },
        staticParams: { drawDetail: { disclaimer: 'Disclaimer text', verified: 'Verified', officialResults: 'Official Results', recentGlobalDraws: 'Recent' } },
        results: {
          prize2rank: 'Prize 2',
          prize3rank: 'Prize 3',
          prize4rank: 'Prize 4',
          prize5rank: 'Prize 5',
          prize2adj: 'Adjacent 2',
          prize3adj: 'Adjacent 3',
          firstPrize: '1st Prize',
        }
      },
    });

    render(<LotteryDetail lotteryId={1} countryCode="th" country="Thailand" lotteryName="Thai Lottery" lotterySlug="thai-lottery" apiEndpoint="/api/test" />);
    
    expect(screen.getAllByText('Thai Lottery')[0]).toBeInTheDocument();
  });
});
