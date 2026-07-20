import { cn } from '@/lib/utils';

export interface Pill {
  id: string;
  label: string;
  count?: number;
}

interface Props {
  pills: Pill[];
  active?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * FilterPills (design.md §10.14): horizontal scroll row with fade edges;
 * active = terracotta-600 bg + white text; count badges allowed.
 */
export default function FilterPills({ pills, active, onChange, className }: Props) {
  return (
    <div className={cn('scroll-fade-x no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0', className)}>
      <div className="flex w-max gap-2 py-1">
        {pills.map((pill) => {
          const isActive = pill.id === active;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onChange?.(pill.id)}
              className={cn(
                'flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-all duration-200 active:scale-95',
                isActive
                  ? 'bg-terracotta-600 text-white shadow-warm'
                  : 'glass-card !rounded-full text-ink-600 hover:text-terracotta-600'
              )}
            >
              {pill.label}
              {typeof pill.count === 'number' && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 font-mono text-[11px] font-semibold',
                    isActive ? 'bg-white/25 text-white' : 'bg-terracotta-100 text-terracotta-600'
                  )}
                >
                  {pill.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
