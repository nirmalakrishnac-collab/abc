<?php
require_once __DIR__ . '/config.php';
$active_page = 'contact';
$page_title = "Contact & Book Appointment | {$spa_config['brand_name']} Electronic City, Bangalore";
$page_description = "Book your massage or spa appointment at {$spa_config['brand_name']}, Electronic City, Bangalore at any preferred time on WhatsApp or call us directly.";
require __DIR__ . '/includes/header.php';
?>
<main>
  <section class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="index.php" class="text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE]">&larr; Back to Home</a>
      <p class="mt-4 text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">Visit &amp; Reserve</p>
      <h1 class="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#FAF6EE]">Contact &amp; Book Appointment</h1>
      <p class="mt-3 text-base sm:text-lg text-[#EFE3CE] max-w-2xl">Choose your preferred time slot and reserve via WhatsApp, or get directions to <?= e($spa_config['brand_name']) ?>.</p>
    </div>
  </section>

  <?php require __DIR__ . '/includes/location-block.php'; ?>
  <?php require __DIR__ . '/includes/booking-form.php'; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
