import { MessageCircle, Navigation, Phone } from 'lucide-react';
import { buildDirectionsUrl, buildWhatsAppUrl, SPA_CONFIG } from '../data/spaData';

export function MobileStickyBar({ config = SPA_CONFIG }: { config?: typeof SPA_CONFIG }) {
  const whatsappUrl = buildWhatsAppUrl(
    `Namaste ${config.brandName} (${config.area}), I would like to book an appointment.`,
    config.whatsappNumber
  );
  const directionsUrl = buildDirectionsUrl(config.coordinates, config.brandName, config.area);

  return (
    <nav
      aria-label="Quick mobile actions"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#FAF6EE]/95 backdrop-blur-md border-t border-[#C69749]/35 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(28,21,18,0.12)]"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 py-2 bg-[#1B4D3E] text-[#FAF6EE] rounded-full text-xs font-semibold active:scale-[0.98] transition-transform whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 text-[#E8C57B] shrink-0" aria-hidden="true" />
          <span className="truncate">Chat Now</span>
        </a>

        <a
          href={config.phoneHref}
          className="flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 py-2 bg-[#5C1728] text-[#FAF6EE] rounded-full text-xs font-medium active:scale-[0.98] transition-transform whitespace-nowrap"
        >
          <Phone className="w-4 h-4 text-[#E8C57B] shrink-0" aria-hidden="true" />
          <span className="truncate">Call Now</span>
        </a>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 py-2 bg-[#D9B263] text-[#1C1512] rounded-full text-xs font-semibold active:scale-[0.98] transition-transform whitespace-nowrap"
        >
          <Navigation className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Directions</span>
        </a>
      </div>
    </nav>
  );
}
