import imgPowder from "@/assets/products/mehndi-powder.jpg";
import imgBridalOil from "@/assets/products/bridal-oil.jpg";
import imgAftercareOil from "@/assets/products/aftercare-oil.jpg";
import imgCones from "@/assets/products/cones.jpg";
import imgCellophane from "@/assets/products/cellophane.jpg";
import imgBalm from "@/assets/products/balm.jpg";
import imgAftercareCombo from "@/assets/products/aftercare-combo.jpg";
import imgBeginnerKit from "@/assets/products/beginner-kit.jpg";
import imgCareKit from "@/assets/products/care-kit.jpg";
import imgSmallSpatula from "@/assets/products/small-spatula.jpg";
import imgLargeSpatula from "@/assets/products/large-spatula.jpg";
import imgStockingSet from "@/assets/products/stocking-set.jpg";
import imgCushion from "@/assets/products/cushion.jpg";

export type Review = {
  name: string;
  rating: number;
  text: string;
  date: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  size?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
  description: string;
  includes?: string[];
  ingredients?: string;
  image: string;
  badge?: string;
  bestSeller?: boolean;
  featured?: boolean;
  customerReviews: Review[];
};

export const productCategories = [
  "Mehndi Essentials",
  "Aftercare Products",
  "Mehndi Kits",
  "Professional Accessories",
  "Artist Comfort Products",
] as const;

