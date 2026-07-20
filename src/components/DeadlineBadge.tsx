import { deadlineInfo } from '@/lib/data';
import { cn } from '@/lib/utils';

interface Props {
  /** ISO date yyyy-mm-dd */
  lastDate: string;
  className?: string;
}

/**
 * DeadlineBadge (design.md §10.7): pill with IBM Plex Mono date.
 * >7d leaf · ≤7d amber "N दिन बाकी" · ≤2d terracotta solid pulsing ·
 * closed ink-400 struck.
 */
export default function DeadlineBadge({ lastDate, className }: Props) {
  const { label, fullLabel, daysLeft } = deadlineInfo(lastDate);

  if (daysLeft < 0) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-ink-400/15 px-3 py-1 text-[12.5px] font-semibold text-ink-400', className)}>
        बंद: <s className="font-mono">{label}</s>
      </span>
    );
  }
  if (daysLeft <= 2) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-terracotta-700 px-3 py-1 text-[12.5px] font-semibold text-white', className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" />
        {daysLeft <= 1 ? 'कल आखिरी!' : 'बस 2 दिन!'} <span className="font-mono">{label}</span>
      </span>
    );
  }
  if (daysLeft <= 7) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[12.5px] font-semibold text-amber-600', className)}>
        <span className="font-mono">{daysLeft}</span> दिन बाकी · <span className="font-mono">{label}</span>
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-leaf-100 px-3 py-1 text-[12.5px] font-semibold text-leaf-600', className)}>
      अंतिम तिथि: <span className="font-mono">{fullLabel}</span>
    </span>
  );
}
