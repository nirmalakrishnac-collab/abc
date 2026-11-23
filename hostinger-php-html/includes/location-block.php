<?php $directions_url = build_directions_url($spa_config); ?>
<section id="location" class="py-16 md:py-24 bg-[#F3EBD9] border-y border-[#C69749]/25">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
      <div class="lg:col-span-5 flex flex-col justify-between bg-[#FAF6EE] border border-[#C69749]/30 rounded-xl p-7 sm:p-9">
        <div>
          <p class="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">Visit Us</p>
          <h2 class="font-serif text-3xl sm:text-4xl leading-[1.15] font-medium text-[#1C1512]">Find <?= e($spa_config['brand_name']) ?> in Electronic City</h2>
          <div class="mt-8 space-y-6">
            <div>
              <p class="text-base font-semibold text-[#1C1512]"><?= e($spa_config['address_line_1']) ?></p>
              <p class="mt-0.5 text-sm sm:text-base text-[#524740]"><?= e($spa_config['address_line_2']) ?></p>
              <p class="mt-1 text-xs text-[#8F6422]"><?= e($spa_config['street_note']) ?></p>
            </div>
            <div>
              <p class="text-sm font-semibold text-[#1C1512]">Opening Hours</p>
              <p class="mt-0.5 text-sm text-[#524740]"><?= e($spa_config['hours']) ?></p>
            </div>
            <div>
              <p class="text-sm font-semibold text-[#1C1512]">Direct Concierge</p>
              <a href="<?= e($spa_config['phone_href']) ?>" class="mt-0.5 inline-block text-sm text-[#524740] hover:text-[#1C1512] underline decoration-[#C69749]/60 underline-offset-4 tabular-nums">
                <?= e($spa_config['phone_display']) ?>
              </a>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-[#C69749]/25 flex flex-col sm:flex-row gap-3">
          <a href="<?= e($directions_url) ?>" target="_blank" rel="noopener noreferrer" class="cta-shimmer flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0">
            <span>Get Directions</span>
          </a>
          <a href="<?= e($spa_config['phone_href']) ?>" class="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] border border-[#1C1512]/25 hover:bg-[#F3EBD9] text-[#1C1512] text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0">
            <span>Call Now</span>
          </a>
        </div>
      </div>

      <div class="lg:col-span-7 rounded-xl overflow-hidden border border-[#C69749]/30 bg-[#FAF6EE] shadow-sm">
        <?php if (!empty($spa_config['google_maps_api_key'])): ?>
        <div id="php-google-map" class="w-full h-[380px] sm:h-[440px]"></div>
        <script>
          (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));m.head.append(a)}));d[l]?console.warn(p+" only loads once."):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
            key: <?= json_encode($spa_config['google_maps_api_key']) ?>, v: "weekly", language: "en", region: "IN"
          });
          (async function () {
            try {
              const { Map } = await google.maps.importLibrary("maps");
              const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
              const pos = { lat: <?= json_encode((float)$spa_config['coordinates']['lat']) ?>, lng: <?= json_encode((float)$spa_config['coordinates']['lng']) ?> };
              const map = new Map(document.getElementById("php-google-map"), { zoom: 15, center: pos, mapId: "DEMO_MAP_ID", gestureHandling: "cooperative" });
              new AdvancedMarkerElement({ map: map, position: pos, title: <?= json_encode($spa_config['brand_name'] . ' — ' . $spa_config['area']) ?> });
            } catch (e) {}
          })();
        </script>
        <?php else: ?>
        <div class="w-full h-[380px] sm:h-[440px] bg-[#EFE7D8] flex flex-col items-center justify-center p-8 text-center">
          <h3 class="font-serif text-2xl font-medium text-[#1C1512]"><?= e($spa_config['address_line_1']) ?></h3>
          <p class="mt-1 text-sm text-[#524740] max-w-sm"><?= e($spa_config['address_line_2']) ?></p>
          <p class="mt-2 text-xs text-[#8F6422] tabular-nums"><?= e((string)$spa_config['coordinates']['lat']) ?>° N, <?= e((string)$spa_config['coordinates']['lng']) ?>° E</p>
          <a href="<?= e($directions_url) ?>" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#5C1728] text-[#FAF6EE] text-sm font-medium rounded-md hover:bg-[#4A1120] transition-colors">
            <span>Get Directions on Google Maps</span>
          </a>
        </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
