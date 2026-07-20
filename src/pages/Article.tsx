import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  BadgeCheck,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  IndianRupee,
  Info,
  Link2,
  ListOrdered,
  MessageCircle,
  Phone,
  Send,
  SquareCheck,
  Zap,
} from 'lucide-react';
import CountUp from '@/components/CountUp';
import FAQAccordion from '@/components/FAQAccordion';
import StepGuide from '@/components/StepGuide';
import {
  panArticle,
  panDocs,
  panFaqs,
  panFees,
  panHelpline,
  panOfficialLinks,
  panPrevNext,
  panRelated,
  panSteps,
} from '@/lib/data';
import { easeOutExpo, pop, rise, stagger, viewport15 } from '@/lib/motion';
import { useLang } from '@/lib/lang';
import type { Bi } from '@/lib/lang';
import { tintDiscBg, tintIcon } from '@/lib/tints';
import { useToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

/** §3 TOC — anchors (scroll-spy). Order per article.md chip row. */
const tocItems: { id: string; label: Bi }[] = [
  { id: 'quick', label: { hi: 'तेज़ जवाब', en: 'Quick Answer' } },
  { id: 'documents', label: { hi: 'दस्तावेज़', en: 'Documents' } },
  { id: 'fees', label: { hi: 'फीस', en: 'Fees' } },
  { id: 'steps', label: { hi: 'Steps', en: 'Steps' } },
  { id: 'faq', label: { hi: 'FAQ', en: 'FAQ' } },
  { id: 'links', label: { hi: 'Official Links', en: 'Official Links' } },
];

/** docs rows slide x -20→0 (article.md §4) */
const slideX = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOutExpo } },
};

const metaChip =
  'inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/55 px-3 py-1.5 text-[12.5px] font-semibold text-ink-600';

/** Small bilingual section heading used inside the article body. */
function ArticleH2({ title }: { title: Bi }) {
  const { t, s } = useLang();
  return (
    <h2 className="mb-5 text-[23px]/[30px] font-bold md:text-[28px]/[36px]">
      {t(title)}
      <span className="ml-2.5 text-[0.62em] font-medium text-ink-400">{s(title)}</span>
    </h2>
  );
}

