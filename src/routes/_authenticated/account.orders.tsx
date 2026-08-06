import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Package, Printer, X } from "lucide-react";
import { toast } from "sonner";
import { fetchMyOrders } from "@/lib/db";
import { currency } from "@/lib/account";
import { cancelMyOrder } from "@/lib/account.functions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/account/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — HARSHI'S Mehndi Art" },
      { name: "description", content: "Track your mehndi product orders, statuses and invoices." },
    ],
  }),
  component: MyOrders,
});

const STEPS = ["pending", "confirmed", "shipped", "delivered"] as const;

type OrderItem = { name?: string; title?: string; qty?: number; quantity?: number; price?: number };

function MyOrders() {
  const qc = useQueryClient();
  const cancel = useServerFn(cancelMyOrder);
  const [open, setOpen] = useState<string | null>(null);
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["my-orders"], queryFn: fetchMyOrders });
  const active = orders.find((o) => o.id === open);

  const items = (o: typeof active): OrderItem[] =>
    Array.isArray(o?.items) ? (o!.items as OrderItem[]) : [];

  const onCancel = async (id: string) => {
    try {
      await cancel({ data: { id } });
      toast.success("Order cancelled.");
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      setOpen(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel this order.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-10 text-center shadow-soft">
          <Package className="mx-auto size-12 text-muted-foreground" />
          <p className="mt-4 font-medium">No orders yet</p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/store">Shop now</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {o.created_at ? new Date(o.created_at).toLocaleString("en-IN") : ""}
                  </p>
                </div>
                <StatusBadge status={o.status ?? "pending"} />
                <p className="font-semibold">{currency(Number(o.total ?? 0))}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setOpen(o.id)}>
                    View details
                  </Button>
                  {o.status === "pending" && (
                    <Button variant="ghost" size="sm" onClick={() => onCancel(o.id)}>
                      <X className="mr-1 size-4" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order #{active?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>

          {active && (
            <div className="space-y-5 text-sm">
              <ol className="flex items-center justify-between">
                {STEPS.map((s, i) => {
                  const idx = STEPS.indexOf((active.status ?? "pending") as (typeof STEPS)[number]);
                  const done = idx >= i && active.status !== "cancelled";
                  return (
                    <li key={s} className="flex flex-1 flex-col items-center gap-1">
                      <span
                        className={`size-3 rounded-full ${done ? "bg-primary" : "bg-muted-foreground/30"}`}
                      />
                      <span className="text-[11px] capitalize text-muted-foreground">{s}</span>
                    </li>
                  );
                })}
              </ol>

              <div>
                <p className="font-semibold">Items</p>
                <ul className="mt-2 space-y-1">
                  {items(active).map((it, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {it.name ?? it.title} × {it.qty ?? it.quantity ?? 1}
                      </span>
                      <span>{currency(Number(it.price ?? 0) * Number(it.qty ?? it.quantity ?? 1))}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1 border-t border-border/60 pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{currency(Number(active.subtotal ?? 0))}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{currency(Number(active.total ?? 0))}</span>
                </div>
              </div>

              <div>
                <p className="font-semibold">Shipping to</p>
                <p className="text-muted-foreground">{active.shipping_address ?? "—"}</p>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="mr-1.5 size-4" /> Print invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
