import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { officeAppGuides } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { rise, stagger, viewport15 } from '@/lib/motion';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

/**
 * Office §4 — Word · PowerPoint · Google Sheets: 3 GuideCard columns,
 * each with app icon disc, 4 topic links with chevrons, "सभी ट्यूटोरियल →".
 * Columns rise stagger 0.1s; topic links underline-grow on hover.
 */
export default function AppGuides() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader
        kicker="BEYOND EXCEL"
        title={{ hi: 'Word · PowerPoint · Google Sheets', en: 'Word · PowerPoint · Google Sheets' }}
      />

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {officeAppGuides.map((guide) => {
          const Icon = guide.icon;
          return (
            <motion.article key={guide.id} variants={rise} className="glass-card flex flex-col p-6">
              <div className="flex items-center gap-3">
                <span className={cn('icon-disc h-12 w-12', tintDiscBg[guide.tint])}>
                  <Icon size={21} strokeWidth={1.75} className={tintIcon[guide.tint]} />
                </span>
                <h3 className="font-display text-[19px]/[26px] font-semibold text-ink-900">{t(guide.title)}</h3>
              </div>

              <ul className="mt-4 flex flex-col divide-y divide-black/5">
                {guide.topics.map((topic) => (
                  <li key={topic.hi}>
                    <Link
                      to="/article"
                      className="group flex items-center justify-between gap-2 py-3 text-[15px]/[22px] text-ink-600 transition-colors hover:text-ink-900"
                    >
                      <span className="link-underline">{t(topic)}</span>
                      <ChevronRight
                        size={16}
                        className="shrink-0 text-ink-400 transition-transform duration-200 ease-out-expo group-hover:translate-x-1 group-hover:text-terracotta-600"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                to="/article"
                className="group mt-4 inline-flex items-center gap-1.5 self-start text-[14.5px] font-semibold text-terracotta-600"
              >
                सभी ट्यूटोरियल
                <ArrowRight size={16} className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
              </Link>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
