import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import GlobalErrorComponent from '@/app/global-error';
import * as Sentry from '@sentry/nextjs';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn()
}));

vi.mock('next/error', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ statusCode }: any) => <div data-testid="next-error">NextError: {statusCode}</div>
}));

describe('Global Error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders global error component with NextError and logs to Sentry', () => {
    const testError = new Error('Global failure');

    render(<GlobalErrorComponent error={testError} />);

    expect(screen.getByTestId('next-error')).toHaveTextContent('NextError: 0');
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    expect(Sentry.captureException).toHaveBeenCalledWith(testError);
  });
});
