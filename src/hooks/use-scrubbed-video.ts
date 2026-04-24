import { RefObject, useEffect, useRef } from "react";

/**
 * Drives a <video>'s currentTime from a normalized scroll progress (0–1).
 *
 * The browser's seek pipeline is heavy, so we:
 *  - lerp the target each frame to smooth out jagged scroll bursts,
 *  - only write currentTime when the delta is meaningful,
 *  - bail out until the video has at least metadata (readyState >= 1).
 *
 * @param videoRef ref to the <video> element to scrub
 * @param progress normalized scroll progress, 0 = first frame, 1 = last frame
 * @param enabled  when false, the hook is a no-op (e.g. mobile / reduced-motion fallback)
 * @param smoothing lerp factor 0–1; higher = snappier, lower = silkier (default 0.18)
 */
export function useScrubbedVideo(
  videoRef: RefObject<HTMLVideoElement>,
  progress: number,
  enabled: boolean = true,
  smoothing: number = 0.18,
) {
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Keep the latest target progress in a ref (no re-renders on each scroll tick).
  useEffect(() => {
    targetRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    // Pause any default playback — we are the playhead now.
    video.pause();

    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const v = videoRef.current;
      if (!v || !v.duration || Number.isNaN(v.duration) || v.readyState < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Lerp current → target for smoothing.
      currentRef.current += (targetRef.current - currentRef.current) * smoothing;

      const target = Math.max(0, Math.min(1, currentRef.current)) * v.duration;
      // Avoid spamming currentTime writes (each one triggers a seek).
      if (Math.abs(v.currentTime - target) > 0.02) {
        try {
          v.currentTime = target;
        } catch {
          // Some browsers throw if the source isn't seekable yet.
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [videoRef, enabled, smoothing]);
}
