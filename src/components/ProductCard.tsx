import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWishlist, wishlist } = useCart();
  const wished = wishlist.includes(product.id);
  const off =
    product.discountPrice && Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-gold">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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
      </Link>

      <button
        onClick={() => {
          toggleWishlist(product.id);
          toast(wished ? "Removed from wishlist" : "Added to wishlist ❤️");
        }}
        className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft transition-colors hover:text-destructive sm:right-3"
        style={{ position: "relative", alignSelf: "flex-end", marginTop: "-3rem", marginRight: "0.75rem" }}
        aria-label="Wishlist"
      >
        <Heart className={cn("size-4", wished && "fill-destructive text-destructive")} />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </span>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <h3 className="mt-1 line-clamp-2 font-serif text-base font-semibold leading-snug hover:text-primary">
            {product.name}
          </h3>
        </Link>
        {product.size && <span className="mt-0.5 text-xs text-muted-foreground">{product.size}</span>}

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
