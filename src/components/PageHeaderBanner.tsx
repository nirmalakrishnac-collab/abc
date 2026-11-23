import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderBannerProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  onBackHome: () => void;
}

export function PageHeaderBanner({
  eyebrow,
  title,
  subtitle,
  onBackHome,
}: PageHeaderBannerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[#E8C57B] hover:text-[#FAF6EE] transition-colors mb-5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Home</span>
        </button>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-xs sm:text-sm font-medium tracking-[0.18em] text-[#E8C57B]">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl md:text-[54px] leading-[1.1] font-medium text-[#FAF6EE] text-balance">
            {title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#EFE3CE] leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
