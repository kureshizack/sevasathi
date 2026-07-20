import type { Variants } from 'framer-motion';

/** Shared motion presets (design.md §7). Ease: out-expo. */
export const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** rise: y 24→0, opacity 0→1, 0.5s */
export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
};

/** pop: scale .94→1 + fade, 0.35s */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: easeOutExpo } },
};

/** staggerChildren helper, default 0.07s */
export const stagger = (children = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: children, delayChildren: delay } },
});

/** viewport config: trigger at 15% visible, once */
export const viewport15 = { amount: 0.15, once: true } as const;
export const viewport20 = { amount: 0.2, once: true } as const;
