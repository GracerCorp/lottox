import type { Metadata } from "next";
import ThaiLottoContent from "./ThaiLottoContent";

export const metadata: Metadata = {
  title: "ตรวจหวย ผลสลากกินแบ่งรัฐบาล งวดล่าสุด | LOTTOX - ตรวจหวยออนไลน์",
  description:
    "ตรวจหวย ผลสลากกินแบ่งรัฐบาล งวดล่าสุด ครบทุกรางวัล รางวัลที่ 1 เลขหน้า 3 ตัว เลขท้าย 3 ตัว เลขท้าย 2 ตัว รางวัลข้างเคียง รางวัลที่ 2-5 อัพเดทรวดเร็ว ถูกต้อง แม่นยำ",
  keywords: [
    "ตรวจหวย",
    "ผลสลากกินแบ่งรัฐบาล",
    "หวยรัฐบาล",
    "ผลหวย",
    "ตรวจสลาก",
    "Thai Lotto",
    "GLO",
    "lottery results",
  ],
  openGraph: {
    title: "ตรวจหวย ผลสลากกินแบ่งรัฐบาล งวดล่าสุด | LOTTOX",
    description:
      "ตรวจหวยออนไลน์ ผลสลากกินแบ่งรัฐบาล งวดล่าสุด ครบทุกรางวัล อัพเดทรวดเร็ว ถูกต้อง",
    type: "website",
    locale: "th_TH",
  },
};

function ThaiLottoJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ผลสลากกินแบ่งรัฐบาล งวดวันที่ 1 กุมภาพันธ์ 2569",
    description:
      "ตรวจหวย ผลสลากกินแบ่งรัฐบาล งวดวันที่ 1 กุมภาพันธ์ 2569 รางวัลที่ 1 คือ 174629",
    datePublished: "2026-02-01",
    dateModified: "2026-02-01",
    author: { "@type": "Organization", name: "LOTTOX" },
    publisher: {
      "@type": "Organization",
      name: "LOTTOX",
      logo: { "@type": "ImageObject", url: "https://upload.wikimedia.org/wikipedia/commons/2/21/GLO_Logo.svg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://lottox.com/results/thai-lotto",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function ThaiLottoPage() {
  return (
    <>
      <ThaiLottoJsonLd />
      <ThaiLottoContent />
    </>
  );
}
