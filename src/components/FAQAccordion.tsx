import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import type { Faq } from '@/lib/data';
import { useLang } from '@/lib/lang';

/**
 * FAQAccordion (design.md §10.12): glass items, Plus icon rotates 45°
 * when open, height animates 0.3s out-expo.
 */
export default function FAQAccordion({ faqs }: { faqs: Faq[] }) {
  const { t } = useLang();
  return (
    <AccordionPrimitive.Root type="single" collapsible className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <AccordionPrimitive.Item key={i} value={`faq-${i}`} className="glass-card overflow-hidden">
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left font-display text-[16px]/[22px] font-semibold text-ink-900 transition-colors hover:text-terracotta-600 [&[data-state=open]>svg]:rotate-45">
              {t(faq.q)}
              <Plus
                size={19}
                className="shrink-0 text-terracotta-600 transition-transform duration-300 ease-out-expo"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden text-[15px]/[24px] text-ink-600 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="px-5 pb-5">{t(faq.a)}</p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
