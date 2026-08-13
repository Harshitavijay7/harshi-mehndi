import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Users,
  CalendarDays,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { fetchProductsAdmin, fetchAllOrders, fetchAllBookings, fetchCustomers } from "@/lib/db";
import { formatINR } from "@/lib/adminUtils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardHome,
});

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={`flex size-9 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-3 font-serif text-2xl font-bold">{value}</p>
    </div>
  );
}

function DashboardHome() {
  const products = useQuery({ queryKey: ["admin-products"], queryFn: fetchProductsAdmin });
  const orders = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });
  const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchAllBookings });
  const customers = useQuery({ queryKey: ["admin-customers"], queryFn: fetchCustomers });

  const loading = products.isLoading || orders.isLoading || bookings.isLoading || customers.isLoading;

  const orderList = orders.data ?? [];
  const pending = orderList.filter((o) => o.status === "pending").length;
  const completed = orderList.filter((o) => o.status === "delivered").length;
  const revenue = orderList
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Total Products", value: products.data?.length ?? 0, icon: Package, accent: "bg-primary/10 text-primary" },
    { label: "Total Orders", value: orderList.length, icon: ShoppingCart, accent: "bg-blue-500/10 text-blue-600" },
    { label: "Pending Orders", value: pending, icon: Clock, accent: "bg-amber-500/10 text-amber-600" },
    { label: "Completed Orders", value: completed, icon: CheckCircle2, accent: "bg-emerald-500/10 text-emerald-600" },
    { label: "Total Customers", value: customers.data?.length ?? 0, icon: Users, accent: "bg-purple-500/10 text-purple-600" },
    { label: "Total Bookings", value: bookings.data?.length ?? 0, icon: CalendarDays, accent: "bg-gold/20 text-gold-foreground" },
    { label: "Revenue", value: formatINR(revenue), icon: IndianRupee, accent: "bg-emerald-500/10 text-emerald-600" },
    { label: "Avg. Order", value: formatINR(orderList.length ? revenue / orderList.length : 0), icon: TrendingUp, accent: "bg-primary/10 text-primary" },
  ];

  const recentOrders = orderList.slice(0, 6);
  const recentBookings = (bookings.data ?? []).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatINR(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.full_name}</p>
                    <p className="text-xs text-muted-foreground">{b.service} · {b.event_date}</p>
                  </div>
                  <StatusBadge status={b.status} kind="booking" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
