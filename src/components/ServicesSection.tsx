import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { buildWhatsAppUrl, SERVICES_DATA, SPA_CONFIG, SpaService } from '../data/spaData';
import { LotusDivider } from './IndianMotifs';
import { SpaImage } from './SpaImage';

interface ServicesSectionProps {
  services?: SpaService[];
  config?: typeof SPA_CONFIG;
  sectionScope?: 'spa' | 'salon' | 'all';
  onSelectService: (serviceName: string) => void;
  previewLimit?: number;
  onViewAllClick?: () => void;
}

type SpaFilter = 'all' | 'massage' | 'holistic';
type SalonFilter = 'all' | 'hair' | 'skin-nails';

export function ServicesSection({
  services = SERVICES_DATA,
  config = SPA_CONFIG,
  sectionScope = 'all',
  onSelectService,
  previewLimit,
  onViewAllClick,
}: ServicesSectionProps) {
  const [spaFilter, setSpaFilter] = useState<SpaFilter>('all');
  const [salonFilter, setSalonFilter] = useState<SalonFilter>('all');
  const prefersReducedMotion = useReducedMotion();

  const isSalonSection = sectionScope === 'salon';
  const isSpaSection = sectionScope === 'spa';

  const scopedServices = services.filter((service) => {
    if (isSpaSection) return service.category !== 'salon';
    if (isSalonSection) return service.category === 'salon';
    return true;
  });

  const filteredServices = scopedServices.filter((service) => {
    if (isSpaSection) {
      return spaFilter === 'all' ? true : service.category === spaFilter;
    }
    if (isSalonSection) {
      if (salonFilter === 'all') return true;
      const isHair = service.categoryLabel.toLowerCase().includes('hair') || service.name.toLowerCase().includes('hair');
      return salonFilter === 'hair' ? isHair : !isHair;
    }
    return true;
  });

  const visibleServices = previewLimit ? filteredServices.slice(0, previewLimit) : filteredServices;

  const sectionBgClass = isSalonSection
    ? 'py-16 md:py-24 bg-[#F3EBD9] border-t border-[#C69749]/25'
    : 'py-16 md:py-24 bg-[#FAF6EE]';

  const cardBgClass = isSalonSection ? 'bg-[#FAF6EE]' : 'bg-[#FFFFFF]';

  const eyebrow = isSalonSection
    ? 'Luxury Hair, Skin & Nail Studio'
    : isSpaSection
      ? 'Restorative Spa Sanctuary'
      : 'Spa Therapies & Beauty Salon Menu';

  const heading = isSalonSection
    ? 'Signature Hair & Beauty Salon Services'
    : isSpaSection
      ? 'Signature Spa & Massage Therapies'
      : 'Signature Spa & Salon Services in Electronic City';

  const subtitle = isSalonSection
    ? 'Keratin smoothing, precision haircuts, blowout styling, botanical radiance facials, and rose-petal spa manicures & pedicures by senior stylists in Electronic City.'
    : isSpaSection
      ? 'Restorative Deep Tissue, Swedish, and Mysore sandalwood aromatherapy alongside private candlelit couple spa suites and herbal compress rituals.'
      : 'Explore tailored body massages, couple spa rituals, hair spa, facials, and luxury salon care in Electronic City.';

  const viewAllLabel = isSalonSection
    ? `Explore All ${scopedServices.length} Salon Services`
    : isSpaSection
      ? `Explore All ${scopedServices.length} Spa Therapies`
      : `View All ${scopedServices.length} Services`;

  return (
    <section
      id={isSalonSection ? 'salon-services' : isSpaSection ? 'spa-services' : 'services'}
      className={sectionBgClass}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#C69749]/25">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">
              {eyebrow}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[44px] leading-[1.15] font-medium text-[#1C1512] text-balance">
              {heading}
            </h2>
            <p className="mt-4 text-base text-[#524740] leading-relaxed">{subtitle}</p>
          </div>

          {isSpaSection && (
            <div
              role="tablist"
              aria-label="Filter spa massage therapies"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#F3EBD9] border border-[#C69749]/25 rounded-lg self-start lg:self-end shrink-0"
            >
              {(
                [
                  { id: 'all', label: 'All Spa Therapies' },
                  { id: 'massage', label: 'Classic Bodywork' },
                  { id: 'holistic', label: 'Holistic & Couples' },
                ] as const
              ).map((tab) => {
                const active = spaFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSpaFilter(tab.id)}
                    className={`px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] ${
                      active ? 'bg-[#5C1728] text-[#FAF6EE] shadow-sm' : 'text-[#524740] hover:text-[#1C1512]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {isSalonSection && (
            <div
              role="tablist"
              aria-label="Filter hair and beauty salon services"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#FAF6EE] border border-[#C69749]/25 rounded-lg self-start lg:self-end shrink-0"
            >
              {(
                [
                  { id: 'all', label: 'All Salon Services' },
                  { id: 'hair', label: 'Hair & Keratin' },
                  { id: 'skin-nails', label: 'Facials & Nails' },
                ] as const
              ).map((tab) => {
                const active = salonFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSalonFilter(tab.id)}
                    className={`px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] ${
                      active ? 'bg-[#5C1728] text-[#FAF6EE] shadow-sm' : 'text-[#524740] hover:text-[#1C1512]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <LotusDivider className="mt-8" />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleServices.map((service: SpaService, idx: number) => {
            const whatsappServiceUrl = buildWhatsAppUrl(
              `Namaste ${config.brandName} (${config.area}), I would like to book "${service.name}". Please share today's available slots and tariff details.`,
              config.whatsappNumber
            );

            return (
              <motion.article
                key={service.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className={`group flex flex-col ${cardBgClass} border border-[#C69749]/25 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#C69749]/50`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE7D8]">
                  <SpaImage
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C1512]/80 backdrop-blur-sm text-[11px] font-medium text-[#E8C57B]">
                    {service.category === 'salon' ? 'Salon Studio' : 'Spa Sanctuary'}
                  </span>
                </div>

                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-[#8F6422] font-medium tracking-wide">
                    <span className="tabular-nums">{service.index}</span>
                    <span aria-hidden="true">·</span>
                    <span>{service.categoryLabel}</span>
                  </div>

                  <h3 className="mt-2 font-serif text-2xl font-medium text-[#1C1512] leading-snug">
                    {service.name}
                  </h3>

                  <p className="mt-2.5 text-sm text-[#524740] leading-relaxed flex-1">
                    {service.shortDescription}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#1C1512]/10 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#524740]">
                    <span className="font-medium text-[#1C1512]">{service.duration}</span>
                    <span aria-hidden="true" className="text-[#C69749]">
                      ·
                    </span>
                    <span className="text-[#5C1728] font-medium">{service.pricePlaceholder}</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <a
                      href={whatsappServiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-shimmer inline-flex items-center justify-center gap-1.5 px-3 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] active:scale-[0.98] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#E8C57B]" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => onSelectService(service.name)}
                      className="cta-shimmer inline-flex items-center justify-center gap-1.5 px-3 py-3 min-h-[44px] bg-[#5C1728] hover:bg-[#4A1120] active:scale-[0.98] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749]"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <a
                    href={config.phoneHref}
                    className="mt-2.5 inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-[#524740] hover:text-[#5C1728] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Or Call Directly · {config.phoneDisplay}</span>
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        {onViewAllClick && previewLimit && scopedServices.length > previewLimit && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={onViewAllClick}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[46px] border border-[#5C1728] text-[#5C1728] hover:bg-[#5C1728] hover:text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors cursor-pointer"
            >
              <span>{viewAllLabel}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
