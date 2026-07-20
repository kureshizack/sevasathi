import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Briefcase, House, Instagram, LayoutGrid, MessageCircle, Search, Send, Wrench, X, Youtube } from 'lucide-react';
import { useSearch } from '@/lib/search';
import { categories } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', label: 'होम', icon: House, match: (p: string) => p === '/' },
  { to: '/jobs', label: 'नौकरी', icon: Briefcase, match: (p: string) => p.startsWith('/jobs') },
  null, // center FAB slot
  { to: '/tools', label: 'टूल्स', icon: Wrench, match: (p: string) => p.startsWith('/tools') },
] as const;

/**
 * BottomNav (design.md §10.2): mobile only (<lg), fixed glass-strong,
 * 64px + safe-area. 5 slots with raised center Search FAB.
 */
export default function BottomNav() {
  const { pathname } = useLocation();
  const { openSearch } = useSearch();
  const { t } = useLang();
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheet]);

  const moreActive = ['/schemes', '/services', '/exams', '/office', '/lifehacks', '/article', '/search'].some((p) =>
    pathname.startsWith(p)
  );

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <div className="glass-strong border-t border-white/70 pb-safe">
          <div className="relative mx-auto flex h-16 max-w-[480px] items-stretch justify-between px-2">
            {tabs.map((tab) =>
              tab === null ? (
                <div key="fab" className="relative flex w-16 items-start justify-center">
                  <motion.button
                    type="button"
                    aria-label="खोजें · Search"
                    onClick={() => openSearch()}
                    whileTap={{ scale: 0.92 }}
                    className="absolute -top-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-full text-white ring-4 ring-cream-100 shadow-warm"
                    style={{ background: 'linear-gradient(135deg, #C0552B 0%, #D9A03F 100%)' }}
                  >
                    <Search size={22} strokeWidth={2.2} />
                  </motion.button>
                </div>
              ) : (
                <NavItem key={tab.to} {...tab} active={tab.match(pathname)} />
              )
            )}
            {/* More */}
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="relative flex w-16 flex-col items-center justify-center gap-0.5"
              aria-label="और · More"
            >
              {moreActive && (
                <motion.span
                  layoutId="bottomnav-pill"
                  className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-2xl bg-terracotta-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <LayoutGrid size={21} className={cn('relative z-10', moreActive ? 'text-terracotta-600' : 'text-ink-400')} />
              <span className={cn('relative z-10 text-[10.5px] font-semibold', moreActive ? 'text-terracotta-600' : 'text-ink-400')}>
                और
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* More bottom-sheet */}
      <AnimatePresence>
        {sheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink-900/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSheet(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="glass-strong absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-y-auto rounded-t-[28px] p-5 pb-[calc(24px+env(safe-area-inset-bottom,0px))]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink-400/30" />
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[19px] font-bold text-ink-900">
                  और देखें <span className="text-[13px] font-medium text-ink-400">· Explore more</span>
                </h2>
                <button
                  type="button"
                  aria-label="बंद करें"
                  onClick={() => setSheet(false)}
                  className="glass-inset flex h-9 w-9 items-center justify-center rounded-full text-ink-900 active:scale-95"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2.5">
                {categories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.id}
                      to={c.href}
                      onClick={() => setSheet(false)}
                      className="flex flex-col items-center gap-1.5 rounded-2xl p-2 active:scale-95"
                    >
                      <span className={cn('icon-disc h-12 w-12', tintDiscBg[c.tint])}>
                        <Icon size={20} strokeWidth={1.75} className={tintIcon[c.tint]} />
                      </span>
                      <span className="text-center text-[11px]/[14px] font-semibold text-ink-900">{t(c.title)}</span>
                    </Link>
                  );
                })}
              </div>

              <Link
                to="/search"
                onClick={() => setSheet(false)}
                className="glass-card mt-4 flex items-center gap-3 !rounded-2xl p-3.5 active:scale-95"
              >
                <span className="icon-disc h-10 w-10 bg-leaf-100">
                  <Bookmark size={18} className="text-leaf-600" />
                </span>
                <span className="text-[14.5px] font-semibold text-ink-900">
                  सहेजी गई चीज़ें <span className="text-[12px] font-medium text-ink-400">· Bookmarks</span>
                </span>
                <span className="ml-auto text-terracotta-600">→</span>
              </Link>

              <p className="mt-5 px-1 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-amber-600">
                जुड़िए · Follow
              </p>
              <div className="mt-2 flex gap-3">
                {[
                  { icon: MessageCircle, label: 'WhatsApp', bg: 'bg-leaf-600 text-white' },
                  { icon: Youtube, label: 'YouTube', bg: 'glass-card text-terracotta-600' },
                  { icon: Instagram, label: 'Instagram', bg: 'glass-card text-rose-500' },
                  { icon: Send, label: 'Telegram', bg: 'glass-card text-amber-600' },
                ].map((s) => (
                  <span key={s.label} className={cn('flex h-11 w-11 items-center justify-center rounded-full', s.bg)}>
                    <s.icon size={19} />
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof House;
  active: boolean;
}) {
  return (
    <Link to={to} className="relative flex w-16 flex-col items-center justify-center gap-0.5" aria-current={active ? 'page' : undefined}>
      {active && (
        <motion.span
          layoutId="bottomnav-pill"
          className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-2xl bg-terracotta-100"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <Icon size={21} className={cn('relative z-10', active ? 'text-terracotta-600' : 'text-ink-400')} />
      <span className={cn('relative z-10 text-[10.5px] font-semibold', active ? 'text-terracotta-600' : 'text-ink-400')}>
        {label}
      </span>
    </Link>
  );
}
