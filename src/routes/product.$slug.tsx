import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Heart,
  ShoppingBag,
  Star,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  Leaf,
  Check,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { getProduct, products } from "@/data/catalog";
import { whatsappOrderLink } from "@/data/brand";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const title = `${p.name} — HARSHI'S Mehndi Art`;
    return {
      meta: [
        { title },
        { name: "description", content: p.description.slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: p.description.slice(0, 158) },
        { property: "og:image", content: p.image },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.image },
      ],
      links: [{ rel: "canonical", href: `/product/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.description,
            image: p.image,
            brand: { "@type": "Brand", name: "HARSHI'S Mehndi Art" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
            offers: {
              "@type": "Offer",
              price: p.discountPrice ?? p.price,
              priceCurrency: "INR",
              availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Button asChild variant="hero" className="mt-6">
        <Link to="/store">Back to Shop</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <Button
          variant="hero"
          className="mt-6"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
      </div>
    );
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, toggleWishlist, wishlist } = useCart();
  const navigate = Route.useNavigate();
  const [qty, setQty] = useState(1);
  const wished = wishlist.includes(product.id);
  const price = product.discountPrice ?? product.price;

  const related = useMemo(
    () => products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
    [product],
  );

  const buyNow = () => {
    add(product, qty);
    navigate({ to: "/cart" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/store" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="size-4" /> Back to Shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{product.category}</span>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("size-4", i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted-foreground/40")}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">₹{price}</span>
            {product.discountPrice && (
              <span className="text-lg text-muted-foreground line-through">₹{product.price}</span>
            )}
            {product.size && (
              <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
                {product.size}
              </span>
            )}
          </div>

          {/* Inventory */}
          <div className="mt-3 text-sm">
            {product.inStock ? (
              <span className="font-medium text-secondary">
                In stock{product.stock <= 30 ? ` — only ${product.stock} left!` : ""}
              </span>
            ) : (
              <span className="font-medium text-destructive">Out of stock</span>
            )}
          </div>

          <p className="mt-5 text-muted-foreground">{product.description}</p>

          {product.includes && (
            <div className="mt-5 rounded-2xl border border-border/70 bg-muted/40 p-4">
              <h3 className="font-serif font-semibold">What's included</h3>
              <ul className="mt-2 space-y-1.5">
                {product.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-secondary" /> {inc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.ingredients && (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Ingredients: </span>
              {product.ingredients}
            </p>
          )}

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center gap-1 rounded-lg border border-border">
              <button className="px-3 py-1.5 hover:text-primary" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button className="px-3 py-1.5 hover:text-primary" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="hero"
              size="lg"
              disabled={!product.inStock}
              onClick={() => {
                add(product, qty);
                toast.success(`${product.name} added to cart`);
              }}
            >
              <ShoppingBag className="size-4" /> Add to Cart
            </Button>
            <Button variant="gold" size="lg" disabled={!product.inStock} onClick={buyNow}>
              <Zap className="size-4" /> Buy Now
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href={whatsappOrderLink(product.name)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] text-base font-medium text-white shadow transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" /> Order on WhatsApp
            </a>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                toggleWishlist(product.id);
                toast(wished ? "Removed from wishlist" : "Added to wishlist ❤️");
              }}
            >
              <Heart className={cn("size-4", wished && "fill-destructive text-destructive")} />
              {wished ? "Wishlisted" : "Wishlist"}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Razorpay · UPI · Cards · Cash on Delivery available
          </p>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
            {[
              { icon: Leaf, label: "100% Natural" },
              { icon: Truck, label: "Fast Delivery" },
              { icon: ShieldCheck, label: "Secure Payment" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5">
                <b.icon className="size-5 text-primary" />
                <span className="text-xs text-muted-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl font-bold">Customer Reviews</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {product.customerReviews.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="mt-1.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={cn("size-3.5", j < r.rating ? "fill-gold text-gold" : "text-muted-foreground/40")}
                  />
                ))}
              </div>
              <p className="mt-2.5 text-sm text-muted-foreground">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold">Related Products</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
