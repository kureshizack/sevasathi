import { useEffect, useRef, useState } from 'react';
import { Mic, Search } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSearch } from '@/lib/search';
import { heroSearchPlaceholders, heroStats, quickChips } from '@/lib/data';
import CountUp from '@/components/CountUp';

gsap.registerPlugin(ScrollTrigger);

/**
 * Home §1 — Hero (glass panel over blobs, mandala texture).
 * GSAP: word-level H1 stagger, swash draw, staggered rise/pop entrances,
 * illustration scroll parallax (scrub). All trigger on load, once.
 */
export default function Hero() {
  const { openSearch } = useSearch();
  const [q, setQ] = useState('');
  const [phIndex, setPhIndex] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const swashRef = useRef<SVGPathElement>(null);
  const illuRef = useRef<HTMLDivElement>(null);

  // cycle search placeholder every 3s
  useEffect(() => {
    const id = window.setInterval(() => setPhIndex((i) => (i + 1) % heroSearchPlaceholders.length), 3000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // swash path setup
      const swash = swashRef.current;
      if (swash) {
        const swashLen = swash.getTotalLength();
        gsap.set(swash, { strokeDasharray: swashLen, strokeDashoffset: swashLen });
      }

      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.fromTo('.hero-kicker', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 0.05)
          .fromTo(
            '.hero-word-inner',
            { yPercent: 110 },
            { yPercent: 0, duration: 0.6, stagger: 0.08 },
            0.1
          );
        if (swash) {
          tl.to(swash, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, 0.4);
        }
        tl.fromTo('.hero-rise', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0.3)
          .fromTo('.hero-chip', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05 }, 0.5)
          .fromTo('.hero-stat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.65)
          .fromTo('.hero-illu-wrap', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7 }, 0.35);

        // illustration parallax over hero scroll (scrub)
        gsap.to(illuRef.current, {
          y: -20,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      } else {
        gsap.set('.hero-word-inner', { yPercent: 0 });
        if (swash) gsap.set(swash, { strokeDashoffset: 0 });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const openWith = (value: string) => {
    openSearch(value);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const line1 = ['आपका', 'हर', 'काम,'];
  const line2 = ['अब', 'आसान।'];

  return (
    <section ref={rootRef} className="relative overflow-hidden">
      <div aria-hidden className="mandala-overlay pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1180px] px-4 pt-10 md:px-6 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[55%_45%]">
          {/* text column */}
          <div>
            <p className="hero-kicker text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.14em] text-amber-600">
              Free · Bilingual · Made for Bharat
            </p>
            <h1 className="mt-3 font-display text-[34px]/[42px] font-extrabold text-ink-900 lg:text-[56px]/[62px]">
              <span className="block">
                {line1.map((w) => (
                  <span key={w} className="hero-word inline-block overflow-hidden pb-1 align-bottom">
                    <span className="hero-word-inner inline-block">{w}&nbsp;</span>
                  </span>
                ))}
              </span>
              <span className="relative block w-fit text-terracotta-600">
                {line2.map((w) => (
                  <span key={w} className="hero-word inline-block overflow-hidden pb-2 align-bottom">
                    <span className="hero-word-inner inline-block">{w}&nbsp;</span>
                  </span>
                ))}
                <svg
                  className="pointer-events-none absolute -bottom-1 left-0 h-[14px] w-[92%]"
                  viewBox="0 0 240 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    ref={swashRef}
                    d="M4 10 C 60 3, 170 3, 236 8"
                    stroke="#D9A03F"
                    strokeWidth="6"
                    strokeLinecap="round"
                    style={{ strokeDasharray: 300, strokeDashoffset: 300 }}
                  />
                </svg>
              </span>
            </h1>

            <p className="hero-rise mt-5 max-w-[520px] text-[17px]/[28px] text-ink-600">
              सरकारी नौकरी, योजनाएँ, आधार-पैन जैसे काम, रिज़ल्ट, ऑफिस स्किल्स और ऑनलाइन टूल्स — सब कुछ एक जगह,
              आसान भाषा में।
            </p>
            <p className="hero-rise mt-1.5 max-w-[520px] text-[15px]/[24px] text-ink-400">
              Jobs, schemes, services, results, office skills &amp; tools — everything in simple Hindi + English.
            </p>

            {/* big search bar */}
            <div className="hero-rise glass-strong mt-6 flex h-14 max-w-[560px] items-center gap-3 rounded-full pl-5 pr-4">
              <Search size={20} className="shrink-0 text-terracotta-600" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  openWith(e.target.value);
                }}
                onFocus={() => openWith(q)}
                placeholder={heroSearchPlaceholders[phIndex]}
                aria-label="खोजें"
                className="h-full w-full bg-transparent text-[17px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <Mic size={19} className="shrink-0 text-ink-400" aria-hidden />
            </div>

            {/* quick chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => openWith(chip)}
                  className="hero-chip glass-card !rounded-full px-4 py-2 text-[14px] font-semibold text-ink-600 transition-colors hover:text-terracotta-600 active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* stat strip */}
            <div className="mt-7 grid max-w-[560px] grid-cols-3 gap-3">
              {heroStats.map((s) => (
                <a key={s.en} href={s.anchor} className="hero-stat glass-card flex flex-col items-center gap-0.5 !rounded-2xl px-2 py-3.5 text-center transition-transform active:scale-95">
                  <span className="font-mono text-[24px]/[28px] font-semibold text-terracotta-600">
                    <CountUp value={s.value} />
                    {s.suffix}
                  </span>
                  <span className="text-[12.5px] font-semibold text-ink-900">
                    {s.hi} <span className="font-medium text-ink-400">· {s.en}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* illustration column */}
          <div className="hero-illu-wrap mx-auto w-[70%] lg:w-full">
            <div ref={illuRef}>
              <img
                src="/hero-illustration.png"
                alt="SevaSathi ऐप पर छात्र, किसान, ऑफिस कर्मचारी और बुज़ुर्ग — सबके लिए आसान डिजिटल सेवाएँ"
                className="animate-float-y h-auto w-full"
                width={1600}
                height={1200}
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
