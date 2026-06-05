import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

const cols = [
  { title: "Company", links: ["About Us", "Shop", "Services", "Contact"] },
  { title: "Support", links: ["FAQ", "Privacy Policy", "Terms & Conditions", "Refund Policy"] },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl font-bold">HARSHI'S</div>
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Mehndi Art</div>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/75">
            Transforming hands into masterpieces. Premium, 100% natural mehndi products and
            professional artistry for weddings, festivals and every celebration.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Youtube, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-gold hover:text-gold-foreground"
                aria-label="Social link"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-serif text-lg text-gold">{c.title}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
              {c.links.map((l) => (
                <li key={l}>
                  <Link to="/contact" className="transition-colors hover:text-gold">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/70">
        © 2026 HARSHI'S Mehndi Art. All Rights Reserved.
      </div>
    </footer>
  );
}
