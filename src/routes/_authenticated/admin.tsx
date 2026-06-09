import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CalendarDays,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  Bell,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllOrders, fetchAllBookings } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("admin-theme");
    const isDark = stored ? stored === "dark" : false;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("admin-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

function AdminLayout() {
  const { isAdmin, loading, signOut } = useAuth();
  const { dark, toggle } = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const qc = useQueryClient();

  // Ensure admin pages render in light theme container when leaving
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders, enabled: isAdmin });
  const { data: bookings = [] } = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchAllBookings, enabled: isAdmin });
  const newOrders = orders.filter((o) => o.status === "pending").length;
  const newBookings = bookings.filter((b) => b.status === "pending").length;
  const notifications = newOrders + newBookings;

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    window.location.href = "/auth";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
        <ShieldAlert className="size-14 text-destructive" />
        <h1 className="mt-5 text-2xl font-bold">Admin access only</h1>
        <p className="mt-2 text-muted-foreground">
          Your account doesn't have admin permissions. Contact the store owner to be granted access.
        </p>
        <Button asChild variant="hero" className="mt-8">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-2 px-5 py-5", collapsed && "justify-center px-2")}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-white shadow-gold">
          <Sparkles className="size-5" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-serif text-sm font-bold text-sidebar-foreground">HARSHI'S</p>
            <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const active = isActive(item.to, "exact" in item ? item.exact : false);
          const badge =
            item.to === "/admin/orders" ? newOrders : item.to === "/admin/bookings" ? newBookings : 0;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="size-[18px] shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && badge > 0 && (
                <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut className="size-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:block",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-sidebar shadow-xl">{SidebarInner}</aside>
        </div>
      )}

      <div className={cn("transition-all duration-300", collapsed ? "lg:pl-[72px]" : "lg:pl-64")}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={() => setCollapsed((c) => !c)}
          >
            <Menu className="size-5" />
          </Button>
          <h1 className="font-serif text-lg font-bold sm:text-xl">
            {NAV.find((n) => isActive(n.to, "exact" in n ? n.exact : false))?.label ?? "Admin"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="size-5" />
              </Button>
              {notifications > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {notifications}
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={toggle}>
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
