import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, IndianRupee, ShieldAlert } from 'lucide-react';
import { ResultWell, StatTile, ToolShell, Tween, toolInputCls, toolLabelCls } from './shared';
import { Slider } from '@/components/ui/slider';
import { inr } from '@/pages/page-utils';
import { easeOutExpo } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface Row {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

const DONUT_R = 64;
const DONUT_C = 2 * Math.PI * DONUT_R;

/**
 * Tools §7 — EMI Calculator: 3 sliders + synced inputs (amount / rate /
 * tenure with yr-mo toggle), live EMI hero, interest + total tiles, SVG
 * donut (principal leaf vs interest amber), amortization peek + full table.
 */
export default function EmiCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(5);
  const [tenureUnit, setTenureUnit] = useState<'yr' | 'mo'>('yr');
  const [showAll, setShowAll] = useState(false);

  const months = tenureUnit === 'yr' ? tenure * 12 : tenure;

  const calc = useMemo(() => {
    const P = Math.max(0, amount);
    const r = rate / 1200;
    const n = Math.max(1, months);
    if (P <= 0 || r <= 0) return null;
    const pow = Math.pow(1 + r, n);
    const emi = (P * r * pow) / (pow - 1);
    const total = emi * n;
    const interest = total - P;

    const rows: Row[] = [];
    let bal = P;
    for (let i = 1; i <= n; i++) {
      const int = bal * r;
      const pri = Math.min(emi - int, bal);
      bal = Math.max(0, bal - pri);
      rows.push({ month: i, principal: pri, interest: int, balance: bal });
    }
    return { emi, total, interest, rows, interestShare: (interest / total) * 100 };
  }, [amount, rate, months]);

  const interestArc = calc ? (calc.interestShare / 100) * DONUT_C : 0;

  return (
    <ToolShell
      id="emi"
      icon={IndianRupee}
      tint="terracotta"
      title={{ hi: 'EMI कैलकुलेटर', en: 'EMI Calculator' }}
      purpose={{ hi: 'लोन की मासिक किस्त, कुल ब्याज और भुगतान — slider घुमाते ही', en: 'Monthly EMI, interest & total — live' }}
    >
      <div className="grid gap-7 lg:grid-cols-2">
        {/* controls */}
        <div className="flex flex-col gap-6">
          {/* amount */}
          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <label className={cn(toolLabelCls, 'mb-0')}>लोन राशि ₹</label>
              <input
                type="number"
                min={10000}
                max={10000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Math.max(10000, Math.min(10000000, Number(e.target.value) || 0)))}
                className={cn(toolInputCls, 'h-10 w-36 font-mono text-[14px]')}
                aria-label="लोन राशि"
              />
            </div>
            <Slider
              value={[amount]}
              min={10000}
              max={10000000}
              step={10000}
              onValueChange={([v]) => setAmount(v)}
              aria-label="लोन राशि slider"
            />
            <p className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-400">
              <span>₹10K</span>
              <span className="rounded-md bg-terracotta-100 px-2 py-0.5 font-semibold text-terracotta-700">₹{inr(amount)}</span>
              <span>₹1Cr</span>
            </p>
          </div>

          {/* rate */}
          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <label className={cn(toolLabelCls, 'mb-0')}>ब्याज दर % (सालाना)</label>
              <input
                type="number"
                min={5}
                max={20}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Math.max(5, Math.min(20, Number(e.target.value) || 0)))}
                className={cn(toolInputCls, 'h-10 w-28 font-mono text-[14px]')}
                aria-label="ब्याज दर"
              />
            </div>
            <Slider
              value={[rate]}
              min={5}
              max={20}
              step={0.1}
              onValueChange={([v]) => setRate(v)}
              aria-label="ब्याज दर slider"
            />
            <p className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-400">
              <span>5%</span>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-600">{rate.toFixed(1)}%</span>
              <span>20%</span>
            </p>
          </div>

          {/* tenure */}
          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <label className={cn(toolLabelCls, 'mb-0')}>अवधि</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={tenureUnit === 'yr' ? 30 : 360}
                  value={tenure}
                  onChange={(e) =>
                    setTenure(Math.max(1, Math.min(tenureUnit === 'yr' ? 30 : 360, Number(e.target.value) || 0)))
                  }
                  className={cn(toolInputCls, 'h-10 w-24 font-mono text-[14px]')}
                  aria-label="अवधि"
                />
                <div className="glass-inset flex h-10 items-center rounded-full p-1 text-[13px] font-semibold">
                  {(['yr', 'mo'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        if (u !== tenureUnit) {
                          setTenureUnit(u);
                          setTenure(u === 'yr' ? Math.max(1, Math.round(months / 12)) : Math.min(360, months));
                        }
                      }}
                      className={cn(
                        'h-8 rounded-full px-3 transition-colors duration-200',
                        tenureUnit === u ? 'bg-terracotta-600 text-white' : 'text-ink-600'
                      )}
                    >
                      {u === 'yr' ? 'वर्ष' : 'माह'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Slider
              value={[tenure]}
              min={1}
              max={tenureUnit === 'yr' ? 30 : 360}
              step={1}
              onValueChange={([v]) => setTenure(v)}
              aria-label="अवधि slider"
            />
            <p className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-400">
              <span>{tenureUnit === 'yr' ? '1 वर्ष' : '1 माह'}</span>
              <span className="rounded-md bg-leaf-100 px-2 py-0.5 font-semibold text-leaf-700">
                {tenure} {tenureUnit === 'yr' ? 'वर्ष' : 'माह'} ({months} किस्तें)
              </span>
              <span>{tenureUnit === 'yr' ? '30 वर्ष' : '360 माह'}</span>
            </p>
          </div>

          {/* safety note */}
          <p className="flex items-center gap-2 rounded-2xl bg-amber-100 px-3.5 py-2.5 text-[13px] font-medium text-amber-600">
            <ShieldAlert size={15} className="shrink-0" />
            लोन लेने से पहले हमेशा official bank से दर पक्की करें।
          </p>
        </div>

        {/* results */}
        <div>
          <ResultWell className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">मासिक EMI</p>
            <p className="mt-1 font-mono text-[40px]/[44px] font-semibold text-terracotta-700">
              {calc ? (
                <>
                  ₹<Tween value={calc.emi} duration={0.15} format={(n) => inr(Math.round(n))} />
                  <span className="ml-1 text-[16px] font-medium text-ink-400">/माह</span>
                </>
              ) : (
                '—'
              )}
            </p>
          </ResultWell>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatTile label="कुल ब्याज">
              {calc ? <Tween value={calc.interest} duration={0.15} format={(n) => `₹${inr(Math.round(n))}`} /> : '—'}
            </StatTile>
            <StatTile label="कुल भुगतान">
              {calc ? <Tween value={calc.total} duration={0.15} format={(n) => `₹${inr(Math.round(n))}`} /> : '—'}
            </StatTile>
          </div>

          {/* donut */}
          {calc && (
            <div className="mt-4 flex items-center justify-center gap-5">
              <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
                <circle cx="75" cy="75" r={DONUT_R} fill="none" stroke="#F2E9D8" strokeWidth="20" />
                {/* principal arc (leaf) */}
                <motion.circle
                  cx="75"
                  cy="75"
                  r={DONUT_R}
                  fill="none"
                  stroke="#3E6B50"
                  strokeWidth="20"
                  strokeDasharray={`${DONUT_C - interestArc} ${DONUT_C}`}
                  initial={false}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.8, ease: easeOutExpo }}
                />
                {/* interest arc (amber), starts after principal */}
                <motion.circle
                  cx="75"
                  cy="75"
                  r={DONUT_R}
                  fill="none"
                  stroke="#D9A03F"
                  strokeWidth="20"
                  initial={false}
                  animate={{ strokeDasharray: `${interestArc} ${DONUT_C}`, strokeDashoffset: -(DONUT_C - interestArc) }}
                  transition={{ duration: 0.8, ease: easeOutExpo }}
                />
              </svg>
              <div className="flex flex-col gap-1.5">
                <p className="text-center font-mono text-[17px] font-semibold text-amber-600">
                  ब्याज {Math.round(calc.interestShare)}%
                </p>
                <p className="flex items-center gap-2 text-[13px] text-ink-600">
                  <span className="h-3 w-3 rounded-full bg-leaf-600" /> मूल राशि {Math.round(100 - calc.interestShare)}%
                </p>
                <p className="flex items-center gap-2 text-[13px] text-ink-600">
                  <span className="h-3 w-3 rounded-full bg-amber-500" /> ब्याज
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* amortization peek */}
      {calc && (
        <div className="mt-6">
          <div className={cn('glass-inset overflow-auto rounded-2xl', showAll && 'max-h-[420px]')}>
            <table className="w-full min-w-[520px] text-[13.5px]">
              <thead>
                <tr className="bg-sand-200 text-left font-semibold text-ink-900">
                  <th className="px-4 py-2.5">माह</th>
                  <th className="px-4 py-2.5">Principal</th>
                  <th className="px-4 py-2.5">Interest</th>
                  <th className="px-4 py-2.5">Balance</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? calc.rows : calc.rows.slice(0, 3)).map((r) => (
                  <tr key={r.month} className="odd:bg-white/40">
                    <td className="px-4 py-2 font-mono">{r.month}</td>
                    <td className="px-4 py-2 font-mono text-leaf-700">₹{inr(Math.round(r.principal))}</td>
                    <td className="px-4 py-2 font-mono text-amber-600">₹{inr(Math.round(r.interest))}</td>
                    <td className="px-4 py-2 font-mono text-ink-600">₹{inr(Math.round(r.balance))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="mt-3 flex min-h-[44px] items-center gap-1.5 text-[14.5px] font-semibold text-terracotta-600"
            aria-expanded={showAll}
          >
            {showAll ? 'छोटी टेबल करें' : `पूरी टेबल देखें (${calc.rows.length} महीने)`}
            <motion.span animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} />
            </motion.span>
          </button>
        </div>
      )}
    </ToolShell>
  );
}
