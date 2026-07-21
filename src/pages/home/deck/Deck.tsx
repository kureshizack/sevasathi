import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Briefcase,
  Landmark,
  IdCard,
  GraduationCap,
  Table2,
  Wrench,
  Lightbulb,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Award,
} from 'lucide-react';
import {
  jobs,
  schemes,
  popularServices,
  scholarships,
  officeFormulas,
  tools,
  upiRules,
  liveUpdates,
  liveUpdateCategoryMeta,
} from '@/lib/data';
import { useSheetJobs } from '@/lib/sheetData';
import { useSheetSchemes } from '@/lib/sheetData';
import { useSheetUpdates } from '@/lib/sheetData';
import DeadlineBadge from '@/components/DeadlineBadge';
import DeckCard from './DeckCard';
import { useLang } from '@/lib/lang';
import { useSearch } from '@/lib/search';

const TOTAL = 9;

/**
 * Home — CRED-style card deck.
 * Instead of one long scrolling page, the whole gateway is a stack of
 * full-screen glass cards: every scroll/swipe flips the next card over
 * the previous one. Each card covers ONE topic with a big touch CTA,
 * so visitors explore every section instead of bouncing off a long page.
 */
export default function Deck() {
  return (
    <div className="relative mx-auto max-w-[1180px] pb-[10svh] lg:pb-16">
      <HeroCard index={0} />
      <UpdatesCard index={1} />
      <JobsCard index={2} />
      <SchemesCard index={3} />
      <ServicesCard index={4} />
      <ExamsCard index={5} />
      <OfficeCard index={6} />
      <ToolsCard index={7} />
      <LifeHacksCard index={8} />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 01 — Welcome / Hero card                                         */
/* ---------------------------------------------------------------- */
function HeroCard({ index }: { index: number }) {
  const { openSearch } = useSearch();
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="amber"
      icon={Megaphone}
      kicker="Namaste 🙏"
      title={{ hi: 'SevaSathi — सबका डिजिटल साथी', en: 'SevaSathi — Your Digital Companion' }}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <img src="/logo.svg" alt="SevaSathi" className="h-20 w-20 md:h-24 md:w-24" />
        <p className="mt-4 max-w-[520px] text-[16px]/[26px] font-medium text-ink-600 md:text-[17.5px]/[29px]">
          नौकरियाँ, योजनाएँ, सरकारी काम, परीक्षा, ऑफिस स्किल्स, टूल्स और लाइफ हैक्स —{' '}
          <span className="font-semibold text-terracotta-600">सब कुछ, आसान भाषा में।</span>
        </p>
        <button
          type="button"
          onClick={() => openSearch()}
          className="glass-inset mt-6 flex h-13 w-full max-w-[420px] items-center gap-3 rounded-full px-5 py-3.5 text-left text-[15px] text-ink-400 transition-all hover:ring-2 hover:ring-amber-500/40 active:scale-[0.98]"
        >
          <Search className="h-5 w-5 shrink-0 text-terracotta-600" />
          खोजें… jobs, schemes, tools
        </button>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {[
            ['240+', 'नौकरियाँ'],
            ['50+', 'गाइड'],
            ['8', 'फ्री टूल्स'],
          ].map(([n, l]) => (
            <span key={l} className="glass-inset flex items-baseline gap-1.5 rounded-full px-4 py-2">
              <span className="font-mono text-[17px] font-semibold text-terracotta-600">{n}</span>
              <span className="text-[13px] font-medium text-ink-600">{l}</span>
            </span>
          ))}
        </div>
      </div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-0.5 pb-5 pt-2 text-ink-400"
      >
        <span className="text-[12.5px] font-semibold">कार्ड देखने के लिए स्वाइप करें · Swipe up</span>
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </DeckCard>
  );
}

/* ---------------------------------------------------------------- */
/* 02 — Live Updates card (internal scroll feed)                    */
/* ---------------------------------------------------------------- */
function UpdatesCard({ index }: { index: number }) {
  const { t } = useLang();
  const sheetUpdates = useSheetUpdates();
  const all = [...sheetUpdates, ...liveUpdates].slice(0, 10);
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="terracotta"
      icon={Megaphone}
      kicker="Live Updates"
      title={{ hi: 'ताज़ा अपडेट', en: 'Recent Updates' }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute h-full w-full rounded-full bg-terracotta-600 animate-pulse-dot" />
        </span>
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-terracotta-600">
          LIVE · रोज़ अपडेट
        </span>
      </div>
      <div className="glass-inset min-h-0 flex-1 overflow-y-auto !rounded-2xl">
        {all.map((u, i) => {
          const meta = liveUpdateCategoryMeta[u.category];
          const external = u.href.startsWith('http');
          const inner = (
            <>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${meta.chip}`}>
                {t(meta.label)}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px]/[20px] font-medium text-ink-600">
                {t(u.text)}
              </span>
              {i < sheetUpdates.length && (
                <span className="shrink-0 rounded-full bg-terracotta-600 px-1.5 py-0.5 text-[9.5px] font-bold text-white">NEW</span>
              )}
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-400" />
            </>
          );
          const cls = 'flex items-center gap-2.5 border-b border-black/5 px-3.5 py-2.5 last:border-b-0 hover:bg-white/40 transition-colors';
          return external ? (
            <a key={u.id} href={u.href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
          ) : (
            <Link key={u.id} to={u.href} className={cls}>{inner}</Link>
          );
        })}
      </div>
      <p className="pb-5 pt-3 text-center text-[12.5px] font-medium text-ink-400">
        परीक्षा · एडमिट कार्ड · नौकरी · CBSE · Tech · AI — सब एक जगह
      </p>
    </DeckCard>
  );
}

/* ---------------------------------------------------------------- */
/* 03 — Jobs card                                                   */
/* ---------------------------------------------------------------- */
function JobsCard({ index }: { index: number }) {
  const sheetJobs = useSheetJobs();
  const latest = [...sheetJobs, ...jobs].slice(0, 3);
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="terracotta"
      icon={Briefcase}
      kicker="Sarkari Naukri"
      title={{ hi: 'सरकारी नौकरी', en: 'Govt Jobs' }}
      cta={{ label: { hi: 'सभी 240+ नौकरियाँ देखें', en: 'View all 240+ jobs' }, href: '/jobs' }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {latest.map((job) => (
          <div key={job.id} className="glass-inset flex items-center gap-3 !rounded-2xl p-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta-100 font-display text-[13px] font-bold text-terracotta-700">
              {job.orgShort}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14.5px]/[20px] font-semibold text-ink-900">{job.title}</p>
              <p className="mt-0.5 font-mono text-[11.5px] text-ink-400">पद {job.posts} · {job.qualification}</p>
            </div>
            <DeadlineBadge lastDate={job.lastDate} />
          </div>
        ))}
        <p className="mt-auto pb-1 pt-2 text-center text-[13px] font-medium text-ink-400">
          Admit Card · Result · Answer Key — सब Jobs पेज पर
        </p>
      </div>
    </DeckCard>
  );
}

/* ---------------------------------------------------------------- */
/* 04 — Schemes card                                                */
/* ---------------------------------------------------------------- */
function SchemesCard({ index }: { index: number }) {
  const { t } = useLang();
  const sheetSchemes = useSheetSchemes();
  const top = [...sheetSchemes, ...schemes].slice(0, 3);
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="leaf"
      icon={Landmark}
      kicker="Sarkari Yojana"
      title={{ hi: 'सरकारी योजनाएँ', en: 'Govt Schemes' }}
      cta={{ label: { hi: 'सभी योजनाएँ देखें', en: 'View all schemes' }, href: '/schemes' }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {top.map((sc) => (
          <div key={sc.id} className="glass-inset flex items-center gap-3 !rounded-2xl p-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14.5px]/[20px] font-semibold text-ink-900">{t(sc.name)}</p>
              <p className="mt-0.5 truncate text-[12.5px] text-ink-400">{t(sc.audience)}</p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 font-mono text-[11.5px] font-semibold text-amber-600">
              {sc.benefit}
            </span>
          </div>
        ))}
        <p className="mt-auto pb-1 pt-2 text-center text-[13px] font-medium text-ink-400">
          किसान · महिला · छात्र · बुज़ुर्ग — हर किसी के लिए योजना
        </p>
      </div>
    </DeckCard>
  );
}

/* ---------------------------------------------------------------- */
/* 05 — Services card                                               */
/* ---------------------------------------------------------------- */
function ServicesCard({ index }: { index: number }) {
  const { t } = useLang();
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="amber"
      icon={IdCard}
      kicker="Sarkari Kaam"
      title={{ hi: 'सरकारी सेवाएँ', en: 'Govt Services' }}
      cta={{ label: { hi: 'सभी सेवाओं की गाइड पढ़ें', en: 'Read all service guides' }, href: '/services' }}
    >
      <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-3 md:grid-cols-3">
        {popularServices.slice(0, 6).map((s) => (
          <div key={s.id} className="glass-inset flex flex-col items-center gap-2 !rounded-2xl p-4 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <s.icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="text-[13.5px]/[18px] font-semibold text-ink-900">{t(s.title)}</p>
            <p className="font-mono text-[11px] text-ink-400">⏱ {s.time} · {s.fee}</p>
          </div>
        ))}
      </div>
      <p className="pb-1 pt-3 text-center text-[13px] font-medium text-ink-400">
        Step-by-step गाइड — फोटो सहित, आसान भाषा में
      </p>
    </DeckCard>
  );
}

/* ---------------------------------------------------------------- */
/* 06 — Exams & Scholarships card                                   */
/* ---------------------------------------------------------------- */
function ExamsCard({ index }: { index: number }) {
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="cocoa"
      icon={GraduationCap}
      kicker="Exams & Results"
      title={{ hi: 'परीक्षा व छात्रवृत्ति', en: 'Exams & Scholarships' }}
      cta={{ label: { hi: 'रिज़ल्ट व छात्रवृत्ति देखें', en: 'View results & scholarships' }, href: '/exams' }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Link to="/exams" className="glass-inset flex items-center gap-3 !rounded-2xl p-4 transition-all hover:-translate-y-0.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cocoa-100 text-cocoa-500">
            <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-ink-900">10वीं / 12वीं रिज़ल्ट चेक करें</p>
            <p className="mt-0.5 text-[12.5px] text-ink-400">सभी बोर्ड — Official लिंक सहित</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-ink-400" />
        </Link>
        {scholarships.slice(0, 2).map((s) => (
          <div key={s.id} className="glass-inset flex items-center gap-3 !rounded-2xl p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Award className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px]/[19px] font-semibold text-ink-900">{s.name}</p>
              <p className="mt-0.5 font-mono text-[11.5px] text-ink-400">{s.amount}</p>
            </div>
            {s.lastDate && <DeadlineBadge lastDate={s.lastDate} />}
          </div>
        ))}
        <p className="mt-auto pb-1 pt-2 text-center text-[13px] font-medium text-ink-400">
          Exam Calendar · 9+ छात्रवृत्तियाँ · Prep Tips
        </p>
      </div>
    </DeckCard>
  );
}

/* ---------------------------------------------------------------- */
/* 07 — Office Zone card                                            */
/* ---------------------------------------------------------------- */
function OfficeCard({ index }: { index: number }) {
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="terracotta"
      icon={Table2}
      kicker="Office Zone"
      title={{ hi: 'ऑफिस ज़ोन', en: 'Office Skills' }}
      cta={{ label: { hi: 'Excel सीखना शुरू करें', en: 'Start learning Excel' }, href: '/office' }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <p className="text-[13.5px] font-medium text-ink-400">
          Excel · Word · PowerPoint · रिज़्यूमे · ईमेल — ऑफिस की हर स्किल:
        </p>
        {officeFormulas.slice(0, 3).map((f) => (
          <div key={f.id} className="glass-inset !rounded-2xl p-3.5">
            <p className="text-[13.5px] font-semibold text-ink-900">{f.name}</p>
            <p className="mt-1.5 truncate rounded-lg bg-black/[0.04] px-2.5 py-1.5 font-mono text-[12px] text-terracotta-700">
              {f.formula}
            </p>
          </div>
        ))}
        <p className="mt-auto pb-1 pt-2 text-center text-[13px] font-medium text-ink-400">
          9 फॉर्मूले · 50 Shortcuts · Career Tips
        </p>
      </div>
    </DeckCard>
  );
}

/* ---------------------------------------------------------------- */
/* 08 — Tools card                                                  */
/* ---------------------------------------------------------------- */
function ToolsCard({ index }: { index: number }) {
  const { t } = useLang();
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="leaf"
      icon={Wrench}
      kicker="Free Online Tools"
      title={{ hi: 'ऑनलाइन टूल्स', en: 'Online Tools' }}
      cta={{ label: { hi: 'सभी 8 टूल्स खोलें', en: 'Open all 8 tools' }, href: '/tools' }}
    >
      <div className="grid min-h-0 flex-1 grid-cols-4 content-start gap-2.5 md:gap-3">
        {tools.slice(0, 8).map((tool) => (
          <Link
            key={tool.id}
            to="/tools"
            className="glass-inset flex flex-col items-center gap-1.5 !rounded-2xl p-3 text-center transition-all hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-leaf-600">
              <tool.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
            <p className="text-[11px]/[14px] font-semibold text-ink-600">{t(tool.title)}</p>
          </Link>
        ))}
      </div>
      <p className="pb-1 pt-3 text-center text-[13px] font-medium text-ink-400">
        100% फ्री · 100% प्राइवेट — फोटो कभी अपलोड नहीं होती
      </p>
    </DeckCard>
  );
}

/* ---------------------------------------------------------------- */
/* 09 — Life Hacks card                                             */
/* ---------------------------------------------------------------- */
function LifeHacksCard({ index }: { index: number }) {
  const { t } = useLang();
  return (
    <DeckCard
      index={index}
      total={TOTAL}
      tint="rose"
      icon={Lightbulb}
      kicker="Life Hacks & Safety"
      title={{ hi: 'लाइफ हैक्स', en: 'Life Hacks' }}
      cta={{ label: { hi: 'सभी हैक्स देखें', en: 'View all hacks' }, href: '/lifehacks' }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <p className="text-[13.5px] font-medium text-ink-400">
          UPI फ्रॉड से बचने के 7 नियम — सबसे ज़रूरी 3:
        </p>
        {upiRules.slice(0, 3).map((rule, i) => (
          <div key={i} className="glass-inset flex items-center gap-3 !rounded-2xl p-3.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-leaf-600" strokeWidth={1.75} />
            <p className="text-[14px]/[20px] font-medium text-ink-600">{t(rule)}</p>
          </div>
        ))}
        <div className="glass-inset mt-auto mb-1 flex items-center justify-center gap-2 !rounded-2xl p-3">
          <span className="text-[13px] font-semibold text-ink-900">फ्रॉड हो तो तुरंत कॉल करें:</span>
          <a href="tel:1930" className="rounded-full bg-terracotta-600 px-3 py-1 font-mono text-[13px] font-bold text-white">
            1930
          </a>
        </div>
      </div>
    </DeckCard>
  );
}
