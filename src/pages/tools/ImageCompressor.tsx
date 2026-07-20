import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Download, ImageDown, Loader2, X } from 'lucide-react';
import { Dropzone, MiniChip, ResultWell, ToolShell, toolInputCls, toolLabelCls } from './shared';
import { compressToTarget, formatBytes, readImage } from './image-utils';
import type { OutFormat } from './image-utils';
import { downloadBlob } from '@/pages/page-utils';
import { useToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface QueueItem {
  id: number;
  file: File;
  name: string;
  origSize: number;
  origUrl: string;
  status: 'working' | 'done' | 'error';
  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;
}

let nextId = 1;

/**
 * Tools §2 — Image Compressor: canvas → binary-search JPEG/WebP quality
 * (7 iterations) to land ≤ target KB; downscales if quality floor 0.35
 * still misses. Queue list, per-file + download-all.
 */
export default function ImageCompressor() {
  const { toast } = useToast();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [targetKB, setTargetKB] = useState(20);
  const [format, setFormat] = useState<OutFormat>('image/jpeg');
  const itemsRef = useRef<QueueItem[]>([]);
  itemsRef.current = items;

  const compressOne = useCallback(
    async (item: QueueItem, kb: number, type: OutFormat) => {
      try {
        const { img, url, width, height } = await readImage(item.file);
        const res = await compressToTarget({ source: img, srcW: width, srcH: height, targetKB: kb, type });
        URL.revokeObjectURL(url);
        const resultUrl = URL.createObjectURL(res.blob);
        setItems((prev) =>
          prev.map((p) => {
            if (p.id !== item.id) return p;
            if (p.resultUrl) URL.revokeObjectURL(p.resultUrl);
            return { ...p, status: 'done', resultBlob: res.blob, resultUrl, resultSize: res.blob.size };
          })
        );
      } catch {
        setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: 'error' } : p)));
        toast('फोटो पढ़ी नहीं जा सकी — दूसरी फोटो आज़माएं');
      }
    },
    [toast]
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const fresh: QueueItem[] = files.map((file) => ({
        id: nextId++,
        file,
        name: file.name.replace(/\.[^.]+$/, ''),
        origSize: file.size,
        origUrl: URL.createObjectURL(file),
        status: 'working',
      }));
      setItems((prev) => [...prev, ...fresh]);
      fresh.forEach((it) => compressOne(it, targetKB, format));
    },
    [compressOne, targetKB, format]
  );

  // re-compress the whole queue when target / format changes (debounced)
  useEffect(() => {
    if (!items.length) return;
    const t = window.setTimeout(() => {
      itemsRef.current.forEach((it) => {
        setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: 'working' } : p)));
        compressOne(it, targetKB, format);
      });
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKB, format]);

  const removeItem = (id: number) => {
    setItems((prev) => {
      const it = prev.find((p) => p.id === id);
      if (it) {
        URL.revokeObjectURL(it.origUrl);
        if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const downloadOne = (it: QueueItem) => {
    if (!it.resultBlob) return;
    const ext = format === 'image/webp' ? 'webp' : 'jpg';
    downloadBlob(it.resultBlob, `${it.name}-${targetKB}kb.${ext}`);
    toast('✓ डाउनलोड शुरू हो गया');
  };

  const doneItems = items.filter((i) => i.status === 'done');
  const ext = format === 'image/webp' ? 'webp' : 'jpg';

  return (
    <ToolShell
      id="compress"
      icon={ImageDown}
      tint="leaf"
      deep
      title={{ hi: 'फोटो कंप्रेस करें', en: 'Image Compressor' }}
      purpose={{ hi: 'SSC, PAN, Scholarship फॉर्म के लिए फोटो 20KB तक छोटी करें', en: 'Shrink form photos to 20KB' }}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* left: dropzone + queue previews */}
        <div>
          <Dropzone
            onFiles={addFiles}
            multiple
            label="फोटो यहां डालें या चुनें"
            hint="JPG / PNG / WebP · 20MB तक · एक से ज्यादा फोटो भी चलेंगी"
          />

          {items.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              {items.map((it) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="glass-inset flex items-center gap-3 rounded-2xl p-3"
                >
                  <img src={it.origUrl} alt={it.name} className="h-14 w-14 shrink-0 rounded-xl border border-black/5 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-ink-900">{it.name}</p>
                    <p className="font-mono text-[12px] text-ink-400">{formatBytes(it.origSize)}</p>
                  </div>
                  {it.status === 'working' && <Loader2 size={18} className="animate-spin text-terracotta-600" />}
                  <button
                    type="button"
                    aria-label="हटाएं"
                    onClick={() => removeItem(it.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-black/5 hover:text-ink-900"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* right: controls + results */}
        <div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-28">
              <label className={toolLabelCls} htmlFor="compress-target">
                Target (KB)
              </label>
              <input
                id="compress-target"
                type="number"
                min={5}
                max={2048}
                value={targetKB}
                onChange={(e) => setTargetKB(Math.max(5, Math.min(2048, Number(e.target.value) || 20)))}
                className={cn(toolInputCls, 'font-mono')}
              />
            </div>
            <div className="flex gap-1.5">
              {[10, 20, 50, 100].map((kb) => (
                <MiniChip key={kb} mono active={targetKB === kb} onClick={() => setTargetKB(kb)}>
                  {kb}KB
                </MiniChip>
              ))}
            </div>
            <div className="glass-inset flex h-9 items-center rounded-full p-1 text-[13px] font-semibold">
              {(['image/jpeg', 'image/webp'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={cn(
                    'h-7 rounded-full px-3.5 transition-colors duration-200',
                    format === f ? 'bg-terracotta-600 text-white' : 'text-ink-600'
                  )}
                >
                  {f === 'image/jpeg' ? 'JPEG' : 'WebP'}
                </button>
              ))}
            </div>
          </div>

          {/* results */}
          <div className="mt-4 flex flex-col gap-3">
            {items.length === 0 && (
              <ResultWell className="text-center text-[14px] text-ink-400">
                फोटो चुनते ही नतीजा यहां दिखेगा — कुछ भी upload नहीं होता
              </ResultWell>
            )}
            {items.map((it) => (
              <ResultWell key={it.id} className={cn(it.status === 'working' && 'animate-bar-pulse')}>
                {it.status === 'working' ? (
                  <p className="py-2 text-center text-[14px] font-medium text-ink-400">Compress हो रहा है…</p>
                ) : it.status === 'error' ? (
                  <p className="py-2 text-center text-[14px] font-medium text-terracotta-700">यह फोटो नहीं चली</p>
                ) : (
                  <div className="flex items-center gap-3">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      src={it.resultUrl}
                      alt="compressed"
                      className="h-24 w-24 shrink-0 rounded-xl border border-black/5 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[15px] font-semibold text-ink-900">
                        {formatBytes(it.origSize)} → {formatBytes(it.resultSize ?? 0)}
                      </p>
                      <span className="mt-1 inline-flex rounded-full bg-leaf-100 px-2.5 py-1 font-mono text-[12px] font-semibold text-leaf-700">
                        -{Math.max(0, Math.round((1 - (it.resultSize ?? 0) / it.origSize) * 100))}%
                      </span>
                    </div>
                    <motion.button
                      type="button"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: [0.9, 1.05, 1] }}
                      transition={{ duration: 0.4 }}
                      onClick={() => downloadOne(it)}
                      className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-leaf-600 px-5 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      <Download size={17} />
                      Download
                    </motion.button>
                  </div>
                )}
              </ResultWell>
            ))}

            {doneItems.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  doneItems.forEach((it) => downloadBlob(it.resultBlob!, `${it.name}-${targetKB}kb.${ext}`))
                }
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-leaf-600 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Download size={17} />
                सभी Download ({doneItems.length})
              </button>
            )}
          </div>

          {/* use-case chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-semibold text-ink-400">कहां काम आएगा:</span>
            {['SSC फॉर्म', 'PAN आवेदन', 'Scholarship फॉर्म'].map((chip) => (
              <Link
                key={chip}
                to="/article"
                className="glass-card !rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-ink-600 transition-colors hover:text-terracotta-600"
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
