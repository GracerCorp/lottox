import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useApi } from '../../lib/hooks/useApi';

describe('useApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data on successful fetch', async () => {
    const mockData = { results: [1, 2, 3] };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('returns error on non-ok response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useApi('/api/fail'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('API Error: 500');
  });

  it('returns error on fetch exception', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useApi('/api/error'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network failure');
  });

  it('handles non-Error exceptions', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue('string error');

    const { result } = renderHook(() => useApi('/api/error'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('An unknown error occurred');
  });

  it('does nothing when url is null', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    const { result } = renderHook(() => useApi(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('refetch re-triggers the fetch', async () => {
    let callCount = 0;
    vi.spyOn(global, 'fetch').mockImplementation(async () => {
      callCount++;
      return { ok: true, json: async () => ({ count: callCount }) } as Response;
    });

    const { result } = renderHook(() => useApi('/api/count'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ count: 1 });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.data).toEqual({ count: 2 });
  });
});
