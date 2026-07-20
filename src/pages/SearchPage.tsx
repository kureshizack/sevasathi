import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, History, Mic, Search, TrendingUp, X } from 'lucide-react';
import CategoryTile from '@/components/CategoryTile';
import DeadlineBadge from '@/components/DeadlineBadge';
import FilterPills, { type Pill } from '@/components/FilterPills';
import {
  categories,
  clearRecentSearches,
  highlightText,
  pushRecentSearch,
  readRecentSearches,
  removeRecentSearch,
  searchAll,
  searchGroups,
  searchPagePlaceholders,
  suggestSearches,
  trendingSearches,
} from '@/lib/data';
import type { SearchEntry, SearchGroupId } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { useSearch } from '@/lib/search';
import { easeOutExpo, pop, rise, stagger, viewport15 } from '@/lib/motion';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

const WA_URL = 'https://wa.me/919999999999?text=SevaSathi%20Search';

/** Filter pills (search.md §3): exact bilingual labels, mapped to groups. */
const FILTER_PILLS: Array<{ id: 'all' | SearchGroupId; label: string }> = [
  { id: 'all', label: 'सभी All' },
  { id: 'jobs', label: 'नौकरियाँ' },
  { id: 'schemes', label: 'योजनाएँ' },
  { id: 'services', label: 'सेवाएँ' },
  { id: 'tools', label: 'Tools' },
  { id: 'guides', label: 'गाइड' },
  { id: 'office', label: 'Office' },
  { id: 'scholarships', label: 'Scholarships' },
];

/** Matched ranges wrapped in <mark> — amber-100 bg, terracotta-700 text (search.md §3). */
function Marked({ text, query }: { text: string; query: string }) {
  const parts = highlightText(text, query);
  if (parts.length === 1 && !parts[0].hit) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <motion.mark
            key={i}
            initial={{ backgroundColor: 'rgba(248,236,211,0)' }}
            animate={{ backgroundColor: 'rgba(248,236,211,1)' }}
            transition={{ duration: 0.15 }}
            className="rounded px-0.5 text-terracotta-700"
          >
            {p.text}
          </motion.mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

/** Result row (search.md §3): 40px icon disc → highlighted title → meta → badge/chip/chevron. */
function ResultRow({
  entry,
  query,
  index,
  onOpen,
}: {
  entry: SearchEntry;
  query: string;
  index: number;
  onOpen: () => void;
}) {
  const { t } = useLang();
  const Icon = entry.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 12) * 0.035, duration: 0.3, ease: easeOutExpo }}
    >
      <Link
        to={entry.href}
        onClick={onOpen}
        className="glass-card group flex items-center gap-3 !rounded-2xl p-3.5 transition-colors duration-200 hover:bg-white/70 active:scale-[0.99]"
      >
        <span className={cn('icon-disc h-10 w-10', tintDiscBg[entry.tint])}>
          <Icon size={18} strokeWidth={1.75} className={tintIcon[entry.tint]} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15.5px] font-semibold text-ink-900">
            <Marked text={t(entry.title)} query={query} />
          </span>
          <span className="block truncate text-[13px] text-ink-400">
            {t(entry.kind)} · {t(entry.meta)}
          </span>
        </span>
        {entry.lastDate && (
          <span className="hidden shrink-0 sm:inline-flex">
            <DeadlineBadge lastDate={entry.lastDate} />
          </span>
        )}
        {entry.tool && (
          <span className="hidden shrink-0 rounded-full bg-leaf-100 px-2.5 py-1 text-[11.5px] font-semibold text-leaf-700 sm:inline-flex">
            टूल · Tool
          </span>
        )}
        <ChevronRight
          size={18}
          className="shrink-0 text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-terracotta-600"
        />
      </Link>
    </motion.div>
  );
}

/**
 * Search page (search.md): forgiving instant trilingual search —
 * sticky glass header, trending/recent chips, grouped highlighted
 * results, fuzzy empty state, popular categories footer block.
 * Shares its engine (data.ts searchAll) with the global SearchOverlay.
 */
