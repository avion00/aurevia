import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoryGroups, type CategoryGroup } from "@/data/projects";
import Lightbox from "@/components/Lightbox";

const display = [
  { category: "KITCHEN", description: "Full remodels & custom finishes", span: "col-span-2 lg:col-span-4" },
  { category: "BATHROOM", description: "Modern remodels & tub installs", span: "col-span-1 lg:col-span-2" },
  { category: "TILE", description: "Precision tile work for any space", span: "col-span-1 lg:col-span-2" },
  { category: "FLOORING", description: "Hardwood, plank & laminate installs", span: "col-span-1 lg:col-span-2" },
  { category: "CONCRETE", description: "Driveways with clean broom finishes", span: "col-span-1 lg:col-span-2" },
  { category: "FRAMING", description: "Interior framing & rough-in", span: "col-span-1 lg:col-span-2" },
  { category: "BASEMENT", description: "Refresh & full basement remodels", span: "col-span-1 lg:col-span-2" },
  { category: "EXTERIOR", description: "Door installs, trim & curb appeal", span: "col-span-1 lg:col-span-2" },
];

const Portfolio = () => {
  const [activeGroup, setActiveGroup] = useState<CategoryGroup | null>(null);

  return (
    <section id="work" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">SELECTED WORK</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural">
                Recent Projects
              </h3>
            </div>
            <Link
              to="/work"
              className="text-minimal border-b border-architectural pb-1 hover:opacity-60 transition-opacity self-start md:self-auto"
            >
              VIEW ALL PROJECTS →
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5">
            {display.map((d, index) => {
              const group = categoryGroups.find((g) => g.category === d.category);
              if (!group) return null;
              const cover = group.items[0].image;
              const photoCount = group.items.length;

              return (
                <button
                  key={d.category}
                  onClick={() => setActiveGroup(group)}
                  className={`group relative overflow-hidden rounded-xl block h-64 lg:h-[340px] text-left ${d.span}`}
                >
                  <img
                    src={cover}
                    alt={d.category}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Index */}
                  <span className="absolute top-4 right-5 text-white/40 text-sm font-medium tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="w-5 h-px bg-amber-400" />
                      <h4 className="text-white text-lg font-medium text-architectural tracking-wide">
                        {d.category}
                      </h4>
                    </div>
                    <p className="text-white/75 text-sm leading-snug">{d.description}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-amber-400 text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {photoCount > 1 ? `View ${photoCount} photos` : "View project"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeGroup && <Lightbox group={activeGroup} onClose={() => setActiveGroup(null)} />}
    </section>
  );
};

export default Portfolio;
