// Shared helpers for the admin dashboard.

export function formatINR(amount: number | string | null | undefined): string {
  const n = Number(amount ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const s = val == null ? "" : String(val);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export type StatusTone = "yellow" | "blue" | "purple" | "green" | "red" | "gray";

export const ORDER_STATUSES: { value: string; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const ORDER_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  ORDER_STATUSES.map((s) => [s.value, s.label]),
);

export const ORDER_STATUS_TONE: Record<string, StatusTone> = {
  pending: "yellow",
  confirmed: "blue",
  processing: "blue",
  preparing: "blue",
  packed: "purple",
  shipped: "purple",
  out_for_delivery: "purple",
  delivered: "green",
  completed: "green",
  cancelled: "red",
};


export const BOOKING_STATUS_TONE: Record<string, StatusTone> = {
  pending: "yellow",
  confirmed: "blue",
  approved: "blue",
  completed: "green",
  cancelled: "red",
  rejected: "red",
};

export const TONE_CLASSES: Record<StatusTone, string> = {
  yellow: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300",
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  red: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
  gray: "bg-muted text-muted-foreground",
};
