import { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Check, Lightbulb } from 'lucide-react';
import type { Bi } from '@/lib/lang';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { easeOutExpo } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface GuideStep {
  title: Bi;
  desc: Bi;
  tip?: Bi;
}

interface Props {
  steps: GuideStep[];
  /** unique per-article key — progress persists in localStorage */
  storageKey: string;
  className?: string;
}

/** 2px dashed rail segment (sand-200 base / leaf-500 draw overlay). */
const dashed = (color: string) => ({
  backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0 5px, transparent 5px 11px)`,
});

/**
 * StepGuide (design.md §10.10, article.md §6): vertical rail of 32px
 * numbered discs on a 2px dashed line; each step is a glass card with
 * title + description + optional Tip box + circular checkbox.
 * Checking fills the disc leaf-600 with a pop, the `N/7 पूर्ण` progress
 * bar animates width (300ms), progress persists per-article in
 * localStorage, and the leaf rail draws scaleY on scroll (scrub).
 */
export default function StepGuide({ steps, storageKey, className }: Props) {
  const { t } = useLang();
  const { toast } = useToast();
  const key = `ss-steps:${storageKey}`;

  const [done, setDone] = useState<boolean[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const arr: unknown = JSON.parse(raw);
        if (Array.isArray(arr)) return steps.map((_, i) => arr[i] === true);
      }
    } catch {
      /* private mode / corrupt value */
    }
    return steps.map(() => false);
  });

  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.78', 'end 0.6'],
  });
  const railDraw = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const doneCount = done.filter(Boolean).length;
  const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  const toggle = (i: number) => {
    const next = done.map((v, idx) => (idx === i ? !v : v));
    setDone(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* private mode */
    }
    const nextCount = next.filter(Boolean).length;
    if (nextCount === next.length && doneCount !== next.length) {
      toast('✓ पूरा हो गया — शाबाश!');
    }
  };

  return (
    <div className={className}>
      {/* Progress header — `N/7 पूर्ण` + animated bar */}
      <div className="glass-card mb-6 p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-display text-[15px] font-semibold text-ink-900">
            आपकी प्रगति
            <span className="ml-1.5 text-[12px] font-medium text-ink-400">Progress</span>
          </span>
          <span className="font-mono text-[14px] font-semibold text-leaf-600">
            {doneCount}/{steps.length} <span className="font-sans font-semibold">पूर्ण</span>
          </span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-sand-200">
          <div
            className="h-full rounded-full bg-leaf-600 transition-[width] duration-300 ease-out-expo"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Rail */}
      <ol ref={listRef} className="relative">
        {/* base dashed line (sand-200) */}
        <span
          aria-hidden
          className="absolute bottom-5 left-[15px] top-5 w-[2px]"
          style={dashed('#F2E9D8')}
        />
        {/* leaf-500 overlay draws scaleY with scroll (scrub) */}
        <motion.span
          aria-hidden
          className="absolute bottom-5 left-[15px] top-5 w-[2px] origin-top"
          style={{ ...dashed('#4F8465'), scaleY: railDraw }}
        />
        {steps.map((step, i) => {
          const isDone = done[i];
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.15, once: true }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="relative flex gap-3.5 pb-5 last:pb-0 md:gap-5"
            >
              {/* numbered disc */}
              <motion.span
                key={isDone ? 'done' : 'open'}
                initial={{ scale: 0.5, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold transition-colors duration-200',
                  isDone ? 'bg-leaf-600 text-white' : 'border border-black/5 bg-sand-200 text-ink-600'
                )}
              >
                {isDone ? <Check size={15} strokeWidth={3} /> : i + 1}
              </motion.span>

              {/* step card */}
              <div className="glass-card flex min-w-0 flex-1 items-start gap-2 p-4 md:p-5">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[16.5px]/[22px] font-semibold text-ink-900">
                    {t(step.title)}
                  </h3>
                  <p className="mt-1.5 text-[15px]/[24px] text-ink-600">{t(step.desc)}</p>
                  {step.tip && (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-500/25 bg-amber-100/70 p-3">
                      <Lightbulb size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-amber-600" />
                      <p className="text-[13.5px]/[20px] font-medium text-ink-600">
                        <span className="font-semibold text-amber-600">Tip: </span>
                        {t(step.tip)}
                      </p>
                    </div>
                  )}
                </div>
                {/* circular checkbox (40px tap area) */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={isDone}
                  aria-label={`${t({ hi: 'स्टेप', en: 'Step' })} ${i + 1}`}
                  className="-mr-1.5 -mt-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-100 active:scale-90"
                >
                  <motion.span
                    animate={isDone ? { scale: [0.7, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3, ease: easeOutExpo }}
                    className={cn(
                      'flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 transition-colors duration-200',
                      isDone
                        ? 'border-leaf-600 bg-leaf-600 text-white'
                        : 'border-ink-400/50 bg-white/60 text-transparent hover:border-leaf-500'
                    )}
                  >
                    <Check size={13} strokeWidth={3.5} />
                  </motion.span>
                </button>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
