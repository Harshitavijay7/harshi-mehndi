import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products, productCategories } from "@/data/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Shop Mehndi Products — HARSHI'S Mehndi Art" },
      { name: "description", content: "Shop natural mehndi powder, cones, oils, kits and artist supplies. Premium quality, fast delivery." },
      { property: "og:title", content: "Shop Mehndi Products — HARSHI'S Mehndi Art" },
      { property: "og:description", content: "Premium natural mehndi powder, cones, oils and kits." },
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
  }, [cat, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Online Store</span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Mehndi Products & Supplies</h1>
        <p className="mt-3 text-muted-foreground">Premium, 100% natural — for artists, brides & festivals.</p>
      </div>

      {/* Search & sort */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
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
    </div>
  );
}
