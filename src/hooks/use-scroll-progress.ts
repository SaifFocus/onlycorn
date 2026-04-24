import { useEffect, useRef, useState, RefObject } from "react";

/**
 * Returns 0 → 1 progress through the section ref relative to the viewport,
 * smoothed via a per-frame lerp toward the true scroll position. The damping
 * gives the parallax/crossfade a buttery, momentum-like feel without
 * hijacking native scroll.
 *
 * @param ref Section element to measure
 * @param smoothing 0 (instant) → 1 (frozen). Default 0.12 ≈ ~8 frames to settle.
 */
export function useScrollProgress(ref: RefObject<HTMLElement>, smoothing = 0.12) {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onChange = () => (reducedMotionRef.current = mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      targetRef.current = p;
    };

    const loop = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      // Reduced motion → snap; otherwise lerp toward target.
      const k = reducedMotionRef.current ? 1 : 1 - Math.pow(1 - (1 - smoothing), 1);
      const next = current + (target - current) * k;
      // Settle: if close enough, snap & pause loop until next event.
      if (Math.abs(target - next) < 0.0005) {
        currentRef.current = target;
        setProgress(target);
        rafRef.current = null;
        return;
      }
      currentRef.current = next;
      setProgress(next);
      rafRef.current = requestAnimationFrame(loop);
    };

    const kick = () => {
      measure();
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(loop);
    };

    measure();
    currentRef.current = targetRef.current;
    setProgress(targetRef.current);

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [ref, smoothing]);

  return progress;
}
