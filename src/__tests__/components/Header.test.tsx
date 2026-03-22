import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../components/layout/Header';
import { useLanguage } from '../../contexts/LanguageContext';

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: any) => <a href={href} {...rest}>{children}</a>,
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('../../components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

describe('Header', () => {
  const mockToggleLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      t: {
        header: { home: 'Home', results: 'Results', news: 'News' },
      },
      language: 'en',
      toggleLanguage: mockToggleLanguage,
    });
  });

  it('renders logo and navigation', () => {
    render(<Header />);
    expect(screen.getByAltText('LOTTOX Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
  });

  it('toggles language on button click', () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText('Switch language to Thai'));
    expect(mockToggleLanguage).toHaveBeenCalled();
  });

  it('shows language code', () => {
    render(<Header />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('opens and closes mobile menu', () => {
    render(<Header />);
    const menuBtn = screen.getByLabelText('Open menu');
    fireEvent.click(menuBtn);
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(screen.queryByLabelText('Mobile navigation')).not.toBeInTheDocument();
  });

  it('includes the ThemeToggle', () => {
    render(<Header />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });
});
