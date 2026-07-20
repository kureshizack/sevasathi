import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { services } from '@/lib/data';
import ServiceCard from '@/components/ServiceCard';
import { pop, stagger, viewport15 } from '@/lib/motion';

/**
 * Home §2 — Quick Services rail (तुरंत काम · Quick Tasks).
 * Horizontal snap rail on mobile with fade edges + scroll-hint nudge;
 * 8-col grid on lg.
 */
export default function QuickServices() {
  const railRef = useRef<HTMLDivElement>(null);

  // first-paint nudge (mobile): scroll 24px left then back — hint scrollability
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    if (window.matchMedia('(min-width: 1024px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setTimeout(() => {
      el.scrollTo({ left: 40, behavior: 'smooth' });
      window.setTimeout(() => el.scrollTo({ left: 0, behavior: 'smooth' }), 350);
    }, 1000);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-8 md:px-6 lg:px-8">
      <h2 className="mb-4 font-display text-[19px]/[26px] font-semibold text-ink-900">
        तुरंत काम <span className="text-[13px] font-medium text-ink-400">· Quick Tasks</span>
      </h2>
      <motion.div
        ref={railRef}
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="scroll-fade-x no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0 lg:grid lg:grid-cols-8 lg:overflow-visible"
      >
        {services.map((s) => (
          <motion.div key={s.id} variants={pop} className="snap-start">
            <ServiceCard service={s} mini />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
