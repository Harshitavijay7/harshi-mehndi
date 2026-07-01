import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { uploadPaymentScreenshot } from "@/lib/db";
import { placeOrder as placeOrderFn, validateCoupon } from "@/lib/orders.functions";
import { brand, shippingFor, upiQrUrl, upiLink } from "@/data/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — HARSHI'S Mehndi Art" },
      { name: "description", content: "Review your mehndi products and checkout securely." },
    ],
  }),
  component: Cart,
});

const PAYMENT_METHODS = [
  { key: "UPI", label: "UPI QR" },
  { key: "Google Pay", label: "Google Pay" },
  { key: "PhonePe", label: "PhonePe" },
  { key: "Paytm", label: "Paytm" },
  { key: "COD", label: "Cash on Delivery" },
] as const;

function Cart() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [open, setOpen] = useState(false);

  // Checkout form
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]["key"]>("UPI");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [txnId, setTxnId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const discount = Math.round(subtotal * applied);
  const taxable = subtotal - discount;
  const shipping = shippingFor(taxable);
  const total = taxable + shipping;
  const isOnlinePayment = method !== "COD";

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

  function startCheckout() {
    if (!user) {
      toast.error("Please sign in to place your order.");
      navigate({ to: "/auth" });
      return;
    }
    setOpen(true);
  }

  async function placeOrder() {
    if (!user) return;
    if (!address.trim() || !phone.trim()) {
      toast.error("Please enter your delivery address and phone number.");
      return;
    }
    if (isOnlinePayment && !txnId.trim() && !screenshot) {
      toast.error("Enter the transaction ID or upload a payment screenshot.");
      return;
    }
    setPlacing(true);
    try {
      let screenshotPath: string | null = null;
      if (screenshot) {
        screenshotPath = await uploadPaymentScreenshot(screenshot, user.id);
      }
      // The server recomputes all prices/totals from authoritative DB data.
      await placeOrderFn({
        data: {
          items: items.map(({ product, qty }) => ({ slug: product.slug, qty })),
          address,
          phone,
          payment_method: method,
          coupon: coupon.trim() || null,
          transaction_id: txnId || null,
          payment_screenshot_path: screenshotPath,
        },
      });
      clear();
      setOpen(false);
      toast.success("Order placed successfully! We'll be in touch.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error("Couldn't place order. Please try again.");
      console.error(err);
    } finally {
      setPlacing(false);
    }
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
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="size-20 shrink-0 rounded-xl object-cover"
                />
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
              onClick={async () => {
                const code = coupon.trim();
                if (!code) return;
                try {
                  const res = await validateCoupon({ data: { code } });
                  if (res.valid) {
                    setApplied(res.rate);
                    toast.success(`Coupon applied — ${Math.round(res.rate * 100)}% off!`);
                  } else {
                    setApplied(0);
                    toast.error("Invalid coupon code.");
                  }
                } catch {
                  toast.error("Couldn't validate coupon. Please try again.");
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

          <p className="mt-2 text-xs text-muted-foreground">
            Free shipping above ₹800 · Flat ₹50 across India · COD available
          </p>

          <Button variant="hero" size="lg" className="mt-5 w-full" onClick={startCheckout}>
            Proceed to Checkout
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            UPI · Google Pay · PhonePe · Paytm · COD
          </p>
        </div>
      </div>

      {/* Payment dialog */}
      <Dialog open={open} onOpenChange={(o) => !placing && setOpen(o)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Checkout · ₹{total}</DialogTitle>
            <DialogDescription>Enter delivery details and choose how you'd like to pay.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Delivery Address <span className="text-destructive">*</span></Label>
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address with pincode" rows={2} />
            </div>
            <div>
              <Label className="mb-1.5 block">Phone Number <span className="text-destructive">*</span></Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" />
            </div>

            <div>
              <Label className="mb-1.5 block">Payment Method</Label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMethod(m.key)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      method === m.key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-gold/50",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {isOnlinePayment && (
              <div className="space-y-3 rounded-xl border border-border/70 bg-muted/30 p-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <img
                    src={upiQrUrl(total)}
                    alt="UPI payment QR code"
                    width={220}
                    height={220}
                    className="rounded-lg bg-white p-2"
                  />
                  <p className="text-sm">
                    Pay <span className="font-semibold text-primary">₹{total}</span> to UPI ID
                  </p>
                  <p className="font-mono text-sm font-semibold">{brand.upiId}</p>
                  <a href={upiLink(total)} className="text-xs font-medium text-secondary underline">
                    Open in UPI app
                  </a>
                </div>
                <div>
                  <Label className="mb-1.5 block">Transaction / UTR ID</Label>
                  <Input value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="Enter UPI reference number" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Upload Payment Screenshot</Label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:border-primary">
                    <Upload className="size-4" />
                    {screenshot ? screenshot.name : "Choose image..."}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
            )}

            {!isOnlinePayment && (
              <p className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                Pay ₹{total} in cash when your order is delivered.
              </p>
            )}

            <Button variant="hero" size="lg" className="w-full" disabled={placing} onClick={placeOrder}>
              {placing ? <><Loader2 className="size-4 animate-spin" /> Placing order...</> : `Place Order · ₹${total}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
