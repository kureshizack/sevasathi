import { useMemo, useState } from 'react';
import { Check, Copy, Trash2, Type } from 'lucide-react';
import { ResultWell, StatTile, ToolShell, Tween } from './shared';
import { copyText, inr } from '@/pages/page-utils';
import { useToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

const platforms = [
  { id: 'sms', label: 'SMS', limit: 160 },
  { id: 'x', label: 'X (Twitter)', limit: 280 },
  { id: 'meta', label: 'Meta description', limit: 155 },
];

/**
 * Tools §9 — Word & Character Counter: live stats (words / chars /
 * no-space / sentences / reading time), platform limit chips that tint
 * amber → red as the count approaches the limit, Copy + Clear.
 */
export default function WordCounter() {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const noSpace = text.replace(/\s/g, '').length;
    const sentences = trimmed ? trimmed.split(/[.!?।\n]+/).filter((s) => s.trim().length > 0).length : 0;
    const readSec = Math.max(0, Math.round((words / 200) * 60));
    const read = words === 0 ? '0 सेकंड' : readSec < 60 ? `${readSec} सेकंड` : `${Math.max(1, Math.round(readSec / 60))} मिन`;
    return { words, chars, noSpace, sentences, read };
  }, [text]);

  const onCopy = async () => {
    if (!text) return;
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      toast('✓ कॉपी हो गया');
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolShell
      id="word"
      icon={Type}
      tint="cocoa"
      title={{ hi: 'शब्द गिनें', en: 'Word & Character Counter' }}
      purpose={{ hi: 'SMS, X, application लिखते समय live गिनती', en: 'Live counts for SMS, posts & applications' }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="यहां लिखें या पेस्ट करें… जैसे: To, The District Magistrate…"
        rows={7}
        className="glass-inset min-h-[160px] w-full resize-y rounded-2xl p-4 text-[17px]/[28px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
      />

      {/* live stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="शब्द">
          <Tween value={stats.words} duration={0.1} format={(n) => inr(Math.round(n))} />
        </StatTile>
        <StatTile label="अक्षर">
          <Tween value={stats.chars} duration={0.1} format={(n) => inr(Math.round(n))} />
        </StatTile>
        <StatTile label="बिना स्पेस">
          <Tween value={stats.noSpace} duration={0.1} format={(n) => inr(Math.round(n))} />
        </StatTile>
        <StatTile label="वाक्य">
          <Tween value={stats.sentences} duration={0.1} format={(n) => inr(Math.round(n))} />
        </StatTile>
        <StatTile label="पढ़ने का समय">
          <span className="text-[18px]/[30px]">{stats.read}</span>
        </StatTile>
      </div>

      {/* platform limit chips */}
      <ResultWell className="mt-4">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-400">Platform limits (अक्षर)</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => {
            const ratio = stats.chars / p.limit;
            const cls =
              ratio > 1
                ? 'bg-rose-100 text-rose-500 border border-rose-500/40'
                : ratio >= 0.8
                  ? 'bg-amber-100 text-amber-600 border border-amber-500/40'
                  : 'bg-white/60 text-ink-600 border border-black/5';
            return (
              <span
                key={p.id}
                className={cn('rounded-full px-3 py-1.5 font-mono text-[12.5px] font-semibold transition-colors duration-300', cls)}
              >
                {p.label}: {inr(stats.chars)}/{p.limit}
                {ratio > 1 && ' — ज्यादा!'}
              </span>
            );
          })}
        </div>
      </ResultWell>

      {/* actions */}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onCopy}
          disabled={!text}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-terracotta-600 text-[15px] font-semibold text-white shadow-warm transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          Copy text
        </button>
        <button
          type="button"
          onClick={() => setText('')}
          disabled={!text}
          className="glass-card flex h-12 items-center justify-center gap-2 !rounded-full px-6 text-[15px] font-semibold text-ink-900 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Trash2 size={17} className="text-rose-500" />
          Clear
        </button>
      </div>
    </ToolShell>
  );
}
