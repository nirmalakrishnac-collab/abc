import { FormEvent, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Calendar, CheckCircle2, Clock, Gift, MessageCircle, Phone, Send, Users } from 'lucide-react';
import {
  buildWhatsAppUrl,
  OFFERS_DATA,
  PREFERRED_TIME_SLOTS,
  SERVICES_DATA,
  SPA_CONFIG,
  WELCOME_OFFER,
} from '../data/spaData';
import { LotusDivider } from './IndianMotifs';

interface BookingFormSectionProps {
  preselectedService: string;
  preselectedOfferNote?: string;
}

interface FormState {
  fullName: string;
  mobileNumber: string;
  guestMode: 'Solo Session' | 'Couple Suite';
  preferredService: string;
  preferredDate: string;
  preferredTime24: string;
  customTimeNote: string;
  applyWelcomeOffer: boolean;
  additionalMessage: string;
}

interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  preferredService?: string;
  preferredDate?: string;
  preferredTime?: string;
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

function parse12To24(slot12: string): string {
  const match = slot12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '16:00';
  let hour = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${minutes}`;
}

export function BookingFormSection({
  preselectedService,
  preselectedOfferNote,
}: BookingFormSectionProps) {
  const todayIso = new Date().toISOString().split('T')[0];
  const prefersReducedMotion = useReducedMotion();

  const [form, setForm] = useState<FormState>({
    fullName: '',
    mobileNumber: '',
    guestMode: 'Solo Session',
    preferredService: preselectedService || SERVICES_DATA[0].name,
    preferredDate: todayIso,
    preferredTime24: '16:00',
    customTimeNote: '',
    applyWelcomeOffer: true,
    additionalMessage: preselectedOfferNote || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [submittedSummary, setSubmittedSummary] = useState<{
    fullName: string;
    mobileNumber: string;
    guestMode: string;
    preferredService: string;
    preferredDate: string;
    preferredTimeDisplay: string;
    applyWelcomeOffer: boolean;
    additionalMessage: string;
  } | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setForm((prev) => ({
        ...prev,
        preferredService: preselectedService,
        guestMode: preselectedService.toLowerCase().includes('couple')
          ? 'Couple Suite'
          : prev.guestMode,
      }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedOfferNote) {
      setForm((prev) => ({
        ...prev,
        applyWelcomeOffer: true,
        additionalMessage: preselectedOfferNote,
      }));
    }
  }, [preselectedOfferNote]);

  const resolvedTimeDisplay = form.customTimeNote.trim()
    ? form.customTimeNote.trim()
    : formatTime24To12(form.preferredTime24);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    const digitsOnly = form.mobileNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      nextErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }
    if (!form.preferredService) {
      nextErrors.preferredService = 'Please select a preferred spa service.';
    }
    if (!form.preferredDate) {
      nextErrors.preferredDate = 'Please choose your preferred date.';
    }
    if (!resolvedTimeDisplay) {
      nextErrors.preferredTime = 'Please enter or select your preferred time.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const lines = [
      `Namaste ${SPA_CONFIG.brandName} (${SPA_CONFIG.area}),`,
      `I would like to book an appointment:`,
      ``,
      `• Full Name: ${form.fullName.trim()}`,
      `• Mobile Number: ${form.mobileNumber.trim()}`,
      `• Session Type: ${form.guestMode}`,
      `• Preferred Service: ${form.preferredService}`,
      `• Preferred Date: ${form.preferredDate}`,
      `• Guest Preferred Time: ${resolvedTimeDisplay}`,
      form.applyWelcomeOffer
        ? `• Privilege Offer: ${WELCOME_OFFER.offerCode} (Website Welcome Offer)`
        : `• Privilege Offer: Standard Booking`,
      form.additionalMessage.trim()
        ? `• Additional Message: ${form.additionalMessage.trim()}`
        : `• Additional Message: None`,
      ``,
      `Please confirm slot availability on WhatsApp. Dhanyavaad!`,
    ];

    const whatsappUrl = buildWhatsAppUrl(lines.join('\n'));
    setSubmittedUrl(whatsappUrl);
    setSubmittedSummary({
      fullName: form.fullName,
      mobileNumber: form.mobileNumber,
      guestMode: form.guestMode,
      preferredService: form.preferredService,
      preferredDate: form.preferredDate,
      preferredTimeDisplay: resolvedTimeDisplay,
      applyWelcomeOffer: form.applyWelcomeOffer,
      additionalMessage: form.additionalMessage,
    });

    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const serviceOptions = [
    ...SERVICES_DATA.map((s) => s.name),
    ...OFFERS_DATA.map((o) => `Package: ${o.title}`),
  ];

  return (
    <section id="booking" className="py-16 md:py-24 bg-[#FAF6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Editorial Column */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">
              Priority WhatsApp Concierge
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] leading-[1.15] font-medium text-[#1C1512] text-balance">
              Book Your Appointment at Your Preferred Time
            </h2>
            <p className="mt-4 text-base text-[#524740] leading-relaxed">
              Choose your therapy, date, and any exact preferred time that suits your schedule. Send your booking directly on WhatsApp with zero advance payment required.
            </p>

            <LotusDivider className="my-7" />

            <div className="space-y-4 text-sm text-[#524740]">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#5C1728] shrink-0" aria-hidden="true" />
                <span>{SPA_CONFIG.hours}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#5C1728] shrink-0" aria-hidden="true" />
                <a
                  href={SPA_CONFIG.phoneHref}
                  className="hover:text-[#1C1512] underline decoration-[#C69749]/60 underline-offset-4 tabular-nums font-medium"
                >
                  {SPA_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#5C1728] shrink-0" aria-hidden="true" />
                <span>Custom guest-chosen appointment times welcome</span>
              </div>
            </div>
          </motion.div>

          {/* Right High-Converting Form Column */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-[#FFFFFF] border border-[#C69749]/35 rounded-xl p-6 sm:p-9 shadow-md"
          >
            {submittedUrl && submittedSummary ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2
                    className="w-6 h-6 text-[#1B4D3E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1512]">
                      WhatsApp Appointment Request Ready
                    </h3>
                    <p className="mt-1.5 text-sm text-[#524740]">
                      Tap below if WhatsApp did not open automatically to send your booking details directly to Spark Spa.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FAF6EE] border border-[#C69749]/30 rounded-lg p-5 space-y-2 text-sm text-[#524740]">
                  <p>
                    <span className="font-semibold text-[#1C1512]">Guest:</span>{' '}
                    {submittedSummary.fullName} ({submittedSummary.mobileNumber})
                  </p>
                  <p>
                    <span className="font-semibold text-[#1C1512]">Therapy &amp; Suite:</span>{' '}
                    {submittedSummary.preferredService} · {submittedSummary.guestMode}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1C1512]">Schedule:</span>{' '}
                    {submittedSummary.preferredDate} at {submittedSummary.preferredTimeDisplay}
                  </p>
                  {submittedSummary.applyWelcomeOffer && (
                    <p>
                      <span className="font-semibold text-[#5C1728]">Offer Applied:</span>{' '}
                      {WELCOME_OFFER.offerCode}
                    </p>
                  )}
                  {submittedSummary.additionalMessage && (
                    <p>
                      <span className="font-semibold text-[#1C1512]">Message:</span>{' '}
                      {submittedSummary.additionalMessage}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={submittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-shimmer flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E8C57B]" aria-hidden="true" />
                    <span>Open WhatsApp Booking</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedUrl(null)}
                    className="px-6 py-3.5 min-h-[48px] border border-[#1C1512]/20 hover:bg-[#F3EBD9] text-[#1C1512] text-sm font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Guest Session Toggle */}
                <div>
                  <span className="block text-xs sm:text-sm font-medium text-[#1C1512] mb-2">
                    Guest Preference
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 p-1 bg-[#F3EBD9] rounded-lg border border-[#C69749]/25">
                    {(['Solo Session', 'Couple Suite'] as const).map((mode) => {
                      const active = form.guestMode === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setForm({ ...form, guestMode: mode })}
                          className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 min-h-[42px] text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
                            active
                              ? 'bg-[#5C1728] text-[#FAF6EE] shadow-sm'
                              : 'text-[#524740] hover:text-[#1C1512]'
                          }`}
                        >
                          <Users className="w-4 h-4" aria-hidden="true" />
                          <span>{mode}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="booking-full-name"
                      className="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5"
                    >
                      Full Name <span className="text-[#5C1728]">*</span>
                    </label>
                    <input
                      id="booking-full-name"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] placeholder:text-[#7E726A] focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                    />
                    {errors.fullName && (
                      <p role="alert" className="mt-1 text-xs text-[#6B1D2F] font-medium">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-mobile"
                      className="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5"
                    >
                      Mobile Number (WhatsApp) <span className="text-[#5C1728]">*</span>
                    </label>
                    <input
                      id="booking-mobile"
                      name="mobileNumber"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+91 98XXX XXXXX"
                      value={form.mobileNumber}
                      onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] placeholder:text-[#7E726A] focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749] tabular-nums"
                    />
                    {errors.mobileNumber && (
                      <p role="alert" className="mt-1 text-xs text-[#6B1D2F] font-medium">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="booking-service"
                      className="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5"
                    >
                      Preferred Service <span className="text-[#5C1728]">*</span>
                    </label>
                    <select
                      id="booking-service"
                      name="preferredService"
                      required
                      value={form.preferredService}
                      onChange={(e) => setForm({ ...form, preferredService: e.target.value })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                    >
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.preferredService && (
                      <p role="alert" className="mt-1 text-xs text-[#6B1D2F] font-medium">
                        {errors.preferredService}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-date"
                      className="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5"
                    >
                      Preferred Date <span className="text-[#5C1728]">*</span>
                    </label>
                    <input
                      id="booking-date"
                      name="preferredDate"
                      type="date"
                      required
                      min={todayIso}
                      value={form.preferredDate}
                      onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749] tabular-nums"
                    />
                    {errors.preferredDate && (
                      <p role="alert" className="mt-1 text-xs text-[#6B1D2F] font-medium">
                        {errors.preferredDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Guest-Chosen Preferred Time (Custom Time Picker + Free Note + Quick Chips) */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label
                      htmlFor="booking-custom-time"
                      className="block text-xs sm:text-sm font-medium text-[#1C1512]"
                    >
                      Your Preferred Time <span className="text-[#5C1728]">*</span>
                    </label>
                    <span className="text-xs text-[#8F6422]">
                      Pick any time or type your preferred slot
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      id="booking-custom-time"
                      name="preferredTime"
                      type="time"
                      value={form.preferredTime24}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          preferredTime24: e.target.value,
                          customTimeNote: '',
                        })
                      }
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] tabular-nums focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                    />

                    <input
                      type="text"
                      aria-label="Or type any custom preferred time"
                      placeholder="Or type exact time (e.g. 6:15 PM)"
                      value={form.customTimeNote}
                      onChange={(e) => setForm({ ...form, customTimeNote: e.target.value })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] placeholder:text-[#7E726A] focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                    />
                  </div>

                  {/* Quick-tap suggestions that populate the guest's time */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {PREFERRED_TIME_SLOTS.slice(0, 6).map((slot) => {
                      const slot24 = parse12To24(slot);
                      const isMatched =
                        !form.customTimeNote.trim() && form.preferredTime24 === slot24;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              preferredTime24: slot24,
                              customTimeNote: '',
                            })
                          }
                          className={`px-2.5 py-1.5 text-xs font-medium rounded border transition-colors tabular-nums cursor-pointer ${
                            isMatched
                              ? 'bg-[#5C1728] border-[#5C1728] text-[#FAF6EE]'
                              : 'bg-[#FAF6EE] border-[#1C1512]/15 text-[#524740] hover:border-[#C69749] hover:text-[#1C1512]'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {errors.preferredTime && (
                    <p role="alert" className="mt-1 text-xs text-[#6B1D2F] font-medium">
                      {errors.preferredTime}
                    </p>
                  )}
                </div>

                {/* Additional Message */}
                <div>
                  <label
                    htmlFor="booking-message"
                    className="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5"
                  >
                    Additional Message
                  </label>
                  <textarea
                    id="booking-message"
                    name="additionalMessage"
                    rows={2}
                    placeholder="Preferred pressure, aroma oil, or special occasion notes..."
                    value={form.additionalMessage}
                    onChange={(e) => setForm({ ...form, additionalMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] placeholder:text-[#7E726A] focus:outline-none focus:border-[#C69749] focus:ring-1 focus:ring-[#C69749]"
                  />
                </div>

                {/* Welcome Offer Privilege Checkbox */}
                <label className="flex items-start gap-3 p-3.5 rounded-lg bg-[#F3EBD9]/75 border border-[#C69749]/35 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.applyWelcomeOffer}
                    onChange={(e) =>
                      setForm({ ...form, applyWelcomeOffer: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 accent-[#5C1728] rounded cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[#1C1512] leading-snug">
                    <span className="font-semibold text-[#5C1728] inline-flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 inline" aria-hidden="true" />
                      Apply Website Welcome Offer ({WELCOME_OFFER.offerCode})
                    </span>{' '}
                    — includes complimentary herbal compress &amp; tea ritual.
                  </span>
                </label>

                <button
                  type="submit"
                  className="cta-shimmer w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 min-h-[50px] bg-[#1B4D3E] hover:bg-[#22604D] active:scale-[0.99] text-[#FAF6EE] text-sm sm:text-base font-semibold rounded-md shadow-sm transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] focus-visible:ring-offset-2"
                >
                  <Send className="w-4 h-4 text-[#E8C57B]" aria-hidden="true" />
                  <span>Book Appointment on WhatsApp</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
