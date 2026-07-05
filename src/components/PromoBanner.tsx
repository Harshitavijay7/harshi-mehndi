import { Link } from "@tanstack/react-router";
import { Sparkles, Tag } from "lucide-react";

/**
 * Sitewide promotional banner announcing the current offer.
 * Update PROMO_* below to change the running promotion.
 */
export const PROMO_TITLE = "MEGA SALE — 40% OFF";
export const PROMO_SUBTITLE = "On all mehndi products & supplies. Limited time only!";

export function PromoBanner({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/store"
      className={`group relative flex items-center justify-center gap-2 overflow-hidden bg-gradient-gold px-4 py-2.5 text-center text-sm font-semibold text-white shadow-gold transition-opacity hover:opacity-95 ${className}`}
    >
      <Tag className="size-4 shrink-0" />
      <span className="uppercase tracking-wide">{PROMO_TITLE}</span>
      <span className="hidden font-normal opacity-90 sm:inline">· {PROMO_SUBTITLE}</span>
      <Sparkles className="size-4 shrink-0 animate-pulse" />
    </Link>
  );
}
