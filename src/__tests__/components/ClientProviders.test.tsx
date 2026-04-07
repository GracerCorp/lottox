import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClientProviders } from '@/components/ClientProviders';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: any) => <div data-testid="theme-provider">{children}</div>
}));
vi.mock('@/contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }: any) => <div data-testid="language-provider">{children}</div>
}));
vi.mock('@/contexts/FeatureToggleContext', () => ({
  FeatureToggleProvider: ({ children }: any) => <div data-testid="feature-toggle-provider">{children}</div>
}));

describe('ClientProviders', () => {
  it('renders children without crashing through providers', () => {
    render(
      <ClientProviders featureToggles={{}}>
        <div data-testid="test-child">Child</div>
      </ClientProviders>
    );
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('feature-toggle-provider')).toBeInTheDocument();
    expect(screen.getByTestId('language-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
