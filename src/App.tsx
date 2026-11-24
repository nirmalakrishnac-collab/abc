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

  // Update dynamic canonical URL, per-page SEO title, meta description, and Electronic City Spa & Salon keywords
  useEffect(() => {
    const currentUrl = window.location.origin + currentPath;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    const setMetaTag = (attr: 'name' | 'property', key: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    setMetaTag('property', 'og:url', currentUrl);

    const brand = siteData.config.brandName;
    let title = `${brand} | Best Spa & Salon in Electronic City, Bangalore`;
    let description = `Luxury body massage spa & hair, skin, and beauty salon in Electronic City, Bangalore. Book Swedish, deep tissue, couple spa, facials & hair spa via WhatsApp or Call.`;
    let keywords = 'best spa and salon in electronic city, luxury spa electronic city bangalore, hair and beauty salon electronic city, body massage near electronic city phase 1, couple spa electronic city, facial and hair spa electronic city, spark spa and salon bangalore';

    if (currentPath === '/spa-services') {
      title = `Best Body Massage & Couple Spa in Electronic City | ${brand}`;
      description = `Book Swedish massage, deep tissue massage, aromatherapy, relaxation therapy & luxury couple spa packages in Electronic City, Bangalore via WhatsApp or Call.`;
      keywords = 'best spa in electronic city, body massage electronic city bangalore, deep tissue massage electronic city, couple spa electronic city, aromatherapy spa electronic city phase 1, swedish massage near hosur road, spark spa electronic city';
    } else if (currentPath === '/salon-services') {
      title = `Best Hair & Beauty Salon in Electronic City | ${brand}`;
      description = `Visit ${brand} in Electronic City, Bangalore for keratin hair spa, precision haircuts, blowout styling, bridal radiance facials & luxury manicure-pedicure.`;
      keywords = 'best salon in electronic city, hair salon electronic city bangalore, keratin hair spa electronic city, bridal facial electronic city, manicure pedicure salon electronic city, beauty parlour near electronic city phase 1, unisex hair salon electronic city';
    } else if (currentPath === '/services') {
      title = `Spa Massages & Salon Menu | ${brand} Electronic City`;
      description = `Explore full spa massage therapies and beauty salon services in Electronic City, Bangalore: Deep Tissue, Swedish, Hair Spa, Keratin, Radiance Facials & Nail Care.`;
      keywords = 'spa services electronic city, salon services electronic city bangalore, deep tissue massage electronic city, hair spa keratin electronic city, bridal facial electronic city, manicure pedicure electronic city, unisex spa and salon electronic city';
    } else if (currentPath === '/gallery') {
      title = `Spa Suites & Salon Studio Gallery | ${brand} Electronic City`;
      description = `View private candlelit massage rooms, royal couple sanctuary, steam suites, and modern hair & beauty salon studios at ${brand} Electronic City.`;
      keywords = 'luxury spa interiors electronic city, couple spa rooms bangalore, beauty salon interior electronic city, hygienic spa suites electronic city, thermal steam room electronic city, spark spa gallery bangalore';
    } else if (currentPath === '/offers') {
      title = `Spa & Salon Offers & Packages | ${brand} Electronic City`;
      description = `Unlock first-visit spa & salon offers, weekday executive reset deals, and couple sanctuary packages in Electronic City, Bangalore. Claim via WhatsApp or Call.`;
      keywords = 'spa offers electronic city, salon deals electronic city bangalore, couple spa package electronic city, weekday massage offer bangalore, bridal facial package electronic city, hair spa combo offer electronic city';
    } else if (currentPath === '/blog' || currentPath.startsWith('/blog/')) {
      title = `Spa & Beauty Wellness Blog | ${brand} Electronic City`;
      description = `Expert skincare, hair spa, deep tissue recovery, and aromatherapy guides from certified therapists & stylists in Electronic City, Bangalore.`;
      keywords = 'spa and salon tips bangalore, deep tissue massage benefits electronic city, keratin hair spa guide bangalore, aromatherapy sandalwood oils, bridal skincare electronic city, wellness blog electronic city';
    } else if (currentPath === '/contact') {
      title = `Book Spa & Salon Appointment | ${brand} Electronic City`;
      description = `Call or WhatsApp ${brand} in Electronic City, Bangalore for instant spa massage or salon appointment slots. Open daily 10 AM – 9:30 PM.`;
      keywords = 'book spa electronic city, salon appointment electronic city bangalore, spa phone number electronic city, whatsapp spa booking bangalore, spa near hosur road electronic city, best spa near infosys electronic city';
    } else if (currentPath === '/client-portal') {
      title = `Client Content Studio | ${brand}`;
    }

    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
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
              onExploreSpa={() => navigate('/spa-services')}
              onExploreSalon={() => navigate('/salon-services')}
            />
            <WelcomeOfferSection
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
            />
            <ServicesSection
              sectionScope="spa"
              services={siteData.services}
              config={siteData.config}
              onSelectService={handleSelectService}
              previewLimit={3}
              onViewAllClick={() => navigate('/spa-services')}
            />
            <ServicesSection
              sectionScope="salon"
              services={siteData.services}
              config={siteData.config}
              onSelectService={handleSelectService}
              previewLimit={3}
              onViewAllClick={() => navigate('/salon-services')}
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

        {/* PAGE 2A: DEDICATED SPA SERVICES PAGE */}
        {currentPath === '/spa-services' && (
          <>
            <PageHeaderBanner
              eyebrow="Restorative Spa Sanctuary"
              title="Spa &amp; Body Massage Therapies"
              subtitle={`Swedish, Deep Tissue, Aromatherapy, Relaxation & private Couple Spa sanctuaries at ${siteData.config.brandName}, ${siteData.config.area}.`}
              onBackHome={() => navigate('/')}
            />
            <ServicesSection
              sectionScope="spa"
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

        {/* PAGE 2B: DEDICATED SALON SERVICES PAGE */}
        {currentPath === '/salon-services' && (
          <>
            <PageHeaderBanner
              eyebrow="Hair, Skin &amp; Nail Studio"
              title="Luxury Hair &amp; Beauty Salon Services"
              subtitle={`Keratin hair spa, signature haircuts, blowout styling, bridal radiance facials, and rose-petal manicure-pedicure rituals at ${siteData.config.brandName}, ${siteData.config.area}.`}
              onBackHome={() => navigate('/')}
            />
            <ServicesSection
              sectionScope="salon"
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

        {/* PAGE 2C: COMBINED SERVICES FALLBACK ROUTE (separate sections) */}
        {currentPath === '/services' && (
          <>
            <PageHeaderBanner
              eyebrow="Spa &amp; Salon Menu"
              title="Signature Spa Therapies &amp; Salon Services"
              subtitle={`Explore every massage, couple wellness ritual, hair spa, facial, and salon treatment at ${siteData.config.brandName}, ${siteData.config.area}.`}
              onBackHome={() => navigate('/')}
            />
            <ServicesSection
              sectionScope="spa"
              services={siteData.services}
              config={siteData.config}
              onSelectService={handleSelectService}
            />
            <ServicesSection
              sectionScope="salon"
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
              title="Spa &amp; Salon Packages &amp; Offers"
              subtitle="Curated weekday resets, couple sanctuary retreats, and first-visit Spa & Salon welcome privileges."
              onBackHome={() => navigate('/')}
            />
            <WelcomeOfferSection
              config={siteData.config}
              welcomeOffer={siteData.welcomeOffer}
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
