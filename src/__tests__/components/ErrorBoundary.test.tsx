import React from "react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AlertCircle: (props: any) => <span data-testid="alert-icon" {...props} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RefreshCcw: (props: any) => <span data-testid="refresh-icon" {...props} />,
}));

// Component that throws
const ThrowingComponent = () => {
  throw new Error("Test error message");
};

// Component that works
const WorkingComponent = () => <div data-testid="working">Works fine</div>;

describe("ErrorBoundary", () => {
  // Suppress console.error for expected errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("working")).toBeInTheDocument();
  });

  it("renders fallback UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("error-boundary-fallback")).toBeInTheDocument();
  });

  it("displays error message in fallback", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("displays custom fallback message", () => {
    render(
      <ErrorBoundary fallbackMessage="Custom error text">
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom error text")).toBeInTheDocument();
  });

  it("displays custom retry label", () => {
    render(
      <ErrorBoundary retryLabel="Retry now">
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Retry now")).toBeInTheDocument();
  });

  it("has role='alert' on fallback for screen readers", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("error-boundary-fallback")).toHaveAttribute("role", "alert");
  });

  it("renders retry button", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("error-boundary-retry")).toBeInTheDocument();
  });

  it("defaults to 'Something went wrong' and 'Try again'", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });
});
