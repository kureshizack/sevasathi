import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Clock, ExternalLink, Phone, ShieldAlert } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import ServiceCard from '@/components/ServiceCard';
import FAQAccordion from '@/components/FAQAccordion';
import { docServices, officialPortals, popularServices, servicesFaqs } from '@/lib/data';
import { easeOutExpo, pop, rise, stagger, viewport15 } from '@/lib/motion';
import { useLang } from '@/lib/lang';
import type { Bi } from '@/lib/lang';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { cn } from '@/lib/utils';

/** §1 quick-find chips (services.md) */
const quickFindChips = ['PAN कार्ड', 'आधार अपडेट', 'PF निकालना', 'Voter ID'];

/** §4 — universal 4-step path */
const rightWaySteps: Bi[] = [
  { hi: 'गाइड पढ़ें और दस्तावेज़ जुटाएं', en: 'Read the guide and gather documents' },
  { hi: 'Official वेबसाइट/App खोलें (हम लिंक देते हैं)', en: 'Open the official website/app (we give the link)' },
  { hi: 'फॉर्म भरें — OTP/Fee का SMS रखें', en: 'Fill the form — keep the OTP/fee SMS' },
  { hi: 'Status ट्रैक करें, प्रिंट/PDF सहेजें', en: 'Track status, save the print/PDF' },
];

/** §4 — safety card bullets */
const safetyBullets: Bi[] = [
  { hi: 'Official site हमेशा .gov.in / .nic.in होती है', en: 'Official sites always end in .gov.in / .nic.in' },
  { hi: 'OTP किसी को न बताएं — बैंक/सरकार कभी नहीं मांगती', en: 'Never share an OTP — banks/government never ask for it' },
  { hi: 'एजेंट को "गारंटी" के पैसे न दें', en: 'Never pay an agent for a "guarantee"' },
  { hi: 'साइबर फ्रॉड होने पर तुरंत 1930 पर कॉल करें', en: 'If cyber fraud happens, call 1930 immediately' },
];

/** rows slide x -24→0 (services.md §3) */
const slideX = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOutExpo } },
};

