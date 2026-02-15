import type { Metadata } from "next";
import LaoLottoContent from "./LaoLottoContent";

export const metadata: Metadata = {
  title: "ตรวจหวยลาว ผลหวยลาวพัฒนา งวดล่าสุด | LOTTOX - ตรวจหวยลาวออนไลน์",
  description:
    "ตรวจหวยลาว ผลหวยลาวพัฒนา งวดล่าสุด เลข 4 ตัว 3 ตัว 2 ตัว อัพเดทรวดเร็ว ถูกต้อง ครบทุกงวด หวยลาววันนี้ พร้อมสถิติหวยลาวย้อนหลัง",
  keywords: [
    "หวยลาว",
    "ตรวจหวยลาว",
    "หวยลาวพัฒนา",
    "ผลหวยลาว",
    "หวยลาววันนี้",
    "Lao Lotto",
    "lottery results",
  ],
  openGraph: {
    title: "ตรวจหวยลาว ผลหวยลาวพัฒนา งวดล่าสุด | LOTTOX",
    description:
      "ตรวจหวยลาวออนไลน์ ผลหวยลาวพัฒนา งวดล่าสุด เลข 4 ตัว 3 ตัว 2 ตัว อัพเดทรวดเร็ว ถูกต้อง",
    type: "website",
    locale: "th_TH",
  },
};

function LaoLottoJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ผลหวยลาว งวดวันที่ 13 กุมภาพันธ์ 2569",
    description:
      "ตรวจหวยลาว งวดวันที่ 13 กุมภาพันธ์ 2569 เลข 4 ตัว 4045 เลข 3 ตัว 045 เลข 2 ตัว 45",
    datePublished: "2026-02-13",
    dateModified: "2026-02-13",
    author: { "@type": "Organization", name: "LOTTOX" },
    publisher: {
      "@type": "Organization",
      name: "LOTTOX",
      logo: { "@type": "ImageObject", url: "https://lottox.com/logo.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://lottox.com/results/lao-lotto",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function LaoLottoPage() {
  return (
    <>
      <LaoLottoJsonLd />
      <LaoLottoContent />
    </>
  );
}
