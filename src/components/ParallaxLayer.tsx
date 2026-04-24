import { CSSProperties, ReactNode } from "react";

export type Depth = "background" | "midground" | "foreground";

const DEPTH_VH: Record<Depth, number> = {
  background: -12, // recedes — drifts up while scrolling down
  midground: -4,
  foreground: 4, // approaches camera — drifts down
};

interface ParallaxLayerProps {
  /** Section progress 0–1 from the parent ScrubScene. */
  progress: number;
  /** Depth preset; controls drift magnitude & direction. */
  depth?: Depth;
  /** Override the drift magnitude (vh per unit progress). Sign matters: negative recedes. */
  amount?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Wraps content in a GPU-transformed layer that drifts with scroll progress.
 * Used inside <ScrubScene/> to give text/UI different "depths" against the video.
 */
export function ParallaxLayer({
  progress,
  depth = "midground",
  amount,
  className = "",
  style,
  children,
}: ParallaxLayerProps) {
  const drift = amount ?? DEPTH_VH[depth];
  // Center the motion: progress 0.5 = neutral, edges drift ±drift/2.
  const offset = (progress - 0.5) * drift;
  return (
    <div
      className={`will-change-transform ${className}`}
      style={{
        transform: `translate3d(0, ${offset}vh, 0)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default ParallaxLayer;
