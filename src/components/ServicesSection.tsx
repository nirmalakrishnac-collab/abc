import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, SERVICES_DATA, SPA_CONFIG, SpaService } from '../data/spaData';
import { LotusDivider } from './IndianMotifs';
import { SpaImage } from './SpaImage';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

type CategoryFilter = 'all' | 'massage' | 'holistic';

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const prefersReducedMotion = useReducedMotion();

  const filteredServices =
    filter === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter((service) => service.category === filter);

  return (
    <section id="services" className="py-16 md:py-24 bg-[#FAF6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#C69749]/25">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">
              Curated Treatments
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[44px] leading-[1.15] font-medium text-[#1C1512] text-balance">
              Signature Spa &amp; Massage Therapies in Electronic City
            </h2>
            <p className="mt-4 text-base text-[#524740] leading-relaxed">
              Whether you are searching for a restorative massage spa in Electronic City after work or a serene luxury spa near you for the weekend, each treatment is tailored to your comfort.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter spa services"
            className="inline-flex items-center gap-1 p-1 bg-[#F3EBD9] border border-[#C69749]/25 rounded-lg self-start lg:self-end shrink-0"
          >
            {(
              [
                { id: 'all', label: 'All Therapies' },
                { id: 'massage', label: 'Massage' },
                { id: 'holistic', label: 'Holistic & Couples' },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] ${
                    active
                      ? 'bg-[#5C1728] text-[#FAF6EE] shadow-sm'
                      : 'text-[#524740] hover:text-[#1C1512]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <LotusDivider className="mt-8" />

        {/* Service Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service: SpaService, idx: number) => {
            const whatsappServiceUrl = buildWhatsAppUrl(
              `Namaste ${SPA_CONFIG.brandName} (${SPA_CONFIG.area}), I would like to book "${service.name}". Please share available slots and tariff details.`
            );

            return (
              <motion.article
                key={service.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col bg-[#FFFFFF] border border-[#C69749]/25 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#C69749]/50"
              >
                {/* Service Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE7D8]">
                  <SpaImage
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                {/* Card Body */}
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

                  {/* Editable Duration & Price Placeholders (unboxed metadata) */}
                  <div className="mt-5 pt-4 border-t border-[#1C1512]/10 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#524740]">
                    <span className="font-medium text-[#1C1512]">{service.duration}</span>
                    <span aria-hidden="true" className="text-[#C69749]">
                      ·
                    </span>
                    <span className="text-[#5C1728] font-medium">{service.pricePlaceholder}</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectService(service.name)}
                      className="cta-shimmer inline-flex items-center justify-center gap-1.5 px-3 py-3 min-h-[44px] bg-[#5C1728] hover:bg-[#4A1120] active:scale-[0.98] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749]"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>

                    <a
                      href={whatsappServiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-shimmer inline-flex items-center justify-center gap-1.5 px-3 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] active:scale-[0.98] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#E8C57B]" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
