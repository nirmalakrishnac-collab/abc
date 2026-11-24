<?php
require_once __DIR__ . '/config.php';
$active_page = 'contact';
$page_title = "Book Spa & Salon Appointment | {$spa_config['brand_name']} Electronic City";
$page_description = "Call or WhatsApp {$spa_config['brand_name']} in Electronic City, Bangalore for instant spa massage or salon appointment slots. Open daily 10 AM – 9:30 PM.";
$page_keywords = "book spa electronic city, salon appointment electronic city bangalore, spa phone number electronic city, whatsapp spa booking bangalore, spa near hosur road electronic city, best spa near infosys electronic city";
require __DIR__ . '/includes/header.php';
?>
<main>
  <section class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="index.php" class="text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE]">&larr; Back to Home</a>
      <p class="mt-4 text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">Visit &amp; Reserve</p>
      <h1 class="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#FAF6EE]">Contact &amp; Book Spa or Salon Slot</h1>
      <p class="mt-3 text-base sm:text-lg text-[#EFE3CE] max-w-2xl">Tap WhatsApp or Call directly for instant slot confirmation, or visit <?= e($spa_config['brand_name']) ?> in <?= e($spa_config['area']) ?>.</p>
    </div>
  </section>

  <?php require __DIR__ . '/includes/location-block.php'; ?>
  <?php require __DIR__ . '/includes/booking-form.php'; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
