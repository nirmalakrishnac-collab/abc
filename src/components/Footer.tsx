import { buildDirectionsUrl, buildWhatsAppUrl, SPA_CONFIG } from '../data/spaData';

export function Footer() {
  const whatsappUrl = buildWhatsAppUrl(
    `Namaste ${SPA_CONFIG.brandName} (${SPA_CONFIG.area}), I have an enquiry regarding spa services.`
  );
  const directionsUrl = buildDirectionsUrl();

  return (
    <footer className="bg-[#1C1512] text-[#EFE3CE] pt-14 pb-24 md:pb-12 border-t border-[#C69749]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#FAF6EE]/12">
          <div className="md:col-span-5">
            <p className="font-serif text-3xl font-medium text-[#FAF6EE]">
              {SPA_CONFIG.brandName}
            </p>
            <p className="mt-3 text-sm text-[#CFC3B0] max-w-sm leading-relaxed">
              A serene luxury spa in Electronic City, Bangalore offering tailored massage therapies, aromatherapy, and restorative couple wellness rituals.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="text-xs font-medium tracking-[0.14em] text-[#E8C57B] mb-3">
              Explore
            </p>
            <a href="#services" className="block hover:text-[#FAF6EE] transition-colors">
              Spa Services
            </a>
            <a href="#why-spark" className="block hover:text-[#FAF6EE] transition-colors">
              Why Spark Spa
            </a>
            <a href="#gallery" className="block hover:text-[#FAF6EE] transition-colors">
              Sanctuary Gallery
            </a>
            <a href="#offers" className="block hover:text-[#FAF6EE] transition-colors">
              Offers &amp; Packages
            </a>
            <a href="#booking" className="block hover:text-[#FAF6EE] transition-colors">
              Book Appointment
            </a>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm">
            <p className="text-xs font-medium tracking-[0.14em] text-[#E8C57B] mb-3">
              Location &amp; Hours
            </p>
            <p className="text-[#FAF6EE] font-medium">{SPA_CONFIG.displayAddressLine1}</p>
            <p className="text-[#CFC3B0]">{SPA_CONFIG.displayAddressLine2}</p>
            <p className="text-[#CFC3B0]">{SPA_CONFIG.hours}</p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-[#E8C57B]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                WhatsApp Concierge
              </a>
              <a href={SPA_CONFIG.phoneHref} className="hover:underline tabular-nums">
                {SPA_CONFIG.phoneDisplay}
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A89B8B]">
          <p>
            &copy; {new Date().getFullYear()} {SPA_CONFIG.brandName}. Electronic City, Bangalore.
          </p>
          <p>Indian Luxury Wellness &amp; Massage Sanctuary</p>
        </div>
      </div>
    </footer>
  );
}
