// Reusable database service functions for HARSHI'S Mehndi Art.
// All queries run through the RLS-aware Supabase client.
import { supabase } from "@/integrations/supabase/client";
import type { Product, Review } from "@/data/catalog";
import { resolveProductImage } from "@/lib/productImages";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type ProductRow = Tables<"products">;
export type OrderRow = Tables<"orders">;
export type BookingRow = Tables<"bookings">;
export type ProfileRow = Tables<"profiles">;

/** Map a database row to the existing front-end Product shape (UI unchanged). */
export function mapProduct(row: ProductRow): Product & { dbId: string } {
  return {
    dbId: row.id,
    id: row.slug,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    discountPrice: row.discount_price != null ? Number(row.discount_price) : undefined,
    size: row.size ?? undefined,
    rating: Number(row.rating),
    reviews: row.reviews,
    inStock: row.in_stock,
    stock: row.stock,
    description: row.description,
    includes: (row.includes as string[] | null) ?? undefined,
    ingredients: row.ingredients ?? undefined,
    image: resolveProductImage(row.image_key),
    badge: row.badge ?? undefined,
    bestSeller: row.best_seller,
    featured: row.featured,
    customerReviews: (row.customer_reviews as unknown as Review[]) ?? [],
  };
}

// ===================== PRODUCTS =====================
export async function fetchProducts(): Promise<(Product & { dbId: string })[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<(Product & { dbId: string }) | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function fetchProductsAdmin(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createProduct(payload: TablesInsert<"products">) {
  const { data, error } = await supabase.from("products").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, payload: Partial<ProductRow>) {
  const { data, error } = await supabase.from("products").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ===================== ORDERS =====================
export async function createOrder(payload: TablesInsert<"orders">) {
  const { data, error } = await supabase.from("orders").insert(payload).select().single();
  if (error) throw error;
  return data;
}

/** Upload a payment screenshot to the private payments bucket; returns its storage path. */
export async function uploadPaymentScreenshot(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("payments").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

/** Signed URL to view a private payment screenshot (admin use). */
export async function getPaymentScreenshotUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("payments").createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}

export async function fetchMyOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

// ===================== BOOKINGS =====================
/** Live public.bookings schema (generated types can lag behind the database). */
export type BookingRecord = {
  id: string;
  user_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  service: string | null;
  event_date: string | null;
  time_slot: string | null;
  location: string | null;
  special_requirements: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type BookingInsert = {
  user_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  service: string | null;
  event_date: string | null;
  time_slot: string | null;
  location: string | null;
  special_requirements: string | null;
  status: string;
};

export async function createBooking(payload: BookingInsert): Promise<BookingRecord> {
  const { data, error } = await supabase
    .from("bookings")
    .insert(payload as never)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as BookingRecord;
}

export async function fetchAllBookings(): Promise<BookingRecord[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BookingRecord[];
}

export async function updateBookingStatus(id: string, status: string) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}


// ===================== CUSTOMERS =====================
export async function fetchCustomers(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Orders + bookings history for a single customer (admin use). */
export async function fetchCustomerHistory(userId: string, email: string | null) {
  const orders = (await fetchAllOrders()).filter(
    (o) => o.user_id === userId || (!!email && o.customer_email === email),
  );
  const bookings = (await fetchAllBookings()).filter(
    (b) => b.user_id === userId || (!!email && b.email === email),
  );
  return { orders, bookings };
}

/**
 * Upload a product image to the existing private `products` bucket and return a
 * long-lived signed URL. Stored directly in products.image_key so it renders
 * everywhere via resolveProductImage (which returns http(s) URLs as-is).
 */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `catalog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("products").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  // 10 year signed URL so images keep rendering without a public bucket.
  const { data, error: signErr } = await supabase.storage
    .from("products")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !data) throw signErr ?? new Error("Could not sign image URL");
  return data.signedUrl;
}

