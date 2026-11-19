import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { BookingFormSection } from './components/BookingFormSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { LocationSection } from './components/LocationSection';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Navbar } from './components/Navbar';
import { OffersSection } from './components/OffersSection';
import { ServicesSection } from './components/ServicesSection';
import { WelcomeOfferSection } from './components/WelcomeOfferSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { SERVICES_DATA } from './data/spaData';

export default function App() {
  const [preselectedService, setPreselectedService] = useState<string>(SERVICES_DATA[0].name);
  const [preselectedOfferNote, setPreselectedOfferNote] = useState<string>('');
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  // Sync canonical & OpenGraph URL dynamically for SEO
  useEffect(() => {
    const currentUrl = window.location.origin + window.location.pathname;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = currentUrl;
  }, []);

  // Listen for Google Maps Platform demo key quota events
  useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const scrollToBooking = useCallback(() => {
    const target = document.getElementById('booking');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectService = useCallback(
    (serviceName: string) => {
      setPreselectedService(serviceName);
      scrollToBooking();
    },
    [scrollToBooking]
  );

  const handleApplyOfferToForm = useCallback(
    (offerNote: string) => {
      setPreselectedOfferNote(offerNote);
      scrollToBooking();
    },
    [scrollToBooking]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#1C1512]">
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
          className="fixed top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#5C1728] via-[#D9B263] to-[#1B4D3E] z-50 pointer-events-none"
        />
      )}
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar onBookClick={scrollToBooking} />

      <main className="flex-1">
        <HeroSection onBookClick={scrollToBooking} />
        <WelcomeOfferSection onApplyOfferToForm={handleApplyOfferToForm} />
        <ServicesSection onSelectService={handleSelectService} />
        <WhyChooseSection />
        <GallerySection onBookClick={scrollToBooking} />
        <OffersSection />
        <LocationSection />
        <BookingFormSection
          preselectedService={preselectedService}
          preselectedOfferNote={preselectedOfferNote}
        />
      </main>

      <Footer />
      <MobileStickyBar />
    </div>
  );
}
