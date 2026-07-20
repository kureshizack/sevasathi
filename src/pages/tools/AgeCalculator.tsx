import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Cake, CalendarHeart, Copy } from 'lucide-react';
import { MiniChip, ResultWell, StatTile, ToolShell, Tween, toolInputCls, toolLabelCls } from './shared';
import { copyText, inr } from '@/pages/page-utils';
import { useToast } from '@/lib/toast';
import { pop, stagger } from '@/lib/motion';

const HI_WEEKDAYS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

function toISO(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function parseISO(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Exact calendar diff: years / months / days between two dates. */
function diffYMD(from: Date, to: Date) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m -= 1;
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); // days in month before `to`
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return { y, m, d };
}

/** Typewriter: weekday line types in (12ms/char). */
function TypeIn({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(text);
      return;
    }
    setShown('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 12);
    return () => window.clearInterval(id);
  }, [text]);
  return <span>{shown}</span>;
}

/**
 * Tools §5 — Age Calculator: DOB + "as on" date (defaults today; quick
 * chips), 3 stat tiles (Years/Months/Days), total days, next birthday,
 * birth weekday; copy result for forms.
 */
export default function AgeCalculator() {
  const { toast } = useToast();
  const todayISO = useMemo(() => toISO(new Date()), []);
  const [dobISO, setDobISO] = useState('');
  const [asOnISO, setAsOnISO] = useState(todayISO);

  const dob = dobISO ? parseISO(dobISO) : null;
  const asOn = parseISO(asOnISO) ?? new Date();
  const invalid = dob !== null && asOn.getTime() < dob.getTime();

  const calc = useMemo(() => {
    if (!dob || invalid) return null;
    const { y, m, d } = diffYMD(dob, asOn);
    const totalDays = Math.round((asOn.getTime() - dob.getTime()) / 86400000);

    // next birthday relative to as-on date
    let next = new Date(asOn.getFullYear(), dob.getMonth(), dob.getDate());
    if (next.getTime() < asOn.getTime()) next = new Date(asOn.getFullYear() + 1, dob.getMonth(), dob.getDate());
    const daysToBday = Math.round((next.getTime() - asOn.getTime()) / 86400000);

    return { y, m, d, totalDays, daysToBday, weekday: HI_WEEKDAYS[dob.getDay()] };
  }, [dob, invalid, asOn]);

  const copyResult = async () => {
    if (!calc) return;
    const asOnLabel = asOnISO.split('-').reverse().join('/');
    const ok = await copyText(`उम्र (as on ${asOnLabel}): ${calc.y} वर्ष ${calc.m} माह ${calc.d} दिन`);
    if (ok) toast('✓ कॉपी हो गया');
  };

  return (
    <ToolShell
      id="age"
      icon={CalendarHeart}
      tint="amber"
      title={{ hi: 'उम्र कैलकुलेटर', en: 'Age Calculator' }}
      purpose={{ hi: '"Age as on __" — फॉर्म भरने के लिए सटीक उम्र, कॉपी करके सीधे चिपकाएं', en: 'Exact age for form filling' }}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={toolLabelCls} htmlFor="dob">
                जन्म तारीख
              </label>
              <input
                id="dob"
                type="date"
                value={dobISO}
                max={asOnISO}
                onChange={(e) => setDobISO(e.target.value)}
                className={toolInputCls}
              />
            </div>
            <div>
              <label className={toolLabelCls} htmlFor="ason">
                इस तारीख तक उम्र
              </label>
              <input
                id="ason"
                type="date"
                value={asOnISO}
                onChange={(e) => setAsOnISO(e.target.value || todayISO)}
                className={toolInputCls}
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <MiniChip mono active={asOnISO === '2026-08-01'} onClick={() => setAsOnISO('2026-08-01')}>
              01/08/2026
            </MiniChip>
            <MiniChip mono active={asOnISO === '2026-12-31'} onClick={() => setAsOnISO('2026-12-31')}>
              31/12/2026
            </MiniChip>
            <MiniChip active={asOnISO === todayISO} onClick={() => setAsOnISO(todayISO)}>
              आज
            </MiniChip>
          </div>
          <p className="mt-4 text-[13.5px]/[22px] text-ink-400">
            Tip: सरकारी फॉर्म में "Age as on" वाली तारीख ऊपर दूसरे डिब्बे में भरें — उम्र उसी दिन के हिसाब से निकलेगी।
          </p>
        </div>

        <div>
          {invalid && (
            <ResultWell className="text-center text-[14px] font-medium text-terracotta-700">
              जन्म तारीख, "इस तारीख तक" से पहले की होनी चाहिए
            </ResultWell>
          )}
          {!calc && !invalid && (
            <ResultWell className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 text-center">
              <Cake size={26} className="text-amber-600" />
              <p className="text-[14.5px] text-ink-400">जन्म तारीख चुनते ही उम्र यहां दिखेगी</p>
            </ResultWell>
          )}
          {calc && !invalid && (
            <div>
              <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="grid grid-cols-3 gap-3">
                <motion.div variants={pop}>
                  <StatTile label="वर्ष · Years">
                    <Tween value={calc.y} />
                  </StatTile>
                </motion.div>
                <motion.div variants={pop}>
                  <StatTile label="माह · Months">
                    <Tween value={calc.m} />
                  </StatTile>
                </motion.div>
                <motion.div variants={pop}>
                  <StatTile label="दिन · Days">
                    <Tween value={calc.d} />
                  </StatTile>
                </motion.div>
              </motion.div>

              <ResultWell className="mt-3">
                <p className="text-center font-mono text-[20px]/[26px] font-semibold text-terracotta-700">
                  {calc.y} वर्ष {calc.m} माह {calc.d} दिन
                </p>
                <div className="mt-3 flex flex-col gap-1.5 text-[14px] text-ink-600">
                  <p className="flex justify-between gap-2">
                    <span>कुल दिन</span>
                    <span className="font-mono font-semibold text-ink-900">
                      <Tween value={calc.totalDays} format={(n) => inr(Math.round(n))} />
                    </span>
                  </p>
                  <p className="flex justify-between gap-2">
                    <span>अगला जन्मदिन</span>
                    <span className="font-mono font-semibold text-ink-900">
                      {calc.daysToBday === 0 ? 'आज है!' : (
                        <>
                          <Tween value={calc.daysToBday} format={(n) => inr(Math.round(n))} /> दिन बाकी
                        </>
                      )}
                    </span>
                  </p>
                  <p className="flex justify-between gap-2">
                    <span>जन्म दिन</span>
                    <span className="font-semibold text-ink-900">
                      <TypeIn key={dobISO} text={`${calc.weekday} को जन्मे थे`} />
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyResult}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 text-[15px] font-semibold text-white shadow-warm transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Copy size={17} />
                  Copy result — फॉर्म में चिपकाएं
                </button>
              </ResultWell>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
