// Customer Account Center helpers.
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type { BookingRecord } from "@/lib/db";
import type { BookingRecord } from "@/lib/db";
export type BookingRow = BookingRecord;
export type OrderRow = Tables<"orders">;
export type ProfileRow = Tables<"profiles">;

export async function fetchMyBookings(): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BookingRow[];
}

export async function fetchMyProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateMyProfile(
  userId: string,
  payload: { full_name?: string | null; phone?: string | null },
) {
  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId);
  if (error) throw error;
}

// ===================== SAVED ADDRESSES =====================
// Stored per-user in the browser (no addresses table in the database yet).

export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const addrKey = (uid: string) => `harshi_addresses_${uid}`;

export function loadAddresses(uid: string): Address[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(addrKey(uid)) ?? "[]") as Address[];
  } catch {
    return [];
  }
}

export function saveAddresses(uid: string, list: Address[]) {
  localStorage.setItem(addrKey(uid), JSON.stringify(list));
}

export function formatAddress(a: Address) {
  return [a.line1, a.line2, `${a.city}, ${a.state} ${a.pincode}`]
    .filter(Boolean)
    .join(", ");
}

// ===================== AVATAR =====================
// Small square data URL kept per user in the browser.

const avatarKey = (uid: string) => `harshi_avatar_${uid}`;

export function loadAvatar(uid: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(avatarKey(uid));
}

export function saveAvatar(uid: string, dataUrl: string) {
  localStorage.setItem(avatarKey(uid), dataUrl);
  window.dispatchEvent(new Event("harshi-avatar"));
}

export function clearAvatar(uid: string) {
  localStorage.removeItem(avatarKey(uid));
  window.dispatchEvent(new Event("harshi-avatar"));
}

/** Resize an image file to a 256px square data URL. */
export function fileToAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load the image."));
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable."));
        const min = Math.min(img.width, img.height);
        ctx.drawImage(
          img,
          (img.width - min) / 2,
          (img.height - min) / 2,
          min,
          min,
          0,
          0,
          size,
          size,
        );
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const currency = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
