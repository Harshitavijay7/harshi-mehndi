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
import imgPracticeHand from "@/assets/products/practice-hand.jpg";
import imgPracticeLeg from "@/assets/products/practice-leg.jpg";
import imgPins from "@/assets/products/pins.jpg";
import imgPipingBags from "@/assets/products/piping-bags.jpg";

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
  "Mehndi Powder",
  "Mehndi Oil",
  "Cones & Sheets",
  "Aftercare Products",
  "Mehndi Kits",
  "Practice Products",
  "Artist Accessories",
] as const;

const baseReviews: Review[] = [
  { name: "Ananya S.", rating: 5, text: "Excellent quality, exactly as described. Will order again!", date: "2026-04-12" },
  { name: "Priya V.", rating: 5, text: "Loved it. Fast delivery and premium packaging.", date: "2026-03-28" },
  { name: "Riya P.", rating: 4, text: "Very good value for money. Highly recommend.", date: "2026-03-05" },
];

export const products: Product[] = [
  // ===== Mehndi Powder =====
  {
    id: "p1",
    slug: "mehndi-powder-200g",
    name: "HARSHI'S Mehndi Powder — 200g",
    category: "Mehndi Powder",
    price: 100,
    size: "200 g",
    rating: 4.8,
    reviews: 64,
    inStock: true,
    stock: 120,
    description:
      "Premium triple-sifted natural mehndi powder in a handy 200g pack. Smooth texture and rich staining — ideal for personal use and festivals.",
    ingredients: "100% Lawsonia Inermis (henna leaves), no chemicals, no PPD.",
    image: imgPowder,
    customerReviews: baseReviews,
  },
  {
    id: "p2",
    slug: "mehndi-powder-500g",
    name: "HARSHI'S Mehndi Powder — 500g",
    category: "Mehndi Powder",
    price: 220,
    size: "500 g",
    rating: 4.8,
    reviews: 88,
    inStock: true,
    stock: 90,
    description:
      "Premium triple-sifted natural mehndi powder in a 500g pack. Excellent staining properties for regular artists.",
    ingredients: "100% Lawsonia Inermis (henna leaves), no chemicals, no PPD.",
    image: imgPowder,
    customerReviews: baseReviews,
  },
  {
    id: "p3",
    slug: "mehndi-powder-1kg",
    name: "HARSHI'S Mehndi Powder — 1 KG",
    category: "Mehndi Powder",
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
    id: "p4",
    slug: "mehndi-powder-10kg",
    name: "HARSHI'S Mehndi Powder — 10 KG",
    category: "Mehndi Powder",
    price: 3500,
    size: "10 KG",
    rating: 4.9,
    reviews: 32,
    inStock: true,
    stock: 15,
    badge: "Bulk",
    description:
      "Bulk 10kg pack of premium natural mehndi powder for busy studios and wholesalers. Same triple-sifted quality at a wholesale price.",
    ingredients: "100% Lawsonia Inermis (henna leaves), no chemicals, no PPD.",
    image: imgPowder,
    customerReviews: baseReviews,
  },
  {
    id: "p5",
    slug: "mehndi-powder-25kg",
    name: "HARSHI'S Mehndi Powder — 25 KG",
    category: "Mehndi Powder",
    price: 8000,
    size: "25 KG",
    rating: 4.9,
    reviews: 18,
    inStock: true,
    stock: 8,
    badge: "Wholesale",
    description:
      "Wholesale 25kg sack of premium natural mehndi powder. Best value for large-scale professional and reseller requirements.",
    ingredients: "100% Lawsonia Inermis (henna leaves), no chemicals, no PPD.",
    image: imgPowder,
    customerReviews: baseReviews,
  },

  // ===== Mehndi Oil =====
  {
    id: "p6",
    slug: "mehndi-oil-30ml",
    name: "HARSHI'S Mehndi Oil — 30ml",
    category: "Mehndi Oil",
    price: 150,
    size: "30 ml",
    rating: 4.7,
    reviews: 44,
    inStock: true,
    stock: 100,
    description:
      "Compact 30ml mehndi oil to enhance stain and longevity. Signature terpene blend that darkens henna beautifully.",
    ingredients: "Eucalyptus, cajeput & lavender essential oil blend.",
    image: imgBridalOil,
    customerReviews: baseReviews,
  },
  {
    id: "p7",
    slug: "mehndi-oil-50ml",
    name: "HARSHI'S Mehndi Oil — 50ml",
    category: "Mehndi Oil",
    price: 200,
    size: "50 ml",
    rating: 4.7,
    reviews: 52,
    inStock: true,
    stock: 90,
    description:
      "50ml professional mehndi oil to deepen and lengthen the stain. A little goes a long way.",
    ingredients: "Eucalyptus, cajeput & lavender essential oil blend.",
    image: imgBridalOil,
    customerReviews: baseReviews,
  },
  {
    id: "p8",
    slug: "mehndi-oil-100ml",
    name: "HARSHI'S Mehndi Oil — 100ml",
    category: "Mehndi Oil",
    price: 300,
    size: "100 ml",
    rating: 4.8,
    reviews: 96,
    inStock: true,
    stock: 70,
    bestSeller: true,
    description:
      "100ml professional mehndi oil — the most popular size for working artists. Enhances stain and keeps designs vibrant for days.",
    ingredients: "Eucalyptus, cajeput & lavender essential oil blend.",
    image: imgBridalOil,
    customerReviews: baseReviews,
  },
  {
    id: "p9",
    slug: "mehndi-oil-500ml",
    name: "HARSHI'S Mehndi Oil — 500ml",
    category: "Mehndi Oil",
    price: 800,
    size: "500 ml",
    rating: 4.8,
    reviews: 40,
    inStock: true,
    stock: 35,
    description:
      "500ml value pack of premium mehndi oil for studios that go through oil quickly.",
    ingredients: "Eucalyptus, cajeput & lavender essential oil blend.",
    image: imgBridalOil,
    customerReviews: baseReviews,
  },
  {
    id: "p10",
    slug: "mehndi-oil-1-litre",
    name: "HARSHI'S Mehndi Oil — 1 Litre",
    category: "Mehndi Oil",
    price: 1300,
    size: "1 Litre",
    rating: 4.8,
    reviews: 96,
    inStock: true,
    stock: 25,
    featured: true,
    description:
      "Professional 1 litre mehndi oil formulated to enhance mehndi stain and longevity. A signature terpene blend that darkens henna beautifully.",
    ingredients: "Eucalyptus, cajeput & lavender essential oil blend.",
    image: imgBridalOil,
    customerReviews: baseReviews,
  },
  {
    id: "p11",
    slug: "mehndi-oil-35-litre-can",
    name: "HARSHI'S Mehndi Oil — 35 Litre Can",
    category: "Mehndi Oil",
    price: 35000,
    size: "35 Litre Can",
    rating: 4.9,
    reviews: 9,
    inStock: true,
    stock: 5,
    badge: "Wholesale",
    description:
      "Wholesale 35 litre can of premium mehndi oil for distributors and large studios. Maximum value per litre.",
    ingredients: "Eucalyptus, cajeput & lavender essential oil blend.",
    image: imgBridalOil,
    customerReviews: baseReviews,
  },

  // ===== Cones & Sheets =====
  {
    id: "p12",
    slug: "mehndi-cones-pack-4",
    name: "Mehndi Cones — Pack of 4",
    category: "Cones & Sheets",
    price: 60,
    size: "Pack of 4",
    rating: 4.7,
    reviews: 54,
    inStock: true,
    stock: 150,
    description:
      "Ready-to-use natural mehndi cones with a fine tip. Pack of 4 — perfect for personal use and festivals.",
    image: imgCones,
    customerReviews: baseReviews,
  },
  {
    id: "p13",
    slug: "mehndi-cones-pack-8",
    name: "Mehndi Cones — Pack of 8",
    category: "Cones & Sheets",
    price: 110,
    size: "Pack of 8",
    rating: 4.8,
    reviews: 76,
    inStock: true,
    stock: 120,
    badge: "Value",
    description:
      "Ready-to-use natural mehndi cones with a fine tip. Value pack of 8 for events and small gatherings.",
    image: imgCones,
    customerReviews: baseReviews,
  },
  {
    id: "p14",
    slug: "pre-rolled-empty-cones-100",
    name: "100 Pre-Rolled Empty Cones",
    category: "Cones & Sheets",
    price: 300,
    size: "Pack of 100",
    rating: 4.9,
    reviews: 305,
    inStock: true,
    stock: 40,
    badge: "Best Seller",
    bestSeller: true,
    featured: true,
    description:
      "Ready-to-fill professional-quality pre-rolled empty cones with a fine tip for crisp lines. Consistent rolling saves you time at every booking.",
    image: imgCones,
    customerReviews: baseReviews,
  },
  {
    id: "p15",
    slug: "pre-cut-cone-sheets-180",
    name: "180 Pre-Cut Cone Sheets (6×5 inch)",
    category: "Cones & Sheets",
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
    id: "p16",
    slug: "pre-cut-cone-sheets-1350",
    name: "1350 Pre-Cut Cone Sheets (6×5 inch)",
    category: "Cones & Sheets",
    price: 600,
    size: "6 x 5 inches · Pack of 1350",
    rating: 4.7,
    reviews: 26,
    inStock: true,
    stock: 50,
    badge: "Bulk",
    description:
      "Bulk box of 1350 pre-cut transparent cone sheets (6 x 5 inches). Best value for busy studios rolling cones daily.",
    image: imgCellophane,
    customerReviews: baseReviews,
  },

  // ===== Aftercare Products =====
  {
    id: "p17",
    slug: "aftercare-oil",
    name: "Aftercare Oil",
    category: "Aftercare Products",
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
    id: "p18",
    slug: "aftercare-balm",
    name: "Aftercare Balm",
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
    id: "p19",
    slug: "balm-oil-combo",
    name: "Balm + Oil Combo",
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

  // ===== Mehndi Kits =====
  {
    id: "p20",
    slug: "mehndi-kit",
    name: "Mehndi Kit",
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
    id: "p21",
    slug: "mehndi-sample-kit",
    name: "Mehndi Sample Kit",
    category: "Mehndi Kits",
    price: 150,
    rating: 4.6,
    reviews: 38,
    inStock: true,
    stock: 60,
    badge: "Try It",
    description:
      "A compact sample kit to try HARSHI'S quality before buying in bulk — a few cones plus aftercare samples.",
    includes: ["4 Mehndi Cones", "Aftercare Balm sample", "Aftercare Oil sample"],
    image: imgBeginnerKit,
    customerReviews: baseReviews,
  },

  // ===== Practice Products =====
  {
    id: "p22",
    slug: "acrylic-practice-hand",
    name: "Acrylic Practice Hand",
    category: "Practice Products",
    price: 500,
    rating: 4.8,
    reviews: 47,
    inStock: true,
    stock: 30,
    badge: "New",
    featured: true,
    description:
      "Clear acrylic practice hand for perfecting mehndi designs. Realistic shape and smooth surface for repeated practice — wipes clean easily.",
    image: imgPracticeHand,
    customerReviews: baseReviews,
  },
  {
    id: "p23",
    slug: "acrylic-practice-leg",
    name: "Acrylic Practice Leg",
    category: "Practice Products",
    price: 650,
    rating: 4.7,
    reviews: 21,
    inStock: true,
    stock: 25,
    description:
      "Clear acrylic practice leg/foot for mastering bridal foot designs. Smooth, washable surface for endless practice.",
    image: imgPracticeLeg,
    customerReviews: baseReviews,
  },

  // ===== Artist Accessories =====
  {
    id: "p24",
    slug: "pins-0-32mm-10",
    name: "0.32mm Pins (10 pcs)",
    category: "Artist Accessories",
    price: 40,
    size: "Pack of 10",
    rating: 4.5,
    reviews: 29,
    inStock: true,
    stock: 200,
    description:
      "Fine 0.32mm pins to keep cone tips clear and lines crisp. Pack of 10 — an everyday studio essential.",
    image: imgPins,
    customerReviews: baseReviews,
  },
  {
    id: "p25",
    slug: "pins-0-32mm-100",
    name: "0.32mm Pins (100 pcs)",
    category: "Artist Accessories",
    price: 300,
    size: "Pack of 100",
    rating: 4.6,
    reviews: 18,
    inStock: true,
    stock: 80,
    badge: "Value",
    description:
      "Bulk pack of 100 fine 0.32mm pins to keep cone tips clear. Best value for professional artists.",
    image: imgPins,
    customerReviews: baseReviews,
  },
  {
    id: "p26",
    slug: "piping-bags",
    name: "Piping Bags",
    category: "Artist Accessories",
    price: 100,
    rating: 4.6,
    reviews: 34,
    inStock: true,
    stock: 120,
    description:
      "Durable transparent piping bags for filling and applying mehndi paste with control. Reusable and easy to clean.",
    image: imgPipingBags,
    customerReviews: baseReviews,
  },
  {
    id: "p27",
    slug: "stocking",
    name: "Stocking",
    category: "Artist Accessories",
    price: 20,
    rating: 4.4,
    reviews: 19,
    inStock: true,
    stock: 200,
    description:
      "Essential stocking for cone filling and professional mehndi preparation. Sieves paste to a silky, lump-free consistency.",
    image: imgStockingSet,
    customerReviews: baseReviews,
  },
  {
    id: "p28",
    slug: "mehndi-cushion",
    name: "Mehndi Cushion",
    category: "Artist Accessories",
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
  {
    id: "p29",
    slug: "small-mixing-spatula",
    name: "Small Mixing Spatula",
    category: "Artist Accessories",
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
    id: "p30",
    slug: "large-mixing-spatula",
    name: "Large Mixing Spatula",
    category: "Artist Accessories",
    price: 80,
    rating: 4.6,
    reviews: 44,
    inStock: true,
    stock: 100,
    description: "Durable large spatula for professional mehndi preparation. Mixes bigger batches with ease.",
    image: imgLargeSpatula,
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
