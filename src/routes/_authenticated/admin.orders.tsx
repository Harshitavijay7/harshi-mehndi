import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Download, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllOrders, updateOrderStatus, type OrderRow } from "@/lib/db";
import { formatINR, exportToCsv } from "@/lib/adminUtils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersPage,
});

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAGE_SIZE = 10;

function paymentStatus(status: string) {
  if (status === "cancelled") return "Refunded";
  if (status === "delivered" || status === "shipped") return "Paid";
  return "Pending";
}

function OrdersPage() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [viewing, setViewing] = useState<OrderRow | null>(null);

  const mut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => { toast.success("Order updated"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); },
    onError: () => toast.error("Update failed"),
  });

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const s = search.toLowerCase();
      const matchSearch = o.customer_name?.toLowerCase().includes(s) || o.customer_phone?.toLowerCase().includes(s) || o.id.includes(s);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search by name, phone or ID..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => exportToCsv("orders", filtered.map((o) => ({
          id: o.id, customer: o.customer_name, phone: o.customer_phone, total: o.total,
          payment: o.payment_method, status: o.status, date: new Date(o.created_at).toLocaleString(),
        })))}>
          <Download className="size-4" /> Export
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Items</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
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
                    <td className="p-3 font-medium">{o.customer_name}</td>
                    <td className="p-3 text-muted-foreground">{o.customer_phone ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{Array.isArray(o.items) ? (o.items as unknown[]).length : 0}</td>
                    <td className="p-3 font-semibold">{formatINR(o.total)}</td>
                    <td className="p-3 text-muted-foreground">
                      <div className="capitalize">{o.payment_method ?? "—"}</div>
                      <div className="text-xs">{paymentStatus(o.status)}</div>
                    </td>
                    <td className="p-3"><StatusBadge status={o.status} /></td>
                    <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setViewing(o)}><Eye className="size-4" /></Button>
                        <Select value={o.status} onValueChange={(v) => mut.mutate({ id: o.id, status: v })}>
                          <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                        </Select>
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

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Order #{viewing?.id.slice(0, 8)}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Customer:</span> {viewing.customer_name}</div>
                <div><span className="text-muted-foreground">Phone:</span> {viewing.customer_phone ?? "—"}</div>
                <div><span className="text-muted-foreground">Email:</span> {viewing.customer_email ?? "—"}</div>
                <div><span className="text-muted-foreground">Payment:</span> <span className="capitalize">{viewing.payment_method ?? "—"}</span></div>
              </div>
              <div><span className="text-muted-foreground">Address:</span> {viewing.shipping_address ?? "—"}</div>
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
