import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  fetchProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  type ProductRow,
} from "@/lib/db";
import { resolveProductImage } from "@/lib/productImages";
import { formatINR, exportToCsv } from "@/lib/adminUtils";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsPage,
});

const CATEGORIES = [
  "Mehndi Powder",
  "Mehndi Oil",
  "Cones & Sheets",
  "Aftercare Products",
  "Mehndi Kits",
  "Practice Products",
  "Artist Accessories",
];

function ProductsPage() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProductsAdmin,
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [open, setOpen] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const del = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => { toast.success("Product deleted"); refresh(); },
    onError: () => toast.error("Delete failed (admin only)"),
  });

  const toggle = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ProductRow> }) => updateProduct(id, patch),
    onSuccess: () => refresh(),
    onError: () => toast.error("Update failed (admin only)"),
  });

  const categories = useMemo(() => {
    const set = new Set<string>(CATEGORIES);
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() =>
            exportToCsv("products", filtered.map((p) => ({
              name: p.name, category: p.category, price: p.price, stock: p.stock,
              in_stock: p.in_stock, slug: p.slug,
            })))
          }
        >
          <Download className="size-4" /> Export
        </Button>
        <Button variant="hero" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="size-4" /> Add Product
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Flags</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="p-3" colSpan={7}><Skeleton className="h-10 w-full" /></td>
                  </tr>
                ))
              : filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="p-3">
                      <img src={resolveProductImage(p.image_key)} alt={p.name} className="size-11 rounded-lg object-cover" />
                    </td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.category}</td>
                    <td className="p-3">
                      {p.discount_price != null ? (
                        <div className="flex flex-col leading-tight">
                          <span className="font-semibold text-emerald-600">{formatINR(p.discount_price)}</span>
                          <span className="text-xs text-muted-foreground line-through">{formatINR(p.price)}</span>
                        </div>
                      ) : (
                        formatINR(p.price)
                      )}
                    </td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        p.in_stock && p.stock > 0
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
                      )}>
                        {p.in_stock && p.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          title="Toggle Featured"
                          onClick={() => toggle.mutate({ id: p.id, patch: { featured: !p.featured } })}
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold transition",
                            p.featured ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                          )}
                        >
                          Featured
                        </button>
                        <button
                          type="button"
                          title="Toggle Best Seller"
                          onClick={() => toggle.mutate({ id: p.id, patch: { best_seller: !p.best_seller } })}
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold transition",
                            p.best_seller ? "bg-gold/25 text-gold-foreground" : "bg-muted text-muted-foreground",
                          )}
                        >
                          Best
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setOpen(true); }}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => del.mutate(p.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductDialog
        key={editing?.id ?? "new"}
        open={open}
        onOpenChange={setOpen}
        product={editing}
        onSaved={() => { setOpen(false); refresh(); }}
      />
    </div>
  );
}

function ProductDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: ProductRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? "Mehndi Powder",
    price: String(product?.price ?? ""),
    discount_price: product?.discount_price != null ? String(product.discount_price) : "",
    stock: String(product?.stock ?? ""),
    size: product?.size ?? "",
    image_key: product?.image_key ?? "",
    badge: product?.badge ?? "",
    description: product?.description ?? "",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [bestSeller, setBestSeller] = useState(product?.best_seller ?? false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      set("image_key", url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed (admin only)");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Product name is required");
    if (!form.category) return toast.error("Category is required");
    if (!form.price || Number(form.price) <= 0) return toast.error("Enter a valid price");
    if (form.discount_price && Number(form.discount_price) >= Number(form.price))
      return toast.error("Discount price must be lower than price");
    setBusy(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug:
          (form.slug || form.name)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        category: form.category,
        price: Number(form.price) || 0,
        discount_price: form.discount_price ? Number(form.discount_price) : null,
        stock: Number(form.stock) || 0,
        size: form.size || null,
        image_key: form.image_key || null,
        badge: form.badge || null,
        description: form.description,
        featured,
        best_seller: bestSeller,
        in_stock: (Number(form.stock) || 0) > 0,
      };
      if (product) await updateProduct(product.id, payload);
      else await createProduct(payload as never);
      toast.success(product ? "Product updated successfully" : "Product added successfully");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed (admin only)");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col gap-0 p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-6 py-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label className="mb-1.5 block">Slug (optional)</Label><Input placeholder="auto-generated from name" value={form.slug} onChange={(e) => set("slug", e.target.value)} /></div>

          <div className="sm:col-span-2"><Label className="mb-1.5 block">Name</Label><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><Label className="mb-1.5 block">Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="mb-1.5 block">Size</Label><Input value={form.size} onChange={(e) => set("size", e.target.value)} /></div>
          <div><Label className="mb-1.5 block">Price (₹)</Label><Input type="number" required value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
          <div><Label className="mb-1.5 block">Discount Price (₹)</Label><Input type="number" value={form.discount_price} onChange={(e) => set("discount_price", e.target.value)} /></div>
          <div><Label className="mb-1.5 block">Stock</Label><Input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></div>
          <div><Label className="mb-1.5 block">Badge (e.g. New)</Label><Input value={form.badge} onChange={(e) => set("badge", e.target.value)} /></div>
          <div className="sm:col-span-2 flex items-center gap-6 rounded-xl border border-border bg-muted/30 p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={featured} onCheckedChange={setFeatured} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={bestSeller} onCheckedChange={setBestSeller} /> Best Seller
            </label>
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Product Image</Label>
            <div className="flex items-center gap-3">
              <img src={resolveProductImage(form.image_key)} alt="preview" className="size-16 rounded-lg object-cover border border-border" />
              <div className="flex-1">
                <Input type="file" accept="image/*" disabled={uploading} onChange={(e) => onUpload(e.target.files?.[0])} />
                <p className="mt-1 text-xs text-muted-foreground">
                  {uploading ? "Uploading..." : "Upload a file, or enter an image key/URL below."}
                </p>
              </div>
            </div>
            <Input className="mt-2" placeholder="cones.jpg or https://..." value={form.image_key} onChange={(e) => set("image_key", e.target.value)} />
          </div>
          <div className="sm:col-span-2"><Label className="mb-1.5 block">Description</Label><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          </div>
          <DialogFooter className="sticky bottom-0 flex-row justify-end gap-2 border-t border-border bg-background px-6 py-4">
            <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="hero" className="flex-1 sm:flex-none" disabled={busy || uploading}>
              {busy ? "Saving..." : product ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
