import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FileDown, Keyboard } from 'lucide-react';
import { excelShortcuts } from '@/lib/data';
import type { ShortcutChip } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { pop, stagger, viewport15 } from '@/lib/motion';
import { cn } from '@/lib/utils';

function Chip({ chip }: { chip: ShortcutChip }) {
  const { t } = useLang();
  return (
    <span className="glass-inset mx-1.5 flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5">
      <kbd className="font-mono text-[13px] font-semibold text-terracotta-700">{chip.keys}</kbd>
      <span className="text-[13.5px] font-medium text-ink-600">{t(chip.action)}</span>
    </span>
  );
}

/**
 * One marquee row: duplicated track translating 0 → -50%, 25s linear.
 * Row 2 runs in reverse. Pauses on hover / touch-hold.
 */
function MarqueeRow({ chips, reverse = false }: { chips: ShortcutChip[]; reverse?: boolean }) {
  const [held, setHeld] = useState(false);
  const doubled = [...chips, ...chips];
  return (
    <div
      className="marquee-paused overflow-hidden"
      onTouchStart={() => setHeld(true)}
      onTouchEnd={() => setHeld(false)}
      onTouchCancel={() => setHeld(false)}
    >
      <div
        className={cn('marquee-track py-1.5', held && 'paused')}
        style={{ animationDuration: '25s', animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((chip, i) => (
          <Chip key={`${chip.keys}-${i}`} chip={chip} />
        ))}
      </div>
    </div>
  );
}

/**
 * Office §3 — Shortcut Wall: full-width sand band, 2-row chip marquee
 * of 20 visible shortcuts (rows opposite directions), pause on hover/touch.
 */
export default function ShortcutWall() {
  const rowA = excelShortcuts.slice(0, 10);
  const rowB = excelShortcuts.slice(10);

  return (
    <section className="bg-sand-200/70 py-12">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 lg:px-8">
        <motion.div variants={stagger(0.03)} initial="hidden" whileInView="show" viewport={viewport15}>
          <motion.div variants={pop} className="flex items-center gap-3">
            <span className="icon-disc h-11 w-11 bg-terracotta-100">
              <Keyboard size={20} strokeWidth={1.75} className="text-terracotta-700" />
            </span>
            <h2 className="font-display text-[23px]/[30px] font-bold text-ink-900 md:text-[28px]/[34px]">
              Excel Shortcuts — रोज़ काम आने वाले
            </h2>
          </motion.div>

          <motion.div variants={pop} className="mt-6">
            <MarqueeRow chips={rowA} />
            <MarqueeRow chips={rowB} reverse />
          </motion.div>

          <motion.div variants={pop} className="mt-5">
            <Link
              to="/article"
              className="link-underline inline-flex items-center gap-1.5 text-[15px] font-semibold"
            >
              <FileDown size={16} />
              पूरी 50 शॉर्टकट PDF गाइड →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
