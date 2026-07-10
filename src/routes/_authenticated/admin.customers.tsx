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
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/60"><td className="p-3" colSpan={6}><Skeleton className="h-9 w-full" /></td></tr>
                ))
              : rows.map((c) => (
                  <tr key={c.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="p-3 font-medium">{c.full_name ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{c.email ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{c.phone ?? "—"}</td>
                    <td className="p-3">{c.orderCount}</td>
                    <td className="p-3 font-semibold">{formatINR(c.spent)}</td>
                    <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
