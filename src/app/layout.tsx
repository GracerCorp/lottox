import type { Metadata } from "next";
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
  metadataBase: new URL("https://lottox.com"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansThai.variable} font-sans min-h-screen flex flex-col relative overflow-x-hidden`}
      >
        <ClientProviders>
          {/* Background Effects */}
          <div className="fixed inset-0 z-[-1] bg-navy-950">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,11,26,1),rgba(0,0,0,0))]" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
            {/* Stars Mockup (CSS) */}
            <div className="absolute top-10 left-1/4 h-1 w-1 rounded-full bg-white opacity-40 shadow-[0_0_10px_white]" />
            <div className="absolute top-40 right-1/3 h-0.5 w-0.5 rounded-full bg-gold-300 opacity-60 shadow-[0_0_8px_gold]" />
            <div className="absolute bottom-1/4 left-1/3 h-1 w-1 rounded-full bg-blue-300 opacity-30 shadow-[0_0_12px_blue]" />
          </div>

          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTop />
        </ClientProviders>
      </body>
    </html>
  );
}
