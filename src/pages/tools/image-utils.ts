/**
 * 100% client-side image helpers (tools.md §13): Canvas API + Blobs.
 * Files never leave the device.
 */

export type OutFormat = 'image/jpeg' | 'image/webp';

/** "12.4 MB" / "19.8 KB" / "820 B" */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${Math.round(bytes)} B`;
}

export interface LoadedImage {
  img: HTMLImageElement;
  url: string; // object URL — caller revokes
  width: number;
  height: number;
}

/** Load a File into an HTMLImageElement via an object URL. */
export function readImage(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image decode failed'));
    };
    img.src = url;
  });
}

/** Draw the source into a canvas of exactly w×h (white fill for JPEG). */
export function drawToCanvas(
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
  w: number,
  h: number,
  fillWhite: boolean
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext('2d')!;
  if (fillWhite) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(source, 0, 0, srcW, srcH, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: OutFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('encode failed'))),
      type,
      quality
    );
  });
}

export interface CompressOptions {
  source: CanvasImageSource;
  srcW: number;
  srcH: number;
  targetKB: number;
  type: OutFormat;
  /** lowest quality tried before downscaling (default 0.35) */
  qualityFloor?: number;
  /** binary-search iterations (default 7) */
  iterations?: number;
  /** when true, never downscale below srcW×srcH (exact-dim exports) */
  lockDimensions?: boolean;
}

export interface CompressResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
}

/**
 * Compress to ≤ targetKB: binary-search quality (7 iterations) between
 * the quality floor and 1.0; if even the floor misses, downscale
 * dimensions ×0.8 and retry (up to 6 rounds).
 */
export async function compressToTarget(opts: CompressOptions): Promise<CompressResult> {
  const { source, srcW, srcH, targetKB, type } = opts;
  const floor = opts.qualityFloor ?? 0.35;
  const iterations = opts.iterations ?? 7;
  const targetBytes = Math.max(1, targetKB) * 1024;

  let scale = 1;
  let fallback: CompressResult | null = null;

  for (let round = 0; round < 6; round++) {
    const w = Math.max(1, Math.round(srcW * scale));
    const h = Math.max(1, Math.round(srcH * scale));
    const canvas = drawToCanvas(source, srcW, srcH, w, h, type === 'image/jpeg');

    let lo = floor;
    let hi = 1;
    let best: CompressResult | null = null;

    for (let i = 0; i < iterations; i++) {
      const q = (lo + hi) / 2;
      const blob = await canvasToBlob(canvas, type, q);
      if (blob.size <= targetBytes) {
        best = { blob, width: w, height: h, quality: q };
        lo = q; // fits — try higher quality
      } else {
        hi = q;
      }
    }

    if (best) return best;

    const floorBlob = await canvasToBlob(canvas, type, floor);
    fallback = { blob: floorBlob, width: w, height: h, quality: floor };

    if (opts.lockDimensions || floorBlob.size <= targetBytes || Math.min(w, h) <= 48) {
      return fallback;
    }
    scale *= 0.8;
  }
  return fallback!;
}

/**
 * "Background साफ़ करें": auto-whiten near-white pixels (luminance
 * threshold) so pen scans look clean; darker strokes get a small
 * contrast boost. Mutates the canvas.
 */
export function whitenNearWhite(canvas: HTMLCanvasElement, threshold = 170) {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
    if (lum >= threshold) {
      px[i] = px[i + 1] = px[i + 2] = 255;
      px[i + 3] = 255;
    } else {
      px[i] = Math.max(0, px[i] * 0.82);
      px[i + 1] = Math.max(0, px[i + 1] * 0.82);
      px[i + 2] = Math.max(0, px[i + 2] * 0.82);
    }
  }
  ctx.putImageData(data, 0, 0);
}

/** Checkered preview background (signature transparency well). */
export const checkerStyle: React.CSSProperties = {
  backgroundImage: 'repeating-conic-gradient(#E9E1D0 0% 25%, #FFFFFF 0% 50%)',
  backgroundSize: '16px 16px',
};
