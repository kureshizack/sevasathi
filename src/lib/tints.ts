import type { Tint } from './data';

/** Explicit Tailwind class maps per category tint (no dynamic class strings). */

export const tintDiscBg: Record<Tint, string> = {
  terracotta: 'bg-terracotta-100',
  leaf: 'bg-leaf-100',
  amber: 'bg-amber-100',
  rose: 'bg-rose-100',
  cocoa: 'bg-cocoa-100',
};

export const tintIcon: Record<Tint, string> = {
  terracotta: 'text-terracotta-600',
  leaf: 'text-leaf-600',
  amber: 'text-amber-600',
  rose: 'text-rose-500',
  cocoa: 'text-cocoa-500',
};

/** Deep variants (Office = terracotta-700, Tools = leaf-700 per design §2). */
export const tintIconDeep: Record<Tint, string> = {
  terracotta: 'text-terracotta-700',
  leaf: 'text-leaf-700',
  amber: 'text-amber-600',
  rose: 'text-rose-500',
  cocoa: 'text-cocoa-500',
};

export const tintSolidBg: Record<Tint, string> = {
  terracotta: 'bg-terracotta-600',
  leaf: 'bg-leaf-600',
  amber: 'bg-amber-600',
  rose: 'bg-rose-500',
  cocoa: 'bg-cocoa-500',
};

export const tintGlass: Record<Tint, string> = {
  terracotta: 'glass-tint-terracotta',
  leaf: 'glass-tint-leaf',
  amber: 'glass-tint-amber',
  rose: 'glass-tint-rose',
  cocoa: 'glass-tint-cocoa',
};
