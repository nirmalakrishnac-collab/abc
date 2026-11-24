<?php
/**
 * Spark Spa — Central Multi-Page & Client CMS Loader (PHP + HTML)
 * Seed defaults below are automatically merged with any blogs, photos,
 * services, offers, or contact updates saved via client-dashboard.php.
 */

$data_dir = __DIR__ . '/data';
$uploads_dir = __DIR__ . '/uploads';
if (!is_dir($data_dir)) { @mkdir($data_dir, 0755, true); }
if (!is_dir($uploads_dir)) { @mkdir($uploads_dir, 0755, true); }

$cms_file = $data_dir . '/cms-data.json';

$default_config = [
    'brand_name' => 'Spark Spa & Salon',
    'area' => 'Electronic City, Bangalore',
    'address_line_1' => 'Spark Spa & Salon',
    'address_line_2' => 'Electronic City Phase 1, Bangalore, Karnataka, India.',
    'street_note' => 'Electronic City Phase 1 & Phase 2 · Exact street address & landmark configurable',
    'hours' => 'Open Daily · 10:00 AM – 9:30 PM',
    'whatsapp_number' => '919800000000',
    'phone_display' => '+91 98000 00000',
    'phone_href' => 'tel:+919800000000',
    'email' => 'concierge@sparkspa.in',
    'coordinates' => [
        'lat' => 12.8452,
        'lng' => 77.6602,
    ],
    'google_maps_api_key' => '',
];

$default_welcome_offer = [
    'eyebrow' => 'Namaste · Electronic City Spa & Salon Privilege',
    'title' => 'Exclusive First-Visit Spa & Salon Offer',
    'subtitle' => 'Tap WhatsApp or Call below to unlock our exclusive Electronic City welcome privilege—valid on signature body massages, couple spa suites, hair spa, keratin rituals, and radiance facials.',
    'highlight_note' => 'Instant Confirmation · Valid for Walk-In & Same-Day Spa & Salon Slots',
    'offer_code' => 'SPARK-WELCOME',
    'cta_label' => 'Claim Offer on WhatsApp',
    'whatsapp_greeting' => 'Namaste Spark Spa & Salon (Electronic City, Bangalore), I would like to claim the Website Welcome Offer (SPARK-WELCOME) and check today’s available Spa & Salon appointment slots.',
];

