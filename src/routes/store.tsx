import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Sparkles, MessageCircle, Truck, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productCategories } from "@/data/catalog";
import { fetchProducts } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Shop Mehndi Products & Supplies — HARSHI'S Mehndi Art" },
      { name: "description", content: "Shop premium natural mehndi powder, cones, oils, aftercare, kits and professional artist supplies. Fast delivery, COD & WhatsApp ordering." },
      { property: "og:title", content: "Shop Mehndi Products — HARSHI'S Mehndi Art" },
      { property: "og:description", content: "Premium natural mehndi powder, cones, oils and artist kits." },
    ],
    links: [{ rel: "canonical", href: "/store" }],
  }),
  component: Store,
});

const sorts = [
  { key: "popular", label: "Popular" },
  { key: "low", label: "Price: Low to High" },
  { key: "high", label: "Price: High to Low" },
] as const;

function Store() {
  const [cat, setCat] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof sorts)[number]["key"]>("popular");

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const featured = useMemo(() => products.filter((p) => p.featured), [products]);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    );
    const price = (p: (typeof products)[number]) => p.discountPrice ?? p.price;
    if (sort === "low") list = [...list].sort((a, b) => price(a) - price(b));
    if (sort === "high") list = [...list].sort((a, b) => price(b) - price(a));
    if (sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [cat, query, sort, products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Online Store</span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Mehndi Products & Supplies</h1>
        <p className="mt-3 text-muted-foreground">Premium, 100% natural — for artists, brides & festivals.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Truck className="size-4 text-primary" /> Fast Delivery</span>
          <span className="flex items-center gap-1.5"><Sparkles className="size-4 text-primary" /> COD Available</span>
          <span className="flex items-center gap-1.5"><MessageCircle className="size-4 text-[#25D366]" /> WhatsApp Ordering</span>
        </div>
      </div>

      {/* Featured slider */}
      {featured.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">Featured Products</h2>
            <Sparkles className="size-5 text-gold" />
          </div>
          <div className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
            {featured.map((p) => (
              <div key={p.id} className="w-56 shrink-0 snap-start sm:w-64">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search & sort */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {sorts.map((s) => (
            <Button
              key={s.key}
              variant={sort === s.key ? "hero" : "outline"}
              size="sm"
              onClick={() => setSort(s.key)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["All", ...productCategories].map((c) => (
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

      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">No products found. Try another search.</p>
      )}

      {/* Wishlist link */}
      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link to="/wishlist">View Your Wishlist ❤️</Link>
        </Button>
      </div>
    </div>
  );
}
