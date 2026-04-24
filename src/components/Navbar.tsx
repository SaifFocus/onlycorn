import { useEffect, useState } from "react";

const links = [
  { label: "Origin", href: "#origin" },
  { label: "DNA", href: "#dna" },
  { label: "Growth", href: "#growth" },
  { label: "Field", href: "#field" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  letter: "C" | "P";
  onToggle: () => void;
}

export const Navbar = ({ letter, onToggle }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = letter === "P";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{
        transition: "padding 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        paddingTop: scrolled ? "1.25rem" : "1.5rem",
        paddingLeft: scrolled ? "1.5rem" : "2.5rem",
        paddingRight: scrolled ? "1.5rem" : "2.5rem",
      }}
    >
      <nav
        className="pointer-events-auto flex items-center justify-between"
        style={{
          width: scrolled ? "min(680px, 92vw)" : "100%",
          padding: scrolled ? "0.55rem 0.75rem 0.55rem 1.25rem" : "0.5rem 0",
          borderRadius: scrolled ? "999px" : "0px",
          background: scrolled ? "hsl(0 0% 6% / 0.55)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(160%)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(160%)" : "blur(0px)",
          border: scrolled ? "1px solid hsl(0 0% 100% / 0.12)" : "1px solid transparent",
          boxShadow: scrolled ? "0 10px 40px hsl(0 0% 0% / 0.35)" : "none",
          transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex flex-col items-start gap-2">
          <a href="#top" className="font-display text-cream tracking-widest text-lg md:text-xl select-none">
            {letter}ORN<span className="text-gold">.</span>
          </a>

          <button
            type="button"
            onClick={onToggle}
            aria-label="Toggle hero letter"
            aria-pressed={active}
            className={`flex items-center justify-center rounded-full font-display text-sm leading-none border transition-all duration-300 hover:border-gold hover:text-gold ${
              active
                ? "bg-gold/15 border-gold text-gold shadow-[0_0_18px_hsl(var(--gold)/0.45)]"
                : "bg-transparent border-cream/30 text-cream"
            }`}
            style={{
              width: "1.75rem",
              height: "1.75rem",
              opacity: scrolled ? 0 : 1,
              transform: scrolled ? "translateY(-4px) scale(0.85)" : "translateY(0) scale(1)",
              pointerEvents: scrolled ? "none" : "auto",
              marginTop: scrolled ? "-1.75rem" : "0",
            }}
          >
            P
          </button>
        </div>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-1.5 text-[12px] tracking-[0.2em] uppercase text-cream/80 hover:text-gold transition-colors duration-300"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-cream/25 text-cream hover:bg-gold hover:text-background hover:border-gold transition-all duration-500"
        >
          Harvest
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
