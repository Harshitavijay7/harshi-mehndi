import { Link, useRouter } from "@tanstack/react-router";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  ShieldAlert,
  ShoppingBag,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { loadAvatar } from "@/lib/account";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/store", label: "Shop" },
  { to: "/booking", label: "Book Now" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { count, wishlist } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("harshi_theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  useEffect(() => {
    if (!user) {
      setAvatar(null);
      return;
    }
    const sync = () => setAvatar(loadAvatar(user.id));
    sync();
    window.addEventListener("harshi-avatar", sync);
    return () => window.removeEventListener("harshi-avatar", sync);
  }, [user]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("harshi_theme", next ? "dark" : "light");
  };

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    router.navigate({ to: "/auth", replace: true });
  };

  const displayName =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ??
    user?.email?.split("@")[0] ??
    "";


  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-serif text-xl font-bold text-primary">HARSHI'S</span>
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gold">Mehndi Art</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Link to="/wishlist" className="relative">
            <Button variant="ghost" size="icon" aria-label="Wishlist">
              <Heart className="size-5" />
            </Button>
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[0.65rem] font-bold text-destructive-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingBag className="size-5" />
            </Button>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-gradient-gold text-[0.65rem] font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Account menu"
                  className="ml-1 flex size-9 items-center justify-center overflow-hidden rounded-full bg-gradient-gold text-sm font-bold text-gold-foreground"
                >
                  {avatar ? (
                    <img src={avatar} alt="" className="size-full object-cover" />
                  ) : (
                    (displayName || "U").slice(0, 1).toUpperCase()
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="leading-tight">
                  <span className="block truncate">{displayName}</span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <LayoutDashboard className="mr-2 size-4" /> My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/orders">
                    <Package className="mr-2 size-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/profile">
                    <User className="mr-2 size-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <ShieldAlert className="mr-2 size-4" /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 size-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="ml-1 hidden sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="flex flex-col px-4 py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-foreground/80 [&.active]:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
