import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Eye, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchCustomers, fetchAllOrders, fetchCustomerHistory, type ProfileRow } from "@/lib/db";
import { formatINR, exportToCsv } from "@/lib/adminUtils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const { data: customers = [], isLoading } = useQuery({ queryKey: ["admin-customers"], queryFn: fetchCustomers });
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProfileRow | null>(null);

  const rows = useMemo(() => {
    return customers.map((c) => {
      const theirs = orders.filter((o) => o.user_id === c.id || o.customer_email === c.email);
      const spent = theirs.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total ?? 0), 0);
      return { ...c, orderCount: theirs.length, spent };
    }).filter((c) => {
      const s = search.toLowerCase();
      return (c.full_name ?? "").toLowerCase().includes(s) || (c.email ?? "").toLowerCase().includes(s) || (c.phone ?? "").toLowerCase().includes(s);
    });
  }, [customers, orders, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="pl-9" />
        </div>
        <Button variant="outline" onClick={() => exportToCsv("customers", rows.map((c) => ({
          name: c.full_name, email: c.email, phone: c.phone, orders: c.orderCount, spent: c.spent,
        })))}>
          <Download className="size-4" /> Export
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Total Orders</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/60"><td className="p-3" colSpan={7}><Skeleton className="h-9 w-full" /></td></tr>
                ))
              : rows.map((c) => (
                  <tr key={c.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="p-3 font-medium">{c.full_name ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{c.email ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{c.phone ?? "—"}</td>
                    <td className="p-3">{c.orderCount}</td>
                    <td className="p-3 font-semibold">{formatINR(c.spent)}</td>
                    <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" title="View profile" onClick={() => setSelected(c)}>
                        <Eye className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <CustomerDetailDialog customer={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function CustomerDetailDialog({
  customer,
  onClose,
}: {
  customer: ProfileRow | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["customer-history", customer?.id],
    queryFn: () => fetchCustomerHistory(customer!.id, customer!.email),
    enabled: !!customer,
  });

  return (
    <Dialog open={!!customer} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Profile</DialogTitle>
        </DialogHeader>
        {customer && (
          <div className="space-y-5">
            <div className="grid gap-2 rounded-xl border border-border bg-muted/30 p-4 text-sm">
              <div className="flex items-center gap-2"><User className="size-4 text-muted-foreground" /> {customer.full_name ?? "—"}</div>
              <div className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" /> {customer.email ?? "—"}</div>
              <div className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" /> {customer.phone ?? "—"}</div>
            </div>

            <div>
              <h3 className="mb-2 font-serif text-sm font-bold">Order History</h3>
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : data && data.orders.length > 0 ? (
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {data.orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between rounded-lg border border-border/60 p-2 text-sm">
                      <span className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</span>
                      <span className="font-semibold">{formatINR(o.total)}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              )}
            </div>

            <div>
              <h3 className="mb-2 font-serif text-sm font-bold">Booking History</h3>
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : data && data.bookings.length > 0 ? (
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {data.bookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between rounded-lg border border-border/60 p-2 text-sm">
                      <span>{b.event_type ?? "Booking"}</span>
                      <span className="text-muted-foreground">{b.event_date ?? "—"}</span>
                      <StatusBadge status={b.status} kind="booking" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No bookings yet.</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
