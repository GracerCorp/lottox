import { NextResponse } from "next/server";

/**
 * Shared API error handler that returns a consistent JSON error response.
 * Logs the error with context for Sentry / structured logging.
 */
export function handleApiError(
  error: unknown,
  context: string,
  status = 500,
): NextResponse {
  const message =
    error instanceof Error ? error.message : "An unknown error occurred";

  // Structured log for Sentry / observability
  console.error(`[API/${context}]`, {
    error: message,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(
    { error: status === 500 ? "Internal Server Error" : message },
    { status },
  );
}
