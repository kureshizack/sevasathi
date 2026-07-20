import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface SearchCtx {
  open: boolean;
  prefill: string;
  openSearch: (prefill?: string) => void;
  closeSearch: () => void;
}

const Ctx = createContext<SearchCtx | null>(null);

/** Coordinates the global SearchOverlay (nav pill, ⌘K, FAB, hero bar). */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState('');

  const openSearch = useCallback((q?: string) => {
    setPrefill(q ?? '');
    setOpen(true);
  }, []);
  const closeSearch = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, prefill, openSearch, closeSearch }), [open, prefill, openSearch, closeSearch]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSearch(): SearchCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSearch must be used inside <SearchProvider>');
  return ctx;
}
