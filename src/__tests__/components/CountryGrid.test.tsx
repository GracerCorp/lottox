import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CountryGrid } from '@/components/ui/CountryGrid';
import { getActiveCountries } from '@/lib/services/lotteryService';

vi.mock('@/lib/services/lotteryService', () => ({
  getActiveCountries: vi.fn()
}));
vi.mock('@/lib/flags', () => ({
  getFlagUrl: (c: string) => `/flags/${c}.svg`
}));
vi.mock('next/link', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href }: any) => <a href={href} data-testid="mock-link">{children}</a>
}));
vi.mock('next/image', () => ({
  default: () => <img data-testid="mock-image" alt="flag" />
}));
vi.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />
}));

describe('CountryGrid', () => {
  it('renders successfully with empty countries', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (getActiveCountries as any).mockResolvedValue([]);
    const Component = await CountryGrid();
    render(Component);
    expect(screen.getByText('เลือกประเทศ')).toBeInTheDocument();
  });

  it('renders countries correctly with localization', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (getActiveCountries as any).mockResolvedValue([
      {
        id: 1,
        code: 'th',
        name: 'Thailand',
        flag: '/th.svgUrl',
        is_active: true,
        lotteries: [
          { id: 1, name: 'Thai Lottery', is_active: true }
        ]
      },
      {
        id: 2,
        code: 'la',
        name: 'Laos',
        is_active: true,
        lotteries: [
          { id: 2, name: 'Lao Lottery 1', is_active: false },
          { id: 3, name: 'Lao Lottery 2', is_active: false }
        ]
      },
      {
        id: 3,
        code: 'vn',
        name: 'Vietnam',
        is_active: true,
        lotteries: []
      },
      {
        id: 4,
        code: 'my',
        name: 'Malaysia',
        is_active: true,
        lotteries: [
          { id: 4, name: 'Magnum 4D', is_active: true }
        ]
      }
    ]);

    const Component = await CountryGrid();
    render(Component);
    
    // Thailand
    expect(screen.getByText('ไทย')).toBeInTheDocument();
    expect(screen.getByText('(Thailand)')).toBeInTheDocument();
    expect(screen.getByText('Thai Lottery')).toBeInTheDocument();

    // Laos
    expect(screen.getByText('ลาว')).toBeInTheDocument();
    expect(screen.getByText('(Laos)')).toBeInTheDocument();
    expect(screen.getByText('Lao Lottery 1')).toBeInTheDocument(); // Falls back to first lottery

    // Vietnam (no lotteries)
    expect(screen.getByText('เวียดนาม')).toBeInTheDocument();
    expect(screen.getByText('(Vietnam)')).toBeInTheDocument();
    expect(screen.getByText('0 ลอตเตอรี่')).toBeInTheDocument();

    // Malaysia (no direct translation mapping)
    expect(screen.getByText('(Malaysia)')).toBeInTheDocument();
    expect(screen.getByText('Magnum 4D')).toBeInTheDocument();
    
    const links = screen.getAllByTestId('mock-link');
    expect(links.length).toBe(4);
    expect(links[0]).toHaveAttribute('href', '/th/thai-lottery');
    expect(links[1]).toHaveAttribute('href', '/la/lao-lottery-1');
    expect(links[2]).toHaveAttribute('href', '/vn');
    expect(links[3]).toHaveAttribute('href', '/my/magnum-4d');
  });
});
