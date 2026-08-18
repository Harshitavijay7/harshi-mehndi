export const brand = {
  name: "HARSHI'S Mehndi Art",
  domain: "harshismehndi.com",
  phone: "+91 9427019910",
  phoneRaw: "919427019910",
  instagram: "@harrshimehndiart",
  instagramUrl: "https://www.instagram.com/harrshimehndiart/",
  upiId: "harshitalalwani678@oksbi",
  whatsappMessage: "Hello HARSHI'S Mehndi Art, I would like to book a mehndi appointment.",
};

// Shipping policy: deliver all over India, COD available.
export const shipping = {
  flatRate: 50,
  freeAbove: 800,
};

/** Shipping charge for a given order subtotal (after discount). */
export function shippingFor(amount: number): number {
  if (amount <= 0) return 0;
  return amount >= shipping.freeAbove ? 0 : shipping.flatRate;
}

/** Build a UPI payment deep link for the given amount. */
export function upiLink(amount: number): string {
  const params = new URLSearchParams({
    pa: brand.upiId,
    pn: brand.name,
    am: String(amount),
    cu: "INR",
    tn: "Order Payment",
  });
  return `upi://pay?${params.toString()}`;
}

/** QR code image URL encoding the UPI payment link. */
export function upiQrUrl(amount: number, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiLink(amount))}`;
}

export function whatsappLink(message: string = brand.whatsappMessage) {
  return `https://wa.me/${brand.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function whatsappOrderLink(productName: string) {
  return whatsappLink(
    `Hello HARSHI'S Mehndi Art, I would like to order ${productName}. Please share payment and delivery details.`,
  );
}

export function telLink() {
  return `tel:${brand.phoneRaw}`;
}
