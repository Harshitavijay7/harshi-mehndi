import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  Heart,
  MapPin,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  ShieldAlert,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { getMyRole } from "@/lib/account.functions";
import { loadAvatar } from "@/lib/account";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountLayout,
});

const NAV = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/account/bookings", label: "My Bookings", icon: CalendarDays },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { to: "/account/profile", label: "Profile", icon: User },
  { to: "/account/security", label: "Security", icon: ShieldCheck },
] as const;

function AccountLayout() {
  const { user, signOut } = useAuth();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const roleFn = useServerFn(getMyRole);

  const { data: roleInfo } = useQuery({
    queryKey: ["my-role", user?.id],
    queryFn: () => roleFn(),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    const sync = () => setAvatar(loadAvatar(user.id));
    sync();
    window.addEventListener("harshi-avatar", sync);
    return () => window.removeEventListener("harshi-avatar", sync);
  }, [user]);

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    window.location.href = "/auth";
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const name =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ??
    user?.email?.split("@")[0] ??
    "Guest";

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-gold text-sm font-bold text-gold-foreground">
          {avatar ? (
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            name.slice(0, 1).toUpperCase()
          )}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = isActive(item.to, "exact" in item ? item.exact : false);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/75 hover:bg-muted",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}

        {roleInfo?.role === "admin" && (
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gold hover:bg-muted"
          >
            <ShieldAlert className="size-4" />
            Admin Dashboard
          </Link>
        )}
      </nav>

      <div className="p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex items-center justify-between md:hidden">
        <h1 className="text-xl font-bold">Account Center</h1>
        <Button variant="outline" size="icon" onClick={() => setMobileOpen((o) => !o)} aria-label="Account menu">
          <Menu className="size-5" />
        </Button>
      </div>

      {mobileOpen && (
        <div className="mb-5 rounded-2xl border border-border/70 bg-card shadow-soft md:hidden">{SidebarInner}</div>
      )}

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="hidden self-start rounded-2xl border border-border/70 bg-card shadow-soft md:block">
          {SidebarInner}
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
