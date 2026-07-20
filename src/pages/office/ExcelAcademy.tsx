import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Copy } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import FilterPills from '@/components/FilterPills';
import type { Pill } from '@/components/FilterPills';
import { formulaLevelMeta, officeFormulas } from '@/lib/data';
import type { FormulaLevel, OfficeFormula } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { pop, stagger, viewport15 } from '@/lib/motion';
import { copyText } from '@/pages/page-utils';
import { cn } from '@/lib/utils';

const levelPills: Pill[] = [
  { id: 'all', label: 'सभी · All' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

/** Copyable formula card (office.md §2). */
function FormulaCard({ formula }: { formula: OfficeFormula }) {
  const { t } = useLang();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const meta = formulaLevelMeta[formula.level];

  const onCopy = async () => {
    const ok = await copyText(formula.formula);
    if (ok) {
      setCopied(true);
      toast('✓ फॉर्मूला कॉपी हो गया');
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.article
      variants={pop}
      whileHover={{ y: -4 }}
      className="glass-card glass-tint-terracotta flex flex-col p-5 transition-shadow duration-200 hover:shadow-glass-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide', meta.chipClass)}>
          {t(meta.label)}
        </span>
        <ChevronRight size={16} className="text-terracotta-700/50" />
      </div>

      <h3 className="mt-3 font-display text-[19px]/[26px] font-semibold text-ink-900">{formula.name}</h3>
      <p className="mt-1 text-[15px]/[24px] text-ink-600">{t(formula.use)}</p>

      {/* formula box */}
      <div className="glass-inset mt-3 flex items-center gap-2 rounded-2xl px-3.5 py-3">
        <code className="min-w-0 flex-1 break-all font-mono text-[13.5px]/[20px] font-medium text-terracotta-700">
          {formula.formula}
        </code>
        <button
          type="button"
          onClick={onCopy}
          aria-label={`${formula.name} फॉर्मूला कॉपी करें`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta-600 text-white shadow-warm transition-transform duration-150 active:scale-90"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>

      <p className="mt-2.5 font-mono text-[12.5px]/[18px] text-ink-400">{formula.example}</p>

      <Link to="/article" className="link-underline mt-3 inline-flex items-center gap-1 self-start text-[14.5px] font-semibold">
        पूरा ट्यूटोरियल
        <ChevronRight size={15} />
      </Link>
    </motion.article>
  );
}

/**
 * Office §2 — Excel Academy: level pills + grid of copyable FormulaCards.
 * Cards rise stagger 0.07s; level filter re-staggers the grid.
 */
export default function ExcelAcademy() {
  const [level, setLevel] = useState('all');

  const visible = useMemo(
    () => (level === 'all' ? officeFormulas : officeFormulas.filter((f) => f.level === (level as FormulaLevel))),
    [level]
  );

  return (
    <section id="excel-academy" className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <SectionHeader kicker="EXCEL" title={{ hi: 'एक्सेल अकादमी', en: 'Excel Academy' }}>
        <FilterPills pills={levelPills} active={level} onChange={setLevel} />
      </SectionHeader>

      <motion.div
        key={level}
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((f) => (
          <FormulaCard key={f.id} formula={f} />
        ))}
      </motion.div>
    </section>
  );
}
