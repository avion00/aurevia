import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type CategoryGroup } from "@/data/projects";

const Lightbox = ({
  group,
  startIndex = 0,
  onClose,
}: {
  group: CategoryGroup;
  startIndex?: number;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(startIndex);
  const items = group.items;
  const count = items.length;
  const item = items[current];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setCurrent((i) => (i + 1) % count);
      else if (e.key === "ArrowLeft") setCurrent((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [count, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`${group.category} gallery`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-px bg-amber-400" />
            <span className="text-amber-400 text-[11px] tracking-[0.3em] uppercase font-semibold">
              {group.category}
            </span>
          </div>
          {count > 1 && (
            <span className="text-white/50 text-sm tabular-nums">
              {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close gallery"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Media */}
      <div
        className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-24 pb-2"
        onClick={onClose}
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
            className="max-h-full max-w-full object-contain rounded-lg animate-in fade-in duration-300"
          />
        ) : (
          <img
            key={current}
            src={item.image}
            alt={item.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain rounded-lg animate-in fade-in duration-300"
          />
        )}

        {count > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrent((i) => (i - 1 + count) % count);
              }}
              aria-label="Previous"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrent((i) => (i + 1) % count);
              }}
              aria-label="Next"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      <div className="px-6 md:px-10 py-6 shrink-0 text-center">
        <h3 className="text-white text-xl md:text-2xl font-light text-architectural mb-1.5">
          {item.title}
        </h3>
        <p className="text-white/55 text-sm max-w-2xl mx-auto leading-relaxed">{item.description}</p>

        {count > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-7 bg-amber-400" : "w-2.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
