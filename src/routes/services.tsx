import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { serviceCategories } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import galleryBridal from "@/assets/harshi-new-1.jpg";
import galleryPeacock from "@/assets/harshi-new-2.jpg";
import galleryRoyal from "@/assets/harshi-new-3.jpg";
import galleryElephant from "@/assets/harshi-new-4.jpg";
import galleryFusion from "@/assets/harshi-new-5.jpg";
import galleryLotus from "@/assets/harshi-new-6.jpg";
import galleryArabic from "@/assets/harshi-new-7.jpg";
import galleryFullArm from "@/assets/harshi-new-8.jpg";
import galleryPalms from "@/assets/harshi-new-9.jpg";

const serviceImages: Record<string, string> = {
  s1: galleryBridal,
  s2: galleryArabic,
  s3: galleryLotus,
  s4: galleryPeacock,
  s5: galleryFusion,
  s6: galleryRoyal,
  s7: galleryElephant,
  s8: galleryPalms,
  s9: galleryFullArm,
};


export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Mehndi Services — Bridal, Festival & Events | HARSHI'S" },
      { name: "description", content: "Book professional mehndi artists for bridal, engagement, festival and event henna. Home service available." },
      { property: "og:title", content: "Mehndi Services — HARSHI'S Mehndi Art" },
      { property: "og:description", content: "Professional bridal, festival and event mehndi artistry." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our Artistry</span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Mehndi Services</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          From intricate bridal designs to quick festival art — booked by professionals, loved by clients.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {serviceCategories.map((s) => (
          <div
            key={s.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-gold"
          >
            <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-primary/15 to-gold/20">
              <span className="text-5xl">🖐️</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="w-fit rounded-full bg-gold/15 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-gold-foreground">
                {s.tag}
              </span>
              <h3 className="mt-3 font-serif text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">Starting at</span>
                  <div className="text-lg font-bold text-primary">{s.price}</div>
                </div>
                <Button asChild variant="hero" size="sm">
                  <Link to="/booking">
                    Book <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
