import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroKitchen from "@/assets/project-kitchen-1.jpg";
import heroBathroom from "@/assets/project-bathroom-1.jpg";
import heroConcrete from "@/assets/project-concrete.jpg";
import heroFlooring from "@/assets/project-flooring-1.jpg";
import heroExterior from "@/assets/project-exterior-1.jpg";
import heroBasement from "@/assets/project-basement-1.jpg";

const slides = [heroKitchen, heroBathroom, heroConcrete, heroFlooring, heroExterior, heroBasement];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Slideshow */}
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            opacity: current === i ? 1 : 0,
            transform: current === i ? "scale(1.06)" : "scale(1)",
            transition: "opacity 1600ms ease-in-out, transform 7000ms ease-out",
          }}
        />
      ))}

      {/* LIGHT-mode scrim: airy white wash on the left for dark text */}
      <div
        className="absolute inset-0 transition-opacity duration-700 opacity-100 dark:opacity-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.80) 40%, rgba(255,255,255,0.25) 74%, rgba(255,255,255,0) 100%)",
        }}
      />
      {/* DARK-mode scrim: moody black wash on the left for white text */}
      <div
        className="absolute inset-0 transition-opacity duration-700 opacity-0 dark:opacity-100"
        style={{
          background:
            "linear-gradient(100deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.70) 42%, rgba(0,0,0,0.20) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/60 to-transparent dark:from-black/55 transition-colors duration-700" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 pt-20">

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8 reveal" style={{ animationDelay: "0s" }}>
          <span className="w-8 h-px bg-amber-600 dark:bg-amber-400 transition-colors duration-500" />
          <span className="text-amber-600 dark:text-amber-400 text-[11px] md:text-xs tracking-[0.32em] uppercase font-semibold transition-colors duration-500">
            Dylan &amp; Connor · D&amp;C Contracting
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-10 reveal" style={{ animationDelay: "0.12s" }}>
          <span
            className="block font-display font-bold text-neutral-900 dark:text-white leading-[0.86] transition-colors duration-500"
            style={{ fontSize: "clamp(3.4rem, 9vw, 8rem)", letterSpacing: "-0.035em" }}
          >
            COME HOME
          </span>
          <span
            className="block font-serif italic font-light leading-[0.92] text-amber-600 dark:text-amber-400 transition-colors duration-500"
            style={{ fontSize: "clamp(3.6rem, 9.4vw, 8.4rem)", letterSpacing: "-0.01em" }}
          >
            to quality.
          </span>
        </h1>

        {/* Services tagline */}
        <p
          className="text-neutral-700 dark:text-white/75 text-base md:text-lg font-light leading-relaxed max-w-xl mb-12 reveal transition-colors duration-500"
          style={{ animationDelay: "0.24s" }}
        >
          Painting · Drywall · Tiling · Flooring · Electrical · Window &amp; Door
          Replacement · Landscaping
          <span className="text-neutral-500 dark:text-white/50"> &amp; so much more.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 reveal" style={{ animationDelay: "0.36s" }}>
          <Link
            to="/work"
            className="group inline-flex items-center gap-3 bg-amber-500 dark:bg-amber-400 text-black px-9 py-4 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-300"
          >
            View Our Work
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <path
                d="M2 7.5h11M9 3.5l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 border border-neutral-900/40 text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-white/40 dark:text-white dark:hover:bg-white dark:hover:text-black px-9 py-4 text-[11px] tracking-[0.2em] uppercase font-bold transition-all duration-300"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>

      {/* Slide indicators — vertical bar on right */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-sm transition-all duration-500 ${
              current === i
                ? "bg-amber-500 dark:bg-amber-400"
                : "bg-neutral-900/25 dark:bg-white/30 hover:bg-neutral-900/40 dark:hover:bg-white/50"
            }`}
            style={{ width: "3px", height: current === i ? "32px" : "10px" }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-8 md:left-16 lg:left-24 flex items-end gap-4 z-20 reveal-delayed">
        <div className="relative w-px h-16 bg-neutral-900/15 dark:bg-white/15 overflow-hidden transition-colors duration-500">
          <div className="hero-scroll-line absolute top-0 left-0 w-full h-2/5 bg-amber-500 dark:bg-amber-400" />
        </div>
        <span className="text-neutral-900/50 dark:text-white/40 text-[9px] tracking-[0.3em] uppercase mb-1 transition-colors duration-500">
          Scroll to explore
        </span>
      </div>
    </section>
  );
};

export default Hero;
