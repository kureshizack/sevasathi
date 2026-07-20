import { Link } from 'react-router';
import { ChevronDown, Instagram, MessageCircle, Send, ShieldCheck, Youtube } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const columns = [
  {
    title: 'श्रेणियाँ · Categories',
    links: [
      { to: '/jobs', label: 'सरकारी नौकरी · Jobs' },
      { to: '/schemes', label: 'योजनाएँ · Schemes' },
      { to: '/exams', label: 'परीक्षा व रिज़ल्ट · Exams' },
      { to: '/lifehacks', label: 'लाइफ हैक्स · Life Hacks' },
    ],
  },
  {
    title: 'सेवाएँ · Services',
    links: [
      { to: '/services', label: 'आधार कार्ड · Aadhaar' },
      { to: '/services', label: 'PAN कार्ड · PAN' },
      { to: '/services', label: 'Passport सेवाएँ' },
      { to: '/services', label: 'DigiLocker गाइड' },
    ],
  },
  {
    title: 'टूल्स · Tools & About',
    links: [
      { to: '/tools', label: 'फोटो Compress' },
      { to: '/tools', label: 'EMI कैलकुलेटर' },
      { to: '/office', label: 'Excel ट्यूटोरियल' },
      { to: '/article', label: 'हमारे बारे में · About' },
    ],
  },
];

const socials = [
  { icon: MessageCircle, label: 'WhatsApp', solid: true },
  { icon: Youtube, label: 'YouTube', solid: false },
  { icon: Instagram, label: 'Instagram', solid: false },
  { icon: Send, label: 'Telegram', solid: false },
];

/** Footer (design.md §10.16). Mobile: collapsible accordion columns. */
export default function Footer() {
  const [openCol, setOpenCol] = useState<number | null>(null);

  return (
    <footer className="glass-strong mt-20 border-t border-white/70">
      <div className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* brand column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="SevaSathi logo" className="h-10 w-10" />
              <span className="leading-none">
                <span className="block font-display text-[22px] font-bold text-ink-900">SevaSathi</span>
                <span className="block text-[11px] font-medium text-ink-400">सबका डिजिटल साथी</span>
              </span>
            </Link>
            <p className="mt-3 max-w-[320px] text-[14px]/[22px] text-ink-600">
              सरकारी जानकारी, ऑफिस स्किल्स और मुफ़्त टूल्स — आसान भाषा में, सबके लिए।
            </p>
            <p className="mt-3 flex max-w-[340px] items-start gap-2 rounded-2xl bg-amber-100/70 px-3.5 py-2.5 text-[12.5px]/[19px] font-medium text-amber-600">
              <ShieldCheck size={15} className="mt-0.5 shrink-0" />
              हम सरकारी वेबसाइट नहीं हैं — आवेदन हमेशा आधिकारिक .gov.in / .nic.in साइट पर करें।
            </p>
            <div className="mt-4 flex gap-2.5">
              {socials.map((s) => (
                <span
                  key={s.label}
                  aria-label={s.label}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95',
                    s.solid ? 'bg-leaf-600 text-white' : 'glass-card !rounded-full text-ink-600'
                  )}
                >
                  <s.icon size={18} />
                </span>
              ))}
            </div>
          </div>

          {/* link columns — accordion on mobile */}
          {columns.map((col, i) => (
            <div key={col.title} className="border-b border-black/5 pb-2 lg:border-0 lg:pb-0">
              <button
                type="button"
                onClick={() => setOpenCol(openCol === i ? null : i)}
                className="flex w-full items-center justify-between py-2 text-left font-display text-[15.5px] font-semibold text-ink-900 lg:pointer-events-none"
              >
                {col.title}
                <ChevronDown
                  size={17}
                  className={cn('text-ink-400 transition-transform duration-200 lg:hidden', openCol === i && 'rotate-180')}
                />
              </button>
              <ul className={cn('flex-col gap-1 pb-2 lg:flex', openCol === i ? 'flex' : 'hidden lg:flex')}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="inline-block py-1.5 text-[14px] text-ink-600 transition-colors hover:text-terracotta-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-6 text-[13px] text-ink-400 sm:flex-row">
          <p>© 2026 SevaSathi · सबका डिजिटल साथी</p>
          <div className="flex gap-5">
            <Link to="/article" className="transition-colors hover:text-terracotta-600">Privacy</Link>
            <Link to="/article" className="transition-colors hover:text-terracotta-600">Contact</Link>
            <Link to="/article" className="transition-colors hover:text-terracotta-600">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
