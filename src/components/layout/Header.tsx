"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { label: t.header.home, href: "/" },
    { label: t.header.results, href: "/global-draws" },
    { label: t.header.news, href: "/news" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-navy-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-navy-950/60 transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-auto overflow-hidden pt-2">
              <Image
                src="/logo-text.png"
                alt="LOTTOX Logo"
                height={100}
                width={100}
                className="object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gold-500 dark:hover:text-gold-400",
                pathname === item.href
                  ? "text-gold-600 dark:text-gold-400"
                  : "text-gray-600 dark:text-gray-400",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-black dark:hover:text-white"
            aria-label={`Switch language to ${language === "en" ? "Thai" : "English"}`}
          >
            <Globe className="h-4 w-4" />
            <span>{language.toUpperCase()}</span>
          </button>

          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900 md:hidden">
          <nav
            className="flex flex-col p-4 space-y-4"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gold-500 dark:hover:text-gold-400",
                  pathname === item.href
                    ? "text-gold-600 dark:text-gold-400"
                    : "text-gray-600 dark:text-gray-300",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
