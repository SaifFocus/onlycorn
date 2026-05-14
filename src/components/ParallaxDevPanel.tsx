import { useEffect, useState } from "react";
import { Settings2, X, RotateCcw } from "lucide-react";
import {
  PARALLAX_SECTIONS,
  type SectionId,
  resetAllParallax,
  resetParallaxOverride,
  setParallaxOverride,
  useParallaxOverrides,
} from "@/lib/parallax-settings";
import { Slider } from "@/components/ui/slider";

const DEFAULTS = { background: 22, foreground: 8 };

/**
 * Floating dev/settings panel: live-tune parallax intensity per section.
 * Toggle with the gear button (bottom-right) or press "P".
 * Overrides persist in localStorage.
 */
export function ParallaxDevPanel() {
  const [open, setOpen] = useState(false);
  const overrides = useParallaxOverrides();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      if (e.key.toLowerCase() === "p") setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close parallax settings" : "Open parallax settings"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] h-11 w-11 rounded-full bg-background/80 backdrop-blur border border-cream/15 text-cream shadow-lg flex items-center justify-center hover:bg-background transition-colors"
      >
        {open ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
      </button>

      {open && (
        <aside
          className="fixed bottom-20 right-5 z-[60] w-[340px] max-h-[75vh] overflow-y-auto rounded-xl border border-cream/15 bg-background/95 backdrop-blur-md text-cream shadow-2xl p-4"
          role="dialog"
          aria-label="Parallax settings"
        >
          <header className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold">Dev</div>
              <h3 className="font-display text-lg leading-tight">Parallax Intensity</h3>
            </div>
            <button
              type="button"
              onClick={resetAllParallax}
              className="text-[10px] tracking-[0.2em] uppercase text-cream/60 hover:text-gold inline-flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset all
            </button>
          </header>

          <p className="text-[11px] text-cream/55 mb-4 leading-relaxed">
            Adjust per-section drift in vh. Background = video layer, Foreground = content layer.
            Press <kbd className="px-1 py-0.5 rounded bg-cream/10">P</kbd> to toggle.
          </p>

          <ul className="space-y-4">
            {PARALLAX_SECTIONS.map((id) => {
              const v = overrides[id] ?? DEFAULTS;
              const isOverridden = !!overrides[id];
              return (
                <li key={id} className="rounded-lg border border-cream/10 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => scrollTo(id)}
                      className="text-[11px] tracking-[0.25em] uppercase text-cream hover:text-gold transition-colors"
                    >
                      {id}
                    </button>
                    {isOverridden && (
                      <button
                        type="button"
                        onClick={() => resetParallaxOverride(id)}
                        className="text-[9px] tracking-[0.2em] uppercase text-cream/50 hover:text-gold"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <SliderRow
                    label="Background"
                    value={v.background}
                    onChange={(n) => setParallaxOverride(id, { background: n })}
                  />
                  <SliderRow
                    label="Foreground"
                    value={v.foreground}
                    onChange={(n) => setParallaxOverride(id, { foreground: n })}
                  />
                </li>
              );
            })}
          </ul>
        </aside>
      )}
    </>
  );
}

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-cream/60">{label}</span>
        <span className="text-[11px] tabular-nums text-cream">{value.toFixed(0)}vh</span>
      </div>
      <Slider
        min={0}
        max={60}
        step={1}
        value={[value]}
        onValueChange={(arr) => onChange(arr[0])}
      />
    </div>
  );
}

export default ParallaxDevPanel;
