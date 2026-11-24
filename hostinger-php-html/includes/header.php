<?php
if (!isset($page_title)) {
    $page_title = "{$spa_config['brand_name']} | Best Luxury Spa & Salon in Electronic City, Bangalore";
}
if (!isset($page_description)) {
    $page_description = "Relax and glow at {$spa_config['brand_name']}, the premier luxury massage spa & beauty salon in Electronic City, Bangalore. Book Swedish, deep tissue, hair spa, facials & couple spa via WhatsApp or Call.";
}
if (!isset($page_keywords)) {
    $page_keywords = "best spa and salon in electronic city, luxury spa electronic city bangalore, hair and beauty salon electronic city, body massage near electronic city phase 1, couple spa electronic city, facial and hair spa electronic city";
}
if (!isset($active_page)) {
    $active_page = 'home';
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'sparkspa.in';
$request_uri = strtok($_SERVER['REQUEST_URI'] ?? '/', '?') ?: '/';
$canonical_url = $scheme . '://' . $host . $request_uri;
$directions_url = build_directions_url($spa_config);

$nav_pages = [
    ['key' => 'home', 'label' => 'Home', 'href' => 'index.php'],
    ['key' => 'spa', 'label' => 'Spa', 'href' => 'spa-services.php'],
    ['key' => 'salon', 'label' => 'Salon', 'href' => 'salon-services.php'],
    ['key' => 'gallery', 'label' => 'Gallery', 'href' => 'gallery.php'],
    ['key' => 'offers', 'label' => 'Offers', 'href' => 'offers.php'],
    ['key' => 'blog', 'label' => 'Blog', 'href' => 'blog.php'],
    ['key' => 'contact', 'label' => 'Contact', 'href' => 'contact.php'],
];
?>
<!doctype html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <script>
    (function () {
      try {
        var origFetch = window.fetch;
        var desc = Object.getOwnPropertyDescriptor(window, 'fetch') || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'fetch');
        if (desc && desc.get && !desc.set && desc.configurable) {
          var activeFetch = origFetch;
          Object.defineProperty(window, 'fetch', {
            configurable: true,
            enumerable: true,
            get: function () { return activeFetch; },
            set: function (nextFetch) { if (typeof nextFetch === 'function') activeFetch = nextFetch; }
          });
        }
      } catch (_) {}
      window.addEventListener('error', function (event) {
        var src = (event && (event.filename || (event.error && event.error.stack))) || '';
        if (typeof src === 'string' && src.indexOf('chrome-extension://') !== -1) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      }, true);
    })();
  </script>
  <title><?= e($page_title) ?></title>
  <meta name="description" content="<?= e($page_description) ?>" />
  <meta name="keywords" content="<?= e($page_keywords) ?>" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="<?= e($canonical_url) ?>" />

  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:site_name" content="<?= e($spa_config['brand_name']) ?>" />
  <meta property="og:url" content="<?= e($canonical_url) ?>" />
  <meta property="og:title" content="<?= e($page_title) ?>" />
  <meta property="og:description" content="<?= e($page_description) ?>" />
  <meta property="og:image" content="images/hero_spa_sanctuary_1795110762237.jpg" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= e($page_title) ?>" />
  <meta name="twitter:description" content="<?= e($page_description) ?>" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
            sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
          }
        }
      }
    };
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["DaySpa", "BeautySalon", "HairSalon", "HealthAndBeautyBusiness", "LocalBusiness"],
    "name": <?= json_encode($spa_config['brand_name']) ?>,
    "description": "Luxury body massage spa, hair spa, keratin studio, radiance facials & beauty salon in Electronic City, Bangalore.",
    "image": "images/hero_spa_sanctuary_1795110762237.jpg",
    "telephone": <?= json_encode($spa_config['phone_display']) ?>,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": <?= json_encode($spa_config['address_line_2']) ?>,
      "addressLocality": "Electronic City, Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560100",
      "addressCountry": "IN"
    }
  }
  </script>

  <style>
    html { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #FAF6EE; color: #1C1512; }
    h1, h2, h3, .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
    @keyframes subtle-shimmer {
      0% { transform: translateX(-120%) skewX(-18deg); }
      100% { transform: translateX(220%) skewX(-18deg); }
    }
    .cta-shimmer { position: relative; overflow: hidden; }
    .cta-shimmer::after {
      content: ""; position: absolute; inset: 0; width: 45%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
      transform: translateX(-120%) skewX(-18deg); pointer-events: none;
    }
    .cta-shimmer:hover::after { animation: subtle-shimmer 0.85s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes hero-scale { from { transform: scale(1.05); } to { transform: scale(1); } }
    .hero-ambient-zoom { animation: hero-scale 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  </style>
</head>
<body class="bg-[#FAF6EE] text-[#1C1512] antialiased selection:bg-[#C69749]/25 selection:text-[#1C1512]">

  <header class="relative md:sticky md:top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#C69749]/25">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-18 flex items-center justify-between gap-4 lg:gap-6">
      <a href="index.php" class="font-serif text-xl sm:text-2xl md:text-[26px] font-semibold tracking-tight text-[#1C1512] whitespace-nowrap shrink-0">
        <?= e($spa_config['brand_name']) ?>
      </a>

      <nav aria-label="Primary navigation" class="hidden md:flex items-center gap-4 lg:gap-6">
        <?php foreach ($nav_pages as $p): $is_cur = ($active_page === $p['key']); ?>
        <a href="<?= e($p['href']) ?>" <?= $is_cur ? 'aria-current="page"' : '' ?> class="text-sm font-medium transition-colors whitespace-nowrap shrink-0 relative py-1 <?= $is_cur ? 'text-[#5C1728] font-semibold border-b-2 border-[#C69749]' : 'text-[#524740] hover:text-[#5C1728]' ?>">
          <?= e($p['label']) ?>
        </a>
        <?php endforeach; ?>
      </nav>

      <div class="flex items-center gap-3 shrink-0">
        <a href="contact.php#booking" class="cta-shimmer inline-flex items-center justify-center px-4 py-2 min-h-[40px] md:min-h-[42px] text-xs md:text-sm font-medium bg-[#5C1728] text-[#FAF6EE] hover:bg-[#4A1120] rounded-md whitespace-nowrap shrink-0 transition-colors">
          Book Appointment
        </a>
        <button id="mobile-menu-toggle" type="button" aria-expanded="false" aria-label="Open navigation menu" class="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-[#1C1512] hover:bg-[#5C1728]/10 rounded-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>

    <nav id="mobile-menu-drawer" aria-label="Mobile navigation" class="hidden md:hidden border-t border-[#C69749]/20 bg-[#FAF6EE] px-4 py-4 space-y-1">
      <?php foreach ($nav_pages as $p): $is_cur = ($active_page === $p['key']); ?>
      <a href="<?= e($p['href']) ?>" class="flex items-center min-h-[44px] px-3 text-base font-medium rounded-md <?= $is_cur ? 'bg-[#5C1728] text-[#FAF6EE]' : 'text-[#1C1512] hover:bg-[#F3EBD9]' ?>">
        <?= e($p['label']) ?>
      </a>
      <?php endforeach; ?>
    </nav>
  </header>
