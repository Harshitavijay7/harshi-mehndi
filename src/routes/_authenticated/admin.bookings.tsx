import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllBookings, updateBookingStatus } from "@/lib/db";
import { exportToCsv, BOOKING_STATUSES } from "@/lib/adminUtils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const qc = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchAllBookings });
  const [search, setSearch] = useState("");

  const mut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-bookings"] }); qc.invalidateQueries({ queryKey: ["my-bookings"] }); },
    onError: () => toast.error("Update failed"),
  });

  const accept = (id: string) => {
    if (!window.confirm("Accept this booking?\nThe customer will be notified that their appointment is confirmed.")) return;
    mut.mutate({ id, status: "confirmed" }, { onSuccess: () => toast.success("Booking accepted successfully.") });
  };

  const filtered = useMemo(() =>
    bookings.filter((b) => {
      const s = search.toLowerCase();
      return b.full_name?.toLowerCase().includes(s) || b.phone?.toLowerCase().includes(s) || b.service?.toLowerCase().includes(s);
    }), [bookings, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings..." className="pl-9" />
        </div>
        <Button variant="outline" onClick={() => exportToCsv("bookings", filtered.map((b) => ({
          id: b.id, name: b.full_name, phone: b.phone, email: b.email, service: b.service, date: b.event_date,
          slot: b.time_slot, location: b.location, special_requirements: b.special_requirements,
          status: b.status, created_at: b.created_at,
        })))}>
          <Download className="size-4" /> Export
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Service</th>
              <th className="p-3">Event date</th>
              <th className="p-3">Time slot</th>
              <th className="p-3">Location</th>
              <th className="p-3">Special requirements</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border/60"><td className="p-3" colSpan={12}><Skeleton className="h-9 w-full" /></td></tr>
                ))
              : filtered.map((b) => (
                  <tr key={b.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs text-muted-foreground">#{b.id.slice(0, 8)}</td>
                    <td className="p-3 font-medium">{b.full_name}</td>
                    <td className="p-3 text-muted-foreground">{b.phone}</td>
                    <td className="p-3 text-muted-foreground">{b.email ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{b.service ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{b.event_date ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{b.time_slot ?? "—"}</td>
                    <td className="p-3 max-w-[160px] truncate text-muted-foreground">{b.location ?? "—"}</td>
                    <td className="p-3 max-w-[180px] truncate text-muted-foreground">{b.special_requirements ?? "—"}</td>
                    <td className="p-3"><StatusBadge status={b.status} kind="booking" /></td>
                    <td className="p-3 text-muted-foreground">{new Date(b.created_at).toLocaleDateString("en-IN")}</td>
                    <td className="p-3">
                      <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row sm:items-center">
                        {b.status?.toLowerCase() === "pending" && (
                          <Button size="sm" onClick={() => accept(b.id)} disabled={mut.isPending}>
                            <Check className="size-4" /> Accept
                          </Button>
                        )}
                        <Select
                          value={BOOKING_STATUSES.some((s) => s.value === b.status) ? b.status : undefined}
                          onValueChange={(v) =>
                            mut.mutate({ id: b.id, status: v }, { onSuccess: () => toast.success("Booking updated") })
                          }
                        >
                          <SelectTrigger className="h-9 w-full sm:w-[160px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            {BOOKING_STATUSES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={12} className="p-10 text-center text-muted-foreground">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
