import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Category } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { tintDiscBg, tintIcon, tintIconDeep, tintGlass } from '@/lib/tints';
import { cn } from '@/lib/utils';

/**
 * CategoryTile (design.md §10.5): glass card p-5, 48px tinted icon disc,
 * Hindi title, EN subtitle, count line, ChevronRight.
 * Hover (desktop): lift -4px, shadow-lg, disc rotates -6° & scales 1.06.
 */
export default function CategoryTile({ category }: { category: Category }) {
  const { t, s } = useLang();
  const Icon = category.icon;
  return (
    <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.12 }} className="h-full">
      <Link
        to={category.href}
        className={cn(
          'glass-card group flex h-full flex-col gap-3 p-5 transition-all duration-300 ease-out-expo lg:hover:-translate-y-1 lg:hover:shadow-lg',
          tintGlass[category.tint]
        )}
      >
        <div className="flex items-start justify-between">
          <span
            className={cn(
              'icon-disc h-12 w-12 transition-transform duration-300 ease-out-expo lg:group-hover:-rotate-6 lg:group-hover:scale-[1.06]',
              tintDiscBg[category.tint]
            )}
          >
            <Icon size={21} strokeWidth={1.75} className={category.deep ? tintIconDeep[category.tint] : tintIcon[category.tint]} />
          </span>
          <ChevronRight size={18} className="text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-terracotta-600" />
        </div>
        <div>
          <h3 className="font-display text-[17px]/[22px] font-semibold text-ink-900">{t(category.title)}</h3>
          <p className="text-[13px] text-ink-400">{s(category.title)}</p>
        </div>
        <p className="mt-auto text-[12.5px] font-medium text-ink-400">
          <span className="font-semibold text-ink-600">{t(category.count)}</span> · {s(category.count)}
        </p>
      </Link>
    </motion.div>
  );
}
