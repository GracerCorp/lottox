import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../components/layout/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Footer', () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({
      t: {
        footer: {
          worldDashboard: 'World Dashboard',
          faq: 'FAQ',
          contact: 'Contact',
          disclaimer: 'Disclaimer',
          terms: 'Terms',
          privacy: 'Privacy',
          whyTitle: 'Why LOTTOX?',
          whyDesc1: 'Trusted.',
          whyDesc2: 'Fast results worldwide.',
        },
        staticParams: {
          disclaimer: { shortDisclaimer: 'This is for informational purposes.' },
        },
      },
    });
  });

  it('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('World Dashboard')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  it('renders why title and description', () => {
    render(<Footer />);
    expect(screen.getByText('Why LOTTOX?')).toBeInTheDocument();
    expect(screen.getByText('Trusted.')).toBeInTheDocument();
  });

  it('renders short disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText('This is for informational purposes.')).toBeInTheDocument();
  });
});
