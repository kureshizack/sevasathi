import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, ArrowRight, Plus } from 'lucide-react';
import {
  schemes,
  schemeAudiencePills,
  schemeAudienceMap,
  schemeGridIds,
  schemeGridMoreIds,
  pmkisanSteps,
  schemeClaimSteps,
  schemesFaqs,
} from '@/lib/data';
import type { Scheme } from '@/lib/data';
import { useSheetSchemes } from '@/lib/sheetData';
import SchemeCard from '@/components/SchemeCard';
import FAQAccordion from '@/components/FAQAccordion';
import SectionHeader from '@/components/SectionHeader';
import CountUp from '@/components/CountUp';
import { useLang } from '@/lib/lang';
import { rise, pop, stagger, viewport15, easeOutExpo } from '@/lib/motion';
import { tintSolidBg } from '@/lib/tints';
import { cn } from '@/lib/utils';

function schemeMatchesQuery(s: Scheme, q: string): boolean {
  if (!q) return true;
  const hay = [s.name.hi, s.name.en, s.benefit, s.audience.hi, s.audience.en, s.summary.hi, s.summary.en]
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

/** Step disc drawn with an SVG stroke (stroke-dashoffset sequence, schemes.md §5). */
function DrawnDisc({ index }: { index: number }) {
  return (
    <span className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 52 52" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          fill="#FDFAF4"
          stroke="#4F8465"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            show: { pathLength: 1, transition: { duration: 0.4, ease: easeOutExpo } },
          }}
        />
      </svg>
      <span className="relative font-display text-[18px] font-bold text-leaf-700">{index + 1}</span>
    </span>
  );
}

/**
 * Govt Schemes hub (design/schemes.md) — benefit-first directory with
 * audience filters, featured PM-KISAN, 9-card grid, 4-step explainer, FAQ.
 */
