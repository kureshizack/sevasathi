import { Link } from 'react-router';
import { Clock, IndianRupee, ListOrdered } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceItem } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

interface Props {
  service: ServiceItem;
  /** mini = round tile used in the home quick-services rail (§2) */
  mini?: boolean;
}

/**
 * ServiceCard (design.md §10.9): icon disc + bilingual title +
 * meta row (time · fee · steps) + "गाइड पढ़ें →".
 * Mini variant: 56px tinted icon disc + 2-line label.
 */
export default function ServiceCard({ service, mini }: Props) {
  const { t, s } = useLang();
  const Icon = service.icon;

  if (mini) {
    return (
      <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.12 }} className="h-full">
        <Link
          to="/article"
          className="group flex h-full w-[104px] shrink-0 flex-col items-center gap-2.5 rounded-2xl p-3 text-center lg:w-auto"
        >
          <span
            className={cn(
              'icon-disc h-14 w-14 transition-transform duration-200 ease-out-expo group-hover:scale-[1.08] group-hover:-rotate-6',
              tintDiscBg[service.tint]
            )}
          >
            <Icon size={22} strokeWidth={1.75} className={tintIcon[service.tint]} />
          </span>
          <span className="text-[13px]/[17px] font-semibold text-ink-900 transition-colors group-hover:text-terracotta-600">
            {t(service.title)}
            <span className="block text-[11px] font-medium text-ink-400">{s(service.title)}</span>
          </span>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.12 }} className="h-full">
      <Link to="/article" className="glass-card group flex h-full flex-col gap-3 p-5">
        <div className="flex items-center gap-3.5">
          <span className={cn('icon-disc h-12 w-12', tintDiscBg[service.tint])}>
            <Icon size={21} strokeWidth={1.75} className={tintIcon[service.tint]} />
          </span>
          <h3 className="font-display text-[17px]/[22px] font-semibold text-ink-900">
            {t(service.title)}
            <span className="block text-[12.5px] font-medium font-sans text-ink-400">{s(service.title)}</span>
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-ink-400">
          <span className="inline-flex items-center gap-1"><Clock size={13} /> {service.time}</span>
          <span className="inline-flex items-center gap-1"><IndianRupee size={13} /> <span className="font-mono">{service.fee.replace('₹', '')}</span></span>
          <span className="inline-flex items-center gap-1"><ListOrdered size={13} /> {service.steps} Steps</span>
        </div>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[14px] font-semibold text-terracotta-600">
          गाइड पढ़ें
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </motion.div>
  );
}
