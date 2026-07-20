import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Lightbulb,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import FAQAccordion from '@/components/FAQAccordion';
import { hackCategoryMeta, lifeHacks, lifehacksFaqs, upiRules, weeklyTips } from '@/lib/data';
import type { HackCategory } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { easeOutExpo, pop, rise, stagger, viewport15 } from '@/lib/motion';
import { tintDiscBg, tintGlass, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

type HackFilter = HackCategory | 'all';

const slideX: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: easeOutExpo } },
};

/* ------------------------------------------------------------------ */
/* §1 — Page Hero (compact glass, rose tint, mandala)                  */
/* ------------------------------------------------------------------ */

function LifeHero() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 pt-8 md:px-6 lg:px-8">
      <motion.div
        variants={stagger(0.07)}
        initial="hidden"
        animate="show"
        className="glass-card glass-tint-rose relative overflow-hidden p-6 md:p-10"
      >
        <div className="mandala-overlay pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">
          <motion.p
            variants={rise}
            className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600 md:text-[13px]"
          >
            Life Hacks
          </motion.p>
          <motion.h1 variants={rise} className="mt-2 text-[28px]/[34px] font-bold md:text-[42px]/[48px]">
            लाइफ हैक्स व डिजिटल सुरक्षा
            <span className="mt-1 block font-sans text-[15px]/[22px] font-medium tracking-normal text-ink-400 md:text-[17px]/[24px]">
              Life Hacks &amp; Digital Safety
            </span>
          </motion.h1>
          <motion.p variants={rise} className="mt-3 max-w-[560px] text-[15px]/[24px] text-ink-600 md:text-[17px]/[28px]">
            फ्रॉड से बचाव, पैसे की बचत, फोन और यात्रा के समझदारी भरे टिप्स — आसान भाषा में।
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §2 — Safety Alert band (tap-to-call 1930)                           */
/* ------------------------------------------------------------------ */

