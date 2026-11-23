import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { BlogSection } from './components/BlogSection';
import { BookingFormSection } from './components/BookingFormSection';
import { ClientPortalPage } from './components/ClientPortalPage';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { LocationSection } from './components/LocationSection';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Navbar } from './components/Navbar';
import { OffersSection } from './components/OffersSection';
import { PageHeaderBanner } from './components/PageHeaderBanner';
import { ServicesSection } from './components/ServicesSection';
import { WelcomeOfferSection } from './components/WelcomeOfferSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { INITIAL_SITE_STATE, SiteContentState } from './data/spaData';

function normalizePath(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname)
  );
  const [siteData, setSiteData] = useState<SiteContentState>(INITIAL_SITE_STATE);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [preselectedService, setPreselectedService] = useState<string>(
    INITIAL_SITE_STATE.services[0].name
  );
  const [preselectedOfferNote, setPreselectedOfferNote] = useState<string>('');
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  const refreshSiteData = useCallback(
    async (overrideToken?: string | null) => {
      const token = overrideToken !== undefined ? overrideToken : sessionToken;
      try {
        const res = await fetch('/api/site-data', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return;
        const json = (await res.json()) as SiteContentState;
        if (json && json.config && Array.isArray(json.services)) {
          setSiteData(json);
        }
      } catch {
        // Fallback smoothly to INITIAL_SITE_STATE if backend not reachable
      }
    },
    [sessionToken]
  );

  useEffect(() => {
    void refreshSiteData();
  }, [refreshSiteData]);

  // Listen to browser Back / Forward navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Update dynamic canonical URL & page title per route for SEO
  useEffect(() => {
    const currentUrl = window.location.origin + currentPath;
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

    const brand = siteData.config.brandName;
    if (currentPath === '/services') {
      document.title = `Spa Services & Massages | ${brand} Electronic City, Bangalore`;
    } else if (currentPath === '/gallery') {
      document.title = `Sanctuary Gallery | ${brand} Electronic City, Bangalore`;
    } else if (currentPath === '/offers') {
      document.title = `Offers & Couple Packages | ${brand} Electronic City, Bangalore`;
    } else if (currentPath === '/blog' || currentPath.startsWith('/blog/')) {
      document.title = `Wellness Journal & Blog | ${brand} Electronic City, Bangalore`;
    } else if (currentPath === '/contact') {
      document.title = `Book Appointment & Location | ${brand} Electronic City, Bangalore`;
    } else if (currentPath === '/client-portal') {
      document.title = `Client Content Studio | ${brand}`;
    } else {
      document.title = `${brand} | Best Luxury Spa in Electronic City, Bangalore`;
    }
  }, [currentPath, siteData.config.brandName]);

  useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const navigate = useCallback((path: string) => {
    const clean = normalizePath(path);
    window.history.pushState({}, '', clean);
    setCurrentPath(clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToBooking = useCallback(() => {
    const bookingEl = document.getElementById('booking');
    if (bookingEl && (currentPath === '/' || currentPath === '/contact')) {
      bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.history.pushState({}, '', '/contact');
    setCurrentPath('/contact');
    window.setTimeout(() => {
      const el = document.getElementById('booking');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0 });
    }, 80);
  }, [currentPath]);

  const handleSelectService = useCallback(
    (serviceName: string) => {
      setPreselectedService(serviceName);
      goToBooking();
    },
    [goToBooking]
  );

  const handleApplyOfferToForm = useCallback(
    (offerNote: string) => {
      setPreselectedOfferNote(offerNote);
      goToBooking();
    },
    [goToBooking]
  );

  // Separate Client Dashboard Page (isolated from public spa navigation & sticky bar)
  if (currentPath === '/client-portal') {
    return (
      <ClientPortalPage
        siteData={siteData}
        sessionToken={sessionToken}
        onTokenChange={setSessionToken}
        onRefreshSiteData={refreshSiteData}
        onBackToWebsite={() => navigate('/')}
      />
    );
  }

  const blogSlug = currentPath.startsWith('/blog/')
    ? decodeURIComponent(currentPath.slice('/blog/'.length))
    : null;

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

      <Navbar
        currentPath={currentPath}
        brandName={siteData.config.brandName}
        onNavigate={navigate}
        onBookClick={goToBooking}
      />

      <main className="flex-1">
        {/* PAGE 1: HOME */}
        {currentPath === '/' && (
          <>
            <HeroSection
              config={siteData.config}
              onBookClick={goToBooking}
              onExploreServices={() => navigate('/services')}
            />
            <WelcomeOfferSection
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
              services={siteData.services}
              onApplyOfferToForm={handleApplyOfferToForm}
            />
            <ServicesSection
              services={siteData.services}
              config={siteData.config}
              onSelectService={handleSelectService}
              previewLimit={3}
              onViewAllClick={() => navigate('/services')}
            />
            <WhyChooseSection />
            <GallerySection
              items={siteData.gallery}
              onBookClick={goToBooking}
              previewLimit={3}
              onViewAllClick={() => navigate('/gallery')}
            />
            <BlogSection
              blogs={siteData.blogs}
              config={siteData.config}
              mode="preview"
              onOpenArticle={(slug) => navigate(`/blog/${encodeURIComponent(slug)}`)}
              onViewAllBlogs={() => navigate('/blog')}
              onBookNowClick={goToBooking}
            />
            <OffersSection offers={siteData.offers} config={siteData.config} />
            <LocationSection config={siteData.config} />
            <BookingFormSection
              preselectedService={preselectedService}
              preselectedOfferNote={preselectedOfferNote}
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
              services={siteData.services}
              offers={siteData.offers}
            />
          </>
        )}

        {/* PAGE 2: SERVICES */}
        {currentPath === '/services' && (
          <>
            <PageHeaderBanner
              eyebrow="Treatments & Massage Menu"
              title="Signature Spa Therapies"
              subtitle={`Explore every massage and holistic wellness treatment at ${siteData.config.brandName}, ${siteData.config.area}.`}
              onBackHome={() => navigate('/')}
            />
            <ServicesSection
              services={siteData.services}
              config={siteData.config}
              onSelectService={handleSelectService}
            />
            <WhyChooseSection />
            <BookingFormSection
              preselectedService={preselectedService}
              preselectedOfferNote={preselectedOfferNote}
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
              services={siteData.services}
              offers={siteData.offers}
            />
          </>
        )}

        {/* PAGE 3: GALLERY */}
        {currentPath === '/gallery' && (
          <>
            <PageHeaderBanner
              eyebrow="Inside Our Sanctuary"
              title="Spa Interiors, Suites & Rituals"
              subtitle="Step inside our private candlelit therapy rooms, couple sanctuary, steam facilities, and quiet relaxation lounge."
              onBackHome={() => navigate('/')}
            />
            <GallerySection items={siteData.gallery} onBookClick={goToBooking} />
            <BookingFormSection
              preselectedService={preselectedService}
              preselectedOfferNote={preselectedOfferNote}
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
              services={siteData.services}
              offers={siteData.offers}
            />
          </>
        )}

        {/* PAGE 4: OFFERS & PACKAGES */}
        {currentPath === '/offers' && (
          <>
            <PageHeaderBanner
              eyebrow="Seasonal Privileges"
              title="Wellness Packages & Offers"
              subtitle="Curated weekday escapes, couple sanctuary packages, and first-visit welcome privileges."
              onBackHome={() => navigate('/')}
            />
            <WelcomeOfferSection
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
              services={siteData.services}
              onApplyOfferToForm={handleApplyOfferToForm}
            />
            <OffersSection offers={siteData.offers} config={siteData.config} />
            <BookingFormSection
              preselectedService={preselectedService}
              preselectedOfferNote={preselectedOfferNote}
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
              services={siteData.services}
              offers={siteData.offers}
            />
          </>
        )}

        {/* PAGE 5: WELLNESS BLOG */}
        {(currentPath === '/blog' || currentPath.startsWith('/blog/')) && (
          <>
            {!blogSlug && (
              <PageHeaderBanner
                eyebrow="Spark Wellness Journal"
                title="Spa Insights, Massage Guides & Stories"
                subtitle="Articles, wellness tips, and sanctuary stories published directly by our spa team."
                onBackHome={() => navigate('/')}
              />
            )}
            <BlogSection
              blogs={siteData.blogs}
              config={siteData.config}
              mode="full"
              activeSlug={blogSlug}
              onOpenArticle={(slug) => navigate(`/blog/${encodeURIComponent(slug)}`)}
              onBackToBlogList={() => navigate('/blog')}
              onBookNowClick={goToBooking}
            />
          </>
        )}

        {/* PAGE 6: CONTACT & BOOKING */}
        {currentPath === '/contact' && (
          <>
            <PageHeaderBanner
              eyebrow="Visit & Reserve"
              title="Contact & Book Appointment"
              subtitle={`Reserve your preferred time slot on WhatsApp or visit ${siteData.config.brandName} in ${siteData.config.area}.`}
              onBackHome={() => navigate('/')}
            />
            <LocationSection config={siteData.config} />
            <BookingFormSection
              preselectedService={preselectedService}
              preselectedOfferNote={preselectedOfferNote}
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
              services={siteData.services}
              offers={siteData.offers}
            />
          </>
        )}
      </main>

      <Footer config={siteData.config} onNavigate={navigate} />
      <MobileStickyBar config={siteData.config} />
    </div>
  );
}
