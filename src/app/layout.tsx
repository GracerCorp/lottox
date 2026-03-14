import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/ClientProviders";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOTTOX - ตรวจหวยออนไลน์ ผลหวยไทย หวยลาว งวดล่าสุด",
  description:
    "LOTTOX แพลตฟอร์มตรวจหวยออนไลน์ ผลสลากกินแบ่งรัฐบาล ผลหวยลาวพัฒนา งวดล่าสุด อัพเดทรวดเร็ว ถูกต้อง แม่นยำ ครบทุกรางวัล",
  metadataBase: new URL("https://lottox.today"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LOTTOX - ตรวจหวยออนไลน์ ผลหวยไทย หวยลาว",
    description:
      "แพลตฟอร์มตรวจหวยออนไลน์ ผลหวยไทย หวยลาว งวดล่าสุด ครบทุกรางวัล",
    type: "website",
    locale: "th_TH",
    siteName: "LOTTOX",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOTTOX - ตรวจหวยออนไลน์",
    description: "ผลสลากกินแบ่งรัฐบาล ผลหวยลาวพัฒนา งวดล่าสุด",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      lang="th"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansThai.variable}`}
    >
      <body className="font-sans min-h-screen flex flex-col relative overflow-x-hidden">
        <ClientProviders>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTop />
        </ClientProviders>
      </body>
    </html>
  );
}
