import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DrawResult } from '../../components/lottery/DrawResult';
import { useLanguage } from '../../contexts/LanguageContext';

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('../../components/ui/LotteryBall', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LotteryBall: ({ number }: any) => <span data-testid="lottery-ball">{number}</span>,
}));

describe('DrawResult', () => {
  const mockT = {
    results: {
      prize1: 'First Prize',
      prize_1_thai: '1st Prize',
      prize2rank: '2nd Prize',
      prize3rank: '3rd Prize',
      prize4rank: '4th Prize',
      prize5rank: '5th Prize',
      running_number_front_3: 'Front 3',
      running_number_back_3: 'Back 3',
      running_number_back_2: 'Back 2',
      nearby_prize_1: 'Nearby',
      prize3Front: 'Front 3',
      prize3Back: 'Back 3',
      prize2: 'Last 2',
      prize_2_digits: '2 Digits',
      prize_3_digits: '3 Digits',
      prize_4_digits: '4 Digits',
      prize_modern_5: 'Modern 5',
    },
    common: {
      currency: 'THB',
      baht: 'Baht',
      perPrize: 'per prize',
      adjacent: 'Adjacent',
    },
  };

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({ t: mockT });
  });

  it('renders first prize with Thai-style static props', () => {
    render(
      <DrawResult
        date="1 Mar 2026"
        firstPrize="123456"
        firstPrizeAmount="6,000,000"
        front3={['111', '222']}
        front3Amount="4,000"
        back3={['333', '444']}
        back3Amount="4,000"
        last2="99"
        last2Amount="2,000"
        adjacent={['123455', '123457']}
        adjacentAmount="100,000"
      />
    );

    expect(screen.getByText('1 Mar 2026')).toBeInTheDocument();
    // Ball digits for first prize
    const balls = screen.getAllByTestId('lottery-ball');
    expect(balls.length).toBe(6); // 1,2,3,4,5,6
    expect(screen.getByText('Front 3')).toBeInTheDocument();
    expect(screen.getByText('Back 3')).toBeInTheDocument();
    expect(screen.getByText('Last 2')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('renders dynamic prizes for non-Thai lotteries', () => {
    const dynamicPrizes = [
      { prizeName: 'prize_4_digits', prizeAmount: 50000, winningNumbers: ['1234'], order: 1, category: 'prize_4_digits' },
      { prizeName: 'prize_3_digits', prizeAmount: 5000, winningNumbers: ['567'], order: 2, category: 'prize_3_digits' },
      { prizeName: 'prize_2_digits', prizeAmount: 2000, winningNumbers: ['89'], order: 3, category: 'prize_2_digits' },
    ];

    render(
      <DrawResult
        date="1 Mar 2026"
        firstPrize="1234"
        firstPrizeAmount="50,000"
        dynamicPrizes={dynamicPrizes}
        country="Laos"
        lotteryName="Lao Lottery"
      />
    );

    expect(screen.getByText('Laos')).toBeInTheDocument();
    expect(screen.getByText('Lao Lottery')).toBeInTheDocument();
    expect(screen.getByText('3 Digits')).toBeInTheDocument();
    expect(screen.getByText('2 Digits')).toBeInTheDocument();
  });

  it('renders country and lottery name when provided', () => {
    render(
      <DrawResult
        date="1 Mar 2026"
        firstPrize="999999"
        firstPrizeAmount="6,000,000"
        country="Thailand"
        lotteryName="Government Lottery (GLO)"
      />
    );

    expect(screen.getByText('Thailand')).toBeInTheDocument();
    expect(screen.getByText('Government Lottery (GLO)')).toBeInTheDocument();
  });
});
