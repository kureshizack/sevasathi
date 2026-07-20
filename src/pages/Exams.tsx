import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink, FileCheck2, GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import FilterPills from '@/components/FilterPills';
import DeadlineBadge from '@/components/DeadlineBadge';
import CountUp from '@/components/CountUp';
import FAQAccordion from '@/components/FAQAccordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  boards,
  examCalendar,
  examsFaqs,
  examsLatestResults,
  prepTiles,
  scholarshipFilters,
  scholarships,
} from '@/lib/data';
import type { ExamEvent, ScholarshipFilter } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { easeOutExpo, pop, rise, stagger, viewport15 } from '@/lib/motion';
import { tintDiscBg, tintGlass, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* §1 — Page Hero (compact glass, cocoa tint, mandala)                 */
/* ------------------------------------------------------------------ */

const heroChips = [
  { label: { hi: 'रिज़ल्ट लिंक', en: 'Result links' }, value: 28, suffix: '' },
  { label: { hi: 'आगामी परीक्षाएँ', en: 'Upcoming exams' }, value: 14, suffix: '' },
  { label: { hi: 'छात्रवृत्तियाँ', en: 'Scholarships' }, value: 45, suffix: '+' },
];

function ExamsHero() {
  const { t, s } = useLang();
  return (
    <section className="mx-auto max-w-[1180px] px-4 pt-8 md:px-6 lg:px-8">
      <motion.div
        variants={stagger(0.07)}
        initial="hidden"
        animate="show"
        className="glass-card glass-tint-cocoa relative overflow-hidden p-6 md:p-10"
      >
        <div className="mandala-overlay pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">
          <motion.p
            variants={rise}
            className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600 md:text-[13px]"
          >
            Exams &amp; Results
          </motion.p>
          <motion.h1 variants={rise} className="mt-2 text-[28px]/[34px] font-bold md:text-[42px]/[48px]">
            परीक्षा, रिज़ल्ट व छात्रवृत्ति
            <span className="mt-1 block font-sans text-[15px]/[22px] font-medium tracking-normal text-ink-400 md:text-[17px]/[24px]">
              Exams, Board Results &amp; Scholarships
            </span>
          </motion.h1>
          <motion.p variants={rise} className="mt-3 max-w-[560px] text-[15px]/[24px] text-ink-600 md:text-[17px]/[28px]">
            Board results, exam calendar, scholarships — students की पूरी तैयारी की जगह।
          </motion.p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {heroChips.map((chip) => (
              <motion.span
                key={chip.label.en}
                variants={pop}
                className="glass-inset flex items-baseline gap-2 rounded-full px-4 py-2"
              >
                <span className="text-[13.5px] font-semibold text-ink-900">
                  {t(chip.label)}
                  <span className="font-medium text-ink-400"> · {s(chip.label)}</span>
                </span>
                <span className="font-mono text-[17px] font-semibold text-cocoa-500">
                  <CountUp value={chip.value} />
                  {chip.suffix}
                </span>
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §2 — Result Finder (interactive two-step form)                      */
/* ------------------------------------------------------------------ */

function OfficialBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-leaf-100 px-2.5 py-0.5 text-[11.5px] font-bold text-leaf-700">
      Official <ExternalLink size={11} strokeWidth={2.5} />
    </span>
  );
}

function ResultFinder() {
  const { t } = useLang();
  const [boardId, setBoardId] = useState('');
  const [klass, setKlass] = useState<'10' | '12' | ''>('');
  const board = boards.find((b) => b.id === boardId);
  const ready = Boolean(board && klass);

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 lg:px-8">
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="glass-card glass-tint-leaf p-6 md:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="icon-disc h-12 w-12 bg-leaf-100">
            <GraduationCap size={21} strokeWidth={1.75} className="text-leaf-600" />
          </span>
          <div>
            <h2 className="font-display text-[21px]/[28px] font-semibold text-ink-900">
              रिज़ल्ट खोजें <span className="text-[14px] font-medium text-ink-400">· Result Finder</span>
            </h2>
            <p className="text-[13px] text-ink-400">Board + class चुनें, official link तुरंत पाएं</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[1.2fr_1fr_auto] md:items-end">
          {/* Step 1 — board */}
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-ink-900">
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-leaf-600 font-mono text-[11px] font-bold text-white">1</span>
              बोर्ड चुनें <span className="font-medium text-ink-400">· Choose board</span>
            </label>
            <Select value={boardId} onValueChange={(v) => setBoardId(v)}>
              <SelectTrigger className="glass-inset h-12 w-full !rounded-2xl border-black/5 px-4 text-[15px] font-medium text-ink-900 shadow-none">
                <SelectValue placeholder="बोर्ड चुनें…" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/70 bg-[#FBF6EA]/95 backdrop-blur-xl">
                {boards.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-[15px]">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2 — class */}
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-ink-900">
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-leaf-600 font-mono text-[11px] font-bold text-white">2</span>
              कक्षा चुनें <span className="font-medium text-ink-400">· Choose class</span>
            </label>
            <div className="flex gap-2">
              {(['10', '12'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKlass(k)}
                  className={cn(
                    'flex h-12 flex-1 items-center justify-center rounded-full text-[15px] font-semibold transition-all duration-200 active:scale-95 md:flex-none md:px-6',
                    klass === k ? 'bg-leaf-600 text-white shadow-warm' : 'glass-card !rounded-full text-ink-600 hover:text-leaf-600'
                  )}
                >
                  {k === '10' ? '10वीं' : '12वीं'}
                  <span className={cn('ml-1.5 text-[11.5px] font-medium', klass === k ? 'text-white/80' : 'text-ink-400')}>
                    {k}th
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            animate={ready ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
          >
            {ready ? (
              <Link
                to="/article"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 text-[15px] font-semibold text-white shadow-warm transition-all hover:-translate-y-0.5 active:scale-95 md:w-auto"
              >
                रिज़ल्ट लिंक देखें
                <ArrowRight size={17} />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-leaf-600/40 px-6 text-[15px] font-semibold text-white/90 md:w-auto"
              >
                रिज़ल्ट लिंक देखें
                <ArrowRight size={17} />
              </button>
            )}
          </motion.div>
        </div>

        {/* live result note card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={ready ? `${board!.id}-${klass}` : 'empty'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="glass-inset mt-6 p-4 md:p-5"
          >
            {ready && board ? (
              <div>
                <p className="flex flex-wrap items-center gap-2 text-[15.5px]/[23px] font-semibold text-ink-900">
                  {board.name} {klass === '10' ? '10th' : '12th'} Result 2026
                  <OfficialBadge />
                </p>
                <p className="mt-1.5 text-[14px]/[21px] text-ink-600">
                  घोषित: <span className="font-mono font-medium">{klass === '10' ? board.declared10 : board.declared12}</span>
                  {' · '}Official:{' '}
                  <a
                    href={`https://${board.site}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-terracotta-600 underline decoration-terracotta-600/40 underline-offset-2"
                  >
                    {board.site} ↗
                  </a>
                  {' · '}
                  {t(board.keep)}
                </p>
                <Link
                  to="/article"
                  className="group mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-leaf-600"
                >
                  गाइड: रिज़ल्ट कैसे चेक करें
                  <ArrowRight size={15} className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <p className="text-[14.5px]/[22px] text-ink-600">
                ऊपर बोर्ड और कक्षा चुनें — रिज़ल्ट लिंक यहीं दिखेगा।{' '}
                <span className="text-ink-400">· Pick your board &amp; class above to see the result link here.</span>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §3 — Latest Results (लेटेस्ट रिज़ल्ट)                                */
/* ------------------------------------------------------------------ */

function LatestResults() {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader kicker="Latest Results" title={{ hi: 'लेटेस्ट रिज़ल्ट', en: 'Latest Results' }} />
      <motion.div
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="grid gap-3 md:grid-cols-2"
      >
        {examsLatestResults.map((r) => (
          <motion.div key={r.id} variants={rise}>
            <Link
              to="/article"
              className="glass-card group flex items-center gap-3 p-4 transition-all lg:hover:-translate-y-0.5 lg:hover:shadow-lg"
            >
              <span className="icon-disc h-11 w-11 bg-amber-100">
                <FileCheck2 size={19} strokeWidth={1.75} className="text-amber-600" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-semibold text-ink-900">{r.title}</span>
                  {r.isNew && (
                    <motion.span
                      variants={pop}
                      className="shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white"
                    >
                      NEW
                    </motion.span>
                  )}
                </span>
                <span className="font-mono text-[12px] text-ink-400">{r.date} 2026</span>
              </span>
              <span className="flex shrink-0 items-center gap-0.5 text-[13.5px] font-semibold text-terracotta-600">
                {t(r.cta)}
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §4 — Exam Calendar (GSAP timeline — dedicated, GSAP-only)           */
/* ------------------------------------------------------------------ */

type CalItem =
  | { type: 'month'; key: string; label: string }
  | { type: 'event'; key: string; ev: ExamEvent };

function buildCalItems(): CalItem[] {
  const items: CalItem[] = [];
  examCalendar.forEach((ev, i) => {
    if (i === 0 || examCalendar[i - 1].month !== ev.month) {
      items.push({ type: 'month', key: `m-${ev.month}`, label: ev.month });
    }
    items.push({ type: 'event', key: ev.id, ev });
  });
  return items;
}

function ExamCalendar() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set('.timeline-line', { scaleY: 1 });
        return;
      }
      // timeline line draws downward, scrubbed on scroll
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.timeline-wrap', start: 'top 78%', end: 'bottom 60%', scrub: 0.4 },
        }
      );
      // each card pops as the line reaches it
      gsap.utils.toArray<HTMLElement>('.cal-card').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const items = buildCalItems();

  return (
    <section ref={rootRef} className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader kicker="Exam Calendar" title={{ hi: 'आगामी परीक्षाएँ', en: 'Upcoming Exams' }} />

      {/* vertical timeline (mobile) */}
      <div className="timeline-wrap relative pl-8 lg:hidden">
        <div className="absolute bottom-2 left-[11px] top-2 w-[2px] rounded-full bg-sand-200" aria-hidden />
        <div
          className="timeline-line absolute bottom-2 left-[11px] top-2 w-[2px] origin-top rounded-full bg-cocoa-500"
          style={{ transform: 'scaleY(0)' }}
          aria-hidden
        />
        <ul className="flex flex-col gap-3.5">
          {items.map((item) =>
            item.type === 'month' ? (
              <li key={item.key} className="cal-card relative pt-2">
                <span className="absolute -left-[26px] top-[14px] h-3 w-3 rounded-full bg-cocoa-500 ring-4 ring-cream-100" aria-hidden />
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-cocoa-500">{item.label}</p>
              </li>
            ) : (
              <li key={item.key} className="cal-card relative">
                <span className="absolute -left-[26px] top-6 h-3 w-3 rounded-full bg-white ring-2 ring-cocoa-500" aria-hidden />
                <div className="glass-card flex flex-wrap items-center gap-x-3 gap-y-2 p-4">
                  <span className="rounded-lg bg-cocoa-100 px-2.5 py-1 font-mono text-[13px] font-semibold text-cocoa-500">
                    {item.ev.date}
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] font-semibold text-ink-900">{item.ev.title}</span>
                  <Link
                    to="/article"
                    className="group inline-flex shrink-0 items-center gap-0.5 text-[13px] font-semibold text-terracotta-600"
                  >
                    Syllabus/Pattern
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </li>
            )
          )}
        </ul>
      </div>

      {/* horizontal scroll cards (lg) */}
      <div className="scroll-fade-x no-scrollbar -mx-4 hidden overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:px-0">
        <div className="flex w-max gap-4">
          {examCalendar.map((ev, i) => {
            const newMonth = i === 0 || examCalendar[i - 1].month !== ev.month;
            return (
              <div key={ev.id} className="cal-card w-[260px] shrink-0">
                <p
                  className={cn(
                    'mb-2 text-[12px] font-semibold uppercase tracking-[0.14em]',
                    newMonth ? 'text-cocoa-500' : 'invisible'
                  )}
                >
                  {ev.month}
                </p>
                <div className="glass-card flex h-[calc(100%-28px)] flex-col gap-3 p-5">
                  <span className="w-fit rounded-lg bg-cocoa-100 px-2.5 py-1 font-mono text-[13px] font-semibold text-cocoa-500">
                    {ev.date}
                  </span>
                  <h3 className="font-display text-[17px]/[23px] font-semibold text-ink-900">{ev.title}</h3>
                  <Link
                    to="/article"
                    className="group mt-auto inline-flex items-center gap-1 pt-1 text-[13.5px] font-semibold text-terracotta-600"
                  >
                    Syllabus/Pattern
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §5 — Scholarships (filterable grid)                                 */
/* ------------------------------------------------------------------ */

function Scholarships() {
  const [filter, setFilter] = useState<'all' | ScholarshipFilter>('all');
  const list = scholarships.filter((s) => filter === 'all' || s.filter === filter);

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8 lg:py-20">
      <SectionHeader kicker="Scholarships" title={{ hi: 'छात्रवृत्ति', en: 'Scholarships' }}>
        <FilterPills
          pills={scholarshipFilters}
          active={filter}
          onChange={(id) => setFilter(id as 'all' | ScholarshipFilter)}
        />
      </SectionHeader>
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          variants={stagger(0.07)}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((sch) => (
            <motion.div key={sch.id} variants={rise} whileTap={{ scale: 0.97 }} className="h-full">
              <div className={cn('glass-card flex h-full flex-col p-5', tintGlass[sch.tint])}>
                <span className="w-fit rounded-full bg-amber-100 px-3 py-1 font-mono text-[12.5px] font-semibold text-amber-600">
                  {sch.amount}
                </span>
                <h3 className="mt-3 font-display text-[18px]/[24px] font-semibold text-ink-900">{sch.name}</h3>
                <p className="mt-1.5 text-[14px]/[21px] text-ink-600">{sch.eligibility}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 pt-4">
                  {sch.lastDate ? (
                    <DeadlineBadge lastDate={sch.lastDate} />
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 text-[12.5px] font-semibold text-ink-600">
                      {sch.lastLabel}
                    </span>
                  )}
                  <Link
                    to="/article"
                    className="group inline-flex items-center gap-1 text-[14px] font-semibold text-terracotta-600"
                  >
                    आवेदन गाइड
                    <ArrowRight size={15} className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §6 — Prep corner (तैयारी की जगह)                                     */
/* ------------------------------------------------------------------ */

function PrepCorner() {
  const { t, s } = useLang();
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 lg:px-8">
      <SectionHeader kicker="Prep Corner" title={{ hi: 'तैयारी की जगह', en: 'Prep Corner' }} />
      <motion.div
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {prepTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <motion.div key={tile.id} variants={pop}>
              <Link
                to="/article"
                className="glass-card group flex h-full flex-col gap-2.5 p-5 transition-all lg:hover:-translate-y-1 lg:hover:shadow-lg"
              >
                <span className={cn('icon-disc h-12 w-12', tintDiscBg[tile.tint])}>
                  <Icon size={21} strokeWidth={1.75} className={tintIcon[tile.tint]} />
                </span>
                <h3 className="font-display text-[16.5px]/[22px] font-semibold text-ink-900">
                  {t(tile.title)}
                  <span className="block font-sans text-[12px] font-medium text-ink-400">{s(tile.title)}</span>
                </h3>
                <span className="mt-auto pt-1 text-[13.5px] font-semibold text-terracotta-600">
                  खोलें <span className="font-normal text-ink-400">· Open</span> →
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §7 — FAQ                                                            */
/* ------------------------------------------------------------------ */

function ExamsFaq() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader kicker="FAQ" title={{ hi: 'अक्सर पूछे सवाल', en: 'Common Questions' }} />
      <motion.div variants={rise} initial="hidden" whileInView="show" viewport={viewport15}>
        <FAQAccordion faqs={examsFaqs} />
      </motion.div>
    </section>
  );
}

/**
 * Exams, Board Results & Scholarships hub (design/exams.md).
 */
export default function Exams() {
  return (
    <>
      <ExamsHero />
      <ResultFinder />
      <LatestResults />
      <ExamCalendar />
      <Scholarships />
      <PrepCorner />
      <ExamsFaq />
    </>
  );
}
