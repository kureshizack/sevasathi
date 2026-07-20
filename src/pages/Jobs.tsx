import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  X,
  MessageCircle,
  Send,
  Ticket,
  FileCheck2,
  FileKey2,
  ChevronRight,
  Plus,
  Bookmark,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  jobs,
  jobHubStats,
  urgentJobIds,
  jobFeedIds,
  jobFeedMoreIds,
  comingSoonJobIds,
  jobHubAdmitCards,
  jobHubResults,
  jobHubAnswerKeys,
  jobHelpServices,
  jobsFaqs,
  deadlineInfo,
} from '@/lib/data';
import type { Job, JobHubListItem, Tint } from '@/lib/data';
import { useSheetJobs } from '@/lib/sheetData';
import JobCard from '@/components/JobCard';
import DeadlineBadge from '@/components/DeadlineBadge';
import FilterPills from '@/components/FilterPills';
import type { Pill } from '@/components/FilterPills';
import FAQAccordion from '@/components/FAQAccordion';
import SectionHeader from '@/components/SectionHeader';
import ServiceCard from '@/components/ServiceCard';
import CountUp from '@/components/CountUp';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { useBookmarks } from '@/lib/bookmarks';
import { rise, pop, stagger, viewport15, easeOutExpo } from '@/lib/motion';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Tabs & filters                                                      */
/* ------------------------------------------------------------------ */

type TabId = 'jobs' | 'admit' | 'results' | 'keys';

const tabs: { id: TabId; hi: string; en: string }[] = [
  { id: 'jobs', hi: 'नौकरियाँ', en: 'Jobs' },
  { id: 'admit', hi: 'एडमिट कार्ड', en: 'Admit Cards' },
  { id: 'results', hi: 'रिज़ल्ट', en: 'Results' },
  { id: 'keys', hi: 'आंसर की', en: 'Answer Keys' },
];

interface JobFilter {
  id: string;
  label: string;
  match: (j: Job) => boolean;
}

const jobFilters: JobFilter[] = [
  { id: 'all', label: 'सभी', match: () => true },
  { id: 'railway', label: 'Railway', match: (j) => j.tags.includes('railway') },
  { id: 'ssc', label: 'SSC', match: (j) => j.tags.includes('ssc') },
  { id: 'banking', label: 'Banking', match: (j) => j.tags.includes('bank') },
  { id: 'police', label: 'Police', match: (j) => j.tags.includes('police') },
  { id: 'defence', label: 'Defence', match: (j) => j.tags.includes('defence') },
  { id: 'teaching', label: 'Teaching', match: (j) => j.tags.includes('teaching') },
  { id: 'state', label: 'State', match: (j) => j.tags.includes('state') },
  { id: '10th-12th', label: '10th/12th Pass', match: (j) => j.tags.includes('10th') || j.tags.includes('12th') },
];

const comingSoonSet = new Set(comingSoonJobIds);

function jobMatchesQuery(job: Job, q: string): boolean {
  if (!q) return true;
  const hay = [job.title, job.org.hi, job.org.en, job.orgShort, job.qualification, ...job.tags].join(' ').toLowerCase();
  return hay.includes(q);
}

/* ------------------------------------------------------------------ */
/* Coming-soon variant of JobCard (Railway Group D — jobs.md §3)       */
/* ------------------------------------------------------------------ */

function ComingSoonJobCard({ job }: { job: Job }) {
  const { t } = useLang();
  const { toast } = useToast();
  const { has, toggle } = useBookmarks();
  const saved = has(job.id);

  return (
    <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.12 }} className="glass-card flex h-full flex-col p-5">
      <div className="flex items-start gap-3.5">
        <span className={cn('icon-disc h-12 w-12 font-display text-[15px] font-bold', tintDiscBg[job.tint], tintIcon[job.tint])}>
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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cocoa-100 px-3 py-1 text-[12.5px] font-semibold text-cocoa-500">
          जल्द आ रहा है <span className="font-normal">· Coming Soon</span>
        </span>
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
              saved ? 'bg-leaf-100 text-leaf-600' : 'text-ink-400 hover:bg-leaf-100/60 hover:text-leaf-600'
            )}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <Link to="/article" className="group flex items-center gap-1 text-[14px] font-semibold text-terracotta-600">
            विवरण
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* List-row panel for Admit Card / Result / Answer Key tabs            */
/* ------------------------------------------------------------------ */

interface ListPanelProps {
  items: JobHubListItem[];
  icon: LucideIcon;
  tint: Tint;
  cta: string;
  ctaClass: string;
  query: string;
}

