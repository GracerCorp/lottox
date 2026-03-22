import React, { useEffect } from 'vitest'; // Vitest polyfills standard React
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';

vi.mock('@/lib/i18n', () => ({
  getDictionary: vi.fn(),
  defaultDict: { common: { title: 'English' } },
}));

import { getDictionary } from '@/lib/i18n';

// Test component to consume context
function TestComponent() {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="dict">{(t as any).common.title}</span>
      <button onClick={() => setLanguage('th')} data-testid="set-th">Set TH</button>
      <button onClick={toggleLanguage} data-testid="toggle">Toggle</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.lang = 'en';
  });

  it('provides default english context out of tree', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('loads saved language from localStorage on mount', async () => {
    localStorage.setItem('language', 'th');
    (getDictionary as any).mockResolvedValue({ common: { title: 'Thai' } });

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    expect(screen.getByTestId('lang').textContent).toBe('th');
    expect(document.documentElement.lang).toBe('th');
  });

  it('allows setting language explicitly', async () => {
    (getDictionary as any).mockResolvedValue({ common: { title: 'Thai' } });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('set-th'));
    });

    expect(screen.getByTestId('lang').textContent).toBe('th');
    expect(localStorage.getItem('language')).toBe('th');
    expect(document.documentElement.lang).toBe('th');
  });

  it('allows toggling language', async () => {
    (getDictionary as any).mockResolvedValue({ common: { title: 'Thai' } });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('toggle')); // Toggles from en to th
    });

    expect(screen.getByTestId('lang').textContent).toBe('th');

    await act(async () => {
      fireEvent.click(screen.getByTestId('toggle')); // Toggles back to en
    });

    expect(screen.getByTestId('lang').textContent).toBe('en');
  });
});
