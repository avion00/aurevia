import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

const quickLinks = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const PHONE = "716-863-4913";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-32">
      {/* Architectural grid wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55] dark:opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 80%)",
        }}
      />

      {/* Soft amber glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.07] blur-[130px] dark:bg-amber-400/[0.06]" />

      {/* Giant ghost 404 watermark */}
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display font-bold leading-none text-foreground/[0.035] dark:text-white/[0.05]"
        style={{ fontSize: "clamp(15rem, 42vw, 46rem)", letterSpacing: "-0.04em" }}
        aria-hidden="true"
      >
        404
      </span>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center justify-center gap-4 reveal" style={{ animationDelay: "0s" }}>
          <span className="h-px w-8 bg-amber-600 dark:bg-amber-400" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-amber-600 dark:text-amber-400 md:text-xs">
            Error 404
          </span>
          <span className="h-px w-8 bg-amber-600 dark:bg-amber-400" />
        </div>

        {/* Headline */}
        <h1 className="mb-8 reveal" style={{ animationDelay: "0.12s" }}>
          <span
            className="block font-display font-bold leading-[0.88] tracking-[-0.035em] text-neutral-900 dark:text-white"
            style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
          >
            Page not
          </span>
          <span
            className="block font-serif font-light italic leading-[0.95] tracking-[-0.01em] text-amber-600 dark:text-amber-400"
            style={{ fontSize: "clamp(3rem, 8.4vw, 5.8rem)" }}
          >
            found.
          </span>
        </h1>

        {/* Body */}
        <p
          className="mx-auto mb-4 max-w-md text-base font-light leading-relaxed text-neutral-700 dark:text-white/70 reveal"
          style={{ animationDelay: "0.24s" }}
        >
          The page you&rsquo;re looking for may have moved, been renamed, or never existed.
          Let&rsquo;s get you back to solid ground.
        </p>

        {/* Requested path */}
        <p
          className="mb-12 text-[11px] uppercase tracking-[0.18em] text-neutral-400 dark:text-white/30 reveal"
          style={{ animationDelay: "0.3s" }}
        >
          Requested&nbsp;&middot;&nbsp;
          <span className="font-medium text-neutral-500 dark:text-white/50">{location.pathname}</span>
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 reveal"
          style={{ animationDelay: "0.36s" }}
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-3 bg-amber-500 px-9 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300"
          >
            Back to Home
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/work"
            className="inline-flex items-center gap-3 border border-neutral-900/40 px-9 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900 transition-all duration-300 hover:bg-neutral-900 hover:text-white dark:border-white/40 dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            View Our Work
          </Link>
        </div>

        {/* Quick links */}
        <div
          className="mt-14 border-t border-border pt-8 reveal"
          style={{ animationDelay: "0.44s" }}
        >
          <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-neutral-400 dark:text-white/30">
            Or explore
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group relative text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-amber-500 transition-all duration-300 group-hover:w-full dark:bg-amber-400" />
              </Link>
            ))}
          </div>

          <a
            href={`tel:+1${PHONE.replace(/-/g, "")}`}
            className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <Phone className="h-3.5 w-3.5" />
            Need help? Call {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
