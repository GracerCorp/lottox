import Link from "next/link";
import { Globe, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              <span className="font-bold text-navy-900">L</span>
            </div>
            <span className="text-xl font-bold tracking-wider text-white">
              LOTTO<span className="text-gold-500">X</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {["Global Draws", "Results", "Statistics", "News"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className="text-md font-medium text-gray-300 transition-colors hover:text-gold-400"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-md font-medium text-gray-300 hover:text-white">
            <Globe className="h-4 w-4" />
            <span>EN</span>
          </button>

          <Link
            href="/login"
            className="hidden rounded-lg bg-navy-800 px-4 py-2 text-md font-semibold text-white transition-all hover:bg-navy-700 hover:shadow-lg md:block border border-white/10"
          >
            Sign in
          </Link>

          <button className="md:hidden p-2 text-gray-300">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
