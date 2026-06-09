import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Download, Check, X, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllBookings, updateBookingStatus } from "@/lib/db";
import { exportToCsv } from "@/lib/adminUtils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const qc = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchAllBookings });
  const [search, setSearch] = useState("");

  const mut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingStatus(id, status),
    onSuccess: () => { toast.success("Booking updated"); qc.invalidateQueries({ queryKey: ["admin-bookings"] }); },
    onError: () => toast.error("Update failed"),
  });

  const filtered = useMemo(() =>
    bookings.filter((b) => {
      const s = search.toLowerCase();
      return b.full_name?.toLowerCase().includes(s) || b.phone?.toLowerCase().includes(s) || b.event_type?.toLowerCase().includes(s);
    }), [bookings, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings..." className="pl-9" />
        </div>
        <Button variant="outline" onClick={() => exportToCsv("bookings", filtered.map((b) => ({
          name: b.full_name, phone: b.phone, event: b.event_type, date: b.event_date,
          slot: b.time_slot, address: b.address, status: b.status,
        })))}>
          <Download className="size-4" /> Export
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Event</th>
              <th className="p-3">Date</th>
              <th className="p-3">Address</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/60"><td className="p-3" colSpan={8}><Skeleton className="h-9 w-full" /></td></tr>
                ))
              : filtered.map((b) => (
                  <tr key={b.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="p-3 font-medium">{b.full_name}</td>
                    <td className="p-3 text-muted-foreground">{b.phone}</td>
                    <td className="p-3 text-muted-foreground">{b.event_type}</td>
                    <td className="p-3 text-muted-foreground">{b.event_date}<br /><span className="text-xs">{b.time_slot}</span></td>
                    <td className="p-3 max-w-[160px] truncate text-muted-foreground">{b.address ?? "—"}</td>
                    <td className="p-3 max-w-[160px] truncate text-muted-foreground">{b.requirements ?? "—"}</td>
                    <td className="p-3"><StatusBadge status={b.status} kind="booking" /></td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Approve" onClick={() => mut.mutate({ id: b.id, status: "confirmed" })}>
                          <Check className="size-4 text-emerald-600" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Completed" onClick={() => mut.mutate({ id: b.id, status: "completed" })}>
                          <CheckCheck className="size-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Reject" onClick={() => mut.mutate({ id: b.id, status: "cancelled" })}>
                          <X className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