function ListPanel({ items, icon: Icon, tint, cta, ctaClass, query }: ListPanelProps) {
  const visible = items.filter((it) => !query || it.title.toLowerCase().includes(query));
  if (visible.length === 0) {
    return (
      <div className="glass-inset rounded-2xl p-6 text-center text-[14px] text-ink-400">
        कुछ नहीं मिला · Nothing found
      </div>
    );
  }
  return (
    <motion.div variants={stagger(0.04)} initial="hidden" animate="show" className="glass-card flex flex-col p-3 md:p-4">
      {visible.map((item) => (
        <motion.div key={item.id} variants={rise}>
          <Link to="/article" className="group flex items-center gap-3.5 rounded-2xl px-3 py-3 transition-colors hover:bg-white/50">
            <span className={cn('icon-disc h-11 w-11', tintDiscBg[tint])}>
              <Icon size={20} strokeWidth={1.75} className={tintIcon[tint]} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-[15px] font-semibold text-ink-900">{item.title}</span>
                {item.live && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-leaf-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-leaf-600 animate-pulse-dot" />
                    LIVE
                  </span>
                )}
              </span>
              <span className="block font-mono text-[12px] text-ink-400">{item.meta}</span>
            </span>
            {item.chip && (
              <span className="hidden shrink-0 rounded-full bg-cocoa-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-cocoa-500 sm:inline-flex">
                {item.chip}
              </span>
            )}
            <span className={cn('flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[12.5px] font-semibold', ctaClass)}>
              {cta}
              <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Jobs hub page (design/jobs.md)                                      */
/* ------------------------------------------------------------------ */

export default function Jobs() {
  const { t } = useLang();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabId>('jobs');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const jobsById = useMemo(() => new Map(jobs.map((j) => [j.id, j])), []);
  const sheetJobs = useSheetJobs(); // daily updates from owner's Google Sheet (Jobs tab)
  const urgentJobs = useMemo(
    () => urgentJobIds.map((id) => jobsById.get(id)).filter((j): j is Job => Boolean(j)),
    [jobsById]
  );
  const feedPool = useMemo(
    () => [
      ...sheetJobs,
      ...[...jobFeedIds, ...jobFeedMoreIds]
        .map((id) => jobsById.get(id))
        .filter((j): j is Job => Boolean(j)),
    ],
    [jobsById, sheetJobs]
  );

  const q = query.trim().toLowerCase();
  const activeFilter = jobFilters.find((f) => f.id === filter) ?? jobFilters[0];
  const filteredFeed = feedPool.filter((j) => activeFilter.match(j) && jobMatchesQuery(j, q));
  const visibleFeed = expanded ? filteredFeed : filteredFeed.slice(0, 8);
  const canLoadMore = !expanded && filteredFeed.length > 8;

  const pills: Pill[] = jobFilters.map((f) => ({
    id: f.id,
    label: f.label,
    count: f.id === 'all' ? undefined : feedPool.filter((j) => f.match(j)).length,
  }));

  return (
    <>
      {/* ---------- Section 1 — Page hero ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 pt-8 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="glass-card glass-tint-terracotta relative overflow-hidden p-6 md:p-10"
        >
          <div aria-hidden className="mandala-overlay pointer-events-none absolute inset-0" />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600 md:text-[13px]">
              Sarkari Naukri
            </p>
            <h1 className="mt-2 font-display text-[28px]/[34px] font-bold text-ink-900 md:text-[42px]/[48px]">
              सरकारी नौकरी
            </h1>
            <p className="mt-2 text-[15px]/[24px] text-ink-400 md:text-[16px]/[26px]">
              Govt Jobs, Admit Cards, Results &amp; Answer Keys — updated daily
            </p>

            <div className="glass-inset mt-6 flex h-12 max-w-[560px] origin-left items-center gap-2.5 rounded-full px-4 transition-transform duration-200 focus-within:scale-x-[1.04]">
              <Search size={19} strokeWidth={1.75} className="shrink-0 text-ink-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setExpanded(false);
                }}
                placeholder="नौकरी खोजें… e.g. railway, SSC, 12th pass"
                className="w-full bg-transparent text-[15.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  aria-label="साफ़ करें"
                  onClick={() => setQuery('')}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-white/60 hover:text-ink-900"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <motion.div
              variants={stagger(0.06, 0.2)}
              initial="hidden"
              animate="show"
              className="mt-6 flex flex-wrap gap-2.5"
            >
              {jobHubStats.map((stat) => (
                <motion.span
                  key={stat.id}
                  variants={pop}
                  className="glass-inset flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold text-ink-600"
                >
                  {t(stat.label)}
                  <span className="font-mono text-[15px] font-semibold text-terracotta-600">
                    <CountUp value={stat.value} />
                  </span>
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ---------- Section 2 — Urgency band ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 lg:px-8">
        <SectionHeader kicker="Urgent" title={{ hi: 'इस हफ्ते आखिरी तारीख', en: 'Closing This Week' }} />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport15}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewport15}
            className="scroll-fade-x no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0 lg:grid lg:snap-none lg:grid-cols-4 lg:overflow-visible"
          >
            {urgentJobs.map((job) => (
              <motion.div key={job.id} variants={pop} className="w-[248px] shrink-0 snap-start lg:w-auto">
                <Link to="/article" className="glass-urgent group block h-full p-4 transition-transform duration-200 active:scale-[0.98] lg:hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <span className={cn('icon-disc h-11 w-11 font-display text-[13px] font-bold', tintDiscBg[job.tint], tintIcon[job.tint])}>
                      {job.orgShort.slice(0, 4)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px]/[20px] font-semibold text-ink-900">{job.title}</h3>
                      <p className="text-[12.5px] text-ink-400">
                        पद <span className="font-mono font-semibold text-ink-600">{job.posts}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <DeadlineBadge lastDate={job.lastDate} />
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-terracotta-600">
                      Apply गाइड
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ---------- Section 3 — Tabs + filters + feed ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 pb-14 md:px-6 lg:px-8">
        <div className="sticky top-16 z-40">
          <div className="glass-strong no-scrollbar flex gap-1 overflow-x-auto rounded-full p-1.5">
            {tabs.map((tb) => {
              const active = tb.id === tab;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => {
                    setTab(tb.id);
                    setExpanded(false);
                  }}
                  className="relative flex h-11 flex-1 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 text-[14.5px] font-semibold transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="jobs-tab-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-terracotta-600 shadow-warm"
                    />
                  )}
                  <span className={cn('relative z-10', active ? 'text-white' : 'text-ink-600')}>
                    {tb.hi}{' '}
                    <span className={cn('text-[11px] font-medium', active ? 'text-white/80' : 'text-ink-400')}>{tb.en}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {tab === 'jobs' && (
            <FilterPills
              pills={pills}
              active={filter}
              onChange={(id) => {
                setFilter(id);
                setExpanded(false);
              }}
              className="mt-3"
            />
          )}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
            >
              {tab === 'jobs' && (
                <>
                  {visibleFeed.length === 0 ? (
                    <div className="glass-inset rounded-2xl p-6 text-center text-[14px] text-ink-400">
                      कुछ नहीं मिला · Nothing found
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <AnimatePresence mode="popLayout">
                        {visibleFeed.map((job, i) => (
                          <motion.div
                            key={`${filter}-${job.id}`}
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.04, ease: easeOutExpo }}
                          >
                            {comingSoonSet.has(job.id) ? (
                              <ComingSoonJobCard job={job} />
                            ) : (
                              <JobCard job={job} urgent={deadlineInfo(job.lastDate).daysLeft <= 2} />
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                  {canLoadMore && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: easeOutExpo }}
                      onClick={() => setExpanded(true)}
                      className="glass-card mt-6 flex w-full items-center justify-center gap-2 !rounded-full py-3.5 text-[15.5px] font-semibold text-ink-900 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      और दिखाएं · Load more
                      <Plus size={16} className="text-terracotta-600" />
                    </motion.button>
                  )}
                </>
              )}
              {tab === 'admit' && (
                <ListPanel
                  items={jobHubAdmitCards}
                  icon={Ticket}
                  tint="leaf"
                  cta="Download गाइड"
                  ctaClass="bg-leaf-100 text-leaf-600"
                  query={q}
                />
              )}
              {tab === 'results' && (
                <ListPanel
                  items={jobHubResults}
                  icon={FileCheck2}
                  tint="amber"
                  cta="Result देखें"
                  ctaClass="bg-amber-100 text-amber-600"
                  query={q}
                />
              )}
              {tab === 'keys' && (
                <ListPanel
                  items={jobHubAnswerKeys}
                  icon={FileKey2}
                  tint="cocoa"
                  cta="देखें"
                  ctaClass="bg-cocoa-100 text-cocoa-500"
                  query={q}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------- Section 4 — Job alert band ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport15}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="glass-card glass-tint-leaf flex flex-col items-start gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div>
            <h3 className="font-display text-[19px]/[26px] font-semibold text-ink-900 md:text-[24px]/[30px]">
              नई नौकरी की जानकारी WhatsApp पर
            </h3>
            <p className="mt-1 text-[15px]/[24px] text-ink-600">रोज़ सुबह 8 बजे — फ्री, कोई स्पैम नहीं।</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toast('✓ लिंक खुल रहा है…')}
              className="inline-flex h-12 animate-breathe items-center gap-2 rounded-full bg-leaf-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(62,107,80,0.55)] transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <MessageCircle size={18} strokeWidth={1.75} />
              WhatsApp से जुड़ें
            </button>
            <button
              type="button"
              onClick={() => toast('✓ लिंक खुल रहा है…')}
              className="glass-card inline-flex h-12 items-center gap-2 !rounded-full px-6 text-[15px] font-semibold text-ink-900 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Send size={17} strokeWidth={1.75} className="text-terracotta-600" />
              Telegram
            </button>
          </div>
        </motion.div>
      </section>

      {/* ---------- Section 5 — Help strip + FAQ ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8">
        <SectionHeader kicker="Help & Guides" title={{ hi: 'नौकरी मदद', en: 'Job Help' }} />
        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="grid gap-4 md:grid-cols-3"
        >
          {jobHelpServices.map((service) => (
            <motion.div key={service.id} variants={rise}>
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-14">
          <SectionHeader kicker="FAQ" title={{ hi: 'सवाल-जवाब', en: 'FAQs' }} />
          <motion.div
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={viewport15}
          >
            <motion.div variants={rise}>
              <FAQAccordion faqs={jobsFaqs} />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
