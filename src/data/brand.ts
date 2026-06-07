export const brand = {
  name: "HARSHI'S Mehndi Art",
  phone: "+91 9427019910",
  phoneRaw: "919427019910",
  instagram: "@harshiis._.art_",
  instagramUrl: "https://www.instagram.com/harshiis._.art_/",
  whatsappMessage: "Hello HARSHI'S Mehndi Art, I would like to book a mehndi appointment.",
};

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
