<?php
require_once __DIR__ . '/config.php';
$active_page = 'spa';
$page_title = "Spa Massages & Salon Menu | {$spa_config['brand_name']} Electronic City";
$page_description = "Explore full spa massage therapies and beauty salon services in Electronic City, Bangalore: Deep Tissue, Swedish, Hair Spa, Keratin, Radiance Facials & Nail Care.";
$page_keywords = "spa services electronic city, salon services electronic city bangalore, deep tissue massage electronic city, hair spa keratin electronic city, bridal facial electronic city, manicure pedicure electronic city, unisex spa and salon electronic city";
require __DIR__ . '/includes/header.php';

$spa_services = array_values(array_filter($services, fn($s) => ($s['category'] ?? '') !== 'salon'));
$salon_services = array_values(array_filter($services, fn($s) => ($s['category'] ?? '') === 'salon'));
?>
<main>
  <section class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="index.php" class="text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE]">&larr; Back to Home</a>
      <p class="mt-4 text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">Complete Menu</p>
      <h1 class="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#FAF6EE]">Signature Spa Therapies &amp; Luxury Salon Services</h1>
      <p class="mt-3 text-base sm:text-lg text-[#EFE3CE] max-w-2xl">Browse our separate Spa Sanctuary and Hair &amp; Beauty Salon sections, or jump straight to your dedicated page.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="spa-services.php" class="px-5 py-2.5 bg-[#D9B263] text-[#1C1512] text-sm font-semibold rounded-md">Dedicated Spa Page &rarr;</a>
        <a href="salon-services.php" class="px-5 py-2.5 bg-[#1B4D3E] border border-[#E8C57B]/40 text-[#FAF6EE] text-sm font-semibold rounded-md">Dedicated Salon Page &rarr;</a>
      </div>
    </div>
  </section>

  <!-- Separate Spa Section -->
  <section class="py-16 md:py-24 bg-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="pb-8 border-b border-[#C69749]/25">
        <p class="text-xs font-medium tracking-[0.16em] text-[#8F6422]">Restorative Spa Sanctuary</p>
        <h2 class="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#1C1512]">Signature Spa &amp; Massage Therapies</h2>
      </div>
      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach ($spa_services as $svc):
          $img = is_safe_asset_path((string)$svc['image']) ? $svc['image'] : 'images/therapy_swedish_action_1795111730062.jpg';
          $svc_wa_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to book \"{$svc['name']}\".", $spa_config);
        ?>
        <article class="group flex flex-col bg-white border border-[#C69749]/25 rounded-xl overflow-hidden hover:shadow-lg transition-all">
          <div class="relative aspect-[4/3] overflow-hidden bg-[#EFE7D8]">
            <img src="<?= e($img) ?>" alt="<?= e($svc['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C1512]/80 text-[11px] font-medium text-[#E8C57B]">Spa Sanctuary</span>
          </div>
          <div class="flex-1 p-6 flex flex-col">
            <p class="text-xs text-[#8F6422] font-medium"><?= e($svc['index']) ?> · <?= e($svc['category_label']) ?></p>
            <h3 class="mt-2 font-serif text-2xl font-medium text-[#1C1512]"><?= e($svc['name']) ?></h3>
            <p class="mt-2.5 text-sm text-[#524740] leading-relaxed flex-1"><?= e($svc['description']) ?></p>
            <div class="mt-5 grid grid-cols-2 gap-2.5">
              <a href="<?= e($svc_wa_url) ?>" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#1B4D3E] text-[#FAF6EE] text-xs sm:text-sm font-semibold rounded-md">WhatsApp</a>
              <a href="contact.php?service=<?= rawurlencode($svc['name']) ?>#booking" class="inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#5C1728] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md">Book Slot &rarr;</a>
            </div>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- Separate Salon Section -->
  <section class="py-16 md:py-24 bg-[#F3EBD9] border-t border-[#C69749]/25">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="pb-8 border-b border-[#C69749]/25">
        <p class="text-xs font-medium tracking-[0.16em] text-[#8F6422]">Luxury Hair, Skin &amp; Nail Studio</p>
        <h2 class="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#1C1512]">Signature Hair &amp; Beauty Salon Services</h2>
      </div>
      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach ($salon_services as $svc):
          $img = is_safe_asset_path((string)$svc['image']) ? $svc['image'] : 'images/salon_hair_styling_1795541015663.jpg';
          $svc_wa_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to book \"{$svc['name']}\".", $spa_config);
        ?>
        <article class="group flex flex-col bg-[#FAF6EE] border border-[#C69749]/25 rounded-xl overflow-hidden hover:shadow-lg transition-all">
          <div class="relative aspect-[4/3] overflow-hidden bg-[#EFE7D8]">
            <img src="<?= e($img) ?>" alt="<?= e($svc['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C1512]/80 text-[11px] font-medium text-[#E8C57B]">Salon Studio</span>
          </div>
          <div class="flex-1 p-6 flex flex-col">
            <p class="text-xs text-[#8F6422] font-medium"><?= e($svc['index']) ?> · <?= e($svc['category_label']) ?></p>
            <h3 class="mt-2 font-serif text-2xl font-medium text-[#1C1512]"><?= e($svc['name']) ?></h3>
            <p class="mt-2.5 text-sm text-[#524740] leading-relaxed flex-1"><?= e($svc['description']) ?></p>
            <div class="mt-5 grid grid-cols-2 gap-2.5">
              <a href="<?= e($svc_wa_url) ?>" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#1B4D3E] text-[#FAF6EE] text-xs sm:text-sm font-semibold rounded-md">WhatsApp</a>
              <a href="contact.php?service=<?= rawurlencode($svc['name']) ?>#booking" class="inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#5C1728] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md">Book Slot &rarr;</a>
            </div>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <?php require __DIR__ . '/includes/booking-form.php'; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
