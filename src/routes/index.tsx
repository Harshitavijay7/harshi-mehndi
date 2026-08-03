import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, ShieldCheck, Truck, Gem, Lock, Star, Quote, Phone, Instagram, MessageCircle, Award, Home as HomeIcon, Sparkles, BadgeCheck, Wallet, Zap, Heart } from "lucide-react";
import heroImg from "@/assets/hero-harshi.jpg";
import patternImg from "@/assets/mehndi-pattern.png";
import igBridal from "@/assets/harshi-new-1.jpg";
import igArabic from "@/assets/harshi-new-2.jpg";
import igRoyal from "@/assets/harshi-new-3.jpg";
import igTraditional from "@/assets/harshi-new-4.jpg";
import igFestival from "@/assets/harshi-new-5.jpg";
import igEngagement from "@/assets/harshi-new-6.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products, homeCategories, testimonials } from "@/data/catalog";
import { brand, telLink, whatsappLink } from "@/data/brand";
import { PromoBanner } from "@/components/PromoBanner";

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
      <PromoBanner />
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <img
          src={heroImg}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 flex-col items-start">
            <span className="animate-fade-up rounded-full border border-gold/40 bg-background/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold backdrop-blur">
              Premium Henna Artistry
            </span>
            <h1 className="animate-fade-up mt-6 max-w-3xl text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl md:text-6xl">
              HARSHI'S <span className="text-gradient-gold">Mehndi Art</span>
            </h1>
            <p className="animate-fade-up mt-5 max-w-xl text-lg text-primary-foreground/85">
              Turning every occasion into beautiful memories with stunning mehndi designs.
            </p>
            <div className="animate-fade-up mt-8 flex flex-wrap gap-4">
              <Button asChild variant="gold" size="xl">
                <Link to="/booking">Book Now</Link>
              </Button>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-9 text-base font-medium text-white shadow transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-5" /> WhatsApp Now
              </a>
              <Button asChild variant="outlineHero" size="xl">
                <Link to="/gallery">View Gallery</Link>
              </Button>
            </div>
            <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/90">
              <a href={telLink()} className="flex items-center gap-2 hover:text-gold">
                <Phone className="size-4 text-gold" /> {brand.phone}
              </a>
              <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold">
                <Instagram className="size-4 text-gold" /> {brand.instagram}
              </a>
            </div>
          </div>

          <div className="animate-fade-up relative mx-auto w-full max-w-md lg:max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-gold opacity-30 blur-2xl" />
            <img
              src={heroImg}
              alt="Bridal hands with intricate peacock and elephant mehndi by HARSHI'S Mehndi Art"
              width={735}
              height={890}
              className="relative w-full rounded-[1.75rem] border border-gold/40 object-cover shadow-gold"
            />
          </div>
        </div>
      </section>


      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Who We Are" title="About HARSHI'S Mehndi Art" />
        <p className="mx-auto mt-6 max-w-3xl text-center text-muted-foreground">
          Professional Mehndi Artist specializing in Bridal, Arabic, Traditional, Royal and Festival
          mehndi designs. We are dedicated to creating beautiful and intricate designs using premium
          quality 100% natural mehndi — for weddings, festivals and every celebration.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[
            { icon: Award, title: "Years of Experience", desc: "Trusted by countless happy brides & families." },
            { icon: BadgeCheck, title: "Professional Service", desc: "Punctual, hygienic and detail-obsessed." },
            { icon: HomeIcon, title: "Home Service Available", desc: "We come to you, at your convenience." },
            { icon: Sparkles, title: "Premium Designs", desc: "Bridal, Arabic, royal & festival artistry." },
          ].map((a) => (
            <div key={a.title} className="rounded-2xl border border-border/70 bg-card p-6 text-center shadow-soft">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <a.icon className="size-6" />
              </div>
              <h3 className="mt-3 font-serif text-lg font-semibold">{a.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{a.desc}</p>
            </div>
          ))}
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
              to="/gallery"
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

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Our Promise" title="Why Choose Us" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Leaf, label: "Natural Mehndi" },
            { icon: Gem, label: "Premium Quality" },
            { icon: Wallet, label: "Affordable Pricing" },
            { icon: HomeIcon, label: "Home Service" },
            { icon: Sparkles, label: "Unique Designs" },
            { icon: Zap, label: "Fast Booking" },
            { icon: Lock, label: "Secure Payments" },
            { icon: Heart, label: "Customer Satisfaction" },
          ].map((w) => (
            <div key={w.label} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-gold text-gold-foreground">
                <w.icon className="size-5" />
              </div>
              <span className="text-sm font-medium">{w.label}</span>
            </div>
          ))}
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
        <SectionHeading eyebrow={brand.instagram} title="From Our Instagram" />
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[igBridal, igArabic, igRoyal, igTraditional, igFestival, igEngagement].map((src, i) => (
            <a
              key={i}
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-xl shadow-soft"
            >
              <img
                src={src}
                alt="Mehndi design by HARSHI'S Mehndi Art"
                loading="lazy"
                width={400}
                height={400}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="size-6 text-primary-foreground" />
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-7 py-3 text-base font-medium text-gold-foreground shadow-gold transition-opacity hover:opacity-90"
          >
            <Instagram className="size-5" /> Follow {brand.instagram}
          </a>
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
