import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TicketVerifier } from '../../components/country/TicketVerifier';
import { useLanguage } from '@/contexts/LanguageContext';

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

describe('TicketVerifier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({
      t: {
        common: {
          verifyTicketTitle: 'Verify Ticket',
          verifyTicketDesc: 'Desc',
          enterYourNumbers: 'Enter your 6-digit number',
          inputPlaceholder: 'Enter your 6-digit number',
          checkBtn: 'Check Draw',
          separateTickets: 'Separate tickets with space or comma',
        },
        lottery: {
          verifyTicket: 'Verify Ticket',
          enterTicketNumber: 'Enter your 6-digit number',
          checkDraw: 'Check Draw',
          verifying: 'Verifying...',
          matched: 'Congratulations! You won',
          noMatch: 'Sorry, no match this time',
          pleaseEnterValidNumber: 'Please enter a valid 6-digit ticket number'
        }
      },
      language: 'en',
    });
  });

  const mockLottery = { id: 1, slug: 'thai-lottery' };
  
  it('renders correctly', () => {
    render(<TicketVerifier country="th" />);
    
    expect(screen.getByText('Verify Ticket')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your 6-digit number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check Draw' })).toBeInTheDocument();
  });

  it('does not alert if input is empty', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<TicketVerifier country="th" />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Check Draw' }));

    expect(alertMock).not.toHaveBeenCalled();
    alertMock.mockRestore();
  });

  it('calls alert on check when valid input is provided', async () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<TicketVerifier country="th" />);
    
    const input = screen.getByPlaceholderText('Enter your 6-digit number');
    fireEvent.change(input, { target: { value: '123456' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Check Draw' }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Checking numbers for th: 123456');
    });

    alertMock.mockRestore();
  });
});
