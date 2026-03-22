import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NewsSidebar } from '../../components/ui/NewsSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApi } from '@/lib/hooks/useApi';

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('@/lib/hooks/useApi', () => ({
  useApi: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => <a href={href} className={className}>{children}</a>,
}));

describe('NewsSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      t: { common: { newsTitle: 'Latest News' } },
      language: 'en',
    });
  });

  it('renders loading state correctly', () => {
    (useApi as any).mockReturnValue({ data: null, loading: true });

    const { container } = render(<NewsSidebar limit={3} />);
    
    // Check title
    expect(screen.getByText('Latest News')).toBeInTheDocument();
    
    // Pulse skeletons
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(3);
  });

  it('renders correctly with article data (English)', () => {
    (useApi as any).mockReturnValue({
      data: {
        articles: [
          {
            slug: 'article-1',
            title: 'Thai layout title',
            titleEn: 'English Layout Title',
            image: '/test.jpg',
            category: 'Lotto',
            categoryEn: 'Lottery',
            date: 'March 1, 2026',
          }
        ]
      },
      loading: false,
    });

    render(<NewsSidebar category="Lottery" />);

    expect(useApi).toHaveBeenCalledWith('/api/news?lang=en&limit=5&category=Lottery');
    
    expect(screen.getByText('English Layout Title')).toBeInTheDocument();
    expect(screen.getByText('Lottery')).toBeInTheDocument();
    expect(screen.getByText('March 1, 2026')).toBeInTheDocument();
  });

  it('renders correctly with article data (Thai fallback)', () => {
    (useLanguage as any).mockReturnValue({
      t: { common: { newsTitle: 'ข่าวสาร' } },
      language: 'th',
    });

    (useApi as any).mockReturnValue({
      data: {
        articles: [
          {
            slug: 'article-2',
            title: 'Thai Native Title',
            image: '/test2.jpg',
            category: 'ลอตเตอรี่',
            date: '1 มีนาคม 2026',
          }
        ]
      },
      loading: false,
    });

    render(<NewsSidebar />);

    expect(screen.getByText('ข่าวสาร')).toBeInTheDocument();
    expect(screen.getByText('Thai Native Title')).toBeInTheDocument();
    expect(screen.getByText('ลอตเตอรี่')).toBeInTheDocument();
    expect(screen.getByText('1 มีนาคม 2026')).toBeInTheDocument();
  });

  it('renders empty state correctly (English)', () => {
    (useApi as any).mockReturnValue({
      data: { articles: [] },
      loading: false,
    });

    render(<NewsSidebar />);
    expect(screen.getByText('No news available at the moment')).toBeInTheDocument();
  });

  it('renders empty state correctly (Thai)', () => {
    (useLanguage as any).mockReturnValue({
      t: { common: { newsTitle: 'ข่าวสาร' } },
      language: 'th',
    });
    (useApi as any).mockReturnValue({
      data: null, // Test edge case where data itself is null
      loading: false,
    });

    render(<NewsSidebar />);
    expect(screen.getByText('ยังไม่มีข่าวสารในขณะนี้')).toBeInTheDocument();
  });
});