export default function Article() {
  const { t, s } = useLang();
  const { toast } = useToast();
  const [active, setActive] = useState('quick');

  /* Reading progress bar — scaleX tied to scroll (article.md chrome) */
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  /* §3 scroll-spy */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://sevasathi.in/article';
  const shareText = `${panArticle.title.hi} — SevaSathi Guide`;
  const whatsAppHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`;
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast('✓ कॉपी हो गया');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = pageUrl;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        toast('✓ कॉपी हो गया');
      } catch {
        /* clipboard unavailable */
      }
      ta.remove();
    }
  };

  return (
    <>
      {/* reading progress bar */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-terracotta-600"
        style={{ scaleX: progressX }}
      />

      {/* ---------- §1 Breadcrumb + hero card ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 pt-6 md:px-6 lg:px-8">
        <motion.nav
          aria-label="breadcrumb"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
          className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-ink-400"
        >
          {panArticle.breadcrumb.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden className="text-ink-400/60">
                  ›
                </span>
              )}
              {c.href ? (
                <Link to={c.href} className="transition-colors hover:text-terracotta-600">
                  {t(c.label)}
                </Link>
              ) : (
                <span className="text-ink-600">{t(c.label)}</span>
              )}
            </span>
          ))}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="glass-card glass-tint-amber relative mt-4 overflow-hidden p-6 md:p-8 lg:p-10"
        >
          <div aria-hidden className="mandala-overlay pointer-events-none absolute inset-0" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              {/* chips */}
              <motion.div
                variants={stagger(0.06, 0.15)}
                initial="hidden"
                animate="show"
                className="flex flex-wrap items-center gap-2"
              >
                <motion.span
                  variants={pop}
                  className="rounded-full bg-amber-100 px-3 py-1 text-[12.5px] font-semibold text-amber-600"
                >
                  {t(panArticle.category)} · {s(panArticle.category)}
                </motion.span>
                <motion.span
                  variants={pop}
                  className="rounded-full bg-leaf-100 px-3 py-1 text-[12.5px] font-semibold text-leaf-600"
                >
                  {t(panArticle.difficulty)} · {s(panArticle.difficulty)}
                </motion.span>
              </motion.div>

              <h1 className="mt-4 text-[28px]/[34px] font-bold md:text-[42px]/[48px]">
                {t(panArticle.title)}
              </h1>
              <p className="mt-2 text-[14.5px]/[22px] font-medium text-ink-400 md:text-[16px]/[24px]">
                {t(panArticle.sub)}
              </p>

              {/* meta row */}
              <motion.div
                variants={stagger(0.06, 0.3)}
                initial="hidden"
                animate="show"
                className="mt-5 flex flex-wrap gap-2"
              >
                <motion.span variants={pop} className={metaChip}>
                  <BadgeCheck size={15} strokeWidth={1.75} className="text-leaf-600" />
                  <span className="text-leaf-600">Verified</span>
                </motion.span>
                <motion.span variants={pop} className={metaChip}>
                  <CalendarCheck2 size={14} strokeWidth={1.75} className="text-ink-400" />
                  {t(panArticle.updated)}
                </motion.span>
                <motion.span variants={pop} className={metaChip}>
                  <Clock size={14} strokeWidth={1.75} className="text-ink-400" />
                  {t(panArticle.readTime)}
                </motion.span>
                <motion.span variants={pop} className={metaChip}>
                  <IndianRupee size={14} strokeWidth={1.75} className="text-ink-400" />
                  <span className="font-mono">{t(panArticle.fee)}</span>
                </motion.span>
              </motion.div>

              {/* share row */}
              <motion.div
                variants={stagger(0.06, 0.4)}
                initial="hidden"
                animate="show"
                className="mt-6 flex flex-wrap items-center gap-2.5"
              >
                <motion.a
                  variants={pop}
                  href={whatsAppHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-leaf-600 px-5 text-[14.5px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(62,107,80,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <MessageCircle size={17} strokeWidth={1.75} />
                  WhatsApp
                </motion.a>
                <motion.button
                  variants={pop}
                  type="button"
                  onClick={copyLink}
                  className="glass-card inline-flex h-11 items-center gap-2 !rounded-full px-4 text-[14px] font-semibold text-ink-900 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <Link2 size={16} strokeWidth={1.75} />
                  {t({ hi: 'Link Copy', en: 'Copy Link' })}
                </motion.button>
                <motion.a
                  variants={pop}
                  href={telegramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card inline-flex h-11 items-center gap-2 !rounded-full px-4 text-[14px] font-semibold text-ink-900 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <Send size={16} strokeWidth={1.75} />
                  <span className="hidden sm:inline">Telegram</span>
                </motion.a>
              </motion.div>
            </div>

            {/* illustration (lg: 40% width, float ±8px 6s) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
              className="lg:w-[40%] lg:shrink-0"
            >
              <img
                src="/article-hero-guide.png"
                alt={t(panArticle.title)}
                className="w-full animate-float-y rounded-3xl"
                loading="eager"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ---------- §2 Quick Answer ---------- */}
        <motion.div
          id="quick"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: easeOutExpo }}
          className="glass-inset relative mt-6 overflow-hidden p-5 md:p-6"
        >
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3, delay: 0.35, ease: easeOutExpo }}
            className="absolute bottom-0 left-0 top-0 w-1 origin-top bg-leaf-600"
          />
          <div className="flex items-start gap-3.5 pl-2">
            <span className="icon-disc h-10 w-10 shrink-0 bg-leaf-100">
              <Zap size={19} strokeWidth={1.75} className="text-leaf-600" />
            </span>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-leaf-600">
                {t({ hi: 'सबसे पहले यह पढ़ें', en: 'Read this first' })}
              </p>
              <p className="mt-1.5 text-[16.5px]/[27px] font-medium text-ink-900 md:text-[18px]/[29px]">
                {t(panArticle.quickAnswer)}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------- §3 TOC — mobile sticky chip row ---------- */}
      <div className="sticky top-16 z-40 mt-6 border-y border-white/60 bg-cream-100/85 backdrop-blur-md lg:hidden">
        <div className="scroll-fade-x no-scrollbar overflow-x-auto px-4">
          <div className="flex w-max gap-2 py-2.5">
            {tocItems.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    'relative flex h-9 shrink-0 items-center rounded-full px-4 text-[13.5px] font-semibold transition-colors duration-200',
                    isActive ? 'text-white' : 'glass-card !rounded-full text-ink-600'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="toc-pill"
                      className="absolute inset-0 rounded-full bg-terracotta-600"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t(item.label)}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- §3-9 Body grid: sticky TOC (desktop) + sections ---------- */}
      <div className="mx-auto max-w-[1180px] px-4 md:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[224px_minmax(0,1fr)] lg:gap-10">
          {/* desktop sticky TOC with scroll-spy */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 pt-14">
              <p className="px-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                {t({ hi: 'इस पेज पर', en: 'On this page' })}
              </p>
              <div className="mt-3 flex flex-col gap-0.5">
                {tocItems.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActive(item.id)}
                      className={cn(
                        'rounded-r-xl border-l-2 px-4 py-2 text-[14px] font-semibold transition-all duration-200',
                        isActive
                          ? 'border-terracotta-600 bg-white/50 text-terracotta-600'
                          : 'border-transparent text-ink-400 hover:text-ink-900'
                      )}
                    >
                      {t(item.label)}
                    </a>
                  );
                })}
              </div>
            </nav>
          </aside>

          <div className="flex min-w-0 flex-col gap-14 py-12 lg:py-14">
            {/* ---------- §4 Documents ---------- */}
            <section id="documents">
              <ArticleH2 title={{ hi: 'ज़रूरी दस्तावेज़', en: 'Documents Needed' }} />
              <motion.div
                variants={stagger(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={viewport15}
                className="glass-card divide-y divide-black/5 overflow-hidden"
              >
                {panDocs.map((doc, i) => (
                  <motion.div key={i} variants={slideX} className="flex items-center gap-3.5 p-4 md:p-5">
                    <SquareCheck size={22} strokeWidth={1.75} className="shrink-0 text-leaf-600" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink-900">{t(doc.name)}</p>
                      <p className="text-[13px]/[19px] text-ink-400">{t(doc.note)}</p>
                    </div>
                    {doc.tool && (
                      <motion.span
                        initial={{ rotate: 0 }}
                        whileInView={{ rotate: [0, -2, 2, 0] }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <Link
                          to={doc.tool.href}
                          className="inline-flex shrink-0 items-center rounded-full bg-leaf-100 px-3 py-1.5 text-[12.5px] font-semibold text-leaf-700 transition-transform duration-200 hover:scale-105 active:scale-95"
                        >
                          {t(doc.tool.label)}
                        </Link>
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* ---------- §5 Fees table ---------- */}
            <section id="fees">
              <ArticleH2 title={{ hi: 'फीस', en: 'Fees' }} />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewport15}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="glass-inset overflow-hidden"
              >
                <div className="scroll-fade-x overflow-x-auto">
                  <table className="w-full min-w-[380px] text-left text-[15px]">
                    <thead>
                      <tr className="bg-sand-200/80 text-[13px] uppercase tracking-wide text-ink-600">
                        <th className="px-4 py-3 font-semibold md:px-5">{t({ hi: 'प्रकार', en: 'Type' })}</th>
                        <th className="px-4 py-3 text-right font-semibold md:px-5">
                          {t({ hi: 'फीस (भारत)', en: 'Fee (India)' })}
                        </th>
                      </tr>
                    </thead>
                    <motion.tbody
                      variants={stagger(0.04)}
                      initial="hidden"
                      whileInView="show"
                      viewport={viewport15}
                    >
                      {panFees.map((f, i) => (
                        <motion.tr
                          key={i}
                          variants={rise}
                          className={cn('border-t border-black/5', i % 2 === 1 && 'bg-white/40')}
                        >
                          <td className="px-4 py-3.5 font-semibold text-ink-900 md:px-5">{t(f.label)}</td>
                          <td className="px-4 py-3.5 text-right font-mono text-[16px] font-semibold text-ink-900 md:px-5">
                            ₹<CountUp value={f.amount} />
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              </motion.div>
              <p className="mt-3 flex items-start gap-1.5 text-[13px]/[20px] text-ink-400">
                <Info size={14} strokeWidth={1.75} className="mt-1 shrink-0" />
                {t(panArticle.feeNote)}
              </p>
            </section>

            {/* ---------- §6 Step-by-step (StepGuide §10.10) ---------- */}
            <section id="steps">
              <ArticleH2 title={{ hi: 'स्टेप-बाय-स्टेप', en: 'Step-by-Step Guide' }} />
              <StepGuide steps={panSteps} storageKey={panArticle.id} />
            </section>

            {/* ---------- §7 Official links ---------- */}
            <section id="links">
              <motion.div
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={viewport15}
                className="glass-card glass-tint-leaf p-5 md:p-6"
              >
                <h3 className="flex items-center gap-3 font-display text-[19px]/[26px] font-semibold text-ink-900">
                  <span className="icon-disc h-9 w-9 bg-leaf-100">
                    <Globe size={17} strokeWidth={1.75} className="text-leaf-600" />
                  </span>
                  {t({ hi: 'Official लिंक्स', en: 'Official Links' })}
                </h3>
                <motion.div
                  variants={stagger(0.05)}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewport15}
                  className="mt-4 flex flex-col gap-2.5"
                >
                  {panOfficialLinks.map((l) => (
                    <motion.a
                      key={l.id}
                      variants={rise}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
                    >
                      <Globe size={18} strokeWidth={1.75} className="shrink-0 text-leaf-600" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-ink-900">{l.name}</span>
                        {l.note && <span className="block text-[12.5px] text-ink-400">{t(l.note)}</span>}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-100 px-2.5 py-1 text-[11.5px] font-semibold text-leaf-600">
                        Official
                        <ExternalLink size={11} />
                      </span>
                    </motion.a>
                  ))}
                  <motion.a
                    variants={rise}
                    href={panHelpline.tel}
                    className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
                  >
                    <Phone size={18} strokeWidth={1.75} className="shrink-0 text-leaf-600" />
                    <span className="min-w-0 flex-1 font-semibold text-ink-900">
                      Helpline <span className="ml-1 font-mono text-[14px] text-ink-600">{panHelpline.number}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-600 px-3 py-1 text-[11.5px] font-semibold text-white">
                      Call करें
                    </span>
                  </motion.a>
                </motion.div>
              </motion.div>
            </section>

            {/* ---------- §8 FAQ ---------- */}
            <section id="faq">
              <ArticleH2 title={{ hi: 'अक्सर पूछे सवाल', en: 'FAQs' }} />
              <motion.div variants={rise} initial="hidden" whileInView="show" viewport={viewport15}>
                <FAQAccordion faqs={panFaqs} />
              </motion.div>
            </section>

            {/* ---------- §9 Related guides ---------- */}
            <section>
              <ArticleH2 title={{ hi: 'और गाइड्स', en: 'Related Guides' }} />
              <motion.div
                variants={stagger(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={viewport15}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {panRelated.map((g) => {
                  const Icon = g.icon;
                  return (
                    <motion.div key={g.id} variants={rise} className="h-full">
                      <Link
                        to="/article"
                        className="glass-card group flex h-full flex-col gap-3 p-5 transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
                      >
                        <span
                          className={cn(
                            'icon-disc h-11 w-11 transition-transform duration-200 ease-out-expo group-hover:-rotate-6 group-hover:scale-105',
                            tintDiscBg[g.tint]
                          )}
                        >
                          <Icon size={20} strokeWidth={1.75} className={tintIcon[g.tint]} />
                        </span>
                        <h3 className="font-display text-[16px]/[22px] font-semibold text-ink-900">
                          {t(g.title)}
                        </h3>
                        <p className="mt-auto flex items-center gap-2 pt-1 text-[12.5px] font-medium text-ink-400">
                          <Clock size={13} />
                          {g.readTime}
                          <span aria-hidden>·</span>
                          <ListOrdered size={13} />
                          {g.steps} Steps
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>

            {/* ---------- §9 Prev / Next ---------- */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <Link
                to="/article"
                className="glass-card group flex items-center gap-2.5 p-4 transition-all duration-200 active:scale-[0.98] md:p-5"
              >
                <ChevronLeft
                  size={19}
                  className="shrink-0 text-terracotta-600 transition-transform duration-200 group-hover:-translate-x-1"
                />
                <span className="min-w-0">
                  <span className="block text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                    {t({ hi: 'पिछली गाइड', en: 'Previous' })}
                  </span>
                  <span className="block truncate font-display text-[15px] font-semibold text-ink-900">
                    {t(panPrevNext.prev)}
                  </span>
                </span>
              </Link>
              <Link
                to="/article"
                className="glass-card group flex items-center justify-end gap-2.5 p-4 text-right transition-all duration-200 active:scale-[0.98] md:p-5"
              >
                <span className="min-w-0">
                  <span className="block text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
                    {t({ hi: 'अगली गाइड', en: 'Next' })}
                  </span>
                  <span className="block truncate font-display text-[15px] font-semibold text-ink-900">
                    {t(panPrevNext.next)}
                  </span>
                </span>
                <ChevronRight
                  size={19}
                  className="shrink-0 text-terracotta-600 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* ---------- §9 Trust footer note ---------- */}
            <p className="mx-auto max-w-[640px] text-center text-[13px]/[20px] text-ink-400">
              {t(panArticle.trustNote)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
