import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ScrubScene } from "@/components/ScrubScene";
import { ParallaxLayer } from "@/components/ParallaxLayer";
import { VIDEOS, POSTERS } from "@/lib/videos";

const Index = () => {
  const [heroLetter, setHeroLetter] = useState<"C" | "P">("C");
  const toggleHeroLetter = () => setHeroLetter((l) => (l === "C" ? "P" : "C"));

  return (
    <main id="top" className="relative bg-background text-cream">
      <Navbar letter={heroLetter} onToggle={toggleHeroLetter} />

      {/* 1. HERO ─ Corn rotating */}
      <ScrubScene
        id="hero"
        src={VIDEOS.hero}
        poster={POSTERS.hero}
        eager
        heightVh={280}
        overlays={["vignette", "top", "bottom"]}
      >
        {(p) => (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-end pb-8 px-6 text-center">
              <ParallaxLayer progress={p} depth="midground">
                <p className="text-[11px] md:text-[12px] tracking-[0.5em] uppercase text-cream/70 mb-6 animate-fade-in-soft">
                  A Cinematic Journey
                </p>
              </ParallaxLayer>
              <ParallaxLayer progress={p} depth="foreground">
                <h1
                  className="font-display text-cream leading-[0.9] text-shadow-soft animate-fade-in"
                  style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)" }}
                >
                  {heroLetter}ORN<span className="text-gold">.</span><br />
                  REIMAGINED<span className="text-gold">.</span>
                </h1>
              </ParallaxLayer>
              <ParallaxLayer progress={p} depth="midground">
                <p
                  className="mt-6 text-sm md:text-base text-cream/80 max-w-xl animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  The grain that built civilizations. Re-engineered for tomorrow.
                </p>
              </ParallaxLayer>
            </div>

            <div className="flex-1" />

            <div className="absolute bottom-10 left-0 right-0 px-8 md:px-14 flex items-end justify-between text-cream/75 text-[11px] md:text-[12px] tracking-[0.25em] uppercase">
              <ParallaxLayer progress={p} depth="foreground">
                <div className="flex flex-col gap-2 animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <span className="opacity-70">Scroll</span>
                  <span className="text-gold">↓ Discover</span>
                </div>
              </ParallaxLayer>
              <ParallaxLayer progress={p} depth="foreground">
                <div
                  className="hidden md:block text-right max-w-[14rem] leading-relaxed animate-fade-in"
                  style={{ animationDelay: "1s" }}
                >
                  10,000 years of evolution.<br />
                  <span className="text-gold">One perfect kernel.</span>
                </div>
              </ParallaxLayer>
            </div>
          </div>
        )}
      </ScrubScene>

      {/* 2. DNA ENERGY ─ Glowing strand */}
      <ScrubScene
        id="dna"
        src={VIDEOS.dnaStrand}
        poster={POSTERS.dnaStrand}
        heightVh={280}
        overlays={["vignette", "left", "right"]}
      >
        {(p) => (
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 items-center gap-8 px-6 md:px-14 py-16">
            <ParallaxLayer progress={p} depth="midground" className="md:col-span-3 max-w-sm">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">Chapter I</p>
              <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mb-5 text-shadow-soft">
                ENGINEERED<br /> BY NATURE
              </h2>
              <div className="hairline w-16 mb-5" />
              <p className="text-sm md:text-base text-cream/80 leading-relaxed">
                Hidden in every kernel lies a genome of staggering complexity — over
                <span className="text-gold"> 32,000 genes</span>, more than the human
                body itself. A blueprint refined over millennia.
              </p>
            </ParallaxLayer>

            <div className="md:col-span-6" />

            <ParallaxLayer progress={p} depth="foreground" className="md:col-span-3 md:justify-self-end text-right">
              <ul className="space-y-6">
                {[
                  { k: "32K+", v: "Genes per genome" },
                  { k: "7", v: "Continents grown" },
                  { k: "#1", v: "Global crop by volume" },
                ].map((s) => (
                  <li key={s.k}>
                    <div className="font-display text-4xl md:text-5xl text-cream text-shadow-soft">
                      {s.k}
                    </div>
                    <div className="text-[11px] tracking-[0.3em] uppercase text-cream/60 mt-1">
                      {s.v}
                    </div>
                  </li>
                ))}
              </ul>
            </ParallaxLayer>
          </div>
        )}
      </ScrubScene>

      {/* 3. PARTICLE DNA ─ Helix of light */}
      <ScrubScene
        id="origin"
        src={VIDEOS.dnaHelix}
        poster={POSTERS.dnaHelix}
        heightVh={280}
        overlays={["vignette", "left", "right"]}
      >
        {(p) => (
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 items-center gap-8 px-6 md:px-14 py-16">
            <ParallaxLayer progress={p} depth="midground" className="md:col-span-3 space-y-10">
              {[
                { t: "Zea mays", s: "Scientific name" },
                { t: "9,000 BCE", s: "First domesticated" },
                { t: "Mesoamerica", s: "Place of origin" },
              ].map((f, i) => (
                <div key={f.t} className="animate-float-soft" style={{ animationDelay: `${i * 0.6}s` }}>
                  <div className="text-[10px] tracking-[0.4em] uppercase text-gold mb-1">{f.s}</div>
                  <div className="font-display text-2xl md:text-3xl text-cream text-shadow-soft">{f.t}</div>
                </div>
              ))}
            </ParallaxLayer>

            <div className="md:col-span-6" />

            <ParallaxLayer progress={p} depth="foreground" className="md:col-span-3 md:justify-self-end text-right max-w-sm">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">Chapter II</p>
              <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-5 text-shadow-soft">
                DECODED<span className="text-gold">.</span>
              </h2>
              <div className="hairline w-16 ml-auto mb-5" />
              <p className="text-sm md:text-base text-cream/80 leading-relaxed">
                From <span className="text-husk">heritage strains</span> in Andean
                valleys to modern hybrids — every variety carries an ancestral memory,
                encoded in light and starch.
              </p>
            </ParallaxLayer>
          </div>
        )}
      </ScrubScene>

      {/* 4. SEED ─ Floating kernel */}
      <ScrubScene
        id="seed"
        src={VIDEOS.seed}
        poster={POSTERS.seed}
        heightVh={280}
        overlays={["vignette", "left", "right", "bottom"]}
      >
        {(p) => (
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 items-center gap-8 px-6 md:px-14 py-16">
            <ParallaxLayer progress={p} depth="midground" className="md:col-span-4 max-w-sm">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">Chapter III</p>
              <h2
                className="font-display leading-[0.9] text-shadow-soft"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
              >
                ONE<br />
                KERNEL<span className="text-gold">.</span>
              </h2>
              <h3
                className="font-display text-cream/70 leading-[0.9] mt-2 text-shadow-soft"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
              >
                INFINITE<br />
                POTENTIAL<span className="text-gold">.</span>
              </h3>
            </ParallaxLayer>

            <div className="md:col-span-4" />

            <ParallaxLayer progress={p} depth="foreground" className="md:col-span-4 md:justify-self-end text-right max-w-sm">
              <div className="hairline w-16 ml-auto mb-5" />
              <p className="text-sm md:text-base text-cream/80 leading-relaxed mb-8">
                A single kernel contains every instruction needed to build a stalk
                three meters tall — bearing hundreds of new kernels in return.
                <span className="block mt-3 text-gold">A 1:800 transformation.</span>
              </p>
              <a
                href="#growth"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gold text-background text-[12px] tracking-[0.25em] uppercase font-medium gold-glow hover:scale-[1.03] transition-transform duration-500"
              >
                Explore the Origin →
              </a>
            </ParallaxLayer>
          </div>
        )}
      </ScrubScene>

      {/* 5. GROWTH IN POT ─ Seedling */}
      <ScrubScene
        id="growth"
        src={VIDEOS.seedling}
        poster={POSTERS.seedling}
        heightVh={280}
        overlays={["vignette", "left", "right"]}
      >
        {(p) => (
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 items-center gap-8 px-6 md:px-14 py-16">
            <ParallaxLayer progress={p} depth="background" className="md:col-span-3">
              <div className="text-[10px] tracking-[0.5em] uppercase text-cream/60 mb-2">Time</div>
              <div className="font-display text-3xl md:text-4xl text-cream text-shadow-soft">
                Day 14<span className="text-gold">.</span>
              </div>
              <div className="hairline w-12 mt-4" />
            </ParallaxLayer>

            <div className="md:col-span-5" />

            <ParallaxLayer progress={p} depth="foreground" className="md:col-span-4 md:justify-self-end text-right max-w-sm">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">Chapter IV</p>
              <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mb-5 text-shadow-soft">
                FROM SOIL<br />
                TO SUN
              </h2>
              <div className="hairline w-16 ml-auto mb-5" />
              <p className="text-sm md:text-base text-cream/80 leading-relaxed mb-6">
                Few crops grow with such urgency. In peak season, a stalk can rise
                <span className="text-gold"> four centimeters in a single day</span> —
                chasing the light with engineered precision.
              </p>
              <ul className="space-y-3 text-[11px] tracking-[0.25em] uppercase text-cream/70">
                <li><span className="text-gold mr-3">01</span>Germination · 5–10 days</li>
                <li><span className="text-gold mr-3">02</span>Vegetative · 30–45 days</li>
                <li><span className="text-gold mr-3">03</span>Tasseling · 60–80 days</li>
                <li><span className="text-gold mr-3">04</span>Maturity · 90–120 days</li>
              </ul>
            </ParallaxLayer>
          </div>
        )}
      </ScrubScene>

      {/* 6. FULL PLANT ─ Tall stalk swaying */}
      <ScrubScene
        id="plant"
        src={VIDEOS.plant}
        poster={POSTERS.plant}
        heightVh={280}
        overlays={["vignette", "left", "right"]}
      >
        {(p) => (
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 items-center gap-8 px-6 md:px-14 py-16">
            <ParallaxLayer progress={p} depth="background" className="md:col-span-2 hidden md:flex justify-start h-full items-center">
              <div className="vert-text font-display text-[10px] tracking-[0.6em] uppercase text-cream/70 flex gap-10">
                <span>Roots</span>
                <span className="text-gold">·</span>
                <span>Stalk</span>
                <span className="text-gold">·</span>
                <span>Leaf</span>
                <span className="text-gold">·</span>
                <span>Tassel</span>
                <span className="text-gold">·</span>
                <span>Ear</span>
              </div>
            </ParallaxLayer>

            <div className="md:col-span-6" />

            <ParallaxLayer progress={p} depth="foreground" className="md:col-span-4 md:justify-self-end text-right max-w-sm">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">Chapter V</p>
              <h2
                className="font-display leading-[0.9] mb-5 text-shadow-soft"
                style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
              >
                STANDING<br />
                TALL<span className="text-gold">.</span>
              </h2>
              <div className="hairline w-16 ml-auto mb-5" />
              <p className="text-sm md:text-base text-cream/80 leading-relaxed">
                Reaching <span className="text-gold">three meters</span> toward the
                sun, each plant becomes its own architecture — a vertical engine of
                photosynthesis, sugar, and grain.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="font-display text-3xl text-cream">3m</div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-cream/60">Avg. Height</div>
                </div>
                <div>
                  <div className="font-display text-3xl text-cream">800<span className="text-gold">+</span></div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-cream/60">Kernels / Ear</div>
                </div>
              </div>
            </ParallaxLayer>
          </div>
        )}
      </ScrubScene>

      {/* 7. FIELD ─ Aerial */}
      <ScrubScene
        id="field"
        src={VIDEOS.field}
        poster={POSTERS.field}
        heightVh={280}
        overlays={["vignette", "top", "bottom"]}
      >
        {(p) => (
          <div className="absolute inset-0 flex flex-col">
            <div className="pt-20 md:pt-28 px-6 text-center">
              <ParallaxLayer progress={p} depth="midground">
                <p className="text-[11px] tracking-[0.5em] uppercase text-gold mb-4 animate-fade-in-soft">
                  Chapter VI
                </p>
              </ParallaxLayer>
              <ParallaxLayer progress={p} depth="foreground">
                <h2
                  className="font-display text-cream leading-[0.9] text-shadow-soft"
                  style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}
                >
                  A GOLDEN<br />WORLD<span className="text-gold">.</span>
                </h2>
              </ParallaxLayer>
            </div>

            <div className="flex-1" />

            <ParallaxLayer progress={p} depth="background" className="px-6 md:px-14 pb-14">
              <div className="hairline mb-8" />
              <div className="grid grid-cols-3 gap-6 text-cream text-center md:text-left">
                {[
                  { k: "1.2B", v: "Tons produced annually" },
                  { k: "197M", v: "Hectares cultivated" },
                  { k: "99%", v: "Of nations consume it" },
                ].map((s) => (
                  <div key={s.k}>
                    <div className="font-display text-4xl md:text-6xl text-shadow-soft">{s.k}</div>
                    <div className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-cream/65 mt-2">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </ParallaxLayer>
          </div>
        )}
      </ScrubScene>

      {/* 8. FINAL CTA ─ field continues, darker — short, no scrub track */}
      <ScrubScene
        id="contact"
        src={VIDEOS.field}
        poster={POSTERS.field}
        heightVh={120}
        overlays={["vignette", "dark"]}
      >
        {(p) => (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <ParallaxLayer progress={p} depth="midground">
              <p className="text-[11px] tracking-[0.5em] uppercase text-gold mb-6 animate-fade-in-soft">
                Epilogue
              </p>
            </ParallaxLayer>
            <ParallaxLayer progress={p} depth="foreground">
              <h2
                className="font-display text-cream leading-[0.95] text-shadow-soft max-w-5xl"
                style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
              >
                A simple grain.<br />
                <span className="text-gold">A golden world.</span>
              </h2>
            </ParallaxLayer>
            <ParallaxLayer progress={p} depth="midground">
              <p className="mt-8 text-cream/75 max-w-md text-sm md:text-base">
                Join us as we re-imagine the future of the world's most abundant grain
                — one kernel at a time.
              </p>
            </ParallaxLayer>
            <ParallaxLayer progress={p} depth="foreground">
              <a
                href="#top"
                className="mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gold text-background text-[12px] tracking-[0.3em] uppercase font-medium gold-glow hover:scale-[1.04] transition-transform duration-500"
              >
                Begin the Harvest →
              </a>
            </ParallaxLayer>

            <footer className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-6 md:px-14 text-[10px] tracking-[0.4em] uppercase text-cream/50">
              <span>© CORN. REIMAGINED.</span>
              <span className="hidden md:inline">A Cinematic Study · MMXXVI</span>
            </footer>
          </div>
        )}
      </ScrubScene>
    </main>
  );
};

export default Index;
