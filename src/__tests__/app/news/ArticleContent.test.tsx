import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewsArticleContent from '@/app/news/[slug]/NewsArticleContent';
import { useLanguage } from '@/contexts/LanguageContext';
import * as navigation from 'next/navigation';

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), back: vi.fn() })),
  usePathname: vi.fn(() => '/news/test-article'),
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('lucide-react', () => ({
  Clock: () => <span data-testid="clock-icon" />,
  Calendar: () => <span data-testid="calendar-icon" />,
  Share2: () => <span data-testid="share-icon" />,
  Facebook: () => <span data-testid="facebook-icon" />,
  Twitter: () => <span data-testid="twitter-icon" />,
  LinkIcon: () => <span data-testid="link-icon" />,
  Link: () => <span data-testid="link-icon-2" />,
  Check: () => <span data-testid="check-icon" />,
  ChevronLeft: () => <span data-testid="back-icon" />,
  ArrowRight: () => <span data-testid="next-icon" />,
  ArrowLeft: () => <span data-testid="prev-icon" />,
}));

// Mock related components
vi.mock('@/components/ui/Container', () => ({
  Container: ({ children }: any) => <div data-testid="container">{children}</div>,
}));
vi.mock('@/components/ui/JsonLd', () => ({
  ArticleJsonLd: () => <div data-testid="json-ld" />,
}));
vi.mock('@/components/news/NewsSidebar', () => ({
  NewsSidebar: () => <div data-testid="news-sidebar" />,
}));

describe('ArticleContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      language: 'en',
      t: {
        common: {
          shareMsg: 'Share this article',
          copyLink: 'Copy link',
        },
        news: {
          backToNews: 'Back to News',
        },
      },
    });
  });

  const mockArticle = {
    slug: 'test-article',
    title: 'Test Article Title',
    titleEn: 'Test English Title',
    image: '/test.jpg',
    category: 'Lottery',
    categoryEn: 'Lottery En',
    date: 'March 1, 2026',
    author: 'Admin',
    content: '<p>This is a test <strong>content</strong> block.</p>',
    contentEn: '<p>English content.</p>',
    excerpt: 'Test excerpt',
    excerptEn: 'English excerpt',
  };

  it('renders English content when lang is en', () => {
    render(<NewsArticleContent article={mockArticle} />);
    
    expect(screen.getByText('Test English Title')).toBeInTheDocument();
    expect(screen.getByText('Lottery En')).toBeInTheDocument();
    expect(screen.getByText('March 1, 2026')).toBeInTheDocument();
    
    // Check that HTML content renders
    const contentArea = screen.getByText('English content.');
    expect(contentArea).toBeInTheDocument();
  });

  it('renders fallback native content when lang is th', () => {
    (useLanguage as any).mockReturnValue({ 
      language: 'th', 
      t: { 
        common: {},
        news: { backToNews: 'Back to News' } 
      } 
    });

    render(<NewsArticleContent article={mockArticle} />);
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('Lottery')).toBeInTheDocument();
  });

  it('renders TipTap rich content correctly', () => {
    const tipTapContent = JSON.stringify({
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Heading 1' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Heading 2' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Heading 3' }] },
        { type: 'paragraph', content: [
          { type: 'text', text: 'Bold text', marks: [{ type: 'bold' }] },
          { type: 'text', text: 'Italic text', marks: [{ type: 'italic' }] },
          { type: 'text', text: 'Underline text', marks: [{ type: 'underline' }] },
          { type: 'text', text: 'Strike text', marks: [{ type: 'strike' }] },
          { type: 'text', text: 'Link text', marks: [{ type: 'link', attrs: { href: 'http://test.com', target: '_blank' } }] }
        ] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bullet Item' }] }] }] },
        { type: 'orderedList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ordered Item' }] }] }] },
        { type: 'image', attrs: { src: '/img.png', alt: 'img alt', title: 'img title' } },
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'quote text' }] }]},
        { type: 'codeBlock', content: [{ type: 'text', text: 'const a = 1;' }]},
        { type: 'horizontalRule' },
        { type: 'hardBreak' }
      ]
    });

    render(<NewsArticleContent article={{ ...mockArticle, content: tipTapContent, contentEn: tipTapContent }} />);
    
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 3')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('Italic text')).toBeInTheDocument();
    expect(screen.getByText('Underline text')).toBeInTheDocument();
    expect(screen.getByText('Strike text')).toBeInTheDocument();
    expect(screen.getByText('Link text')).toHaveAttribute('href', 'http://test.com');
    expect(screen.getByText('Bullet Item')).toBeInTheDocument();
    expect(screen.getByText('Ordered Item')).toBeInTheDocument();
    expect(screen.getByText('img title')).toBeInTheDocument();
    expect(screen.getByText('quote text')).toBeInTheDocument();
    expect(screen.getByText('const a = 1;')).toBeInTheDocument();
  });
});
