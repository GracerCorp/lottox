import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentDrawsTable } from '../../components/country/RecentDrawsTable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/link', () => ({ default: ({ children, href }: any) => <a href={href}>{children}</a> }));

describe('RecentDrawsTable', () => {
  const draws = [
    { date: '2026-03-01', drawId: 'D001', numbers: ['1', '2', '3', '4', '5', '6'], topPrize: '₿6M' },
    { date: '2026-02-15', drawId: 'D002', numbers: ['7', '8', '9', '10', '11', '12'], topPrize: '₿5M' },
  ];

  it('renders table with draws', () => {
    render(<RecentDrawsTable country="Thailand" draws={draws} />);
    expect(screen.getByText('Recent Official Results')).toBeInTheDocument();
    expect(screen.getByText('2026-03-01')).toBeInTheDocument();
    expect(screen.getByText('D001')).toBeInTheDocument();
    expect(screen.getByText('₿6M')).toBeInTheDocument();
    expect(screen.getByText('2026-02-15')).toBeInTheDocument();
  });

  it('renders "View All Archive" link when slugs provided', () => {
    render(<RecentDrawsTable country="Thailand" draws={draws} countrySlug="th" lotterySlug="thai-lottery" />);
    const link = screen.getAllByText('View All Archive')[0];
    expect(link.closest('a')).toHaveAttribute('href', '/th/thai-lottery');
  });

  it('renders "View All Archive" button when no slugs', () => {
    render(<RecentDrawsTable country="Thailand" draws={draws} />);
    const btn = screen.getAllByText('View All Archive')[0];
    expect(btn.tagName).toBe('BUTTON');
  });

  it('renders winning numbers', () => {
    render(<RecentDrawsTable country="Thailand" draws={draws} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});
