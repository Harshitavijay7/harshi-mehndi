import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  getCoupons,
  upsertCoupon,
  deleteCoupon,
  type Coupon,
} from "@/lib/adminStore";
import { formatINR } from "@/lib/adminUtils";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  component: CouponsPage,
});

function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(() => getCoupons());
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [open, setOpen] = useState(false);

  const remove = (id: string) => {
    setCoupons(deleteCoupon(id));
    toast.success("Coupon deleted");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage discount codes for your store.
        </p>
        <Button variant="hero" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="size-4" /> New Coupon
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">Expires</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-border/60 hover:bg-muted/30">
                <td className="p-3">
                  <span className="inline-flex items-center gap-1.5 font-mono font-semibold">
                    <Tag className="size-3.5 text-primary" /> {c.code}
                  </span>
                </td>
                <td className="p-3">{c.type === "percent" ? `${c.value}%` : formatINR(c.value)}</td>
                <td className="p-3 text-muted-foreground">{c.minOrder ? formatINR(c.minOrder) : "—"}</td>
                <td className="p-3 text-muted-foreground">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "No expiry"}</td>
                <td className="p-3">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    c.active
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-muted text-muted-foreground",
                  )}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setOpen(true); }}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No coupons yet. Create your first discount code.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <CouponDialog
        key={editing?.id ?? "new"}
        open={open}
        onOpenChange={setOpen}
        coupon={editing}
        onSaved={(list) => { setCoupons(list); setOpen(false); }}
      />
    </div>
  );
}

function CouponDialog({
  open,
  onOpenChange,
  coupon,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  coupon: Coupon | null;
  onSaved: (list: Coupon[]) => void;
}) {
  const [code, setCode] = useState(coupon?.code ?? "");
  const [type, setType] = useState<Coupon["type"]>(coupon?.type ?? "percent");
  const [value, setValue] = useState(String(coupon?.value ?? ""));
  const [minOrder, setMinOrder] = useState(String(coupon?.minOrder ?? ""));
  const [expiresAt, setExpiresAt] = useState(coupon?.expiresAt?.slice(0, 10) ?? "");
  const [active, setActive] = useState(coupon?.active ?? true);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) {
      toast.error("Code and value are required");
      return;
    }
    const list = upsertCoupon({
      id: coupon?.id,
      code: code.trim(),
      type,
      value: Number(value) || 0,
      minOrder: Number(minOrder) || 0,
      active,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
    toast.success(coupon ? "Coupon updated" : "Coupon created");
    onSaved(list);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "New Coupon"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="FESTIVE40" required />
          </div>
          <div>
            <Label className="mb-1.5 block">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as Coupon["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percentage (%)</SelectItem>
                <SelectItem value="flat">Flat (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">Value</Label>
            <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Min Order (₹)</Label>
            <Input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Expires</Label>
            <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
          <label className="sm:col-span-2 flex items-center gap-2 text-sm font-medium">
            <Switch checked={active} onCheckedChange={setActive} /> Active
          </label>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="hero">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
