import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Deterministic soft gradient per product for an elegant image placeholder
const tints = [
  "from-primary/15 to-gold/15",
  "from-gold/20 to-secondary/15",
  "from-secondary/15 to-primary/15",
  "from-gold/15 to-primary/20",
];

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWishlist, wishlist } = useCart();
  const wished = wishlist.includes(product.id);
  const tint = tints[product.id.charCodeAt(1) % tints.length];
  const off =
    product.discountPrice && Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-gold">
      <div className={cn("relative flex aspect-square items-center justify-center bg-gradient-to-br", tint)}>
        <span className="font-serif text-5xl opacity-30">🌿</span>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-gold px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-gold-foreground">
            {product.badge}
          </span>
        )}
        {off ? (
          <span className="absolute right-3 top-3 rounded-full bg-destructive px-2 py-1 text-[0.65rem] font-bold text-destructive-foreground">
            -{off}%
          </span>
        ) : null}
        <button
          onClick={() => {
            toggleWishlist(product.id);
            toast(wished ? "Removed from wishlist" : "Added to wishlist ❤️");
          }}
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft transition-colors hover:text-destructive"
          aria-label="Wishlist"
        >
          <Heart className={cn("size-4", wished && "fill-destructive text-destructive")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-2 font-serif text-base font-semibold leading-snug">{product.name}</h3>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="text-lg font-bold text-primary">₹{product.discountPrice ?? product.price}</span>
          {product.discountPrice && (
            <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
          )}
          {!product.inStock && <span className="ml-auto text-xs font-medium text-destructive">Out of stock</span>}
        </div>

        <Button
          variant="hero"
          size="sm"
          className="mt-3 w-full"
          disabled={!product.inStock}
          onClick={() => {
            add(product);
            toast.success(`${product.name} added to cart`);
          }}
        >
          <ShoppingBag className="size-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
