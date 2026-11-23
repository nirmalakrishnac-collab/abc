<?php
$today_iso = date('Y-m-d');
$booking_error = isset($_GET['booking_error']);
$preselect = trim((string)($_GET['service'] ?? ''));
?>
<section id="booking" class="py-16 md:py-24 bg-[#FAF6EE]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <div class="lg:col-span-5">
        <p class="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">Priority WhatsApp Concierge</p>
        <h2 class="font-serif text-3xl sm:text-4xl md:text-[42px] leading-[1.15] font-medium text-[#1C1512]">
          Book Your Appointment at Your Preferred Time
        </h2>
        <p class="mt-4 text-base text-[#524740] leading-relaxed">
          Choose your therapy, date, and any exact preferred time that suits your schedule. Send your booking directly on WhatsApp with zero advance payment required.
        </p>
        <div class="mt-8 pt-6 border-t border-[#C69749]/25 space-y-3 text-sm text-[#524740]">
          <p><strong class="text-[#1C1512]">Hours:</strong> <?= e($spa_config['hours']) ?></p>
          <p><strong class="text-[#1C1512]">Phone:</strong> <a href="<?= e($spa_config['phone_href']) ?>" class="underline decoration-[#C69749] tabular-nums"><?= e($spa_config['phone_display']) ?></a></p>
        </div>
      </div>

      <div class="lg:col-span-7 bg-white border border-[#C69749]/35 rounded-xl p-6 sm:p-9 shadow-md">
        <?php if ($booking_error): ?>
        <div role="alert" class="mb-5 p-3.5 rounded-md bg-[#5C1728]/10 border border-[#5C1728]/30 text-sm text-[#5C1728] font-medium">
          Please enter your full name and a valid 10-digit mobile number to continue.
        </div>
        <?php endif; ?>

        <form id="spark-booking-form" action="book.php" method="POST" class="space-y-5">
          <input type="hidden" name="guestMode" id="booking-guest-mode" value="Solo Session" />

          <div>
            <span class="block text-xs sm:text-sm font-medium text-[#1C1512] mb-2">Guest Preference</span>
            <div class="grid grid-cols-2 gap-2.5 p-1 bg-[#F3EBD9] rounded-lg border border-[#C69749]/25">
              <button type="button" data-guest-mode="Solo Session" class="guest-mode-btn py-2.5 px-3 min-h-[42px] text-xs sm:text-sm font-medium rounded-md bg-[#5C1728] text-[#FAF6EE] shadow-sm cursor-pointer">Solo Session</button>
              <button type="button" data-guest-mode="Couple Suite" class="guest-mode-btn py-2.5 px-3 min-h-[42px] text-xs sm:text-sm font-medium rounded-md text-[#524740] hover:text-[#1C1512] cursor-pointer">Couple Suite</button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="booking-full-name" class="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5">Full Name <span class="text-[#5C1728]">*</span></label>
              <input id="booking-full-name" name="fullName" type="text" required placeholder="Your full name" class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] focus:outline-none focus:border-[#C69749]" />
            </div>
            <div>
              <label for="booking-mobile" class="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5">Mobile Number (WhatsApp) <span class="text-[#5C1728]">*</span></label>
              <input id="booking-mobile" name="mobileNumber" type="tel" required placeholder="+91 98XXX XXXXX" class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] tabular-nums focus:outline-none focus:border-[#C69749]" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="booking-service" class="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5">Preferred Service <span class="text-[#5C1728]">*</span></label>
              <select id="booking-service" name="preferredService" required class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] focus:outline-none focus:border-[#C69749]">
                <?php foreach ($services as $svc): ?>
                <option value="<?= e($svc['name']) ?>" <?= $preselect === $svc['name'] ? 'selected' : '' ?>><?= e($svc['name']) ?></option>
                <?php endforeach; ?>
                <?php foreach ($offers as $offer): $pkg = 'Package: ' . $offer['title']; ?>
                <option value="<?= e($pkg) ?>" <?= $preselect === $pkg ? 'selected' : '' ?>><?= e($pkg) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
            <div>
              <label for="booking-date" class="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5">Preferred Date <span class="text-[#5C1728]">*</span></label>
              <input id="booking-date" name="preferredDate" type="date" required min="<?= e($today_iso) ?>" value="<?= e($today_iso) ?>" class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] tabular-nums focus:outline-none focus:border-[#C69749]" />
            </div>
          </div>

          <div>
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label for="booking-custom-time" class="block text-xs sm:text-sm font-medium text-[#1C1512]">Your Preferred Time <span class="text-[#5C1728]">*</span></label>
              <span class="text-xs text-[#8F6422]">Pick any time or type your preferred slot</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input id="booking-custom-time" name="preferredTime" type="time" value="16:00" class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] tabular-nums focus:outline-none focus:border-[#C69749]" />
              <input id="booking-custom-time-note" name="customTimeNote" type="text" placeholder="Or type exact time (e.g. 6:15 PM)" class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] focus:outline-none focus:border-[#C69749]" />
            </div>
            <div class="mt-2.5 flex flex-wrap gap-1.5">
              <?php foreach (array_slice($preferred_time_slots, 0, 6) as $slot): ?>
              <button type="button" data-quick-time="<?= e($slot) ?>" class="quick-time-btn px-2.5 py-1.5 text-xs font-medium rounded border bg-[#FAF6EE] border-[#1C1512]/15 text-[#524740] hover:border-[#C69749] hover:text-[#1C1512] tabular-nums cursor-pointer"><?= e($slot) ?></button>
              <?php endforeach; ?>
            </div>
          </div>

          <div>
            <label for="booking-message" class="block text-xs sm:text-sm font-medium text-[#1C1512] mb-1.5">Additional Message</label>
            <textarea id="booking-message" name="additionalMessage" rows="2" placeholder="Preferred pressure, aroma oil, or special occasion notes..." class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm text-[#1C1512] focus:outline-none focus:border-[#C69749]"></textarea>
          </div>

          <label class="flex items-start gap-3 p-3.5 rounded-lg bg-[#F3EBD9]/75 border border-[#C69749]/35 cursor-pointer">
            <input id="booking-apply-offer" name="applyWelcomeOffer" value="1" type="checkbox" checked class="mt-0.5 w-4 h-4 accent-[#5C1728] rounded cursor-pointer" />
            <span class="text-xs sm:text-sm text-[#1C1512] leading-snug">
              <strong class="text-[#5C1728]">Apply Website Welcome Offer (<?= e($welcome_offer['offer_code']) ?>)</strong> — includes complimentary herbal compress &amp; tea ritual.
            </span>
          </label>

          <p id="booking-form-error" role="alert" class="hidden text-xs text-[#5C1728] font-medium"></p>

          <button type="submit" class="cta-shimmer w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 min-h-[50px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm sm:text-base font-semibold rounded-md shadow-sm transition-colors cursor-pointer">
            <span>Book Appointment on WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
<script>
(function () {
  var guestInput = document.getElementById('booking-guest-mode');
  document.querySelectorAll('.guest-mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.guest-mode-btn').forEach(function (b) {
        b.className = 'guest-mode-btn py-2.5 px-3 min-h-[42px] text-xs sm:text-sm font-medium rounded-md text-[#524740] hover:text-[#1C1512] cursor-pointer';
      });
      btn.className = 'guest-mode-btn py-2.5 px-3 min-h-[42px] text-xs sm:text-sm font-medium rounded-md bg-[#5C1728] text-[#FAF6EE] shadow-sm cursor-pointer';
      if (guestInput) guestInput.value = btn.getAttribute('data-guest-mode');
    });
  });

  var timeInput = document.getElementById('booking-custom-time');
  var timeNoteInput = document.getElementById('booking-custom-time-note');
  document.querySelectorAll('.quick-time-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var m = btn.getAttribute('data-quick-time').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (m && timeInput) {
        var h = parseInt(m[1], 10);
        if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
        if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
        timeInput.value = String(h).padStart(2, '0') + ':' + m[2];
      }
      if (timeNoteInput) timeNoteInput.value = '';
    });
  });

  var form = document.getElementById('spark-booking-form');
  var errBox = document.getElementById('booking-form-error');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('booking-full-name').value.trim();
      var phone = document.getElementById('booking-mobile').value.trim();
      if (name.length < 2 || phone.replace(/\D/g, '').length < 10) {
        errBox.textContent = 'Please enter your full name and valid 10-digit mobile number.';
        errBox.classList.remove('hidden');
        return;
      }
      errBox.classList.add('hidden');
      var tVal = timeInput ? timeInput.value : '16:00';
      var parts = tVal.split(':');
      var h = parseInt(parts[0], 10);
      var formatted24 = isNaN(h) ? tVal : ((h % 12 === 0 ? 12 : h % 12) + ':' + parts[1] + ' ' + (h >= 12 ? 'PM' : 'AM'));
      var timeDisplay = (timeNoteInput && timeNoteInput.value.trim()) ? timeNoteInput.value.trim() : formatted24;
      var lines = [
        'Namaste ' + <?= json_encode($spa_config['brand_name']) ?> + ' (' + <?= json_encode($spa_config['area']) ?> + '),',
        'I would like to book an appointment:', '',
        '• Full Name: ' + name,
        '• Mobile Number: ' + phone,
        '• Session Type: ' + (guestInput ? guestInput.value : 'Solo Session'),
        '• Preferred Service: ' + document.getElementById('booking-service').value,
        '• Preferred Date: ' + document.getElementById('booking-date').value,
        '• Guest Preferred Time: ' + timeDisplay,
        document.getElementById('booking-apply-offer').checked
          ? '• Privilege Offer: ' + <?= json_encode($welcome_offer['offer_code']) ?> + ' (Website Welcome Offer)'
          : '• Privilege Offer: Standard Booking',
        document.getElementById('booking-message').value.trim()
          ? '• Additional Message: ' + document.getElementById('booking-message').value.trim()
          : '• Additional Message: None',
        '', 'Please confirm slot availability on WhatsApp. Dhanyavaad!'
      ];
      var url = 'https://wa.me/' + <?= json_encode($spa_config['whatsapp_number']) ?> + '?text=' + encodeURIComponent(lines.join('\n'));
      var a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
  }
})();
</script>
