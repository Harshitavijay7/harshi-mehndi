import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/brand";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="size-7" />
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#25D366] opacity-30" />
    </a>
  );
}
