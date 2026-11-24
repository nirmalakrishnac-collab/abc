export interface SpaService {
  id: string;
  index: string;
  name: string;
  category: 'massage' | 'salon' | 'holistic';
  categoryLabel: string;
  shortDescription: string;
  /** Editable duration placeholder (replace with exact minutes when finalized) */
  duration: string;
  /** Editable tariff placeholder (replace with exact pricing when finalized) */
  pricePlaceholder: string;
  image: string;
  imageAlt: string;
}

export interface WhyChoosePillar {
  id: string;
  index: string;
  title: string;
  description: string;
  iconName: 'wind' | 'award' | 'shield' | 'heart' | 'mappin' | 'calendar';
}

export interface GalleryItem {
  id: string;
  title: string;
  spaceCategory: 'interiors' | 'suites' | 'rituals';
  categoryLabel: string;
  caption: string;
  image: string;
  imageAlt: string;
  spanClass: string;
}

export interface SpaOffer {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  inclusions: string[];
  /** Editable offer duration placeholder */
  durationPlaceholder: string;
  /** Editable offer price placeholder */
  pricePlaceholder: string;
}

export interface WelcomeOfferConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  highlightNote: string;
  offerCode: string;
  ctaLabel: string;
  whatsappGreeting: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  status: 'published' | 'draft';
}

export interface SiteContentState {
  config: typeof SPA_CONFIG;
  welcomeOffer: WelcomeOfferConfig;
  services: SpaService[];
  gallery: GalleryItem[];
  offers: SpaOffer[];
  blogs: BlogPost[];
}

/**
 * Editable central business configuration for Spark Spa & Salon.
 * Update phone, WhatsApp number, exact street address, and coordinates here.
 */
export const SPA_CONFIG = {
  brandName: 'Spark Spa & Salon',
  area: 'Electronic City, Bangalore',
  displayAddressLine1: 'Spark Spa & Salon',
  displayAddressLine2: 'Electronic City Phase 1, Bangalore, Karnataka, India.',
  editableStreetNote: 'Electronic City Phase 1 & Phase 2 · Exact street address & landmark configurable',
  hours: 'Open Daily · 10:00 AM – 9:30 PM',
  /** Replace with official E.164 WhatsApp number (country code + number, no + or spaces) */
  whatsappNumber: '919800000000',
  /** Replace with official business telephone link */
  phoneDisplay: '+91 98000 00000',
  phoneHref: 'tel:+919800000000',
  email: 'concierge@sparkspa.in',
  /** Electronic City, Bangalore coordinates (update once exact storefront pin is confirmed) */
  coordinates: {
    lat: 12.8452,
    lng: 77.6602,
  },
};

/**
 * Editable Welcome / Opening Offer shown on the site & in the instant WhatsApp/Call Popup.
 */
export const WELCOME_OFFER: WelcomeOfferConfig = {
  eyebrow: 'Namaste · Electronic City Spa & Salon Privilege',
  title: 'Exclusive First-Visit Spa & Salon Offer',
  subtitle:
    'Tap WhatsApp or Call below to unlock our exclusive Electronic City welcome privilege—valid on signature body massages, couple spa suites, hair spa, keratin rituals, and radiance facials.',
  highlightNote: 'Instant Confirmation · Valid for Walk-In & Same-Day Spa & Salon Slots',
  offerCode: 'SPARK-WELCOME',
  ctaLabel: 'Claim Offer on WhatsApp',
  whatsappGreeting:
    'Namaste Spark Spa & Salon (Electronic City, Bangalore), I would like to claim the Website Welcome Offer (SPARK-WELCOME) and check today’s available Spa & Salon appointment slots.',
};

export function buildWhatsAppUrl(message: string, whatsappNumber: string = SPA_CONFIG.whatsappNumber): string {
  const cleanNum = whatsappNumber.replace(/\D/g, '') || SPA_CONFIG.whatsappNumber;
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
}

