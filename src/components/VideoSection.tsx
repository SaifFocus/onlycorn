import { forwardRef, ReactNode, useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

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
}

interface VideoSectionProps {
  id?: string;
  src: string;
  poster?: string;
  children?: ReactNode;
  overlays?: Overlay[];
  /** Slow down playback (default 0.85) */
  playbackRate?: number;
  /** Section height in vh (default 100) */
  heightVh?: number;
  /** Additional class for the inner content container */
  className?: string;
  /** Eager load (hero) */
  eager?: boolean;
  /** Fine-tune the crossfade / blur / parallax per section */
  transition?: TransitionConfig;
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
    },
    _ref
  ) => {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progress = useScrollProgress(sectionRef);
    const [shouldLoad, setShouldLoad] = useState(eager);

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

    // Crossfade: ramp in 0→0.18, hold, ramp out 0.82→1.
    let opacity = 1;
    if (progress < 0.18) opacity = progress / 0.18;
    else if (progress > 0.82) opacity = (1 - progress) / 0.18;
    opacity = Math.max(0, Math.min(1, opacity));

    // Subtle blur at the very edges of crossfade for premium feel.
    const blurPx =
      progress < 0.1
        ? (1 - progress / 0.1) * 6
        : progress > 0.9
          ? ((progress - 0.9) / 0.1) * 6
          : 0;

    // Slight scale parallax on video.
    const scale = 1.04 + (progress - 0.5) * 0.04;

    return (
      <section
        id={id}
        ref={(node) => {
          (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof _ref === "function") _ref(node);
          else if (_ref) (_ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={`relative w-screen overflow-hidden ${className}`}
        style={{ height: `${heightVh}vh` }}
      >
        {/* Video layer */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            opacity,
            filter: blurPx ? `blur(${blurPx}px)` : "none",
            transform: `scale(${scale})`,
            transition: "filter 200ms linear",
          }}
        >
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
          {!shouldLoad && (
            <div className="absolute inset-0 bg-background" />
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

        {/* Content */}
        <div className={`relative z-10 w-full h-full ${className}`}>{children}</div>
      </section>
    );
  }
);

VideoSection.displayName = "VideoSection";

export default VideoSection;
