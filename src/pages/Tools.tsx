import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, ShieldCheck, Zap } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import FAQAccordion from '@/components/FAQAccordion';
import { toolDock, toolsFaqs } from '@/lib/data';
import { useLang } from '@/lib/lang';
import { easeOutExpo, rise, stagger, viewport15 } from '@/lib/motion';
import { cn } from '@/lib/utils';
import ImageCompressor from '@/pages/tools/ImageCompressor';
import PhotoResizer from '@/pages/tools/PhotoResizer';
import SignatureResizer from '@/pages/tools/SignatureResizer';
import AgeCalculator from '@/pages/tools/AgeCalculator';
import PercentageCalculator from '@/pages/tools/PercentageCalculator';
import EmiCalculator from '@/pages/tools/EmiCalculator';
import UnitConverter from '@/pages/tools/UnitConverter';
import WordCounter from '@/pages/tools/WordCounter';

const trustCards = [
  { icon: ShieldCheck, title: 'Files फोन में ही रहती हैं', desc: 'फोटो कभी किसी server पर नहीं जाती — सब कुछ आपके ब्राउज़र में होता है।', tint: 'bg-leaf-100 text-leaf-600' },
  { icon: Zap, title: 'बिना इंटरनेट भी चलते हैं', desc: 'एक बार page खुल जाए तो tools offline भी काम करते हैं।', tint: 'bg-amber-100 text-amber-600' },
  { icon: BadgeCheck, title: 'हमेशा फ्री, कोई sign-up नहीं', desc: 'न पैसा, न account, न watermark — सीधा काम।', tint: 'bg-terracotta-100 text-terracotta-700' },
];

/**
 * Tools (tools.md): compact hero + scroll-spy tool dock + 8 fully
 * client-side tools + why-trust strip + FAQ.
 */
export default function Tools() {
  const { t } = useLang();
  const [active, setActive] = useState('compress');
  const dockRef = useRef<HTMLDivElement>(null);

  // scroll-spy over the 8 tool panels
  useEffect(() => {
    const sections = toolDock
      .map((d) => document.getElementById(d.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* §1 hero */}
      <section className="mx-auto max-w-[1180px] px-4 pt-8 md:px-6 lg:px-8">
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          animate="show"
          className="glass-card glass-tint-leaf relative overflow-hidden rounded-[28px] p-6 md:p-10"
        >
          <div className="mandala-overlay pointer-events-none absolute inset-0" aria-hidden />
          <motion.p
            variants={rise}
            className="relative text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600 md:text-[13px]"
          >
            FREE ONLINE TOOLS
          </motion.p>
          <motion.h1
            variants={rise}
            className="relative mt-2 font-display text-[30px]/[36px] font-extrabold text-ink-900 md:text-[44px]/[50px]"
          >
            मुफ़्त ऑनलाइन टूल्स
          </motion.h1>
          <motion.p variants={rise} className="relative mt-3 max-w-[52ch] text-[17px]/[28px] text-ink-600">
            सरकारी फॉर्म से लेकर ऑफिस काम तक — सब टूल्स फ्री, बिना sign-up, बिना upload।
          </motion.p>
        </motion.div>
      </section>

      {/* §1 tool dock — sticky, snap-scroll, scroll-spy */}
      <div className="sticky top-16 z-40 mt-5 lg:top-14">
        <div className="mx-auto max-w-[1180px] px-4 md:px-6 lg:px-8">
          <div className="glass-strong scroll-fade-x no-scrollbar overflow-x-auto rounded-full px-2 py-2">
            <div ref={dockRef} className="flex w-max snap-x snap-mandatory gap-1.5">
              {toolDock.map((d, i) => {
                const Icon = d.icon;
                const isActive = active === d.id;
                return (
                  <motion.button
                    key={d.id}
                    type="button"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: easeOutExpo, delay: i * 0.04 }}
                    onClick={() => goTo(d.id)}
                    aria-pressed={isActive}
                    className={cn(
                      'relative flex h-11 shrink-0 snap-start items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-colors duration-200',
                      isActive ? 'text-white' : 'text-ink-600 hover:text-terracotta-600'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tool-dock-pill"
                        className="absolute inset-0 rounded-full bg-terracotta-600 shadow-warm"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon size={16} className="relative z-10" />
                    <span className="relative z-10">{t(d.label)}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* §2–§9 the 8 tools */}
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-4 py-10 md:px-6 lg:px-8">
        <ImageCompressor />
        <PhotoResizer />
        <SignatureResizer />
        <AgeCalculator />
        <PercentageCalculator />
        <EmiCalculator />
        <UnitConverter />
        <WordCounter />
      </div>

      {/* §10 why-trust strip */}
      <section className="mx-auto max-w-[1180px] px-4 pb-4 md:px-6 lg:px-8">
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {trustCards.map((c) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.title} variants={rise} className="glass-card flex items-start gap-3.5 p-5">
                <span className={cn('icon-disc h-11 w-11 shrink-0', c.tint.split(' ')[0])}>
                  <Icon size={20} strokeWidth={1.75} className={c.tint.split(' ')[1]} />
                </span>
                <div>
                  <h3 className="font-display text-[16px]/[22px] font-semibold text-ink-900">{c.title}</h3>
                  <p className="mt-1 text-[13.5px]/[21px] text-ink-400">{c.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* §10 FAQ */}
      <section className="mx-auto max-w-[820px] px-4 py-14 md:px-6 lg:px-8">
        <SectionHeader kicker="FAQ" title={{ hi: 'अक्सर पूछे जाने वाले सवाल', en: 'Frequently asked' }} />
        <FAQAccordion faqs={toolsFaqs} />
      </section>
    </>
  );
}
