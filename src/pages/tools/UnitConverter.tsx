import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Ruler } from 'lucide-react';
import { MiniChip, ResultWell, ToolShell, toolInputCls, toolLabelCls } from './shared';
import { cn } from '@/lib/utils';

type Category = 'length' | 'weight' | 'temp' | 'data' | 'area';

interface Unit {
  id: string;
  label: string;
  /** multiplier to base unit (m / kg / °C-special / byte / m²) */
  factor: number;
}

const categories: Record<Category, { label: string; base: string; units: Unit[]; refs: string[] }> = {
  length: {
    label: 'लंबाई Length',
    base: 'm',
    units: [
      { id: 'km', label: 'किलोमीटर (km)', factor: 1000 },
      { id: 'm', label: 'मीटर (m)', factor: 1 },
      { id: 'cm', label: 'सेंटीमीटर (cm)', factor: 0.01 },
      { id: 'mm', label: 'मिलीमीटर (mm)', factor: 0.001 },
      { id: 'mile', label: 'मील (mile)', factor: 1609.344 },
      { id: 'ft', label: 'फ़ीट (ft)', factor: 0.3048 },
      { id: 'inch', label: 'इंच (inch)', factor: 0.0254 },
      { id: 'gaj', label: 'गज़ (yard)', factor: 0.9144 },
    ],
    refs: ['1 mile = 1.609 km', '1 ft = 30.48 cm', '1 गज़ = 0.914 m'],
  },
  weight: {
    label: 'वज़न Weight',
    base: 'kg',
    units: [
      { id: 'kg', label: 'किलोग्राम (kg)', factor: 1 },
      { id: 'g', label: 'ग्राम (g)', factor: 0.001 },
      { id: 'quintal', label: 'क्विंटल', factor: 100 },
      { id: 'tonne', label: 'टन', factor: 1000 },
      { id: 'lb', label: 'पाउंड (lb)', factor: 0.45359237 },
    ],
    refs: ['1 kg = 2.205 pound', '1 क्विंटल = 100 kg'],
  },
  temp: {
    label: 'तापमान Temp',
    base: '°C',
    units: [
      { id: 'c', label: 'सेल्सियस (°C)', factor: 1 },
      { id: 'f', label: 'फ़ारेनहाइट (°F)', factor: 1 },
      { id: 'k', label: 'केल्विन (K)', factor: 1 },
    ],
    refs: ['°F = °C × 9/5 + 32', '0°C = 273.15 K'],
  },
  data: {
    label: 'डेटा Data',
    base: 'KB',
    units: [
      { id: 'kb', label: 'KB', factor: 1 },
      { id: 'mb', label: 'MB', factor: 1024 },
      { id: 'gb', label: 'GB', factor: 1024 ** 2 },
      { id: 'tb', label: 'TB', factor: 1024 ** 3 },
    ],
    refs: ['1 GB = 1,024 MB', '1 MB = 1,024 KB'],
  },
  area: {
    label: 'क्षेत्र Area',
    base: 'm²',
    units: [
      { id: 'sqm', label: 'वर्ग मीटर (m²)', factor: 1 },
      { id: 'sqft', label: 'वर्ग फ़ीट (sq ft)', factor: 0.09290304 },
      { id: 'gaj', label: 'वर्ग गज़ (sq yd)', factor: 0.83612736 },
      { id: 'acre', label: 'एकड़ (acre)', factor: 4046.8564224 },
      { id: 'bigha', label: 'बीघा (UP)', factor: 2529.285264 },
      { id: 'hectare', label: 'हेक्टेयर', factor: 10000 },
    ],
    refs: ['1 एकड़ = 43,560 sq ft', '1 हेक्टेयर = 2.47 एकड़', '1 बीघा ≈ 0.625 एकड़'],
  },
};

function convert(category: Category, value: number, from: Unit, to: Unit): number {
  if (category === 'temp') {
    // to Celsius first
    const c = from.id === 'c' ? value : from.id === 'f' ? ((value - 32) * 5) / 9 : value - 273.15;
    return to.id === 'c' ? c : to.id === 'f' ? (c * 9) / 5 + 32 : c + 273.15;
  }
  return (value * from.factor) / to.factor;
}

