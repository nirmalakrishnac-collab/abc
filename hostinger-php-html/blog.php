<?php
require_once __DIR__ . '/config.php';
$active_page = 'blog';
$published_blogs = array_values(array_filter($blogs, fn($b) => ($b['status'] ?? 'published') === 'published'));

$requested_slug = trim((string)($_GET['post'] ?? ''));
$active_post = null;
if ($requested_slug !== '') {
    foreach ($published_blogs as $b) {
        if (($b['slug'] ?? '') === $requested_slug) {
            $active_post = $b;
            break;
        }
    }
}

$page_title = $active_post
    ? "{$active_post['title']} | {$spa_config['brand_name']} Blog"
    : "Wellness Journal & Blog | {$spa_config['brand_name']} Electronic City, Bangalore";
$page_description = $active_post
    ? (string)$active_post['excerpt']
    : "Read spa tips, massage recovery guides & aromatherapy stories from {$spa_config['brand_name']} in Electronic City.";

require __DIR__ . '/includes/header.php';
?>
<main>
<?php if ($active_post):
  $post_img = is_safe_asset_path((string)$active_post['image']) ? $active_post['image'] : 'images/hero_spa_sanctuary_1795110762237.jpg';
  $wa_article = build_whatsapp_url("Namaste {$spa_config['brand_name']}, I just read \"{$active_post['title']}\" and would like to book an appointment.", $spa_config);
  $paragraphs = array_filter(array_map('trim', preg_split("/\r\n\r\n|\n\n/", (string)$active_post['content'])));
?>
  <article class="py-12 md:py-20 bg-[#FAF6EE]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="blog.php" class="inline-flex items-center gap-2 text-sm font-medium text-[#5C1728] hover:underline mb-8">&larr; Back to All Wellness Articles</a>
      <p class="text-xs font-medium tracking-[0.16em] text-[#8F6422] uppercase"><?= e($active_post['category']) ?></p>
      <h1 class="mt-2 font-serif text-3xl sm:text-5xl leading-[1.12] font-medium text-[#1C1512]"><?= e($active_post['title']) ?></h1>
      <div class="mt-5 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-[#524740] pb-6 border-b border-[#C69749]/25">
        <span>By <?= e($active_post['author']) ?></span>
        <span>·</span>
        <span class="tabular-nums"><?= e($active_post['published_at']) ?></span>
        <span>·</span>
        <span><?= e($active_post['read_time']) ?></span>
      </div>
      <div class="mt-8 aspect-[16/9] rounded-xl overflow-hidden bg-[#EFE7D8] border border-[#C69749]/25">
        <img src="<?= e($post_img) ?>" alt="<?= e($active_post['alt']) ?>" class="w-full h-full object-cover" />
      </div>
      <div class="mt-10 space-y-5 text-base sm:text-lg leading-[1.8] text-[#2D241F]">
        <?php foreach ($paragraphs as $p): ?>
        <p><?= e($p) ?></p>
        <?php endforeach; ?>
      </div>
      <div class="mt-12 bg-[#1C1512] text-[#FAF6EE] rounded-xl p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p class="text-xs font-medium tracking-[0.16em] text-[#E8C57B]">Book Your Session</p>
          <h2 class="mt-1 font-serif text-2xl sm:text-3xl font-medium">Experience <?= e($spa_config['brand_name']) ?> Today</h2>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <a href="contact.php#booking" class="px-5 py-3 bg-[#D9B263] text-[#1C1512] text-sm font-semibold rounded-md">Book Appointment</a>
          <a href="<?= e($wa_article) ?>" target="_blank" rel="noopener noreferrer" class="px-5 py-3 bg-[#1B4D3E] text-[#FAF6EE] text-sm font-medium rounded-md border border-[#E8C57B]/35">WhatsApp</a>
        </div>
      </div>
    </div>
  </article>
<?php else: ?>
  <section class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="index.php" class="text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE]">&larr; Back to Home</a>
      <p class="mt-4 text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">Spark Wellness Journal</p>
      <h1 class="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#FAF6EE]">Spa Insights, Massage Guides &amp; Stories</h1>
      <p class="mt-3 text-base sm:text-lg text-[#EFE3CE] max-w-2xl">Wellness articles and sanctuary updates published directly by our spa team.</p>
    </div>
  </section>

  <section class="py-16 md:py-24 bg-[#FAF6EE]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <?php if (count($published_blogs) === 0): ?>
      <div class="text-center py-14 bg-white border border-[#C69749]/25 rounded-xl">
        <p class="font-serif text-2xl text-[#1C1512]">New wellness stories coming soon.</p>
      </div>
      <?php else: ?>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach ($published_blogs as $b):
          $img = is_safe_asset_path((string)$b['image']) ? $b['image'] : 'images/hero_spa_sanctuary_1795110762237.jpg';
        ?>
        <article class="group flex flex-col bg-white border border-[#C69749]/25 rounded-xl overflow-hidden hover:shadow-lg transition-all">
          <a href="blog.php?post=<?= rawurlencode($b['slug']) ?>" class="relative aspect-[16/10] overflow-hidden bg-[#EFE7D8] block">
            <img src="<?= e($img) ?>" alt="<?= e($b['alt']) ?>" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          </a>
          <div class="flex-1 p-6 flex flex-col">
            <div class="flex items-center justify-between text-xs font-medium text-[#8F6422]">
              <span><?= e($b['category']) ?></span>
              <span class="tabular-nums text-[#524740]"><?= e($b['published_at']) ?></span>
            </div>
            <h2 class="mt-2.5 font-serif text-2xl font-medium text-[#1C1512] leading-snug">
              <a href="blog.php?post=<?= rawurlencode($b['slug']) ?>" class="hover:text-[#5C1728]"><?= e($b['title']) ?></a>
            </h2>
            <p class="mt-2.5 text-sm text-[#524740] leading-relaxed flex-1"><?= e($b['excerpt']) ?></p>
            <div class="mt-5 pt-4 border-t border-[#1C1512]/10 flex items-center justify-between text-xs text-[#524740]">
              <span><?= e($b['read_time']) ?></span>
              <a href="blog.php?post=<?= rawurlencode($b['slug']) ?>" class="font-semibold text-[#5C1728] hover:underline">Read Article &rarr;</a>
            </div>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </div>
  </section>
<?php endif; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
