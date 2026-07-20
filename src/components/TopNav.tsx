import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Menu, Search, X } from 'lucide-react';
import { useLang } from '@/lib/lang';
import { useSearch } from '@/lib/search';
import { categories } from '@/lib/data';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

const desktopLinks = [
  { to: '/jobs', hi: 'नौकरी', en: 'Jobs' },
  { to: '/schemes', hi: 'योजनाएँ', en: 'Schemes' },
  { to: '/services', hi: 'सेवाएँ', en: 'Services' },
  { to: '/tools', hi: 'टूल्स', en: 'Tools' },
  { to: '/office', hi: 'ऑफिस', en: 'Office' },
];

/** EN | हिं pill with sliding thumb (design.md §10.1). */
function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="glass-inset relative flex h-9 items-center rounded-full p-1 text-[13px] font-semibold">
      {(['en', 'hi'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={cn(
            'relative z-10 flex h-7 w-9 items-center justify-center rounded-full transition-colors duration-200',
            lang === l ? 'text-white' : 'text-ink-600'
          )}
          aria-pressed={lang === l}
        >
          {lang === l && (
            <motion.span
              layoutId="lang-thumb"
              className="absolute inset-0 -z-10 rounded-full bg-terracotta-600"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          {l === 'en' ? 'EN' : 'हिं'}
        </button>
      ))}
    </div>
  );
}

export default function TopNav() {
  const { t } = useLang();
  const { openSearch } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch]);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-200',
          scrolled
            ? 'bg-[#FBF6EA]/92 backdrop-blur-[24px] backdrop-saturate-[1.6] border-black/5 shadow-glass-sm'
            : 'bg-[#FBF6EA]/80 backdrop-blur-[24px] backdrop-saturate-[1.6] border-white/70'
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 transition-all duration-200 md:px-6 lg:px-8',
            scrolled ? 'h-14' : 'h-16'
          )}
        >
          {/* brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img src="/logo.svg" alt="SevaSathi logo" className="h-9 w-9" />
            <span className="leading-none">
              <span className="block font-display text-[20px] font-bold text-ink-900">SevaSathi</span>
              <span className="block text-[11px] font-medium text-ink-400">सबका डिजिटल साथी</span>
            </span>
          </Link>

          {/* center search pill (lg+) */}
          <button
            type="button"
            onClick={() => openSearch()}
            className="glass-inset hidden h-11 w-80 items-center gap-2.5 rounded-full px-4 text-[14px] text-ink-400 transition-colors hover:text-ink-600 lg:flex"
          >
            <Search size={17} className="text-terracotta-600" />
            <span className="flex-1 text-left">खोजें… jobs, schemes, tools</span>
            <kbd className="rounded-md border border-black/10 bg-white/60 px-1.5 py-0.5 font-mono text-[11px] text-ink-400">⌘K</kbd>
          </button>

          {/* right cluster */}
          <div className="flex items-center gap-2.5">
            <nav className="hidden items-center gap-1 xl:flex">
              {desktopLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors',
                      isActive ? 'bg-terracotta-100 text-terracotta-700' : 'text-ink-600 hover:text-terracotta-600'
                    )
                  }
                >
                  {l.hi}
                </NavLink>
              ))}
            </nav>
            <LangToggle />
            <button
              type="button"
              aria-label="मेनू खोलें"
              onClick={() => setDrawer(true)}
              className="glass-inset flex h-10 w-10 items-center justify-center rounded-full text-ink-900 active:scale-95 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile mega-drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink-900/30 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawer(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="glass-strong absolute right-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col overflow-y-auto rounded-l-[28px] p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.svg" alt="" className="h-9 w-9" />
                  <span className="font-display text-[18px] font-bold text-ink-900">SevaSathi</span>
                </div>
                <button
                  type="button"
                  aria-label="मेनू बंद करें"
                  onClick={() => setDrawer(false)}
                  className="glass-inset flex h-10 w-10 items-center justify-center rounded-full text-ink-900 active:scale-95"
                >
                  <X size={19} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDrawer(false);
                  openSearch();
                }}
                className="glass-inset mt-5 flex h-12 items-center gap-2.5 rounded-full px-4 text-[14.5px] text-ink-400"
              >
                <Search size={17} className="text-terracotta-600" />
                खोजें… jobs, schemes, tools
              </button>

              <p className="mt-5 px-1 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-amber-600">
                श्रेणियाँ · Categories
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {categories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.id}
                      to={c.href}
                      onClick={() => setDrawer(false)}
                      className="glass-card flex items-center gap-2.5 !rounded-2xl p-3 active:scale-95"
                    >
                      <span className={cn('icon-disc h-9 w-9', tintDiscBg[c.tint])}>
                        <Icon size={17} strokeWidth={1.75} className={tintIcon[c.tint]} />
                      </span>
                      <span className="text-[13.5px]/[17px] font-semibold text-ink-900">{t(c.title)}</span>
                    </Link>
                  );
                })}
              </div>

              <Link
                to="/search"
                onClick={() => setDrawer(false)}
                className="glass-card mt-4 flex items-center gap-3 !rounded-2xl p-3.5 active:scale-95"
              >
                <span className="icon-disc h-9 w-9 bg-leaf-100">
                  <Bookmark size={17} className="text-leaf-600" />
                </span>
                <span className="text-[14px] font-semibold text-ink-900">
                  सहेजी गई चीज़ें <span className="text-[12px] font-medium text-ink-400">· Bookmarks</span>
                </span>
              </Link>

              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between rounded-2xl bg-white/50 p-3">
                  <span className="text-[13.5px] font-semibold text-ink-900">भाषा · Language</span>
                  <LangToggle />
                </div>
                <p className="mt-4 text-center text-[11.5px] text-ink-400">
                  हम सरकारी वेबसाइट नहीं हैं · Not a government website
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
