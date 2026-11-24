<?php
require_once __DIR__ . '/config.php';
$active_page = 'salon';
$page_title = "Best Hair & Beauty Salon in Electronic City | {$spa_config['brand_name']}";
$page_description = "Visit {$spa_config['brand_name']} in Electronic City, Bangalore for keratin hair spa, precision haircuts, blowout styling, bridal radiance facials & luxury manicure-pedicure.";
$page_keywords = "best salon in electronic city, hair salon electronic city bangalore, keratin hair spa electronic city, bridal facial electronic city, manicure pedicure salon electronic city, beauty parlour near electronic city phase 1, unisex hair salon electronic city";
require __DIR__ . '/includes/header.php';

$salon_services = array_values(array_filter($services, fn($s) => ($s['category'] ?? '') === 'salon'));
?>
<main>
  <section class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <a href="index.php" class="text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE]">&larr; Back to Home</a>
        <p class="mt-4 text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">Hair, Skin &amp; Nail Studio</p>
        <h1 class="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#FAF6EE]">Luxury Hair &amp; Beauty Salon Services</h1>
        <p class="mt-3 text-base sm:text-lg text-[#EFE3CE] max-w-2xl">Keratin hair spa, signature haircuts, blowout styling, bridal radiance facials, and rose-petal manicure-pedicure rituals at <?= e($spa_config['brand_name']) ?>, <?= e($spa_config['area']) ?>.</p>
      </div>
      <a href="spa-services.php" class="inline-flex items-center px-5 py-3 min-h-[44px] border border-[#D9B263]/50 text-[#E8C57B] hover:bg-[#D9B263] hover:text-[#1C1512] text-xs sm:text-sm font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors">Looking for Spa &amp; Massages? &rarr;</a>
    </div>
  </section>

  <section class="py-16 md:py-24 bg-[#F3EBD9] border-b border-[#C69749]/25">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div role="tablist" aria-label="Filter hair and beauty salon services" class="inline-flex flex-wrap items-center gap-1 p-1 bg-[#FAF6EE] border border-[#C69749]/25 rounded-lg mb-10">
        <button type="button" data-salon-filter="all" class="salon-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md bg-[#5C1728] text-[#FAF6EE] shadow-sm cursor-pointer">All Salon Services</button>
        <button type="button" data-salon-filter="hair" class="salon-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] hover:text-[#1C1512] cursor-pointer">Hair &amp; Keratin</button>
        <button type="button" data-salon-filter="skin-nails" class="salon-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] hover:text-[#1C1512] cursor-pointer">Facials &amp; Nails</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach ($salon_services as $svc):
          $img = is_safe_asset_path((string)$svc['image']) ? $svc['image'] : 'images/salon_hair_styling_1795541015663.jpg';
          $svc_wa_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to book \"{$svc['name']}\". Please share available salon slots and tariff details.", $spa_config);
          $is_hair = stripos((string)$svc['category_label'] . ' ' . (string)$svc['name'], 'hair') !== false;
          $sub_group = $is_hair ? 'hair' : 'skin-nails';
        ?>
        <article data-salon-group="<?= e($sub_group) ?>" class="salon-card group flex flex-col bg-[#FAF6EE] border border-[#C69749]/25 rounded-xl overflow-hidden hover:shadow-lg transition-all">
          <div class="relative aspect-[4/3] overflow-hidden bg-[#EFE7D8]">
            <img src="<?= e($img) ?>" alt="<?= e($svc['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C1512]/80 backdrop-blur-sm text-[11px] font-medium text-[#E8C57B]">Salon Studio</span>
          </div>
          <div class="flex-1 p-6 flex flex-col">
            <div class="flex items-center gap-2 text-xs text-[#8F6422] font-medium">
              <span><?= e($svc['index']) ?></span><span>·</span><span><?= e($svc['category_label']) ?></span>
            </div>
            <h2 class="mt-2 font-serif text-2xl font-medium text-[#1C1512]"><?= e($svc['name']) ?></h2>
            <p class="mt-2.5 text-sm text-[#524740] leading-relaxed flex-1"><?= e($svc['description']) ?></p>
            <div class="mt-5 pt-4 border-t border-[#1C1512]/10 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <span class="font-medium text-[#1C1512]"><?= e($svc['duration']) ?></span>
              <span class="text-[#5C1728] font-medium"><?= e($svc['price']) ?></span>
            </div>
            <div class="mt-5 grid grid-cols-2 gap-2.5">
              <a href="<?= e($svc_wa_url) ?>" target="_blank" rel="noopener noreferrer" class="cta-shimmer inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-xs sm:text-sm font-semibold rounded-md">WhatsApp</a>
              <a href="contact.php?service=<?= rawurlencode($svc['name']) ?>#booking" class="cta-shimmer inline-flex items-center justify-center px-3 py-3 min-h-[44px] bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-xs sm:text-sm font-medium rounded-md">Book Slot &rarr;</a>
            </div>
            <a href="<?= e($spa_config['phone_href']) ?>" class="mt-2.5 w-full inline-flex items-center justify-center py-2 min-h-[38px] text-xs font-medium text-[#524740] hover:text-[#5C1728] border border-[#1C1512]/12 rounded-md">Call Directly · <?= e($spa_config['phone_display']) ?></a>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <?php require __DIR__ . '/includes/booking-form.php'; ?>
</main>
<script>
document.querySelectorAll('.salon-filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var grp = btn.getAttribute('data-salon-filter');
    document.querySelectorAll('.salon-filter-btn').forEach(function (b) {
      b.className = 'salon-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] hover:text-[#1C1512] cursor-pointer';
    });
    btn.className = 'salon-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md bg-[#5C1728] text-[#FAF6EE] shadow-sm cursor-pointer';
    document.querySelectorAll('.salon-card').forEach(function (card) {
      card.style.display = (grp === 'all' || card.getAttribute('data-salon-group') === grp) ? 'flex' : 'none';
    });
  });
});
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
