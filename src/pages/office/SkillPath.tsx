import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Route } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { skillPathStops } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { easeOutExpo, pop, stagger, viewport15 } from '@/lib/motion';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'ss-office-path';

function readDone(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Office §6 — Skill Path (0 → Office Hero): horizontal 5-stop path on lg,
 * vertical rail on mobile. Path line draws (scaleX 0→1, 1s), stops pop
 * stagger 0.15s; checkboxes persist in localStorage; progress bar animates.
 */
export default function SkillPath() {
  const { t } = useLang();
  const [done, setDone] = useState<string[]>(readDone);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      /* private mode */
    }
  }, [done]);

  const toggle = useCallback((id: string) => {
    setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const pct = (done.length / skillPathStops.length) * 100;

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader kicker="SKILL PATH" title={{ hi: '0 → Office Hero', en: 'Zero to Office Hero' }} />

      <div className="glass-card p-5 md:p-8">
        {/* progress header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="icon-disc h-11 w-11 bg-leaf-100">
              <Route size={20} strokeWidth={1.75} className="text-leaf-600" />
            </span>
            <div>
              <p className="font-display text-[17px]/[22px] font-semibold text-ink-900">5 हफ़्ते का रास्ता</p>
              <p className="text-[13px] text-ink-400">Tick करते जाएं — progress इसी डिवाइस पर सहेजी जाती है</p>
            </div>
          </div>
          <p className="font-mono text-[15px] font-semibold text-leaf-600">
            {done.length}/{skillPathStops.length} पूर्ण
          </p>
        </div>

        {/* progress bar */}
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-sand-200">
          <motion.div
            className="h-full rounded-full bg-leaf-600"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
          />
        </div>

        {/* path */}
        <motion.ol
          variants={stagger(0.15, 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="relative mt-8 flex flex-col gap-8 lg:flex-row lg:gap-4"
        >
          {/* connecting line — vertical on mobile (scaleY), horizontal on lg (scaleX); draws 1s */}
          <motion.span
            aria-hidden
            className="absolute left-[23px] top-2 bottom-2 w-0.5 origin-top bg-sand-200 lg:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewport15}
            transition={{ duration: 1, ease: easeOutExpo }}
          />
          <motion.span
            aria-hidden
            className="absolute left-6 right-6 top-[23px] hidden h-0.5 origin-left bg-sand-200 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport15}
            transition={{ duration: 1, ease: easeOutExpo }}
          />

          {skillPathStops.map((stop, i) => {
            const checked = done.includes(stop.id);
            return (
              <motion.li key={stop.id} variants={pop} className="relative flex gap-4 lg:flex-1 lg:flex-col lg:gap-0">
                <div className="relative z-10 flex items-center gap-4 lg:w-full">
                  <span
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[15px] font-semibold transition-colors duration-300',
                      checked ? 'border-leaf-600 bg-leaf-600 text-white' : 'border-sand-200 bg-cream-50 text-ink-400'
                    )}
                  >
                    {checked ? <Check size={20} /> : i + 1}
                  </span>
                  <p className="font-mono text-[12px] font-semibold uppercase tracking-wider text-amber-600 lg:hidden">
                    {stop.week}
                  </p>
                </div>

                <div className="min-w-0 flex-1 lg:mt-4 lg:pr-3">
                  <p className="hidden font-mono text-[12px] font-semibold uppercase tracking-wider text-amber-600 lg:block">
                    {stop.week}
                  </p>
                  <h3 className="mt-0.5 font-display text-[16px]/[22px] font-semibold text-ink-900">{t(stop.title)}</h3>
                  <p className="mt-1 text-[13.5px]/[20px] text-ink-400">{t(stop.desc)}</p>

                  <button
                    type="button"
                    onClick={() => toggle(stop.id)}
                    aria-pressed={checked}
                    className="mt-3 flex min-h-[44px] items-center gap-2.5 text-[14px] font-semibold text-ink-600 active:scale-[0.97]"
                  >
                    <motion.span
                      animate={checked ? { scale: [0.7, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3, ease: easeOutExpo }}
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-200',
                        checked ? 'border-leaf-600 bg-leaf-600 text-white' : 'border-ink-400/50 bg-white/60'
                      )}
                    >
                      {checked && <Check size={14} strokeWidth={3} />}
                    </motion.span>
                    {checked ? 'पूरा हो गया' : 'पूरा करें'}
                  </button>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
