import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CookieConsent } from '../../components/ui/CookieConsent';

vi.mock('next/link', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('framer-motion', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('CookieConsent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows consent banner after delay when no cookie_consent in localStorage', () => {
    render(<CookieConsent />);
    // Not shown immediately
    expect(screen.queryByText('ยอมรับ')).not.toBeInTheDocument();

    // After timeout
    act(() => { vi.advanceTimersByTime(1100); });
    expect(screen.getByText('ยอมรับ')).toBeInTheDocument();
  });

  it('does not show banner when consent already given', () => {
    localStorage.setItem('cookie_consent', 'true');
    render(<CookieConsent />);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.queryByText('ยอมรับ')).not.toBeInTheDocument();
  });

  it('accepts cookies and hides banner', () => {
    render(<CookieConsent />);
    act(() => { vi.advanceTimersByTime(1100); });

    fireEvent.click(screen.getByText('ยอมรับ'));
    expect(localStorage.getItem('cookie_consent')).toBe('true');
    expect(screen.queryByText('ยอมรับ')).not.toBeInTheDocument();
  });

  it('dismisses banner on close click', () => {
    render(<CookieConsent />);
    act(() => { vi.advanceTimersByTime(1100); });

    fireEvent.click(screen.getByLabelText('ปิด'));
    expect(screen.queryByText('ยอมรับ')).not.toBeInTheDocument();
  });
});
