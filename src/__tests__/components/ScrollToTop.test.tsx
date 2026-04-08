import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTop } from '../../components/ui/ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('renders the button', () => {
    render(<ScrollToTop />);
    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('becomes visible when scrollY > 300', () => {
    render(<ScrollToTop />);
    const btn = screen.getByLabelText('Scroll to top');
    expect(btn.className).toContain('opacity-0');

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);
    expect(btn.className).toContain('opacity-100');
  });

  it('scrolls to top on click', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.scrollTo = vi.fn() as any;
    render(<ScrollToTop />);
    fireEvent.click(screen.getByLabelText('Scroll to top'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
