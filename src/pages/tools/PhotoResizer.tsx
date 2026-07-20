import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Crop, Download, Info, ZoomIn } from 'lucide-react';
import { Dropzone, MiniChip, ResultWell, ToolShell, toolInputCls, toolLabelCls } from './shared';
import { canvasToBlob, compressToTarget, formatBytes, readImage } from './image-utils';
import { downloadBlob } from '@/pages/page-utils';
import { useToast } from '@/lib/toast';
import { easeOutExpo } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface Preset {
  id: string;
  label: string;
  w: number;
  h: number;
}

const presets: Preset[] = [
  { id: 'passport', label: 'Passport 3.5×4.5cm (413×531px)', w: 413, h: 531 },
  { id: 'ssc', label: 'SSC 200×230px', w: 200, h: 230 },
  { id: 'pan', label: 'PAN 213×213px', w: 213, h: 213 },
];

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

/**
 * Tools §3 — Photo Resizer: preset chips (Passport / SSC / PAN / Custom),
 * live crop preview with movable crop window (drag, grid thirds) + zoom,
 * optional KB target (reuses compressor logic).
 */
export default function PhotoResizer() {
  const { toast } = useToast();
  const [photo, setPhoto] = useState<Loaded | null>(null);
  const [presetId, setPresetId] = useState('passport');
  const [customW, setCustomW] = useState(300);
  const [customH, setCustomH] = useState(300);
  const [kbTarget, setKbTarget] = useState('');
  const [zoom, setZoom] = useState(1);
  const [win, setWin] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const boxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const targetW = presetId === 'custom' ? Math.max(10, customW || 10) : presets.find((p) => p.id === presetId)!.w;
  const targetH = presetId === 'custom' ? Math.max(10, customH || 10) : presets.find((p) => p.id === presetId)!.h;
  const aspect = targetW / targetH;

  // measure preview box
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setBox({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, [photo]);

  const cover = photo && box.w > 0 ? Math.max(box.w / photo.w, box.h / photo.h) : 1;
  const scale = cover * zoom;
  const dispW = photo ? photo.w * scale : 0;
  const dispH = photo ? photo.h * scale : 0;
  const imgX = (box.w - dispW) / 2;
  const imgY = (box.h - dispH) / 2;

  // crop window dims: largest rect of target aspect within 85% of the box
  const maxW = box.w * 0.85;
  const maxH = box.h * 0.85;
  let winW = maxW;
  let winH = winW / aspect;
  if (winH > maxH) {
    winH = maxH;
    winW = winH * aspect;
  }

  const clampWin = useCallback(
    (x: number, y: number) => ({
      x: Math.min(Math.max(0, x), Math.max(0, box.w - winW)),
      y: Math.min(Math.max(0, y), Math.max(0, box.h - winH)),
    }),
    [box.w, box.h, winW, winH]
  );

  // re-center window whenever box/aspect changes
  useEffect(() => {
    if (box.w > 0) setWin(clampWin((box.w - winW) / 2, (box.h - winH) / 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box.w, box.h, aspect]);

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
        setResult(null);
        setZoom(1);
      } catch {
        toast('फोटो पढ़ी नहीं जा सकी — दूसरी फोटो आज़माएं');
      }
    },
    [toast]
  );

  /* pointer drag on the crop window */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    setWin(clampWin(d.x + (e.clientX - d.px), d.y + (e.clientY - d.py)));
  };
  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const makeResult = async () => {
    if (!photo || box.w === 0) return;
    setWorking(true);
    try {
      // source rect in natural-image coordinates
      const sx = Math.max(0, (win.x - imgX) / scale);
      const sy = Math.max(0, (win.y - imgY) / scale);
      const sw = Math.min(photo.w - sx, winW / scale);
      const sh = Math.min(photo.h - sy, winH / scale);

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = targetW;
      cropCanvas.height = targetH;
      const ctx = cropCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(photo.img, sx, sy, sw, sh, 0, 0, targetW, targetH);

      const kb = parseInt(kbTarget, 10);
      const blob = kb > 0
        ? (await compressToTarget({ source: cropCanvas, srcW: targetW, srcH: targetH, targetKB: kb, type: 'image/jpeg', lockDimensions: true })).blob
        : await canvasToBlob(cropCanvas, 'image/jpeg', 0.92);

      const url = URL.createObjectURL(blob);
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url, blob, size: blob.size };
      });
      toast('✓ फोटो तैयार है');
    } catch {
      toast('कुछ गड़बड़ हुई — दोबारा कोशिश करें');
    } finally {
      setWorking(false);
    }
  };

  return (
    <ToolShell
      id="resize"
      icon={Crop}
      tint="terracotta"
      title={{ hi: 'फोटो रिसाइज़', en: 'Photo Resizer' }}
      purpose={{ hi: 'Passport, SSC, PAN size — crop करके exact pixels में', en: 'Passport / SSC / PAN exact sizes' }}
    >
      {/* preset chips */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <MiniChip key={p.id} mono active={presetId === p.id} onClick={() => setPresetId(p.id)}>
            {p.label}
          </MiniChip>
        ))}
        <MiniChip active={presetId === 'custom'} onClick={() => setPresetId('custom')}>
          Custom
        </MiniChip>
      </div>

      {presetId === 'custom' && (
        <div className="mt-3 flex gap-3">
          <div className="w-28">
            <label className={toolLabelCls}>चौड़ाई px</label>
            <input
              type="number"
              min={10}
              max={4000}
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
              max={4000}
              value={customH}
              onChange={(e) => setCustomH(Number(e.target.value) || 0)}
              className={cn(toolInputCls, 'font-mono')}
            />
          </div>
        </div>
      )}

      {!photo ? (
        <div className="mt-4">
          <Dropzone onFiles={addFiles} label="फोटो यहां डालें या चुनें" hint="JPG / PNG / WebP · 20MB तक" compact />
        </div>
      ) : (
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          {/* crop preview */}
          <div>
            <div
              ref={boxRef}
              className="glass-inset relative h-[320px] touch-none overflow-hidden rounded-2xl select-none md:h-[360px]"
            >
              <img
                src={photo.url}
                alt="crop preview"
                draggable={false}
                className="absolute max-w-none"
                style={{ width: dispW, height: dispH, left: imgX, top: imgY }}
              />
              {/* dim outside the crop window */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(rgba(44,39,33,0.45), rgba(44,39,33,0.45))`,
                  clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${win.x}px ${win.y}px, ${win.x}px ${win.y + winH}px, ${win.x + winW}px ${win.y + winH}px, ${win.x + winW}px ${win.y}px, ${win.x}px ${win.y}px)`,
                }}
              />
              {/* crop window */}
              <div
                role="presentation"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={cn(
                  'absolute cursor-move rounded-sm border-2 transition-shadow duration-200',
                  dragging ? 'border-amber-500 shadow-[0_0_0_4px_rgba(217,160,63,0.35)]' : 'border-white/90'
                )}
                style={{ left: win.x, top: win.y, width: winW, height: winH }}
              >
                {/* rule-of-thirds grid */}
                <div className="pointer-events-none absolute inset-0">
                  <span className="absolute left-1/3 top-0 bottom-0 w-px bg-white/60" />
                  <span className="absolute left-2/3 top-0 bottom-0 w-px bg-white/60" />
                  <span className="absolute top-1/3 left-0 right-0 h-px bg-white/60" />
                  <span className="absolute top-2/3 left-0 right-0 h-px bg-white/60" />
                </div>
                {/* corner handles */}
                {['-left-1.5 -top-1.5', '-right-1.5 -top-1.5', '-left-1.5 -bottom-1.5', '-right-1.5 -bottom-1.5'].map((pos) => (
                  <span
                    key={pos}
                    className={cn(
                      'absolute h-3.5 w-3.5 rounded-full border-2 border-white transition-colors duration-200',
                      pos,
                      dragging ? 'bg-amber-500' : 'bg-terracotta-600'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* zoom */}
            <div className="mt-3 flex items-center gap-3">
              <ZoomIn size={17} className="shrink-0 text-ink-400" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-terracotta-600"
                aria-label="Zoom"
              />
              <span className="w-12 text-right font-mono text-[12px] text-ink-400">{zoom.toFixed(2)}×</span>
            </div>

            <div className="mt-3">
              <Dropzone onFiles={addFiles} label="दूसरी फोटो चुनें" hint="" compact />
            </div>
          </div>

          {/* controls + result */}
          <div>
            <p className="text-[14px] text-ink-600">
              खिड़की को खींचकर फोटो के सबसे अच्छे हिस्से पर रखें, ज़रूरत हो तो zoom बढ़ाएं।
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-amber-100 px-3.5 py-2.5 text-[13px] font-medium text-amber-600">
              <Info size={15} className="shrink-0" />
              सफेद background वाली फोटो चुनें
            </div>

            <div className="mt-4 w-36">
              <label className={toolLabelCls} htmlFor="resize-kb">
                KB target (optional)
              </label>
              <input
                id="resize-kb"
                type="number"
                min={0}
                max={2048}
                placeholder="जैसे 50"
                value={kbTarget}
                onChange={(e) => setKbTarget(e.target.value)}
                className={cn(toolInputCls, 'font-mono')}
              />
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={working}
              onClick={makeResult}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 text-[15px] font-semibold text-white shadow-warm transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Crop size={17} />
              {working ? 'बना रहे हैं…' : `${targetW}×${targetH}px में काटें`}
            </motion.button>

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
                className="mt-4"
              >
                <ResultWell>
                  <div className="flex items-center gap-3">
                    <img
                      src={result.url}
                      alt="resized"
                      className="h-24 w-24 shrink-0 rounded-xl border border-black/5 bg-white object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[14px] font-semibold text-ink-900">
                        {targetW}×{targetH}px
                      </p>
                      <p className="font-mono text-[13px] text-ink-400">{formatBytes(result.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        downloadBlob(result.blob, `sevasathi-photo-${targetW}x${targetH}.jpg`);
                        toast('✓ डाउनलोड शुरू हो गया');
                      }}
                      className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-leaf-600 px-5 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      <Download size={17} />
                      Download
                    </button>
                  </div>
                </ResultWell>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </ToolShell>
  );
}
