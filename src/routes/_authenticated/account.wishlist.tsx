import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/db";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/account/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — HARSHI'S Mehndi Art" },
      { name: "description", content: "Products you saved for later at HARSHI'S Mehndi Art." },
    ],
  }),
  component: AccountWishlist,
});

function AccountWishlist() {
  const { wishlist } = useCart();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const items = products.filter((p) => wishlist.includes(p.id));

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-10 text-center shadow-soft">
          <Heart className="mx-auto size-12 text-muted-foreground" />
          <p className="mt-4 font-medium">Nothing saved yet</p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/store">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
