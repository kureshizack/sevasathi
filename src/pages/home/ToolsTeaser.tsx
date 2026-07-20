import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { tools } from '@/lib/data';
import SectionHeader from '@/components/SectionHeader';
import { useLang } from '@/lib/lang';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { pop, stagger, viewport15 } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Home §7 — Tools Teaser (मुफ़्त टूल्स · Free Tools).
 * 4 mini tool cards + working micro percentage calculator widget.
 */
export default function ToolsTeaser() {
  const { t, s } = useLang();
  const [marks, setMarks] = useState('');
  const [total, setTotal] = useState('');

  const pct = useMemo(() => {
    const m = parseFloat(marks);
    const t_ = parseFloat(total);
    if (!isFinite(m) || !isFinite(t_) || t_ <= 0) return null;
    return (m / t_) * 100;
  }, [marks, total]);

  return (
    <section id="tools" className="mx-auto max-w-[1180px] scroll-mt-24 px-4 py-14 md:px-6 lg:px-8 lg:py-20">
      <SectionHeader
        kicker="Free Tools"
        title={{ hi: 'मुफ़्त टूल्स', en: 'Free Tools' }}
        viewAllHref="/tools"
        viewAllLabel={{ hi: 'सभी टूल्स', en: 'All tools' }}
      />
      <motion.div
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.id} variants={pop}>
              <Link to="/tools" className="glass-card group flex h-full flex-col gap-2.5 p-5 transition-all lg:hover:-translate-y-1 lg:hover:shadow-lg">
                <span className={cn('icon-disc h-12 w-12', tintDiscBg[tool.tint])}>
                  <Icon size={21} strokeWidth={1.75} className={tintIcon[tool.tint]} />
                </span>
                <h3 className="font-display text-[16.5px]/[22px] font-semibold text-ink-900">
                  {t(tool.title)}
                  <span className="block font-sans text-[12px] font-medium text-ink-400">{s(tool.title)}</span>
                </h3>
                <p className="text-[13px]/[19px] text-ink-600">{t(tool.desc)}</p>
                <span className="mt-auto pt-1 text-[13.5px] font-semibold text-terracotta-600">
                  खोलें <span className="text-ink-400 font-normal">· Open</span> →
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* micro percentage calculator widget */}
      <motion.div
        variants={pop}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="glass-inset mt-4 flex flex-col items-stretch gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6"
      >
        <span className="text-[14px] font-semibold text-ink-900">
          लाइव डेमो <span className="font-medium text-ink-400">· Percentage अभी निकालें</span>
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 text-[14px] font-medium text-ink-600">
            अंक
            <input
              value={marks}
              onChange={(e) => setMarks(e.target.value.replace(/[^0-9.]/g, ''))}
              inputMode="decimal"
              placeholder="450"
              aria-label="अंक"
              className="h-11 w-24 rounded-xl border border-black/10 bg-white/70 px-3 font-mono text-[16px] text-ink-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </label>
          <span className="text-ink-400">/</span>
          <label className="flex items-center gap-2 text-[14px] font-medium text-ink-600">
            कुल
            <input
              value={total}
              onChange={(e) => setTotal(e.target.value.replace(/[^0-9.]/g, ''))}
              inputMode="decimal"
              placeholder="500"
              aria-label="कुल"
              className="h-11 w-24 rounded-xl border border-black/10 bg-white/70 px-3 font-mono text-[16px] text-ink-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </label>
          <span className="text-[16px] font-semibold text-ink-900">=</span>
          <motion.span
            key={pct === null ? 'na' : pct.toFixed(2)}
            initial={{ scale: 0.9, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'min-w-[92px] rounded-xl px-3 py-2 text-center font-mono text-[20px] font-semibold',
              pct === null ? 'bg-white/40 text-ink-400' : 'bg-leaf-100 text-leaf-700'
            )}
          >
            {pct === null ? '__ %' : `${parseFloat(pct.toFixed(2))}%`}
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
