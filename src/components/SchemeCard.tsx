import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Scheme } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { tintGlass } from '@/lib/tints';
import { cn } from '@/lib/utils';

/**
 * SchemeCard (design.md §10.8): glass-tint leaf, benefit badge top-right,
 * audience chip, title + 2-line summary + "पात्रता देखें →".
 */
export default function SchemeCard({ scheme }: { scheme: Scheme }) {
  const { t, s } = useLang();
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className={cn('glass-card relative flex h-full flex-col p-5', tintGlass[scheme.tint])}
    >
      <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 font-mono text-[12.5px] font-semibold text-amber-600">
        {scheme.benefit}
      </span>
      <span className="w-fit rounded-full bg-white/60 px-3 py-1 text-[12px] font-semibold text-leaf-700">
        {t(scheme.audience)}
        <span className="text-ink-400 font-normal"> · {s(scheme.audience)}</span>
      </span>
      <h3 className="mt-3 pr-20 font-display text-[19px]/[26px] font-semibold text-ink-900">{t(scheme.name)}</h3>
      <p className="mt-1.5 line-clamp-2 text-[15px]/[24px] text-ink-600">{t(scheme.summary)}</p>
      <Link
        to="/article"
        className="group mt-auto inline-flex items-center gap-1.5 pt-4 text-[14.5px] font-semibold text-leaf-600"
      >
        पात्रता देखें
        <ArrowRight size={16} className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