export function buildDirectionsUrl(
  coordinates: { lat: number; lng: number } = SPA_CONFIG.coordinates,
  brandName: string = SPA_CONFIG.brandName,
  area: string = SPA_CONFIG.area
): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&query=${encodeURIComponent(
    `${brandName}, ${area}`
  )}`;
}

/**
 * Editable service catalog.
 * Durations and prices intentionally use clean editable placeholders without invented rates.
 */
export const SERVICES_DATA: SpaService[] = [
  {
    id: 'swedish-massage',
    index: '01',
    name: 'Swedish Massage',
    category: 'massage',
    categoryLabel: 'Classic Bodywork',
    shortDescription:
      'Long, flowing effleurage strokes using warm botanical oil to ease everyday tension, restore circulation, and quiet a busy mind.',
    duration: 'Duration: Custom Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/therapy_swedish_action_1795111730062.jpg',
    imageAlt:
      'Spa therapist performing a relaxing Swedish back and shoulder massage in a candlelit travertine suite at Spark Spa Electronic City',
  },
  {
    id: 'deep-tissue-massage',
    index: '02',
    name: 'Deep Tissue Massage',
    category: 'massage',
    categoryLabel: 'Restorative Therapy',
    shortDescription:
      'Targeted, slow myofascial release designed for neck, shoulder, and lower-back stiffness caused by long workdays and travel.',
    duration: 'Duration: Custom Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/therapy_deep_tissue_action_1795111730542.jpg',
    imageAlt:
      'Wellness therapist performing restorative deep tissue shoulder and back massage with warm basalt stones at Spark Spa',
  },
  {
    id: 'aromatherapy',
    index: '03',
    name: 'Aromatherapy',
    category: 'massage',
    categoryLabel: 'Botanical Infusion',
    shortDescription:
      'Bespoke Mysore sandalwood, eucalyptus, and lavender essential oil blends paired with rhythmic touch to rebalance energy.',
    duration: 'Duration: Custom Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/therapy_aromatherapy_action_1795111730499.jpg',
    imageAlt:
      'Indian aromatherapy ritual with therapist pouring warm golden botanical oil beside essential oil bottles and candlelight at Spark Spa',
  },
  {
    id: 'relaxation-therapy',
    index: '04',
    name: 'Relaxation Therapy',
    category: 'holistic',
    categoryLabel: 'Mindful Calm',
    shortDescription:
      'Unrushed, gentle cranial, shoulder, and full-body soothing therapy crafted for deep restorative sleep and mental stillness.',
    duration: 'Duration: Custom Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/therapy_relaxation_action_1795111729764.jpg',
    imageAlt:
      'Therapist performing calming head and temple acupressure relaxation massage in a backlit alabaster suite at Spark Spa Bangalore',
  },
  {
    id: 'couple-spa-packages',
    index: '05',
    name: 'Couple Spa Packages',
    category: 'holistic',
    categoryLabel: 'Private Sanctuary',
    shortDescription:
      'Share quiet unhurried hours in our private couple suite with side-by-side signature massages, warm bath rituals, and herbal infusions.',
    duration: 'Duration: Custom Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/therapy_couple_action_1795111730015.jpg',
    imageAlt:
      'Royal Indian couple spa suite with carved arches, brass lanterns, dual massage beds, and rose petal soaking bath at Spark Spa',
  },
  {
    id: 'body-wellness-treatments',
    index: '06',
    name: 'Body Wellness Treatments',
    category: 'holistic',
    categoryLabel: 'Exfoliation & Compresses',
    shortDescription:
      'Mineral-rich botanical body polishes, steamed herbal poultices, and nourishing wraps that leave skin luminous and deeply hydrated.',
    duration: 'Duration: Custom Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/therapy_body_wellness_action_1795111730071.jpg',
    imageAlt:
      'Therapist applying warm steamed herbal poultice compresses during a body wellness treatment at Spark Spa & Salon Electronic City',
  },
  {
    id: 'hair-spa-keratin',
    index: '07',
    name: 'Luxury Hair Spa & Keratin Rituals',
    category: 'salon',
    categoryLabel: 'Hair Salon & Care',
    shortDescription:
      'Deep scalp nourishment, botanical steam conditioning, frizz-control keratin smoothing, and relaxing head massage for glossy, healthy hair.',
    duration: 'Duration: Custom Salon Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/salon_hair_styling_1795541015663.jpg',
    imageAlt:
      'Luxury hair spa and keratin styling studio at Spark Spa & Salon in Electronic City, Bangalore',
  },
  {
    id: 'signature-haircut-styling',
    index: '08',
    name: 'Signature Haircut & Blowout Styling',
    category: 'salon',
    categoryLabel: 'Hair Salon & Styling',
    shortDescription:
      'Precision cuts for women and men, tailored texture layering, nourishing hair wash, and polished salon blowout finishes by senior stylists.',
    duration: 'Duration: Custom Salon Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/salon_hair_styling_1795541015663.jpg',
    imageAlt:
      'Senior hair stylist crafting luxury blowout styling at Spark Spa & Salon Electronic City Bangalore',
  },
  {
    id: 'bridal-radiance-facials',
    index: '09',
    name: 'Radiance & Bridal Glow Facials',
    category: 'salon',
    categoryLabel: 'Skin & Beauty Salon',
    shortDescription:
      'Hydra-cleanse botanical facials, de-tan rituals, lymphatic face sculpting, and golden radiance masks for luminous event-ready skin.',
    duration: 'Duration: Custom Salon Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/salon_facial_glow_1795541016170.jpg',
    imageAlt:
      'Esthetician applying golden botanical radiance facial at Spark Spa & Salon Electronic City',
  },
  {
    id: 'luxury-manicure-pedicure',
    index: '10',
    name: 'Luxury Spa Manicure & Pedicure',
    category: 'salon',
    categoryLabel: 'Nail & Foot Salon',
    shortDescription:
      'Rose-petal warm mineral foot soak, gentle exfoliation, cuticle precision care, hydrating paraffin/mask wrap, and relaxing lower-leg massage.',
    duration: 'Duration: Custom Salon Session',
    pricePlaceholder: 'Tariff: Price Upon Enquiry',
    image: '/src/assets/images/salon_manicure_pedicure_1795541017059.jpg',
    imageAlt:
      'Luxury rose petal foot soak and spa pedicure lounge at Spark Spa & Salon Electronic City Bangalore',
  },
];

export const WHY_CHOOSE_DATA: WhyChoosePillar[] = [
  {
    id: 'atmosphere',
    index: '01',
    title: 'Spa & Salon Under One Roof',
    description:
      'Pair restorative massages and thermal steam with precision haircuts, keratin hair spa, radiance facials, and manicure-pedicure rituals in one serene destination.',
    iconName: 'wind',
  },
  {
    id: 'therapists',
    index: '02',
    title: 'Certified Therapists & Stylists',
    description:
      'Experienced wellness bodywork therapists alongside senior hair stylists and skin estheticians trained in gentle, bespoke consultation.',
    iconName: 'award',
  },
  {
    id: 'hygiene',
    index: '03',
    title: 'Five-Star Hygienic Suites',
    description:
      'Freshly laundered organic cotton linens, sterilized salon instruments before every guest, and private sound-insulated therapy suites.',
    iconName: 'shield',
  },
  {
    id: 'personalized',
    index: '04',
    title: 'Tailored Skin, Hair & Body Care',
    description:
      'Every spa or salon visit begins with a quick personal assessment to match oil blends, massage pressure, hair texture care, or skin actives to your needs.',
    iconName: 'heart',
  },
  {
    id: 'location',
    index: '05',
    title: 'Prime Electronic City Location',
    description:
      'Conveniently located in Electronic City, Bangalore for effortless weekday grooming, post-work recovery, and weekend couple indulgence.',
    iconName: 'mappin',
  },
  {
    id: 'booking',
    index: '06',
    title: '1-Tap WhatsApp & Call Booking',
    description:
      'Skip lengthy forms—tap WhatsApp or Call directly to check real-time availability, claim welcome privileges, and lock in your slot in seconds.',
    iconName: 'calendar',
  },
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'sanctuary-pool',
    title: 'The Candlelit Sanctuary Atrium',
    spaceCategory: 'interiors',
    categoryLabel: 'Luxury Spa Interiors',
    caption:
      'Warm travertine colonnades, teak accents, and tranquil water reflections set the pace for unhurried restoration.',
    image: '/src/assets/images/hero_spa_sanctuary_1795110762237.jpg',
    imageAlt: 'Luxury spa interior with candlelit reflection pool at Spark Spa Electronic City Bangalore',
    spanClass: 'md:col-span-7 md:row-span-2',
  },
  {
    id: 'couple-suite',
    title: 'Royal Couple Sanctuary Suite',
    spaceCategory: 'suites',
    categoryLabel: 'Couple Sanctuary',
    caption:
      'Carved archways, brass lanterns, dual heated treatment beds, and a carved stone floral soaking bath.',
    image: '/src/assets/images/therapy_couple_action_1795111730015.jpg',
    imageAlt: 'Private Indian luxury couple massage suite with stone soaking tub at Spark Spa Electronic City',
    spanClass: 'md:col-span-5',
  },
  {
    id: 'thermal-suite',
    title: 'Slate Thermal & Rain Suite',
    spaceCategory: 'rituals',
    categoryLabel: 'Spa Facilities',
    caption:
      'Private charcoal-slate steam sanctuary and brushed brass rain showers to prepare muscles before bodywork.',
    image: '/src/assets/images/gallery_hydro_suite_1795110760651.jpg',
    imageAlt: 'Charcoal slate steam room and rain shower suite at Spark Spa Bangalore',
    spanClass: 'md:col-span-5',
  },
  {
    id: 'aromatherapy-ritual',
    title: 'Botanical Oil & Aroma Ritual',
    spaceCategory: 'rituals',
    categoryLabel: 'Wellness Experience',
    caption:
      'Warm sandalwood and eucalyptus oils poured fresh for every session amid glowing beeswax candles.',
    image: '/src/assets/images/therapy_aromatherapy_action_1795111730499.jpg',
    imageAlt: 'Aromatherapy oil pouring ritual in candlelit suite at Spark Spa',
    spanClass: 'md:col-span-4',
  },
  {
    id: 'lounge-ambience',
    title: 'Quiet Tea & Transition Lounge',
    spaceCategory: 'interiors',
    categoryLabel: 'Relaxing Ambience',
    caption:
      'Linen-draped daylight lounge where guests unwind with warm tulsi-ginger infusions before and after therapy.',
    image: '/src/assets/images/gallery_lounge_ambience_1795110761454.jpg',
    imageAlt: 'Curved bouclé armchairs and sheer curtains in Spark Spa relaxation lounge',
    spanClass: 'md:col-span-4',
  },
  {
    id: 'herbal-poultice-suite',
    title: 'Herbal Compress Therapy Suite',
    spaceCategory: 'suites',
    categoryLabel: 'Therapy Suites',
    caption:
      'Steamed organic cotton herbal poultices and mineral sea-salt rituals inside our daylight suites.',
    image: '/src/assets/images/therapy_body_wellness_action_1795111730071.jpg',
    imageAlt: 'Herbal poultice massage treatment inside Spark Spa Electronic City',
    spanClass: 'md:col-span-4',
  },
  {
    id: 'salon-hair-studio',
    title: 'Luxury Hair & Styling Studio',
    spaceCategory: 'interiors',
    categoryLabel: 'Hair Salon Lounge',
    caption:
      'Arched brass mirrors, plush travertine styling stations, and dedicated keratin & hair spa care.',
    image: '/src/assets/images/salon_hair_styling_1795541015663.jpg',
    imageAlt: 'Luxury hair salon and blowout styling studio at Spark Spa & Salon Electronic City',
    spanClass: 'md:col-span-4',
  },
  {
    id: 'salon-facial-suite',
    title: 'Radiance Facial & Skin Suite',
    spaceCategory: 'suites',
    categoryLabel: 'Beauty & Skin Salon',
    caption:
      'Calm botanical facial suite designed for golden glow facials, hydra-cleanse, and event skin prep.',
    image: '/src/assets/images/salon_facial_glow_1795541016170.jpg',
    imageAlt: 'Botanical glow facial suite inside Spark Spa & Salon Electronic City Bangalore',
    spanClass: 'md:col-span-4',
  },
  {
    id: 'salon-pedicure-lounge',
    title: 'Rose-Petal Nail & Foot Lounge',
    spaceCategory: 'rituals',
    categoryLabel: 'Manicure & Pedicure Salon',
    caption:
      'Carved travertine foot soaking bowls with warm rose petals, organic scrubs, and luxury nail care.',
    image: '/src/assets/images/salon_manicure_pedicure_1795541017059.jpg',
    imageAlt: 'Luxury spa manicure and pedicure lounge at Spark Spa & Salon Electronic City',
    spanClass: 'md:col-span-4',
  },
];

/**
 * Editable seasonal offers & curated Spa + Salon packages.
 * Replace durationPlaceholder and pricePlaceholder with live rates as desired.
 */
export const OFFERS_DATA: SpaOffer[] = [
  {
    id: 'weekday-reset',
    code: 'Package 01',
    title: 'Weekday Executive Spa & Grooming Reset',
    subtitle: 'Built for Electronic City professionals looking to unwind and refresh in a single visit.',
    inclusions: [
      'Choice of Deep Tissue or Swedish Massage',
      'Refreshing Hair Wash, Blowout Styling & Neck Compress',
      'Complimentary thermal shower access & spiced herbal tea',
    ],
    durationPlaceholder: 'Editable Duration · Weekday Slots',
    pricePlaceholder: 'Special Weekday Tariff (Editable)',
  },
  {
    id: 'couple-retreat',
    code: 'Package 02',
    title: 'Signature Couple Spa & Glow Sanctuary',
    subtitle: 'A private candlelit retreat combining couple bodywork with salon radiance care.',
    inclusions: [
      'Side-by-side Aromatherapy or Relaxation Massage',
      'Private floral stone soaking ritual or Express Glow Facial',
      'Warm botanical body polish & lounge refreshments',
    ],
    durationPlaceholder: 'Editable Duration · Private Suite',
    pricePlaceholder: 'Couple Package Tariff (Editable)',
  },
  {
    id: 'full-renewal',
    code: 'Package 03',
    title: 'Complete Spa & Salon Renewal Ritual',
    subtitle: 'Head-to-toe beauty and wellness indulgence pairing salon treatments with full-body spa therapy.',
    inclusions: [
      'Luxury Hair Spa + Radiance Facial treatment',
      'Full-body Relaxation or Aromatherapy massage',
      'Rose-petal Spa Manicure & Pedicure finish',
    ],
    durationPlaceholder: 'Editable Duration · Full Day Ritual',
    pricePlaceholder: 'Package Tariff Upon Enquiry (Editable)',
  },
];

export const PREFERRED_TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '1:00 PM',
  '2:30 PM',
  '4:00 PM',
  '5:30 PM',
  '7:00 PM',
  '8:15 PM',
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-deep-tissue-electronic-city',
    slug: 'why-deep-tissue-massage-helps-electronic-city-professionals',
    title: 'Why Electronic City Professionals Need Weekly Deep Tissue Restoration',
    category: 'Massage Therapy',
    excerpt:
      'Long hours at tech campuses and Electronic City commutes create deep neck and lower-back tension. Discover how targeted myofascial bodywork restores posture and sleep.',
    content:
      'Between extended laptop sessions across Electronic City Phase 1 and Phase 2 and daily Bangalore traffic along Hosur Road, chronic shoulder stiffness often settles deeper than surface soreness.\n\nUnlike a quick relaxation rub, authentic Deep Tissue Massage focuses on slow, deliberate strokes calibrated to your breath. By warming the fascia first with steam or heated compresses, our certified therapists ease stubborn knots around the trapezius and lumbar muscles without discomfort.\n\nPairing a 60- or 90-minute evening session with warm tulsi-ginger tea lets your nervous system switch from high alert into restorative recovery before you head home.',
    coverImage: '/src/assets/images/therapy_deep_tissue_action_1795111730542.jpg',
    coverAlt: 'Deep tissue shoulder and back massage therapy at Spark Spa Electronic City',
    author: 'Spark Spa Wellness Desk',
    publishedAt: '2026-11-12',
    readTime: '3 min read',
    status: 'published',
  },
  {
    id: 'blog-sandalwood-aromatherapy',
    slug: 'mysore-sandalwood-aromatherapy-rituals-bangalore',
    title: 'Mysore Sandalwood & Botanical Oils: Inside Our Signature Aromatherapy Ritual',
    category: 'Ayurveda & Oils',
    excerpt:
      'Cold-pressed sesame bases infused with Karnataka sandalwood, lavender, and eucalyptus transform a classic spa appointment into deep sensory calm.',
    content:
      'Scent reaches the emotional center of the brain faster than sound or sight. When you step into a candlelit suite at Spark Spa in Electronic City, warm botanical notes immediately signal your body to slow down.\n\nEvery aromatherapy session begins with a personal consultation. Guests seeking mental clarity often choose crisp eucalyptus and lemongrass, while evening visitors prefer soothing Mysore sandalwood and wild lavender.\n\nWarmed to body temperature in brass vessels, the botanical blend deeply nourishes skin parched by air-conditioned offices while rhythmic effleurage strokes restore steady circulation.',
    coverImage: '/src/assets/images/therapy_aromatherapy_action_1795111730499.jpg',
    coverAlt: 'Indian aromatherapy ritual pouring warm golden essential oils by candlelight',
    author: 'Meera Nair, Lead Therapist',
    publishedAt: '2026-11-08',
    readTime: '4 min read',
    status: 'published',
  },
  {
    id: 'blog-couple-sanctuary-guide',
    slug: 'planning-a-private-couple-spa-retreat-electronic-city',
    title: 'How to Plan an Unhurried Couple Spa Retreat in South Bangalore',
    category: 'Couple Retreats',
    excerpt:
      'Celebrate anniversaries or simply reclaim a quiet weekend afternoon inside a sound-insulated couple sanctuary complete with floral stone bath rituals.',
    content:
      'True luxury is uninterrupted time together away from notifications and city noise. Our Royal Couple Sanctuary Suite at Spark Spa is crafted for unhurried privacy from start to finish.\n\nGuests begin with a private warm thermal shower, followed by side-by-side signature Swedish or Aromatherapy massages tailored independently for each partner’s preferred pressure.\n\nFinish with warm herbal compresses and unhurried tea in our linen lounge—or reserve your exact preferred evening time slot in one tap via WhatsApp.',
    coverImage: '/src/assets/images/therapy_couple_action_1795111730015.jpg',
    coverAlt: 'Royal Indian couple spa suite with brass lanterns and rose petal stone soaking tub',
    author: 'Spark Spa Concierge',
    publishedAt: '2026-11-02',
    readTime: '3 min read',
    status: 'published',
  },
];

export const INITIAL_SITE_STATE: SiteContentState = {
  config: SPA_CONFIG,
  welcomeOffer: WELCOME_OFFER,
  services: SERVICES_DATA,
  gallery: GALLERY_DATA,
  offers: OFFERS_DATA,
  blogs: INITIAL_BLOGS,
};

