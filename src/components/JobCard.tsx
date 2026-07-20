import { Link } from 'react-router';
import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Job } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { useBookmarks } from '@/lib/bookmarks';
import { tintDiscBg, tintIcon, tintGlass } from '@/lib/tints';
import { cn } from '@/lib/utils';
import DeadlineBadge from './DeadlineBadge';

interface Props {
  job: Job;
  /** show the urgent left bar (first urgent card) */
  urgent?: boolean;
}

/**
 * JobCard (design.md §10.6): glass p-5, org-initial disc, meta chips,
 * footer with DeadlineBadge + bookmark + "विवरण →".
 */
export default function JobCard({ job, urgent }: Props) {
  const { t } = useLang();
  const { toast } = useToast();
  const { has, toggle } = useBookmarks();
  const saved = has(job.id);
  const isUrgent = urgent ?? false;

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className={cn(
        isUrgent ? 'glass-urgent' : 'glass-card',
        isUrgent && tintGlass[job.tint],
        'flex h-full flex-col p-5'
      )}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            'icon-disc h-12 w-12 font-display text-[15px] font-bold',
            tintDiscBg[job.tint],
            tintIcon[job.tint]
          )}
        >
          {job.orgShort.slice(0, 4)}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[17px]/[22px] font-semibold text-ink-900">{job.title}</h3>
          <p className="mt-0.5 truncate text-[13px] text-ink-400">{t(job.org)}</p>
        </div>
      </div>

      <div className="mb-4 mt-4 flex flex-wrap gap-2">
        <span className="glass-inset rounded-full px-3 py-1 text-[12.5px] font-medium text-ink-600">
          पद <span className="font-mono font-semibold text-ink-900">{job.posts}</span>
        </span>
        <span className="glass-inset rounded-full px-3 py-1 text-[12.5px] font-medium text-ink-600">
          योग्यता: {job.qualification}
        </span>
        <span className="glass-inset rounded-full px-3 py-1 text-[12.5px] font-medium text-ink-600">
          Age <span className="font-mono">{job.age}</span>
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/5 pt-4">
        <DeadlineBadge lastDate={job.lastDate} />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={saved ? 'बुकमार्क हटाएँ' : 'सहेजें'}
            onClick={() => {
              const now = toggle(job.id);
              toast(now ? '✓ सहेज लिया गया' : 'बुकमार्क हटाया गया');
            }}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90',
              saved ? 'text-leaf-600 bg-leaf-100' : 'text-ink-400 hover:text-leaf-600 hover:bg-leaf-100/60'
            )}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <Link
            to="/article"
            className="group flex items-center gap-1 text-[14px] font-semibold text-terracotta-600"
          >
            विवरण
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
