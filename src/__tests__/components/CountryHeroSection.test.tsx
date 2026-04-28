/* eslint-disable @next/next/no-img-element */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountryHeroSection } from '../../components/country/CountryHeroSection';
import { useLanguage } from '../../contexts/LanguageContext';

vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: vi.fn() }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} alt="" /> }));

describe('CountryHeroSection', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({
      t: { country: { officialResults: 'Official Results' } },
    });
  });

  it('renders country name and flag', () => {
    render(<CountryHeroSection countryName="Thailand" countryCode="th" flag="/flags/th.svg" />);
    expect(screen.getByTestId('country-name')).toHaveTextContent('Thailand');
    expect(screen.getByTestId('country-flag')).toBeInTheDocument();
    expect(screen.getByTestId('official-results-label')).toHaveTextContent('Official Results');
  });

  it('renders placeholder when no flag URL', () => {
    render(<CountryHeroSection countryName="Laos" countryCode="la" flag={null} />);
    expect(screen.getByTestId('country-flag-placeholder')).toHaveTextContent('LA');
    expect(screen.getByTestId('country-name')).toHaveTextContent('Laos');
  });

  it('uses fallback when t.country is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useLanguage as any).mockReturnValue({ t: {} });
    render(<CountryHeroSection countryName="Vietnam" countryCode="vn" flag="/flags/vn.svg" />);
    expect(screen.getByTestId('official-results-label')).toHaveTextContent('Official Results');
  });
});
