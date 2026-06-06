import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Phone } from "lucide-react";
import { brand, telLink, whatsappLink } from "@/data/brand";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/store", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="font-serif text-2xl font-bold">HARSHI'S</div>
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Mehndi Art</div>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/75">
            Turning every occasion into beautiful memories with stunning, intricate mehndi designs —
            bridal, Arabic, royal and festival artistry using 100% natural henna.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-gold hover:text-gold-foreground"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-gold hover:text-gold-foreground"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-4" />
            </a>
            <a
              href={telLink()}
              className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-gold hover:text-gold-foreground"
              aria-label="Call"
            >
              <Phone className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg text-gold">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-gold">Get In Touch</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
            <li>
              <a href={telLink()} className="transition-colors hover:text-gold">
                Phone: {brand.phone}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">
                WhatsApp: {brand.phone}
              </a>
            </li>
            <li>
              <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">
                Instagram: {brand.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/70">
        © 2026 HARSHI'S Mehndi Art. All Rights Reserved.
      </div>
    </footer>
  );
}
