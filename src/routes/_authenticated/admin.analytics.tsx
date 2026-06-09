import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { fetchAllOrders, fetchAllBookings } from "@/lib/db";
import { formatINR } from "@/lib/adminUtils";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4 font-serif text-lg font-bold">{title}</h2>
      <div className="h-64">{children}</div>
    </div>
  );
}

function AnalyticsPage() {
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });
  const { data: bookings = [] } = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchAllBookings });

  const monthly = useMemo(() => {
    const base = MONTHS.map((m) => ({ month: m, revenue: 0, orders: 0, bookings: 0 }));
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      const idx = d.getMonth();
      base[idx].orders += 1;
      if (o.status !== "cancelled") base[idx].revenue += Number(o.total ?? 0);
    });
    bookings.forEach((b) => {
      const d = new Date(b.created_at);
      base[d.getMonth()].bookings += 1;
    });
    return base;
  }, [orders, bookings]);

  const productSales = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      if (!Array.isArray(o.items)) return;
      (o.items as Array<Record<string, unknown>>).forEach((it) => {
        const name = String(it.name ?? "Item");
        const qty = Number(it.quantity ?? it.qty ?? 1);
        map.set(name, (map.get(name) ?? 0) + qty);
      });
    });
    return Array.from(map.entries())
      .map(([name, qty]) => ({ name: name.length > 14 ? name.slice(0, 14) + "…" : name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);
  }, [orders]);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
      </div>
    );
  }

  const axis = { stroke: "var(--muted-foreground)", fontSize: 12 };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Revenue (Monthly)">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthly}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} />
            <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
            <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fill="url(#rev)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Monthly Orders">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
            <Bar dataKey="orders" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Product Sales">
        {productSales.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No sales data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productSales} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" {...axis} allowDecimals={false} />
              <YAxis type="category" dataKey="name" {...axis} width={90} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Bar dataKey="qty" fill="var(--gold)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Booking Trends">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
            <Line type="monotone" dataKey="bookings" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
