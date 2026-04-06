import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <nav
      className={`bg-[#0e1f3d] sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-2xl" : "shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top row: logo + actions + hamburger ── */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <img
              src="/logo.jpeg"
              alt="EJF Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-md object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="text-white font-bold text-sm sm:text-base lg:text-lg leading-tight truncate">
                Economic Justice Forum (EJF)
              </div>
              <div className="text-[#d4a017] text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
                Equity &bull; Justice &bull; Prosperity
              </div>
            </div>
          </Link>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/donate"
              className="bg-[#d4a017] hover:bg-[#b8891a] text-white font-bold px-5 py-2 rounded text-sm transition-colors shadow-md"
            >
              Donate
            </Link>
            <Link
              href="/login"
              className="border border-white/30 hover:border-white/60 text-white/90 hover:text-white text-sm font-medium px-4 py-2 rounded transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden text-white p-2 rounded hover:bg-white/10 transition-colors ml-3 flex-shrink-0"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
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

        {/* ── Desktop nav links row ── */}
        <div className="hidden md:flex items-center py-1.5 gap-1 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-sm whitespace-nowrap transition-colors ${
                isActive(link.href)
                  ? "text-white bg-white/15 border-b-2 border-[#d4a017]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#081629] border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-[#d4a017]/20 text-[#d4a017] border-l-4 border-[#d4a017]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/donate"
              className="block bg-[#d4a017] hover:bg-[#b8891a] text-white font-bold px-4 py-3 rounded-lg text-sm transition-colors text-center shadow-md"
            >
              Donate
            </Link>
            <Link
              href="/login"
              className="block border border-white/30 hover:border-white/60 text-white/90 hover:text-white text-sm font-medium px-4 py-3 rounded-lg transition-colors text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
