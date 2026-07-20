import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ToastItem {
  id: number;
  msg: string;
}

interface ToastCtx {
  toast: (msg: string) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

/**
 * Toast system (design.md §10.18): bottom-center glass-strong pill,
 * 24px above the bottom nav, auto-dismiss 2s, slide-up 16px + fade.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((msg: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev.slice(-2), { id, msg }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom,0px))] lg:bottom-8 z-[90] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium text-ink-900"
            >
              <CheckCircle2 className="text-leaf-600" size={18} />
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
