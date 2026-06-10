import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, IndianRupee, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fetchAllOrders, getPaymentScreenshotUrl } from "@/lib/db";
import { formatINR, exportToCsv } from "@/lib/adminUtils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsPage,
});

function paymentStatus(status: string) {
  if (status === "cancelled") return "Refunded";
  if (status === "delivered" || status === "shipped") return "Paid";
  return "Pending";
}

async function viewScreenshot(path: string | null | undefined) {
  if (!path) {
    toast.error("No screenshot uploaded for this payment.");
    return;
  }
  const url = await getPaymentScreenshotUrl(path);
  if (url) window.open(url, "_blank");
  else toast.error("Couldn't load screenshot.");
}

const TONE: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  Refunded: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
};

function PaymentsPage() {
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAllOrders });
  const [search, setSearch] = useState("");

  const rows = useMemo(() =>
    orders.map((o) => ({
      id: o.id,
      amount: Number(o.total ?? 0),
      method: o.payment_method ?? "—",
      status: paymentStatus(o.status),
      customer: o.customer_name,
      date: o.created_at,
      txn: (o as { transaction_id?: string | null }).transaction_id ?? "—",
      screenshot: (o as { payment_screenshot_path?: string | null }).payment_screenshot_path ?? null,
    })).filter((r) => r.id.includes(search.toLowerCase()) || r.customer?.toLowerCase().includes(search.toLowerCase())),
  [orders, search]);

  const totalPaid = rows.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);
  const totalPending = rows.filter((r) => r.status === "Pending").reduce((s, r) => s + r.amount, 0);
  const totalRefunded = rows.filter((r) => r.status === "Refunded").reduce((s, r) => s + r.amount, 0);

  const cards = [
    { label: "Collected", value: formatINR(totalPaid), icon: CheckCircle2, accent: "bg-emerald-500/10 text-emerald-600" },
    { label: "Pending", value: formatINR(totalPending), icon: Clock, accent: "bg-amber-500/10 text-amber-600" },
    { label: "Refunded", value: formatINR(totalRefunded), icon: RotateCcw, accent: "bg-rose-500/10 text-rose-600" },
    { label: "Transactions", value: rows.length, icon: IndianRupee, accent: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
              <span className={`flex size-9 items-center justify-center rounded-lg ${c.accent}`}><c.icon className="size-[18px]" /></span>
            </div>
            <p className="mt-3 font-serif text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..." className="pl-9" />
        </div>
        <Button variant="outline" onClick={() => exportToCsv("payments", rows.map((r) => ({
          transaction: r.id, customer: r.customer, amount: r.amount, method: r.method, status: r.status,
        })))}>
          <Download className="size-4" /> Export
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Txn / UTR</th>
              <th className="p-3">Status</th>
              <th className="p-3">Proof</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/60"><td className="p-3" colSpan={8}><Skeleton className="h-9 w-full" /></td></tr>
                ))
              : rows.map((r) => (
                  <tr key={r.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">#{r.id.slice(0, 12)}</td>
                    <td className="p-3 font-medium">{r.customer}</td>
                    <td className="p-3 font-semibold">{formatINR(r.amount)}</td>
                    <td className="p-3 capitalize text-muted-foreground">{r.method}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{r.txn}</td>
                    <td className="p-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", TONE[r.status])}>{r.status}</span>
                    </td>
                    <td className="p-3">
                      {r.screenshot ? (
                        <button onClick={() => viewScreenshot(r.screenshot)} className="text-xs font-medium text-primary underline">View</button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                  </tr>
                ))}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
