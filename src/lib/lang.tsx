import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/** Bilingual string pair — Hindi leads by default, English follows. */
export interface Bi {
  hi: string;
  en: string;
}

export type Lang = 'hi' | 'en';

const STORAGE_KEY = 'ss-lang';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Lead language string for the pair. */
  t: (pair: Bi) => string;
  /** Secondary (follower) language string for the pair. */
  s: (pair: Bi) => string;
}

const Ctx = createContext<LangCtx | null>(null);

function readInitial(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'en' || v === 'hi') return v;
  } catch {
    /* private mode */
  }
  return 'hi';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode */
    }
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((p) => (p === 'hi' ? 'en' : 'hi')), []);
  const t = useCallback((pair: Bi) => (lang === 'hi' ? pair.hi : pair.en), [lang]);
  const s = useCallback((pair: Bi) => (lang === 'hi' ? pair.en : pair.hi), [lang]);

  const value = useMemo(() => ({ lang, setLang, toggle, t, s }), [lang, setLang, toggle, t, s]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}

/**
 * Bilingual lockup (design.md §3): lead language in current color,
 * follower at 0.72× in ink-400, separated by `·`.
 */
export function BiText({ pair, className = '', sep = ' · ' }: { pair: Bi; className?: string; sep?: string }) {
  const { t, s } = useLang();
  return (
    <span className={className}>
      {t(pair)}
      <span className="text-ink-400 font-normal" style={{ fontSize: '0.72em' }}>
        {sep}
        {s(pair)}
      </span>
    </span>
  );
}
