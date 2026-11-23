import { motion, useReducedMotion } from 'motion/react';
import { Check, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, OFFERS_DATA, SPA_CONFIG, SpaOffer } from '../data/spaData';
import { LotusDivider } from './IndianMotifs';

interface OffersSectionProps {
  offers?: SpaOffer[];
  config?: typeof SPA_CONFIG;
}

export function OffersSection({
  offers = OFFERS_DATA,
  config = SPA_CONFIG,
}: OffersSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const generalOfferWhatsappUrl = buildWhatsAppUrl(
    `Namaste ${config.brandName} (${config.area}), I would like to enquire about your current spa offers and wellness packages.`,
    config.whatsappNumber
  );

  return (
    <section id="offers" className="py-16 md:py-24 bg-[#1C1512] text-[#FAF6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#D9B263]/25">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#E8C57B] mb-3">
              Curated Offers &amp; Packages
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[46px] leading-[1.12] font-medium text-[#FAF6EE] text-balance">
              Your Relaxation Starts Here.
            </h2>
            <p className="mt-4 text-base text-[#DFD3C0] leading-relaxed">
              Thoughtfully composed wellness packages and weekday restorative rituals at {config.brandName}, {config.area}. Reach our concierge directly on WhatsApp for today&apos;s availability and seasonal rates.
            </p>
          </div>

          <a
            href={generalOfferWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-shimmer inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] bg-[#D9B263] hover:bg-[#E4C178] active:scale-[0.98] text-[#1C1512] text-sm sm:text-base font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 self-start lg:self-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6EE]"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

        <LotusDivider tone="ivory" className="mt-8" />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {offers.map((offer, idx) => {
            const offerUrl = buildWhatsAppUrl(
              `Namaste ${config.brandName} (${config.area}), I would like to enquire about the "${offer.title}" package. Please share availability and pricing.`,
              config.whatsappNumber
            );
            return (
              <motion.div
                key={offer.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col bg-[#281C18] border border-[#D9B263]/28 rounded-xl p-7 hover:border-[#D9B263]/60 transition-colors"
              >
                <p className="text-xs font-medium tracking-[0.14em] text-[#E8C57B]">
                  {offer.code}
                </p>
                <h3 className="mt-2 font-serif text-2xl sm:text-[28px] font-medium text-[#FAF6EE] leading-snug">
                  {offer.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#DFD3C0] leading-relaxed">
                  {offer.subtitle}
                </p>

                <ul className="mt-6 space-y-3 flex-1">
                  {offer.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#EFE3CE]">
                      <Check className="w-4 h-4 text-[#E8C57B] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-[#D9B263]/20 space-y-1 text-xs sm:text-sm">
                  <p className="text-[#FAF6EE] font-medium">{offer.durationPlaceholder}</p>
                  <p className="text-[#E8C57B] font-medium">{offer.pricePlaceholder}</p>
                </div>

                <a
                  href={offerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-shimmer mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] border border-[#E8C57B]/30 text-[#FAF6EE] text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B263]"
                >
                  <MessageCircle className="w-4 h-4 text-[#E8C57B]" aria-hidden="true" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
