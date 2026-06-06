export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  ingredients: string;
  badge?: string;
  bestSeller?: boolean;
};

export const productCategories = [
  "Mehndi Powder",
  "Mehndi Oils",
  "Mehndi Cones",
  "Packaging Supplies",
  "Accessories",
  "Combo Packs",
] as const;

export const products: Product[] = [
  { id: "p1", name: "Premium Organic Mehndi Powder", category: "Mehndi Powder", price: 499, discountPrice: 349, rating: 4.9, reviews: 218, inStock: true, badge: "Best Seller", bestSeller: true, description: "Triple-sifted, ultra-fine organic henna powder for the deepest, richest stain. Perfect for bridal and intricate work.", ingredients: "100% Lawsonia Inermis (henna leaves), no chemicals, no PPD." },
  { id: "p2", name: "Natural Mehndi Powder", category: "Mehndi Powder", price: 299, discountPrice: 199, rating: 4.7, reviews: 142, inStock: true, bestSeller: true, description: "Farm-fresh natural mehndi powder ideal for everyday designs and festivals.", ingredients: "100% pure henna leaf powder." },
  { id: "p3", name: "Rajasthani Mehndi Powder", category: "Mehndi Powder", price: 399, discountPrice: 299, rating: 4.8, reviews: 96, inStock: true, description: "Authentic Sojat Rajasthani henna known for its rich maroon stain.", ingredients: "Sojat-grown henna leaves, naturally dried." },
  { id: "p4", name: "Herbal Mehndi Powder", category: "Mehndi Powder", price: 349, rating: 4.6, reviews: 64, inStock: true, description: "Henna blended with amla, shikakai & bhringraj for hair & skin care.", ingredients: "Henna, amla, shikakai, bhringraj." },

  { id: "p5", name: "Mehndi Essential Oil", category: "Mehndi Oils", price: 249, discountPrice: 179, rating: 4.8, reviews: 130, inStock: true, badge: "Popular", bestSeller: true, description: "Signature terpene blend that darkens henna stain beautifully.", ingredients: "Eucalyptus, cajeput, lavender essential oils." },
  { id: "p6", name: "Eucalyptus Oil", category: "Mehndi Oils", price: 199, rating: 4.7, reviews: 88, inStock: true, description: "Pure eucalyptus oil to deepen and set your mehndi stain.", ingredients: "100% steam-distilled eucalyptus oil." },
  { id: "p7", name: "Clove Oil", category: "Mehndi Oils", price: 219, rating: 4.6, reviews: 54, inStock: true, description: "Aromatic clove oil for enhanced stain longevity.", ingredients: "100% pure clove bud oil." },
  { id: "p8", name: "Premium Aftercare Oil", category: "Mehndi Oils", price: 269, discountPrice: 219, rating: 4.9, reviews: 72, inStock: true, description: "Nourishing aftercare oil to protect and darken your design.", ingredients: "Mustard, eucalyptus & tea tree oil blend." },

  { id: "p9", name: "Pre-Rolled Mehndi Cones (12 Pack)", category: "Mehndi Cones", price: 399, discountPrice: 299, rating: 4.9, reviews: 305, inStock: true, badge: "Best Seller", bestSeller: true, description: "Ready-to-use natural henna cones with a fine tip for crisp lines.", ingredients: "Organic henna paste, essential oils." },
  { id: "p10", name: "Handmade Mehndi Cones (6 Pack)", category: "Mehndi Cones", price: 249, rating: 4.8, reviews: 120, inStock: true, description: "Small-batch handmade cones with consistent flow.", ingredients: "Organic henna, sugar, lemon, oils." },
  { id: "p11", name: "Professional Artist Cones (24 Pack)", category: "Mehndi Cones", price: 749, discountPrice: 599, rating: 4.9, reviews: 88, inStock: true, description: "Bulk professional cones for artists & events.", ingredients: "Premium organic henna paste." },
  { id: "p12", name: "Jumbo Cones (4 Pack)", category: "Mehndi Cones", price: 329, rating: 4.5, reviews: 41, inStock: false, description: "Extra-large cones for big designs and full-arm work.", ingredients: "Organic henna paste." },

  { id: "p13", name: "Cellophane Sheets (Roll)", category: "Packaging Supplies", price: 149, rating: 4.6, reviews: 33, inStock: true, description: "Food-grade cellophane for rolling perfect cones.", ingredients: "BOPP cellophane film." },
  { id: "p14", name: "Cone Wrapping Sheets (200 pcs)", category: "Packaging Supplies", price: 199, discountPrice: 159, rating: 4.7, reviews: 27, inStock: true, description: "Pre-cut sheets sized for fast cone rolling.", ingredients: "Polyester film sheets." },
  { id: "p15", name: "Packaging Bags (100 pcs)", category: "Packaging Supplies", price: 179, rating: 4.5, reviews: 19, inStock: true, description: "Branded-ready zip bags for your henna products.", ingredients: "Resealable LDPE bags." },
  { id: "p16", name: "Storage Pouches (50 pcs)", category: "Packaging Supplies", price: 129, rating: 4.4, reviews: 15, inStock: true, description: "Airtight pouches to keep cones fresh longer.", ingredients: "Multilayer aluminium pouches." },

  { id: "p17", name: "Applicator Bottles (Set of 5)", category: "Accessories", price: 199, discountPrice: 149, rating: 4.7, reviews: 61, inStock: true, description: "Fine-tip applicator bottles for gel & jagua work.", ingredients: "Food-grade plastic, metal tips." },
  { id: "p18", name: "Design Stencils (30 pcs)", category: "Accessories", price: 249, rating: 4.6, reviews: 44, inStock: true, description: "Reusable stencils for quick, clean designs.", ingredients: "Flexible PVC stencils." },
  { id: "p19", name: "Practice Sheets (Pad)", category: "Accessories", price: 99, rating: 4.5, reviews: 38, inStock: true, description: "Hand-printed practice sheets for beginners.", ingredients: "Printed paper pad." },
  { id: "p20", name: "Glitter Mehndi Kit", category: "Accessories", price: 449, discountPrice: 349, rating: 4.8, reviews: 57, inStock: true, badge: "New", description: "Multi-colour cosmetic glitter & glue for festive accents.", ingredients: "Cosmetic glitter, skin-safe glue." },
  { id: "p21", name: "Jagua Gel Kit", category: "Accessories", price: 599, rating: 4.7, reviews: 36, inStock: true, description: "Natural jagua gel for a blue-black temporary tattoo look.", ingredients: "Genipa Americana fruit extract." },

  { id: "p22", name: "Beginner Kit", category: "Combo Packs", price: 899, discountPrice: 699, rating: 4.8, reviews: 110, inStock: true, badge: "Value", bestSeller: true, description: "Everything a new artist needs: powder, cones, oil & practice sheets.", ingredients: "Henna powder, 6 cones, essential oil, sheets." },
  { id: "p23", name: "Professional Artist Kit", category: "Combo Packs", price: 1999, discountPrice: 1599, rating: 4.9, reviews: 78, inStock: true, badge: "Best Seller", bestSeller: true, description: "Pro-grade bundle for working artists and studios.", ingredients: "Powder, 24 cones, oils, stencils, applicators." },
  { id: "p24", name: "Bridal Artist Kit", category: "Combo Packs", price: 2499, discountPrice: 1999, rating: 5.0, reviews: 52, inStock: true, description: "Premium bridal essentials for flawless, long-lasting stains.", ingredients: "Organic powder, premium cones, aftercare oil, glitter." },
  { id: "p25", name: "Festival Special Kit", category: "Combo Packs", price: 1199, discountPrice: 899, rating: 4.7, reviews: 40, inStock: true, description: "Festive bundle with glitter, cones and quick stencils.", ingredients: "Cones, glitter kit, stencils, oil." },
];

