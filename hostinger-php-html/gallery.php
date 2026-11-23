<?php
require_once __DIR__ . '/config.php';
$active_page = 'gallery';
$page_title = "Sanctuary Gallery | {$spa_config['brand_name']} Electronic City, Bangalore";
$page_description = "Browse interiors, candlelit couple massage suites, steam rooms & wellness rituals inside {$spa_config['brand_name']} Electronic City.";
require __DIR__ . '/includes/header.php';
?>
<main>
  <section class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="index.php" class="text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE]">&larr; Back to Home</a>
      <p class="mt-4 text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">Inside Our Sanctuary</p>
      <h1 class="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#FAF6EE]">Spa Interiors, Suites &amp; Rituals</h1>
      <p class="mt-3 text-base sm:text-lg text-[#EFE3CE] max-w-2xl">Explore photos uploaded by our spa team showing private massage suites, steam suites, and serene interiors.</p>
    </div>
  </section>

  <section class="py-16 md:py-24 bg-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div role="tablist" aria-label="Filter gallery spaces" class="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3EBD9] border border-[#C69749]/25 rounded-lg mb-10">
        <button type="button" data-gallery-filter="all" class="gallery-filter-btn px-3 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md bg-[#5C1728] text-[#FAF6EE] shadow-sm cursor-pointer">All Spaces</button>
        <button type="button" data-gallery-filter="interiors" class="gallery-filter-btn px-3 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] cursor-pointer">Interiors</button>
        <button type="button" data-gallery-filter="suites" class="gallery-filter-btn px-3 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] cursor-pointer">Massage Suites</button>
        <button type="button" data-gallery-filter="rituals" class="gallery-filter-btn px-3 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] cursor-pointer">Thermal &amp; Rituals</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-[250px]">
        <?php foreach ($gallery_items as $item):
          $img = is_safe_asset_path((string)$item['image']) ? $item['image'] : 'images/hero_spa_sanctuary_1795110762237.jpg';
          $span = $item['span'] ?? 'md:col-span-4';
        ?>
        <button type="button"
                data-gallery-category="<?= e($item['space_category']) ?>"
                data-lightbox-image="<?= e($img) ?>"
                data-lightbox-title="<?= e($item['title']) ?>"
                data-lightbox-category="<?= e($item['category_label']) ?>"
                data-lightbox-caption="<?= e($item['caption']) ?>"
                class="gallery-tile group relative overflow-hidden rounded-xl bg-[#EFE7D8] border border-[#C69749]/20 text-left cursor-pointer min-h-[260px] md:min-h-0 <?= e($span) ?>">
          <img src="<?= e($img) ?>" alt="<?= e($item['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-t from-[#16100D]/88 via-[#16100D]/25 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p class="text-xs font-medium tracking-wider text-[#E8C57B]"><?= e($item['category_label']) ?></p>
            <h2 class="mt-1 font-serif text-xl sm:text-2xl font-medium text-[#FAF6EE]"><?= e($item['title']) ?></h2>
          </div>
        </button>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <div id="gallery-lightbox" role="dialog" aria-modal="true" class="hidden fixed inset-0 z-50 bg-[#16100D]/90 backdrop-blur-sm overflow-y-auto">
    <div class="min-h-full w-full flex items-center justify-center p-4">
      <div class="relative max-w-4xl w-full bg-[#FAF6EE] border border-[#C69749]/35 rounded-xl overflow-hidden shadow-2xl">
        <button id="lightbox-close-btn" type="button" aria-label="Close gallery preview" class="absolute top-3 right-3 z-10 w-11 h-11 rounded-full bg-[#1C1512]/80 text-[#FAF6EE] flex items-center justify-center cursor-pointer">✕</button>
        <div class="aspect-[16/10] bg-[#1C1512]">
          <img id="lightbox-img" src="" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p id="lightbox-cat" class="text-xs font-medium text-[#8F6422] tracking-wide"></p>
            <h3 id="lightbox-title" class="font-serif text-2xl font-medium text-[#1C1512] mt-0.5"></h3>
            <p id="lightbox-caption" class="text-sm text-[#524740] mt-1"></p>
          </div>
          <a href="contact.php#booking" class="px-5 py-3 min-h-[44px] bg-[#5C1728] text-[#FAF6EE] text-sm font-medium rounded-md whitespace-nowrap shrink-0">Book Experience</a>
        </div>
      </div>
    </div>
  </div>
</main>
<script>
document.querySelectorAll('.gallery-filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var cat = btn.getAttribute('data-gallery-filter');
    document.querySelectorAll('.gallery-filter-btn').forEach(function (b) {
      b.className = 'gallery-filter-btn px-3 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md text-[#524740] cursor-pointer';
    });
    btn.className = 'gallery-filter-btn px-3 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md bg-[#5C1728] text-[#FAF6EE] shadow-sm cursor-pointer';
    document.querySelectorAll('.gallery-tile').forEach(function (t) {
      t.style.display = (cat === 'all' || t.getAttribute('data-gallery-category') === cat) ? 'block' : 'none';
    });
  });
});
var lb = document.getElementById('gallery-lightbox');
document.querySelectorAll('.gallery-tile').forEach(function (t) {
  t.addEventListener('click', function () {
    document.getElementById('lightbox-img').src = t.getAttribute('data-lightbox-image');
    document.getElementById('lightbox-cat').textContent = t.getAttribute('data-lightbox-category');
    document.getElementById('lightbox-title').textContent = t.getAttribute('data-lightbox-title');
    document.getElementById('lightbox-caption').textContent = t.getAttribute('data-lightbox-caption');
    lb.classList.remove('hidden');
  });
});
document.getElementById('lightbox-close-btn').addEventListener('click', function () { lb.classList.add('hidden'); });
lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lb.firstElementChild) lb.classList.add('hidden'); });
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
