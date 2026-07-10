// Maps a product's stored image_key (filename) to the bundled asset URL.
// Keeps product images working while product data is served from the database.
import aftercareCombo from "@/assets/products/aftercare-combo.jpg";
import aftercareOil from "@/assets/products/aftercare-oil.jpg";
import balm from "@/assets/products/balm.jpg";
import beginnerKit from "@/assets/products/beginner-kit.jpg";
import bridalOil from "@/assets/products/bridal-oil.jpg";
import careKit from "@/assets/products/care-kit.jpg";
import cellophane from "@/assets/products/cellophane.jpg";
import cones from "@/assets/products/cones.jpg";
import cushion from "@/assets/products/cushion.jpg";
import largeSpatula from "@/assets/products/large-spatula.jpg";
import mehndiPowder from "@/assets/products/mehndi-powder.jpg";
import pins from "@/assets/products/pins.jpg";
import pipingBags from "@/assets/products/piping-bags.jpg";
import practiceHand from "@/assets/products/practice-hand.jpg";
import practiceLeg from "@/assets/products/practice-leg.jpg";
import smallSpatula from "@/assets/products/small-spatula.jpg";
import stockingSet from "@/assets/products/stocking-set.jpg";

const map: Record<string, string> = {
  "aftercare-combo.jpg": aftercareCombo,
  "aftercare-oil.jpg": aftercareOil,
  "balm.jpg": balm,
  "beginner-kit.jpg": beginnerKit,
  "bridal-oil.jpg": bridalOil,
  "care-kit.jpg": careKit,
  "cellophane.jpg": cellophane,
  "cones.jpg": cones,
  "cushion.jpg": cushion,
  "large-spatula.jpg": largeSpatula,
  "mehndi-powder.jpg": mehndiPowder,
  "pins.jpg": pins,
  "piping-bags.jpg": pipingBags,
  "practice-hand.jpg": practiceHand,
  "practice-leg.jpg": practiceLeg,
  "small-spatula.jpg": smallSpatula,
  "stocking-set.jpg": stockingSet,
};

export const resolveProductImage = (key?: string | null): string => {
  if (!key) return mehndiPowder;
  // Uploaded images are stored as full URLs (signed/public storage links).
  if (/^https?:\/\//i.test(key) || key.startsWith("data:")) return key;
  return map[key] || mehndiPowder;
};
