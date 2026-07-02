import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import realBridal from "@/assets/harshi-bridal-1.jpg";
import realPeacock from "@/assets/harshi-peacock-1.jpg";
import realRoyal from "@/assets/harshi-royal-1.jpg";
import realElephant from "@/assets/harshi-elephant-1.jpg";
import realFusion from "@/assets/harshi-fusion-1.jpg";
import bridal from "@/assets/gallery-bridal.jpg";
import arabic from "@/assets/gallery-arabic.jpg";
import royal from "@/assets/gallery-royal.jpg";
import traditional from "@/assets/gallery-traditional.jpg";
import festival from "@/assets/gallery-festival.jpg";
import engagement from "@/assets/gallery-engagement.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Mehndi Gallery — Bridal, Arabic & Royal Designs | HARSHI'S" },
      { name: "description", content: "Browse our gallery of bridal, Arabic, royal, traditional, festival and engagement mehndi designs by HARSHI'S Mehndi Art." },
      { property: "og:title", content: "Mehndi Gallery — HARSHI'S Mehndi Art" },
      { property: "og:description", content: "Bridal, Arabic, royal and festival mehndi design gallery." },
      { property: "og:image", content: realBridal },
    ],
    links: [{ rel: "canonical", href: "https://harshi-mehndi-magic.lovable.app/gallery" }],
  }),
  component: Gallery,
});

type Item = { src: string; category: string; title: string };

const items: Item[] = [
  { src: realBridal, category: "Bridal", title: "Lotus Bridal Palms" },
  { src: realRoyal, category: "Royal", title: "Royal Temple Full Arm" },
  { src: realPeacock, category: "Bridal", title: "Peacock Bridal Detailing" },
  { src: realElephant, category: "Royal", title: "Royal Elephant Cuff" },
  { src: realFusion, category: "Festival", title: "Gold Fusion Palm" },
  { src: bridal, category: "Bridal", title: "Full Hand Bridal" },
  { src: royal, category: "Royal", title: "Royal Mandala Palms" },
  { src: arabic, category: "Arabic", title: "Modern Arabic Floral" },
  { src: traditional, category: "Traditional", title: "Traditional Palm Art" },
  { src: festival, category: "Festival", title: "Glitter Festival Design" },
  { src: engagement, category: "Engagement", title: "Engagement Floral" },
];

const categories = ["All", "Bridal", "Arabic", "Royal", "Traditional", "Festival", "Engagement"];

function Gallery() {
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState<Item | null>(null);

  const filtered = useMemo(
    () => (cat === "All" ? items : items.filter((i) => i.category === cat)),
    [cat],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our Work</span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Mehndi Design Gallery</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          A glimpse of our bridal, Arabic, royal and festival artistry — each design crafted with love.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-gold/50",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-3 [&>*]:mb-4">
        {filtered.map((item, i) => (
          <button
            key={`${item.title}-${i}`}
            onClick={() => setActive(item)}
            className="group relative block w-full overflow-hidden rounded-2xl shadow-soft animate-fade-up"
          >
            <img
              src={item.src}
              alt={`${item.category} mehndi design — ${item.title}`}
              loading="lazy"
              width={800}
              height={1000}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="text-left text-primary-foreground">
                <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-gold">{item.category}</div>
                <div className="font-serif text-lg">{item.title}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="gold" size="lg">
          <Link to="/booking">Book Your Design</Link>
        </Button>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-up"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
            onClick={() => setActive(null)}
          >
            <X className="size-6" />
          </button>
          <figure className="max-h-[90vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.src}
              alt={`${active.category} mehndi design — ${active.title}`}
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />
            <figcaption className="mt-3 text-center text-white">
              <span className="text-xs font-semibold uppercase tracking-wide text-gold">{active.category}</span>
              <div className="font-serif text-xl">{active.title}</div>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
