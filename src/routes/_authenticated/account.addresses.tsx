import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  loadAddresses,
  saveAddresses,
  formatAddress,
  type Address,
} from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/account/addresses")({
  head: () => ({
    meta: [
      { title: "Saved Addresses — HARSHI'S Mehndi Art" },
      { name: "description", content: "Manage your saved delivery addresses for faster checkout." },
    ],
  }),
  component: Addresses,
});

const empty: Address = {
  id: "",
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

function Addresses() {
  const { user } = useAuth();
  const [list, setList] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Address>(empty);

  useEffect(() => {
    if (user) setList(loadAddresses(user.id));
  }, [user]);

  const persist = (next: Address[]) => {
    if (!user) return;
    setList(next);
    saveAddresses(user.id, next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: Address = { ...form, id: form.id || crypto.randomUUID() };
    let next = form.id ? list.map((a) => (a.id === form.id ? entry : a)) : [...list, entry];
    if (entry.isDefault) next = next.map((a) => ({ ...a, isDefault: a.id === entry.id }));
    persist(next);
    setOpen(false);
    setForm(empty);
    toast.success("Address saved.");
  };

  const set = (k: keyof Address, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setForm(empty); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="mr-1.5 size-4" /> Add address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit address" : "New address"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5 block">Label</Label>
                  <Input value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="Home" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Full name</Label>
                  <Input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Phone</Label>
                <Input required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 block">Address line 1</Label>
                <Input required value={form.line1} onChange={(e) => set("line1", e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 block">Address line 2</Label>
                <Input value={form.line2 ?? ""} onChange={(e) => set("line2", e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="mb-1.5 block">City</Label>
                  <Input required value={form.city} onChange={(e) => set("city", e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1.5 block">State</Label>
                  <Input required value={form.state} onChange={(e) => set("state", e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1.5 block">PIN</Label>
                  <Input required value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => set("isDefault", e.target.checked)}
                  className="size-4 accent-current"
                />
                Set as default address
              </label>
              <Button type="submit" variant="hero" className="w-full">
                Save address
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-10 text-center shadow-soft">
          <MapPin className="mx-auto size-12 text-muted-foreground" />
          <p className="mt-4 font-medium">No saved addresses</p>
          <p className="mt-1 text-sm text-muted-foreground">Add one to speed up checkout.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {a.label}
                  {a.isDefault && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-medium text-gold">
                      <Star className="size-3" /> Default
                    </span>
                  )}
                </p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setForm(a); setOpen(true); }} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => persist(list.filter((x) => x.id !== a.id))}
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm">{a.fullName} · {a.phone}</p>
              <p className="mt-1 text-sm text-muted-foreground">{formatAddress(a)}</p>
              {!a.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => persist(list.map((x) => ({ ...x, isDefault: x.id === a.id })))}
                >
                  Make default
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
