// Easing curves for scroll-driven animations. All take a normalized t (0–1) and return 0–1.
// Reference: Robert Penner / smoothstep family. Pure functions, no allocations per call.

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export const easings = {
  /** Constant rate. Sharpest, most "video editor" feel. */
  linear: (t: number) => clamp01(t),

  /** Slow start, fast end. Good for reveals. */
  easeIn: (t: number) => {
    t = clamp01(t);
    return t * t;
  },

  /** Fast start, slow end. Good for fades-out that "land" gently. */
  easeOut: (t: number) => {
    t = clamp01(t);
    return 1 - (1 - t) * (1 - t);
  },

  /** Symmetric S-curve (cubic). The default — natural, premium. */
  easeInOut: (t: number) => {
    t = clamp01(t);
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },

  /** Hermite smoothstep. Slightly softer than easeInOut, no abrupt acceleration. */
  smoothstep: (t: number) => {
    t = clamp01(t);
    return t * t * (3 - 2 * t);
  },

  /** 5th-order Ken Perlin smoothstep. Even gentler — feels "expensive". */
  smootherstep: (t: number) => {
    t = clamp01(t);
    return t * t * t * (t * (t * 6 - 15) + 10);
  },

  /** Sine in/out. Great for ambient, looping motion. */
  sineInOut: (t: number) => {
    t = clamp01(t);
    return -(Math.cos(Math.PI * t) - 1) / 2;
  },

  /** Quartic in/out. More dramatic hold, snappier crossover. */
  quartInOut: (t: number) => {
    t = clamp01(t);
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  },
} as const;

export type EasingName = keyof typeof easings;
export type EasingFn = (t: number) => number;
/** Pass either a named curve or a custom function `(t)=>number`. */
export type Easing = EasingName | EasingFn;

/** Resolve an Easing input to a callable function. */
export const resolveEasing = (e: Easing | undefined, fallback: EasingName = "easeInOut"): EasingFn =>
  typeof e === "function" ? e : easings[e ?? fallback];
