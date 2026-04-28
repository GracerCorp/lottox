import { describe, expect, it } from 'vitest';
import { render, } from '@testing-library/react';
import { JsonLd } from '../../components/seo/JsonLd';

describe('JsonLd', () => {
  it('renders two script tags with JSON-LD data', () => {
    const { container } = render(<JsonLd />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(2);

    const websiteData = JSON.parse(scripts[0].textContent || '');
    expect(websiteData['@type']).toBe('WebSite');
    expect(websiteData.name).toBe('LOTTOX');

    const orgData = JSON.parse(scripts[1].textContent || '');
    expect(orgData['@type']).toBe('Organization');
    expect(orgData.name).toBe('LOTTOX');
  });
});
