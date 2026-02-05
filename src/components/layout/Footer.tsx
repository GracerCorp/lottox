import Link from "next/link";
import { Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg">
                <Star className="text-navy-900 w-5 h-5 fill-current" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                LOTTO<span className="text-gold-400">X</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The Global Platform for Verified Lottery Results. Real-Time Data
              from 50+ Countries. We are an information hub and do not sell
              tickets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {["Global Draws", "Results", "Statistics", "News"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {["About Us", "Contact", "FAQ", "API Access"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {[
                "Disclaimer",
                "Terms of Service",
                "Privacy Policy",
                "Responsible Use",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto mb-4">
            Golden Disclaimer: LOTTOX is strictly an informational platform. We
            are not affiliated with any official lottery organization. We do not
            sell tickets or operate any gambling activities. Users should verify
            all results with official sources.
          </p>
          <div className="flex justify-between items-center flex-col md:flex-row gap-4">
            <p className="text-xs text-gray-500">
              © 2024 LOTTOX. All rights reserved.
            </p>
            <div className="flex gap-4">
              {/* Placeholder for Payment/Trust Icons if needed, or Social Icons */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
