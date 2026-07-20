import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UploadCloud } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Tint } from '@/lib/data';
import type { Bi } from '@/lib/lang';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { rise, viewport15 } from '@/lib/motion';
import { tintDiscBg, tintIcon, tintIconDeep } from '@/lib/tints';
import { inr } from '@/pages/page-utils';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Shared input classes (tools.md UI kit)                              */
/* ------------------------------------------------------------------ */

/** Glass-inset input, h-12, 17px, amber focus ring. */
export const toolInputCls =
  'glass-inset h-12 w-full rounded-2xl px-4 text-[16px] text-ink-900 placeholder:text-ink-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-500/60';

export const toolLabelCls = 'mb-1.5 block text-[13px] font-semibold text-ink-400';

/* ------------------------------------------------------------------ */
/* Trust badge (tools.md: every tool, top-right)                       */
/* ------------------------------------------------------------------ */

export function TrustBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-leaf-100 px-3 py-1.5 text-[12px] font-semibold text-leaf-700',
        className
      )}
    >
      <ShieldCheck size={14} />
      100% प्राइवेट — फाइल आपके फोन में ही रहती है
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* ToolShell — glass panel with header + trust badge                   */
/* ------------------------------------------------------------------ */

interface ToolShellProps {
  id: string;
  icon: LucideIcon;
  tint: Tint;
  /** deep variants: terracotta-700 / leaf-700 icon color */
  deep?: boolean;
  title: Bi;
  purpose: Bi;
  children: ReactNode;
}

/**
 * Tool panel (tools.md UI kit): glass card p-5/8 rounded-3xl; header =
 * icon disc + bilingual title + 1-line purpose; trust badge top-right.
 */
export function ToolShell({ id, icon: Icon, tint, deep, title, purpose, children }: ToolShellProps) {
  const { t, s } = useLang();
  return (
    <motion.section
      id={id}
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={viewport15}
      className="glass-card scroll-mt-40 p-5 md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className={cn('icon-disc h-12 w-12', tintDiscBg[tint])}>
            <Icon size={22} strokeWidth={1.75} className={deep ? tintIconDeep[tint] : tintIcon[tint]} />
          </span>
          <div>
            <h2 className="font-display text-[21px]/[26px] font-bold text-ink-900">
              {t(title)} <span className="ml-1 text-[0.72em] font-medium text-ink-400">{s(title)}</span>
            </h2>
            <p className="text-[13.5px]/[20px] text-ink-400">{t(purpose)}</p>
          </div>
        </div>
        <TrustBadge className="shrink-0" />
      </div>
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Tween — animated number that eases to `value` on every change       */
/* ------------------------------------------------------------------ */

interface TweenProps {
  value: number;
  duration?: number; // seconds
  format?: (n: number) => string;
  className?: string;
}

/** Live count-up used by tool results (design.md §7, tools.md kit). */
export function Tween({ value, duration = 0.4, format, className }: TweenProps) {
  const fmt = format ?? ((n: number) => inr(Math.round(n)));
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    if (from === value) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / (duration * 1000));
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <motion.span key={value} className={cn('tabular-nums', className)}>
      {fmt(display)}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* StatTile — glass-inset well stat                                    */
/* ------------------------------------------------------------------ */

export function StatTile({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('glass-inset flex flex-col items-center rounded-2xl px-3 py-4 text-center', className)}>
      <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <div className="mt-1 font-mono text-[24px]/[30px] font-semibold text-ink-900">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dropzone — dashed terracotta border, drag-over state, tap = picker  */
/* ------------------------------------------------------------------ */

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  label: string;
  hint: string;
  multiple?: boolean;
  compact?: boolean;
}

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB
const ACCEPT = 'image/jpeg,image/png,image/webp';

export function Dropzone({ onFiles, label, hint, multiple, compact }: DropzoneProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const validate = (list: FileList | File[]): File[] => {
    const files = Array.from(list);
    const ok: File[] = [];
    for (const f of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        toast('सिर्फ JPG / PNG / WebP फोटो चलेंगी');
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        toast('फाइल 20MB से छोटी होनी चाहिए');
        continue;
      }
      ok.push(f);
    }
    return ok;
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const files = validate(e.dataTransfer.files);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? validate(e.target.files) : [];
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
    e.target.value = '';
  };

  return (
    <motion.button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      animate={over ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      className={cn(
        'glass-inset flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed px-4 text-center transition-colors duration-200',
        compact ? 'py-6' : 'py-10',
        over ? 'border-terracotta-500 bg-terracotta-50/80' : 'border-terracotta-500/50 hover:border-terracotta-500'
      )}
    >
      <span className="icon-disc h-12 w-12 bg-terracotta-100">
        <UploadCloud size={22} strokeWidth={1.75} className="text-terracotta-600" />
      </span>
      <span className="text-[15.5px] font-semibold text-ink-900">{label}</span>
      <span className="text-[12.5px] text-ink-400">{hint}</span>
      <input ref={inputRef} type="file" accept={ACCEPT} multiple={multiple} className="hidden" onChange={onPick} />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* ResultWell — glass-inset result zone                                */
/* ------------------------------------------------------------------ */

export function ResultWell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('glass-inset rounded-2xl p-4 md:p-5', className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Small chip                                                          */
/* ------------------------------------------------------------------ */

export function MiniChip({
  active,
  onClick,
  children,
  mono,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 items-center rounded-full px-3.5 text-[13px] font-semibold transition-all duration-200 active:scale-95',
        mono && 'font-mono',
        active ? 'bg-terracotta-600 text-white shadow-warm' : 'glass-card !rounded-full text-ink-600 hover:text-terracotta-600'
      )}
    >
      {children}
    </button>
  );
}
