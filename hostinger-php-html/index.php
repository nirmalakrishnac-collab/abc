<?php
require_once __DIR__ . '/config.php';
$active_page = 'home';
$page_title = "{$spa_config['brand_name']} | Best Spa & Salon in Electronic City, Bangalore";
$page_description = "Luxury body massage spa & hair, skin, and beauty salon in Electronic City, Bangalore. Book Swedish, deep tissue, couple spa, facials & hair spa via WhatsApp or Call.";
$page_keywords = "best spa and salon in electronic city, luxury spa electronic city bangalore, hair and beauty salon electronic city, body massage near electronic city phase 1, couple spa electronic city, facial and hair spa electronic city, spark spa and salon bangalore";
require __DIR__ . '/includes/header.php';

$hero_whatsapp_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to book a Spa & Salon appointment today.", $spa_config);
$welcome_whatsapp_url = build_whatsapp_url($welcome_offer['whatsapp_greeting'], $spa_config);
$offers_whatsapp_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to enquire about your current Spa & Salon offers and packages.", $spa_config);
$published_blogs = array_values(array_filter($blogs, fn($b) => ($b['status'] ?? 'published') === 'published'));

$spa_services = array_values(array_filter($services, fn($s) => ($s['category'] ?? '') !== 'salon'));
$salon_services = array_values(array_filter($services, fn($s) => ($s['category'] ?? '') === 'salon'));
?>
<main>
  <!-- High-Converting Hero Section -->
  <section id="top" class="relative min-h-[78vh] md:min-h-[84vh] flex items-end md:items-center overflow-hidden bg-[#1C1512]">
    <div class="absolute inset-0 hero-ambient-zoom">
      <img src="images/hero_spa_sanctuary_1795110762237.jpg" alt="Candlelit stone reflection sanctuary inside Spark Spa & Salon in Electronic City, Bangalore" class="w-full h-full object-cover object-center" />
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-t from-[#16100D]/95 via-[#16100D]/60 to-[#16100D]/40 md:bg-gradient-to-r md:from-[#16100D]/92 md:via-[#16100D]/60 md:to-[#16100D]/30"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 md:py-22">
      <div class="max-w-2xl">
        <p class="text-xs sm:text-sm font-medium tracking-[0.2em] text-[#E8C57B] mb-3.5 uppercase">
          Namaste · <?= e($spa_config['area']) ?>
        </p>
        <h1 class="font-serif text-[clamp(2.3rem,4.6vw,4.35rem)] leading-[1.06] font-medium text-[#FAF6EE] tracking-[-0.01em]" style="text-wrap: balance;">
          Luxury Spa &amp; Salon Sanctuary in Electronic City
        </h1>
        <p class="mt-4 text-base sm:text-lg leading-relaxed text-[#EFE3CE] max-w-xl">
          Restorative body massages, private couple spa suites, keratin hair spa, precision styling, and botanical glow facials—book in one tap via WhatsApp or Call.
        </p>

        <div class="mt-7 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          <a href="<?= e($hero_whatsapp_url) ?>" target="_blank" rel="noopener noreferrer" class="cta-shimmer inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[50px] bg-[#1B4D3E] hover:bg-[#22604D] border border-[#E8C57B]/45 text-[#FAF6EE] text-sm sm:text-base font-semibold rounded-md shadow-lg transition-all whitespace-nowrap shrink-0">
            <span>Book on WhatsApp</span>
          </a>
          <a href="<?= e($spa_config['phone_href']) ?>" class="cta-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] bg-[#D9B263] hover:bg-[#E4C178] text-[#1C1512] text-sm sm:text-base font-semibold rounded-md shadow-lg transition-colors whitespace-nowrap shrink-0">
            <span>Call Now · <?= e($spa_config['phone_display']) ?></span>
          </a>
          <div class="flex items-center gap-4 pt-1 sm:pt-0 sm:pl-2">
            <a href="spa-services.php" class="inline-flex items-center justify-center py-2.5 min-h-[44px] text-[#FAF6EE] hover:text-[#E8C57B] text-sm font-medium underline underline-offset-4 decoration-[#E8C57B]/50 whitespace-nowrap shrink-0">Spa Menu</a>
            <span aria-hidden="true" class="text-[#E8C57B]/45">·</span>
            <a href="salon-services.php" class="inline-flex items-center justify-center py-2.5 min-h-[44px] text-[#FAF6EE] hover:text-[#E8C57B] text-sm font-medium underline underline-offset-4 decoration-[#E8C57B]/50 whitespace-nowrap shrink-0">Salon Menu</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 4-Column Trust & Assurance Strip for Mobile & Google Ads Conversion -->
  <section aria-label="Sanctuary Highlights" class="bg-[#FAF6EE] border-b border-[#C69749]/25">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <div class="flex items-center gap-3 p-2.5 rounded-lg bg-[#F3EBD9]/70 border border-[#C69749]/20">
        <span class="w-9 h-9 rounded-full bg-[#5C1728]/10 text-[#5C1728] font-serif font-semibold flex items-center justify-center shrink-0">01</span>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-[#1C1512]">Certified Experts</p>
          <p class="text-[11px] text-[#524740]">Spa Therapists &amp; Stylists</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-2.5 rounded-lg bg-[#F3EBD9]/70 border border-[#C69749]/20">
        <span class="w-9 h-9 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] font-serif font-semibold flex items-center justify-center shrink-0">02</span>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-[#1C1512]">5-Star Hygiene</p>
          <p class="text-[11px] text-[#524740]">Sanitized Private Suites</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-2.5 rounded-lg bg-[#F3EBD9]/70 border border-[#C69749]/20">
        <span class="w-9 h-9 rounded-full bg-[#C69749]/20 text-[#8F6422] font-serif font-semibold flex items-center justify-center shrink-0">03</span>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-[#1C1512]">Electronic City</p>
          <p class="text-[11px] text-[#524740]">Open Daily 10 AM – 9:30 PM</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-2.5 rounded-lg bg-[#F3EBD9]/70 border border-[#C69749]/20">
        <span class="w-9 h-9 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] font-serif font-semibold flex items-center justify-center shrink-0">04</span>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-[#1C1512]">Instant Slot Lock</p>
          <p class="text-[11px] text-[#524740]">Zero Forms · WhatsApp &amp; Call</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Welcome Offer Band -->
  <section aria-label="Opening Spa & Salon Offer" class="bg-[#5C1728] text-[#FAF6EE] border-y border-[#D9B263]/35">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.18em] text-[#E8C57B]"><?= e($welcome_offer['eyebrow']) ?></p>
        <h2 class="mt-1.5 font-serif text-2xl sm:text-3xl font-medium"><?= e($welcome_offer['title']) ?></h2>
        <p class="mt-2 text-sm text-[#EFE3CE] leading-relaxed"><?= e($welcome_offer['subtitle']) ?></p>
        <p class="mt-2.5 text-xs font-medium text-[#E8C57B]"><?= e($welcome_offer['highlight_note']) ?></p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <a href="<?= e($welcome_whatsapp_url) ?>" target="_blank" rel="noopener noreferrer" class="cta-shimmer inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm font-semibold rounded-md border border-[#E8C57B]/35"><?= e($welcome_offer['cta_label']) ?></a>
        <a href="<?= e($spa_config['phone_href']) ?>" class="cta-shimmer inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] bg-[#D9B263] hover:bg-[#E4C178] text-[#1C1512] text-sm font-semibold rounded-md">Call Now to Claim</a>
        <button id="open-offer-modal-btn" type="button" class="px-5 py-3.5 min-h-[48px] border border-[#FAF6EE]/30 text-[#FAF6EE] hover:bg-white/10 text-xs sm:text-sm font-medium rounded-md cursor-pointer">Offer Details</button>
      </div>
    </div>
  </section>

  <!-- SECTION 1: SEPARATE SPA & MASSAGE THERAPIES SECTION -->
  <section id="spa-services" class="py-16 md:py-24 bg-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#C69749]/25">
        <div class="max-w-2xl">
          <p class="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-2">Restorative Spa Sanctuary</p>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-[44px] leading-[1.15] font-medium text-[#1C1512]">Signature Spa &amp; Massage Therapies</h2>
          <p class="mt-3 text-base text-[#524740]">Swedish, Deep Tissue, Mysore Sandalwood Aromatherapy, and private candlelit Couple Spa suites.</p>
        </div>
        <a href="spa-services.php" class="inline-flex items-center px-5 py-3 min-h-[44px] border border-[#5C1728] text-[#5C1728] hover:bg-[#5C1728] hover:text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors self-start lg:self-end shrink-0">Explore All <?= count($spa_services) ?> Spa Therapies &rarr;</a>
      </div>

      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach (array_slice($spa_services, 0, 3) as $svc):
          $img = is_safe_asset_path((string)$svc['image']) ? $svc['image'] : 'images/therapy_swedish_action_1795111730062.jpg';
          $svc_wa_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to book \"{$svc['name']}\" and claim any active offer.", $spa_config);
        ?>
        <article class="group flex flex-col bg-white border border-[#C69749]/25 rounded-xl overflow-hidden hover:shadow-lg transition-all">
          <div class="relative aspect-[4/3] overflow-hidden bg-[#EFE7D8]">
            <img src="<?= e($img) ?>" alt="<?= e($svc['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C1512]/80 backdrop-blur-sm text-[11px] font-medium text-[#E8C57B]">Spa Sanctuary</span>
          </div>
          <div class="flex-1 p-6 flex flex-col">
            <p class="text-xs text-[#8F6422] font-medium"><?= e($svc['index']) ?> · <?= e($svc['category_label']) ?></p>
            <h3 class="mt-2 font-serif text-2xl font-medium text-[#1C1512]"><?= e($svc['name']) ?></h3>
            <p class="mt-2.5 text-sm text-[#524740] leading-relaxed flex-1"><?= e($svc['description']) ?></p>
            <div class="mt-5 pt-4 border-t border-[#1C1512]/10 flex items-center justify-between text-xs sm:text-sm">
              <span class="font-medium text-[#1C1512]"><?= e($svc['duration']) ?></span>
              <span class="text-[#5C1728] font-medium"><?= e($svc['price']) ?></span>
            </div>
            <div class="mt-5 grid grid-cols-2 gap-2.5">
              <a href="<?= e($svc_wa_url) ?>" target="_blank" rel="noopener noreferrer" class="cta-shimmer inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-xs sm:text-sm font-semibold rounded-md">WhatsApp</a>
              <a href="contact.php?service=<?= rawurlencode($svc['name']) ?>#booking" class="inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md">Book Slot &rarr;</a>
            </div>
            <a href="<?= e($spa_config['phone_href']) ?>" class="mt-2.5 w-full inline-flex items-center justify-center py-2 min-h-[38px] text-xs font-medium text-[#524740] hover:text-[#5C1728] border border-[#1C1512]/12 rounded-md">Call Directly · <?= e($spa_config['phone_display']) ?></a>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- SECTION 2: SEPARATE HAIR, SKIN & BEAUTY SALON SECTION -->
  <section id="salon-services" class="py-16 md:py-24 bg-[#F3EBD9] border-y border-[#C69749]/25">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#C69749]/25">
        <div class="max-w-2xl">
          <p class="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-2">Luxury Hair, Skin &amp; Nail Studio</p>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-[44px] leading-[1.15] font-medium text-[#1C1512]">Signature Hair &amp; Beauty Salon Services</h2>
          <p class="mt-3 text-base text-[#524740]">Keratin smoothing, precision haircuts, blowout styling, bridal radiance facials, and rose-petal spa manicures &amp; pedicures.</p>
        </div>
        <a href="salon-services.php" class="inline-flex items-center px-5 py-3 min-h-[44px] border border-[#5C1728] text-[#5C1728] hover:bg-[#5C1728] hover:text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors self-start lg:self-end shrink-0">Explore All <?= count($salon_services) ?> Salon Services &rarr;</a>
      </div>

      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach (array_slice($salon_services, 0, 3) as $svc):
          $img = is_safe_asset_path((string)$svc['image']) ? $svc['image'] : 'images/salon_hair_styling_1795541015663.jpg';
          $svc_wa_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to book \"{$svc['name']}\" and claim any active salon offer.", $spa_config);
        ?>
        <article class="group flex flex-col bg-[#FAF6EE] border border-[#C69749]/25 rounded-xl overflow-hidden hover:shadow-lg transition-all">
          <div class="relative aspect-[4/3] overflow-hidden bg-[#EFE7D8]">
            <img src="<?= e($img) ?>" alt="<?= e($svc['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C1512]/80 backdrop-blur-sm text-[11px] font-medium text-[#E8C57B]">Salon Studio</span>
          </div>
          <div class="flex-1 p-6 flex flex-col">
            <p class="text-xs text-[#8F6422] font-medium"><?= e($svc['index']) ?> · <?= e($svc['category_label']) ?></p>
            <h3 class="mt-2 font-serif text-2xl font-medium text-[#1C1512]"><?= e($svc['name']) ?></h3>
            <p class="mt-2.5 text-sm text-[#524740] leading-relaxed flex-1"><?= e($svc['description']) ?></p>
            <div class="mt-5 pt-4 border-t border-[#1C1512]/10 flex items-center justify-between text-xs sm:text-sm">
              <span class="font-medium text-[#1C1512]"><?= e($svc['duration']) ?></span>
              <span class="text-[#5C1728] font-medium"><?= e($svc['price']) ?></span>
            </div>
            <div class="mt-5 grid grid-cols-2 gap-2.5">
              <a href="<?= e($svc_wa_url) ?>" target="_blank" rel="noopener noreferrer" class="cta-shimmer inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-xs sm:text-sm font-semibold rounded-md">WhatsApp</a>
              <a href="contact.php?service=<?= rawurlencode($svc['name']) ?>#booking" class="inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md">Book Slot &rarr;</a>
            </div>
            <a href="<?= e($spa_config['phone_href']) ?>" class="mt-2.5 w-full inline-flex items-center justify-center py-2 min-h-[38px] text-xs font-medium text-[#524740] hover:text-[#5C1728] border border-[#1C1512]/12 rounded-md">Call Directly · <?= e($spa_config['phone_display']) ?></a>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- Why Choose Spark Spa & Salon -->
  <section id="why-spark" class="py-16 md:py-24 bg-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div class="lg:col-span-4">
        <p class="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">The Spark Standard</p>
        <h2 class="font-serif text-3xl sm:text-4xl leading-[1.15] font-medium text-[#1C1512]">Why Guests Choose <?= e($spa_config['brand_name']) ?></h2>
        <p class="mt-4 text-base text-[#524740] leading-relaxed">A quiet sanctuary bringing luxury spa restoration and bespoke hair, skin, and nail salon care together in Electronic City, Bangalore.</p>
      </div>
      <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <?php foreach ($why_choose as $pillar): ?>
        <div class="bg-[#F3EBD9]/65 border border-[#C69749]/25 rounded-xl p-6">
          <span class="w-10 h-10 rounded-lg bg-[#FAF6EE] border border-[#C69749]/35 inline-flex items-center justify-center text-[#5C1728] font-serif text-lg font-semibold mb-3"><?= e($pillar['index']) ?></span>
          <h3 class="font-serif text-xl sm:text-2xl font-medium text-[#1C1512]"><?= e($pillar['title']) ?></h3>
          <p class="mt-2 text-sm text-[#524740] leading-relaxed"><?= e($pillar['description']) ?></p>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- Gallery Preview (3 photos + Link to gallery.php) -->
  <section class="py-16 md:py-24 bg-[#F3EBD9] border-y border-[#C69749]/25">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#C69749]/25">
        <div>
          <p class="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-2">Inside The Sanctuary</p>
          <h2 class="font-serif text-3xl sm:text-4xl font-medium text-[#1C1512]">Spa Suites &amp; Luxury Salon Studios</h2>
        </div>
        <a href="gallery.php" class="px-5 py-3 min-h-[44px] border border-[#5C1728] text-[#5C1728] hover:bg-[#5C1728] hover:text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors self-start sm:self-end">Explore Full Gallery &rarr;</a>
      </div>
      <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <?php foreach (array_slice($gallery_items, 0, 3) as $item):
          $img = is_safe_asset_path((string)$item['image']) ? $item['image'] : 'images/hero_spa_sanctuary_1795110762237.jpg';
        ?>
        <a href="gallery.php" class="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#EFE7D8] border border-[#C69749]/20 block">
          <img src="<?= e($img) ?>" alt="<?= e($item['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-t from-[#16100D]/88 via-[#16100D]/25 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 p-5">
            <p class="text-xs font-medium text-[#E8C57B]"><?= e($item['category_label']) ?></p>
            <h3 class="mt-1 font-serif text-xl font-medium text-[#FAF6EE]"><?= e($item['title']) ?></h3>
          </div>
        </a>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- Latest Blog Journal Preview (3 articles + Link to blog.php) -->
  <section class="py-16 md:py-24 bg-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#C69749]/25">
        <div>
          <p class="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-2">Wellness &amp; Beauty Journal</p>
          <h2 class="font-serif text-3xl sm:text-4xl font-medium text-[#1C1512]">Stories, Skincare &amp; Spa Insights</h2>
        </div>
        <a href="blog.php" class="px-5 py-3 min-h-[44px] border border-[#5C1728] text-[#5C1728] hover:bg-[#5C1728] hover:text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors self-start sm:self-end">Read All Blog Articles &rarr;</a>
      </div>
      <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <?php foreach (array_slice($published_blogs, 0, 3) as $b):
          $img = is_safe_asset_path((string)$b['image']) ? $b['image'] : 'images/hero_spa_sanctuary_1795110762237.jpg';
        ?>
        <article class="flex flex-col bg-white border border-[#C69749]/25 rounded-xl overflow-hidden">
          <a href="blog.php?post=<?= rawurlencode($b['slug']) ?>" class="aspect-[16/10] bg-[#EFE7D8] block overflow-hidden">
            <img src="<?= e($img) ?>" alt="<?= e($b['alt']) ?>" loading="lazy" class="w-full h-full object-cover" />
          </a>
          <div class="flex-1 p-6 flex flex-col">
            <p class="text-xs font-medium text-[#8F6422]"><?= e($b['category']) ?> · <?= e($b['published_at']) ?></p>
            <h3 class="mt-2 font-serif text-2xl font-medium text-[#1C1512]"><a href="blog.php?post=<?= rawurlencode($b['slug']) ?>" class="hover:text-[#5C1728]"><?= e($b['title']) ?></a></h3>
            <p class="mt-2.5 text-sm text-[#524740] flex-1"><?= e($b['excerpt']) ?></p>
            <a href="blog.php?post=<?= rawurlencode($b['slug']) ?>" class="mt-4 text-xs font-semibold text-[#5C1728] hover:underline">Read Article &rarr;</a>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- Offers Highlight -->
  <section class="py-16 md:py-24 bg-[#1C1512] text-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.16em] text-[#E8C57B] mb-2">Curated Offers &amp; Packages</p>
        <h2 class="font-serif text-3xl sm:text-5xl font-medium">Your Relaxation &amp; Glow Starts Here.</h2>
        <p class="mt-3 text-base text-[#DFD3C0]">Explore weekday executive spa &amp; grooming packages, couple sanctuary deals, and full-day beauty &amp; wellness rituals.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 shrink-0">
        <a href="offers.php" class="px-6 py-3.5 min-h-[46px] bg-[#D9B263] hover:bg-[#E4C178] text-[#1C1512] text-sm font-semibold rounded-md text-center">View All Packages</a>
        <a href="<?= e($offers_whatsapp_url) ?>" target="_blank" rel="noopener noreferrer" class="px-6 py-3.5 min-h-[46px] bg-[#1B4D3E] hover:bg-[#22604D] border border-[#E8C57B]/35 text-[#FAF6EE] text-sm font-medium rounded-md text-center">Enquire on WhatsApp</a>
      </div>
    </div>
  </section>

  <?php require __DIR__ . '/includes/location-block.php'; ?>
  <?php require __DIR__ . '/includes/booking-form.php'; ?>
</main>

<!-- Zero-Form Instant WhatsApp & Call Offer Popup Modal -->
<div id="offer-modal" role="dialog" aria-modal="true" aria-labelledby="offer-modal-title" class="hidden fixed inset-0 z-50 bg-[#1C1512]/80 backdrop-blur-sm overflow-y-auto">
  <div class="min-h-full w-full flex items-center justify-center p-4">
    <div class="relative w-full max-w-md bg-[#FAF6EE] border border-[#C69749]/60 rounded-2xl overflow-hidden shadow-2xl">
      <div class="bg-[#5C1728] text-[#FAF6EE] px-6 py-6 border-b border-[#D9B263]/35">
        <button id="close-offer-modal-btn" type="button" aria-label="Close offer window" class="absolute top-3.5 right-3.5 w-10 h-10 rounded-full text-[#FAF6EE]/85 hover:bg-white/10 flex items-center justify-center cursor-pointer">✕</button>
        <p class="text-[11px] font-medium tracking-[0.18em] text-[#E8C57B] uppercase"><?= e($welcome_offer['eyebrow']) ?></p>
        <h3 id="offer-modal-title" class="mt-1.5 font-serif text-2xl sm:text-3xl font-medium pr-8 leading-snug"><?= e($welcome_offer['title']) ?></h3>
      </div>

      <div class="p-6 space-y-5">
        <p class="text-sm text-[#524740] leading-relaxed"><?= e($welcome_offer['subtitle']) ?></p>

        <div class="bg-[#F3EBD9] border border-[#C69749]/35 rounded-xl p-4 space-y-2.5 text-xs sm:text-sm text-[#1C1512]">
          <div class="flex items-start gap-2.5">
            <span class="text-[#1B4D3E] font-bold">✓</span>
            <span>Valid for Signature Massages, Couple Spa &amp; Salon Styling</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="text-[#1B4D3E] font-bold">✓</span>
            <span>Instant confirmation in <strong><?= e($spa_config['area']) ?></strong></span>
          </div>
          <div class="pt-1 flex items-center justify-between border-t border-[#C69749]/25">
            <span class="text-xs text-[#524740]">Privilege Code:</span>
            <span class="font-semibold tracking-wider text-[#5C1728] bg-white px-2.5 py-0.5 rounded border border-[#C69749]/40"><?= e($welcome_offer['offer_code']) ?></span>
          </div>
        </div>

        <!-- Direct 1-Tap WhatsApp & Call Actions (No Form Fields) -->
        <div class="space-y-3 pt-1">
          <a href="<?= e($welcome_whatsapp_url) ?>" target="_blank" rel="noopener noreferrer" onclick="document.getElementById('offer-modal').classList.add('hidden')" class="cta-shimmer w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 min-h-[52px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm sm:text-base font-semibold rounded-xl shadow-md transition-colors">
            <span><?= e($welcome_offer['cta_label']) ?></span>
          </a>

          <a href="<?= e($spa_config['phone_href']) ?>" onclick="document.getElementById('offer-modal').classList.add('hidden')" class="cta-shimmer w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 min-h-[52px] bg-[#D9B263] hover:bg-[#E4C178] text-[#1C1512] text-sm sm:text-base font-semibold rounded-xl shadow-md transition-colors">
            <span>Call Now · <?= e($spa_config['phone_display']) ?></span>
          </a>
        </div>

        <p class="text-[11px] text-center text-[#524740]"><?= e($spa_config['hours']) ?> · No advance payment required</p>
      </div>
    </div>
  </div>
</div>
<script>
(function () {
  var m = document.getElementById('offer-modal');
  var openBtn = document.getElementById('open-offer-modal-btn');
  var closeBtn = document.getElementById('close-offer-modal-btn');
  if (!sessionStorage.getItem('spark_offer_seen') && m) {
    setTimeout(function () { m.classList.remove('hidden'); sessionStorage.setItem('spark_offer_seen', '1'); }, 1500);
  }
  if (openBtn) openBtn.addEventListener('click', function () { m.classList.remove('hidden'); });
  if (closeBtn) closeBtn.addEventListener('click', function () { m.classList.add('hidden'); });
  if (m) m.addEventListener('click', function (e) { if (e.target === m || e.target === m.firstElementChild) m.classList.add('hidden'); });
})();
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
