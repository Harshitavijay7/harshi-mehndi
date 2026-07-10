import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, User, Mail, Shield, Store, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";
import {
  getStoreSettings,
  saveStoreSettings,
  type StoreSettings,
} from "@/lib/adminStore";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [dark, setDark] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>(() => getStoreSettings());

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("admin-theme", v ? "dark" : "light");
  };

  const set = (k: keyof StoreSettings, v: string | number) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings);
    toast.success("Store settings saved");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form onSubmit={saveSettings} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold">
          <Store className="size-5 text-primary" /> Store Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Store Name</Label>
            <Input value={settings.storeName} onChange={(e) => set("storeName", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Tagline</Label>
            <Input value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Support Email</Label>
            <Input type="email" value={settings.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Support Phone</Label>
            <Input value={settings.supportPhone} onChange={(e) => set("supportPhone", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">WhatsApp Number</Label>
            <Input value={settings.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Store Address</Label>
            <Input value={settings.address} onChange={(e) => set("address", e.target.value)} />
          </div>
        </div>

        <h2 className="mb-4 mt-8 flex items-center gap-2 font-serif text-lg font-bold">
          <Truck className="size-5 text-primary" /> Shipping
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block">Shipping Charge (₹)</Label>
            <Input type="number" value={settings.shippingCharge} onChange={(e) => set("shippingCharge", Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Free Shipping Above (₹)</Label>
            <Input type="number" value={settings.freeShippingAbove} onChange={(e) => set("freeShippingAbove", Number(e.target.value) || 0)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="hero">Save Settings</Button>
        </div>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-serif text-lg font-bold">Admin Profile</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <User className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{(user?.user_metadata?.full_name as string) ?? "Admin"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Role:</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">Administrator</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-serif text-lg font-bold">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle the admin dashboard theme.</p>
            </div>
          </div>
          <Switch checked={dark} onCheckedChange={toggleDark} />
        </div>
      </div>
    </div>
  );
}
