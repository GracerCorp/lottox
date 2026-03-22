import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: mockSetTheme }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the toggle button after mounting', async () => {
    render(<ThemeToggle />);
    // After useEffect, mounted = true
    await act(() => Promise.resolve());
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('calls setTheme on click', async () => {
    render(<ThemeToggle />);
    await act(() => Promise.resolve());
    fireEvent.click(screen.getByLabelText('Toggle theme'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
