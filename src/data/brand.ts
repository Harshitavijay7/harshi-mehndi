export const brand = {
  name: "HARSHI'S Mehndi Art",
  phone: "+91 9427019910",
  phoneRaw: "919427019910",
  instagram: "@harshiis..art.",
  instagramUrl: "https://instagram.com/harshiis..art.",
  whatsappMessage: "Hello HARSHI'S Mehndi Art, I would like to book a mehndi appointment.",
};

export function whatsappLink(message: string = brand.whatsappMessage) {
  return `https://wa.me/${brand.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  return `tel:${brand.phoneRaw}`;
}
