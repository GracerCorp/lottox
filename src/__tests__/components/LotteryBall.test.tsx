import { describe, expect, it, vi, } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LotteryBall } from '../../components/ui/LotteryBall';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('../../lib/utils', () => ({ cn: (...args: any[]) => args.filter(Boolean).join(' ') }));

describe('LotteryBall', () => {
  it('renders number', () => {
    render(<LotteryBall number="5" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders with gold color', () => {
    render(<LotteryBall number="1" color="gold" />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders with blue color', () => {
    render(<LotteryBall number="2" color="blue" />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    render(<LotteryBall number="3" size="sm" />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders large size', () => {
    render(<LotteryBall number="4" size="lg" />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders bonus ball', () => {
    render(<LotteryBall number="7" isBonus />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders numeric input', () => {
    render(<LotteryBall number={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