function fmtResult(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n !== 0 && (Math.abs(n) >= 1e15 || Math.abs(n) < 1e-6)) return n.toExponential(4);
  const rounded = Math.round(n * 1e6) / 1e6;
  return rounded.toLocaleString('en-IN', { maximumFractionDigits: 6 });
}

/**
 * Tools §8 — Unit Converter: category pills, two fields with unit
 * dropdowns, swap button (rotates 180°), live mono result, farmer-friendly
 * presets (बीघा/एकड़), common-reference chips.
 */
export default function UnitConverter() {
  const [cat, setCat] = useState<Category>('length');
  const [fromId, setFromId] = useState('km');
  const [toId, setToId] = useState('mile');
  const [input, setInput] = useState('1');
  const [spin, setSpin] = useState(0);

  const def = categories[cat];
  const from = def.units.find((u) => u.id === fromId) ?? def.units[0];
  const to = def.units.find((u) => u.id === toId) ?? def.units[1] ?? def.units[0];

  const value = parseFloat(input);
  const out = useMemo(() => {
    if (!Number.isFinite(value)) return null;
    return convert(cat, value, from, to);
  }, [cat, value, from, to]);

  const switchCat = (c: Category) => {
    setCat(c);
    const units = categories[c].units;
    setFromId(units[0].id);
    setToId((units[1] ?? units[0]).id);
  };

  const swap = () => {
    setFromId(to.id);
    setToId(from.id);
    setSpin((s) => s + 180);
  };

  const selectCls = cn(
    toolInputCls,
    'appearance-none pr-8 bg-[length:14px] bg-[right_12px_center] bg-no-repeat cursor-pointer'
  );
  const chevronBg = {
    backgroundImage:
      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238A7F6F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e\")",
  };

  return (
    <ToolShell
      id="unit"
      icon={Ruler}
      tint="leaf"
      title={{ hi: 'यूनिट कनवर्टर', en: 'Unit Converter' }}
      purpose={{ hi: 'km↔mile, kg↔pound, °C↔°F, MB↔GB, बीघा↔एकड़', en: 'Length, weight, temp, data, area' }}
    >
      {/* category pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(categories) as Category[]).map((c) => (
          <MiniChip key={c} active={cat === c} onClick={() => switchCat(c)}>
            {categories[c].label}
          </MiniChip>
        ))}
      </div>

      {/* fields slide on category swap */}
      <motion.div
        key={cat}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-5 grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]"
      >
        <div>
          <label className={toolLabelCls}>से · From</label>
          <input
            type="number"
            inputMode="decimal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={cn(toolInputCls, 'font-mono')}
            aria-label="मान"
          />
          <select value={fromId} onChange={(e) => setFromId(e.target.value)} className={cn(selectCls, 'mt-2')} style={chevronBg} aria-label="From unit">
            {def.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          type="button"
          onClick={swap}
          animate={{ rotate: spin }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          aria-label="इकाइयाँ बदलें"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-600 text-white shadow-warm transition-transform active:scale-90"
        >
          <ArrowLeftRight size={19} />
        </motion.button>

        <div>
          <label className={toolLabelCls}>में · To</label>
          <div className="glass-inset flex h-12 items-center rounded-2xl px-4">
            <p className="w-full truncate font-mono text-[17px] font-semibold text-terracotta-700">
              {out === null ? '—' : fmtResult(out)}
            </p>
          </div>
          <select value={toId} onChange={(e) => setToId(e.target.value)} className={cn(selectCls, 'mt-2')} style={chevronBg} aria-label="To unit">
            {def.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* reference chips */}
      <ResultWell className="mt-5">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-400">याद रखें</p>
        <div className="flex flex-wrap gap-2">
          {def.refs.map((r) => (
            <span key={r} className="rounded-full bg-white/60 px-3 py-1.5 font-mono text-[12.5px] text-ink-600">
              {r}
            </span>
          ))}
        </div>
      </ResultWell>
    </ToolShell>
  );
}
