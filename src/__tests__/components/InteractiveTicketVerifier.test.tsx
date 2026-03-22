import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useParams: vi.fn(() => ({ country: 'th', lottery: 'thai-lottery' })),
}));
vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));
vi.mock('lucide-react', () => ({
  SearchIcon: () => <span>Search</span>,
  Ticket: () => <span>Ticket</span>,
  CalendarDays: () => <span>Calendar</span>,
  CheckCircle2: () => <span>CheckCircle</span>,
  XCircle: () => <span>XCircle</span>,
}));

import { useLanguage } from '../../contexts/LanguageContext';
import { InteractiveTicketVerifier } from '../../components/lottery/InteractiveTicketVerifier';

const mockT = {
  common: {
    checkResult: 'Check Result',
    checkResultDesc: 'Enter your ticket',
    verifyTicketTitle: 'Verify Ticket',
    verifyTicketDesc: 'Enter your ticket number',
    drawDate: 'Draw Date',
    latestDraw: 'Latest Draw',
    yourTicketNumber: 'Your Ticket Number',
    inputPlaceholder: 'Enter number',
    checkBtn: 'Check',
    verifySuccess: 'Winner!',
    verifySuccessDesc1: 'Your ticket',
    verifySuccessDesc2: 'won!',
    verifyFail: 'No win',
    verifyFailDesc1: 'Your ticket',
    verifyFailDesc2: 'did not win.',
  },
};

describe('InteractiveTicketVerifier', () => {
  const baseProps = {
    countryCode: 'th',
    lotterySlug: 'thai-lottery',
    latestDateDisplay: '1 Mar 2026',
    historyItems: [
      { date: '2026-02-15', dateDisplay: '15 Feb 2026' },
      { date: '2026-02-01', dateDisplay: '1 Feb 2026' },
    ],
    prizes: [
      { name: 'First Prize', amount: '฿6,000,000', numbers: ['123456'] },
      { name: 'Last 2 Digits', amount: '฿2,000', numbers: ['56'] },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({ t: mockT });
  });

  it('renders with main variant', () => {
    render(<InteractiveTicketVerifier {...baseProps} />);
    expect(screen.getByText('Check Result')).toBeInTheDocument();
    expect(screen.getByText('Enter your ticket')).toBeInTheDocument();
  });

  it('renders with sidebar variant', () => {
    render(<InteractiveTicketVerifier {...baseProps} variant="sidebar" />);
    expect(screen.getByText('Verify Ticket')).toBeInTheDocument();
  });

  it('renders draw date dropdown with history', () => {
    render(<InteractiveTicketVerifier {...baseProps} />);
    expect(screen.getByText('15 Feb 2026')).toBeInTheDocument();
    expect(screen.getByText('1 Feb 2026')).toBeInTheDocument();
  });

  it('filters non-numeric input', () => {
    render(<InteractiveTicketVerifier {...baseProps} />);
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc123def' } });
    expect(input.value).toBe('123');
  });

  it('disables submit when input is empty', () => {
    render(<InteractiveTicketVerifier {...baseProps} />);
    const submitBtn = screen.getByText('Check').closest('button');
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit when input has value', () => {
    render(<InteractiveTicketVerifier {...baseProps} />);
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '123456' } });
    const submitBtn = screen.getByText('Check').closest('button');
    expect(submitBtn).not.toBeDisabled();
  });

  it('shows latest draw date', () => {
    render(<InteractiveTicketVerifier {...baseProps} />);
    expect(screen.getByText(/Latest Draw.*1 Mar 2026/)).toBeInTheDocument();
  });
});
