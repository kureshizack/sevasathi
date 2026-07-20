import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '@/lib/data';
import CategoryTile from '@/components/CategoryTile';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

/**
 * Home §3 — Category Mega Grid (सब कुछ, व्यवस्थित · Explore Everything).
 * GSAP ScrollTrigger soft-wall reveal: y 40→0, stagger 0.06, trigger 20%, once.
 */
export default function CategoryWall() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        '.cat-wall-item',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="categories" ref={rootRef} className="mx-auto max-w-[1180px] scroll-mt-24 px-4 py-14 md:px-6 lg:px-8 lg:py-20">
      <SectionHeader kicker="Explore" title={{ hi: 'सब कुछ, व्यवस्थित', en: 'Explore Everything' }} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((c) => (
          <div key={c.id} className="cat-wall-item">
            <CategoryTile category={c} />
          </div>
        ))}
      </div>
    </section>
  );
}
