import { forwardRef, ReactNode, useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { type Easing, resolveEasing } from "@/lib/easings";

type Overlay = "vignette" | "left" | "right" | "bottom" | "top" | "dark" | "none";

/**
 * Per-section transition tuning. All values normalized 0–1 against scroll progress.
 * Defaults match the original cinematic feel.
 */
export interface TransitionConfig {
  /** Where the fade-IN finishes (0–1). Lower = snappier reveal. Default 0.18 */
  fadeInEnd?: number;
  /** Where the fade-OUT starts (0–1). Higher = scene lingers longer. Default 0.82 */
  fadeOutStart?: number;
  /** Where the entry blur clears (0–1). Default 0.1 */
  blurInEnd?: number;
  /** Where the exit blur begins (0–1). Default 0.9 */
  blurOutStart?: number;
  /** Peak blur in pixels at the very edges. 0 disables blur. Default 6 */
  blurAmount?: number;
  /** Ken-burns scale range. Video scales from (1+base-amp/2) → (1+base+amp/2). Default {base: 0.04, amplitude: 0.04} */
  scale?: { base?: number; amplitude?: number };
  /** Parallax depth: how far the video drifts vs scroll, in vh. 0 disables. Default 18 */
  parallaxBackground?: number;
  /** Parallax depth for foreground (children/content) in vh. Should be < background for depth. Default 6 */
  parallaxForeground?: number;
  /**
   * Easing curve applied to the opacity ramp (and blur, when present).
   * Accepts a named curve ('linear' | 'easeIn' | 'easeOut' | 'easeInOut' |
   * 'smoothstep' | 'smootherstep' | 'sineInOut' | 'quartInOut') or a custom
   * function `(t: number) => number`. Default: 'smoothstep'.
   */
  fadeEasing?: Easing;
}

interface VideoSectionProps {
  id?: string;
  src: string;
  poster?: string;
  children?: ReactNode;
  overlays?: Overlay[];
  /** Slow down playback (default 0.85). Ignored when `scrub` is true. */
  playbackRate?: number;
  /** Section height in vh (default 100) */
  heightVh?: number;
  /** Additional class for the inner content container */
  className?: string;
  /** Eager load (hero) */
  eager?: boolean;
  /** Fine-tune the crossfade / blur / parallax per section */
  transition?: TransitionConfig;
  /**
   * Scroll-scrubbed playback. When true, autoplay is disabled and the video's
   * currentTime is driven by scroll progress through the section. Smoothing
   * comes from `useScrollProgress` so seeking feels fluid.
   *
   * Note: scrub quality depends on the source file. MP4s with frequent
   * keyframes (e.g., every 0.25s) seek smoothly; long-GOP files may stutter.
   */
  scrub?: boolean;
  /** Sub-range of scroll progress (0–1) that maps to 0→duration. Default [0, 1]. */
  scrubRange?: [number, number];
  /** Reverse the scrub direction (scroll down → video plays backward). Default false. */
  scrubReverse?: boolean;
}

/**
 * Fullscreen video section with crossfade in/out driven by scroll progress.
 * Children (text/UI) sit on top, anchored to side gutters.
 */
export const VideoSection = forwardRef<HTMLElement, VideoSectionProps>(
  (
    {
      id,
      src,
      poster,
      children,
      overlays = ["vignette", "left", "right"],
      playbackRate = 0.85,
      heightVh = 100,
      className = "",
      eager = false,
      transition,
    },
    _ref
  ) => {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progress = useScrollProgress(sectionRef);
    const [shouldLoad, setShouldLoad] = useState(eager);

    // Resolve transition config with defaults that match the original feel.
    const fadeInEnd = transition?.fadeInEnd ?? 0.18;
    const fadeOutStart = transition?.fadeOutStart ?? 0.82;
    const blurInEnd = transition?.blurInEnd ?? 0.1;
    const blurOutStart = transition?.blurOutStart ?? 0.9;
    const blurAmount = transition?.blurAmount ?? 6;
    const scaleBase = transition?.scale?.base ?? 0.04;
    const scaleAmp = transition?.scale?.amplitude ?? 0.04;
    const parallaxBg = transition?.parallaxBackground ?? 22;
    const parallaxFg = transition?.parallaxForeground ?? 8;
    const ease = resolveEasing(transition?.fadeEasing, "smoothstep");

    // Lazy-load video once it nears the viewport.
    useEffect(() => {
      if (eager) return;
      const el = sectionRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setShouldLoad(true);
              io.disconnect();
            }
          });
        },
        { rootMargin: "200% 0px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }, [eager]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackRate;
      }
    }, [playbackRate, shouldLoad]);

    // Crossfade: ramp in 0→fadeInEnd, hold, ramp out fadeOutStart→1.
    // Compute a linear 0–1 ramp first, then shape it through the easing curve
    // so the curve applies symmetrically to both fade-in and fade-out phases.
    let fadeT = 1;
    if (progress < fadeInEnd) fadeT = progress / fadeInEnd;
    else if (progress > fadeOutStart) fadeT = (1 - progress) / (1 - fadeOutStart);
    const opacity = ease(Math.max(0, Math.min(1, fadeT)));

    // Subtle blur at the very edges of crossfade for premium feel.
    // Blur uses the inverse of the eased ramp so it's strongest where opacity is lowest.
    const blurPx =
      blurAmount <= 0
        ? 0
        : progress < blurInEnd
          ? (1 - ease(progress / blurInEnd)) * blurAmount
          : progress > blurOutStart
            ? ease((progress - blurOutStart) / (1 - blurOutStart)) * blurAmount
            : 0;

    // Ken-burns parallax: scale ramps from (1+base-amp/2) at top → (1+base+amp/2) at bottom.
    const scale = 1 + scaleBase + (progress - 0.5) * scaleAmp;

    // Scroll parallax: progress 0→1 maps to -strength/2 → +strength/2 (vh).
    // Background drifts slower than scroll (translates UP as you scroll DOWN through the section),
    // foreground drifts faster, creating depth between scenes.
    const bgOffsetVh = (0.5 - progress) * parallaxBg;
    const fgOffsetVh = (0.5 - progress) * parallaxFg;
    // Expand video bounds by the half-range of motion so the layer never reveals an edge.
    const bgInsetVh = parallaxBg / 2;

    return (
      <section
        id={id}
        ref={(node) => {
          (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof _ref === "function") _ref(node);
          else if (_ref) (_ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={`relative w-screen ${className}`}
        style={{ height: `${heightVh}vh` }}
      >
        {/* Sticky viewport-locked stage: the video & content stay pinned to the
            viewport while the section scrolls past, so the parallax translate
            below is felt as actual movement against the page. */}
        <div
          className="sticky top-0 left-0 w-screen h-screen overflow-hidden"
          style={{ height: "100vh" }}
        >
          {/* Video layer (parallax background — drifts slowly) */}
          <div
            className="absolute left-0 right-0 will-change-transform"
            style={{
              top: `-${bgInsetVh}vh`,
              bottom: `-${bgInsetVh}vh`,
              opacity,
              filter: blurPx ? `blur(${blurPx}px)` : "none",
              transform: `translate3d(0, ${bgOffsetVh}vh, 0) scale(${scale})`,
              transition: "filter 200ms linear",
            }}
          >
            {poster ? (
              <img
                src={poster}
                alt=""
                aria-hidden="true"
                loading={eager ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={eager ? "high" : "low"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-background" />
            )}

            {shouldLoad && (
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                preload={eager ? "auto" : "metadata"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            {overlays.includes("vignette") && (
              <div className="absolute inset-0" style={{ background: "var(--grad-vignette)" }} />
            )}
            {overlays.includes("left") && (
              <div className="absolute inset-0" style={{ background: "var(--grad-side-left)" }} />
            )}
            {overlays.includes("right") && (
              <div className="absolute inset-0" style={{ background: "var(--grad-side-right)" }} />
            )}
            {overlays.includes("bottom") && (
              <div className="absolute inset-0" style={{ background: "var(--grad-bottom)" }} />
            )}
            {overlays.includes("top") && (
              <div className="absolute inset-0" style={{ background: "var(--grad-top)" }} />
            )}
            {overlays.includes("dark") && (
              <div className="absolute inset-0 bg-background/55" />
            )}
          </div>

          {/* Content (parallax foreground — drifts faster) */}
          <div
            className="relative z-10 w-full h-full will-change-transform"
            style={{ transform: `translate3d(0, ${fgOffsetVh}vh, 0)` }}
          >
            {children}
          </div>
        </div>
      </section>
    );
  }
);

VideoSection.displayName = "VideoSection";

export default VideoSection;
