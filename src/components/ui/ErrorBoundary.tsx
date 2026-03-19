"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
  retryLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary that catches rendering errors in child components
 * and shows a graceful fallback UI instead of crashing the page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-900/10 p-6 text-center"
          role="alert"
          data-testid="error-boundary-fallback"
        >
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-fs-sm font-medium text-red-700 dark:text-red-400 mb-1">
            {this.props.fallbackMessage ?? "Something went wrong"}
          </p>
          <p className="text-fs-xs text-red-500 dark:text-red-300 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 text-fs-sm font-medium transition-colors"
            data-testid="error-boundary-retry"
          >
            <RefreshCcw className="w-4 h-4" />
            {this.props.retryLabel ?? "Try again"}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
