import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Download, Eye, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllOrders, updateOrderStatus, type OrderRow } from "@/lib/db";
import { formatINR, exportToCsv, ORDER_STATUSES } from "@/lib/adminUtils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersPage,
});

const PAGE_SIZE = 10;

/** The live orders table uses full_name/phone/email/address; generated types are stale. */
function field(o: OrderRow, ...keys: string[]): string | null {
  const rec = o as unknown as Record<string, unknown>;
  for (const k of keys) {
    const v = rec[k];
    if (v != null && String(v).length > 0) return String(v);
  }
  return null;
}

const customerName = (o: OrderRow) => field(o, "full_name", "customer_name") ?? "—";
const customerPhone = (o: OrderRow) => field(o, "phone", "customer_phone") ?? "—";
const customerEmail = (o: OrderRow) => field(o, "email", "customer_email") ?? "—";
const customerAddress = (o: OrderRow) => field(o, "address", "shipping_address") ?? "—";

function paymentStatusLabel(o: OrderRow) {
  const ps = field(o, "payment_status");
  if (ps) return ps;
  if (o.status === "cancelled") return "Refunded";
  if (o.status === "delivered" || o.status === "shipped") return "Paid";
  return "Pending";
}

function OrdersPage() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [viewing, setViewing] = useState<OrderRow | null>(null);
  const [accepting, setAccepting] = useState<OrderRow | null>(null);

  const mut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: (_d, v) => {
      toast.success(v.status === "confirmed" ? "Order accepted successfully." : "Order updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const s = search.toLowerCase();
      const matchSearch =
        customerName(o).toLowerCase().includes(s) ||
        customerPhone(o).toLowerCase().includes(s) ||
        customerEmail(o).toLowerCase().includes(s) ||
        o.id.includes(s);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const confirmAccept = () => {
    if (!accepting) return;
    mut.mutate({ id: accepting.id, status: "confirmed" });
    setAccepting(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search by name, email, phone or ID..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ORDER_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => exportToCsv("orders", filtered.map((o) => ({
          id: o.id, customer: customerName(o), email: customerEmail(o), phone: customerPhone(o), total: o.total,
          payment: o.payment_method, payment_status: paymentStatusLabel(o), status: o.status,
          date: new Date(o.created_at).toLocaleString(),
        })))}>
          <Download className="size-4" /> Export
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3">Order Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/60"><td className="p-3" colSpan={9}><Skeleton className="h-9 w-full" /></td></tr>
                ))
              : pageRows.map((o) => (
                  <tr key={o.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                    <td className="p-3 font-medium">{customerName(o)}</td>
                    <td className="p-3 text-muted-foreground">{customerEmail(o)}</td>
                    <td className="p-3 font-semibold">{formatINR(o.total)}</td>
                    <td className="p-3 capitalize text-muted-foreground">{o.payment_method ?? "—"}</td>
                    <td className="p-3 capitalize text-muted-foreground">{paymentStatusLabel(o)}</td>
                    <td className="p-3"><StatusBadge status={o.status} /></td>
                    <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {o.status === "pending" ? (
                          <Button size="sm" variant="hero" onClick={() => setAccepting(o)} disabled={mut.isPending}>
                            <Check className="mr-1 size-4" /> Accept Order
                          </Button>
                        ) : (
                          <Select value={o.status} onValueChange={(v) => mut.mutate({ id: o.id, status: v })}>
                            <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Update Status" /></SelectTrigger>
                            <SelectContent>
                              {ORDER_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setViewing(o)} aria-label="View order">
                          <Eye className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={9} className="p-10 text-center text-muted-foreground">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page + 1} of {pageCount}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Dialog open={!!accepting} onOpenChange={(v) => !v && setAccepting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Accept this order?</DialogTitle>
            <DialogDescription>
              The customer will be notified that their order has been confirmed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setAccepting(null)}>Cancel</Button>
            <Button variant="hero" className="flex-1 sm:flex-none" onClick={confirmAccept}>Accept Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader><DialogTitle>Order #{viewing?.id.slice(0, 8)}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Customer:</span> {customerName(viewing)}</div>
                <div><span className="text-muted-foreground">Phone:</span> {customerPhone(viewing)}</div>
                <div><span className="text-muted-foreground">Email:</span> {customerEmail(viewing)}</div>
                <div><span className="text-muted-foreground">Payment:</span> <span className="capitalize">{viewing.payment_method ?? "—"}</span></div>
              </div>
              <div><span className="text-muted-foreground">Address:</span> {customerAddress(viewing)}</div>
              <div className="rounded-lg border border-border p-3">
                <p className="mb-2 font-medium">Items</p>
                <div className="space-y-1.5">
                  {(Array.isArray(viewing.items) ? (viewing.items as Array<Record<string, unknown>>) : []).map((it, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span>{String(it.name ?? "Item")} × {String(it.quantity ?? it.qty ?? 1)}</span>
                      <span>{formatINR(Number(it.price ?? 0))}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span><span>{formatINR(viewing.total)}</span>
              </div>
              {mut.isPending && <Loader2 className="size-4 animate-spin" />}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
