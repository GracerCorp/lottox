import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HeroCarousel } from '../../components/ui/HeroCarousel';

vi.mock('../../components/ui/LotteryCard', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LotteryCard: ({ country, isActive }: any) => (
    <div data-testid="lottery-card" data-active={isActive}>{country}</div>
  ),
}));

vi.mock('../../lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

describe('HeroCarousel', () => {
  const items = [
    { country: 'Thailand', flag: '🇹🇭', name: 'Thai Lottery', jackpot: '6M', nextDraw: '2026-04-01', balls: ['1','2','3'], color: 'gold' as const },
    { country: 'Laos', flag: '🇱🇦', name: 'Lao Lottery', jackpot: '2M', nextDraw: '2026-04-02', balls: ['4','5','6'], color: 'blue' as const },
    { country: 'Vietnam', flag: '🇻🇳', name: 'VN Lottery', jackpot: '5M', nextDraw: '2026-04-03', balls: ['7','8','9'], color: 'purple' as const },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders lottery cards', () => {
    render(<HeroCarousel items={items} />);
    const cards = screen.getAllByTestId('lottery-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('navigates to next slide on right button click', () => {
    render(<HeroCarousel items={items} />);
    // The active card should be the first by default
    const activeCard = screen.getAllByTestId('lottery-card').find(
      (el) => el.getAttribute('data-active') === 'true'
    );
    expect(activeCard?.textContent).toBe('Thailand');

    // Click next
    const buttons = screen.getAllByRole('button');
    const nextBtn = buttons[1]; // Second button is next
    fireEvent.click(nextBtn);

    const newActive = screen.getAllByTestId('lottery-card').find(
      (el) => el.getAttribute('data-active') === 'true'
    );
    expect(newActive?.textContent).toBe('Laos');
  });

  it('navigates to previous slide on left button click', () => {
    render(<HeroCarousel items={items} />);
    const buttons = screen.getAllByRole('button');
    const prevBtn = buttons[0];
    fireEvent.click(prevBtn);

    const active = screen.getAllByTestId('lottery-card').find(
      (el) => el.getAttribute('data-active') === 'true'
    );
    expect(active?.textContent).toBe('Vietnam');
  });

  it('auto-scrolls after interval', () => {
    render(<HeroCarousel items={items} />);
    act(() => { vi.advanceTimersByTime(4100); });
    const active = screen.getAllByTestId('lottery-card').find(
      (el) => el.getAttribute('data-active') === 'true'
    );
    expect(active?.textContent).toBe('Laos');
  });
});
