<?php
$footer_whatsapp_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I have an enquiry regarding spa services.", $spa_config);
$mobile_whatsapp_url = build_whatsapp_url("Namaste {$spa_config['brand_name']} ({$spa_config['area']}), I would like to book an appointment.", $spa_config);
$directions_url = build_directions_url($spa_config);
?>
  <footer class="bg-[#1C1512] text-[#EFE3CE] pt-14 pb-24 md:pb-12 border-t border-[#C69749]/25">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#FAF6EE]/12">
        <div class="md:col-span-5">
          <p class="font-serif text-3xl font-medium text-[#FAF6EE]"><?= e($spa_config['brand_name']) ?></p>
          <p class="mt-3 text-sm text-[#CFC3B0] max-w-sm leading-relaxed">
            A serene luxury spa in Electronic City, Bangalore offering tailored massage therapies, aromatherapy, and restorative couple wellness rituals.
          </p>
        </div>
        <div class="md:col-span-3 space-y-2.5 text-sm">
          <p class="text-xs font-medium tracking-[0.14em] text-[#E8C57B] mb-3">Explore Pages</p>
          <a href="index.php" class="block hover:text-[#FAF6EE]">Home Sanctuary</a>
          <a href="services.php" class="block hover:text-[#FAF6EE]">Spa Services</a>
          <a href="gallery.php" class="block hover:text-[#FAF6EE]">Sanctuary Gallery</a>
          <a href="offers.php" class="block hover:text-[#FAF6EE]">Offers &amp; Packages</a>
          <a href="blog.php" class="block hover:text-[#FAF6EE]">Wellness Journal (Blog)</a>
          <a href="contact.php" class="block hover:text-[#FAF6EE]">Contact &amp; Book</a>
        </div>
        <div class="md:col-span-4 space-y-2.5 text-sm">
          <p class="text-xs font-medium tracking-[0.14em] text-[#E8C57B] mb-3">Location &amp; Hours</p>
          <p class="text-[#FAF6EE] font-medium"><?= e($spa_config['address_line_1']) ?></p>
          <p class="text-[#CFC3B0]"><?= e($spa_config['address_line_2']) ?></p>
          <p class="text-[#CFC3B0]"><?= e($spa_config['hours']) ?></p>
          <div class="pt-2 flex flex-wrap gap-4 text-xs font-medium text-[#E8C57B]">
            <a href="<?= e($footer_whatsapp_url) ?>" target="_blank" rel="noopener noreferrer" class="hover:underline">WhatsApp Concierge</a>
            <a href="<?= e($spa_config['phone_href']) ?>" class="hover:underline tabular-nums"><?= e($spa_config['phone_display']) ?></a>
            <a href="<?= e($directions_url) ?>" target="_blank" rel="noopener noreferrer" class="hover:underline">Google Maps</a>
          </div>
        </div>
      </div>
      <div class="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A89B8B]">
        <p>&copy; <?= date('Y') ?> <?= e($spa_config['brand_name']) ?>. <?= e($spa_config['area']) ?>.</p>
        <div class="flex items-center gap-5">
          <span>Indian Luxury Wellness &amp; Massage Sanctuary</span>
          <a href="client-dashboard.php" class="text-[#E8C57B]/90 hover:text-[#E8C57B] font-medium">Client Portal</a>
        </div>
      </div>
    </div>
  </footer>

  <nav aria-label="Quick mobile actions" class="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#FAF6EE]/95 backdrop-blur-md border-t border-[#C69749]/35 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(28,21,18,0.12)]">
    <div class="grid grid-cols-3 gap-2 max-w-md mx-auto">
      <a href="<?= e($mobile_whatsapp_url) ?>" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 py-2 bg-[#1B4D3E] text-[#FAF6EE] rounded-full text-xs font-semibold whitespace-nowrap">Chat Now</a>
      <a href="<?= e($spa_config['phone_href']) ?>" class="flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 py-2 bg-[#5C1728] text-[#FAF6EE] rounded-full text-xs font-medium whitespace-nowrap">Call Now</a>
      <a href="<?= e($directions_url) ?>" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 py-2 bg-[#D9B263] text-[#1C1512] rounded-full text-xs font-semibold whitespace-nowrap">Directions</a>
    </div>
  </nav>

  <script>
    (function () {
      var btn = document.getElementById('mobile-menu-toggle');
      var drawer = document.getElementById('mobile-menu-drawer');
      if (btn && drawer) {
        btn.addEventListener('click', function () {
          drawer.classList.toggle('hidden');
        });
      }
    })();
  </script>
</body>
</html>
