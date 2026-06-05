import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, ShieldCheck, Truck, Gem, Lock, Star, Quote } from "lucide-react";
import heroImg from "@/assets/hero-mehndi.jpg";
import patternImg from "@/assets/mehndi-pattern.png";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products, homeCategories, testimonials } from "@/data/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HARSHI'S Mehndi Art — Premium Henna Products & Artistry" },
      { name: "description", content: "Transforming hands into masterpieces. Shop 100% natural mehndi products and book professional henna artists." },
      { property: "og:title", content: "HARSHI'S Mehndi Art" },
      { property: "og:description", content: "Premium natural mehndi products & professional artistry." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "HARSHI'S Mehndi Art",
          description: "Premium natural mehndi products and professional henna artistry.",
        }),
      },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Leaf, title: "100% Natural Mehndi" },
  { icon: ShieldCheck, title: "Chemical-Free Products" },
  { icon: Truck, title: "Fast Delivery" },
  { icon: Gem, title: "Premium Quality" },
  { icon: Lock, title: "Secure Payments" },
];

function Home() {
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Bride's hands with intricate bridal mehndi"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-28 sm:px-6 md:py-40">
          <span className="animate-fade-up rounded-full border border-gold/40 bg-background/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold backdrop-blur">
            Premium Henna Artistry
          </span>
          <h1 className="animate-fade-up mt-6 max-w-3xl text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Transforming Hands into <span className="text-gradient-gold">Masterpieces</span>
          </h1>
          <p className="animate-fade-up mt-5 max-w-xl text-lg text-primary-foreground/85">
            Professional Mehndi Services & Premium Mehndi Products — crafted with 100% natural henna.
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap gap-4">
            <Button asChild variant="gold" size="xl">
              <Link to="/booking">Book Mehndi Artist</Link>
            </Button>
            <Button asChild variant="outlineHero" size="xl">
              <Link to="/store">Shop Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border/60 bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-5">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <f.icon className="size-6" />
              </div>
              <span className="text-sm font-medium">{f.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Explore" title="Mehndi Categories" />
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {homeCategories.map((c) => (
            <Link
              key={c.name}
              to="/store"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold"
            >
              <span className="text-4xl transition-transform group-hover:scale-110">{c.emoji}</span>
              <span className="text-sm font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="relative overflow-hidden bg-muted/40 py-16">
        <img src={patternImg} alt="" aria-hidden width={1024} height={1024} className="pointer-events-none absolute -right-20 top-0 w-96 opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Loved by Artists" title="Best Sellers" />
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {bestSellers.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/store">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Happy Clients" title="What Our Customers Say" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
              <Quote className="size-7 text-gold" />
              <p className="mt-3 flex-1 text-sm text-muted-foreground">"{t.text}"</p>
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-gold text-gold" />
                ))}
              </div>
              <div className="mt-3">
                <div className="font-serif font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram gallery */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <SectionHeading eyebrow="@harshismehndiart" title="From Our Instagram" />
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-gold/20 text-3xl shadow-soft transition-transform hover:scale-105"
            >
              ✋
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to celebrate in style?</h2>
          <p className="mt-3 text-primary-foreground/80">
            Book a professional artist or stock up on premium supplies today.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Button asChild variant="gold" size="xl">
              <Link to="/booking">Book Now</Link>
            </Button>
            <Button asChild variant="outlineHero" size="xl">
              <Link to="/store">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
      <div className="mx-auto mt-4 h-0.5 w-20 rounded-full bg-gradient-gold" />
    </div>
  );
}