export const serviceCategories = [
  { id: "s1", title: "Bridal Mehndi", price: "₹8,000", desc: "Full hand bridal designs & custom bridal packages with premium organic henna.", tag: "Most Loved" },
  { id: "s2", title: "Arabic Mehndi", price: "₹1,500", desc: "Stylish Arabic patterns and modern flowing designs.", tag: "Trending" },
  { id: "s3", title: "Engagement Mehndi", price: "₹3,500", desc: "Elegant front & back hand designs for your special day.", tag: "Packages" },
  { id: "s4", title: "Baby Shower Mehndi", price: "₹2,500", desc: "Soft, joyful designs to celebrate your godh bharai.", tag: "Celebration" },
  { id: "s5", title: "Festival Mehndi", price: "₹500 / hand", desc: "Quick, beautiful designs for Eid, Diwali, Teej & more.", tag: "Per Hand" },
  { id: "s6", title: "Karwa Chauth Mehndi", price: "₹800 / hand", desc: "Traditional Karwa Chauth designs with your partner's name hidden in the art.", tag: "Festive" },
  { id: "s7", title: "Diwali Mehndi", price: "₹600 / hand", desc: "Festive diya, rangoli & floral motifs for the festival of lights.", tag: "Festive" },
  { id: "s8", title: "Event & Group Booking", price: "Custom", desc: "Bulk artist booking for parties, sangeet & corporate events.", tag: "Bulk Booking" },
  { id: "s9", title: "Home Service Mehndi", price: "On request", desc: "We come to you — choose your location, date and time slot.", tag: "At Home" },
];

export const homeCategories = [
  { name: "Bridal Mehndi", emoji: "💍" },
  { name: "Arabic Mehndi", emoji: "🌙" },
  { name: "Royal Mehndi", emoji: "👑" },
  { name: "Traditional Mehndi", emoji: "🪔" },
  { name: "Festival Mehndi", emoji: "✨" },
  { name: "Engagement Mehndi", emoji: "💛" },
];

export const testimonials = [
  { name: "Ananya Sharma", text: "My bridal mehndi was absolutely stunning! The colour came out so dark and the design was breathtaking.", role: "Bride" },
  { name: "Priya Verma", text: "The organic powder gives the richest stain I've ever had. I order it for my whole studio now.", role: "Mehndi Artist" },
  { name: "Riya Patel", text: "Fast delivery, premium quality cones. HARSHI'S is my go-to for every festival.", role: "Customer" },
  { name: "Sneha Gupta", text: "Booked home service for Karva Chauth — punctual, professional and so talented!", role: "Customer" },
];
