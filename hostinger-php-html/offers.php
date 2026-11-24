<?php
require_once __DIR__ . '/config.php';
$active_page = 'offers';
$page_title = "Spa & Salon Offers & Packages | {$spa_config['brand_name']} Electronic City";
$page_description = "Unlock first-visit spa & salon offers, weekday executive reset deals, and couple sanctuary packages in Electronic City, Bangalore. Claim via WhatsApp or Call.";
$page_keywords = "spa offers electronic city, salon deals electronic city bangalore, couple spa package electronic city, weekday massage offer bangalore, bridal facial package electronic city, hair spa combo offer electronic city";
require __DIR__ . '/includes/header.php';
$welcome_whatsapp_url = build_whatsapp_url($welcome_offer['whatsapp_greeting'], $spa_config);
$offers_whatsapp_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to enquire about your current Spa & Salon offers and packages.", $spa_config);
?>
<main>
  <section class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="index.php" class="text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE]">&larr; Back to Home</a>
      <p class="mt-4 text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">Seasonal Privileges</p>
      <h1 class="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#FAF6EE]">Your Relaxation &amp; Glow Starts Here.</h1>
      <p class="mt-3 text-base sm:text-lg text-[#EFE3CE] max-w-2xl">Seasonal spa &amp; salon offers, weekday executive reset sessions, and couple sanctuary packages in Electronic City.</p>
    </div>
  </section>

  <section class="bg-[#5C1728] text-[#FAF6EE] border-b border-[#D9B263]/35">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="max-w-2xl">
        <p class="text-xs font-medium tracking-[0.18em] text-[#E8C57B]"><?= e($welcome_offer['eyebrow']) ?></p>
        <h2 class="mt-1.5 font-serif text-2xl sm:text-3xl font-medium"><?= e($welcome_offer['title']) ?></h2>
        <p class="mt-2 text-sm text-[#EFE3CE]"><?= e($welcome_offer['subtitle']) ?> (Code: <strong><?= e($welcome_offer['offer_code']) ?></strong>)</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 shrink-0">
        <a href="<?= e($welcome_whatsapp_url) ?>" target="_blank" rel="noopener noreferrer" class="cta-shimmer inline-flex items-center justify-center px-6 py-3.5 min-h-[46px] bg-[#1B4D3E] hover:bg-[#22604D] border border-[#E8C57B]/35 text-[#FAF6EE] text-sm font-semibold rounded-md">
          <?= e($welcome_offer['cta_label']) ?>
        </a>
        <a href="<?= e($spa_config['phone_href']) ?>" class="cta-shimmer inline-flex items-center justify-center px-6 py-3.5 min-h-[46px] bg-[#D9B263] hover:bg-[#E4C178] text-[#1C1512] text-sm font-semibold rounded-md">
          Call Now · <?= e($spa_config['phone_display']) ?>
        </a>
      </div>
    </div>
  </section>

  <section class="py-16 md:py-24 bg-[#1C1512] text-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#D9B263]/25">
        <h2 class="font-serif text-3xl sm:text-4xl font-medium">Curated Spa &amp; Salon Packages</h2>
        <a href="<?= e($offers_whatsapp_url) ?>" target="_blank" rel="noopener noreferrer" class="px-6 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm font-medium rounded-md border border-[#E8C57B]/35">Enquire on WhatsApp</a>
      </div>
      <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <?php foreach ($offers as $offer):
          $offer_wa = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to enquire about the \"{$offer['title']}\" package.", $spa_config);
        ?>
        <div class="flex flex-col bg-[#281C18] border border-[#D9B263]/28 rounded-xl p-7">
          <p class="text-xs font-medium tracking-[0.14em] text-[#E8C57B]"><?= e($offer['code']) ?></p>
          <h3 class="mt-2 font-serif text-2xl sm:text-[28px] font-medium"><?= e($offer['title']) ?></h3>
          <p class="mt-2.5 text-sm text-[#DFD3C0]"><?= e($offer['subtitle']) ?></p>
          <ul class="mt-6 space-y-3 flex-1">
            <?php foreach ($offer['inclusions'] as $inc): ?>
            <li class="flex items-start gap-2.5 text-sm text-[#EFE3CE]"><span class="text-[#E8C57B] font-bold">✓</span><span><?= e($inc) ?></span></li>
            <?php endforeach; ?>
          </ul>
          <div class="mt-6 pt-5 border-t border-[#D9B263]/20 space-y-1 text-xs sm:text-sm">
            <p class="font-medium"><?= e($offer['duration']) ?></p>
            <p class="text-[#E8C57B] font-medium"><?= e($offer['price']) ?></p>
          </div>
          <a href="<?= e($offer_wa) ?>" target="_blank" rel="noopener noreferrer" class="mt-6 w-full inline-flex items-center justify-center px-4 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] border border-[#E8C57B]/30 text-[#FAF6EE] text-sm font-medium rounded-md">Enquire on WhatsApp</a>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <?php require __DIR__ . '/includes/booking-form.php'; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
