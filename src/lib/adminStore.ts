// Client-side persistence for admin-managed coupons and store settings.
// Stored in localStorage because the database migration tool was unavailable
// in this environment. Data is per-browser; move to the database once a
// migration can be applied.

export type Coupon = {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  address: string;
  shippingCharge: number;
  freeShippingAbove: number;
};

const COUPONS_KEY = "admin-coupons";
const SETTINGS_KEY = "admin-store-settings";

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "HARSHI'S Mehndi Art",
  tagline: "Premium henna products & artistry",
  supportEmail: "harshitalalwani678@gmail.com",
  supportPhone: "",
  whatsapp: "",
  address: "",
  shippingCharge: 60,
  freeShippingAbove: 800,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

// ---------------- Coupons ----------------
export function getCoupons(): Coupon[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(COUPONS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveCoupons(list: Coupon[]) {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(list));
}

export function upsertCoupon(input: Omit<Coupon, "id" | "createdAt"> & { id?: string }): Coupon[] {
  const list = getCoupons();
  if (input.id) {
    const idx = list.findIndex((c) => c.id === input.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...input, code: input.code.toUpperCase() };
  } else {
    list.unshift({
      ...input,
      code: input.code.toUpperCase(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
  }
  saveCoupons(list);
  return list;
}

export function deleteCoupon(id: string): Coupon[] {
  const list = getCoupons().filter((c) => c.id !== id);
  saveCoupons(list);
  return list;
}

// ---------------- Store settings ----------------
export function getStoreSettings(): StoreSettings {
  return read<StoreSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveStoreSettings(settings: StoreSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
