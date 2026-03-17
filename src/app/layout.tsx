import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/ClientProviders";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { CookieConsent } from "@/components/ui/CookieConsent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LOTTOX - Worldwide Lottery Results | ตรวจหวยออนไลน์",
    template: "%s | LOTTOX",
  },
  description:
    "LOTTOX — Fast, accurate worldwide lottery results. Check Thai Government Lottery, Lao Lotto, Japan Loto, and 30+ international lotteries. ตรวจหวยออนไลน์ ผลสลากกินแบ่งรัฐบาล ผลหวยลาว อัพเดทรวดเร็ว",
  metadataBase: new URL("https://lottox.today"),
  keywords: [
    "lottery results",
    "ตรวจหวย",
    "ผลหวย",
    "Thai lottery",
    "สลากกินแบ่งรัฐบาล",
    "Lao lottery",
    "หวยลาว",
    "Japan loto",
    "worldwide lottery",
    "lottery checker",
    "ตรวจสลาก",
    "ผลสลากกินแบ่ง",
    "หวยออนไลน์",
    "lottox",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      th: "/",
    },
  },
  openGraph: {
    title: "LOTTOX - Worldwide Lottery Results | ตรวจหวยออนไลน์",
    description:
      "Fast, accurate lottery results for Thai, Lao, Japan, and 30+ international lotteries. ผลหวยไทย หวยลาว ครบทุกรางวัล",
    type: "website",
    locale: "en_US",
    alternateLocale: "th_TH",
    siteName: "LOTTOX",
    url: "https://lottox.today",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LOTTOX - Worldwide Lottery Results",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOTTOX - Worldwide Lottery Results",
    description:
      "Check 30+ international lottery results instantly. Thai, Lao, Japan and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  manifest: "/manifest.json",
  category: "entertainment",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060b1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansThai.variable}`}
    >
      <body className="font-sans min-h-screen flex flex-col relative overflow-x-hidden">
        <ClientProviders>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTop />
          <CookieConsent />
        </ClientProviders>
      </body>
    </html>
  );
}