function SafetyBand() {
  const [called, setCalled] = useState(false);
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-6 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
        className="glass-urgent p-5 md:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <span className="icon-disc h-12 w-12 bg-rose-100">
            <ShieldAlert size={22} strokeWidth={1.75} className="text-rose-500" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[19px]/[26px] font-semibold text-ink-900">
              साइबर फ्रॉड? तुरंत 1930 पर कॉल करें
            </h2>
            <p className="mt-1 text-[14px]/[21px] text-ink-600">
              पैसा कटते ही 2 घंटे के अंदर रिपोर्ट करें — पैसा वापस मिलने की संभावना सबसे ज्यादा।
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <motion.a
              href="tel:1930"
              onClick={() => setCalled(true)}
              animate={called ? { scale: 1 } : { scale: [1, 1.05, 1] }}
              transition={called ? { duration: 0.2 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-terracotta-700 px-5 text-white shadow-warm active:scale-95"
              aria-label="1930 पर कॉल करें · Call 1930 cyber fraud helpline"
            >
              <Phone size={17} strokeWidth={2} />
              <span className="font-mono text-[17px] font-bold">1930</span>
              <span className="text-[12.5px] font-semibold text-white/85">कॉल करें</span>
            </motion.a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="glass-card inline-flex h-12 items-center gap-1.5 !rounded-full px-5 text-[14.5px] font-semibold text-ink-900 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              cybercrime.gov.in
              <ExternalLink size={15} className="text-terracotta-600" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §3 — Category FilterPills (sticky, per-tint, layoutId spring)       */
/* ------------------------------------------------------------------ */

const pillOrder: HackFilter[] = ['all', 'safety', 'money', 'phone', 'travel', 'govt'];

const pillActiveBg: Record<HackFilter, string> = {
  all: 'bg-terracotta-600',
  safety: 'bg-rose-500',
  money: 'bg-leaf-600',
  phone: 'bg-cocoa-500',
  travel: 'bg-amber-600',
  govt: 'bg-terracotta-600',
};

function HackPills({ active, onChange }: { active: HackFilter; onChange: (f: HackFilter) => void }) {
  const { t, s } = useLang();
  return (
    <div className="sticky top-16 z-30 mx-auto max-w-[1180px] px-4 pt-1 md:px-6 lg:px-8">
      <motion.div
        variants={stagger(0.04)}
        initial="hidden"
        animate="show"
        className="scroll-fade-x no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
      >
        <div className="glass-strong flex w-max gap-1 rounded-full p-1.5">
          {pillOrder.map((id) => {
            const isActive = id === active;
            const label = id === 'all' ? `${t({ hi: 'सभी', en: 'All' })} ${s({ hi: 'सभी', en: 'All' })}` : `${t(hackCategoryMeta[id].label)} ${s(hackCategoryMeta[id].label)}`;
            return (
              <motion.button
                key={id}
                variants={slideX}
                type="button"
                onClick={() => onChange(id)}
                className={cn(
                  'relative flex h-10 shrink-0 items-center rounded-full px-4 text-[14px] font-semibold transition-colors duration-200 active:scale-95',
                  isActive ? 'text-white' : 'text-ink-600 hover:text-terracotta-600'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="hack-pill-active"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className={cn('absolute inset-0 rounded-full shadow-warm', pillActiveBg[id])}
                  />
                )}
                <span className="relative">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* §4 — Featured hack: UPI fraud 7 golden rules checklist              */
/* ------------------------------------------------------------------ */

const UPI_STORAGE_KEY = 'ss-upi-rules';

function readUpiChecks(): boolean[] {
  try {
    const raw = localStorage.getItem(UPI_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === upiRules.length) {
        return parsed.map(Boolean);
      }
    }
  } catch {
    /* private mode */
  }
  return Array(upiRules.length).fill(false);
}

function FeaturedUpi() {
  const { t } = useLang();
  const [checks, setChecks] = useState<boolean[]>(readUpiChecks);
  const done = checks.filter(Boolean).length;
  const allDone = done === upiRules.length;

  const toggle = (i: number) => {
    setChecks((prev) => {
      const next = prev.map((c, j) => (j === i ? !c : c));
      try {
        localStorage.setItem(UPI_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* private mode */
      }
      return next;
    });
  };

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={viewport15}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="glass-card glass-tint-rose p-6 md:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          {/* left content */}
          <div>
            <span className="icon-disc h-12 w-12 bg-rose-100">
              <ShieldAlert size={21} strokeWidth={1.75} className="text-rose-500" />
            </span>
            <h2 className="mt-4 font-display text-[23px]/[30px] font-semibold text-ink-900">
              UPI फ्रॉड से बचें — 7 गोल्डन रूल्स
              <span className="mt-1 block font-sans text-[13px] font-medium text-ink-400">
                7 golden rules to beat UPI fraud
              </span>
            </h2>
            <p className="mt-3 text-[15px]/[24px] text-ink-600">
              हर महीने लाखों लोग UPI फ्रॉड में पैसा खोते हैं। ये 7 आदतें आपको 99% फ्रॉड से बचाएंगी।
            </p>
            <p className="mt-3 text-[14px]/[21px] text-ink-400">
              Tick each rule you already follow — आपकी progress इसी डिवाइस पर सहेजी जाती है।
            </p>
            <Link
              to="/article"
              className="group mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-terracotta-600"
            >
              पूरी गाइड पढ़ें
              <ArrowRight size={16} className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
            </Link>
          </div>

          {/* right: interactive checklist */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-ink-900">
                {done}/{upiRules.length} {t({ hi: 'पूर्ण', en: 'done' })}
              </span>
              <span className="text-[12.5px] font-medium text-ink-400">
                {t({ hi: 'सभी 7 अपनाएं', en: 'Adopt all 7' })}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/60">
              <motion.div
                className={cn('h-full rounded-full', allDone ? 'bg-leaf-600' : 'bg-leaf-500')}
                initial={false}
                animate={{ width: `${(done / upiRules.length) * 100}%` }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              />
            </div>

            <motion.ul
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={viewport15}
              className="mt-4 flex flex-col gap-2.5"
            >
              {upiRules.map((rule, i) => {
                const checked = checks[i];
                return (
                  <motion.li key={i} variants={pop}>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-pressed={checked}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 active:scale-[0.98]',
                        checked ? 'bg-leaf-100/70' : 'bg-white/45 hover:bg-white/65'
                      )}
                    >
                      <span
                        className={cn(
                          'icon-disc h-7 w-7 rounded-full border-2 transition-colors duration-200',
                          checked ? 'border-leaf-600 bg-leaf-600' : 'border-ink-400/40 bg-white/60'
                        )}
                      >
                        <AnimatePresence>
                          {checked && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ duration: 0.2, ease: easeOutExpo }}
                            >
                              <Check size={15} strokeWidth={3} className="text-white" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="shrink-0 font-mono text-[12px] font-semibold text-ink-400">{i + 1}.</span>
                      <span
                        className={cn(
                          'text-[15px]/[22px] font-medium transition-colors',
                          checked ? 'text-ink-400 line-through' : 'text-ink-900'
                        )}
                      >
                        {t(rule)}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>

            <AnimatePresence>
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                  className="mt-4 flex items-center gap-2 rounded-2xl bg-leaf-100 px-4 py-3 text-[15px] font-semibold text-leaf-700"
                >
                  <CheckCircle2 size={19} strokeWidth={2} />
                  बधाई — आप सुरक्षित हैं
                  <span className="font-medium text-leaf-600/70">· You are safe</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §5 — Hacks grid (filterable guide cards)                            */
/* ------------------------------------------------------------------ */

function HacksGrid({ active }: { active: HackFilter }) {
  const { t, s } = useLang();
  const list = lifeHacks.filter((h) => active === 'all' || h.category === active);

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader kicker="Guides" title={{ hi: 'सभी हैक्स व गाइड', en: 'All Hacks & Guides' }} />
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={stagger(active === 'all' ? 0.07 : 0.05)}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((h) => {
            const Icon = h.icon;
            const meta = hackCategoryMeta[h.category];
            return (
              <motion.div key={h.id} variants={rise} whileTap={{ scale: 0.97 }} className="h-full">
                <Link
                  to="/article"
                  className={cn(
                    'glass-card group flex h-full flex-col gap-3 p-5 transition-all lg:hover:-translate-y-1 lg:hover:shadow-lg',
                    tintGlass[h.tint]
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('icon-disc h-12 w-12', tintDiscBg[h.tint])}>
                      <Icon size={21} strokeWidth={1.75} className={tintIcon[h.tint]} />
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 text-[11.5px] font-semibold text-ink-600">
                      <Clock size={12} />
                      {h.readTime}
                    </span>
                  </div>
                  <span className={cn('w-fit rounded-full bg-white/60 px-3 py-1 text-[12px] font-semibold', tintIcon[h.tint])}>
                    {t(meta.label)}
                    <span className="font-normal text-ink-400"> · {s(meta.label)}</span>
                  </span>
                  <h3 className="font-display text-[17px]/[23px] font-semibold text-ink-900">{t(h.title)}</h3>
                  <p className="text-[14px]/[21px] text-ink-600">{t(h.line)}</p>
                  <span className="mt-auto flex items-center justify-between pt-1 text-[13.5px] font-semibold text-terracotta-600">
                    पढ़ें <span className="font-normal text-ink-400">· Read</span>
                    <ChevronRight
                      size={16}
                      className="text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-terracotta-600"
                    />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §6 — Weekly tip spotlight (auto-rotating)                           */
/* ------------------------------------------------------------------ */

function WeeklyTip() {
  const { t, s } = useLang();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % weeklyTips.length), 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section className="mx-auto max-w-[1180px] px-4 pb-14 md:px-6 lg:px-8">
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        className="glass-card glass-tint-amber p-6 md:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="icon-disc h-11 w-11 bg-amber-100">
            <Lightbulb size={20} strokeWidth={1.75} className="text-amber-600" />
          </span>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600 md:text-[13px]">
            इस हफ्ते का टिप · {s({ hi: 'इस हफ्ते का टिप', en: 'Tip of the week' })}
          </p>
        </div>
        <div className="mt-4 flex min-h-[62px] items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="font-display text-[19px]/[28px] font-semibold text-ink-900 md:text-[22px]/[30px]"
            >
              {t(weeklyTips[idx])}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {weeklyTips.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Tip ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300 ease-out-expo',
                i === idx ? 'w-6 bg-terracotta-600' : 'w-2 bg-ink-400/30 hover:bg-ink-400/50'
              )}
            />
          ))}
          <span className="ml-auto font-mono text-[11.5px] font-medium text-ink-400">
            {idx + 1}/{weeklyTips.length}
          </span>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* §7 — FAQ                                                            */
/* ------------------------------------------------------------------ */

function LifeFaq() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 pb-14 md:px-6 lg:px-8">
      <SectionHeader kicker="FAQ" title={{ hi: 'अक्सर पूछे सवाल', en: 'Common Questions' }} />
      <motion.div variants={rise} initial="hidden" whileInView="show" viewport={viewport15}>
        <FAQAccordion faqs={lifehacksFaqs} />
      </motion.div>
    </section>
  );
}

/**
 * Life Hacks & Digital Safety (design/lifehacks.md).
 */
export default function LifeHacks() {
  const [filter, setFilter] = useState<HackFilter>('all');
  return (
    <>
      <LifeHero />
      <SafetyBand />
      <HackPills active={filter} onChange={setFilter} />
      <FeaturedUpi />
      <HacksGrid active={filter} />
      <WeeklyTip />
      <LifeFaq />
    </>
  );
}
