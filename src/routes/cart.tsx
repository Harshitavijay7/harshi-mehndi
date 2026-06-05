import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — HARSHI'S Mehndi Art" },
      { name: "description", content: "Review your mehndi products and checkout securely." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(0);

  const discount = Math.round(subtotal * applied);
  const taxable = subtotal - discount;
  const gst = Math.round(taxable * 0.18);
  const shipping = taxable > 999 || taxable === 0 ? 0 : 49;
  const total = taxable + gst + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <ShoppingBag className="size-16 text-muted-foreground" />
        <h1 className="mt-5 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Discover our premium mehndi products & supplies.</p>
        <Button asChild variant="hero" size="lg" className="mt-8">
          <Link to="/store">Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, qty }) => {
            const price = product.discountPrice ?? product.price;
            return (
              <div key={product.id} className="flex gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-gold/20 text-3xl">
                  🌿
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-semibold leading-snug">{product.name}</h3>
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </div>
                    <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-1 rounded-lg border border-border">
                      <button className="p-1.5 hover:text-primary" onClick={() => setQty(product.id, qty - 1)}>
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{qty}</span>
                      <button className="p-1.5 hover:text-primary" onClick={() => setQty(product.id, qty + 1)}>
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="font-bold text-primary">₹{price * qty}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-serif text-xl font-semibold">Order Summary</h2>

          <div className="mt-4 flex gap-2">
            <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" />
            <Button
              variant="gold"
              onClick={() => {
                if (coupon.trim().toUpperCase() === "HENNA10") {
                  setApplied(0.1);
                  toast.success("Coupon applied — 10% off!");
                } else {
                  toast.error("Invalid coupon. Try HENNA10");
                }
              }}
            >
              Apply
            </Button>
          </div>

          <dl className="mt-5 space-y-2.5 text-sm">
            <Row label="Subtotal" value={`₹${subtotal}`} />
            {discount > 0 && <Row label="Discount" value={`-₹${discount}`} accent />}
            <Row label="GST (18%)" value={`₹${gst}`} />
            <Row label="Shipping" value={shipping === 0 ? "FREE" : `₹${shipping}`} />
            <div className="border-t border-border pt-3">
              <Row label="Total" value={`₹${total}`} bold />
            </div>
          </dl>

          <Button
            variant="hero"
            size="lg"
            className="mt-5 w-full"
            onClick={() => toast.success("Proceeding to secure checkout (demo)")}
          >
            Proceed to Checkout
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            UPI · Google Pay · PhonePe · Cards · COD
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</dt>
      <dd className={bold ? "text-lg font-bold text-primary" : accent ? "font-medium text-secondary" : "font-medium"}>
        {value}
      </dd>
    </div>
  );
}
