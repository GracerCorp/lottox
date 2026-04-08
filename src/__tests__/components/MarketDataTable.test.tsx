import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketDataTable } from '../../components/home/MarketDataTable';
import { useApi } from '../../lib/hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';

vi.mock('../../lib/hooks/useApi', () => ({
  useApi: vi.fn(),
}));

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

// Partial mock for mapApiResultToRow to simplify test
vi.mock('../../components/ui/ResultsTable', () => ({
  mapApiResultToRow: vi.fn((res, t, lang) => {
    if (res.id === 'invalid') return null;
    return {
      id: res.id,
      name: res.name,
      numbers: [
        { isMain: true, value: ['123', '456'], prize: '10M' },
        { isMain: false, value: ['99'], prize: '1M' }
      ]
    };
  }),
}));

describe('MarketDataTable', () => {
  const mockT = {
    market: {
      marketData: "MARKET DATA",
      globalIndex: "GLOBAL INDEX",
      marketOpen: "MARKET OPEN",
      vol: "VOL",
      sts: "STS",
      symbol: "SYMBOL",
      numbers: "NUMBERS",
      special: "SPECIAL",
      jackpot: "JACKPOT",
      loading: "LOADING...",
      error: "ERROR",
      noData: "NO DATA AVAILABLE",
      providedBy: "PROVIDED BY",
      realtime: "REAL-TIME"
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({ t: mockT, language: 'en' });
  });

  it('renders loading state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ loading: true, error: null, data: null });
    render(<MarketDataTable />);
    expect(screen.getByText('LOADING...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ loading: false, error: 'API Error', data: null });
    render(<MarketDataTable />);
    expect(screen.getByText('ERROR API Error')).toBeInTheDocument();
  });

  it('renders no data state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ loading: false, error: null, data: { results: [] } });
    render(<MarketDataTable />);
    expect(screen.getByText('NO DATA AVAILABLE')).toBeInTheDocument();
  });

  it('renders data correctly', () => {
    const mockData = {
      results: [
        { id: 'th', name: 'Thai Govt' },
        { id: 'la', name: 'Lao' },
        { id: 'invalid', name: 'Invalid' }, // Should be filtered out by mapApiResultToRow returning null
      ]
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useApi as any).mockReturnValue({ loading: false, error: null, data: mockData });
    render(<MarketDataTable />);
    
    // Check headings
    expect(screen.getByText('MARKET DATA', { exact: false })).toBeInTheDocument();

    // Check first item (id: th -> TH-THA)
    expect(screen.getByText('TH-THA')).toBeInTheDocument();
    expect(screen.getByText('Thai Govt')).toBeInTheDocument();
    expect(screen.getByText('THB')).toBeInTheDocument();

    // Check second item (id: la -> LA-LAO)
    expect(screen.getByText('LA-LAO')).toBeInTheDocument();
    expect(screen.getByText('Lao')).toBeInTheDocument();
    expect(screen.getByText('LAK')).toBeInTheDocument();

    // Results values from mock
    const numbers = screen.getAllByText('123 456');
    expect(numbers.length).toBe(2);

    const specials = screen.getAllByText('99');
    expect(specials.length).toBe(2);

    const jackpots = screen.getAllByText('10M');
    expect(jackpots.length).toBe(2);
  });
});
