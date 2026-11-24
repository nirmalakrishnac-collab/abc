import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Gift, MessageCircle, Phone, X } from 'lucide-react';
import {
  buildWhatsAppUrl,
  SPA_CONFIG,
  WELCOME_OFFER,
  WelcomeOfferConfig,
} from '../data/spaData';
import { LotusDivider } from './IndianMotifs';

interface WelcomeOfferSectionProps {
  config?: typeof SPA_CONFIG;
  welcomeOffer?: WelcomeOfferConfig;
}

export function WelcomeOfferSection({
  config = SPA_CONFIG,
  welcomeOffer = WELCOME_OFFER,
}: WelcomeOfferSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem('spark_offer_seen')) return;
    const timer = window.setTimeout(() => {
      setModalOpen(true);
      sessionStorage.setItem('spark_offer_seen', '1');
    }, 1600);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenOffer = () => {
    sessionStorage.setItem('spark_offer_seen', '1');
    setModalOpen(true);
  };

  const directOfferUrl = buildWhatsAppUrl(welcomeOffer.whatsappGreeting, config.whatsappNumber);

  return (
    <>
      <section
        aria-label="Opening Wellness Offer"
        className="relative bg-[#5C1728] text-[#FAF6EE] border-y border-[#D9B263]/35"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-[0.18em] text-[#E8C57B]">
                {welcomeOffer.eyebrow}
              </p>
              <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-medium text-[#FAF6EE] leading-snug">
                {welcomeOffer.title}
              </h2>
              <p className="mt-2 text-sm text-[#EFE3CE] leading-relaxed">
                {welcomeOffer.subtitle}
              </p>
              <p className="mt-2.5 text-xs font-medium text-[#E8C57B]">
                {welcomeOffer.highlightNote}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={directOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-[#1B4D3E] hover:bg-[#22604D] active:scale-[0.98] text-[#FAF6EE] text-sm font-semibold rounded-md border border-[#E8C57B]/35 transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C57B]"
              >
                <MessageCircle className="w-4 h-4 text-[#E8C57B] shrink-0" aria-hidden="true" />
                <span>{welcomeOffer.ctaLabel}</span>
              </a>

              <a
                href={config.phoneHref}
                className="cta-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-[#D9B263] hover:bg-[#E4C178] active:scale-[0.98] text-[#1C1512] text-sm font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6EE]"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Call Now to Claim</span>
              </a>

              <button
                type="button"
                onClick={handleOpenOffer}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 min-h-[48px] border border-[#E8C57B]/40 hover:bg-white/10 text-[#E8C57B] text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Gift className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Offer Details</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-offer-modal-title"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-[#1C1512]/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#FAF6EE] border border-[#C69749]/55 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-[#5C1728] text-[#FAF6EE] px-6 py-6 border-b border-[#D9B263]/35">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close offer window"
                  className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full text-[#FAF6EE]/85 hover:text-[#FAF6EE] hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#E8C57B]">
                  {welcomeOffer.eyebrow}
                </p>
                <h3
                  id="welcome-offer-modal-title"
                  className="mt-1.5 font-serif text-2xl sm:text-3xl font-medium text-[#FAF6EE] pr-8 leading-tight"
                >
                  {welcomeOffer.title}
                </h3>
              </div>

              <div className="p-6 space-y-5">
                <LotusDivider />

                <p className="text-sm text-[#524740] leading-relaxed">
                  {welcomeOffer.subtitle}
                </p>

                <div className="bg-[#F3EBD9] border border-[#C69749]/35 rounded-xl p-4 space-y-2.5 text-xs sm:text-sm text-[#1C1512]">
                  <p className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-[#1B4D3E] shrink-0" aria-hidden="true" />
                    <span>Valid on Spa Massages, Couple Suites &amp; Hair/Beauty Salon</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-[#1B4D3E] shrink-0" aria-hidden="true" />
                    <span>Zero forms required · Instant confirmation in {config.area}</span>
                  </p>
                  <p className="pt-1 text-xs text-[#524740]">
                    Offer Code:{' '}
                    <span className="font-semibold text-[#5C1728]">{welcomeOffer.offerCode}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href={directOfferUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setModalOpen(false)}
                    className="cta-shimmer w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 min-h-[50px] bg-[#1B4D3E] hover:bg-[#22604D] active:scale-[0.99] text-[#FAF6EE] text-sm sm:text-base font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <MessageCircle className="w-5 h-5 text-[#E8C57B]" aria-hidden="true" />
                    <span>{welcomeOffer.ctaLabel}</span>
                  </a>

                  <a
                    href={config.phoneHref}
                    onClick={() => setModalOpen(false)}
                    className="cta-shimmer w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 min-h-[50px] bg-[#5C1728] hover:bg-[#4A1120] active:scale-[0.99] text-[#FAF6EE] text-sm sm:text-base font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <Phone className="w-5 h-5 text-[#E8C57B]" aria-hidden="true" />
                    <span>Call Now · {config.phoneDisplay}</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full py-2 text-xs font-medium text-[#524740] hover:text-[#1C1512] transition-colors cursor-pointer"
                >
                  Continue browsing website
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
