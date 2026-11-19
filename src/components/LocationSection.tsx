import { useCallback, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  APILoadingStatus,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
} from '@vis.gl/react-google-maps';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { buildDirectionsUrl, SPA_CONFIG } from '../data/spaData';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function SparkSpaMapCanvas() {
  const status = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  const handleClose = useCallback(() => setInfoOpen(false), []);
  const directionsUrl = buildDirectionsUrl();

  if (
    !MAPS_API_KEY ||
    status === APILoadingStatus.FAILED ||
    status === APILoadingStatus.AUTH_FAILURE
  ) {
    return (
      <div className="w-full h-[380px] sm:h-[440px] bg-[#EFE7D8] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#B89352]/40 flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-[#8C6D37]" aria-hidden="true" />
        </div>
        <h3 className="font-serif text-2xl font-medium text-[#1F1D1B]">
          {SPA_CONFIG.displayAddressLine1}
        </h3>
        <p className="mt-1 text-sm text-[#4E4944] max-w-sm">
          {SPA_CONFIG.displayAddressLine2}
        </p>
        <p className="mt-2 text-xs text-[#8C6D37] tabular-nums">
          {SPA_CONFIG.coordinates.lat.toFixed(4)}° N, {SPA_CONFIG.coordinates.lng.toFixed(4)}° E
        </p>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#1F1D1B] text-[#FAF7F2] text-sm font-medium rounded-md hover:bg-[#332F2B] transition-colors"
        >
          <Navigation className="w-4 h-4" aria-hidden="true" />
          <span>Open in Google Maps</span>
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-[380px] sm:h-[440px] relative">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={SPA_CONFIG.coordinates}
        defaultZoom={15}
        gestureHandling="cooperative"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <AdvancedMarker
          ref={markerRef}
          position={SPA_CONFIG.coordinates}
          title={`${SPA_CONFIG.brandName} — ${SPA_CONFIG.area}`}
          onClick={() => setInfoOpen(true)}
        >
          <Pin background="#B89352" borderColor="#1F1D1B" glyphColor="#1F1D1B" scale={1.15} />
        </AdvancedMarker>

        {infoOpen && marker && (
          <InfoWindow anchor={marker} onCloseClick={handleClose} maxWidth={250}>
            <div className="p-1 text-[#1F1D1B] font-sans">
              <p className="font-serif text-lg font-semibold leading-tight">
                {SPA_CONFIG.displayAddressLine1}
              </p>
              <p className="mt-1 text-xs text-[#4E4944] leading-snug">
                {SPA_CONFIG.displayAddressLine2}
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8C6D37] hover:underline"
              >
                <span>Get Directions</span>
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export function LocationSection() {
  const directionsUrl = buildDirectionsUrl();

  return (
    <section id="location" className="py-16 md:py-24 bg-[#F3EBD9] border-y border-[#C69749]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Address & Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF6EE] border border-[#C69749]/30 rounded-xl p-7 sm:p-9">
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">
                Visit Us
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl leading-[1.15] font-medium text-[#1C1512]">
                Find Spark Spa in Electronic City
              </h2>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#5C1728] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-base font-semibold text-[#1C1512]">
                      {SPA_CONFIG.displayAddressLine1}
                    </p>
                    <p className="mt-0.5 text-sm sm:text-base text-[#524740]">
                      {SPA_CONFIG.displayAddressLine2}
                    </p>
                    <p className="mt-1 text-xs text-[#8F6422]">
                      {SPA_CONFIG.editableStreetNote}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#5C1728] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#1C1512]">Opening Hours</p>
                    <p className="mt-0.5 text-sm text-[#524740]">{SPA_CONFIG.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#5C1728] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#1C1512]">Direct Concierge</p>
                    <a
                      href={SPA_CONFIG.phoneHref}
                      className="mt-0.5 inline-block text-sm text-[#524740] hover:text-[#1C1512] underline decoration-[#C69749]/60 underline-offset-4 tabular-nums"
                    >
                      {SPA_CONFIG.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#C69749]/25 flex flex-col sm:flex-row gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-shimmer flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749]"
              >
                <Navigation className="w-4 h-4 text-[#E8C57B]" aria-hidden="true" />
                <span>Get Directions</span>
              </a>
              <a
                href={SPA_CONFIG.phoneHref}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] border border-[#1C1512]/25 hover:bg-[#F3EBD9] text-[#1C1512] text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749]"
              >
                <Phone className="w-4 h-4 text-[#5C1728]" aria-hidden="true" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-[#C69749]/30 bg-[#FAF6EE] shadow-sm">
            {MAPS_API_KEY ? (
              <APIProvider apiKey={MAPS_API_KEY} language="en" region="IN" libraries={['marker']}>
                <SparkSpaMapCanvas />
              </APIProvider>
            ) : (
              <div className="w-full h-[380px] sm:h-[440px] bg-[#EFE7D8] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#B89352]/40 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-[#8C6D37]" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F1D1B]">
                  {SPA_CONFIG.displayAddressLine1}
                </h3>
                <p className="mt-1 text-sm text-[#4E4944] max-w-sm">
                  {SPA_CONFIG.displayAddressLine2}
                </p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#1F1D1B] text-[#FAF7F2] text-sm font-medium rounded-md hover:bg-[#332F2B] transition-colors"
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
