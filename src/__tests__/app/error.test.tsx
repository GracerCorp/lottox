import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundaryComponent from '@/app/error';

vi.mock('lucide-react', () => ({
  AlertCircle: () => <span data-testid="alert-icon" />
}));

describe('Error Boundaries', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders error component correctly and calls reset', () => {
    const mockReset = vi.fn();
    const testError = new Error('Test generic error');

    render(<ErrorBoundaryComponent error={testError} reset={mockReset} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByText('We apologize for the inconvenience. Please try again.')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();

    const tryAgainBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(tryAgainBtn);

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(testError);
  });
});
