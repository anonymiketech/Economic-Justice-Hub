import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Pillars", href: "/pillars" },
    { label: "Programs", href: "/programs" },
    { label: "Research", href: "/research" },
    { label: "Events", href: "/events" },
    { label: "Contact", href: "/contact" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="bg-[#0e1f3d] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Row */}
        <div className="flex items-center py-3 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="EJF Logo"
              className="h-14 w-14 rounded-md object-cover"
            />
            <div>
              <div className="text-white font-bold text-lg leading-tight">
                Economic Justice Forum (EJF)
              </div>
              <div className="text-[#d4a017] text-xs font-semibold tracking-widest uppercase">
                Equity &bull; Justice &bull; Prosperity
              </div>
            </div>
          </Link>
        </div>

        {/* Nav Links Row */}
        <div className="hidden md:flex items-center justify-between py-2">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/donate"
              className="bg-[#d4a017] hover:bg-[#b8891a] text-white font-semibold px-6 py-2 rounded text-sm transition-colors"
            >
              Donate
            </Link>
            <Link
              href="/login"
              className="text-white/90 hover:text-white text-sm font-medium px-3 py-2 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center justify-end py-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a1628] border-t border-white/10">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              className="bg-[#d4a017] hover:bg-[#b8891a] text-white font-semibold px-4 py-2 rounded text-sm transition-colors mt-2 text-center"
              onClick={() => setMobileOpen(false)}
            >
              Donate
            </Link>
            <Link
              href="/login"
              className="text-white/90 hover:text-white text-sm font-medium px-3 py-2"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
