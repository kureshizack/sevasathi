import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GraduationCap,
  Ticket,
  Briefcase,
  FileCheck2,
  School,
  Cpu,
  Sparkles,
  Megaphone,
  ChevronRight,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { liveUpdates, liveUpdateCategoryMeta } from '@/lib/data';
import type { LiveUpdate, LiveUpdateCategory } from '@/lib/data';
import { useSheetUpdates } from '@/lib/sheetData';
import SectionHeader from '@/components/SectionHeader';
import FilterPills from '@/components/FilterPills';
import type { Pill } from '@/components/FilterPills';
import { rise, stagger, viewport15 } from '@/lib/motion';
import { useLang } from '@/lib/lang';

const CATEGORY_ICONS: Record<LiveUpdateCategory, typeof Briefcase> = {
  job: Briefcase,
  exam: GraduationCap,
  admit: Ticket,
  result: FileCheck2,
  cbse: School,
  tech: Cpu,
  ai: Sparkles,
  news: Megaphone,
};

const HI_MONTHS = ['जन', 'फ़र', 'मार्च', 'अप्र', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'];

function fmtDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  return `${Number(m[3])} ${HI_MONTHS[Number(m[2]) - 1]}`;
}

const FILTER_ORDER: LiveUpdateCategory[] = ['job', 'exam', 'admit', 'result', 'cbse', 'tech', 'ai', 'news'];

/**
 * Home — Recent Updates (ताज़ा अपडेट · Live Updates).
 * Live feed of exam alerts, admit cards, job ads, tech/AI news & CBSE
 * updates. Owner posts daily via the Google Sheet "Updates" tab —
 * sheet items appear on top automatically; built-in items fill below.
 */
export default function RecentUpdates() {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const sheetUpdates = useSheetUpdates();

  const all = useMemo(() => [...sheetUpdates, ...liveUpdates], [sheetUpdates]);

  const pills: Pill[] = useMemo(
    () => [
      { id: 'all', label: 'सभी · All' },
      ...FILTER_ORDER.map((c) => ({
        id: c,
        label: liveUpdateCategoryMeta[c].label.hi,
        count: all.filter((u) => u.category === c).length || undefined,
      })),
    ],
    [all]
  );

  const filtered = filter === 'all' ? all : all.filter((u) => u.category === filter);
  const visible = expanded ? filtered : filtered.slice(0, 6);
  const canLoadMore = !expanded && filtered.length > 6;

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8 lg:py-20">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute h-full w-full rounded-full bg-terracotta-600 animate-pulse-dot" />
        </span>
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-terracotta-600">
          LIVE
        </span>
      </div>
      <SectionHeader
        kicker="Recent Updates"
        title={{ hi: 'ताज़ा अपडेट', en: 'Recent Updates' }}
      />
      <p className="-mt-3 mb-5 text-[15px]/[24px] text-ink-400">
        परीक्षा, एडमिट कार्ड, नौकरी, टेक्नोलॉजी, AI और CBSE — सब एक जगह, रोज़ अपडेट।
      </p>

      <FilterPills pills={pills} active={filter} onChange={(id) => { setFilter(id); setExpanded(false); }} className="mb-4" />

      <motion.div
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="glass-card overflow-hidden !rounded-3xl"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((u) => (
            <UpdateRow key={u.id} update={u} isSheet={sheetUpdates.includes(u)} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-[15px] text-ink-400">
            इस श्रेणी में अभी कोई अपडेट नहीं · No updates in this category yet
          </p>
        )}
      </motion.div>

      {canLoadMore && (
        <motion.button
          type="button"
          onClick={() => setExpanded(true)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport15}
          className="glass-card mt-4 flex w-full items-center justify-center gap-2 !rounded-full py-3.5 text-[15.5px] font-semibold text-ink-900 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> और अपडेट देखें ({filtered.length - 6}) · View more
        </motion.button>
      )}
    </section>
  );
}

function UpdateRow({ update: u, isSheet }: { update: LiveUpdate; isSheet: boolean }) {
  const { t } = useLang();
  const meta = liveUpdateCategoryMeta[u.category];
  const Icon = CATEGORY_ICONS[u.category];
  const external = u.href.startsWith('http');

  const inner = (
    <>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.chip}`}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.chip}`}>
            {t(meta.label)}
          </span>
          {isSheet && (
            <span className="rounded-full bg-terracotta-600 px-2 py-0.5 text-[10.5px] font-bold text-white">
              NEW
            </span>
          )}
          {u.date && (
            <span className="font-mono text-[12px] text-ink-400">{fmtDate(u.date)}</span>
          )}
        </span>
        <span className="mt-1 block truncate text-[15px]/[22px] font-medium text-ink-600 md:text-[15.5px]">
          {t(u.text)}
        </span>
      </span>
      {external ? (
        <ExternalLink className="h-4 w-4 shrink-0 text-ink-400" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );

  const cls =
    'group flex items-center gap-3 border-b border-black/5 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-white/40 md:px-5';

  return (
    <motion.div variants={rise} layout exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}>
      {external ? (
        <a href={u.href} target="_blank" rel="noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <Link to={u.href} className={cls}>
          {inner}
        </Link>
      )}
    </motion.div>
  );
}
