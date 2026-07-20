import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AmbientBlobs from './AmbientBlobs';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import SearchOverlay from './SearchOverlay';

/**
 * Layout: TopNav (sticky, in flow) + ambient blobs + content slot +
 * Footer + fixed BottomNav + WhatsAppFloat + global SearchOverlay.
 * Content slot gets pb-28 on mobile so it clears the fixed bottom nav.
 * Lenis smooth scroll (lerp 0.1, smooth wheel only — design.md §8).
 */
export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh]">
      <AmbientBlobs />
      <TopNav />
      <div className="pb-28 lg:pb-0">
        <main>{children}</main>
        <Footer />
      </div>
      <BottomNav />
      <WhatsAppFloat />
      <SearchOverlay />
    </div>
  );
}
