import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BackgroundFlare } from '@/components/ui/BackgroundFlare';

describe('BackgroundFlare', () => {
  it('renders framer-motion elements without crashing', () => {
    const { container } = render(<BackgroundFlare />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
