import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, MessageCircle, User } from 'lucide-react';
import { BlogPost, buildWhatsAppUrl, INITIAL_BLOGS, SPA_CONFIG } from '../data/spaData';
import { LotusDivider } from './IndianMotifs';
import { SpaImage } from './SpaImage';

interface BlogSectionProps {
  blogs?: BlogPost[];
  config?: typeof SPA_CONFIG;
  mode?: 'preview' | 'full';
  activeSlug?: string | null;
  onOpenArticle: (slug: string) => void;
  onBackToBlogList?: () => void;
  onViewAllBlogs?: () => void;
  onBookNowClick: () => void;
}

export function BlogSection({
  blogs = INITIAL_BLOGS,
  config = SPA_CONFIG,
  mode = 'full',
  activeSlug,
  onOpenArticle,
  onBackToBlogList,
  onViewAllBlogs,
  onBookNowClick,
}: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const prefersReducedMotion = useReducedMotion();

  const publishedBlogs = useMemo(
    () => blogs.filter((b) => b.status === 'published'),
    [blogs]
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(publishedBlogs.map((b) => b.category)));
    return ['All', ...unique];
  }, [publishedBlogs]);

  const activeArticle = useMemo(
    () => (activeSlug ? publishedBlogs.find((b) => b.slug === activeSlug) || null : null),
    [activeSlug, publishedBlogs]
  );

  const filteredBlogs = useMemo(() => {
    const base =
      selectedCategory === 'All'
        ? publishedBlogs
        : publishedBlogs.filter((b) => b.category === selectedCategory);
    return mode === 'preview' ? base.slice(0, 3) : base;
  }, [publishedBlogs, selectedCategory, mode]);

  // Individual Blog Article Reader View
  if (mode === 'full' && activeArticle) {
    const articleWaUrl = buildWhatsAppUrl(
      `Namaste ${config.brandName} (${config.area}), I just read "${activeArticle.title}" on your blog and would like to enquire about booking a session.`,
      config.whatsappNumber
    );

    const paragraphs = activeArticle.content
      .split(/\n{2,}|\r\n\r\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    return (
      <article className="py-12 md:py-20 bg-[#FAF6EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBackToBlogList}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5C1728] hover:text-[#4A1120] mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to All Wellness Articles</span>
          </button>

          <p className="text-xs font-medium tracking-[0.16em] text-[#8F6422] uppercase">
            {activeArticle.category}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl leading-[1.12] font-medium text-[#1C1512]">
            {activeArticle.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-[#524740] pb-6 border-b border-[#C69749]/25">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#8F6422]" aria-hidden="true" />
              <span>{activeArticle.author}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#8F6422]" aria-hidden="true" />
              <span className="tabular-nums">{activeArticle.publishedAt}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8F6422]" aria-hidden="true" />
              <span>{activeArticle.readTime}</span>
            </span>
          </div>

          <div className="mt-8 aspect-[16/9] rounded-xl overflow-hidden bg-[#EFE7D8] border border-[#C69749]/25 shadow-sm">
            <SpaImage
              src={activeArticle.coverImage}
              alt={activeArticle.coverAlt}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-10 space-y-5 text-base sm:text-lg leading-[1.8] text-[#2D241F]">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <LotusDivider className="my-10" />

          <div className="bg-[#1C1512] text-[#FAF6EE] rounded-xl p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#D9B263]/30">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] text-[#E8C57B]">
                Experience It Yourself
              </p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium">
                Ready to Restore at {config.brandName}?
              </h2>
              <p className="mt-1.5 text-sm text-[#DFD3C0]">
                Reserve your preferred therapy slot in {config.area} in under a minute.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={onBookNowClick}
                className="px-5 py-3 min-h-[44px] bg-[#D9B263] hover:bg-[#E4C178] text-[#1C1512] text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap"
              >
                Book Appointment
              </button>
              <a
                href={articleWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm font-medium rounded-md border border-[#E8C57B]/35 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#E8C57B]" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section
      id="blog"
      className={mode === 'preview' ? 'py-16 md:py-24 bg-[#F3EBD9] border-y border-[#C69749]/25' : 'py-14 md:py-20 bg-[#FAF6EE]'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#C69749]/25">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-2.5">
              Wellness Journal &amp; Guides
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] leading-[1.15] font-medium text-[#1C1512]">
              {mode === 'preview'
                ? 'Stories, Rituals & Spa Insights'
                : 'Latest Spa & Wellness Articles'}
            </h2>
            <p className="mt-3 text-base text-[#524740] leading-relaxed">
              Guides on massage recovery, botanical oils, couple retreats, and seasonal self-care curated by {config.brandName}.
            </p>
          </div>

          {mode === 'full' ? (
            <div
              role="tablist"
              aria-label="Filter blog categories"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3EBD9] border border-[#C69749]/25 rounded-lg self-start lg:self-end"
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#5C1728] text-[#FAF6EE] shadow-sm'
                        : 'text-[#524740] hover:text-[#1C1512]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          ) : (
            onViewAllBlogs && (
              <button
                type="button"
                onClick={onViewAllBlogs}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] border border-[#5C1728] text-[#5C1728] hover:bg-[#5C1728] hover:text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors cursor-pointer self-start lg:self-end whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>Read All Blog Articles</span>
              </button>
            )
          )}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="mt-12 text-center py-14 bg-white border border-[#C69749]/25 rounded-xl">
            <p className="font-serif text-2xl text-[#1C1512]">New wellness stories coming soon.</p>
            <p className="mt-2 text-sm text-[#524740]">
              Our spa team publishes new treatment guides regularly via the Client Portal.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col bg-white border border-[#C69749]/25 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#C69749]/55 transition-all"
              >
                <button
                  type="button"
                  onClick={() => onOpenArticle(post.slug)}
                  className="relative aspect-[16/10] overflow-hidden bg-[#EFE7D8] block w-full cursor-pointer text-left"
                >
                  <SpaImage
                    src={post.coverImage}
                    alt={post.coverAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </button>

                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#8F6422]">
                    <span>{post.category}</span>
                    <span className="tabular-nums text-[#524740]">{post.publishedAt}</span>
                  </div>

                  <h3 className="mt-2.5 font-serif text-2xl font-medium text-[#1C1512] leading-snug">
                    <button
                      type="button"
                      onClick={() => onOpenArticle(post.slug)}
                      className="text-left hover:text-[#5C1728] transition-colors cursor-pointer"
                    >
                      {post.title}
                    </button>
                  </h3>

                  <p className="mt-2.5 text-sm text-[#524740] leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#1C1512]/10 flex items-center justify-between text-xs text-[#524740]">
                    <span>{post.readTime}</span>
                    <button
                      type="button"
                      onClick={() => onOpenArticle(post.slug)}
                      className="inline-flex items-center gap-1.5 font-semibold text-[#5C1728] hover:text-[#4A1120] cursor-pointer"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
