"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, Menu, X, Star } from "lucide-react";
import { clsx } from "clsx";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
            <Star className="text-navy-900 w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            LOTTO<span className="text-gold-400">X</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {["Global Draws", "Results", "Statistics", "News"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <Globe className="w-4 h-4" />
            <span>EN</span>
          </button>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-navy-900 bg-white rounded-lg hover:bg-gold-400 hover:text-navy-950 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy-900 absolute w-full left-0">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {["Global Draws", "Results", "Statistics", "News"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className="text-base font-medium text-gray-300 hover:text-gold-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <div className="flex items-center justify-between text-gray-300">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" /> English
              </span>
            </div>
            <Link
              href="/login"
              className="w-full text-center py-3 font-semibold text-navy-900 bg-gold-400 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