export default function Schemes() {
  const { t, s } = useLang();
  const [audience, setAudience] = useState('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const schemesById = useMemo(() => new Map(schemes.map((sc) => [sc.id, sc])), []);
  const sheetSchemes = useSheetSchemes(); // daily updates from owner's Google Sheet (Schemes tab)
  const gridPool = useMemo(
    () => [
      ...sheetSchemes,
      ...[...schemeGridIds, ...schemeGridMoreIds]
        .map((id) => schemesById.get(id))
        .filter((sc): sc is Scheme => Boolean(sc)),
    ],
    [schemesById, sheetSchemes]
  );

  const q = query.trim().toLowerCase();
  const filtered = gridPool.filter(
    (sc) => (audience === 'all' || schemeAudienceMap[sc.id] === audience) && schemeMatchesQuery(sc, q)
  );
  const visible = expanded ? filtered : filtered.slice(0, 9);
  const canLoadMore = !expanded && filtered.length > 9;

  return (
    <>
      {/* ---------- Section 1 — Page hero ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 pt-8 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="glass-card glass-tint-leaf relative overflow-hidden p-6 md:p-10"
        >
          <div aria-hidden className="mandala-overlay pointer-events-none absolute inset-0" />
          <div className="relative max-w-[760px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600 md:text-[13px]">
              Sarkari Yojana
            </p>
            <h1 className="mt-2 font-display text-[28px]/[34px] font-bold text-ink-900 md:text-[42px]/[48px]">
              सरकारी योजनाएँ
            </h1>
            <p className="mt-3 text-[16px]/[26px] text-ink-600">
              Central &amp; State schemes — पैसा, राशन, इलाज, छत, छात्रवृत्ति। जानें क्या मिल सकता है आपको।
            </p>
            <p className="mt-1 text-[13.5px]/[20px] text-ink-400">
              Money, ration, healthcare, housing &amp; scholarships — find what you are eligible for.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.2, ease: easeOutExpo }}
              className="glass-inset mt-6 flex h-12 max-w-[560px] items-center gap-2.5 rounded-full px-4"
            >
              <Search size={19} strokeWidth={1.75} className="shrink-0 text-ink-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setExpanded(false);
                }}
                placeholder="लाभ खोजें… e.g. किसान, आवास, pension"
                className="w-full bg-transparent text-[15.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  aria-label="साफ़ करें"
                  onClick={() => setQuery('')}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-white/60 hover:text-ink-900"
                >
                  <X size={15} />
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ---------- Section 2 — Sticky audience FilterPills ---------- */}
      <div className="sticky top-16 z-40 mx-auto mt-6 max-w-[1180px] px-4 md:px-6 lg:px-8">
        <div className="glass-strong rounded-full">
          <div className="scroll-fade-x no-scrollbar flex gap-1.5 overflow-x-auto p-1.5">
            {schemeAudiencePills.map((pill, i) => {
              const active = pill.id === audience;
              return (
                <motion.button
                  key={pill.id}
                  type="button"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: easeOutExpo }}
                  onClick={() => {
                    setAudience(pill.id);
                    setExpanded(false);
                  }}
                  className="relative h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-[13.5px] font-semibold"
                >
                  {active && (
                    <motion.span
                      layoutId="scheme-audience-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className={cn('absolute inset-0 rounded-full shadow-sm', tintSolidBg[pill.tint])}
                    />
                  )}
                  <span className={cn('relative z-10 transition-colors', active ? 'text-white' : 'text-ink-600')}>
                    {pill.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Section 3 — Featured scheme (PM-KISAN) ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport15}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="glass-card glass-tint-leaf overflow-hidden p-6 lg:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-leaf-100 px-3 py-1 text-[12px] font-semibold text-leaf-700">
                  केंद्र योजना <span className="font-normal text-ink-400">· Central</span>
                </span>
                <span className="rounded-full bg-amber-100 px-3.5 py-1 font-mono text-[13px] font-semibold text-amber-600">
                  ₹<CountUp value={6000} />/वर्ष
                </span>
              </div>
              <h3 className="mt-3 font-display text-[24px]/[30px] font-bold text-ink-900 lg:text-[28px]/[34px]">
                PM-KISAN सम्मान निधि
              </h3>
              <p className="mt-2 text-[15.5px]/[26px] text-ink-600">
                देश के सभी छोटे और सीमांत किसानों को हर साल ₹6,000 — ₹2,000 की तीन किस्तें, सीधे बैंक खाते में (DBT)।
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  to="/article"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-leaf-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(62,107,80,0.55)] transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  पूरी गाइड पढ़ें
                  <ArrowRight size={17} />
                </Link>
                <Link to="/article" className="link-underline text-[14.5px]">
                  किस्त स्टेटस कैसे देखें?
                </Link>
              </div>
            </div>
            <motion.ol
              variants={stagger(0.15)}
              initial="hidden"
              whileInView="show"
              viewport={viewport15}
              className="relative flex flex-col gap-3"
            >
              <div aria-hidden className="absolute bottom-5 left-[21px] top-5 border-l-2 border-dashed border-leaf-500/30" />
              {pmkisanSteps.map((step, i) => (
                <motion.li key={i} variants={pop} className="relative flex items-center gap-3">
                  <span className="z-10 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-leaf-600 font-mono text-[15px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="glass-inset w-full rounded-2xl px-4 py-3 text-[14px]/[20px] font-medium text-ink-900">
                    {t(step)}
                    <span className="block text-[12px] font-normal text-ink-400">{s(step)}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </motion.div>
      </section>

      {/* ---------- Section 4 — Schemes grid ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
        <SectionHeader kicker="Benefit First" title={{ hi: 'सभी योजनाएँ', en: 'All Schemes' }} />
        {visible.length === 0 ? (
          <div className="glass-inset rounded-2xl p-6 text-center text-[14px] text-ink-400">
            कुछ नहीं मिला · Nothing found
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((scheme, i) => (
                <motion.div
                  key={`${audience}-${scheme.id}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.15, once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i, 10) * 0.07, ease: easeOutExpo }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                >
                  <SchemeCard scheme={scheme} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        {canLoadMore && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            onClick={() => setExpanded(true)}
            className="glass-card mt-6 flex w-full items-center justify-center gap-2 !rounded-full py-3.5 text-[15.5px] font-semibold text-ink-900 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            और दिखाएं · Load more
            <Plus size={16} className="text-leaf-600" />
          </motion.button>
        )}
      </section>

      {/* ---------- Section 5 — Universal 4-step explainer ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
        <SectionHeader
          kicker="How to Apply"
          title={{ hi: 'योजना का लाभ कैसे उठाएं', en: 'How to claim a scheme' }}
        />
        <motion.div
          variants={stagger(0.2)}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="glass-card p-6 md:p-8"
        >
          <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            <div
              aria-hidden
              className="absolute bottom-6 left-[26px] top-6 border-l-2 border-dashed border-leaf-500/25 lg:bottom-auto lg:left-10 lg:right-10 lg:top-[26px] lg:border-l-0 lg:border-t-2"
            />
            {schemeClaimSteps.map((step, i) => (
              <li key={i} className="relative flex gap-4 lg:flex-col">
                <DrawnDisc index={i} />
                <div>
                  <h3 className="font-display text-[17px]/[24px] font-semibold text-ink-900">
                    {t(step.title)}
                    <span className="block text-[12.5px] font-medium text-ink-400">{s(step.title)}</span>
                  </h3>
                  <p className="mt-1 text-[14px]/[22px] text-ink-600">{t(step.desc)}</p>
                </div>
              </li>
            ))}
          </ol>
          <motion.div variants={pop} className="glass-urgent mt-8 p-5">
            <p className="text-[15px]/[24px] font-medium text-ink-900">
              ⚠ किसी एजेंट को पैसा न दें — सभी योजनाएँ <span className="font-mono">.gov.in</span> पर फ्री हैं।
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------- Section 6 — FAQ ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
        <SectionHeader kicker="FAQ" title={{ hi: 'सवाल-जवाब', en: 'FAQs' }} />
        <motion.div variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={viewport15}>
          <motion.div variants={rise}>
            <FAQAccordion faqs={schemesFaqs} />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
