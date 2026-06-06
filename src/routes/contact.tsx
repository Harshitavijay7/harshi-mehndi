import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brand, telLink, whatsappLink } from "@/data/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — HARSHI'S Mehndi Art" },
      { name: "description", content: "Get in touch with HARSHI'S Mehndi Art for bookings, bulk orders and product enquiries." },
      { property: "og:title", content: "Contact — HARSHI'S Mehndi Art" },
      { property: "og:description", content: "Reach out for bookings and product enquiries." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const info = [
  { icon: Phone, label: "Call Us", value: brand.phone, href: telLink() },
  { icon: MessageCircle, label: "WhatsApp", value: brand.phone, href: whatsappLink() },
  { icon: Instagram, label: "Instagram", value: brand.instagram, href: brand.instagramUrl },
  { icon: MapPin, label: "Studio", value: "Gujarat, India", href: undefined },
];

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Get in Touch</span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-muted-foreground">We'd love to help with your celebration.</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {info.map((i) => {
            const Wrapper = (i.href ? "a" : "div") as "a";
            return (
              <Wrapper
                key={i.label}
                {...(i.href ? { href: i.href, target: "_blank", rel: "noreferrer" } : {})}
                className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-colors hover:border-gold/50"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <i.icon className="size-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{i.label}</div>
                  <div className="font-medium">{i.value}</div>
                </div>
              </Wrapper>
            );
          })}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-secondary p-5 font-semibold text-secondary-foreground shadow-soft transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-5" /> Chat with us on WhatsApp
          </a>
          <div className="flex h-56 items-center justify-center rounded-2xl border border-border/70 bg-muted text-muted-foreground">
            <MapPin className="mr-2 size-5" /> Google Maps integration
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent! We'll get back to you soon.");
            (e.target as HTMLFormElement).reset();
          }}
          className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-soft sm:p-8"
        >
          <div>
            <Label className="mb-1.5 block">Name</Label>
            <Input required placeholder="Your name" />
          </div>
          <div>
            <Label className="mb-1.5 block">Email</Label>
            <Input required type="email" placeholder="you@email.com" />
          </div>
          <div>
            <Label className="mb-1.5 block">Phone</Label>
            <Input type="tel" placeholder="Phone number" />
          </div>
          <div>
            <Label className="mb-1.5 block">Message</Label>
            <Textarea required rows={5} placeholder="How can we help?" />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
