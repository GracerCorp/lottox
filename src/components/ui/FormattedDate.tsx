/**
 * Renders a date inside a semantic <time> HTML element with proper datetime attribute.
 * This provides machine-readable date information for search engines and screen readers.
 *
 * @example
 * <FormattedDate date="2025-03-16" />
 * // Renders: <time datetime="2025-03-16">2025-03-16</time>
 *
 * <FormattedDate date="2025-03-16" format="long" />
 * // Renders: <time datetime="2025-03-16">March 16, 2025</time>
 */

interface FormattedDateProps {
  /** ISO date string (e.g. "2025-03-16") */
  date: string;
  /** Display format: "iso" (default) or "long" */
  format?: "iso" | "long";
  /** Additional CSS classes */
  className?: string;
}

export function FormattedDate({
  date,
  format = "iso",
  className,
}: FormattedDateProps) {
  const displayText =
    format === "long"
      ? new Date(date + "T00:00:00").toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : date;

  return (
    <time dateTime={date} className={className} data-testid="formatted-date">
      {displayText}
    </time>
  );
}
