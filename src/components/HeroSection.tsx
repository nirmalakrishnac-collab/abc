import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, SPA_CONFIG } from '../data/spaData';
import { SpaImage } from './SpaImage';

interface HeroSectionProps {
  config?: typeof SPA_CONFIG;
  onBookClick: () => void;
  onExploreServices: () => void;
}

export function HeroSection({
  config = SPA_CONFIG,
  onBookClick,
  onExploreServices,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  const quickWhatsAppUrl = buildWhatsAppUrl(
    `Namaste ${config.brandName} (${config.area}), I would like to book a spa appointment today.`,
    config.whatsappNumber
  );

  return (
    <section
      id="top"
      className="relative min-h-[82vh] md:min-h-[88vh] flex items-end md:items-center overflow-hidden bg-[#1C1512]"
    >
      <motion.div
        className="absolute inset-0"
        initial={prefersReducedMotion ? false : { scale: 1.05 }}
        animate={prefersReducedMotion ? undefined : { scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <SpaImage
          src="/src/assets/images/hero_spa_sanctuary_1795110762237.jpg"
          alt="Candlelit stone reflection sanctuary inside Spark Spa in Electronic City, Bangalore"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#16100D]/92 via-[#16100D]/55 to-[#16100D]/45 md:bg-gradient-to-r md:from-[#16100D]/90 md:via-[#16100D]/55 md:to-[#16100D]/30"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs sm:text-sm font-medium tracking-[0.2em] text-[#E8C57B] mb-4"
          >
            Namaste · {config.area}
          </motion.p>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(2.35rem,4.5vw,4.35rem)] leading-[1.06] font-medium text-[#FAF6EE] text-balance tracking-[-0.01em]"
          >
            Relax. Rejuvenate. Rediscover Yourself.
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base sm:text-lg leading-relaxed text-[#EFE3CE] max-w-xl"
          >
            Experience premium spa and wellness treatments at {config.brandName}, {config.area}.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
          >
            <button
              type="button"
              onClick={onBookClick}
              className="cta-shimmer group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] bg-[#D9B263] hover:bg-[#E4C178] text-[#1C1512] text-sm sm:text-base font-semibold rounded-md transition-all duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6EE]"
            >
              <span>Book Your Appointment</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>

            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-[#1B4D3E]/90 hover:bg-[#22604D] border border-[#E8C57B]/35 text-[#FAF6EE] text-sm sm:text-base font-medium rounded-md backdrop-blur-sm transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B263]"
            >
              <MessageCircle className="w-4 h-4 text-[#E8C57B]" aria-hidden="true" />
              <span>WhatsApp Book Now</span>
            </a>

            <button
              type="button"
              onClick={onExploreServices}
              className="inline-flex items-center justify-center px-5 py-3.5 min-h-[48px] text-[#FAF6EE] hover:text-[#E8C57B] text-sm sm:text-base font-medium underline underline-offset-4 decoration-[#E8C57B]/50 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B263]"
            >
              Explore Our Services
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