const baseReviews: Review[] = [
  { name: "Ananya S.", rating: 5, text: "Excellent quality, exactly as described. Will order again!", date: "2026-04-12" },
  { name: "Priya V.", rating: 5, text: "Loved it. Fast delivery and premium packaging.", date: "2026-03-28" },
  { name: "Riya P.", rating: 4, text: "Very good value for money. Highly recommend.", date: "2026-03-05" },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "premium-mehndi-powder",
    name: "HARSHI'S Premium Mehndi Powder",
    category: "Mehndi Essentials",
    price: 400,
    size: "1 KG",
    rating: 4.9,
    reviews: 218,
    inStock: true,
    stock: 60,
    badge: "Best Seller",
    bestSeller: true,
    featured: true,
    description:
      "Premium-quality natural mehndi powder with smooth texture and excellent staining properties for professional use. Triple-sifted for the deepest, richest stain — perfect for bridal and intricate work.",
    ingredients: "100% Lawsonia Inermis (henna leaves), no chemicals, no PPD.",
    image: imgPowder,
    customerReviews: [
      { name: "Megha K.", rating: 5, text: "Best stain I've ever got — dark maroon within hours. My whole studio uses it now.", date: "2026-05-02" },
      ...baseReviews,
    ],
  },
  {
    id: "p2",
    slug: "special-bridal-oil",
    name: "HARSHI'S Special Bridal Oil",
    category: "Mehndi Essentials",
    price: 1300,
    size: "1 Litre",
    rating: 4.8,
    reviews: 96,
    inStock: true,
    stock: 25,
    featured: true,
    description:
      "Professional bridal oil formulated to enhance mehndi stain and longevity. A signature terpene blend that darkens henna beautifully and keeps designs vibrant for days.",
    ingredients: "Eucalyptus, cajeput & lavender essential oil blend.",
    image: imgBridalOil,
    customerReviews: baseReviews,
  },
  {
    id: "p3",
    slug: "bridal-aftercare-oil",
    name: "Bridal Aftercare Oil",
    category: "Mehndi Essentials",
    price: 300,
    size: "100 ml",
    rating: 4.8,
    reviews: 130,
    inStock: true,
    stock: 80,
    bestSeller: true,
    description:
      "Aftercare oil designed to deepen mehndi color and keep designs vibrant. Apply after scraping for a longer-lasting, richer stain.",
    ingredients: "Mustard, eucalyptus & tea tree oil blend.",
    image: imgAftercareOil,
    customerReviews: baseReviews,
  },
  {
    id: "p4",
    slug: "premium-pre-rolled-cones",
    name: "Premium Pre-Rolled Cones",
    category: "Mehndi Essentials",
    price: 300,
    size: "Pack of 100",
    rating: 4.9,
    reviews: 305,
    inStock: true,
    stock: 40,
    badge: "Best Seller",
    bestSeller: true,
    description:
      "Ready-to-fill professional-quality pre-rolled cones with a fine tip for crisp lines. Consistent rolling saves you time at every booking.",
    image: imgCones,
    customerReviews: baseReviews,
  },
  {
    id: "p5",
    slug: "pre-cut-cellophane-sheets",
    name: "Pre-Cut Cellophane Sheets",
    category: "Mehndi Essentials",
    price: 90,
    size: "6 x 5 inches · Pack of 180",
    rating: 4.6,
    reviews: 33,
    inStock: true,
    stock: 120,
    description:
      "Transparent sheets ideal for rolling mehndi cones. Pre-cut to 6 x 5 inches for fast, consistent cone rolling.",
    image: imgCellophane,
    customerReviews: baseReviews,
  },
  {
    id: "p6",
    slug: "mehndi-aftercare-balm",
    name: "Mehndi Aftercare Balm",
    category: "Aftercare Products",
    price: 60,
    size: "8 Grams",
    rating: 4.7,
    reviews: 88,
    inStock: true,
    stock: 150,
    description:
      "Special balm formulated to protect mehndi and improve stain development. Seals in moisture for a deeper, longer-lasting colour.",
    image: imgBalm,
    customerReviews: baseReviews,
  },
  {
    id: "p7",
    slug: "aftercare-combo-pack",
    name: "Aftercare Combo Pack",
    category: "Aftercare Products",
    price: 110,
    rating: 4.9,
    reviews: 72,
    inStock: true,
    stock: 90,
    badge: "Value",
    bestSeller: true,
    description:
      "Complete aftercare solution for long-lasting and darker mehndi stains. Everything you need to care for fresh designs.",
    includes: ["8g Aftercare Balm", "100ml Aftercare Oil"],
    image: imgAftercareCombo,
    customerReviews: baseReviews,
  },
  {
    id: "p8",
    slug: "beginner-artist-kit",
    name: "Beginner Artist Kit",
    category: "Mehndi Kits",
    price: 500,
    rating: 4.8,
    reviews: 110,
    inStock: true,
    stock: 30,
    badge: "Best Seller",
    bestSeller: true,
    featured: true,
    description:
      "Perfect starter kit for new mehndi artists. Everything you need to begin practising and creating beautiful designs.",
    includes: [
      "200g Mehndi Powder",
      "100ml Bridal Oil",
      "35 Cellophane Sheets",
      "2 Piping Bags",
      "5 Pre-Rolled Cones",
      "Cellotape",
    ],
    image: imgBeginnerKit,
    customerReviews: baseReviews,
  },
  {
    id: "p9",
    slug: "mehndi-care-kit",
    name: "Mehndi Care Kit",
    category: "Mehndi Kits",
    price: 350,
    rating: 4.7,
    reviews: 64,
    inStock: true,
    stock: 45,
    featured: true,
    description:
      "Ideal for personal use, festivals, and small events. Ready-to-use cones plus complete aftercare for a flawless finish.",
    includes: ["12 Ready-to-Use Mehndi Cones", "Aftercare Balm", "Aftercare Oil"],
    image: imgCareKit,
    customerReviews: baseReviews,
  },
  {
    id: "p10",
    slug: "small-mixing-spatula",
    name: "Small Mixing Spatula",
    category: "Professional Accessories",
    price: 50,
    rating: 4.5,
    reviews: 38,
    inStock: true,
    stock: 100,
    description: "Handy spatula for mixing mehndi paste smoothly. Compact and durable for everyday use.",
    image: imgSmallSpatula,
    customerReviews: baseReviews,
  },
  {
    id: "p11",
    slug: "large-mixing-spatula",
    name: "Large Mixing Spatula",
    category: "Professional Accessories",
    price: 80,
    rating: 4.6,
    reviews: 44,
    inStock: true,
    stock: 100,
    description: "Durable large spatula for professional mehndi preparation. Mixes bigger batches with ease.",
    image: imgLargeSpatula,
    customerReviews: baseReviews,
  },
  {
    id: "p12",
    slug: "stocking-set",
    name: "Stocking Set",
    category: "Professional Accessories",
    price: 20,
    rating: 4.4,
    reviews: 19,
    inStock: true,
    stock: 200,
    description:
      "Essential stocking set for cone filling and professional mehndi preparation. Sieves paste to a silky, lump-free consistency.",
    image: imgStockingSet,
    customerReviews: baseReviews,
  },
  {
    id: "p13",
    slug: "washable-mehndi-cushion",
    name: "Washable Mehndi Cushion",
    category: "Artist Comfort Products",
    price: 370,
    size: "18 x 12 x 2.5 inches",
    rating: 4.8,
    reviews: 57,
    inStock: true,
    stock: 35,
    badge: "New",
    featured: true,
    description:
      "Comfortable washable cushion designed for long mehndi sessions, providing support for hands and arms. A must-have for bridal bookings.",
    image: imgCushion,
    customerReviews: baseReviews,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

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
