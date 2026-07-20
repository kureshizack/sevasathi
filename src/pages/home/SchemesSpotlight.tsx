import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { schemes } from '@/lib/data';
import SchemeCard from '@/components/SchemeCard';
import SectionHeader from '@/components/SectionHeader';
import { useLang } from '@/lib/lang';
import { rise, stagger, viewport15 } from '@/lib/motion';

const featured = schemes[0]; // PM-KISAN

const miniSteps = ['eKYC करें', 'पात्रता जांचें', 'किस्त ट्रैक करें'];

/**
 * Home §5 — Schemes Spotlight (योजना स्पॉटलाइट · Featured Schemes).
 * Featured wide PM-KISAN card + 3 SchemeCards. Alt bg sand-200/50.
 */
export default function SchemesSpotlight() {
  const { t } = useLang();
  const rest = schemes.slice(1, 4);
  return (
    <section id="schemes" className="scroll-mt-24 bg-sand-200/50 py-14 lg:py-20">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 lg:px-8">
        <SectionHeader
          kicker="Sarkari Yojana"
          title={{ hi: 'योजना स्पॉटलाइट', en: 'Featured Schemes' }}
          viewAllHref="/schemes"
          viewAllLabel={{ hi: 'सभी योजनाएँ', en: 'All schemes' }}
        />
        {/* featured wide card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport15}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card glass-tint-leaf relative mb-4 overflow-hidden p-6 lg:p-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[560px]">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-amber-100 px-3.5 py-1 font-mono text-[13px] font-semibold text-amber-600">
                  {featured.benefit}
                </span>
                <span className="rounded-full bg-white/60 px-3 py-1 text-[12px] font-semibold text-leaf-700">
                  {t(featured.audience)} <span className="font-normal text-ink-400">· {featured.audience.en}</span>
                </span>
              </div>
              <h3 className="mt-3 font-display text-[24px]/[30px] font-bold text-ink-900 lg:text-[28px]/[34px]">
                {t(featured.name)}
              </h3>
              <p className="mt-2 text-[15.5px]/[25px] text-ink-600">
                {t(featured.summary)}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2.5">
                {miniSteps.map((label, i) => (
                  <span key={label} className="glass-inset flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-leaf-700">
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-leaf-600 font-mono text-[11px] font-semibold text-white">
                      {i + 1}
                    </span>
                    {label}
                  </span>
                ))}
              </div>
              <Link
                to="/article"
                className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-leaf-600 px-6 text-[15.5px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(62,107,80,0.55)] transition-all hover:-translate-y-0.5 active:scale-95"
              >
                पूरी गाइड पढ़ें
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </motion.div>
        {/* 3 scheme cards */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="grid gap-4 md:grid-cols-3"
        >
          {rest.map((scheme) => (
            <motion.div key={scheme.id} variants={rise}>
              <SchemeCard scheme={scheme} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