$default_services = [
    [
        'id' => 'swedish-massage',
        'index' => '01',
        'name' => 'Swedish Massage',
        'category' => 'massage',
        'category_label' => 'Classic Bodywork',
        'description' => 'Long, flowing effleurage strokes using warm botanical oil to ease everyday tension, restore circulation, and quiet a busy mind.',
        'duration' => 'Duration: Custom Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/therapy_swedish_action_1795111730062.jpg',
        'alt' => 'Spa therapist performing a relaxing Swedish back and shoulder massage in a candlelit travertine suite at Spark Spa & Salon Electronic City',
    ],
    [
        'id' => 'deep-tissue-massage',
        'index' => '02',
        'name' => 'Deep Tissue Massage',
        'category' => 'massage',
        'category_label' => 'Restorative Therapy',
        'description' => 'Targeted, slow myofascial release designed for neck, shoulder, and lower-back stiffness caused by long workdays and travel.',
        'duration' => 'Duration: Custom Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/therapy_deep_tissue_action_1795111730542.jpg',
        'alt' => 'Wellness therapist performing restorative deep tissue shoulder and back massage with warm basalt stones at Spark Spa & Salon',
    ],
    [
        'id' => 'aromatherapy',
        'index' => '03',
        'name' => 'Aromatherapy',
        'category' => 'massage',
        'category_label' => 'Botanical Infusion',
        'description' => 'Bespoke Mysore sandalwood, eucalyptus, and lavender essential oil blends paired with rhythmic touch to rebalance energy.',
        'duration' => 'Duration: Custom Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/therapy_aromatherapy_action_1795111730499.jpg',
        'alt' => 'Indian aromatherapy ritual with therapist pouring warm golden botanical oil beside essential oil bottles and candlelight at Spark Spa & Salon',
    ],
    [
        'id' => 'relaxation-therapy',
        'index' => '04',
        'name' => 'Relaxation Therapy',
        'category' => 'holistic',
        'category_label' => 'Mindful Calm',
        'description' => 'Unrushed, gentle cranial, shoulder, and full-body soothing therapy crafted for deep restorative sleep and mental stillness.',
        'duration' => 'Duration: Custom Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/therapy_relaxation_action_1795111729764.jpg',
        'alt' => 'Therapist performing calming head and temple acupressure relaxation massage in a backlit alabaster suite at Spark Spa & Salon Bangalore',
    ],
    [
        'id' => 'couple-spa-packages',
        'index' => '05',
        'name' => 'Couple Spa Packages',
        'category' => 'holistic',
        'category_label' => 'Private Sanctuary',
        'description' => 'Share quiet unhurried hours in our private couple suite with side-by-side signature massages, warm bath rituals, and herbal infusions.',
        'duration' => 'Duration: Custom Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/therapy_couple_action_1795111730015.jpg',
        'alt' => 'Royal Indian couple spa suite with carved arches, brass lanterns, dual massage beds, and rose petal soaking bath at Spark Spa & Salon',
    ],
    [
        'id' => 'body-wellness-treatments',
        'index' => '06',
        'name' => 'Body Wellness Treatments',
        'category' => 'holistic',
        'category_label' => 'Exfoliation & Compresses',
        'description' => 'Mineral-rich botanical body polishes, steamed herbal poultices, and nourishing wraps that leave skin luminous and deeply hydrated.',
        'duration' => 'Duration: Custom Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/therapy_body_wellness_action_1795111730071.jpg',
        'alt' => 'Therapist applying warm steamed herbal poultice compresses during a body wellness treatment at Spark Spa & Salon Electronic City',
    ],
    [
        'id' => 'hair-spa-keratin',
        'index' => '07',
        'name' => 'Luxury Hair Spa & Keratin Rituals',
        'category' => 'salon',
        'category_label' => 'Hair Salon & Care',
        'description' => 'Deep scalp nourishment, botanical steam conditioning, frizz-control keratin smoothing, and relaxing head massage for glossy, healthy hair.',
        'duration' => 'Duration: Custom Salon Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/salon_hair_styling_1795541015663.jpg',
        'alt' => 'Luxury hair spa and keratin styling studio at Spark Spa & Salon in Electronic City, Bangalore',
    ],
    [
        'id' => 'signature-haircut-styling',
        'index' => '08',
        'name' => 'Signature Haircut & Blowout Styling',
        'category' => 'salon',
        'category_label' => 'Hair Salon & Styling',
        'description' => 'Precision cuts for women and men, tailored texture layering, nourishing hair wash, and polished salon blowout finishes by senior stylists.',
        'duration' => 'Duration: Custom Salon Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/salon_hair_styling_1795541015663.jpg',
        'alt' => 'Senior hair stylist crafting luxury blowout styling at Spark Spa & Salon Electronic City Bangalore',
    ],
    [
        'id' => 'bridal-radiance-facials',
        'index' => '09',
        'name' => 'Radiance & Bridal Glow Facials',
        'category' => 'salon',
        'category_label' => 'Skin & Beauty Salon',
        'description' => 'Hydra-cleanse botanical facials, de-tan rituals, lymphatic face sculpting, and golden radiance masks for luminous event-ready skin.',
        'duration' => 'Duration: Custom Salon Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/salon_facial_glow_1795541016170.jpg',
        'alt' => 'Esthetician applying golden botanical radiance facial at Spark Spa & Salon Electronic City',
    ],
    [
        'id' => 'luxury-manicure-pedicure',
        'index' => '10',
        'name' => 'Luxury Spa Manicure & Pedicure',
        'category' => 'salon',
        'category_label' => 'Nail & Foot Salon',
        'description' => 'Rose-petal warm mineral foot soak, gentle exfoliation, cuticle precision care, hydrating mask wrap, and relaxing lower-leg massage.',
        'duration' => 'Duration: Custom Salon Session',
        'price' => 'Tariff: Price Upon Enquiry',
        'image' => 'images/salon_manicure_pedicure_1795541017059.jpg',
        'alt' => 'Luxury rose petal foot soak and spa pedicure lounge at Spark Spa & Salon Electronic City Bangalore',
    ],
];

