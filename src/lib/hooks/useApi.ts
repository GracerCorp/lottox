"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url: string | null, options?: RequestInit) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: !!url,
    error: null,
  });

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async () => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, optionsRef.current);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const json = await response.json();
      setState({ data: json as T, loading: false, error: null });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setState({ data: null, loading: false, error: err.message });
      } else {
        setState({
          data: null,
          loading: false,
          error: "An unknown error occurred",
        });
      }
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
