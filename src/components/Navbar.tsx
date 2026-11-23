import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type AppRoute =
  | '/'
  | '/services'
  | '/gallery'
  | '/offers'
  | '/blog'
  | '/contact'
  | '/client-portal';

interface NavbarProps {
  currentPath: string;
  brandName: string;
  onNavigate: (path: AppRoute | string) => void;
  onBookClick: () => void;
}

const NAV_LINKS: { label: string; path: AppRoute }[] = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Offers', path: '/offers' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar({ currentPath, brandName, onNavigate, onBookClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (linkPath: AppRoute) => {
    if (linkPath === '/') return currentPath === '/';
    return currentPath === linkPath || currentPath.startsWith(linkPath + '/');
  };

  return (
    <header className="relative md:sticky md:top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#C69749]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
            setMobileMenuOpen(false);
          }}
          className="font-serif text-2xl md:text-[27px] font-semibold tracking-tight text-[#1C1512] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] rounded-sm"
        >
          {brandName}
        </a>

        {/* Zone 2: 6 single-line page links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.path);
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.path);
                }}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium transition-colors duration-150 relative py-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] rounded-sm ${
                  active
                    ? 'text-[#5C1728] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C69749]'
                    : 'text-[#524740] hover:text-[#5C1728] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#C69749] hover:after:w-full after:transition-all after:duration-200'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action (+ compact mobile drawer toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onBookClick}
            className="cta-shimmer inline-flex items-center justify-center px-4 py-2 min-h-[40px] md:min-h-[42px] text-xs md:text-sm font-medium bg-[#5C1728] text-[#FAF6EE] hover:bg-[#4A1120] active:scale-[0.98] transition-all duration-150 rounded-md whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6EE]"
          >
            Book Appointment
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-[#1C1512] hover:bg-[#5C1728]/8 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#C69749]/20 bg-[#FAF6EE] px-4 py-4 space-y-1"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.path);
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center min-h-[44px] px-3 text-base font-medium rounded-md transition-colors ${
                  active
                    ? 'bg-[#5C1728] text-[#FAF6EE]'
                    : 'text-[#1C1512] hover:bg-[#F3EBD9]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
