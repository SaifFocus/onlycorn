import { ReactNode, useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { useScrubbedVideo } from "@/hooks/use-scrubbed-video";
import { type Easing, resolveEasing } from "@/lib/easings";

type Overlay = "vignette" | "left" | "right" | "bottom" | "top" | "dark" | "none";

export interface ScrubSceneProps {
  id?: string;
  src: string;
  poster?: string;
  /**
   * Render content with the section's 0–1 scroll progress.
   * Wrap pieces in <ParallaxLayer/> to give them depth.
   */
  children?: (progress: number) => ReactNode;
  overlays?: Overlay[];
  /** Outer scroll-track height in vh. Longer = slower scrub. Default 250. */
  heightVh?: number;
  /** Additional class for the inner content container. */
  className?: string;
  /** Eager-load video (use for hero). Default false. */
  eager?: boolean;
  /** Where the crossfade-in finishes (0–1). Default 0.08. */
  fadeInEnd?: number;
  /** Where the crossfade-out starts (0–1). Default 0.92. */
  fadeOutStart?: number;
  /** Easing curve for the fade ramps. Default "smoothstep". */
  fadeEasing?: Easing;
  /** Lerp factor for scrubbing (higher = snappier). Default 0.18. */
  scrubSmoothing?: number;
}

/**
 * Detects coarse-pointer / small-viewport devices where scroll-driven seeking
 * is unreliable (notably iOS) and we should fall back to plain autoplay.
 */
function useScrubFallback() {
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setFallback(mqMobile.matches || mqReduce.matches);
    update();
    mqMobile.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);
  return fallback;
}

/**
 * Pinned, scroll-scrubbed cinematic section.
 *
 * The outer <section> is `heightVh` tall. The inner stage is `position: sticky`,
 * pinning a 100vh viewport while the page scrolls past it. The video's
 * `currentTime` is driven by the section's scroll progress so it plays forward
 * on scroll-down and reverses on scroll-up. Crossfades at the boundaries blend
 * adjacent scenes together.
 *
 * On mobile / reduced-motion devices, scrubbing is skipped and the video
 * autoplays normally — parallax & crossfade still work.
 */
export function ScrubScene({
  id,
  src,
  poster,
  children,
  overlays = ["vignette", "left", "right"],
  heightVh = 250,
  className = "",
  eager = false,
  fadeInEnd = 0.08,
  fadeOutStart = 0.92,
  fadeEasing = "smoothstep",
  scrubSmoothing = 0.18,
}: ScrubSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progress = useScrollProgress(sectionRef);
  const ease = resolveEasing(fadeEasing, "smoothstep");
  const useFallback = useScrubFallback();
  const [shouldLoad, setShouldLoad] = useState(eager);

  // Lazy-load when the scroll-track is approaching the viewport.
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
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  // Drive scrubbing only when loaded AND not in fallback mode.
  useScrubbedVideo(videoRef, progress, shouldLoad && !useFallback, scrubSmoothing);

  // Crossfade ramp: 0→fadeInEnd in, hold, fadeOutStart→1 out.
  let fadeT = 1;
  if (progress < fadeInEnd) fadeT = progress / fadeInEnd;
  else if (progress > fadeOutStart) fadeT = (1 - progress) / (1 - fadeOutStart);
  const opacity = ease(Math.max(0, Math.min(1, fadeT)));

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-screen"
      style={{ height: `${heightVh}vh` }}
    >
      {/* Sticky stage — pins to viewport while scroll-track passes through. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video / poster layer with crossfade opacity */}
        <div
          className="absolute inset-0 will-change-[opacity]"
          style={{ opacity }}
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
              muted
              playsInline
              preload="auto"
              // Mobile/reduced-motion: behave like a normal ambient loop.
              autoPlay={useFallback}
              loop={useFallback}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
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
          {overlays.includes("dark") && <div className="absolute inset-0 bg-background/55" />}
        </div>

        {/* Content layer — children receive scroll progress for ParallaxLayer use */}
        <div
          className={`relative z-10 w-full h-full ${className}`}
          style={{ opacity }}
        >
          {children?.(progress)}
        </div>
      </div>
    </section>
  );
}

export default ScrubScene;
