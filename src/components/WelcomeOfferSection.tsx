import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Gift, MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl, SERVICES_DATA, SPA_CONFIG, WELCOME_OFFER } from '../data/spaData';
import { LotusDivider } from './IndianMotifs';

interface WelcomeOfferSectionProps {
  onApplyOfferToForm: (offerNote: string) => void;
}

function formatTime24To12(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  const h = Number(hStr);
  if (Number.isNaN(h)) return time24;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${suffix}`;
}

export function WelcomeOfferSection({ onApplyOfferToForm }: WelcomeOfferSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedService, setSelectedService] = useState(SERVICES_DATA[0].name);
  const [preferredTime, setPreferredTime] = useState('16:30');
  const [formError, setFormError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Open the Welcome Offer popup gently after a short entrance once per session
  useEffect(() => {
    if (sessionStorage.getItem('spark_offer_seen')) return;
    const timer = window.setTimeout(() => {
      setModalOpen(true);
      sessionStorage.setItem('spark_offer_seen', '1');
    }, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenOffer = () => {
    sessionStorage.setItem('spark_offer_seen', '1');
    setModalOpen(true);
  };

  const handleClaimSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const digits = guestPhone.replace(/\D/g, '');
    if (!guestName.trim() || digits.length < 10) {
      setFormError('Please enter your name and 10-digit mobile number to book this offer.');
      return;
    }
    setFormError(null);

    const formattedTime = formatTime24To12(preferredTime);
    const msg = [
      `Namaste ${SPA_CONFIG.brandName} (${SPA_CONFIG.area}),`,
      `I would like to claim the Website Welcome Offer (${WELCOME_OFFER.offerCode}) & book an appointment:`,
      ``,
      `• Name: ${guestName.trim()}`,
      `• Mobile: ${guestPhone.trim()}`,
      `• Preferred Therapy: ${selectedService}`,
      `• My Preferred Time: ${formattedTime}`,
      ``,
      `Please confirm slot availability on WhatsApp.`,
    ].join('\n');

    const url = buildWhatsAppUrl(msg);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setModalOpen(false);
  };

  const directOfferUrl = buildWhatsAppUrl(WELCOME_OFFER.whatsappGreeting);

  return (
    <>
      {/* In-Flow Royal Indian Welcome Offer Band immediately below Hero */}
      <section
        aria-label="Opening Wellness Offer"
        className="relative bg-[#5C1728] text-[#FAF6EE] border-y border-[#D9B263]/35"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-[0.18em] text-[#E8C57B]">
                {WELCOME_OFFER.eyebrow}
              </p>
              <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-medium text-[#FAF6EE] leading-snug">
                {WELCOME_OFFER.title}
              </h2>
              <p className="mt-2 text-sm text-[#EFE3CE] leading-relaxed">
                {WELCOME_OFFER.subtitle}
              </p>
              <p className="mt-2.5 text-xs font-medium text-[#E8C57B]">
                {WELCOME_OFFER.highlightNote}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleOpenOffer}
                className="cta-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] bg-[#D9B263] hover:bg-[#E4C178] active:scale-[0.98] text-[#1C1512] text-sm font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6EE]"
              >
                <Gift className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>View Offer &amp; Book Now</span>
              </button>

              <a
                href={directOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] bg-[#1B4D3E] hover:bg-[#22604D] active:scale-[0.98] text-[#FAF6EE] text-sm font-medium rounded-md border border-[#E8C57B]/35 transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C57B]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{WELCOME_OFFER.ctaLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Offer + Instant Book Now Popup */}
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
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#FAF6EE] border border-[#C69749]/50 rounded-xl overflow-hidden shadow-2xl"
            >
              {/* Royal Burgundy Header */}
              <div className="bg-[#5C1728] text-[#FAF6EE] px-6 py-5 border-b border-[#D9B263]/35">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close offer window"
                  className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full text-[#FAF6EE]/85 hover:text-[#FAF6EE] hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <p className="text-xs font-medium tracking-[0.16em] text-[#E8C57B]">
                  {WELCOME_OFFER.eyebrow}
                </p>
                <h3
                  id="welcome-offer-modal-title"
                  className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-[#FAF6EE] pr-8"
                >
                  {WELCOME_OFFER.title}
                </h3>
              </div>

              <div className="p-6">
                <LotusDivider className="mb-4" />
                <p className="text-sm text-[#524740] leading-relaxed">
                  {WELCOME_OFFER.subtitle} Mention privilege code{' '}
                  <span className="font-semibold text-[#5C1728]">{WELCOME_OFFER.offerCode}</span>{' '}
                  or book directly below at any time of your choice.
                </p>

                <form onSubmit={handleClaimSubmit} className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="offer-guest-name"
                        className="block text-xs font-medium text-[#1C1512] mb-1"
                      >
                        Your Name
                      </label>
                      <input
                        id="offer-guest-name"
                        type="text"
                        required
                        placeholder="Full Name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FFFFFF] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="offer-guest-phone"
                        className="block text-xs font-medium text-[#1C1512] mb-1"
                      >
                        WhatsApp Number
                      </label>
                      <input
                        id="offer-guest-phone"
                        type="tel"
                        required
                        placeholder="+91 98XXX XXXXX"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FFFFFF] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] tabular-nums focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="offer-service-select"
                        className="block text-xs font-medium text-[#1C1512] mb-1"
                      >
                        Preferred Therapy
                      </label>
                      <select
                        id="offer-service-select"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FFFFFF] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                      >
                        {SERVICES_DATA.map((service) => (
                          <option key={service.id} value={service.name}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="offer-custom-time"
                        className="block text-xs font-medium text-[#1C1512] mb-1"
                      >
                        Your Preferred Time
                      </label>
                      <input
                        id="offer-custom-time"
                        type="time"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FFFFFF] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] tabular-nums focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs text-[#6B1D2F] font-medium">
                      {formError}
                    </p>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="cta-shimmer flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#E8C57B]" aria-hidden="true" />
                      <span>Book Now on WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalOpen(false);
                        onApplyOfferToForm(
                          `Apply Welcome Privilege (${WELCOME_OFFER.offerCode}) for ${selectedService}`
                        );
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3 min-h-[46px] bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-sm font-medium rounded-md transition-colors cursor-pointer"
                    >
                      <span>Book Now Form</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
