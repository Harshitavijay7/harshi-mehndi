import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — HARSHI'S Mehndi Art" },
      { name: "description", content: "Your saved mehndi products and supplies." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useCart();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Heart className="size-16 text-muted-foreground" />
        <h1 className="mt-5 text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-muted-foreground">Tap the heart on any product to save it for later.</p>
        <Button asChild variant="hero" size="lg" className="mt-8">
          <Link to="/store">Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Your Wishlist</h1>
      <p className="mt-2 text-muted-foreground">{items.length} saved item{items.length > 1 ? "s" : ""}</p>
      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
