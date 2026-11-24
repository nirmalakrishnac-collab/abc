import { motion, useReducedMotion } from 'motion/react';
import { Wind, Award, ShieldCheck, HeartHandshake, MapPin, CalendarCheck } from 'lucide-react';
import { WHY_CHOOSE_DATA, WhyChoosePillar } from '../data/spaData';

function PillarIcon({ name }: { name: WhyChoosePillar['iconName'] }) {
  const iconClass = 'w-5 h-5 text-[#5C1728] stroke-[1.6]';
  switch (name) {
    case 'wind':
      return <Wind className={iconClass} aria-hidden="true" />;
    case 'award':
      return <Award className={iconClass} aria-hidden="true" />;
    case 'shield':
      return <ShieldCheck className={iconClass} aria-hidden="true" />;
    case 'heart':
      return <HeartHandshake className={iconClass} aria-hidden="true" />;
    case 'mappin':
      return <MapPin className={iconClass} aria-hidden="true" />;
    case 'calendar':
      return <CalendarCheck className={iconClass} aria-hidden="true" />;
  }
}

export function WhyChooseSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="why-spark" className="py-16 md:py-24 bg-[#F3EBD9] border-y border-[#C69749]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Editorial Lead */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#8F6422] mb-3">
              The Spark Standard
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl leading-[1.15] font-medium text-[#1C1512] text-balance">
              Why Guests Choose Spark Spa &amp; Salon
            </h2>
            <p className="mt-4 text-base text-[#524740] leading-relaxed">
              Designed as Electronic City&apos;s complete luxury sanctuary for body massages, hair spa rituals, facials, and five-star hospitality under one serene roof.
            </p>
          </div>

          {/* Right Column: 6-Pillar Grid with Hairline Dividers */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {WHY_CHOOSE_DATA.map((pillar, idx) => (
              <motion.div
                key={pillar.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#FAF6EE] border border-[#C69749]/25 rounded-xl p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#C69749]/55"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F3EBD9] border border-[#C69749]/35 flex items-center justify-center">
                    <PillarIcon name={pillar.iconName} />
                  </div>
                  <span className="text-xs font-medium text-[#8F6422] tabular-nums">
                    {pillar.index}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1512]">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#524740] leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