export default function SearchPage() {
  const { t, s } = useLang();
  const { open: overlayOpen } = useSearch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<'all' | SearchGroupId>('all');
  const [recent, setRecent] = useState<string[]>(readRecentSearches);
  const [phIndex, setPhIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  /** last value the URL param and the input agreed on (deep-link guard) */
  const lastSynced = useRef(initialQuery);

  const hasQuery = query.trim() !== '';

  /* debounce 150ms (search.md §3) */
  useEffect(() => {
    const id = window.setTimeout(() => {
      setQuery(input);
      setFilter('all');
    }, 150);
    return () => window.clearTimeout(id);
  }, [input]);

  /* two-way ?q= sync: write on settled query, adopt external deep links */
  useEffect(() => {
    const cur = searchParams.get('q') ?? '';
    if (cur === query) {
      lastSynced.current = query;
      return;
    }
    if (lastSynced.current !== cur) {
      /* param changed externally (e.g. overlay deep link) → adopt it */
      lastSynced.current = cur;
      setInput(cur);
      setQuery(cur);
      return;
    }
    lastSynced.current = query;
    setSearchParams(query.trim() ? { q: query } : {}, { replace: true });
  }, [query, searchParams, setSearchParams]);

  /* cycling placeholder (search.md §1) */
  useEffect(() => {
    const id = window.setInterval(() => setPhIndex((i) => (i + 1) % searchPagePlaceholders.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  /* autofocus on desktop only (search.md §1) */
  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) inputRef.current?.focus();
  }, []);

  /* keyboard: `/` focuses input, Esc clears (search.md §3) */
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (overlayOpen) return;
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && query) {
        setInput('');
        setQuery('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlayOpen, query]);

  const results = useMemo(() => searchAll(query), [query]);
  const visible = useMemo(
    () => (filter === 'all' ? results : results.filter((r) => r.group === filter)),
    [results, filter]
  );
  const grouped = useMemo(
    () =>
      searchGroups
        .map((g) => ({ group: g, items: visible.filter((r) => r.group === g.id) }))
        .filter((x) => x.items.length > 0),
    [visible]
  );
  const rankOf = useMemo(() => {
    const m = new Map<string, number>();
    visible.forEach((r, i) => m.set(r.id, i));
    return m;
  }, [visible]);
  const suggestions = useMemo(
    () => (hasQuery && results.length === 0 ? suggestSearches(query, 3) : []),
    [hasQuery, results, query]
  );

  const pills: Pill[] = useMemo(
    () =>
      FILTER_PILLS.map((p) => ({
        id: p.id,
        label: p.label,
        count: p.id === 'all' ? results.length : results.filter((r) => r.group === p.id).length,
      })),
    [results]
  );

  /* chip tap: fill input + search instantly (search.md §2) */
  const runSearch = (q: string) => {
    setInput(q);
    setQuery(q);
    setFilter('all');
  };
  const chipSearch = (q: string) => {
    runSearch(q);
    setRecent(pushRecentSearch(q));
  };
  const saveRecent = () => {
    if (query.trim()) setRecent(pushRecentSearch(query));
  };
  const openEntry = (entry: SearchEntry) => {
    saveRecent();
    navigate(entry.href);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    /* Enter → first result (search.md §3) */
    if (e.key === 'Enter' && visible.length > 0) {
      e.preventDefault();
      openEntry(visible[0]);
    }
  };

  const stateKey = !hasQuery ? 'idle' : results.length === 0 ? `empty-${query}` : `res-${query}-${filter}`;

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[820px]">
        {/* Section 1 — header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
          className="pt-8 text-center"
        >
          <h1 className="font-display text-[23px]/[30px] font-bold text-ink-900 lg:text-[32px]/[38px]">
            क्या ढूंढ रहे हैं?
          </h1>
          <p className="mt-1 text-[15px] text-ink-400">Search jobs, schemes, guides, tools</p>
        </motion.div>

        {/* Section 1 — sticky glass-strong search panel (top-16, z-40) */}
        <div className="glass-strong sticky top-16 z-40 mt-5 rounded-[28px] p-3 md:p-4">
          <motion.div
            animate={{ scale: focused ? 1.005 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="glass-inset flex h-14 items-center gap-3 rounded-full px-5 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-amber-500/60"
          >
            <Search size={20} className="shrink-0 text-terracotta-600" />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={searchPagePlaceholders[phIndex]}
              aria-label="खोजें · Search"
              className="h-full w-full bg-transparent text-[18px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
            <AnimatePresence>
              {input && (
                <motion.button
                  key="clear"
                  type="button"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  aria-label="साफ़ करें · Clear"
                  onClick={() => {
                    setInput('');
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-ink-600 active:scale-90"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
            <span
              title="जल्द आ रहा है"
              aria-label="वॉइस सर्च — जल्द आ रहा है"
              className="flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-black/5 text-ink-400"
            >
              <Mic size={17} strokeWidth={1.75} />
            </span>
          </motion.div>
          <p className="px-2 pt-2 text-[13px] text-ink-400">Hindi, English या Hinglish — किसी में भी लिखें।</p>

          {/* Section 3 — FilterPills, sticky inside the search header */}
          <AnimatePresence initial={false}>
            {hasQuery && (
              <motion.div
                key="filters"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: easeOutExpo }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <FilterPills pills={pills} active={filter} onChange={(id) => setFilter(id as 'all' | SearchGroupId)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* body: idle (trending/recent) ↔ results ↔ empty state */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stateKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
          >
            {!hasQuery ? (
              <div className="pt-8">
                {/* Section 2 — trending searches */}
                <section>
                  <p className="flex items-center gap-1.5 px-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600">
                    <TrendingUp size={13} /> ट्रेंडिंग · Trending
                  </p>
                  <motion.div variants={stagger(0.04)} initial="hidden" animate="show" className="mt-3 flex flex-wrap gap-2">
                    {trendingSearches.map((tr) => (
                      <motion.button
                        variants={pop}
                        key={tr}
                        type="button"
                        onClick={() => chipSearch(tr)}
                        className="glass-card !rounded-full px-4 py-2 text-[13.5px] font-medium text-ink-600 transition-colors hover:text-terracotta-600 active:scale-95"
                      >
                        {tr}
                      </motion.button>
                    ))}
                  </motion.div>
                </section>

                {/* Section 2 — recent searches (localStorage["ss-recent"]) */}
                {recent.length > 0 && (
                  <section className="mt-8">
                    <div className="flex items-center justify-between px-1">
                      <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600">
                        <History size={13} /> हाल की खोज · Recent
                      </p>
                      <button
                        type="button"
                        onClick={() => setRecent(clearRecentSearches())}
                        className="link-underline text-[13px] font-medium"
                      >
                        साफ़ करें · Clear all
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <AnimatePresence initial={false}>
                        {recent.map((r) => (
                          <motion.div
                            layout
                            key={r}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                            className="glass-card flex items-center gap-0.5 !rounded-full py-1.5 pl-4 pr-1.5"
                          >
                            <button
                              type="button"
                              onClick={() => chipSearch(r)}
                              className="text-[13.5px] font-medium text-ink-600 transition-colors hover:text-terracotta-600"
                            >
                              {r}
                            </button>
                            <button
                              type="button"
                              aria-label={`हटाएँ ${r}`}
                              onClick={() => setRecent(removeRecentSearch(r))}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-black/5 hover:text-terracotta-600 active:scale-90"
                            >
                              <X size={12} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </section>
                )}
              </div>
            ) : results.length === 0 ? (
              /* Section 4 — empty state */
              <div className="flex flex-col items-center py-20 text-center">
                <motion.img
                  src="/empty-search.png"
                  alt=""
                  loading="lazy"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: easeOutExpo }}
                  className="w-40"
                />
                <h3 className="mt-4 font-display text-[19px]/[26px] font-semibold text-ink-900">
                  कुछ नहीं मिला <span className="text-[13.5px] font-medium text-ink-400">· Nothing found</span>
                </h3>
                <p className="mt-2 text-[15px] text-ink-600">स्पेलिंग बदलकर देखें, या ये आज़माएं:</p>
                <motion.div
                  variants={stagger(0.06)}
                  initial="hidden"
                  animate="show"
                  className="mt-4 flex flex-wrap justify-center gap-2"
                >
                  {suggestions.map((sg) => (
                    <motion.button
                      variants={pop}
                      key={sg.id}
                      type="button"
                      onClick={() => chipSearch(t(sg.title))}
                      className="glass-card !rounded-full px-4 py-2 text-[13.5px] font-semibold text-terracotta-600 active:scale-95"
                    >
                      {t(sg.title)}
                    </motion.button>
                  ))}
                </motion.div>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline mt-6 inline-flex items-center gap-1 text-[15px] font-medium"
                >
                  WhatsApp पर पूछें →
                </a>
              </div>
            ) : (
              /* Section 3 — grouped results */
              <div className="flex flex-col gap-7 pt-7">
                {grouped.map(({ group, items }) => (
                  <section key={group.id}>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="px-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600"
                    >
                      {t(group.label)} · {s(group.label)} — {items.length}
                    </motion.p>
                    <div className="mt-3 flex flex-col gap-2.5">
                      {items.map((entry) => (
                        <ResultRow
                          key={entry.id}
                          entry={entry}
                          query={query}
                          index={rankOf.get(entry.id) ?? 0}
                          onOpen={saveRecent}
                        />
                      ))}
                    </div>
                  </section>
                ))}
                {filter !== 'all' && visible.length === 0 && results.length > 0 && (
                  <div className="py-10 text-center">
                    <p className="text-[15px] text-ink-600">इस श्रेणी में कोई परिणाम नहीं।</p>
                    <button type="button" onClick={() => setFilter('all')} className="link-underline mt-2 text-[15px] font-medium">
                      सभी परिणाम देखें · View all
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section 5 — popular categories footer block */}
      <section className="py-10">
        <div className="mb-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600">Popular categories</p>
          <h2 className="mt-1 font-display text-[19px]/[26px] font-semibold text-ink-900 lg:text-[24px]/[30px]">
            लोकप्रिय श्रेणियाँ <span className="text-[13.5px] font-medium text-ink-400">· Browse these</span>
          </h2>
        </div>
        <motion.div
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4"
        >
          {categories.map((c) => (
            <motion.div key={c.id} variants={rise}>
              <CategoryTile category={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
