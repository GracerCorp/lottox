"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
      <AlertCircle className="mb-4 h-16 w-16 text-red-500/80" />
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Something went wrong!
      </h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        We apologize for the inconvenience. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-gold-500 px-6 py-3 font-medium text-black transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
      >
        Try again
      </button>
    </div>
  );
}
