import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

/**
 * WhatsAppFloat (design.md §10.17): fixed 52px leaf circle, entrance
 * pop after 1s, gentle breathing; tooltip label on desktop hover.
 */
export default function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/919999999999?text=SevaSathi%20Job%20Alerts"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp पर Job Alerts पाएं"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 400, damping: 20 }}
      className="group fixed bottom-[calc(96px+env(safe-area-inset-bottom,0px))] right-4 z-40 lg:bottom-6 lg:right-6"
    >
      <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-ink-900 px-3.5 py-1.5 text-[13px] font-medium text-cream-50 opacity-0 transition-opacity duration-200 lg:group-hover:opacity-100">
        Job Alerts पाएं
      </span>
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-leaf-600 text-white shadow-[0_8px_24px_-6px_rgba(62,107,80,0.55)] animate-breathe transition-transform active:scale-95">
        <MessageCircle size={24} strokeWidth={2} fill="currentColor" />
      </span>
    </motion.a>
  );
}
