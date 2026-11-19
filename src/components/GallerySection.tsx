import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { GALLERY_DATA, GalleryItem } from '../data/spaData';
import { SpaImage } from './SpaImage';

interface GallerySectionProps {
  onBookClick: () => void;
}

type GalleryFilter = 'all' | 'interiors' | 'suites' | 'rituals';

export function GallerySection({ onBookClick }: GallerySectionProps) {
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const visibleItems =
    filter === 'all'
      ? GALLERY_DATA
      : GALLERY_DATA.filter((item) => item.spaceCategory === filter);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, visibleItems.length]);

  const activeItem: GalleryItem | null =
    lightboxIndex !== null && visibleItems[lightboxIndex]
      ? visibleItems[lightboxIndex]
      : null;

  return (
    <section id="gallery" className="py-16 md:py-24 bg-[#FAF6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#C69749]/25">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">
              Inside The Sanctuary
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[44px] leading-[1.15] font-medium text-[#1C1512] text-balance">
              Spaces Crafted for Quiet Restoration
            </h2>
            <p className="mt-4 text-base text-[#524740] leading-relaxed">
              Explore our private massage rooms, thermal slate showers, and candlelit relaxation lounges in Electronic City, Bangalore.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter gallery spaces"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3EBD9] border border-[#C69749]/25 rounded-lg self-start lg:self-end"
          >
            {(
              [
                { id: 'all', label: 'All Spaces' },
                { id: 'interiors', label: 'Interiors' },
                { id: 'suites', label: 'Massage Suites' },
                { id: 'rituals', label: 'Thermal & Rituals' },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(tab.id);
                    setLightboxIndex(null);
                  }}
                  className={`px-3 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] ${
                    active
                      ? 'bg-[#5C1728] text-[#FAF6EE] shadow-sm'
                      : 'text-[#524740] hover:text-[#1C1512]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Editorial Bento Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-[250px]">
          {visibleItems.map((item, idx) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-xl bg-[#EFE7D8] border border-[#C69749]/20 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69749] min-h-[260px] md:min-h-0 ${
                filter === 'all' ? item.spanClass : 'md:col-span-4 md:row-span-1'
              }`}
            >
              <SpaImage
                src={item.image}
                alt={item.imageAlt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#16100D]/88 via-[#16100D]/25 to-transparent"
              />
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1C1512]/60 backdrop-blur-sm text-[#FAF6EE] flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                <Expand className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-xs font-medium tracking-wider text-[#E8C57B]">
                  {item.categoryLabel}
                </p>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-medium text-[#FAF6EE]">
                  {item.title}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 bg-[#16100D]/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#FAF6EE] border border-[#C69749]/35 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close gallery preview"
              className="absolute top-3 right-3 z-10 w-11 h-11 rounded-full bg-[#1C1512]/80 text-[#FAF6EE] hover:bg-[#1C1512] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B263]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] bg-[#1C1512]">
              <SpaImage
                src={activeItem.image}
                alt={activeItem.imageAlt}
                loading="eager"
                className="w-full h-full object-cover"
              />

              {visibleItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev === null
                          ? 0
                          : (prev - 1 + visibleItems.length) % visibleItems.length
                      )
                    }
                    aria-label="Previous gallery photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1C1512]/75 text-[#FAF6EE] hover:bg-[#1C1512] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B263]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev === null ? 0 : (prev + 1) % visibleItems.length
                      )
                    }
                    aria-label="Next gallery photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1C1512]/75 text-[#FAF6EE] hover:bg-[#1C1512] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B263]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#8F6422] tracking-wide">
                  {activeItem.categoryLabel}
                </p>
                <h3 className="font-serif text-2xl font-medium text-[#1C1512] mt-0.5">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-[#524740] mt-1">{activeItem.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(null);
                  onBookClick();
                }}
                className="px-5 py-3 min-h-[44px] bg-[#5C1728] text-[#FAF6EE] text-sm font-medium rounded-md hover:bg-[#4A1120] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Book Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
