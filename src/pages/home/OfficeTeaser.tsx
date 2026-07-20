import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { formulaChips, officeTeaser } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { rise, viewport15 } from '@/lib/motion';

/**
 * Home §8 — Office Zone Teaser (ऑफिस ज़ोन · Excel & Skills).
 * Left: H2 + line + primary button. Right: auto-scrolling formula chip
 * marquee (22s, duplicated track, mono font, pause on hover/touch).
 */
export default function OfficeTeaser() {
  const { t } = useLang();
  const chips = [...formulaChips, ...formulaChips];
  return (
    <section className="bg-sand-200/50 py-14 lg:py-20">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={viewport15}
          >
            <p className="text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.14em] text-amber-600">
              Excel &amp; Skills
            </p>
            <h2 className="mt-1.5 font-display text-[23px]/[30px] font-bold text-ink-900 md:text-[32px]/[38px]">
              {t(officeTeaser.title)}
              <span className="ml-2.5 text-[0.72em] font-medium text-ink-400">{officeTeaser.title.en}</span>
            </h2>
            <p className="mt-3 max-w-[440px] text-[16px]/[26px] text-ink-600">{t(officeTeaser.line)}</p>
            <Link
              to="/office"
              className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-terracotta-600 px-6 text-[15.5px] font-semibold text-white shadow-warm transition-all hover:-translate-y-0.5 active:scale-95"
            >
              {t(officeTeaser.cta)}
              <ArrowRight size={17} />
            </Link>
          </motion.div>

          <div className="marquee-paused relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="marquee-track slow items-center gap-3 pr-3">
              {chips.map((chip, i) => (
                <span
                  key={`${chip}-${i}`}
                  className="glass-inset shrink-0 rounded-full px-4 py-2.5 font-mono text-[13.5px] font-semibold text-terracotta-700"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
