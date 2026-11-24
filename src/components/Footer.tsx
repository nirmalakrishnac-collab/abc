import { Lock } from 'lucide-react';
import { buildDirectionsUrl, buildWhatsAppUrl, SPA_CONFIG } from '../data/spaData';
import type { AppRoute } from './Navbar';

interface FooterProps {
  config?: typeof SPA_CONFIG;
  onNavigate?: (path: AppRoute | string) => void;
}

export function Footer({ config = SPA_CONFIG, onNavigate }: FooterProps) {
  const whatsappUrl = buildWhatsAppUrl(
    `Namaste ${config.brandName} (${config.area}), I have an enquiry regarding spa services.`,
    config.whatsappNumber
  );
  const directionsUrl = buildDirectionsUrl(config.coordinates, config.brandName, config.area);

  const handleLink = (e: React.MouseEvent, path: AppRoute) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="bg-[#1C1512] text-[#EFE3CE] pt-14 pb-24 md:pb-12 border-t border-[#C69749]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#FAF6EE]/12">
          <div className="md:col-span-5">
            <p className="font-serif text-3xl font-medium text-[#FAF6EE]">
              {config.brandName}
            </p>
            <p className="mt-3 text-sm text-[#CFC3B0] max-w-sm leading-relaxed">
              A serene luxury spa and beauty salon in Electronic City, Bangalore offering tailored massage therapies, couple wellness suites, hair spa, keratin rituals, and radiance facials.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="text-xs font-medium tracking-[0.14em] text-[#E8C57B] mb-3">
              Explore Pages
            </p>
            <a href="/" onClick={(e) => handleLink(e, '/')} className="block hover:text-[#FAF6EE] transition-colors">
              Home Sanctuary
            </a>
            <a href="/spa-services" onClick={(e) => handleLink(e, '/spa-services')} className="block hover:text-[#FAF6EE] transition-colors">
              Spa Massages &amp; Therapies
            </a>
            <a href="/salon-services" onClick={(e) => handleLink(e, '/salon-services')} className="block hover:text-[#FAF6EE] transition-colors">
              Hair &amp; Beauty Salon
            </a>
            <a href="/gallery" onClick={(e) => handleLink(e, '/gallery')} className="block hover:text-[#FAF6EE] transition-colors">
              Sanctuary Gallery
            </a>
            <a href="/offers" onClick={(e) => handleLink(e, '/offers')} className="block hover:text-[#FAF6EE] transition-colors">
              Offers &amp; Packages
            </a>
            <a href="/blog" onClick={(e) => handleLink(e, '/blog')} className="block hover:text-[#FAF6EE] transition-colors">
              Wellness Journal (Blog)
            </a>
            <a href="/contact" onClick={(e) => handleLink(e, '/contact')} className="block hover:text-[#FAF6EE] transition-colors">
              Contact &amp; Book
            </a>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm">
            <p className="text-xs font-medium tracking-[0.14em] text-[#E8C57B] mb-3">
              Location &amp; Hours
            </p>
            <p className="text-[#FAF6EE] font-medium">{config.displayAddressLine1}</p>
            <p className="text-[#CFC3B0]">{config.displayAddressLine2}</p>
            <p className="text-[#CFC3B0]">{config.hours}</p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-[#E8C57B]">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                WhatsApp Concierge
              </a>
              <a href={config.phoneHref} className="hover:underline tabular-nums">
                {config.phoneDisplay}
              </a>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A89B8B]">
          <p>
            &copy; {new Date().getFullYear()} {config.brandName}. {config.area}.
          </p>
          <div className="flex items-center gap-5">
            <span>Indian Luxury Wellness &amp; Massage Sanctuary</span>
            <a
              href="/client-portal"
              onClick={(e) => handleLink(e, '/client-portal')}
              className="inline-flex items-center gap-1.5 text-[#E8C57B]/85 hover:text-[#E8C57B] transition-colors font-medium"
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Client Portal</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
