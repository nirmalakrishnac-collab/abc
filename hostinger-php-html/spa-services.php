<?php
require_once __DIR__ . '/config.php';
$active_page = 'spa';
$page_title = "Best Body Massage & Couple Spa in Electronic City | {$spa_config['brand_name']}";
$page_description = "Book Swedish massage, deep tissue massage, aromatherapy, relaxation therapy & luxury couple spa packages in Electronic City, Bangalore via WhatsApp or Call.";
$page_keywords = "best spa in electronic city, body massage electronic city bangalore, deep tissue massage electronic city, couple spa electronic city, aromatherapy spa electronic city phase 1, swedish massage near hosur road, spark spa electronic city";
require __DIR__ . '/includes/header.php';

$spa_services = array_values(array_filter($services, fn($s) => ($s['category'] ?? '') !== 'salon'));
?>
<main>
  <section class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <a href="index.php" class="text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE]">&larr; Back to Home</a>
        <p class="mt-4 text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">Restorative Spa Sanctuary</p>
        <h1 class="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#FAF6EE]">Spa &amp; Body Massage Therapies</h1>
        <p class="mt-3 text-base sm:text-lg text-[#EFE3CE] max-w-2xl">Swedish, Deep Tissue, Mysore Sandalwood Aromatherapy, Relaxation &amp; private Couple Spa suites at <?= e($spa_config['brand_name']) ?>, <?= e($spa_config['area']) ?>.</p>
      </div>
      <a href="salon-services.php" class="inline-flex items-center px-5 py-3 min-h-[44px] border border-[#D9B263]/50 text-[#E8C57B] hover:bg-[#D9B263] hover:text-[#1C1512] text-xs sm:text-sm font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors">Looking for Hair &amp; Beauty Salon? &rarr;</a>
    </div>
  </section>

  <section class="py-16 md:py-24 bg-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div role="tablist" aria-label="Filter spa massage therapies" class="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3EBD9] border border-[#C69749]/25 rounded-lg mb-10">
        <button type="button" data-spa-filter="all" class="spa-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md bg-[#5C1728] text-[#FAF6EE] shadow-sm cursor-pointer">All Spa Therapies</button>
        <button type="button" data-spa-filter="massage" class="spa-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] hover:text-[#1C1512] cursor-pointer">Classic Bodywork</button>
        <button type="button" data-spa-filter="holistic" class="spa-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] hover:text-[#1C1512] cursor-pointer">Holistic &amp; Couples</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach ($spa_services as $svc):
          $img = is_safe_asset_path((string)$svc['image']) ? $svc['image'] : 'images/therapy_swedish_action_1795111730062.jpg';
          $svc_wa_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to book \"{$svc['name']}\". Please share available slots and tariff details.", $spa_config);
        ?>
        <article data-spa-category="<?= e($svc['category']) ?>" class="spa-card group flex flex-col bg-white border border-[#C69749]/25 rounded-xl overflow-hidden hover:shadow-lg transition-all">
          <div class="relative aspect-[4/3] overflow-hidden bg-[#EFE7D8]">
            <img src="<?= e($img) ?>" alt="<?= e($svc['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C1512]/80 backdrop-blur-sm text-[11px] font-medium text-[#E8C57B]">Spa Sanctuary</span>
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
document.querySelectorAll('.spa-filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var cat = btn.getAttribute('data-spa-filter');
    document.querySelectorAll('.spa-filter-btn').forEach(function (b) {
      b.className = 'spa-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] hover:text-[#1C1512] cursor-pointer';
    });
    btn.className = 'spa-filter-btn px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md bg-[#5C1728] text-[#FAF6EE] shadow-sm cursor-pointer';
    document.querySelectorAll('.spa-card').forEach(function (card) {
      card.style.display = (cat === 'all' || card.getAttribute('data-spa-category') === cat) ? 'flex' : 'none';
    });
  });
});
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
