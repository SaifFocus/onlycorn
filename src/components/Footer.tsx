/**
 * Sitewide footer. Rendered server-side in the SPA bundle so the
 * FOQUS credit ships in the static HTML reachable to crawlers.
 */
export function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-cream/10 bg-background/95 px-6 md:px-14 py-8 text-cream/70">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[11px] tracking-[0.3em] uppercase">
        <span>© {new Date().getFullYear()} Corn Reimagined</span>
        <span className="hidden md:inline text-cream/45">A Cinematic Study · MMXXVI</span>
      </div>

      <div className="mt-4 text-[11px] text-cream/45 tracking-wide">
        Designed &amp; developed by{" "}
        <a
          href="https://focusbranding.se"
          rel="noopener"
          title="Branding & web design by FOQUS"
          className="text-cream/70 hover:text-gold underline-offset-4 hover:underline transition-colors"
        >
          FOQUS
        </a>
        .
      </div>
    </footer>
  );
}

export default Footer;
