import { Link } from 'react-router';
import { tickerHeadlines } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { useSheetTickerItems } from '@/lib/sheetData';

/**
 * Ticker (design.md §10.3): glass-inset strip h-10, static badge on the
 * left, marquee of headlines separated by ✦, 28s loop, pause on hold.
 */
export default function Ticker() {
  const { t } = useLang();
  const sheetItems = useSheetTickerItems(); // owner updates via Google Sheet (Ticker tab)
  const base = sheetItems.length > 0 ? [...sheetItems, ...tickerHeadlines] : tickerHeadlines;
  const items = [...base, ...base]; // duplicated track for seamless loop

  return (
    <div className="glass-inset relative z-10 mx-4 mt-3 flex h-10 items-center overflow-hidden rounded-full md:mx-6 lg:mx-auto lg:max-w-[1130px]">
      <span className="flex h-full shrink-0 items-center bg-terracotta-600 px-4 text-[13px] font-semibold text-white">
        ताज़ा अपडेट
      </span>
      <div className="marquee-paused relative flex-1 overflow-hidden active:[&_.marquee-track]:paused">
        <div className="marquee-track items-center gap-8 pr-8">
          {items.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className="flex shrink-0 items-center gap-8 text-[13px] font-medium text-ink-600 hover:text-terracotta-600 transition-colors"
            >
              <span className="whitespace-nowrap">{t(item.text)}</span>
              <span aria-hidden className="text-amber-500">✦</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
