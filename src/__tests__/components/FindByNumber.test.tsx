import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FindByNumber } from '../../components/lottery/FindByNumber';
import { useLanguage } from '../../contexts/LanguageContext';

vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));
vi.mock('../../lib/flags', () => ({ getFlagUrl: (c: string) => `/flags/${c}.svg` }));

describe('FindByNumber', () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({
      t: {
        staticParams: {
          drawDetail: {
            findByNumber: 'Find By Number',
            findByNumberDesc: 'Search for matching prizes',
            selectDigits: 'All Digits',
            enterNumber: 'Enter number',
            search: 'Search',
          },
        },
      },
    });
  });

  const prizes = [
    { name: 'First Prize', amount: '6M', numbers: ['123456'] },
    { name: 'Front 3', amount: '4K', numbers: ['111', '222'] },
    { name: 'Back 2', amount: '2K', numbers: ['99'] },
  ];

  it('renders the search form', () => {
    render(<FindByNumber countryCode="th" prizes={prizes} />);
    expect(screen.getByText('Find By Number')).toBeInTheDocument();
    expect(screen.getByTestId('find-number-input')).toBeInTheDocument();
    expect(screen.getByTestId('find-number-search-btn')).toBeInTheDocument();
  });

  it('finds matching numbers', () => {
    render(<FindByNumber countryCode="th" prizes={prizes} />);
    fireEvent.change(screen.getByTestId('find-number-input'), { target: { value: '111' } });
    fireEvent.click(screen.getByTestId('find-number-search-btn'));

    const results = screen.getByTestId('find-number-results');
    expect(results).toHaveTextContent('Front 3');
    expect(results).toHaveTextContent('111');
  });

  it('shows no results message when nothing matches', () => {
    render(<FindByNumber countryCode="th" prizes={prizes} />);
    fireEvent.change(screen.getByTestId('find-number-input'), { target: { value: '000' } });
    fireEvent.click(screen.getByTestId('find-number-search-btn'));

    const results = screen.getByTestId('find-number-results');
    expect(results).toHaveTextContent('—');
  });

  it('clears results when searching empty string', () => {
    render(<FindByNumber countryCode="th" prizes={prizes} />);
    // First do a search
    fireEvent.change(screen.getByTestId('find-number-input'), { target: { value: '111' } });
    fireEvent.click(screen.getByTestId('find-number-search-btn'));
    expect(screen.getByTestId('find-number-results')).toBeInTheDocument();

    // Then clear and search again
    fireEvent.change(screen.getByTestId('find-number-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('find-number-search-btn'));
    expect(screen.queryByTestId('find-number-results')).not.toBeInTheDocument();
  });

  it('filters by digit count', () => {
    render(<FindByNumber countryCode="th" prizes={prizes} />);
    // Select 2-digit filter
    fireEvent.change(screen.getByTestId('digit-filter-select'), { target: { value: '2' } });
    // Search for 9 — should only match 2-digit numbers
    fireEvent.change(screen.getByTestId('find-number-input'), { target: { value: '9' } });
    fireEvent.click(screen.getByTestId('find-number-search-btn'));

    const results = screen.getByTestId('find-number-results');
    expect(results).toHaveTextContent('99');
    expect(results).not.toHaveTextContent('111');
  });
});