$why_choose = [
    ['index' => '01', 'title' => 'Spa & Salon Under One Roof', 'description' => 'Pair restorative massages and thermal steam with precision haircuts, keratin hair spa, radiance facials, and manicure-pedicure rituals in one serene destination.'],
    ['index' => '02', 'title' => 'Certified Therapists & Stylists', 'description' => 'Experienced wellness bodywork therapists alongside senior hair stylists and skin estheticians trained in gentle, bespoke consultation.'],
    ['index' => '03', 'title' => 'Five-Star Hygienic Suites', 'description' => 'Freshly laundered organic cotton linens, sterilized salon instruments before every guest, and private sound-insulated therapy suites.'],
    ['index' => '04', 'title' => 'Tailored Skin, Hair & Body Care', 'description' => 'Every spa or salon visit begins with a quick personal assessment to match oil blends, massage pressure, hair texture care, or skin actives to your needs.'],
    ['index' => '05', 'title' => 'Prime Electronic City Location', 'description' => 'Conveniently located in Electronic City, Bangalore for effortless weekday grooming, post-work recovery, and weekend couple indulgence.'],
    ['index' => '06', 'title' => '1-Tap WhatsApp & Call Booking', 'description' => 'Skip lengthy forms—tap WhatsApp or Call directly to check real-time availability, claim welcome privileges, and lock in your slot in seconds.'],
];

