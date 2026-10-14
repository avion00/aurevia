import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Maximize2 } from "lucide-react";
import { categories, categoryGroups, type CategoryGroup } from "@/data/projects";
import Lightbox from "@/components/Lightbox";

const ProjectCard = ({
  group,
  onOpen,
}: {
  group: CategoryGroup;
  onOpen: (index: number) => void;
}) => {
  const [current, setCurrent] = useState(0);
  const items = group.items;
  const count = items.length;
  const item = items[current];

  const next = () => setCurrent((i) => (i + 1) % count);
  const prev = () => setCurrent((i) => (i - 1 + count) % count);

  return (
    <div className="group flex flex-col">
      <div
        onClick={() => onOpen(current)}
        className="relative overflow-hidden rounded-2xl bg-muted aspect-[4/3] cursor-zoom-in shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)]"
      >
        {item.video ? (
          <video
            key={current}
            src={item.video}
            poster={item.image}
            autoPlay
            muted
            loop
            playsInline
            controls
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 w-full h-full object-cover bg-black animate-in fade-in duration-500"
          />
        ) : (
          <img
            key={current}
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700 transition-transform group-hover:scale-[1.04]"
          />
        )}

        {/* Hover veil */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

        {/* View full hint */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(current);
          }}
          aria-label="View full screen"
          className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-2 bg-background/90 backdrop-blur-md px-4 py-2.5 shadow-sm text-foreground hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="text-[10px] tracking-[0.18em] uppercase font-bold">View Full</span>
        </button>

        {/* Category badge */}
        <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 bg-background/90 backdrop-blur-md px-4 py-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
          <span className="text-minimal text-foreground">{group.category}</span>
        </div>

        {/* Counter */}
        {count > 1 && (
          <div className="absolute top-5 right-5 z-20 bg-background/90 backdrop-blur-md px-3.5 py-2 shadow-sm">
            <span className="text-[11px] tracking-[0.15em] font-medium text-foreground tabular-nums">
              {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Prev / Next */}
        {count > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-lg hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-black hover:scale-110 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-lg hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-black hover:scale-110 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="flex items-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-7 bg-amber-500 dark:bg-amber-400"
                  : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* Details */}
      <div className="mt-7 space-y-5">
        <div>
          <h3 className="text-2xl lg:text-[1.7rem] font-light text-architectural leading-tight mb-2.5 group-hover:text-muted-foreground transition-colors duration-500">
            {item.title}
          </h3>
          <p className="inline-flex items-center gap-1.5 text-minimal text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {item.location}
          </p>
        </div>

        <p className="text-muted-foreground leading-relaxed">{item.description}</p>

        <div className="flex items-center gap-5 pt-5 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-minimal text-muted-foreground">Type</span>
            <span className="text-foreground text-sm">{item.area}</span>
          </div>
          <span className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-minimal text-muted-foreground">Year</span>
            <span className="text-foreground text-sm">{item.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Work = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [lightbox, setLightbox] = useState<{ group: CategoryGroup; index: number } | null>(null);

  const visibleGroups =
    activeCategory === "ALL"
      ? categoryGroups
      : categoryGroups.filter((g) => g.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-minimal text-muted-foreground mb-4">PORTFOLIO</p>
              <h1 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                OUR WORK
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                A selection of D&amp;C Contracting projects — concrete, kitchens, bathrooms,
                basements, flooring, framing, and more across Western New York.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-foreground text-background"
                      : "text-muted-foreground border border-border hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div
              className={`grid gap-x-10 gap-y-16 lg:gap-x-12 lg:gap-y-20 ${
                visibleGroups.length === 1 ? "md:grid-cols-1 max-w-3xl mx-auto" : "md:grid-cols-2"
              }`}
            >
              {visibleGroups.map((group) => (
                <ProjectCard
                  key={group.category}
                  group={group}
                  onOpen={(index) => setLightbox({ group, index })}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          group={lightbox.group}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default Work;
