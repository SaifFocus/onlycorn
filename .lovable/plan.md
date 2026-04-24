# Scroll-Scrubbed Cinematic Sections

Reworking the storytelling engine into an Apple-keynote / Webflow-style scroll experience. Each scene **pins to the viewport**, the **video scrubs forward/backward with scroll**, content moves at three different parallax depths, and adjacent scenes **crossfade** at their boundaries.

## What the user will feel

- Scrolling past the hero pauses the page visually; the corn rotates in lockstep with the wheel/trackpad.
- Reaching the end of a scene smoothly bleeds into the next one without snapping.
- Side copy drifts at a different rate than headlines, which drift at a different rate than the video — three layers of depth.
- Scrolling back UP runs the video in reverse — confirms the "you're driving the playback" feel.

## Architecture

Replace the current `<VideoSection>` (which sized itself 100vh and played its video on autoplay) with a new pinned model:

```text
<ScrubScene heightVh={300}>          ← outer "scroll track" — TALL (e.g. 300vh)
  ├─ <div sticky top-0 h-screen>     ← pinned viewport stage
  │    ├─ video (currentTime = progress * duration)
  │    ├─ overlays (vignette, gradients)
  │    └─ <ParallaxLayer depth=...>  ← background / midground / foreground slots
  │         children (text, badges)
  └─ (scroll height comes from outer track height)
</ScrubScene>
```

### 1. Scroll-scrubbed video
- New hook `useScrubbedVideo(videoRef, progress, duration)` writes `video.currentTime = progress * duration` inside `requestAnimationFrame`.
- Video element gets `preload="auto"`, `muted`, `playsInline`, **no** `autoplay` / `loop`.
- Smoothing: lerp current → target by ~0.15 each frame so fast scroll bursts don't jitter the frame.
- Lazy: only attach scrubbing when the section's pinned stage is in view (IntersectionObserver, same pattern as today).
- Fallback: if `video.readyState < 2` (metadata not loaded), show poster only — no errors.

### 2. Sticky fullscreen pinning
- Outer `<section>` is `heightVh` tall (default 250vh — tunable per scene; longer = slower scrub).
- Inner `<div className="sticky top-0 h-screen overflow-hidden">` holds the visual stage.
- Section progress = how far we've scrolled through the outer track (0 when its top hits viewport top, 1 when its bottom leaves viewport top).
- This is pure CSS sticky — no scroll hijacking, native momentum / accessibility preserved.

### 3. Crossfade between sections
- Each scene fades its stage in over progress `0 → 0.08` and fades out over `0.92 → 1`.
- Because adjacent sections' fade-in/fade-out windows overlap (last 8vh of one ≈ first 8vh of the next), the two stages are simultaneously visible and blend.
- Easing (existing `easings.ts` system) keeps it organic; default `smoothstep`.

### 4. Three-layer parallax depth
- New `<ParallaxLayer depth="background" | "midground" | "foreground">` component.
- Multipliers (vh per unit progress): background `−12`, midground `−4`, foreground `+4`.
- Negative = drifts up while scrolling down (recedes), positive = drifts down (approaches camera).
- Depth presets are tunable via prop overrides. Layers are GPU-transformed (`translate3d`).

## Files

- **new** `src/hooks/use-scrubbed-video.ts` — `currentTime` writer with lerp smoothing
- **new** `src/components/ScrubScene.tsx` — pinned section + sticky stage + crossfade
- **new** `src/components/ParallaxLayer.tsx` — depth-tagged content slot
- **edit** `src/pages/Index.tsx` — swap each `<VideoSection>` for `<ScrubScene>` and wrap text in `<ParallaxLayer>` slots
- **keep** `src/components/VideoSection.tsx` — leave as-is for now (deletable later; keeps any other consumers safe)
- **keep** `src/lib/easings.ts`, `src/lib/videos.ts`, posters — reused unchanged

## Trade-offs you should know

- **Scroll length grows.** Each scene becomes ~250vh of track instead of 100vh, so total page height roughly 2.5× longer. That's the cost of scrub feel; tunable per section.
- **No looping.** Videos play once across the section's scroll range and reverse on scroll back. If you want a clip to loop ambiently *inside* a held position, that's a separate add (we can mark specific scenes as `loop` + autoplay instead of scrub).
- **Mobile scrubbing of mp4 is tricky.** iOS won't decode arbitrary seeks smoothly on heavy clips. Plan: on small screens, fall back to autoplay+loop (current behavior) and skip scrubbing — the parallax + crossfade still works.
- **Accessibility:** respect `prefers-reduced-motion` — disable scrub & parallax, fall back to autoplay loop.
