import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Bi } from '@/lib/lang';
import { useLang } from '@/lib/lang';

interface Props {
  kicker: string; // EN kicker, small caps amber-600
  title: Bi;
  viewAllHref?: string;
  viewAllLabel?: Bi;
  /** optional filter chip row rendered below */
  children?: ReactNode;
}

/**
 * SectionHeader (design.md §10.4): EN kicker → H2 bilingual →
 * right-aligned "सभी देखें →" (arrow nudges +4px on hover).
 */
export default function SectionHeader({ kicker, title, viewAllHref, viewAllLabel, children }: Props) {
  const { t, s } = useLang();
  return (
    <div className="mb-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.14em] text-amber-600">
            {kicker}
          </p>
          <h2 className="mt-1.5 text-[23px]/[30px] md:text-[32px]/[38px] font-bold">
            {t(title)}
            <span className="ml-2.5 text-[0.72em] font-medium text-ink-400">{s(title)}</span>
          </h2>
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="group hidden sm:flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-terracotta-600"
          >
            {viewAllLabel ? t(viewAllLabel) : 'सभी देखें'}
            <ArrowRight size={17} className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
          </Link>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
      {viewAllHref && (
        <Link to={viewAllHref} className="group mt-3 flex sm:hidden items-center gap-1.5 text-[15px] font-semibold text-terracotta-600">
          {viewAllLabel ? t(viewAllLabel) : 'सभी देखें'}
          <ArrowRight size={17} className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
