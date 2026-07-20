import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { History, Percent } from 'lucide-react';
import { MiniChip, ResultWell, ToolShell, toolInputCls, toolLabelCls } from './shared';
import { easeOutExpo } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Mode = 'marks' | 'of' | 'cgpa';

interface HistoryItem {
  id: number;
  label: string;
  mode: Mode;
  values: { a: string; b: string };
}

let hid = 1;

const modes: { id: Mode; label: string }[] = [
  { id: 'marks', label: 'Marks %' },
  { id: 'of', label: 'X% of Y' },
  { id: 'cgpa', label: 'CGPA → %' },
];

function fmt(n: number): string {
  const r = Math.round(n * 100) / 100;
  return r.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

/**
 * Tools §6 — Percentage Calculator: 3 mode pills (Marks % / X% of Y /
 * CGPA↔%), live results while typing, division chip, history strip (last 5).
 */
export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('marks');
  // shared two-field state per mode (a/b)
  const [marks, setMarks] = useState({ a: '', b: '' }); // obtained / total
  const [of, setOf] = useState({ a: '', b: '' }); // x% / of y
  const [cgpa, setCgpa] = useState({ a: '', b: '9.5' }); // value / multiplier
  const [cgpaReverse, setCgpaReverse] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const result = useMemo((): { big: string; sub?: string; chip?: { label: string; cls: string } } | null => {
    if (mode === 'marks') {
      const o = parseFloat(marks.a);
      const t = parseFloat(marks.b);
      if (!(o >= 0) || !(t > 0) || o > t) return null;
      const pct = (o / t) * 100;
      const chip =
        pct >= 60
          ? { label: 'First Division', cls: 'bg-leaf-100 text-leaf-700' }
          : pct >= 45
            ? { label: 'Second Division', cls: 'bg-amber-100 text-amber-600' }
            : pct >= 33
              ? { label: 'Third Division', cls: 'bg-terracotta-100 text-terracotta-700' }
              : { label: '33% से कम', cls: 'bg-rose-100 text-rose-500' };
      return { big: `${fmt(pct)}%`, sub: `${fmt(o)} / ${fmt(t)} अंक`, chip };
    }
    if (mode === 'of') {
      const x = parseFloat(of.a);
      const y = parseFloat(of.b);
      if (!(x >= 0) || !(y >= 0)) return null;
      return { big: fmt((x / 100) * y), sub: `${fmt(x)}% of ${fmt(y)}` };
    }
    // cgpa
    const v = parseFloat(cgpa.a);
    const mult = parseFloat(cgpa.b) || 9.5;
    if (!(v >= 0)) return null;
    if (cgpaReverse) {
      return { big: fmt(v / mult), sub: `${fmt(v)}% ÷ ${fmt(mult)} = CGPA` };
    }
    if (v > 10) return null;
    return { big: `${fmt(v * mult)}%`, sub: `CGPA ${fmt(v)} × ${fmt(mult)} (CBSE)` };
  }, [mode, marks, of, cgpa, cgpaReverse]);

  // commit to history whenever a fresh valid result appears
  const resultKey = result ? `${mode}:${result.big}:${result.sub}` : '';
  const [lastKey, setLastKey] = useState('');
  if (resultKey && resultKey !== lastKey) {
    setLastKey(resultKey);
    const values = mode === 'marks' ? marks : mode === 'of' ? of : cgpa;
    const label = `${result!.sub} → ${result!.big}`;
    setHistory((prev) => [{ id: hid++, label, mode, values: { ...values } }, ...prev].slice(0, 5));
  }

  const restore = (h: HistoryItem) => {
    setMode(h.mode);
    if (h.mode === 'marks') setMarks(h.values);
    else if (h.mode === 'of') setOf(h.values);
    else setCgpa(h.values);
  };

  return (
    <ToolShell
      id="percent"
      icon={Percent}
      tint="rose"
      title={{ hi: 'प्रतिशत कैलकुलेटर', en: 'Percentage Calculator' }}
      purpose={{ hi: 'Marks %, X% of Y, CGPA→% — टाइप करते ही नतीजा', en: 'Marks %, X% of Y, CGPA — live results' }}
    >
      {/* mode pills */}
      <div className="glass-inset flex w-fit rounded-full p-1">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={cn(
              'relative h-10 rounded-full px-4 text-[13.5px] font-semibold transition-colors duration-200',
              mode === m.id ? 'text-white' : 'text-ink-600'
            )}
          >
            {mode === m.id && (
              <motion.span
                layoutId="percent-mode"
                className="absolute inset-0 rounded-full bg-terracotta-600 shadow-warm"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* inputs */}
        <div>
          {mode === 'marks' && (
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={toolLabelCls}>प्राप्तांक</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    placeholder="जैसे 392"
                    value={marks.a}
                    onChange={(e) => setMarks((p) => ({ ...p, a: e.target.value }))}
                    className={cn(toolInputCls, 'font-mono')}
                  />
                </div>
                <div>
                  <label className={toolLabelCls}>कुल अंक</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    placeholder="जैसे 500"
                    value={marks.b}
                    onChange={(e) => setMarks((p) => ({ ...p, b: e.target.value }))}
                    className={cn(toolInputCls, 'font-mono')}
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <MiniChip mono active={marks.b === '500'} onClick={() => setMarks((p) => ({ ...p, b: '500' }))}>
                  10वीं / 500
                </MiniChip>
                <MiniChip mono active={marks.b === '600'} onClick={() => setMarks((p) => ({ ...p, b: '600' }))}>
                  12वीं / 600
                </MiniChip>
              </div>
            </div>
          )}

          {mode === 'of' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={toolLabelCls}>प्रतिशत (%)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="20"
                  value={of.a}
                  onChange={(e) => setOf((p) => ({ ...p, a: e.target.value }))}
                  className={cn(toolInputCls, 'font-mono')}
                />
              </div>
              <div>
                <label className={toolLabelCls}>किसका (Y)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="4,500"
                  value={of.b}
                  onChange={(e) => setOf((p) => ({ ...p, b: e.target.value }))}
                  className={cn(toolInputCls, 'font-mono')}
                />
              </div>
            </div>
          )}

          {mode === 'cgpa' && (
            <div>
              <div className="glass-inset mb-3 flex w-fit rounded-full p-1 text-[13px] font-semibold">
                {['CGPA → %', '% → CGPA'].map((lbl, i) => {
                  const rev = i === 1;
                  return (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setCgpaReverse(rev)}
                      className={cn(
                        'h-8 rounded-full px-3.5 transition-colors duration-200',
                        cgpaReverse === rev ? 'bg-terracotta-600 text-white' : 'text-ink-600'
                      )}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={toolLabelCls}>{cgpaReverse ? 'प्रतिशत (%)' : 'CGPA'}</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={cgpaReverse ? 100 : 10}
                    step={0.01}
                    placeholder={cgpaReverse ? '85.5' : '8.2'}
                    value={cgpa.a}
                    onChange={(e) => setCgpa((p) => ({ ...p, a: e.target.value }))}
                    className={cn(toolInputCls, 'font-mono')}
                  />
                </div>
                <div>
                  <label className={toolLabelCls}>गुणक · Multiplier</label>
                  <div className="glass-inset flex h-12 items-center rounded-2xl p-1">
                    {['9.5', '10'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCgpa((p) => ({ ...p, b: m }))}
                        className={cn(
                          'h-full flex-1 rounded-xl font-mono text-[14px] font-semibold transition-colors duration-200',
                          cgpa.b === m ? 'bg-terracotta-600 text-white' : 'text-ink-600'
                        )}
                      >
                        ×{m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[12.5px] text-ink-400">CBSE: CGPA × 9.5 · कुछ बोर्ड ×10 इस्तेमाल करते हैं</p>
            </div>
          )}
        </div>

        {/* result */}
        <div>
          <ResultWell className="flex min-h-[132px] flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={result.big + result.sub}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: easeOutExpo }}
                >
                  <p className="font-mono text-[36px]/[40px] font-semibold text-terracotta-700">{result.big}</p>
                  <p className="mt-1 font-mono text-[13px] text-ink-400">{result.sub}</p>
                  {result.chip && (
                    <span className={cn('mt-2.5 inline-flex rounded-full px-3 py-1 text-[12.5px] font-semibold', result.chip.cls)}>
                      {result.chip.label}
                    </span>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[14px] text-ink-400"
                >
                  नंबर भरते ही नतीजा यहां दिखेगा
                </motion.p>
              )}
            </AnimatePresence>
          </ResultWell>

          {/* history strip */}
          {history.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-400">
                <History size={13} />
                हाल के हिसाब
              </p>
              <div className="flex flex-wrap gap-2">
                {history.map((h) => (
                  <motion.button
                    key={h.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => restore(h)}
                    className="glass-inset rounded-full px-3 py-1.5 font-mono text-[12px] text-ink-600 transition-colors hover:text-terracotta-600"
                  >
                    {h.label}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
