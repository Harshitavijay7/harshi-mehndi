import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { fetchMyBookings } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/account/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — HARSHI'S Mehndi Art" },
      { name: "description", content: "View your mehndi appointment bookings and their status." },
    ],
  }),
  component: MyBookings,
});

function MyBookings() {
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["my-bookings"], queryFn: fetchMyBookings });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card p-10 text-center shadow-soft">
          <CalendarDays className="mx-auto size-12 text-muted-foreground" />
          <p className="mt-4 font-medium">No bookings yet</p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/booking">Book an appointment</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold capitalize">{b.event_type ?? "Mehndi service"}</p>
                  <p className="text-sm text-muted-foreground">
                    {b.event_date ? new Date(b.event_date).toLocaleDateString("en-IN") : "Date TBC"}
                    {b.time_slot ? ` · ${b.time_slot}` : ""}
                  </p>
                </div>
                <StatusBadge status={b.status ?? "pending"} />
              </div>
              {b.requirements && <p className="mt-3 text-sm text-muted-foreground">{b.requirements}</p>}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
