# Plan: "P" Toggle Button (Corn ⇄ Porn-letter swap)

A small, circular "P" button appears under the `CORN.` logo in the top-left. Clicking it swaps the leading **C** of the giant hero headline (`CORN.`) to **P** — and clicking again restores it. It is styled like a moon/sun day-night toggle, but functionally it only mutates the first letter of the hero title.

## What changes

### 1. Shared state for the letter
Lift a tiny piece of state to `src/pages/Index.tsx`:
- `const [heroLetter, setHeroLetter] = useState<"C" | "P">("C")`
- Pass `heroLetter` down to the hero `<h1>` so the title renders as `{heroLetter}ORN.` instead of hard-coded `CORN.`
- Pass `heroLetter` and `setHeroLetter` (or a toggle callback) into `<Navbar />` as props.

The `REIMAGINED.` line stays untouched.

### 2. Navbar button
In `src/components/Navbar.tsx`:
- Accept new props: `letter: "C" | "P"`, `onToggle: () => void`.
- Restructure the left side of the nav from a single `<a>CORN.</a>` into a small vertical stack:
  - Row 1: existing `CORN.` logo (unchanged styling).
  - Row 2: new circular button, left-aligned under the logo.
- Button spec:
  - `<button type="button" aria-label="Toggle hero letter" aria-pressed={letter === "P"}>`
  - Circle: ~32px (`h-8 w-8`), `rounded-full`
  - Border: `border border-cream/30`, hover `border-gold`
  - Background: transparent → `bg-gold/10` when active (`letter === "P"`)
  - Text: single character `P`, `font-display`, `text-cream`, turns `text-gold` when active
  - Smooth `transition-all duration-300`
  - Only visible/active when scrolled === false OR always (always visible is simpler and matches the "under the CORN logo" placement). We'll keep it always visible; in the scrolled pill state, the stacked layout still fits because the pill grows tall enough for two small rows, but to keep the pill clean we will:
    - Always render the button under the logo
    - When `scrolled` is true, hide the button with `opacity-0 pointer-events-none h-0` so the pill stays single-line
    - When `scrolled` is false (top of page, transparent navbar), show it normally

### 3. Hero title binding
In `Index.tsx` hero `<h1>`:
```tsx
{heroLetter}ORN<span className="text-gold">.</span><br />
REIMAGINED<span className="text-gold">.</span>
```
No layout/typography changes — only the first character is dynamic.

## Out of scope
- No real day/night theme switch, no video/background changes.
- No persistence (resets on reload) — can be added later if desired.
- No change to the `REIMAGINED.` word or to any other section.

## Files touched
- `src/pages/Index.tsx` — add `useState`, pass props, bind first letter.
- `src/components/Navbar.tsx` — accept props, add circular `P` button under the logo, hide it when scrolled.