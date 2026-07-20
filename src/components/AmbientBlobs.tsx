/**
 * Ambient background (design.md §2): fixed layer behind all content —
 * 4 oversized radial blobs at ~55% opacity, extra-blurred, slow drift.
 */
export default function AmbientBlobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-[10vw] -left-[10vw] w-[55vw] h-[55vw] rounded-full opacity-55 blur-[60px] animate-blob-drift"
        style={{ background: 'radial-gradient(circle, #F6CFAF 0%, transparent 70%)' }}
      />
      <div
        className="absolute -top-[8vw] -right-[12vw] w-[50vw] h-[50vw] rounded-full opacity-55 blur-[60px] animate-blob-drift"
        style={{ background: 'radial-gradient(circle, #F4DFA9 0%, transparent 70%)', animationDelay: '-18s' }}
      />
      <div
        className="absolute -bottom-[12vw] -left-[8vw] w-[52vw] h-[52vw] rounded-full opacity-55 blur-[60px] animate-blob-drift"
        style={{ background: 'radial-gradient(circle, #D9E5CF 0%, transparent 70%)', animationDelay: '-32s' }}
      />
      <div
        className="absolute -bottom-[10vw] -right-[10vw] w-[48vw] h-[48vw] rounded-full opacity-55 blur-[60px] animate-blob-drift"
        style={{ background: 'radial-gradient(circle, #EFC9BD 0%, transparent 70%)', animationDelay: '-46s' }}
      />
    </div>
  );
}
