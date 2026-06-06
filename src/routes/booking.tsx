import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { serviceCategories } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { brand, whatsappLink } from "@/data/brand";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Mehndi Artist — HARSHI'S Mehndi Art" },
      { name: "description", content: "Book a professional mehndi artist for your wedding, festival or event. Pick a date, time slot and design." },
      { property: "og:title", content: "Book a Mehndi Artist — HARSHI'S" },
      { property: "og:description", content: "Book a professional mehndi artist online." },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: Booking,
});

const slots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

function Booking() {
  const [slot, setSlot] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <CheckCircle2 className="size-16 text-secondary" />
        <h1 className="mt-5 text-3xl font-bold">Booking Confirmed!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for booking with HARSHI'S Mehndi Art. We've sent a confirmation and our team will
          call you shortly to finalise the details.
        </p>
        <Button variant="hero" size="lg" className="mt-8" onClick={() => setDone(false)}>
          Make Another Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <CalendarCheck className="mx-auto size-10 text-gold" />
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Book Your Mehndi Artist</h1>
        <p className="mt-3 text-muted-foreground">Fill in the details and we'll handle the rest.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!slot) {
            toast.error("Please select a time slot");
            return;
          }
          setDone(true);
          toast.success("Booking submitted successfully!");
        }}
        className="mt-10 space-y-6 rounded-2xl border border-border/70 bg-card p-6 shadow-soft sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" required>
            <Input required placeholder="Your name" />
          </Field>
          <Field label="Mobile Number" required>
            <Input required type="tel" pattern="[0-9]{10}" placeholder="10-digit number" />
          </Field>
          <Field label="Email">
            <Input type="email" placeholder="you@email.com" />
          </Field>
          <Field label="Event Type" required>
            <select
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              defaultValue=""
            >
              <option value="" disabled>
                Select event
              </option>
              {serviceCategories.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Event Date" required>
            <Input required type="date" />
          </Field>
          <Field label="Number of Guests">
            <Input type="number" min={1} placeholder="e.g. 5" />
          </Field>
        </div>

        <Field label="Address">
          <Input placeholder="Where should we come? (for home service)" />
        </Field>

        <div>
          <Label className="mb-2 block">Preferred Time Slot</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {slots.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSlot(s)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                  slot === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-gold/50",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Field label="Special Requirements">
          <Textarea placeholder="Describe the design style you'd love (Arabic, royal, bridal...) and any special requests" rows={3} />
        </Field>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="hero" size="lg" className="w-full">
            Submit Booking
          </Button>
          <a
            href={whatsappLink(brand.whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-8 text-base font-medium text-white shadow transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-5" /> WhatsApp Booking
          </a>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
