import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, PenLine } from 'lucide-react';
import { Dropzone, MiniChip, ResultWell, ToolShell, Tween, toolInputCls, toolLabelCls } from './shared';
import { checkerStyle, compressToTarget, formatBytes, readImage, whitenNearWhite } from './image-utils';
import { downloadBlob } from '@/pages/page-utils';
import { useToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface Loaded {
  img: HTMLImageElement;
  url: string;
  w: number;
  h: number;
}

interface Result {
  url: string;
  blob: Blob;
  size: number;
}

const dimPresets = [
  { id: 'sarkari', label: '140×60 · Sarkari', w: 140, h: 60 },
  { id: 'wide', label: '256×64', w: 256, h: 64 },
  { id: 'custom', label: 'Custom', w: 0, h: 0 },
];

/**
 * Tools §4 — Signature Resizer: default 140×60px JPEG ≤20KB, custom dims,
 * KB input, "Background साफ़ करें" luminance-clean toggle, checkered
 * before/after preview.
 */
export default function SignatureResizer() {
  const { toast } = useToast();
  const [photo, setPhoto] = useState<Loaded | null>(null);
  const [presetId, setPresetId] = useState('sarkari');
  const [customW, setCustomW] = useState(140);
  const [customH, setCustomH] = useState(60);
  const [targetKB, setTargetKB] = useState(20);
  const [clean, setClean] = useState(true);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const runRef = useRef(0);

  const targetW = presetId === 'custom' ? Math.max(10, customW || 10) : dimPresets.find((p) => p.id === presetId)!.w;
  const targetH = presetId === 'custom' ? Math.max(10, customH || 10) : dimPresets.find((p) => p.id === presetId)!.h;

  const addFiles = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      try {
        const { img, url, width, height } = await readImage(file);
        setPhoto((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { img, url, w: width, h: height };
        });
      } catch {
        toast('फोटो पढ़ी नहीं जा सकी — दूसरी फोटो आज़माएं');
      }
    },
    [toast]
  );

  // re-process live whenever inputs change
  useEffect(() => {
    if (!photo) return;
    const run = ++runRef.current;
    setWorking(true);
    const t = window.setTimeout(async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(photo.img, 0, 0, photo.w, photo.h, 0, 0, targetW, targetH);
        if (clean) whitenNearWhite(canvas);
        const { blob } = await compressToTarget({
          source: canvas,
          srcW: targetW,
          srcH: targetH,
          targetKB,
          type: 'image/jpeg',
          lockDimensions: true,
        });
        if (run !== runRef.current) return;
        const url = URL.createObjectURL(blob);
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url, blob, size: blob.size };
        });
      } catch {
        if (run === runRef.current) toast('कुछ गड़बड़ हुई — दोबारा कोशिश करें');
      } finally {
        if (run === runRef.current) setWorking(false);
      }
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo, presetId, customW, customH, targetKB, clean]);

  return (
    <ToolShell
      id="sign"
      icon={PenLine}
      tint="cocoa"
      title={{ hi: 'साइन रिसाइज़', en: 'Signature Resizer' }}
      purpose={{ hi: '140×60px, 10–20KB — सरकारी फॉर्म वाला signature तैयार करें', en: 'Exact 140×60px, ≤20KB signatures' }}
    >
      {!photo ? (
        <Dropzone onFiles={addFiles} label="साइन की फोटो यहां डालें या चुनें" hint="सफेद कागज़ पर काले/नीले पेन से · JPG / PNG / WebP" />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {/* before / after on checkered well */}
          <motion.div animate={{ rotateY: clean ? 0 : 8 }} transition={{ duration: 0.2 }} style={{ transformPerspective: 800 }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-400">पहले</p>
                <div className="glass-inset flex h-32 items-center justify-center overflow-hidden rounded-2xl p-2" style={checkerStyle}>
                  <img src={photo.url} alt="original signature" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-400">बाद में</p>
                <div className="glass-inset flex h-32 items-center justify-center overflow-hidden rounded-2xl p-2" style={checkerStyle}>
                  {result ? (
                    <img src={result.url} alt="processed signature" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[12px] text-ink-400">…</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Dropzone onFiles={addFiles} label="दूसरी फोटो चुनें" hint="" compact />
            </div>
          </motion.div>

          {/* controls */}
          <div>
            <div className="flex flex-wrap gap-2">
              {dimPresets.map((p) => (
                <MiniChip key={p.id} mono={p.id !== 'custom'} active={presetId === p.id} onClick={() => setPresetId(p.id)}>
                  {p.label}
                </MiniChip>
              ))}
            </div>

            {presetId === 'custom' && (
              <div className="mt-3 flex gap-3">
                <div className="w-28">
                  <label className={toolLabelCls}>चौड़ाई px</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={customW}
                    onChange={(e) => setCustomW(Number(e.target.value) || 0)}
                    className={cn(toolInputCls, 'font-mono')}
                  />
                </div>
                <div className="w-28">
                  <label className={toolLabelCls}>ऊंचाई px</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={customH}
                    onChange={(e) => setCustomH(Number(e.target.value) || 0)}
                    className={cn(toolInputCls, 'font-mono')}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div className="w-32">
                <label className={toolLabelCls} htmlFor="sign-kb">
                  Target (KB)
                </label>
                <input
                  id="sign-kb"
                  type="number"
                  min={2}
                  max={500}
                  value={targetKB}
                  onChange={(e) => setTargetKB(Math.max(2, Math.min(500, Number(e.target.value) || 20)))}
                  className={cn(toolInputCls, 'font-mono')}
                />
              </div>

              {/* Background साफ़ करें toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={clean}
                onClick={() => setClean((c) => !c)}
                className="flex min-h-[48px] items-center gap-2.5 rounded-2xl px-1 text-[14px] font-semibold text-ink-900"
              >
                <span
                  className={cn(
                    'relative h-7 w-12 rounded-full transition-colors duration-200',
                    clean ? 'bg-leaf-600' : 'bg-ink-400/40'
                  )}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                    className={cn(
                      'absolute top-1 h-5 w-5 rounded-full bg-white shadow',
                      clean ? 'right-1' : 'left-1'
                    )}
                  />
                </span>
                Background साफ़ करें
              </button>
            </div>

            <ResultWell className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[15px] font-semibold text-ink-900">
                    {targetW}×{targetH}px · JPEG
                  </p>
                  <p className="font-mono text-[13px] text-ink-400">
                    {working ? 'बना रहे हैं…' : result ? formatBytes(result.size) : '—'} / ≤ {targetKB} KB
                  </p>
                  {result && result.size > targetKB * 1024 && (
                    <p className="text-[12px] font-medium text-amber-600">इतनी छोटी फोटो में थोड़ा ऊपर रह सकता है</p>
                  )}
                </div>
                <div className="text-right font-mono text-[28px]/[32px] font-semibold text-leaf-700">
                  {result && !working ? <Tween value={Math.round(result.size / 102.4) / 10} format={(n) => `${n.toFixed(1)}`} duration={0.2} /> : '—'}
                  <span className="ml-1 text-[13px] text-ink-400">KB</span>
                </div>
              </div>
              <button
                type="button"
                disabled={!result || working}
                onClick={() => {
                  if (!result) return;
                  downloadBlob(result.blob, `sevasathi-sign-${targetW}x${targetH}.jpg`);
                  toast('✓ डाउनलोड शुरू हो गया');
                }}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-leaf-600 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
              >
                <Download size={17} />
                Download signature
              </button>
            </ResultWell>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
