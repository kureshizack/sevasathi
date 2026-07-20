import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { articles } from '@/lib/data';
import SectionHeader from '@/components/SectionHeader';
import { useLang } from '@/lib/lang';
import { tintDiscBg, tintIcon, tintGlass } from '@/lib/tints';
import { rise, stagger, viewport15 } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Home §9 — Life Hacks strip (लाइफ हैक्स · Smart Living).
 * 3 GuideCards, scroll-snap mobile → 3-col lg.
 */
export default function LifeHacksStrip() {
  const { t } = useLang();
  const guides = articles.slice(0, 3);
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader
        kicker="Smart Living"
        title={{ hi: 'लाइफ हैक्स', en: 'Life Hacks' }}
        viewAllHref="/lifehacks"
        viewAllLabel={{ hi: 'सभी टिप्स', en: 'All tips' }}
      />
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="scroll-fade-x no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible"
      >
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <motion.div key={g.id} variants={rise} className="w-[82%] max-w-[340px] shrink-0 snap-start sm:w-[60%] lg:w-auto lg:max-w-none">
              <Link to="/article" className={cn('glass-card group flex h-full flex-col gap-3 p-5 transition-all lg:hover:-translate-y-1 lg:hover:shadow-lg', tintGlass[g.tint])}>
                <div className="flex items-center justify-between">
                  <span className={cn('icon-disc h-12 w-12', tintDiscBg[g.tint])}>
                    <Icon size={21} strokeWidth={1.75} className={tintIcon[g.tint]} />
                  </span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={viewport15}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 text-[11.5px] font-semibold text-ink-600"
                  >
                    <Clock size={12} />
                    {g.readTime}
                  </motion.span>
                </div>
                <h3 className="font-display text-[17px]/[23px] font-semibold text-ink-900">{t(g.title)}</h3>
                <span className="mt-auto pt-1 text-[13.5px] font-semibold text-terracotta-600">
                  पढ़ें →
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
