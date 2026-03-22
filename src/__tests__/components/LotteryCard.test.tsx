import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LotteryCard } from '../../components/ui/LotteryCard';

vi.mock('next/link', () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }));
vi.mock('../../components/ui/LotteryBall', () => ({
  LotteryBall: ({ number }: any) => <span data-testid="lottery-ball">{number}</span>,
}));
vi.mock('../../lib/utils', () => ({ cn: (...args: any[]) => args.filter(Boolean).join(' ') }));

describe('LotteryCard', () => {
  const baseProps = {
    country: 'Thailand',
    flag: '/flags/th.svg',
    name: 'Thai Lottery',
    jackpot: '₿6,000,000',
    nextDraw: 'Next: March 1',
    balls: ['1', '2', '3', '4', '5'],
    color: 'gold' as const,
    href: '/th/thai-lottery',
  };

  it('renders country, name, and jackpot', () => {
    render(<LotteryCard {...baseProps} />);
    expect(screen.getByText('Thailand')).toBeInTheDocument();
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
    expect(screen.getByText('₿6,000,000')).toBeInTheDocument();
    expect(screen.getByText('Next: March 1')).toBeInTheDocument();
  });

  it('renders lottery balls', () => {
    render(<LotteryCard {...baseProps} />);
    const balls = screen.getAllByTestId('lottery-ball');
    expect(balls.length).toBe(5);
  });

  it('renders bonus ball when provided', () => {
    render(<LotteryCard {...baseProps} bonusBall="7" />);
    const balls = screen.getAllByTestId('lottery-ball');
    expect(balls.length).toBe(6);
    expect(balls[5]).toHaveTextContent('7');
  });

  it('renders with blue color', () => {
    render(<LotteryCard {...baseProps} color="blue" />);
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
  });

  it('renders with purple color', () => {
    render(<LotteryCard {...baseProps} color="purple" />);
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
  });

  it('renders active state', () => {
    render(<LotteryCard {...baseProps} isActive={true} />);
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
  });

  it('renders with background image', () => {
    render(<LotteryCard {...baseProps} bgImage="/bg.jpg" />);
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();
  });

  it('renders view details link', () => {
    render(<LotteryCard {...baseProps} />);
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });
});
