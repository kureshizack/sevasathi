import { Link } from 'react-router';
import { Hammer } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Bi } from '@/lib/lang';
import { useLang } from '@/lib/lang';

/**
 * Temporary stub for hub pages — page agents replace these files with
 * the real implementations from their page design docs.
 */
export default function PageStub({ title }: { title: Bi }) {
  const { t, s } = useLang();
  return (
    <div className="mx-auto flex max-w-[1180px] items-center justify-center px-4 py-24 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card flex max-w-[420px] flex-col items-center p-8 text-center"
      >
        <span className="icon-disc h-14 w-14 bg-amber-100">
          <Hammer size={24} strokeWidth={1.75} className="text-amber-600" />
        </span>
        <h1 className="mt-4 font-display text-[24px] font-bold text-ink-900">{t(title)}</h1>
        <p className="text-[14px] text-ink-400">{s(title)}</p>
        <p className="mt-3 text-[15px] text-ink-600">
          यह पेज तैयार हो रहा है <span className="text-ink-400">· This page is being built</span>
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex h-12 items-center rounded-full bg-terracotta-600 px-6 text-[15px] font-semibold text-white shadow-warm transition-all hover:-translate-y-0.5 active:scale-95"
        >
          होम पर जाएँ · Go Home
        </Link>
      </motion.div>
    </div>
  );
}
