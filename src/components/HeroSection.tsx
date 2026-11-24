import { motion, useReducedMotion } from 'motion/react';
import { MessageCircle, Phone } from 'lucide-react';
import { buildWhatsAppUrl, SPA_CONFIG } from '../data/spaData';
import { SpaImage } from './SpaImage';

interface HeroSectionProps {
  config?: typeof SPA_CONFIG;
  onExploreSpa: () => void;
  onExploreSalon: () => void;
}

export function HeroSection({
  config = SPA_CONFIG,
  onExploreSpa,
  onExploreSalon,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  const quickWhatsAppUrl = buildWhatsAppUrl(
    `Namaste ${config.brandName} (${config.area}), I would like to book a Spa / Salon appointment today.`,
    config.whatsappNumber
  );

  return (
    <>
      <section
        id="top"
        className="relative min-h-[78vh] md:min-h-[84vh] flex items-end md:items-center overflow-hidden bg-[#1C1512]"
      >
        <motion.div
          className="absolute inset-0"
          initial={prefersReducedMotion ? false : { scale: 1.05 }}
          animate={prefersReducedMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SpaImage
            src="/src/assets/images/hero_spa_sanctuary_1795110762237.jpg"
            alt="Luxury spa & beauty salon sanctuary inside Spark Spa & Salon in Electronic City, Bangalore"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#16100D]/92 via-[#16100D]/55 to-[#16100D]/45 md:bg-gradient-to-r md:from-[#16100D]/90 md:via-[#16100D]/58 md:to-[#16100D]/30"
          />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 md:py-24">
          <div className="max-w-2xl">
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs sm:text-sm font-medium tracking-[0.2em] text-[#E8C57B] mb-4"
            >
              Namaste · Luxury Spa &amp; Salon · {config.area}
            </motion.p>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[clamp(2.25rem,4.5vw,4.25rem)] leading-[1.06] font-medium text-[#FAF6EE] text-balance tracking-[-0.01em]"
            >
              Relax. Rejuvenate. Glow at {config.brandName}.
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-base sm:text-lg leading-relaxed text-[#EFE3CE] max-w-xl"
            >
              Electronic City&apos;s serene sanctuary for signature body massages, couple spa suites, keratin hair spa, radiance facials, and luxury salon care.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3"
            >
              <a
                href={quickWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-shimmer inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] bg-[#1B4D3E] hover:bg-[#22604D] border border-[#E8C57B]/40 text-[#FAF6EE] text-sm sm:text-base font-semibold rounded-md transition-all duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B263]"
              >
                <MessageCircle className="w-4 h-4 text-[#E8C57B]" aria-hidden="true" />
                <span>Book on WhatsApp</span>
              </a>

              <a
                href={config.phoneHref}
                className="cta-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] bg-[#D9B263] hover:bg-[#E4C178] text-[#1C1512] text-sm sm:text-base font-semibold rounded-md transition-all duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6EE]"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>Call Now</span>
              </a>

              <div className="flex items-center gap-4 pt-1 sm:pt-0 sm:pl-2">
                <button
                  type="button"
                  onClick={onExploreSpa}
                  className="inline-flex items-center justify-center py-2.5 min-h-[44px] text-[#FAF6EE] hover:text-[#E8C57B] text-sm font-medium underline underline-offset-4 decoration-[#E8C57B]/50 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Spa Menu
                </button>
                <span aria-hidden="true" className="text-[#E8C57B]/45">·</span>
                <button
                  type="button"
                  onClick={onExploreSalon}
                  className="inline-flex items-center justify-center py-2.5 min-h-[44px] text-[#FAF6EE] hover:text-[#E8C57B] text-sm font-medium underline underline-offset-4 decoration-[#E8C57B]/50 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Salon Menu
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* High-Conversion Trust Strip */}
      <section aria-label="Sanctuary highlights" className="bg-[#F3EBD9] border-b border-[#C69749]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs sm:text-sm">
          <div>
            <p className="font-serif text-lg font-semibold text-[#1C1512]">Spa &amp; Salon Under One Roof</p>
            <p className="text-[#524740]">Massages, Hair Spa &amp; Facials</p>
          </div>
          <div>
            <p className="font-serif text-lg font-semibold text-[#1C1512]">Electronic City Phase 1 &amp; 2</p>
            <p className="text-[#524740]">Easy Access &amp; Guest Parking</p>
          </div>
          <div>
            <p className="font-serif text-lg font-semibold text-[#1C1512]">100% Hygienic Suites</p>
            <p className="text-[#524740]">Fresh Linens &amp; Sterile Tools</p>
          </div>
          <div>
            <p className="font-serif text-lg font-semibold text-[#1C1512]">Instant Slot Confirmation</p>
            <p className="text-[#524740]">{config.hours}</p>
          </div>
        </div>
      </section>
    </>
  );
}
