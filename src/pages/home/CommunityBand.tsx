import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Send, Youtube } from 'lucide-react';
import { pop, rise, stagger, viewport15 } from '@/lib/motion';
import { cn } from '@/lib/utils';

const socials = [
  { icon: MessageCircle, label: 'WhatsApp', hindi: 'WhatsApp चैनल', solid: true },
  { icon: Youtube, label: 'YouTube', hindi: 'YouTube', solid: false },
  { icon: Instagram, label: 'Instagram', hindi: 'Instagram', solid: false },
  { icon: Send, label: 'Telegram', hindi: 'Telegram', solid: false },
];

/**
 * Home §10 — Community band (जुड़िए · Join Us).
 * Full-width glass-tint leaf band with 4 social buttons.
 */
export default function CommunityBand() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-12 md:px-6 lg:px-8">
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={viewport15}
        className="glass-card glass-tint-leaf flex flex-col items-center gap-5 p-8 text-center lg:p-10"
      >
        <h3 className="font-display text-[22px]/[28px] font-bold text-ink-900 lg:text-[26px]/[32px]">
          हर अपडेट सबसे पहले पाएं
          <span className="block text-[14px] font-medium text-ink-400">Get every update first</span>
        </h3>
        <motion.div variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={viewport15} className="flex flex-wrap items-center justify-center gap-3">
          {socials.map((s) => (
            <motion.button
              key={s.label}
              variants={pop}
              type="button"
              aria-label={s.label}
              className={cn(
                'flex h-12 items-center gap-2 rounded-full px-5 text-[14.5px] font-semibold transition-all hover:-translate-y-0.5 active:scale-95',
                s.solid
                  ? 'bg-leaf-600 text-white shadow-[0_8px_24px_-8px_rgba(62,107,80,0.55)] animate-breathe'
                  : 'glass-card !rounded-full text-ink-900'
              )}
            >
              <s.icon size={18} />
              {s.hindi}
            </motion.button>
          ))}
        </motion.div>
        <p className="text-[13.5px] font-medium text-ink-600">
          <span className="font-mono font-semibold text-leaf-700">2,40,000+</span> लोग जुड़ चुके हैं
        </p>
      </motion.div>
    </section>
  );
}
