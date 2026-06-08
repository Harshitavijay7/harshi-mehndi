import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import {
  fetchProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllOrders,
  updateOrderStatus,
  fetchAllBookings,
  updateBookingStatus,
  fetchCustomers,
  type ProductRow,
} from "@/lib/db";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

function AdminPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Manage products, orders, bookings and customers.</p>

      <Tabs defaultValue="products" className="mt-8">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="products"><ProductsAdmin /></TabsContent>
        <TabsContent value="orders"><OrdersAdmin /></TabsContent>
        <TabsContent value="bookings"><BookingsAdmin /></TabsContent>
        <TabsContent value="customers"><CustomersAdmin /></TabsContent>
      </Tabs>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex justify-center py-16 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
}

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: fetchProductsAdmin });
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const del = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => { toast.success("Product deleted"); refresh(); },
    onError: () => toast.error("Delete failed (admin only)"),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <Button variant="hero" size="sm" onClick={() => { setEditing(null); setCreating(true); }}>
          <Plus className="size-4" /> New Product
        </Button>
      </div>

      {(creating || editing) && (
        <ProductForm
          product={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); refresh(); }}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/70">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.category}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setCreating(false); setEditing(p); }}>Edit</Button>
                    <Button variant="ghost" size="icon" onClick={() => del.mutate(p.id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }: { product: ProductRow | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? "Mehndi Powder",
    price: String(product?.price ?? ""),
    stock: String(product?.stock ?? ""),
    size: product?.size ?? "",
    image_key: product?.image_key ?? "",
    description: product?.description ?? "",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: form.category,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        size: form.size || null,
        image_key: form.image_key || null,
        description: form.description,
        in_stock: (Number(form.stock) || 0) > 0,
      };
      if (product) await updateProduct(product.id, payload);
      else await createProduct(payload as never);
      toast.success(product ? "Product updated" : "Product created");
      onSaved();
    } catch (err) {
      toast.error("Save failed (admin only)");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-soft sm:grid-cols-2">
      <div><Label className="mb-1.5 block">Name</Label><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
      <div><Label className="mb-1.5 block">Slug</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" /></div>
      <div><Label className="mb-1.5 block">Category</Label><Input value={form.category} onChange={(e) => set("category", e.target.value)} /></div>
      <div><Label className="mb-1.5 block">Size</Label><Input value={form.size} onChange={(e) => set("size", e.target.value)} /></div>
      <div><Label className="mb-1.5 block">Price (₹)</Label><Input type="number" required value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
      <div><Label className="mb-1.5 block">Stock</Label><Input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></div>
      <div className="sm:col-span-2"><Label className="mb-1.5 block">Image key (e.g. cones.jpg)</Label><Input value={form.image_key} onChange={(e) => set("image_key", e.target.value)} /></div>
      <div className="sm:col-span-2"><Label className="mb-1.5 block">Description</Label><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" variant="hero" disabled={busy}>{busy ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

function OrdersAdmin() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });
  const mut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => { toast.success("Order updated"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); },
    onError: () => toast.error("Update failed"),
  });
  if (isLoading) return <Loading />;
  if (orders.length === 0) return <p className="py-16 text-center text-muted-foreground">No orders yet.</p>;
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-border/70">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr><th className="p-3">Customer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Date</th><th className="p-3">Status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-border/60">
              <td className="p-3 font-medium">{o.customer_name}<br /><span className="text-xs text-muted-foreground">{o.customer_email}</span></td>
              <td className="p-3 text-muted-foreground">{Array.isArray(o.items) ? (o.items as unknown[]).length : 0}</td>
              <td className="p-3">₹{o.total}</td>
              <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
              <td className="p-3">
                <select value={o.status} onChange={(e) => mut.mutate({ id: o.id, status: e.target.value })}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookingsAdmin() {
  const qc = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchAllBookings });
  const mut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingStatus(id, status),
    onSuccess: () => { toast.success("Booking updated"); qc.invalidateQueries({ queryKey: ["admin-bookings"] }); },
    onError: () => toast.error("Update failed"),
  });
  if (isLoading) return <Loading />;
  if (bookings.length === 0) return <p className="py-16 text-center text-muted-foreground">No bookings yet.</p>;
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-border/70">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Event</th><th className="p-3">Date</th><th className="p-3">Slot</th><th className="p-3">Status</th></tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t border-border/60">
              <td className="p-3 font-medium">{b.full_name}</td>
              <td className="p-3 text-muted-foreground">{b.phone}</td>
              <td className="p-3 text-muted-foreground">{b.event_type}</td>
              <td className="p-3 text-muted-foreground">{b.event_date}</td>
              <td className="p-3 text-muted-foreground">{b.time_slot}</td>
              <td className="p-3">
                <select value={b.status} onChange={(e) => mut.mutate({ id: b.id, status: e.target.value })}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                  {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomersAdmin() {
  const { data: customers = [], isLoading } = useQuery({ queryKey: ["admin-customers"], queryFn: fetchCustomers });
  if (isLoading) return <Loading />;
  if (customers.length === 0) return <p className="py-16 text-center text-muted-foreground">No customers yet.</p>;
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-border/70">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Joined</th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-t border-border/60">
              <td className="p-3 font-medium">{c.full_name ?? "—"}</td>
              <td className="p-3 text-muted-foreground">{c.email ?? "—"}</td>
              <td className="p-3 text-muted-foreground">{c.phone ?? "—"}</td>
              <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
