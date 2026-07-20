import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { careerGuides } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { pop, stagger, viewport15 } from '@/lib/motion';

/**
 * Office §5 — Career Corner: 2×2 → 4-col grid of GuideCards.
 * Cards pop stagger 0.07s; hover lift.
 */
export default function CareerCorner() {
  const { t } = useLang();

  return (
    <section id="career" className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader kicker="CAREER CORNER" title={{ hi: 'करियर कॉर्नर', en: 'Career Corner' }} />

      <motion.div
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {careerGuides.map((guide) => {
          const Icon = guide.icon;
          return (
            <motion.div key={guide.id} variants={pop}>
              <Link
                to="/article"
                className="glass-card group flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-glass-sm active:scale-[0.97]"
              >
                <div className="flex items-start justify-between">
                  <span className="icon-disc h-12 w-12 bg-terracotta-100">
                    <Icon size={21} strokeWidth={1.75} className="text-terracotta-700" />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-ink-400 transition-all duration-200 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-terracotta-600"
                  />
                </div>
                <h3 className="mt-4 font-display text-[17px]/[24px] font-semibold text-ink-900">{t(guide.title)}</h3>
                <p className="mt-1.5 text-[14px]/[22px] text-ink-400">{t(guide.desc)}</p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
