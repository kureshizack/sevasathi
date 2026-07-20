import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, TrendingUp, X } from 'lucide-react';
import { useSearch } from '@/lib/search';
import { useLang } from '@/lib/lang';
import { instantSearch, trendingSearches, categories } from '@/lib/data';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

/**
 * SearchOverlay (design.md §10.15): full-screen on mobile, centered
 * 640px dialog on desktop; glass-strong; trending chips → category
 * pills → instant grouped results; Esc closes.
 */
export default function SearchOverlay() {
  const { open, prefill, closeSearch } = useSearch();
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery(prefill);
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = 'hidden';
      return () => {
        window.clearTimeout(id);
        document.body.style.overflow = '';
      };
    }
  }, [open, prefill]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeSearch]);

  const results = useMemo(() => instantSearch(query), [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] bg-ink-900/30 backdrop-blur-sm"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong absolute inset-x-0 top-0 mx-auto flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-b-[28px] p-4 md:inset-x-4 md:top-16 md:max-w-[640px] md:rounded-[28px] md:p-6 lg:inset-x-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* input row */}
            <div className="glass-inset flex h-14 items-center gap-3 rounded-full px-5">
              <Search size={20} className="shrink-0 text-terracotta-600" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="खोजें… jobs, schemes, tools"
                className="h-full w-full bg-transparent text-[18px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={() => setQuery('')}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-ink-600 active:scale-90"
                >
                  <X size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Close"
                  onClick={closeSearch}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-ink-600 active:scale-90"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="no-scrollbar mt-4 flex-1 overflow-y-auto">
              {results.length === 0 && query.trim() !== '' ? (
                /* EmptyState (§10.19) */
                <div className="flex flex-col items-center px-4 py-8 text-center">
                  <img src="/empty-search.png" alt="" className="w-40" loading="lazy" />
                  <p className="mt-3 font-display text-[18px] font-semibold text-ink-900">
                    कुछ नहीं मिला <span className="text-[13px] font-medium text-ink-400">· Nothing found</span>
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['PAN Card', 'SSC Jobs', 'फोटो Compress'].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setQuery(sug)}
                        className="glass-card !rounded-full px-4 py-2 text-[13.5px] font-semibold text-terracotta-600 active:scale-95"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <p className="px-2 pb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600">
                    परिणाम · Results
                  </p>
                  {results.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        to={r.href}
                        onClick={closeSearch}
                        className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white/50"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[15.5px] font-semibold text-ink-900">{t(r.title)}</span>
                          <span className="text-[12.5px] text-ink-400">{t(r.kind)}</span>
                        </span>
                        <span className="shrink-0 text-terracotta-600">→</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-5 pb-2">
                  {/* trending */}
                  <div>
                    <p className="flex items-center gap-1.5 px-2 pb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600">
                      <TrendingUp size={13} /> ट्रेंडिंग · Trending
                    </p>
                    <div className="flex flex-wrap gap-2 px-1">
                      {trendingSearches.map((tr) => (
                        <button
                          key={tr}
                          type="button"
                          onClick={() => setQuery(tr)}
                          className="glass-card !rounded-full px-4 py-2 text-[13.5px] font-medium text-ink-600 transition-colors hover:text-terracotta-600 active:scale-95"
                        >
                          {tr}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* category pills */}
                  <div>
                    <p className="px-2 pb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600">
                      श्रेणियाँ · Categories
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {categories.map((c) => {
                        const Icon = c.icon;
                        return (
                          <Link
                            key={c.id}
                            to={c.href}
                            onClick={closeSearch}
                            className="glass-card flex items-center gap-2.5 !rounded-2xl px-3 py-2.5 active:scale-95"
                          >
                            <span className={cn('icon-disc h-8 w-8', tintDiscBg[c.tint])}>
                              <Icon size={15} strokeWidth={1.75} className={tintIcon[c.tint]} />
                            </span>
                            <span className="truncate text-[13px] font-semibold text-ink-900">{t(c.title)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
