import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Heart, Package, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { fetchMyOrders } from "@/lib/db";
import { fetchMyBookings, currency } from "@/lib/account";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/account/")({
  head: () => ({
    meta: [
      { title: "My Account — HARSHI'S Mehndi Art" },
      { name: "description", content: "Your orders, bookings, wishlist and profile in one place." },
    ],
  }),
  component: AccountDashboard,
});

function AccountDashboard() {
  const { user } = useAuth();
  const { wishlist } = useCart();
  const { data: orders = [], isLoading: lo } = useQuery({ queryKey: ["my-orders"], queryFn: fetchMyOrders });
  const { data: bookings = [], isLoading: lb } = useQuery({ queryKey: ["my-bookings"], queryFn: fetchMyBookings });

  const spent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total ?? 0), 0);

  const name =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ??
    user?.email?.split("@")[0] ??
    "there";

  const cards = [
    { label: "Total Orders", value: orders.length, icon: Package, to: "/account/orders" },
    { label: "Total Bookings", value: bookings.length, icon: CalendarDays, to: "/account/bookings" },
    { label: "Wishlist Items", value: wishlist.length, icon: Heart, to: "/account/wishlist" },
    { label: "Total Spent", value: currency(spent), icon: Wallet, to: "/account/orders" },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 to-gold/10 p-6 shadow-soft sm:p-8">
        <h1 className="font-serif text-2xl font-bold sm:text-3xl">Welcome back, {name}</h1>
        <p className="mt-2 text-muted-foreground">Here's everything happening with your account.</p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium">
              {(user?.user_metadata as { phone?: string } | undefined)?.phone ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="font-medium">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : "—"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-gold"
          >
            <c.icon className="size-5 text-gold" />
            {lo || lb ? (
              <Skeleton className="mt-3 h-7 w-16" />
            ) : (
              <p className="mt-3 text-2xl font-bold">{c.value}</p>
            )}
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Recent orders</h2>
        {lo ? (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No orders yet.{" "}
            <Link to="/store" className="font-medium text-primary hover:underline">
              Start shopping
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border/60">
            {orders.slice(0, 4).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                <span className="capitalize">{o.status}</span>
                <span className="font-semibold">{currency(Number(o.total ?? 0))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
