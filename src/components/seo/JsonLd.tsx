/**
 * JSON-LD structured data for SEO.
 * Renders Website + Organization schema on the homepage.
 */
export function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LOTTOX",
    url: "https://lottox.today",
    description:
      "Fast, accurate, and reliable worldwide lottery results platform. Check Thai lottery, Lao lottery, and international lottery results instantly.",
    inLanguage: ["en", "th"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://lottox.today/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LOTTOX",
    url: "https://lottox.today",
    logo: "https://lottox.today/logo.png",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "Thai"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  );
}