export default function Services() {
  const { t, s } = useLang();
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* ---------- §1 Page hero + quick find ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 pt-8 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="glass-card glass-tint-amber relative overflow-hidden p-6 md:p-10"
        >
          <div aria-hidden className="mandala-overlay pointer-events-none absolute inset-0" />
          <div className="relative max-w-[640px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-600 md:text-[13px]">
              Sarkari Kaam
            </p>
            <h1 className="mt-2 text-[28px]/[34px] font-bold md:text-[42px]/[48px]">
              {t({ hi: 'सरकारी सेवाएँ', en: 'Govt Services' })}
              <span className="ml-3 text-[0.6em] font-medium text-ink-400">
                {s({ hi: 'सरकारी सेवाएँ', en: 'Govt Services' })}
              </span>
            </h1>
            <p className="mt-3 text-[15.5px]/[26px] text-ink-600 md:text-[17px]/[28px]">
              {t({
                hi: 'आधार से पासपोर्ट तक — हर काम की step-by-step गाइड, आसान भाषा में।',
                en: 'From Aadhaar to Passport — step-by-step guides for every task, in simple language.',
              })}
            </p>
            <motion.div
              variants={stagger(0.06, 0.25)}
              initial="hidden"
              animate="show"
              className="mt-5 flex flex-wrap gap-2"
            >
              {quickFindChips.map((chip) => (
                <motion.span key={chip} variants={pop}>
                  <Link
                    to="/article"
                    className="glass-card inline-flex h-10 items-center !rounded-full px-4 text-[14px] font-semibold text-ink-900 transition-all duration-200 hover:-translate-y-0.5 hover:text-terracotta-600 active:scale-95"
                  >
                    {chip}
                  </Link>
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ---------- §2 Popular services ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Popular Services"
          title={{ hi: 'लोकप्रिय सेवाएँ', en: 'Popular Services' }}
        />
        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {popularServices.map((service) => (
            <motion.div key={service.id} variants={rise} className="h-full">
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------- §3 Certificates & documents ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Certificates & Documents"
          title={{ hi: 'दस्तावेज़ सेवाएँ', en: 'Document Services' }}
        />
        <motion.div
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="grid gap-3 lg:grid-cols-2"
        >
          {docServices.map((doc) => {
            const Icon = doc.icon;
            return (
              <motion.div key={doc.id} variants={slideX}>
                <Link
                  to="/article"
                  className="glass-card group flex items-center gap-3.5 p-4 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span
                    className={cn(
                      'icon-disc h-11 w-11 transition-transform duration-200 ease-out-expo group-hover:-rotate-6 group-hover:scale-105',
                      tintDiscBg[doc.tint]
                    )}
                  >
                    <Icon size={20} strokeWidth={1.75} className={tintIcon[doc.tint]} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[16px]/[22px] font-semibold text-ink-900">
                      {t(doc.title)}
                    </span>
                    <span className="block text-[12.5px] font-medium text-ink-400">{s(doc.title)}</span>
                  </span>
                  {doc.badge && (
                    <span className="hidden shrink-0 rounded-full bg-amber-100 px-2.5 py-1 font-mono text-[11.5px] font-semibold text-amber-600 sm:inline">
                      {doc.badge}
                    </span>
                  )}
                  <span className="hidden shrink-0 rounded-full border border-black/5 bg-white/50 px-2.5 py-1 text-[11.5px] font-semibold text-ink-600 md:inline-flex">
                    State-wise गाइड
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sand-200 px-2.5 py-1 font-mono text-[11.5px] font-semibold text-ink-600">
                    <Clock size={12} />
                    {doc.time}
                  </span>
                  <ChevronRight
                    size={17}
                    className="shrink-0 text-ink-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-terracotta-600"
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ---------- §4 The right way + safety ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="The Right Way"
          title={{ hi: 'काम करवाने का सही तरीका', en: 'The Right Way to Get Things Done' }}
        />
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {/* 4 numbered steps */}
          <div className="glass-card flex flex-col justify-center gap-5 p-6 md:p-8">
            {rightWaySteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ amount: 0.6, once: true }}
                  transition={{ duration: 0.4, delay: i * 0.2, ease: easeOutExpo }}
                  className="icon-disc h-8 w-8 bg-amber-100 font-mono text-[13.5px] font-bold text-amber-600"
                >
                  {i + 1}
                </motion.span>
                <div>
                  <p className="font-display text-[16px]/[23px] font-semibold text-ink-900">{t(step)}</p>
                  <p className="text-[13px]/[19px] text-ink-400">{s(step)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* safety card (glass-urgent) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.2, once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }}
            className="glass-urgent p-6 md:p-8"
          >
            <div className="flex items-center gap-3.5">
              <span className="icon-disc h-12 w-12 bg-rose-100">
                <ShieldAlert size={22} strokeWidth={1.75} className="text-rose-500" />
              </span>
              <h3 className="font-display text-[19px]/[26px] font-semibold text-ink-900">
                {t({ hi: 'धोखे से बचें', en: 'Avoid Fraud' })}
                <span className="ml-2 text-[13px] font-medium text-ink-400">
                  {s({ hi: 'धोखे से बचें', en: 'Avoid Fraud' })}
                </span>
              </h3>
            </div>
            <ul className="mt-5 flex flex-col gap-3">
              {safetyBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px]/[24px] text-ink-600">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                  <span>
                    {t(b)}
                    <span className="block text-[12.5px]/[18px] text-ink-400">{s(b)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <motion.a
              href="tel:1930"
              animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-6 inline-flex h-12 items-center gap-2.5 rounded-full bg-terracotta-700 px-6 text-[16px] font-semibold text-white shadow-warm transition-transform active:scale-95"
            >
              <Phone size={18} strokeWidth={2} />
              <span className="font-mono">1930</span>
              <span className="text-[13px] font-medium text-white/80">· Cyber Fraud Helpline</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ---------- §5 Official directory table ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Official Directory"
          title={{ hi: 'Official पोर्टल व हेल्पलाइन', en: 'Official Portals & Helplines' }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport15}
          transition={{ duration: 0.4, ease: easeOutExpo }}
          className="glass-inset overflow-hidden"
        >
          <div className="scroll-fade-x overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-[15px]">
              <thead>
                <tr className="bg-sand-200/80 text-[13px] font-semibold uppercase tracking-wide text-ink-600">
                  <th className="px-4 py-3 font-semibold md:px-5">{t({ hi: 'सेवा', en: 'Service' })}</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Official Portal</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Helpline</th>
                </tr>
              </thead>
              <motion.tbody variants={stagger(0.04)} initial="hidden" whileInView="show" viewport={viewport15}>
                {officialPortals.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    variants={rise}
                    className={cn('border-t border-black/5', i % 2 === 1 && 'bg-white/40')}
                  >
                    <td className="px-4 py-3.5 font-semibold text-ink-900 md:px-5">{p.service}</td>
                    <td className="px-4 py-3.5 md:px-5">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex flex-wrap items-center gap-x-2 gap-y-1"
                      >
                        <span className="font-mono text-[14px] font-semibold text-leaf-600 underline-offset-2 group-hover:underline">
                          {p.portal}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-leaf-100 px-2 py-0.5 text-[11px] font-semibold text-leaf-600">
                          Official
                          <ExternalLink size={11} />
                        </span>
                      </a>
                    </td>
                    <td className="px-4 py-3.5 md:px-5">
                      {p.helpline ? (
                        <a href={`tel:${p.helpline.replace(/-/g, '')}`} className="font-mono text-[14px] font-semibold text-ink-600 hover:text-terracotta-600">
                          {p.helpline}
                        </a>
                      ) : (
                        <span className="font-mono text-[14px] text-ink-400">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </motion.div>
        <p className="mt-3 text-[13px]/[20px] text-ink-400">
          {t({
            hi: 'हमेशा .gov.in / .nic.in से जांचें — किसी भी लिंक पर क्लिक करने से पहले address bar देख लें।',
            en: 'Always verify .gov.in / .nic.in — check the address bar before clicking any link.',
          })}
        </p>
      </section>

      {/* ---------- §6 FAQ ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 md:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          kicker="Common Questions"
          title={{ hi: 'अक्सर पूछे सवाल', en: 'FAQs' }}
        />
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewport15}
          className="mx-auto max-w-[820px]"
        >
          <FAQAccordion faqs={servicesFaqs} />
        </motion.div>
      </section>
    </>
  );
}