$default_gallery = [
    [
        'id' => 'sanctuary-pool',
        'title' => 'The Candlelit Sanctuary Atrium',
        'space_category' => 'interiors',
        'category_label' => 'Luxury Spa Interiors',
        'caption' => 'Warm travertine colonnades, teak accents, and tranquil water reflections set the pace for unhurried restoration.',
        'image' => 'images/hero_spa_sanctuary_1795110762237.jpg',
        'alt' => 'Luxury spa interior with candlelit reflection pool at Spark Spa & Salon Electronic City Bangalore',
        'span' => 'md:col-span-7 md:row-span-2',
    ],
    [
        'id' => 'couple-suite',
        'title' => 'Royal Couple Sanctuary Suite',
        'space_category' => 'suites',
        'category_label' => 'Couple Sanctuary',
        'caption' => 'Carved archways, brass lanterns, dual heated treatment beds, and a carved stone floral soaking bath.',
        'image' => 'images/therapy_couple_action_1795111730015.jpg',
        'alt' => 'Private Indian luxury couple massage suite with stone soaking tub at Spark Spa & Salon Electronic City',
        'span' => 'md:col-span-5',
    ],
    [
        'id' => 'thermal-suite',
        'title' => 'Slate Thermal & Rain Suite',
        'space_category' => 'rituals',
        'category_label' => 'Spa Facilities',
        'caption' => 'Private charcoal-slate steam sanctuary and brushed brass rain showers to prepare muscles before bodywork.',
        'image' => 'images/gallery_hydro_suite_1795110760651.jpg',
        'alt' => 'Charcoal slate steam room and rain shower suite at Spark Spa & Salon Bangalore',
        'span' => 'md:col-span-5',
    ],
    [
        'id' => 'aromatherapy-ritual',
        'title' => 'Botanical Oil & Aroma Ritual',
        'space_category' => 'rituals',
        'category_label' => 'Wellness Experience',
        'caption' => 'Warm sandalwood and eucalyptus oils poured fresh for every session amid glowing beeswax candles.',
        'image' => 'images/therapy_aromatherapy_action_1795111730499.jpg',
        'alt' => 'Aromatherapy oil pouring ritual in candlelit suite at Spark Spa & Salon',
        'span' => 'md:col-span-4',
    ],
    [
        'id' => 'lounge-ambience',
        'title' => 'Quiet Tea & Transition Lounge',
        'space_category' => 'interiors',
        'category_label' => 'Relaxing Ambience',
        'caption' => 'Linen-draped daylight lounge where guests unwind with warm tulsi-ginger infusions before and after therapy.',
        'image' => 'images/gallery_lounge_ambience_1795110761454.jpg',
        'alt' => 'Curved boucle armchairs and sheer curtains in Spark Spa & Salon relaxation lounge',
        'span' => 'md:col-span-4',
    ],
    [
        'id' => 'herbal-poultice-suite',
        'title' => 'Herbal Compress Therapy Suite',
        'space_category' => 'suites',
        'category_label' => 'Therapy Suites',
        'caption' => 'Steamed organic cotton herbal poultices and mineral sea-salt rituals inside our daylight suites.',
        'image' => 'images/therapy_body_wellness_action_1795111730071.jpg',
        'alt' => 'Herbal poultice massage treatment inside Spark Spa & Salon Electronic City',
        'span' => 'md:col-span-4',
    ],
    [
        'id' => 'salon-hair-studio',
        'title' => 'Luxury Hair & Styling Studio',
        'space_category' => 'interiors',
        'category_label' => 'Hair Salon Lounge',
        'caption' => 'Arched brass mirrors, plush travertine styling stations, and dedicated keratin & hair spa care.',
        'image' => 'images/salon_hair_styling_1795541015663.jpg',
        'alt' => 'Luxury hair salon and blowout styling studio at Spark Spa & Salon Electronic City',
        'span' => 'md:col-span-4',
    ],
    [
        'id' => 'salon-facial-suite',
        'title' => 'Radiance Facial & Skin Suite',
        'space_category' => 'suites',
        'category_label' => 'Beauty & Skin Salon',
        'caption' => 'Calm botanical facial suite designed for golden glow facials, hydra-cleanse, and event skin prep.',
        'image' => 'images/salon_facial_glow_1795541016170.jpg',
        'alt' => 'Botanical glow facial suite inside Spark Spa & Salon Electronic City Bangalore',
        'span' => 'md:col-span-4',
    ],
    [
        'id' => 'salon-pedicure-lounge',
        'title' => 'Rose-Petal Nail & Foot Lounge',
        'space_category' => 'rituals',
        'category_label' => 'Manicure & Pedicure Salon',
        'caption' => 'Carved travertine foot soaking bowls with warm rose petals, organic scrubs, and luxury nail care.',
        'image' => 'images/salon_manicure_pedicure_1795541017059.jpg',
        'alt' => 'Luxury spa manicure and pedicure lounge at Spark Spa & Salon Electronic City',
        'span' => 'md:col-span-4',
    ],
];

