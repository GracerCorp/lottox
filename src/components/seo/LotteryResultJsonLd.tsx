/**
 * Lottery result JSON-LD structured data for rich search snippets.
 * Renders an Event schema that Google can display as a rich result.
 */
interface LotteryResultJsonLdProps {
  lotteryName: string;
  countryName: string;
  drawDate: string;
  numbers?: string[];
  jackpotAmount?: string;
  currency?: string;
  url?: string;
}

export function LotteryResultJsonLd({
  lotteryName,
  countryName,
  drawDate,
  numbers,
  jackpotAmount,
  currency,
  url,
}: LotteryResultJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${lotteryName} Draw Results - ${drawDate}`,
    description: `Official ${lotteryName} lottery results for ${drawDate} from ${countryName}.${numbers?.length ? ` Winning numbers: ${numbers.join(", ")}.` : ""}`,
    startDate: drawDate,
    endDate: drawDate,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: url || `https://lottox.today`,
    },
    organizer: {
      "@type": "Organization",
      name: "LOTTOX",
      url: "https://lottox.today",
    },
    ...(jackpotAmount
      ? {
          offers: {
            "@type": "Offer",
            price: jackpotAmount,
            priceCurrency: currency || "USD",
            availability: "https://schema.org/InStock",
            validFrom: drawDate,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
