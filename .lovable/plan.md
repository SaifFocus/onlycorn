## CORN. REIMAGINED. — Cinematic Video Experience

A premium, Apple-style single-page site where every section is a fullscreen looping video and content lives in the side margins so the centered focal point of each clip stays unobstructed.

---

### Asset mapping (in scroll order)

1. `Corn_head_rotating` → Hero
2. `DNA_strand_glowing` → DNA Energy
3. `DNA_helix_formed` → Particle DNA
4. `Corn_seed_floating` → Seed
5. `Seedling_grow_in` → Growth in Pot
6. `Corn_plant_swaying` → Full Plant
7. `Corn_field_slow` → Field (Aerial) + Final CTA overlay

All 7 videos will be copied into `public/videos/` and played as muted, looping, autoplaying `<video>` backgrounds with `object-fit: cover`.

---

### Visual system

- **Type**: Inter for body, a bold display face (Anton or Bebas-style) for headlines — large, tight tracking, white/cream
- **Palette accents**: golden yellow `#F5C518`, soft husk green `#8FB339`, cream `#F5EFE0`
- **Overlays**: subtle vertical/radial dark gradients on each video so side text stays legible without darkening the centered subject
- **UI**: no cards, no boxes — only typography, thin dividers, glass pills, and soft glows
- **Motion**: fade + slight blur + small Y-translate on text as it enters/exits viewport

---

### Navbar

- Fixed top, fully transparent at hero (logo left "CORN." + nav links + CTA right)
- After ~80px scroll: morphs into a centered floating pill with backdrop blur, subtle border, and inner glow
- Smooth width/radius/position transition
- Links: Origin · DNA · Growth · Field · Contact

---

### Section flow (video-driven, content side-aligned)

Each section is `100vh`, sticky/pinned feel, with the next section crossfading over the previous one. Centered focal points of videos stay clear; copy is anchored to the **left or right gutter** with high-converting facts and CTAs.

**1. HERO — Corn rotating**
- Centered massive headline at top-third: "CORN. REIMAGINED."
- Sub: "The grain that built civilizations. Re-engineered for tomorrow."
- Bottom-left: scroll cue "Scroll to discover ↓"
- Bottom-right: "10,000 years of evolution. One perfect kernel."

**2. DNA ENERGY — Glowing strand**
- Left gutter: "ENGINEERED BY NATURE" + paragraph on corn's 32,000+ genes (more than humans)
- Right gutter stat block: "32K+ GENES · 7 CONTINENTS · #1 GLOBAL CROP"

**3. PARTICLE DNA — Helix of light**
- Right gutter: "DECODED" headline + copy on heritage strains and genetic diversity
- Left gutter floating micro-facts (parallax): "Zea mays", "Domesticated 9,000 BCE", "Mesoamerica"

**4. SEED — Floating kernel**
- Left gutter: "ONE KERNEL." / "INFINITE POTENTIAL."
- Right gutter: short paragraph + golden CTA pill "Explore the Origin"

**5. GROWTH IN POT — Seedling rising**
- Right gutter: "FROM SOIL TO SUN" + facts on growth cycle (60–100 days, up to 4cm/day)
- Left gutter quiet caption: "Day 14"

**6. FULL PLANT — Tall stalk swaying**
- Vertical scroll-linked text running up the left edge: "ROOTS · STALK · LEAF · TASSEL · EAR"
- Right gutter: "STANDING TALL — Reaching 3 meters toward the sun"
- Subtle parallax on text to enhance the "moving through the plant" feel

**7. FIELD (AERIAL) — Endless field**
- Centered top: "A GOLDEN WORLD"
- Bottom band stats row: "1.2B TONS / YEAR · 197M HECTARES · 99% OF NATIONS"

**8. FINAL CTA** — same field video continues, darker gradient
- Centered: "A simple grain. A golden world."
- Glass pill CTA: "Begin the Harvest"
- Minimal footer line: © CORN. REIMAGINED.

---

### Scroll & transition behavior

- Sticky stacking: each section pins for ~120vh of scroll, next section fades in over the top via opacity + slight blur
- Text enters with fade + 20px rise + 4px→0px blur, exits in reverse
- Video playback rate slightly reduced (0.7–0.85x) for cinematic feel
- Crossfade handled via opacity tied to scroll progress (IntersectionObserver + scroll listener, throttled with rAF)
- No hard cuts anywhere

---

### Performance & responsiveness

- `preload="metadata"` on out-of-view videos, upgrade to `auto` as they near viewport
- `playsInline`, `muted`, `loop`, `autoPlay` on every video
- Poster frame extracted from each video for instant paint and mobile fallback
- On `<768px`: side gutters collapse to bottom-stacked content; videos still fullscreen cover; reduced parallax
- Respect `prefers-reduced-motion` → disable parallax/blur transitions, keep fades

---

### Technical notes

- Stack: existing Vite + React + Tailwind + shadcn
- New components: `VideoSection`, `Navbar` (scroll-aware pill), `SideContent`, `ScrollProgress`, `StatBlock`
- New page replacing `Index.tsx`
- Custom hook `useScrollProgress(ref)` returning 0→1 progress through a section, used to drive opacity/blur/translate
- Videos copied from uploads to `public/videos/` and referenced by path
- Tailwind extended with: accent colors, `fade-in`, `fade-blur-in` keyframes, glass utility class
- Fonts loaded via Google Fonts CDN link in `index.html` (Inter + Anton)

---

### Out of scope (can add later)

- Real backend / form submission for CTA
- Audio layer
- Localization
- Actual product purchase flow