$default_offers = [
    [
        'id' => 'weekday-reset',
        'code' => 'Package 01',
        'title' => 'Weekday Executive Spa & Grooming Reset',
        'subtitle' => 'Built for Electronic City professionals looking to unwind and refresh in a single visit.',
        'inclusions' => [
            'Choice of Deep Tissue or Swedish Massage',
            'Refreshing Hair Wash, Blowout Styling & Neck Compress',
            'Complimentary thermal shower access & spiced herbal tea',
        ],
        'duration' => 'Editable Duration · Weekday Slots',
        'price' => 'Special Weekday Tariff (Editable)',
    ],
    [
        'id' => 'couple-retreat',
        'code' => 'Package 02',
        'title' => 'Signature Couple Spa & Glow Sanctuary',
        'subtitle' => 'A private candlelit retreat combining couple bodywork with salon radiance care.',
        'inclusions' => [
            'Side-by-side Aromatherapy or Relaxation Massage',
            'Private floral stone soaking ritual or Express Glow Facial',
            'Warm botanical body polish & lounge refreshments',
        ],
        'duration' => 'Editable Duration · Private Suite',
        'price' => 'Couple Package Tariff (Editable)',
    ],
    [
        'id' => 'full-renewal',
        'code' => 'Package 03',
        'title' => 'Complete Spa & Salon Renewal Ritual',
        'subtitle' => 'Head-to-toe beauty and wellness indulgence pairing salon treatments with full-body spa therapy.',
        'inclusions' => [
            'Luxury Hair Spa + Radiance Facial treatment',
            'Full-body Relaxation or Aromatherapy massage',
            'Rose-petal Spa Manicure & Pedicure finish',
        ],
        'duration' => 'Editable Duration · Full Day Ritual',
        'price' => 'Package Tariff Upon Enquiry (Editable)',
    ],
];

$default_blogs = [
    [
        'id' => 'blog-deep-tissue-ecity',
        'slug' => 'why-electronic-city-professionals-need-deep-tissue-restoration',
        'title' => 'Why Electronic City Professionals Need Weekly Deep Tissue Restoration',
        'category' => 'Massage Therapy',
        'excerpt' => 'Long hours at tech campuses and Electronic City commutes create deep neck and lower-back tension. Discover how targeted myofascial bodywork restores posture and sleep.',
        'content' => "Between extended laptop sessions across Electronic City Phase 1 and Phase 2 and daily Bangalore traffic along Hosur Road, chronic shoulder stiffness often settles deeper than surface soreness.\n\nUnlike a quick relaxation rub, authentic Deep Tissue Massage focuses on slow, deliberate strokes calibrated to your breath. By warming the fascia first with steam or heated compresses, our certified therapists ease stubborn knots around the trapezius and lumbar muscles without discomfort.\n\nPairing a 60- or 90-minute evening session with warm tulsi-ginger tea lets your nervous system switch from high alert into restorative recovery before you head home.",
        'image' => 'images/therapy_deep_tissue_action_1795111730542.jpg',
        'alt' => 'Deep tissue shoulder and back massage therapy at Spark Spa Electronic City',
        'author' => 'Spark Spa Wellness Desk',
        'published_at' => '2026-11-12',
        'read_time' => '3 min read',
        'status' => 'published',
    ],
    [
        'id' => 'blog-sandalwood-aroma',
        'slug' => 'mysore-sandalwood-aromatherapy-rituals-bangalore',
        'title' => 'Mysore Sandalwood & Botanical Oils: Inside Our Signature Aromatherapy Ritual',
        'category' => 'Ayurveda & Oils',
        'excerpt' => 'Cold-pressed sesame bases infused with Karnataka sandalwood, lavender, and eucalyptus transform a classic spa appointment into deep sensory calm.',
        'content' => "Scent reaches the emotional center of the brain faster than sound or sight. When you step into a candlelit suite at Spark Spa in Electronic City, warm botanical notes immediately signal your body to slow down.\n\nEvery aromatherapy session begins with a personal consultation. Guests seeking mental clarity often choose crisp eucalyptus and lemongrass, while evening visitors prefer soothing Mysore sandalwood and wild lavender.\n\nWarmed to body temperature in brass vessels, the botanical blend deeply nourishes skin parched by air-conditioned offices while rhythmic effleurage strokes restore steady circulation.",
        'image' => 'images/therapy_aromatherapy_action_1795111730499.jpg',
        'alt' => 'Indian aromatherapy ritual pouring warm golden essential oils by candlelight',
        'author' => 'Meera Nair, Lead Therapist',
        'published_at' => '2026-11-08',
        'read_time' => '4 min read',
        'status' => 'published',
    ],
    [
        'id' => 'blog-couple-retreat',
        'slug' => 'planning-a-private-couple-spa-retreat-electronic-city',
        'title' => 'How to Plan an Unhurried Couple Spa Retreat in South Bangalore',
        'category' => 'Couple Retreats',
        'excerpt' => 'Celebrate anniversaries or simply reclaim a quiet weekend afternoon inside a sound-insulated couple sanctuary complete with floral stone bath rituals.',
        'content' => "True luxury is uninterrupted time together away from notifications and city noise. Our Royal Couple Sanctuary Suite at Spark Spa is crafted for unhurried privacy from start to finish.\n\nGuests begin with a private warm thermal shower, followed by side-by-side signature Swedish or Aromatherapy massages tailored independently for each partner's preferred pressure.\n\nFinish with warm herbal compresses and unhurried tea in our linen lounge—or reserve your exact preferred evening time slot in one tap via WhatsApp.",
        'image' => 'images/therapy_couple_action_1795111730015.jpg',
        'alt' => 'Royal Indian couple spa suite with brass lanterns and rose petal stone soaking tub',
        'author' => 'Spark Spa Concierge',
        'published_at' => '2026-11-02',
        'read_time' => '3 min read',
        'status' => 'published',
    ],
];

