import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Tint } from '@/lib/data';
import { useLang } from '@/lib/lang';
import type { Bi } from '@/lib/lang';

const TINT_KICKER: Record<Tint, string> = {
  terracotta: 'text-terracotta-600',
  leaf: 'text-leaf-600',
  amber: 'text-amber-600',
  rose: 'text-rose-500',
  cocoa: 'text-cocoa-500',
};

const TINT_DISC: Record<Tint, string> = {
  terracotta: 'bg-terracotta-100 text-terracotta-600',
  leaf: 'bg-leaf-100 text-leaf-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-500',
  cocoa: 'bg-cocoa-100 text-cocoa-500',
};

const TINT_BTN: Record<Tint, string> = {
  terracotta: 'bg-terracotta-600',
  leaf: 'bg-leaf-600',
  amber: 'bg-amber-600',
  rose: 'bg-rose-500',
  cocoa: 'bg-cocoa-500',
};

export interface DeckCardProps {
  /** 0-based position — controls the stacked peek offset */
  index: number;
  total: number;
  tint: Tint;
  icon: LucideIcon;
  kicker: string;
  title: Bi;
  cta?: { label: Bi; href: string };
  children: ReactNode;
}

/**
 * CRED-style stacking deck card (mobile-first engagement).
 * Cards are sticky siblings — each sticks slightly lower than the
 * previous one, so scrolling slides the next card over the deck like
 * flipping through a physical card stack. Card content can scroll
 * internally (overflow-y-auto) so the page itself stays "card-first".
 */
export default function DeckCard({ index, total, tint, icon: Icon, kicker, title, cta, children }: DeckCardProps) {
  const { t } = useLang();
  return (
    <div
      className="sticky px-4 md:px-6"
      style={{ top: `${70 + index * 9}px`, zIndex: index + 1 }}
    >
      <div
        className={`glass-card glass-tint-${tint} mx-auto flex h-[calc(100svh-92px)] max-h-[760px] min-h-[540px] w-full max-w-[920px] flex-col overflow-hidden !rounded-[28px]`}
      >
        {/* ---- Card header ---- */}
        <div className="flex items-center gap-3.5 px-5 pt-5 md:px-7 md:pt-6">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TINT_DISC[tint]}`}>
            <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-[11.5px] font-bold uppercase tracking-[0.14em] ${TINT_KICKER[tint]}`}>
              {kicker}
            </p>
            <h2 className="mt-0.5 truncate font-display text-[21px]/[27px] font-bold text-ink-900 md:text-[25px]/[32px]">
              {t(title)}
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-black/5 px-2.5 py-1 font-mono text-[11px] font-semibold text-ink-400">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* ---- Card body ---- */}
        <div className="mt-4 flex min-h-0 flex-1 flex-col px-5 md:px-7">{children}</div>

        {/* ---- Card CTA ---- */}
        {cta && (
          <div className="px-5 pb-5 pt-4 md:px-7 md:pb-6">
            <Link
              to={cta.href}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15.5px] font-semibold text-white shadow-warm transition-all hover:-translate-y-0.5 active:scale-[0.98] ${TINT_BTN[tint]}`}
            >
              {t(cta.label)}
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
