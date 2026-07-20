import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { results, admitCards, resultPanel, admitPanel } from '@/lib/data';
import type { ResultItem } from '@/lib/data';
import type { Tint } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';
import { viewport15 } from '@/lib/motion';

function Panel({
  title,
  enTitle,
  items,
  tint,
  icon: Icon,
  fromLeft,
}: {
  title: string;
  enTitle: string;
  items: ResultItem[];
  tint: Tint;
  icon: typeof ChevronRight;
  fromLeft: boolean;
}) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport15}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-5"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className={cn('icon-disc h-11 w-11', tintDiscBg[tint])}>
          <Icon size={20} strokeWidth={1.75} className={tintIcon[tint]} />
        </span>
        <h3 className="font-display text-[18px]/[24px] font-semibold text-ink-900">
          {title} <span className="text-[13px] font-medium text-ink-400">· {enTitle}</span>
        </h3>
      </div>
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport15}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/article"
              className="group flex items-center gap-3 rounded-2xl px-2.5 py-3 transition-colors hover:bg-white/50"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-semibold text-ink-900">{item.title}</span>
                  {item.isNew && (
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={viewport15}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white"
                    >
                      NEW
                    </motion.span>
                  )}
                </span>
                <span className="font-mono text-[12px] text-ink-400">{item.date} 2026</span>
              </span>
              <span className="flex shrink-0 items-center gap-0.5 text-[13.5px] font-semibold text-terracotta-600">
                {t(item.cta)}
                <ChevronRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * Home §6 — Results & Admit Cards (रिज़ल्ट व एडमिट कार्ड).
 */
export default function ResultsAdmit() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="रिज़ल्ट" enTitle="Results" items={results} tint={resultPanel.tint} icon={resultPanel.icon} fromLeft />
        <Panel title="एडमिट कार्ड" enTitle="Admit Cards" items={admitCards} tint={admitPanel.tint} icon={admitPanel.icon} fromLeft={false} />
      </div>
    </section>
  );
}