$preferred_time_slots = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM', '7:00 PM', '8:15 PM'];

// Load or initialize persistent CMS JSON store
if (!file_exists($cms_file)) {
    $seed_data = [
        'config' => $default_config,
        'welcome_offer' => $default_welcome_offer,
        'services' => $default_services,
        'gallery_items' => $default_gallery,
        'offers' => $default_offers,
        'blogs' => $default_blogs,
    ];
    @file_put_contents($cms_file, json_encode($seed_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$loaded_cms = json_decode((string)@file_get_contents($cms_file), true);
if (!is_array($loaded_cms)) { $loaded_cms = []; }

$spa_config = array_replace_recursive($default_config, $loaded_cms['config'] ?? []);
$welcome_offer = array_replace($default_welcome_offer, $loaded_cms['welcome_offer'] ?? []);
$services = is_array($loaded_cms['services'] ?? null) && count($loaded_cms['services']) > 0 ? $loaded_cms['services'] : $default_services;
$gallery_items = is_array($loaded_cms['gallery_items'] ?? null) && count($loaded_cms['gallery_items']) > 0 ? $loaded_cms['gallery_items'] : $default_gallery;
$offers = is_array($loaded_cms['offers'] ?? null) && count($loaded_cms['offers']) > 0 ? $loaded_cms['offers'] : $default_offers;
$blogs = is_array($loaded_cms['blogs'] ?? null) ? $loaded_cms['blogs'] : $default_blogs;

function save_cms_data(array $payload): bool {
    global $cms_file;
    $tmp = $cms_file . '.tmp';
    if (@file_put_contents($tmp, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) === false) {
        return false;
    }
    return @rename($tmp, $cms_file);
}

function e(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function is_safe_asset_path(string $path): bool {
    return str_starts_with($path, 'images/') || str_starts_with($path, 'uploads/');
}

function build_whatsapp_url(string $message, array $config): string {
    $digits = preg_replace('/\D+/', '', (string)($config['whatsapp_number'] ?? '919800000000'));
    return 'https://wa.me/' . rawurlencode($digits) . '?text=' . rawurlencode($message);
}

function build_directions_url(array $config): string {
    $lat = $config['coordinates']['lat'];
    $lng = $config['coordinates']['lng'];
    $query = rawurlencode($config['brand_name'] . ', ' . $config['area']);
    return "https://www.google.com/maps/dir/?api=1&destination={$lat},{$lng}&query={$query}";
}
