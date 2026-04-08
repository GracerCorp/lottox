import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubscribeButton } from '../../components/ui/SubscribeButton';
import { useLanguage } from '@/contexts/LanguageContext';

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

describe('SubscribeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({
      t: {
        common: {
          subscribe: 'Subscribe',
          subscribed: 'Subscribed',
          emailAddress: 'Email Address',
          enterEmail: 'Enter your email',
          subscribing: 'Subscribing...',
        },
        subscribe: {
          title: 'Subscribe to Lottery',
          button: 'Subscribe',
          emailLabel: 'Email Address',
          emailPlaceholder: 'Enter your email',
          placeholder: 'Enter your email',
          subscribing: 'Subscribing...',
          success: 'Subscribed successfully',
          error: 'Subscription failed'
        }
      },
      language: 'en',
    });
  });

  it('renders correctly', () => {
    render(<SubscribeButton lotteryId={1} lotteryName="Thai Lottery" />);
    expect(screen.getByTestId('subscribe-trigger')).toBeInTheDocument();
  });

  it('opens modal on click', () => {
    render(<SubscribeButton lotteryId={1} lotteryName="Thai Lottery" />);
    fireEvent.click(screen.getByTestId('subscribe-trigger'));
    
    expect(screen.getByText('Subscribe to Lottery')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('submits email successfully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    render(<SubscribeButton lotteryId={1} lotteryName="Thai Lottery" />);
    
    // Open Modal
    fireEvent.click(screen.getByTestId('subscribe-trigger'));
    
    // Fill Input
    const input = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    // Submit
    fireEvent.click(screen.getByTestId('subscribe-submit')); // The submit button inside the modal

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://lotto-x-cms.vercel.app/api/v1/users/_/subscriptions', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', lotteryId: 1 })
      }));
    });
  });

  it('shows error state when subscription fails', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Subscription failed' })
    });

    render(<SubscribeButton lotteryId={1} lotteryName="Thai Lottery" />);
    
    // Open Modal
    fireEvent.click(screen.getByTestId('subscribe-trigger'));
    
    // Fill Input
    const input = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    // Submit
    fireEvent.click(screen.getByTestId('subscribe-submit'));

    await waitFor(() => {
      expect(screen.getByText('Subscription failed')).toBeInTheDocument();
    });
  });
});
