import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, FileUser } from 'lucide-react';
import { easeOutExpo } from '@/lib/motion';

const headline = ['ऑफिस', 'ज़ोन'];

/**
 * Office §1 — Split hero (lg 50/50): left content, right illustration.
 * Headline word-stagger (0.08s); CTAs pop delay 0.3s; illustration floats
 * y ±8px (6s) and parallaxes -15px on scroll.
 */
export default function OfficeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -15]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section ref={rootRef} className="mx-auto max-w-[1180px] px-4 pt-8 md:px-6 lg:px-8">
      <div className="glass-card glass-tint-terracotta relative overflow-hidden rounded-[28px] p-6 md:p-10 lg:p-12">
        <div className="mandala-overlay pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          {/* left: content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600 md:text-[13px]"
            >
              OFFICE ZONE
            </motion.p>

            <h1 className="mt-2 font-display text-[34px]/[40px] font-extrabold text-ink-900 md:text-[56px]/[60px]">
              {headline.map((word, i) => (
                <span key={word} className="mr-3 inline-block overflow-hidden pb-1 align-bottom last:mr-0">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 + i * 0.08 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.3 }}
              className="mt-4 max-w-[46ch] text-[17px]/[28px] text-ink-600"
            >
              Excel, Word, PowerPoint, रिज़्यूमे, ईमेल, इंटरव्यू — office skills आसान भाषा में,
              उदाहरण के साथ।
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: easeOutExpo, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={() => scrollTo('excel-academy')}
                className="flex h-12 items-center gap-2 rounded-full bg-terracotta-600 px-6 text-[15px] font-semibold text-white shadow-warm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.96]"
              >
                Excel शुरू करें
                <ArrowRight size={17} />
              </button>
              <button
                type="button"
                onClick={() => scrollTo('career')}
                className="glass-card flex h-12 items-center gap-2 !rounded-full px-6 text-[15px] font-semibold text-ink-900 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.96]"
              >
                <FileUser size={17} className="text-terracotta-700" />
                रिज़्यूमे टिप्स
              </button>
            </motion.div>
          </div>

          {/* right: illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.35 }}
            style={{ y: parallaxY }}
            className="relative mx-auto w-full max-w-[480px]"
          >
            <img
              src="/office-illustration.png"
              alt="डेस्क पर लैपटॉप, चाय और नोटबुक — Office Zone"
              className="animate-float-y w-full drop-shadow-[0_24px_40px_rgba(94,66,41,0.18)]"
              width={1200}
              height={900}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
